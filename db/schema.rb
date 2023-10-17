# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.0].define(version: 2023_10_13_115618) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "code_frames", force: :cascade do |t|
    t.string "title"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "code_snippets", force: :cascade do |t|
    t.string "language", null: false
    t.text "content"
    t.string "file_name"
    t.bigint "code_frame_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["code_frame_id"], name: "index_code_snippets_on_code_frame_id"
  end

  add_foreign_key "code_snippets", "code_frames"
end
