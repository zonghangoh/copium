class CreateCodeFrame < ActiveRecord::Migration[7.0]
  def change
    create_table :code_frames, id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
      t.string :title
      t.string :description
      t.string :status

      t.timestamps
    end
  end
end
