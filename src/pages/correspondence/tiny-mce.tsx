import React, { useContext, useEffect, useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { CorrespondanceEditorContext } from "../../common/providers/viewProvider";
import { Controller } from "react-hook-form";

interface TinyProps {
    control: any,
    name: any,
    isExpanded?: boolean;
    tinyLanguage?: number;
    onFullscreenChange: (isExpanded: boolean) => void;
    resetChildItems?: any;
    setValue: any;
}



const TinyMceEditor = ({ control, name, isExpanded, tinyLanguage, onFullscreenChange, resetChildItems, setValue }: TinyProps) => {

    const editorRef = useRef<Editor>(null);
    /*  const { data } = useContext(CorrespondanceEditorContext); */
    const [isEditorLangArabic, setIsEditorLangArabic] = useState(tinyLanguage);
    const [editorKey, setEditorKey] = useState(0);
    const [editorInitialValue, setEditorInitialValue] = useState('Initial Value');

    /* Editor Change */
    /* useEffect(() => {

    }, [data]); */

    /* Clear Text */
    useEffect(() => {
        if (resetChildItems) {
            const newKey = editorKey * 43;
            setEditorKey(newKey);
        }
    }, [resetChildItems])

    /* Tiny Language Change */
    useEffect(() => {
        setIsEditorLangArabic(tinyLanguage);
        setEditorKey(editorKey + 1);
    }, [tinyLanguage]);


    useEffect(() => {
        /* For expand and reduce */
        if (isExpanded) {

        }
    }, [isExpanded]);

    useEffect(() => {
        /* Reset expansion when fullscreen mode is turned off */
        if (!isExpanded && editorRef.current) {
            const editor = editorRef.current.editor;
            if (editor) {
                editor.on("FullscreenStateChanged", function (event) {
                    if (!event.state) {
                        onFullscreenChange(false);
                    }
                });
            }
        }
    }, [isExpanded, onFullscreenChange]);

    const handleChange = (content: any, editor: any) => {
        setValue(name, htmlContent(content));
    };

    const htmlContent = (changedContent: string) => {
        return `<!DOCTYPE html>
        <html>
          <head> 
          </head>
          <body style='margin: 0px !important;'>
            ${changedContent}
          </body>
        </html>`;
    }
    /*
    interface HTMLInputEvent extends Event {
        target: HTMLInputElement & EventTarget;
    }
    */

    return (
        <>
            <Controller
                name={name}
                control={control}
                defaultValue=""
                render={({ field: { value, onChange }, fieldState: { error } }) => (
                    <div className={`${error?.message && !value ? 'error-tiny' : ''}`} style={{ minHeight: '420px' }}>
                        <Editor
                            ref={editorRef}
                            key={editorKey}
                            value={value}
                            apiKey={window["config"]?.tinyMCE}
                            onEditorChange={handleChange}
                            init={{
                                relative_urls: false,
                                remove_script_host: false,
                                document_base_url: window['config'].FILE_URL,
                                height: "420px",
                                width: "100%",
                                telemetry: false,
                                language: "en",
                                directionality: "ltr",
                                /*  language: isEditorLangArabic ? "ar" : "en",
                                 directionality: isEditorLangArabic ? "rtl" : "ltr", */


                                //menubar: "file edit view insert format tools table help",
                                //menubar: true,
                                image_title: true,
                                file_picker_types: 'image',
                                images_file_types: 'jpeg,jpg,jpe,jfi,jfif,png,gif,bmp,webp',
                                image_advtab: true,
                                paste_data_images: true,
                                powerpaste_word_import: 'prompt',
                                powerpaste_allow_local_images: true,
                                powerpaste_block_drop: true,
                                content_style:
                                    '@import url("https://fonts.googleapis.com/css2?family=Oswald&display=swap");body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                                //"body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                                font_family_formats:
                                    "Andale Mono=andale mono,times; Arial=arial,helvetica,sans-serif; Arial Black=arial black,avant garde; Book Antiqua=book antiqua,palatino; Comic Sans MS=comic sans ms,sans-serif; Courier New=courier new,courier; Georgia=georgia,palatino; Helvetica=helvetica; Impact=impact,chicago; Oswald=oswald; Sakkal Majalla=sakkal majalla; Symbol=symbol; Tahoma=tahoma,arial,helvetica,sans-serif; Terminal=terminal,monaco; Times New Roman=times new roman,times; Trebuchet MS=trebuchet ms,geneva; Verdana=verdana,geneva; Webdings=webdings; Wingdings=wingdings,zapf dingbats",
                                plugins: [
                                    "quickbars",
                                    "preview",
                                    "importcss",
                                    "searchreplace",
                                    "autolink",
                                    "autosave",
                                    "save",
                                    "directionality",
                                    //"code",
                                    "visualblocks",
                                    "visualchars",
                                    "fullscreen",
                                    "image",
                                    //"link",
                                    //"media",
                                    //"template",
                                    //"codesample",
                                    "table",
                                    //"paste",
                                    "charmap",
                                    "pagebreak",
                                    "nonbreaking",
                                    //"anchor",
                                    "insertdatetime",
                                    "advlist",
                                    "lists",
                                    "wordcount",
                                    "help",
                                    "charmap",
                                    "powerpaste"
                                    //"emoticons",
                                ],
                                toolbar:
                                    "undo redo | ltr rtl | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify fullscreen | numlist bullist | forecolor backcolor removeformat | outdent indent | fontfamily fontsize | blocks | quickimage quicktable",
                                //fontselect fontsizeselect |  
                                //"undo redo |  ltr rtl | bold italic underline strikethrough | fontfamily fontsize blocks | alignleft aligncenter alignright alignjustify | fullscreen  preview |  numlist bullist | forecolor backcolor removeformat | pagebreak | charmap emoticons | outdent indent save print | insertfile image media template link anchor codesample",
                                //images_upload_url: 'postAcceptor.php',
                                //quickbars_insert_toolbar: 'quicktable image',     
                                quickbars_insert_toolbar: false,
                                automatic_uploads: false,
                                file_picker_callback: function (cb, value, meta) {
                                    var input = document.createElement('input');
                                    input.setAttribute('type', 'file');
                                    input.setAttribute('accept', 'image/*');

                                    /*
                                      Note: In modern browsers input[type="file"] is functional without
                                      even adding it to the DOM, but that might not be the case in some older
                                      or quirky browsers like IE, so you might want to add it to the DOM
                                      just in case, and visually hide it. And do not forget do remove it
                                      once you do not need it anymore.
                                    */
                                    input.onchange = function (e) {
                                        //var file = (e as HTMLInputEvent)?.target.files![0];

                                        const target = e.target as HTMLInputElement;
                                        const file: File = (target.files as FileList)[0];
                                        //console.log(file);


                                        var reader = new FileReader();
                                        reader.onload = function () {
                                            //var w = reader.result?.toString();
                                            var id = 'blobid' + (new Date()).getTime();
                                            const editor = editorRef.current?.editor;
                                            //var blobCache =  Editor.activeEditor!.editorUpload.blobCache;
                                            var blobCache = editor!.editorUpload.blobCache;
                                            var base64 = reader.result?.toString()!.split(',')[1];
                                            var blobInfo = blobCache.create(id, file, base64!);
                                            blobCache.add(blobInfo);
                                            console.log(file, 'file')
                                            cb(blobInfo.blobUri(), { title: file.name });
                                        };
                                        reader.readAsDataURL(file);
                                    };

                                    input.click();
                                },
                            }}
                        />
                    </div>
                )}
            />
        </>
    );
};

export default TinyMceEditor;
