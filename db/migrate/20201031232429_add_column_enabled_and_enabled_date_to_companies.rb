class AddColumnEnabledAndEnabledDateToCompanies < ActiveRecord::Migration[5.2]
  def change
    add_column :companies, :enabled, :boolean, default: :false
    add_column :companies, :enabled_date, :date
  end
end
