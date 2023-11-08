import { Controller } from "@hotwired/stimulus"
import {EditorView, basicSetup} from "codemirror"
import { javascript } from "@codemirror/lang-javascript"
import { html } from "@codemirror/lang-html"
import { css } from "@codemirror/lang-css"
import { dracula } from 'thememirror';

// Connects to data-controller="code-editor"
export default class extends Controller {

    connect() {
    }

    save(event) {
        document.querySelector('#code-editor')['code-editor'].triggerControlPanelModal(event)
    }
}
