Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  root "pages#index"

  resources :code_frames, path: :frames do
    resources :code_snippets, only: [:create]
  end

  resources :code_snippets, only: [:show, :update, :destroy]
end
