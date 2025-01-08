import { NodeType } from '@tiptap/pm/model';
import { Plugin } from '@tiptap/pm/state';
export declare const TableOfContentsPlugin: ({ getId, anchorTypes, }: {
    getId?: (textContent: string) => string;
    anchorTypes?: Array<string | NodeType>;
}) => Plugin<any>;
