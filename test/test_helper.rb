ENV['RAILS_ENV'] ||= 'test'
require_relative '../config/environment'
require 'rails/test_help'

class ActiveSupport::TestCase
  # Setup all fixtures in test/fixtures/*.yml for all tests in alphabetical order.
  fixtures :all

  include Devise::Test::IntegrationHelpers
  include Warden::Test::Helpers

  def log_in user: users(:user_admin)
    sign_in(user)
  end

  def assert_error model, attribute, type, options = {}
    error = model.errors.generate_message attribute, type, options

    assert_includes model.errors[attribute], error
  end
end
