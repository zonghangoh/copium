class CodeFrame < ApplicationRecord
  has_many :code_snippets

  attribute :title
  attribute :description

  enum status: [ :draft, :published ]
end
