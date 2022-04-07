import React, { Component, Fragment } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import { toast } from 'react-toastify';
import '../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import { CLOUDINARY_USER_NAME } from '../config/defaults';

function uploadImageCallBack(file) {
    return new Promise(
        (resolve, reject) => {

            if (file.size / 1000000 > 2) {
                toast.error('File too large. File size should be less than 2 MB.');
                reject();
                return;
            }

            const xhr = new XMLHttpRequest();
            xhr.open('POST', `https://api.cloudinary.com/v1_1/${CLOUDINARY_USER_NAME}/image/upload`);
            let data = new FormData();
            data.append("file", file);
            data.append("upload_preset", "mern-blog");
            data.append("cloud_name", CLOUDINARY_USER_NAME);
            xhr.send(data);
            xhr.addEventListener('load', () => {
                const response = JSON.parse(xhr.responseText);
                console.log(response)
                resolve({ data: { link: response.url } });
            });
            xhr.addEventListener('error', () => {
                const error = JSON.parse(xhr.responseText);
                console.log(error)
                reject(error);
            });
        }
    );
}

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
            <Fragment>

                <div style={{ maxWidth: 1000, fontSize: 18 }} >
                    <Editor
                        editorState={this.props.content}
                        wrapperClassName="demo-wrapper"
                        editorClassName="demo-editor"
                        onEditorStateChange={this.onEditorStateChange}
                        placeholder="Your content goes here . . . . . . . ."
                        toolbar={{
                            list: { inDropdown: true },
                            textAlign: { inDropdown: true },
                            link: { inDropdown: true },
                            history: { inDropdown: true },
                            image: { uploadCallback: uploadImageCallBack, previewImage: true, alt: { present: true, mandatory: false } },
                        }}
                    />
                    {/* <textarea
                    disabled
                    value={draftToHtml(convertToRaw(this.props.content.getCurrentContent()))}
                /> */}
                </div>
                <br /><br /><br />
            </Fragment>
        );
    }
}

export default EditorConvertToHTML