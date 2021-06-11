class Flex::DashboardsController < ApplicationController

  layout 'flex'

  def index
  end

  def search_data_for_filters

    polygon = params[:polygon]
    property_type_id = []
    inscription_date = []
    seller_type_id = []
    total_surface_building = []
    total_surface_terrain = []
    calculated_value = []
    uf_m2_u = []
    osinciti = []
    aminciti = []
    density_type_id = []

    data = Transaction
      .select("
        transactions.property_type_id,
        transactions.inscription_date,
        transactions.seller_type_id,
        transactions.total_surface_building,
        transactions.total_surface_terrain,
        transactions.calculated_value,
        transactions.uf_m2_u,
        building_regulations.osinciti,
        building_regulations.aminciti,
        building_regulations.density_type_id
      ")
      .joins("JOIN building_regulations ON (ST_Contains(building_regulations.the_geom, transactions.the_geom))")
      .where("ST_Contains(ST_SetSRID(ST_GeomFromGeoJSON('{\"type\":\"Polygon\", \"coordinates\": #{polygon}}'), 4326), transactions.the_geom)")
      .where("ST_Intersects(ST_SetSRID(ST_GeomFromGeoJSON('{\"type\":\"Polygon\", \"coordinates\": #{polygon}}'), 4326), building_regulations.the_geom)")
      .order(id: :desc)
      .limit(500)

    data.each do |tr|
      property_type_id << tr.property_type_id unless property_type_id.include? tr.property_type_id
      inscription_date << tr.inscription_date unless inscription_date.include? tr.inscription_date
      seller_type_id << tr.seller_type_id unless seller_type_id.include? tr.seller_type_id
      total_surface_building << tr.total_surface_building.to_f unless total_surface_building.include? tr.total_surface_building
      total_surface_terrain << tr.total_surface_terrain.to_f unless total_surface_terrain.include? tr.total_surface_terrain
      calculated_value << tr.calculated_value.to_f unless calculated_value.include? tr.calculated_value
      uf_m2_u << tr.uf_m2_u.to_f unless uf_m2_u.include? tr.uf_m2_u
      osinciti << tr.osinciti.to_f unless osinciti.include? tr.osinciti
      aminciti << tr.aminciti.to_f unless aminciti.include? tr.aminciti
      density_type_id << tr.density_type_id unless density_type_id.include? tr.density_type_id
    end

    project_types = ProjectType.where(:id => property_type_id).map { |prop| [prop.name, prop.id] }
    seller_types = SellerType.where(:id => seller_type_id).map { |seller| [seller.name, seller.id] }
    density_types = DensityType.where(:id => density_type_id).map { |density| [density.name, density.id] }

    result = {
      'property_types': project_types,
      'inscription_dates': {
        'from': inscription_date.min,
        'to': inscription_date.max
      },
      'seller_types': seller_types,
      'land_use': {
        'from': osinciti.min,
        'to': osinciti.max
      },
      'max_height': {
        'from': aminciti.min,
        'to': aminciti.max
      },
      'density_types': density_types,
      'building_surfaces': {
        'from': total_surface_building.min,
        'to': total_surface_building.max
      },
      'terrain_surfaces': {
        'from': total_surface_terrain.min,
        'to': total_surface_terrain.max
      },
      'prices': {
        'from': calculated_value.min,
        'to': calculated_value.max
      },
      'unit_prices': {
        'from': uf_m2_u.min,
        'to': uf_m2_u.max
      }
    }
    render json: result
  end

  def search_data_for_table

    property_types = params[:property_types]
    seller_types = params[:seller_types]
    inscription_dates = params[:inscription_dates]
    land_use = params[:land_use]
    max_height = params[:max_height]
    density_types = params[:density_types]
    building_surfaces = params[:building_surfaces]
    terrain_surfaces = params[:terrain_surfaces]
    prices = params[:prices]
    unit_prices = params[:unit_prices]

    @data = Transaction
      .select("
        transactions.id,
        transactions.property_type_id,
        transactions.inscription_date,
        transactions.address,
        transactions.county_id,
        transactions.seller_type_id,
        transactions.total_surface_building AS building_surface,
        transactions.total_surface_terrain AS terrain_surface,
        transactions.parkingi AS parking_lot,
        transactions.cellar,
        transactions.calculated_value AS price
      ")
      .joins("JOIN building_regulations ON (ST_Contains(building_regulations.the_geom, transactions.the_geom))")
      .where("ST_Contains(ST_SetSRID(ST_GeomFromGeoJSON('{\"type\":\"Polygon\", \"coordinates\":[[[\"-70.74010848999025\", \"-33.43007977475543\"], [\"-70.74010848999025\", \"-33.46796263238644\"], [\"-70.67994117736818\", \"-33.44461900927522\"], [\"-70.74010848999025\", \"-33.43007977475543\"]]]}'), 4326), transactions.the_geom)")
      .where("ST_Intersects(ST_SetSRID(ST_GeomFromGeoJSON('{\"type\":\"Polygon\", \"coordinates\":[[[\"-70.74010848999025\", \"-33.43007977475543\"], [\"-70.74010848999025\", \"-33.46796263238644\"], [\"-70.67994117736818\", \"-33.44461900927522\"], [\"-70.74010848999025\", \"-33.43007977475543\"]]]}'), 4326), building_regulations.the_geom)")
      .order(id: :desc)
      .limit(500)

    @data = @data.where(:property_type_id => property_types) unless property_types.nil?
    @data = @data.where('inscription_date BETWEEN ? AND ?', inscription_dates[:from], inscription_dates[:to]) unless inscription_dates.nil?
    @data = @data.where(:seller_type_id => seller_types) unless seller_types.nil?
    @data = @data.where('building_regulations.osinciti BETWEEN ? AND ?', land_use[:from], land_use[:to]) unless land_use.nil?
    @data = @data.where('building_regulations.aminciti BETWEEN ? AND ?', max_height[:from], max_height[:to]) unless max_height.nil?
    @data = @data.where(building_regulations: {:density_type_id => density_types}) unless density_types.nil?
    @data = @data.where('transactions.total_surface_building BETWEEN ? AND ?', building_surfaces[:from], building_surfaces[:to]) unless building_surfaces.nil?
    @data = @data.where('transactions.total_surface_building BETWEEN ? AND ?', building_surfaces[:from], building_surfaces[:to]) unless building_surfaces.nil?
    @data = @data.where('transactions.total_surface_terrain BETWEEN ? AND ?', terrain_surfaces[:from], terrain_surfaces[:to]) unless terrain_surfaces.nil?
    @data = @data.where('transactions.calculated_value BETWEEN ? AND ?', prices[:from], prices[:to]) unless prices.nil?
    @data = @data.where('transactions.uf_m2_u BETWEEN ? AND ?', unit_prices[:from], unit_prices[:to]) unless unit_prices.nil?

    render :json => @data

  end

  def search_data_for_charts

    transactions = params[:transactions]
    data = []
    result = []
    data = Transaction.where(:id => transactions)


    # Cantidad

    quantity = data
      .select("CONCAT(bimester,'/',year) as name, COUNT(*)")
      .group("CONCAT(bimester,'/',year)")
      .order("CONCAT(bimester,'/',year)")

    quantity = quantity.as_json(:except => :id)
    result.push({"title": "Cantidad", "series": [{"data": quantity}] })


    # Superficie Útil

    building_surface = data
      .select("CONCAT(bimester,'/',year) as name, AVG(total_surface_building) as count")
      .group("CONCAT(bimester,'/',year)")
      .order("CONCAT(bimester,'/',year)")

    building_surface = building_surface.as_json(:except => :id)
    result.push({"title": "Superficie Útil", "series": [{"data": building_surface}] })


    # Precio

    price = data
      .select("CONCAT(bimester,'/',year) as name, AVG(calculated_value) as count")
      .group("CONCAT(bimester,'/',year)")
      .order("CONCAT(bimester,'/',year)")

    price = price.as_json(:except => :id)
    result.push({"title": "Precio", "series": [{"data": price}] })


    # Precio Unitario

    unit_price = data
      .select("CONCAT(bimester,'/',year) as name, AVG(uf_m2_u) as count")
      .group("CONCAT(bimester,'/',year)")
      .order("CONCAT(bimester,'/',year)")

    unit_price = unit_price.as_json(:except => :id)
    result.push({"title": "Precio Unitario", "series": [{"data": unit_price}] })


    # Volúmen Mercado

    market_volume = data
      .select("CONCAT(bimester,'/',year) as name, (AVG(calculated_value) * COUNT(*)) as count")
      .group("CONCAT(bimester,'/',year)")
      .order("CONCAT(bimester,'/',year)")

    market_volume = market_volume.as_json(:except => :id)
    result.push({"title": "Volúmen Mercado", "series": [{"data": market_volume}] })

    render :json => result

  end

end
