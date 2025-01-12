import { type JSONContent, Extension } from '@tiptap/core';
import type { ExportContext, ExportTypeOptions } from './types';
export type ExportFormat = 'docx' | 'odt' | 'md' | 'gfm';
export declare const formatMap: Record<ExportFormat, string>;
declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        export: {
            /**
             * Export the current content to another file format (docx, odt, md or gfm).
            */
            export: (options: {
                format: ExportFormat;
                content?: JSONContent;
                /**
                 * Customize the mapping of the exported prosemirror types.
                 * This is useful when you changed the node and mark types in your project.
                 * For example instead of using `orderedList` you might use `numberedList`.
                 */
                types?: ExportTypeOptions;
                /**
                 * When set to false, the default export behavior will be prevented.
                 */
                onExport?: ((context: ExportContext) => void) | null;
            }) => ReturnType;
        };
    }
}
export type ExportOptions = {
    /**
     * The Tiptap API endpoint to use for conversion.
     * @default 'https://api.tiptap.dev/v1/convert'
     */
    endpoint?: string;
    /**
     * The Tiptap JWT to use for authentication.
     */
    token: string;
    /**
     * The Tiptap App ID to use for authentication.
     */
    appId: string;
};
export declare const Export: Extension<ExportOptions, any>;
