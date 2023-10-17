class CreateCodeSnippet < ActiveRecord::Migration[7.0]
  def change
    create_table :code_snippets do |t|
      t.string :language, null: false
      t.text :content
      t.string :file_name

      t.references :code_frame, null: false, foreign_key: true

      t.timestamps
    end
  end
end
