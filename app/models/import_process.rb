class ImportProcess < ApplicationRecord
  require 'rgeo/shapefile'
  has_many :import_errors, :dependent => :destroy, :autosave => true
  belongs_to :user
  attr_accessor :file
  delegate :complete_name, :to => :user, :prefix => true, :allow_nil => true

  include Ibiza 

  after_create :load_from_zip

  def load_from_zip
    load_type = self.data_source
    import_process = ImportProcess.find self.id
    import_logger = Ibiza::ImportLogger.new(import_process)
    import_process.update_attributes status: 'working'
    ActiveRecord::Base.transaction do
      shps, dir_path = Util::get_shape_files_from_zip(self.file_path)
      dir = []
      shps.each do |shp|
        begin
          if load_type == 'Project_Fulcrum'
            dir << shp
            if dir.count % 2 == 0
              #parse_shp(dir, load_type, import_logger)
            else
              next
            end
          else
            parse_shp(shp, load_type, import_logger)
          end

          if import_logger.details.any?
            import_logger.inserted = 0
            import_logger.updated = 0
            raise ActiveRecord::Rollback, "Algo horrible sucedio, vamos para atras con todo"
          else
            import_logger.status = 'success'
          end
        rescue Exception => e

          import_logger.details << {:message => "#{e.to_s}\n#{e.backtrace.join("\n")}"} unless e.instance_of?(ActiveRecord::Rollback)
          import_logger.inserted = 0
          import_logger.updated = 0
          raise ActiveRecord::Rollback, "Algo horrible sucedio, vamos para atras con todo"
        end
      end
      FileUtils.rm_rf(dir_path)
      FileUtils.rm_rf(self.file_path)
    end
    import_logger.save
  end

  private

  def parse_shp(shp_file, load_type, import_logger)
    case load_type
    when "Building Regulation"
      parse_building_regulations(shp_file, import_logger)
    when "Transactions"
      parse_transactions(shp_file, import_logger)
    when "Departments"
      parse_projects(shp_file, "Departamentos", import_logger)
    when "Project_Fulcrum"
      parse_projects_fulcrum(shp_file, import_logger)
    when "Homes"
      parse_projects(shp_file, "Casas", import_logger)
    when "Future Projects"
      parse_future_projects(shp_file, import_logger)
    when "Offices"
      parse_office_project(shp_file, "OFFICES_PROJECT_SUB_TYPE", import_logger)
    when "Cellars"
      parse_cellar_project(shp_file, "CELLARS_PROJECT_SUB_TYPE", import_logger)
    when "Strip Centers"
      parse_strip_center_project(shp_file, "STRIP_CENTERS_PROJECT_SUB_TYPE", import_logger)
    when "Lot"
      parse_lots(shp_file, import_logger)
    when "POI"
      parse_pois(shp_file, import_logger)
    when "Counties"
      parse_counties(shp_file, import_logger)
    end

  end

  def parse_building_regulations(shp_file, import_logger)
  
    RGeo::Shapefile::Reader.open(shp_file) do |shp|
      field = []
      shp.each do |shape|
        if shape.index == 0 
        shape.keys.each do |f|
          field.push(f)
        end
        end

      verify_attributes(field, "Building Regulation")
  
        import_logger.current_row_index = shape.index
        import_logger.processed += 1
  
        if shape.geometry.nil?
          import_logger.details << { :row_index => import_logger.current_row_index, :message => I18n.translate(:ERROR_GEOMETRY_MULTIPOLYGON) }
          next
        end

        # unless shape.geometry.is_a? MultiPolygon
        #   import_logger.details << { :row_index => import_logger.current_row_index, :message => I18n.translate(:ERROR_GEOMETRY_MULTIPOLYGON) }
        #   next
        # end

        geom = shape.geometry
        data = shape.attributes

        building = BuildingRegulation.find_or_initialize_by(identifier: data["id"])
        building.new_record? ? import_logger.inserted +=1 : import_logger.updated += 1

        building.save_building_regulation_data(geom, data)
        if building.errors.any?
          building.errors.full_messages.each do |error_message|
            import_logger.details << { :row_index => import_logger.current_row_index, :message => error_message }
          end
        end
      end
    end
    ActiveRecord::Base.connection().execute("UPDATE building_regulations SET the_geom = cleangeometry(the_geom) WHERE NOT ST_isValid(the_geom)")
  end

  def self.parse_transactions(shp_file, import_logger)
    RGeo::Shapefile::Reader.open(shp_file) do |shp|
      field = []
      shp.each do |shape|
        if shape.index == 0 
        shape.keys.each do |f|
          field.push(f)
        end
        end

      verify_attributes(field, "Transactions")
  
        import_logger.current_row_index = shape.index
        import_logger.processed += 1
  
        if shape.geometry.nil?
          import_logger.details << { :row_index => import_logger.current_row_index, :message => I18n.translate(:ERROR_GEOMETRY_MULTIPOLYGON) }
          next
        end

   #     unless shape.geometry.is_a? Point
   #       import_logger.details << { :row_index => import_logger.current_row_index, :message => I18n.translate(:ERROR_GEOMETRY_POINT) }
   #       next
   #     end

        geom = shape.geometry
        data = shape.attributes
        bimester = data["INSCRIPTIO"].to_date.bimester
        year = data["INSCRIPTIO"].to_date.year
        number = data["NUMBER"].to_i

        county = County.find_by_code(data["CODCOM"].to_i.to_s)
        if county.nil?
          import_logger.details << { :row_index => import_logger.current_row_index, :message => "No se pudo encontrar el county con codigo #{data["CODCOM"]}" }
          next
        end

        tran = Transaction.find_or_initialize_by_number_and_bimester_and_year_and_county_id(number, bimester, year, county.id)
        was_new = tran.new_record?

        if tran.save_transaction_data(geom, data, county.id, user.id)
          if was_new
            import_logger.inserted +=1
          else
            import_logger.updated +=1
          end
        else
          import_logger.failed += 1
          tran.errors.full_messages.each do |error_message|
            import_logger.details << { :row_index => import_logger.current_row_index, :message => error_message }
          end
        end
      end
    end
  end

  def self.parse_projects_fulcrum(shape_file, import_logger)

    mixes = []
    instance_mixes = []

    total_units = 0
    stock_units = 0
    sold_units = 0
    @projects = []
    @unidades = []

    shape_file.each do |f|
      if  f.split("/").last.include? "unidades"
        ShpFile.open(f) do |shp| 
          shp.each_with_index do |shape, i|
            @unidades <<  shape.data
          end
        end
      else
        ShpFile.open(f) do |shp| 
          shp.each_with_index do |shape, i|
            @projects << shape
          end
        end
      end
    end

    @projects.each_with_index do |project, i |

      @geom = project.geometry

      import_logger.current_row_index = i + 1
      import_logger.processed += 1
      if project.geometry.nil?
        import_logger.details << { :row_index => import_logger.current_row_index, :message => I18n.translate(:ERROR_GEOMETRY_POINT) }
        next
      end

      unless project.geometry.is_a? Point
        import_logger.details << { :row_index => import_logger.current_row_index, :message => I18n.translate(:ERROR_GEOMETRY_POINT) }
        next
      end

      project_new = Project.find_or_initialize_by_code(project.data["cod_proy"])
      is_new_record = project_new.new_record?
      project_new.save_project_data_fulcrum(project.data,  @geom)
      project_type = project.data['tipo_de_pr']        
      if project_new.errors.any?
        import_logger.failed += 1
        project_new.errors.full_messages.each do |error_message|
          import_logger.details << { :row_index => import_logger.current_row_index, :message => error_message }
        end
        return false
      end

      @unidades.each do |data|
        if data['fulcrum_pa'] == project.data['fulcrum_id']            

          instance = ProjectInstance.find_or_initialize_by_project_id_and_year_and_bimester(project_new.id, data['year'], data['bimester'])
          instance.save_instance_data(project_new.id, project.data['project_st'], data['bimester'], data['year'], data['cadastre'], data['comments'])

          if instance.errors.any?
            import_logger.failed += 1
            instance.errors.full_messages.each do |error_message|
              import_logger.details << { :row_index => import_logger.current_row_index, :message => error_message }
            end
            return false
          end

          unless data["dorms_t"].to_i == 0 or data["banos_t"].to_i == 0
            mix = ProjectMix.find_or_create_by_bedroom_and_bathroom_and_mix_type(data["dorms_t"].to_f, data["banos_t"].round, "#{data["dorms_t"].to_f}d#{data["banos_t"].round}b")
            if mix.nil?
              import_logger.failed += 1
              mix.errors.full_messages.each do |error_message|
                import_logger.details << { :row_index => import_logger.current_row_index, :message => error_message }
              end
              next
            end

            ProjectInstanceMix.delete_all(:project_instance_id => instance.id)

            mix_instance = ProjectInstanceMix.new

            mix_instance.project_instance_id = instance.id
            mix_instance.mix_id = mix.id
            mix_instance.percentage = data['percentage']
            mix_instance.stock_units = data['stock']
            if project_type == "Departamentos"
              mix_instance.mix_usable_square_meters = data["usable_m2"].to_f
              mix_instance.mix_terrace_square_meters = data["terra_m2"].to_f
            else
              mix_instance.mix_m2_field = data["T_M2_TERRE"].to_f
              mix_instance.mix_m2_built = data["T_M2_CONST"].to_f
            end
            if project_type == "Casas"
              case data["TIPO_C"].to_s
              when "A"
                self.home_type = "Aislada"
              when "P"
                self.home_type = "Pareada"
              when "T"
                self.home_type = "Tren"
              when "A-P"
                self.home_type = "Aislada-Pareada"
              end
            end

            mix_instance.living_room = data["living_roo"]
            mix_instance.service_room = data["servicio"]
            mix_instance.h_office = data["h_office"]
            mix_instance.common_expenses = data["gasto_comn"]
            mix_instance.uf_min = data["uf_min"]
            mix_instance.uf_max = data["uf_max"]
            mix_instance.total_units = data["total_unit"]
            mix_instance.t_min = data["terreno_mn"]
            mix_instance.t_max = data["terreno_mx"]
            mix_instance.mix_uf_m2 = data["value_m2"]
            mix_instance.save
          end


          is_new_record ? import_logger.inserted += 1 : import_logger.updated += 1
        end
      end
    end

  end


  def parse_projects(shape_file, project_type, import_logger)
    mixes = []
    instance_mixes = []

    total_units = 0
    stock_units = 0
    sold_units = 0

    @project_type = project_type

    RGeo::Shapefile::Reader.open(shape_file) do |shp|
      field = []
      shp.each do |shape|
        if shape.index == 0 
        shape.keys.each do |f|
          field.push(f)
        end
        end

      verify_attributes(field, project_type)
  
        import_logger.current_row_index = shape.index
        import_logger.processed += 1
  
        if shape.geometry.nil?
          import_logger.details << { :row_index => import_logger.current_row_index, :message => I18n.translate(:ERROR_GEOMETRY_POINT) }
          next
        end
      #  unless shape.geometry.is_a? Point
      #    import_logger.details << { :row_index => import_logger.current_row_index, :message => I18n.translate(:ERROR_GEOMETRY_POINT) }
      #    next
      #  end

        geom = shape.geometry
        #geom.srid = 4326
        data = shape.attributes
        unless data["DORMS_T"].to_i == 0 or data["BANOS_T"].to_i == 0
          mix = ProjectMix.find_or_create_by(bedroom: data["DORMS_T"].to_f,  bathroom: data["BANOS_T"].round, mix_type:"#{data["DORMS_T"].to_f}d#{data["BANOS_T"].round}b")
          if mix.nil?
            import_logger.failed += 1
            mix.errors.full_messages.each do |error_message|
              import_logger.details << { :row_index => import_logger.current_row_index, :message => error_message }
            end
            next
          end

          mix_instance = ProjectInstanceMix.new
          mix_instance.mix_id = mix.id
          mix_instance.stock_units = data["STOCK"].to_i
          #mix_instance.sold_units = data["UN_VEND"].to_i
          mix_instance.mix_uf_m2 = data["T_UF_M2"].to_f
          mix_instance.mix_selling_speed = data["T_VEL_VTA"].to_f
          mix_instance.mix_uf_value = data["T_PRECIO_U"].to_f
          mix_instance.total_units = data["OFERTA_T"].to_i
          mix_instance.stock_units = data["STOCK"].to_i

          if @project_type == "Departamentos"
            mix_instance.mix_usable_square_meters = data["T_M2_UTILE"].to_f
            mix_instance.mix_terrace_square_meters = data["T_M2_TERRA"].to_f
          else
            mix_instance.mix_m2_field = data["T_M2_TERRE"].to_f
            mix_instance.mix_m2_built = data["T_M2_CONST"].to_f
          end

          instance_mixes << mix_instance

          total_units += data["OFERTA_T"].to_i
          stock_units += data["STOCK"].to_i
          sold_units += data["UN_VEND"].to_i
        end

        #if data["FILTRO"] == 1
          

          store_project(geom, data, instance_mixes, total_units, stock_units, sold_units, import_logger)
          mixes.clear
          instance_mixes.clear
          total_units = 0
          stock_units = 0
          sold_units = 0
        #end
      end
    end
  end

  def store_project(geom, data, mixes, total_units, stock_units, sold_units, import_logger)
    project = Project.find_or_initialize_by(code: data["COD_PROY"])
    
    is_new_record = project.new_record?
    project.save_project_data(data, @project_type, geom)
    if project.errors.any?
      import_logger.failed += 1
      project.errors.full_messages.each do |error_message|
        import_logger.details << { :row_index => import_logger.current_row_index, :message => error_message }
      end
      return false
    end

    instance = ProjectInstance.find_or_initialize_by(project_id: project.id, year: data['YEAR'], bimester: data['BIMESTRE'])
    instance.save_instance_data(data, mixes, total_units, stock_units, sold_units, @project_type)

    if instance.errors.any?
      import_logger.failed += 1
      instance.errors.full_messages.each do |error_message|
        import_logger.details << { :row_index => import_logger.current_row_index, :message => error_message }
      end
      return false
    end
    is_new_record ? import_logger.inserted += 1 : import_logger.updated += 1
  end

  def parse_future_projects(shp_file, import_logger)
    RGeo::Shapefile::Reader.open(shp_file) do |shp|
      field = []
      shp.each do |shape|
        if shape.index == 0 
        shape.keys.each do |f|
          field.push(f)
        end
        end

      verify_attributes(field, "Future Projects")
  
        import_logger.current_row_index = shape.index
        import_logger.processed += 1
  
        if shape.geometry.nil?
          import_logger.details << { :row_index => import_logger.current_row_index, :message => I18n.translate(:ERROR_GEOMETRY_POINT) }
          next
        end
      #  unless shape.geometry.is_a? Point
      #    import_logger.details << { :row_index => import_logger.current_row_index, :message => I18n.translate(:ERROR_GEOMETRY_POINT) }
      #    next
      #  end

        geom = shape.geometry
        data = shape.attributes

        bimester = data["bim"]
        year = data["year"]

        future_type = FutureProjectType.find_by(abbrev: data["FUENTE"])

        fut_proj = FutureProject.find_or_initialize_by(address: data["DIRECCION"], future_project_type_id: future_type.id, year: year, bimester: bimester)
        fut_proj.new_record? ? was_new = true : was_new = false

        if fut_proj.save_future_project_data(geom, data, year, bimester, future_type)
          if was_new
            import_logger.inserted += 1
          else
            import_logger.updated += 1
          end
        else
          import_logger.failed += 1
          fut_proj.errors.full_messages.each do |error_message|
            import_logger.details << { :row_index => import_logger.current_row_index, :message => error_message }
          end
        end

      end
    end
  end

  def parse_cellar_project(shp_file, commercial_type, import_logger)
    ShpFile.open(shp_file) do |shp|
      verify_attributes(shp, commercial_type)

      shp.each_with_index do |shape, i|
        import_logger.current_row_index = i + 1
        import_logger.processed += 1

        if shape.geometry.nil?
          import_logger.details << { :row_index => import_logger.current_row_index, :message => I18n.translate(:ERROR_GEOMETRY_POINT) }
          next
        end

        unless shape.geometry.is_a? Point
          import_logger.details << { :row_index => import_logger.current_row_index, :message => I18n.translate(:ERROR_GEOMETRY_POINT) }
          next
        end

        geom = shape.geometry
        geom.srid = 4326

        cellar = CommercialCellar.find_or_initialize_by_code_and_year_and_bimester(shape.data["COD_PROY"], shape.data["YEAR"], shape.data["BIMESTRE"])
        cellar.new_record? ? was_new = true : was_new = false

        if cellar.save_cellar_data(shape.data, geom)
          if was_new
            import_logger.inserted += 1
          else
            import_logger.updated += 1
          end
        else
          import_logger.failed += 1
          fut_proj.errors.full_messages.each do |error_message|
            import_logger.details << { :row_index => import_logger.current_row_index, :message => error_message }
          end
        end
      end
    end
  end

  def parse_office_project(shp_file, commercial_type, import_logger)
    ShpFile.open(shp_file) do |shp|
      verify_attributes(shp, commercial_type)

      shp.each_with_index do |shape, i|
        import_logger.current_row_index = i + 1
        import_logger.processed += 1
        was_new = nil

        if shape.geometry.nil?
          import_logger.details << { :row_index => import_logger.current_row_index, :message => I18n.translate(:ERROR_GEOMETRY_POINT) }
          next
        end

        unless shape.geometry.is_a? Point
          import_logger.details << { :row_index => import_logger.current_row_index, :message => I18n.translate(:ERROR_GEOMETRY_POINT) }
          next
        end

        geom = shape.geometry
        geom.srid = 4326

        office = CommercialOffice.find_or_initialize_by_code_and_year_and_bimester(shape.data["COD_PROY"], shape.data["YEAR"], shape.data["BIMESTRE"])
        office.new_record? ? was_new = true : was_new = false

        if office.save_office_data(shape.data, geom)
          was_new ? import_logger.inserted += 1 : import_logger.updated += 1
        else
          import_logger.failed += 1
          office.errors.full_messages.each do |error_message|
            import_logger.details << { :row_index => import_logger.current_row_index, :message => error_message }
          end
        end
      end
    end
  end

  def parse_strip_center_project(shp_file, commercial_type, import_logger)
    ShpFile.open(shp_file) do |shp|
      verify_attributes(shp, commercial_type)

      was_new = true

      strip_center = nil
      shp.each_with_index do |shape, i|

        import_logger.current_row_index = i + 1
        import_logger.processed += 1

        if shape.geometry.nil?
          import_logger.details << { :row_index => import_logger.current_row_index, :message => I18n.translate(:ERROR_GEOMETRY_POINT) }
          next
        end

        unless shape.geometry.is_a? Point
          import_logger.details << { :row_index => import_logger.current_row_index, :message => I18n.translate(:ERROR_GEOMETRY_POINT) }
          next
        end

        geom = shape.geometry
        geom.srid = 4326
        data = shape.data

        if strip_center.nil?
          strip_center = CommercialStrip.find_or_initialize_by_code_and_year_and_bimester(data["COD_PROY"], data["YEAR"], data["BIMESTRE"])
          strip_center.new_record? ? was_new = true : was_new = false
          Shop.delete_all("commercial_strip_id = #{strip_center.id}") if was_new == false
        end

        shop = Shop.new
        shop.fill_data(data)
        strip_center.shops << shop

        if data["FILTRO"] == 1
          if strip_center.save_strip_center_data(data, geom)
            if was_new
              import_logger.inserted += 1
            else
              import_logger.updated += 1
            end
          else
            import_logger.failed += 1
            fut_proj.errors.full_messages.each do |error_message|
              import_logger.details << { :row_index => import_logger.current_row_index, :message => error_message }
            end
          end
          strip_center = nil
        end
      end
    end
  end

  def parse_lots(shp_file, import_logger)
    ShpFile.open(shp_file) do |shp|
      verify_attributes(shp, "LOTS")

      shp.each_with_index do |shape, i|

        import_logger.current_row_index = i + 1
        import_logger.processed += 1

        if shape.geometry.nil?
          import_logger.details << { :row_index => import_logger.current_row_index, :message => I18n.translate(:ERROR_GEOMETRY_MULTIPOLYGON) }
          next
        end

        unless shape.geometry.is_a? MultiPolygon
          import_logger.details << { :row_index => import_logger.current_row_index, :message => I18n.translate(:ERROR_GEOMETRY_MULTIPOLYGON) }
          next
        end

        geom = shape.geometry
        geom.srid = 4326
        data = shape.data

        county = County.find_by_code(data['ID_COMUNA'].to_s)
        if county.nil?
          import_logger.details << { :row_index => import_logger.current_row_index, :message => "No encuentro la comuna con codigo #{data['ID_COMUNA'].to_s}" }
          next
        end

        lot = Lot.find_or_initialize_by_county_id_and_identifier(county.id, data['ID_PREDIO'].to_s)
        lot.surface = data["SUP_m"]
        lot.the_geom = geom

        if lot.save
          import_logger.inserted += 1
        else
          import_logger.failed += 1
          lot.errors.full_messages.each do |error_message|
            import_logger.details << { :row_index => import_logger.current_row_index, :message => error_message }
          end
        end

      end
    end
  end

  def parse_pois(shp_file, import_logger)
    ic = Iconv.new('UTF-8', 'ISO-8859-1')

    ShpFile.open(shp_file) do |shp|
      shp.each do |shape|

        if shape.geometry.nil?
          import_logger.details << { :row_index => import_logger.current_row_index, :message => I18n.translate(:ERROR_GEOMETRY_POINT) }
          next
        end

        unless shape.geometry.is_a? Point
          import_logger.details << { :row_index => import_logger.current_row_index, :message => I18n.translate(:ERROR_GEOMETRY_POINT) }
          next
        end

        geom = shape.geometry
        geom.srid = 4326
        data = shape.data

        sub_cat = PoiSubcategory.find_or_create_by_name(data["TIPO_POIS"])
        if Poi.create(:name => ic.iconv(data["NOMBRE"]), :poi_subcategory_id => sub_cat.id, :the_geom => geom)
          import_logger.inserted += 1
        else
          import_logger.failed += 1
        end
      end
    end
  end

  def parse_counties(shp_file, import_logger)
    ShpFile.open(shp_file) do |shp|
      shp.each_with_index do |shape, i|

        import_logger.current_row_index = i + 1
        import_logger.processed += 1

        if shape.geometry.nil?
          import_logger.details << { :row_index => import_logger.current_row_index, :message => I18n.translate(:ERROR_GEOMETRY_MULTIPOLYGON) }
          next
        end

        unless shape.geometry.is_a? MultiPolygon
          import_logger.details << { :row_index => import_logger.current_row_index, :message => I18n.translate(:ERROR_GEOMETRY_MULTIPOLYGON) }
          next
        end

        geom = shape.geometry
        data = shape.data

        county = County.find_or_initialize_by_code(data["cod_com"].to_s)
        county.new_record? ? import_logger.inserted +=1 : import_logger.updated += 1
        county.the_geom = geom
        county.save

        if county.errors.any?
          county.errors.full_messages.each do |error_message|
            import_logger.details << { :row_index => import_logger.current_row_index, :message => error_message }
          end
        end
      end
    end
  end


  def verify_attributes(field, load_type)
    attributes = Array.new

    case load_type
    when "Building Regulation"
       attributes << [ "URL", "C" ]
       attributes << [ "Zona", "C" ]
       attributes << [ "Usos", "C" ]
       attributes << [ "Nota", "C" ]
       attributes << [ "IC", "C" ]
       attributes << [ "OS", "C" ]
       attributes << [ "Habha", "N" ]
       attributes << [ "AltMax", "N" ]
       attributes << [ "Agrupamien", "C" ]
      attributes << [ "Estacionam", "C" ]
    attributes << [ "AM_CC", "C" ]
    attributes << [ "FuenteFech", "N" ]
    attributes << [ "COD_COM", "C" ]
    attributes << [ "id", "C" ]

    when "Transactions"
      attributes << [ "PROPERTY_T", "C" ]
      attributes << [ "SELLER_TYP", "C" ]
      attributes << [ "INSCRIPTIO", "D" ]
      attributes << [ "ADDRESS", "C" ]
      attributes << [ "SHEET", "N" ]
      attributes << [ "NUMBER", "N" ]
      attributes << [ "BUYER_NAME", "C" ]
      attributes << [ "DEPARTMENT", "C" ]
      attributes << [ "BLUEPRINT", "C" ]
      attributes << [ "REAL_VALUE", "N" ]
      attributes << [ "CALCULATED", "N" ]
      attributes << [ "SAMPLE_FAC", "N" ]
      attributes << [ "CODCOM", "N" ]
      attributes << [ "BOD", "N" ]
      attributes << [ "EST", "N" ]
      attributes << [ "ROL", "C" ]
      attributes << [ "SELLER_NAM", "C" ]
      attributes << [ "BUYER_RUT", "C" ]
    when "Departamentos"
      attributes << [ "COMUNA", "N" ]
      attributes << [ "INMOBILIAR", "C" ]
      attributes << [ "ESTADO", "C" ]
      attributes << [ "COD_PROY", "C" ]
      attributes << [ "DIRECCION", "C" ]
      attributes << [ "NOMBRE", "C" ]
      attributes << [ "N_PISOS", "N" ]
      attributes << [ "M2_UTILES", "N" ]
      attributes << [ "M2_TERRAZA", "N" ]
      attributes << [ "OFERTA_T", "N" ]
      attributes << [ "STOCK", "N" ]
      attributes << [ "UN_VEND", "N" ]
      attributes << [ "MESES_VTA", "N" ]
      attributes << [ "UF_M2", "N" ]
      attributes << [ "PRECIO_UF", "N" ]
      attributes << [ "VEL_VTA", "N" ]
      attributes << [ "PCTJE_VEND", "N" ]
      attributes << [ "INI_CONST", "C" ]
      attributes << [ "INI_VTAS", "C" ]
      attributes << [ "ENTREGA", "C" ]
      attributes << [ "ESTRENO_P", "C" ]
      attributes << [ "YEAR", "N" ]
      attributes << [ "BIMESTRE", "N" ]
      attributes << [ "DORMS_T", "N"]
      attributes << [ "BANOS_T", "N"]
    when "Casas"
      attributes << [ "COMUNA", "N" ]
      attributes << [ "INMOBILIAR", "C" ]
      attributes << [ "ESTADO", "C" ]
      attributes << [ "COD_PROY", "C" ]
      attributes << [ "DIRECCION", "C" ]
      attributes << [ "NOMBRE", "C" ]
      attributes << [ "TIPO_C", "C" ]
      attributes << [ "M2_TERRENO", "N" ]
      attributes << [ "M2_CONST", "N" ]
      attributes << [ "N_PISOS", "N" ]
      attributes << [ "OFERTA_T", "N" ]
      attributes << [ "STOCK", "N" ]
      attributes << [ "UN_VEND", "N" ]
      attributes << [ "MESES_VTA", "N" ]
      attributes << [ "UF_M2", "N" ]
      attributes << [ "PRECIO_UF", "N" ]
      attributes << [ "VEL_VTA", "N" ]
      attributes << [ "PCTJE_VEND", "N" ]
      attributes << [ "INI_CONST", "C" ]
      attributes << [ "INI_VTAS", "C" ]
      attributes << [ "ENTREGA", "C" ]
      attributes << [ "ESTRENO_P", "C" ]
      attributes << [ "YEAR", "N" ]
      attributes << [ "BIMESTRE", "C" ]
      attributes << [ "DORMS_T", "N"]
      attributes << [ "BANOS_T", "N"]
    when "Future Projects"
      attributes << [ "COD_PROY", "C" ]
      attributes << [ "DIRECCION", "C" ]
      attributes << [ "COD_COM", "N" ]
      attributes << [ "N_ROL", "C" ]
      attributes << [ "N_PE", "N" ]
      attributes << [ "F_PE", "D" ]
      attributes << [ "NOMBRE", "C" ]
      attributes << [ "TIPO", "C" ]
      attributes << [ "PROP", "C" ]
      attributes << [ "REP_LEGAL", "C" ]
      attributes << [ "ARQUITECTO", "C" ]
      attributes << [ "N_PISOS", "N" ]
      attributes << [ "SUBT", "N" ]
      attributes << [ "T_UNID", "N" ]
      attributes << [ "T_EST", "N" ]
      attributes << [ "T_LOC", "N" ]
      attributes << [ "M2_APROB", "N" ]
      attributes << [ "M2_EDIF", "N" ]
      attributes << [ "M2_TERR", "N" ]
      attributes << [ "F_CATASTRO", "D" ]
      attributes << [ "BIM", "C" ]
      attributes << [ "YEAR", "N" ]
      attributes << [ "OBSERVACIO", "C" ]
    when "OFFICES_PROJECT_SUB_TYPE"
      attributes << [ "TIPO", "C" ]
      attributes << [ "COD_PROY", "C" ]
      attributes << [ "NOMBRE", "C" ]
      attributes << [ "DIRECCION", "C" ]
      attributes << [ "INMOB", "C" ]
      attributes << [ "P_S_N_I_PB", "N" ]
      attributes << [ "SUBT", "N" ]
      attributes << [ "CLASE", "C" ]
      attributes << [ "OFICINAS_P", "N" ]
      attributes << [ "COMERCIO_P", "N" ]
      attributes << [ "RESIDENT_P", "N" ]
      attributes << [ "EQUIPAM_P", "N" ]
      attributes << [ "MECANICO_P", "N" ]
      attributes << [ "EST_P", "N" ]
      attributes << [ "OFICINAS_U", "N" ]
      attributes << [ "LOCCOM_U", "N" ]
      attributes << [ "BODEGAS_U", "N" ]
      attributes << [ "EST_U", "N" ]
      attributes << [ "ASCENS_U", "N" ]
      attributes << [ "OFICINAS_M", "N" ]
      attributes << [ "COMERCIO_M", "N" ]
      attributes << [ "EQUIPAM_M", "N" ]
      attributes << [ "EST_M", "N" ]
      attributes << [ "MAQUINAS_M", "N" ]
      attributes << [ "OTRO_M", "N" ]
      attributes << [ "M2_E_TOT", "N" ]
      attributes << [ "M2_T_TOT", "N" ]
      attributes << [ "SUP_OF_MIN", "N" ]
      attributes << [ "SUP_OF_MAX", "N" ]
      attributes << [ "SUPPROMM2", "N" ]
      attributes << [ "T_UN_OF_V", "N" ]
      attributes << [ "TUN_OF_D_V", "N" ]
      attributes << [ "T_UN_OF_VE", "N" ]
      attributes << [ "vufm2_minv", "N" ]
      attributes << [ "vufm2_maxv", "N" ]
      attributes << [ "P_UFM2_V", "N" ]
      attributes << [ "PPTST_DISV", "N" ]
      attributes << [ "MES_VENT", "N" ]
      attributes << [ "S_T_OF_V", "N" ]
      attributes << [ "S_D_OF_V", "N" ]
      attributes << [ "SUP_V_OF", "N" ]
      attributes << [ "SUPVMHOF", "N" ]
      attributes << [ "PABTH_STOV", "N" ]
      attributes << [ "PPTAMH_STO", "N" ]
      attributes << [ "T_UN_OF_A", "N" ]
      attributes << [ "TUN_OF_D_A", "N" ]
      attributes << [ "T_UN_OF_AR", "N" ]
      attributes << [ "vufm2_mina", "N" ]
      attributes << [ "vufm2_maxa", "N" ]
      attributes << [ "P_UFM2_A", "N" ]
      attributes << [ "PPTST_DISA", "N" ]
      attributes << [ "MES_ARR", "N" ]
      attributes << [ "S_T_OF_A", "N" ]
      attributes << [ "S_D_OF_A", "N" ]
      attributes << [ "SUP_A_OF", "N" ]
      attributes << [ "SUPAMHOF", "N" ]
      attributes << [ "SUPOTHOF", "N" ]
      attributes << [ "PPT0MH_STO", "N" ]
      attributes << [ "ESTADO", "C" ]
      attributes << [ "IN_CONST", "C" ]
      attributes << [ "IN_VENT", "C" ]
      attributes << [ "IN_ARR", "C" ]
      attributes << [ "E_IN_D_ES_", "C" ]
      attributes << [ "F_CAT_PROY", "C" ]
      attributes << [ "BIMESTRE", "N" ]
      attributes << [ "YEAR", "N" ]
    when "CELLARS_PROJECT_SUB_TYPE"
      attributes << [ "COD_PROY", "C" ]
      attributes << [ "NOMBRE", "C" ]
      attributes << [ "PROPIET_", "C" ]
      attributes << [ "DIRECCION", "C" ]
      attributes << [ "LOTEO", "C" ]
      attributes << [ "SUP_T_OF_C", "N" ]
      attributes << [ "S_T_B_C_AR", "N" ]
      attributes << [ "S_T_B_D_AR", "N" ]
      attributes << [ "UF_M2_ARR", "N" ]
      attributes << [ "VALOR_G_C", "N" ]
      attributes << [ "VAC_B", "N" ]
      attributes << [ "S_MIN_ARR", "N" ]
      attributes << [ "S_MAX_ARR", "N" ]
      attributes << [ "ALT_HOMB", "N" ]
      attributes << [ "ALT_CUMB", "N" ]
      attributes << [ "COD_COMUNA", "C" ]
      attributes << [ "TIPO_B", "C" ]
      attributes << [ "ZONA", "C" ]
      attributes << [ "OPERADOR", "C" ]
      attributes << [ "MAT_MUROS", "C" ]
      attributes << [ "MAT_MUROS", "C" ]
      attributes << [ "MAT_PISO", "C" ]
      attributes << [ "MAT_TECHOS", "C" ]
      attributes << [ "SIST_D_S", "C" ]
      attributes << [ "AND_O_MULL", "C" ]
      attributes << [ "F_CAT_PROY", "C" ]
      attributes << [ "YEAR", "N" ]
      attributes << [ "BIMESTRE", "C" ]
    when "STRIP_CENTERS_PROJECT_SUB_TYPE"
      attributes << [ "COD_PROY", "C" ]
      attributes << [ "NOMBRE", "C" ]
      attributes << [ "DIRECCION", "C" ]
      attributes << [ "COD_COMUNA", "N" ]
      attributes << [ "OPERADOR", "C" ]
      attributes << [ "EMPLAZAM", "C" ]
      attributes << [ "N_PISOS", "N" ]
      attributes << [ "SUP_T", "N" ]
      attributes << [ "SUP_T_DISP", "N" ]
      attributes << [ "PTVAC_MOD", "N" ]
      attributes << [ "N_T_LOC", "N" ]
      attributes << [ "CANT_T_M", "N" ]
      attributes << [ "N_T_EST", "N" ]
      attributes << [ "N_LOC_D_V", "N" ]
      attributes << [ "VAL_UF_ARR", "N" ]
      attributes << [ "UFM2_ARR", "N" ]
      attributes << [ "F_EN_PROY", "C" ]
      attributes << [ "F_CAT_PROY", "C" ]
      attributes << [ "TIPO_LOC", "C" ]
      attributes << [ "R_LOC", "C" ]
      attributes << [ "CANT_LOC_R", "N" ]
      attributes << [ "NOMB_LOC", "C" ]
      attributes << [ "PTOC_LOC_R", "N" ]
      attributes << [ "SUPTLOC_O", "N" ]
      attributes << [ "YEAR", "N" ]
      attributes << [ "BIMESTRE", "C" ]
    when "LOTS"
      attributes << [ "ID_COMUNA", "N" ]
      attributes << [ "SUP_M", "N" ]
    end

    
      attributes.each do |attr|
      finded = false
      value = field.include? attr[0]
      p value
      if value
        finded = true 
      end
      raise I18n.translate(:ERROR_STRUCTURE_FILE) + " " + attr[0] unless finded
      end
    end
  end