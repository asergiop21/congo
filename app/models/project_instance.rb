class ProjectInstance < ApplicationRecord
  belongs_to :project
  belongs_to :project_status
end
