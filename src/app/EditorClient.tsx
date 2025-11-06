"use client";

import { Editor } from "@tinymce/tinymce-react";

export default function EditorClient() {
    return (
        <Editor
            apiKey={process.env.NEXT_PUBLIC_API_KEY}
            init={{
                menubar: false,
                height: 500,
                plugins: "lists link image table code help wordcount",
                toolbar:
                    "undo redo | formatselect | bold italic emoticons | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent",
            }}
        />
    );
}