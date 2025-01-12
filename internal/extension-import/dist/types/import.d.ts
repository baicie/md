import { Extension } from '@tiptap/core';
import type { ImportContext, ImportTypeOptions } from './types';
export type ExportFormat = 'docx' | 'odt' | 'md' | 'gfm';
export declare const formatMap: Record<ExportFormat, string>;
declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        import: {
            /**
             * Import a file into your editor and replace the current content.
             */
            import: (options: {
                file: File;
                format?: 'gfm';
                /**
                 * Customize the mapping of the imported contents prosemirror types.
                 * This is useful when you changed the node and mark types in your project.
                 * For example instead of using `orderedList` you might use `numberedList`.
                 */
                types?: ImportTypeOptions;
                /**
                 * When set to false, the default import behavior will be prevented.
                 */
                onImport?: ((context: ImportContext) => void) | null;
            }) => ReturnType;
        };
    }
}
export type ImportOptions = {
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
    /**
     * The callback URL to use for image uploads.
     */
    imageUploadCallbackUrl?: string;
    /**
     * Enable experimental support for importing DOCX files.
     */
    experimentalDocxImport?: boolean;
};
export declare const Import: Extension<ImportOptions, any>;
