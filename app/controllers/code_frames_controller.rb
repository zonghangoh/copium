class CodeFramesController < ApplicationController
  def index
    @code_frames = CodeFrame.all
  end

  def new
    @code_frame = CodeFrame.find_or_create_by(status: "draft")
    if @code_frame.code_snippets.empty?
      @code_frame.code_snippets.build(language: "html", content: "")
      @code_frame.code_snippets.build(language: "css", content: "")
      @code_frame.code_snippets.build(language: "javascript", content: "")
      @code_frame.code_snippets.map(&:save)
    end
  end

  def show
    @code_frame = CodeFrame.find(params[:id])
  end

  def update
    @code_frame = CodeFrame.update(params[:id], code_frame_params.merge(status: "published"))

    code_snippets_json = JSON.parse(params[:code_snippets])
    code_snippets_json.each do |code_snippet_json|
      CodeSnippet.update(code_snippet_json["id"], code_snippet_json)
    end

    respond_to do |format|
      format.json do
        if @code_frame.save
          render json: {
            redirected: true,
            url: code_frame_url(@code_frame)
          }
        else
          render json: @code_frame.errors, status: :unprocessable_entity
        end
      end
    end
  end

  private

  def code_frame_params
    params.require(:code_frame).permit(:title, :description)
  end
end
