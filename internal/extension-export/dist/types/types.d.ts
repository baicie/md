export type ExportTypeOptions = {
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
export type ExportContext = {
    blob: Blob;
    filename: string;
    error: null;
    download: () => void;
} | {
    error: Error;
};
