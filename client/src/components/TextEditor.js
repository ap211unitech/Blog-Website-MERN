import React, { Component } from 'react';
import { convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import '../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

class EditorConvertToHTML extends Component {
    constructor(props) {
        super(props);
    }


    onEditorStateChange = (editorState) => {
        this.props.setContent(
            editorState
        );
    };

    render() {
        // const { content } = this.state;
        return (
            <div style={{ maxWidth: 1000, fontSize: 18 }} >
                <Editor
                    editorState={this.props.content}
                    wrapperClassName="demo-wrapper"
                    editorClassName="demo-editor"
                    onEditorStateChange={this.onEditorStateChange}
                />
                {/* <textarea
                    disabled
                    value={draftToHtml(convertToRaw(this.props.content.getCurrentContent()))}
                /> */}
            </div>
        );
    }
}

export default EditorConvertToHTML