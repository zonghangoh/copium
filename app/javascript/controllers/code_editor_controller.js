import { Controller } from "@hotwired/stimulus"
import { EditorView, basicSetup } from "codemirror"
import { javascript } from "@codemirror/lang-javascript"
import { html } from "@codemirror/lang-html"
import { css } from "@codemirror/lang-css"
import { dracula } from 'thememirror';
import { keymap } from "@codemirror/view"
import { indentWithTab } from "@codemirror/commands"

// Connects to data-controller="code-editor"
export default class extends Controller {
    static targets = ["editor", "modal", "languageToggle"]
    static values = {
        activeKlass: String,
        inactiveKlass: String
    }

    connect() {
        console.log("Code editor connected");
        this.element[this.identifier] = this;

        this.setUpEditors();
        this.setUpLanguageToggles();
        this.setUpSaveCallback();
    }

    saveFrame(e) {
        e.preventDefault();

        const form = e.target;
        const formData = new FormData(form);

        const codeSnippets = this.editorTargets.map((editorTarget) => {
            let language = editorTarget.dataset.language;
            let id = editorTarget.dataset.snippetId;
            let content = this.editors[language].state.doc.toString();
            return { id, language, content };
        })

        formData.append('code_snippets', JSON.stringify(codeSnippets));

        fetch(form.action, {
            method: form.method,
            body: formData,
            headers: { 'Accept': 'application/json' }
        })
            .then(response=>response.json())
            .then(result => {
                if (result.redirected) {
                    window.location.href = result.url;
                } else {
                }
            })
            .catch(error => {
            });
    }

    closeModal = (e) => {
        if (!e.key || e.key === "Escape") {
            e.preventDefault();
            this.modalTarget.classList.add("hidden")
            window.removeEventListener("keydown", this.closeModal);
        }
    }

    triggerControlPanelModal(e) {
        const isHidden = Array.from(this.modalTarget.classList).includes("hidden");

        if (isHidden) {
            window.addEventListener("keydown", this.closeModal);
            this.modalTarget.classList.remove("hidden");
            this.modalTarget.querySelector("input[type=\"text\"]").focus();
        }
    }

    setUpEditors() {
        this.editors = {};
        this.editorTargets.forEach((editorTarget) => {
            let languageExtension, doc;
            let language = editorTarget.dataset.language;
            const originalContent = editorTarget.querySelector("textarea").value.trim();
            editorTarget.innerHTML = "";

            if (language === "javascript") {
                languageExtension = javascript();
                doc = originalContent || ("document\n" +
                    "  .querySelector(\"#clickity-click\")\n" +
                    "  .addEventListener(\"click\", (e)=>{\n" +
                    "    window.alert(\"BAZINGA\")\n" +
                    "  })");
            } else if (language === "html") {
                languageExtension = html();
                doc = originalContent || ("<div>\n" +
                    "  Hello World <br> \n" +
                    "  <button id=\"clickity-click\">\n" +
                    "    Click Me\n" +
                    "  </button>\n" +
                    "</div>\n");
            } else if (language === "css") {
                languageExtension = css();
                doc = originalContent || ("body {\n" +
                    "  background-color: #E1EBEE;\n" +
                    "  color: black;\n" +
                    "  font-family: \"Fira Code\", monospace;\n" +
                    "  font-size: 1em;\n" +
                    "  font-weight: 400;\n" +
                    "  line-height: 1.5;\n" +
                    "  text-align: left;\n" +
                    "  text-rendering: optimizeLegibility;\n" +
                    "}\n");
            } else {
                return;
            }

            this.editors[language] = new EditorView({
                doc,
                extensions: [basicSetup, languageExtension, dracula, keymap.of([indentWithTab])],
                parent: editorTarget,
            })
        });
    }

    setUpSaveCallback() {
        let frameElement = document.querySelector("iframe")
        this.doc = frameElement.contentDocument;
        this.doc.write(`<style>${this.editors.css.state.doc.toString()}</style>`)
        this.doc.write(this.editors.html.state.doc.toString())
        this.doc.write(`<script>${this.editors.javascript.state.doc.toString()}</script>`)

        window.addEventListener("keydown", (e) => {
            if (e.metaKey && e.key === "s") {
                e.preventDefault();

                console.log("Saving...");
                this.doc.body.innerHTML = "";
                this.doc.write(`<style>${this.editors.css.state.doc.toString()}</style>`)
                this.doc.write(this.editors.html.state.doc.toString())
                this.doc.write(`<script>${this.editors.javascript.state.doc.toString()}</script>`)
                // this.doc.body.innerHTML = this.editor.state.doc.toString();
            } else if (e.metaKey && e.key === "Enter") {
                this.triggerControlPanelModal();
            }
        });
    }

    setUpLanguageToggles() {
        this.languageToggleTargets.forEach((languageToggle) => {
            languageToggle.addEventListener("click", (e) => {
                e.preventDefault();
                this.languageToggleTargets.forEach(toggle => {
                    if (toggle === languageToggle) {
                        toggle.classList.remove(...this.inactiveKlassValue.split(" "));
                        toggle.classList.add(...this.activeKlassValue.split(" "));
                    } else {
                        toggle.classList.remove(...this.activeKlassValue.split(" "));
                        toggle.classList.add(...this.inactiveKlassValue.split(" "));
                    }
                });
                let language = languageToggle.dataset.language;
                this.editorTargets.forEach((editorTarget) => {
                    if (editorTarget.dataset.language === language) {
                        editorTarget.classList.remove("hidden");
                    } else {
                        editorTarget.classList.add("hidden");
                    }
                });
            });
        });
    }
}
