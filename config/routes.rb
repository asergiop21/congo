Rails.application.routes.draw do
  resources :layer_types
  get 'dashboards/index'
  devise_for :users
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  root 'dashboards#index'
end
