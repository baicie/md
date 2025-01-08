import { Extension } from '@tiptap/core';
import { EditorState } from '@tiptap/pm/state';
import { MathematicsOptions } from './types';
export declare const defaultShouldRender: (state: EditorState, pos: number) => boolean;
export declare const Mathematics: Extension<MathematicsOptions, any>;
export default Mathematics;
