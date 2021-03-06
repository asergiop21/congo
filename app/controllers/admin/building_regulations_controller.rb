class Admin::BuildingRegulationsController < Admin::DashboardsController
  before_action :set_building_regulation, only: [:show, :edit, :update, :destroy]
  layout 'admin'
  def index
    @building_regulations = BuildingRegulation.all.paginate(page: params[:page])
  end

  def show
  end

  # GET /building_regulations/new
  def new
    @building_regulation = BuildingRegulation.new
  end

  # GET /building_regulations/1/edit
  def edit
  end

  # POST /building_regulations
  # POST /building_regulations.json
  def create
    @building_regulation = BuildingRegulation.new(building_regulation_params)

    respond_to do |format|
      if @building_regulation.save
        format.html { redirect_to admin_building_regulations_path(), notice: 'Building regulation was successfully created.' }
        format.json { render :show, status: :created, location: @building_regulation }
      else
        format.html { render :new }
        format.json { render json: @building_regulation.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /building_regulations/1
  # PATCH/PUT /building_regulations/1.json
  def update
    respond_to do |format|
      if @building_regulation.update(building_regulation_params)
        format.html { redirect_to admin_building_regulations_path(), notice: 'Building regulation was successfully updated.' }
        format.json { render :show, status: :ok, location: @building_regulation }
      else
        format.html { render :edit }
        format.json { render json: @building_regulation.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /building_regulations/1
  # DELETE /building_regulations/1.json
  def destroy
    @building_regulation.destroy
    respond_to do |format|
      format.html { redirect_to admin_building_regulations_url, notice: 'Building regulation was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
  # Use callbacks to share common setup or constraints between actions.
  def set_building_regulation
    @building_regulation = BuildingRegulation.find(params[:id])
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  def building_regulation_params
    params.require(:building_regulation).permit(:building_zone, :construct, :land_ocupation, :site, :the_geom, :identifier, :density_type_id, :county_id, :comments, :hectarea_inhabitants, :grouping, :parkings, :am_cc, :aminciti, :icinciti, :osinciti, :freezed, :freezed_observations)
  end
end
