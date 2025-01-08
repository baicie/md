import { Plugin } from '@tiptap/pm/state';
import { DecorationSet } from '@tiptap/pm/view';
import { MathematicsOptionsWithEditor } from './types';
type PluginState = {
    decorations: DecorationSet;
    isEditable: boolean;
} | {
    decorations: undefined;
    isEditable: undefined;
};
export declare const MathematicsPlugin: (options: MathematicsOptionsWithEditor) => Plugin<PluginState>;
export {};
