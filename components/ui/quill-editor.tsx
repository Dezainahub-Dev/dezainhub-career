"use client";

import React, { useMemo, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false }) as any;

interface QuillEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  height?: string;
  readOnly?: boolean;
}

const QuillEditor: React.FC<QuillEditorProps> = ({
  value,
  onChange,
  placeholder = "Start typing...",
  className = "",
  height = "200px",
  readOnly = false,
}) => {
  const quillRef = useRef<any>(null);

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          [{ font: [] }],
          [{ size: ["small", false, "large", "huge"] }],
          ["bold", "italic", "underline", "strike"],
          [{ color: [] }, { background: [] }],
          [{ script: "sub" }, { script: "super" }],
          ["blockquote", "code-block"],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ indent: "-1" }, { indent: "+1" }],
          [{ direction: "rtl" }],
          [{ align: [] }],
          ["link", "image", "video"],
          ["clean"],
        ],
        handlers: {
          // Custom handlers can be added here
        },
      },
      clipboard: {
        matchVisual: false,
      },
      history: {
        delay: 2000,
        maxStack: 500,
        userOnly: true,
      },
    }),
    []
  );

  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "video",
    "color",
    "background",
    "align",
    "direction",
    "code-block",
    "script",
    "clean",
  ];

  const handleChange = (content: string) => {
    onChange(content);
  };

  return (
    <div className={`quill-editor ${className}`}>
      <style jsx global>{`
        .quill-editor .ql-editor {
          min-height: ${height};
          font-family: "Nunito", sans-serif;
          font-size: 16px;
          line-height: 1.5;
          color: #000000 !important;
        }
        .quill-editor .ql-editor p,
        .quill-editor .ql-editor h1,
        .quill-editor .ql-editor h2,
        .quill-editor .ql-editor h3,
        .quill-editor .ql-editor h4,
        .quill-editor .ql-editor h5,
        .quill-editor .ql-editor h6,
        .quill-editor .ql-editor div,
        .quill-editor .ql-editor span,
        .quill-editor .ql-editor li {
          color: #000000 !important;
        }
        .quill-editor .ql-toolbar {
          border-top: 1px solid #ccc;
          border-left: 1px solid #ccc;
          border-right: 1px solid #ccc;
          border-radius: 8px 8px 0 0;
        }
        .quill-editor .ql-container {
          border-bottom: 1px solid #ccc;
          border-left: 1px solid #ccc;
          border-right: 1px solid #ccc;
          border-radius: 0 0 8px 8px;
        }
        .quill-editor .ql-editor.ql-blank::before {
          color: #999 !important;
          font-style: normal;
          font-family: "Nunito", sans-serif;
        }
        .quill-editor .ql-toolbar .ql-formats {
          margin-right: 15px;
        }
        .quill-editor .ql-toolbar button {
          padding: 5px;
        }
        .quill-editor .ql-toolbar button:hover {
          color: #06c;
        }
        .quill-editor .ql-toolbar button.ql-active {
          color: #06c;
          background-color: #e6f3ff;
        }
        .quill-editor .ql-toolbar .ql-picker-label {
          border: 1px solid transparent;
          border-radius: 3px;
        }
        .quill-editor .ql-toolbar .ql-picker-label:hover {
          border-color: #ccc;
        }
        .quill-editor .ql-toolbar .ql-picker-label.ql-active {
          border-color: #06c;
        }
        .quill-editor .ql-toolbar .ql-picker-options {
          border: 1px solid #ccc;
          border-radius: 3px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }
        .quill-editor .ql-toolbar .ql-picker-item {
          padding: 5px 10px;
        }
        .quill-editor .ql-toolbar .ql-picker-item:hover {
          background-color: #f0f0f0;
        }
        .quill-editor .ql-toolbar .ql-picker-item.ql-selected {
          background-color: #06c;
          color: white;
        }
        .quill-editor .ql-toolbar .ql-color-picker,
        .quill-editor .ql-toolbar .ql-background {
          width: 28px;
        }
        .quill-editor .ql-toolbar .ql-color-picker .ql-picker-label,
        .quill-editor .ql-toolbar .ql-background .ql-picker-label {
          width: 100%;
          height: 100%;
        }
        .quill-editor .ql-toolbar .ql-color-picker .ql-picker-label svg,
        .quill-editor .ql-toolbar .ql-background .ql-picker-label svg {
          width: 16px;
          height: 16px;
        }
        .quill-editor .ql-toolbar .ql-font .ql-picker-label,
        .quill-editor .ql-toolbar .ql-header .ql-picker-label {
          font-size: 13px;
        }
        .quill-editor .ql-toolbar .ql-font .ql-picker-item,
        .quill-editor .ql-toolbar .ql-header .ql-picker-item {
          font-size: 13px;
        }
        .quill-editor
          .ql-toolbar
          .ql-header
          .ql-picker-item[data-value="1"]::before {
          content: "Heading 1";
        }
        .quill-editor
          .ql-toolbar
          .ql-header
          .ql-picker-item[data-value="2"]::before {
          content: "Heading 2";
        }
        .quill-editor
          .ql-toolbar
          .ql-header
          .ql-picker-item[data-value="3"]::before {
          content: "Heading 3";
        }
        .quill-editor
          .ql-toolbar
          .ql-header
          .ql-picker-item[data-value="4"]::before {
          content: "Heading 4";
        }
        .quill-editor
          .ql-toolbar
          .ql-header
          .ql-picker-item[data-value="5"]::before {
          content: "Heading 5";
        }
        .quill-editor
          .ql-toolbar
          .ql-header
          .ql-picker-item[data-value="6"]::before {
          content: "Heading 6";
        }
        .quill-editor
          .ql-toolbar
          .ql-header
          .ql-picker-item[data-value="false"]::before {
          content: "Normal";
        }
        .quill-editor
          .ql-toolbar
          .ql-size
          .ql-picker-item[data-value="small"]::before {
          content: "Small";
        }
        .quill-editor
          .ql-toolbar
          .ql-size
          .ql-picker-item[data-value="large"]::before {
          content: "Large";
        }
        .quill-editor
          .ql-toolbar
          .ql-size
          .ql-picker-item[data-value="huge"]::before {
          content: "Huge";
        }
        .quill-editor
          .ql-toolbar
          .ql-size
          .ql-picker-item[data-value=""]::before {
          content: "Normal";
        }
        .quill-editor
          .ql-toolbar
          .ql-font
          .ql-picker-item[data-value="serif"]::before {
          content: "Serif";
        }
        .quill-editor
          .ql-toolbar
          .ql-font
          .ql-picker-item[data-value="monospace"]::before {
          content: "Monospace";
        }
        .quill-editor
          .ql-toolbar
          .ql-font
          .ql-picker-item[data-value=""]::before {
          content: "Sans Serif";
        }
        .quill-editor
          .ql-toolbar
          .ql-align
          .ql-picker-item[data-value="center"]::before {
          content: "Center";
        }
        .quill-editor
          .ql-toolbar
          .ql-align
          .ql-picker-item[data-value="right"]::before {
          content: "Right";
        }
        .quill-editor
          .ql-toolbar
          .ql-align
          .ql-picker-item[data-value="justify"]::before {
          content: "Justify";
        }
        .quill-editor
          .ql-toolbar
          .ql-align
          .ql-picker-item[data-value=""]::before {
          content: "Left";
        }
        .quill-editor
          .ql-toolbar
          .ql-direction
          .ql-picker-item[data-value="rtl"]::before {
          content: "RTL";
        }
        .quill-editor
          .ql-toolbar
          .ql-direction
          .ql-picker-item[data-value=""]::before {
          content: "LTR";
        }
        .quill-editor
          .ql-toolbar
          .ql-script
          .ql-picker-item[data-value="sub"]::before {
          content: "Subscript";
        }
        .quill-editor
          .ql-toolbar
          .ql-script
          .ql-picker-item[data-value="super"]::before {
          content: "Superscript";
        }
        .quill-editor
          .ql-toolbar
          .ql-script
          .ql-picker-item[data-value=""]::before {
          content: "Normal";
        }
        .quill-editor
          .ql-toolbar
          .ql-list
          .ql-picker-item[data-value="ordered"]::before {
          content: "Ordered List";
        }
        .quill-editor
          .ql-toolbar
          .ql-list
          .ql-picker-item[data-value="bullet"]::before {
          content: "Bullet List";
        }
        .quill-editor
          .ql-toolbar
          .ql-list
          .ql-picker-item[data-value=""]::before {
          content: "List";
        }
        .quill-editor
          .ql-toolbar
          .ql-indent
          .ql-picker-item[data-value="-1"]::before {
          content: "Decrease Indent";
        }
        .quill-editor
          .ql-toolbar
          .ql-indent
          .ql-picker-item[data-value="+1"]::before {
          content: "Increase Indent";
        }
        .quill-editor
          .ql-toolbar
          .ql-indent
          .ql-picker-item[data-value=""]::before {
          content: "Indent";
        }
        .quill-editor
          .ql-toolbar
          .ql-size
          .ql-picker-item[data-value="small"]::before {
          content: "Small";
        }
        .quill-editor
          .ql-toolbar
          .ql-size
          .ql-picker-item[data-value="large"]::before {
          content: "Large";
        }
        .quill-editor
          .ql-toolbar
          .ql-size
          .ql-picker-item[data-value="huge"]::before {
          content: "Huge";
        }
        .quill-editor
          .ql-toolbar
          .ql-size
          .ql-picker-item[data-value=""]::before {
          content: "Normal";
        }
        .quill-editor
          .ql-toolbar
          .ql-font
          .ql-picker-item[data-value="serif"]::before {
          content: "Serif";
        }
        .quill-editor
          .ql-toolbar
          .ql-font
          .ql-picker-item[data-value="monospace"]::before {
          content: "Monospace";
        }
        .quill-editor
          .ql-toolbar
          .ql-font
          .ql-picker-item[data-value=""]::before {
          content: "Sans Serif";
        }
        .quill-editor
          .ql-toolbar
          .ql-align
          .ql-picker-item[data-value="center"]::before {
          content: "Center";
        }
        .quill-editor
          .ql-toolbar
          .ql-align
          .ql-picker-item[data-value="right"]::before {
          content: "Right";
        }
        .quill-editor
          .ql-toolbar
          .ql-align
          .ql-picker-item[data-value="justify"]::before {
          content: "Justify";
        }
        .quill-editor
          .ql-toolbar
          .ql-align
          .ql-picker-item[data-value=""]::before {
          content: "Left";
        }
        .quill-editor
          .ql-toolbar
          .ql-direction
          .ql-picker-item[data-value="rtl"]::before {
          content: "RTL";
        }
        .quill-editor
          .ql-toolbar
          .ql-direction
          .ql-picker-item[data-value=""]::before {
          content: "LTR";
        }
        .quill-editor
          .ql-toolbar
          .ql-script
          .ql-picker-item[data-value="sub"]::before {
          content: "Subscript";
        }
        .quill-editor
          .ql-toolbar
          .ql-script
          .ql-picker-item[data-value="super"]::before {
          content: "Superscript";
        }
        .quill-editor
          .ql-toolbar
          .ql-script
          .ql-picker-item[data-value=""]::before {
          content: "Normal";
        }
        .quill-editor
          .ql-toolbar
          .ql-list
          .ql-picker-item[data-value="ordered"]::before {
          content: "Ordered List";
        }
        .quill-editor
          .ql-toolbar
          .ql-list
          .ql-picker-item[data-value="bullet"]::before {
          content: "Bullet List";
        }
        .quill-editor
          .ql-toolbar
          .ql-list
          .ql-picker-item[data-value=""]::before {
          content: "List";
        }
        .quill-editor
          .ql-toolbar
          .ql-indent
          .ql-picker-item[data-value="-1"]::before {
          content: "Decrease Indent";
        }
        .quill-editor
          .ql-toolbar
          .ql-indent
          .ql-picker-item[data-value="+1"]::before {
          content: "Increase Indent";
        }
        .quill-editor
          .ql-toolbar
          .ql-indent
          .ql-picker-item[data-value=""]::before {
          content: "Indent";
        }
      `}</style>
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={handleChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        readOnly={readOnly}
        style={{
          height: "auto",
          minHeight: height,
        }}
      />
    </div>
  );
};

export default QuillEditor;
