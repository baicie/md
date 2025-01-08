import { DragHandlePluginProps } from '@baicie/md-extension-drag-handle';
import { Node } from '@tiptap/pm/model';
import { Editor } from '@tiptap/react';
import React, { ReactNode } from 'react';
type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;
export type DragHandleProps = Omit<Optional<DragHandlePluginProps, 'pluginKey'>, 'element'> & {
    className?: string;
    onNodeChange?: (data: {
        node: Node | null;
        editor: Editor;
        pos: number;
    }) => void;
    children: ReactNode;
};
export declare const DragHandle: (props: DragHandleProps) => React.JSX.Element;
export { };

