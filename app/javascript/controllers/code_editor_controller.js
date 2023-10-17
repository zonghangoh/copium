import { Controller } from "@hotwired/stimulus"
import {EditorView, basicSetup} from "codemirror"
import { javascript } from "@codemirror/lang-javascript"
import { html } from "@codemirror/lang-html"
import { css } from "@codemirror/lang-css"
import { dracula } from 'thememirror';

// Connects to data-controller="code-editor"
export default class extends Controller {
    static targets = ["editor", "languageToggle"]

  connect() {
    console.log("Code editor connected");

    this.setUpEditors();
    this.setUpLanguageToggles();
    this.setUpSaveCallback();
  }

  setUpEditors() {
    this.editors = {};
    this.editorTargets.forEach((editorTarget) => {
        let languageExtension, doc;
        let language = editorTarget.dataset.language;
        if (language === "javascript") {
            languageExtension = javascript();
            doc = "document\n" +
                "  .querySelector(\"#clickity-click\")\n" +
                "  .addEventListener(\"click\", (e)=>{\n" +
                "    window.alert(\"BAZINGA\")\n" +
                "  })";
        } else if (language === "html") {
            languageExtension = html();
            doc ="<div>\n" +
                "  Hello World <br> \n" +
                "  <button id=\"clickity-click\">\n" +
                "    Click Me\n" +
                "  </button>\n" +
                "</div>\n";
        } else if (language === "css") {
            languageExtension = css();
            doc = "body {\n" +
                "  background-color: lightblue;\n" +
                "  color: black;\n" +
                "  font-family: \"Fira Code\", monospace;\n" +
                "  font-size: 1em;\n" +
                "  font-weight: 400;\n" +
                "  line-height: 1.5;\n" +
                "  text-align: left;\n" +
                "  text-rendering: optimizeLegibility;\n" +
                "}\n";
        } else {
            return;
        }

        this.editors[language] = new EditorView({
            doc,
            extensions: [basicSetup, languageExtension, dracula],
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

    window.addEventListener("keydown", (e)=>{
        if (e.metaKey && e.key === "s") {
            e.preventDefault();

            console.log("Saving...");
            this.doc.body.innerHTML = "";
            this.doc.write(`<style>${this.editors.css.state.doc.toString()}</style>`)
            this.doc.write(this.editors.html.state.doc.toString())
            this.doc.write(`<script>${this.editors.javascript.state.doc.toString()}</script>`)
            // this.doc.body.innerHTML = this.editor.state.doc.toString();
        }
    });
  }

  setUpLanguageToggles() {
    this.languageToggleTargets.forEach((languageToggle) => {
        languageToggle.addEventListener("click", (e) => {
            e.preventDefault();
            this.languageToggleTargets.forEach(toggle=>{
               if (toggle === languageToggle) {
                 toggle.classList.add("bg-[#2e2f3f]");
                 toggle.classList.remove("bg-slate-950", "hover:bg-slate-800");
               } else {
                 toggle.classList.remove("bg-[#2e2f3f]");
                 toggle.classList.add("bg-slate-950", "hover:bg-slate-800");
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
