import type { JSONContent } from '@tiptap/core';
export type ImportTypeOptions = {
    paragraph?: string;
    heading?: string;
    blockQuote?: string;
    codeBlock?: string;
    bulletList?: string;
    orderedList?: string;
    listItem?: string;
    hardBreak?: string;
    horizontalRule?: string;
    table?: string;
    tableCell?: string;
    tableHeader?: string;
    tableRow?: string;
    bold?: string;
    italic?: string;
    underline?: string;
    strike?: string;
    link?: string;
    code?: string;
};
export type ImportContext = {
    content: JSONContent;
    error: null;
    setEditorContent: (content?: JSONContent) => void;
} | {
    content: null;
    error: Error;
};
