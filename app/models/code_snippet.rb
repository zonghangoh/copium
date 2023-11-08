class CodeSnippet < ApplicationRecord
  LANGUAGES = %w(ruby html css javascript markdown)

  belongs_to :code_frame

  attribute :file_name
  attribute :content

  validates :language, inclusion: { in: LANGUAGES }
end
