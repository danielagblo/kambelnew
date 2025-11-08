"use client";

import { Editor } from "@tinymce/tinymce-react";
import { useEffect, useRef } from "react";

interface EditorClientProps {
    label?: string;
    name?: string;
    value: string;
    onChange: (content: string) => void;
}

export default function EditorClient({ label, value, onChange }: EditorClientProps) {
    const editorRef = useRef<any>(null);
    const initialValueRef = useRef(value);

    // Update initial value ref when value prop changes from outside
    useEffect(() => {
        if (editorRef.current && value !== editorRef.current.getContent()) {
            initialValueRef.current = value;
        }
    }, [value]);

    return (
        <div className="space-y-2">
            {label && (
                <label className="block text-sm font-medium text-gray-700">
                    {label}
                </label>
            )}
            <Editor
                apiKey={process.env.NEXT_PUBLIC_API_KEY}
                onInit={(_evt: any, editor: any) => {
                    editorRef.current = editor;
                }}
                initialValue={initialValueRef.current}
                onEditorChange={(content: string) => {
                    onChange(content);
                }}
                init={{
                    menubar: false,
                    height: 500,
                    // include paste and contextmenu plugins so right-click paste/copy options are available
                    plugins: "lists link image table code help wordcount paste contextmenu",
                    toolbar:
                        "undo redo | formatselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | paste | help",
                    // Configure the context menu to include cut/copy/paste and common editor actions
                    // Note: browser clipboard permissions can still limit programmatic copy/paste; if the
                    // native browser menu is preferred for copy/paste, remove the contextmenu plugin.
                    contextmenu: 'cut copy paste | paste as text | link image inserttable | cell row column deletetable',
                    browser_spellcheck: true,
                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                    branding: false,
                    promotion: false,
                }}
            />
        </div>
    );
}