import { useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import axios from "axios";

const Editor = ({ setDesc, desc, setImage }) => {
  const [flag, setFlag] = useState(false);

  const customUploadAdapter = loader => {
    return {
      upload() {
        return new Promise((resolve, reject) => {
          const data = new FormData();
          loader.file.then(file => {
            data.append("file", file);

            axios
              .post("http://localhost:5000/api/upload", data)
              .then(res => {
                if (!flag) {
                  setFlag(true);
                  setImage(res.data.filename);
                }
                resolve({
                  default: `${res.data.url}`,
                });
              })
              .catch(err => reject(err));
          });
        });
      },
    };
  };

  function uploadPlugin(editor) {
    editor.plugins.get("FileRepository").createUploadAdapter = loader => {
      return customUploadAdapter(loader);
    };
  }

  return (
    <CKEditor
      editor={ClassicEditor}
      config={{
        extraPlugins: [uploadPlugin],
        toolbar: [
          "heading",
          "|",
          "bold",
          "italic",
          "link",
          "bulletedList",
          "numberedList",
          "blockQuote",
          "imageUpload",
          "|",
          "insertTable",
          "tableColumn",
          "tableRow",
          "mergeTableCells",
          "|",
          "undo",
          "redo",
        ],
      }}
      data={desc}
      onReady={editor => {
        // Editor is ready to use
      }}
      onChange={(event, editor) => {
        const data = editor.getData();
        setDesc(data);
      }}
      onBlur={(event, editor) => {
        // Blur event
      }}
      onFocus={(event, editor) => {
        // Focus event
      }}
    />
  );
};

export default Editor;
