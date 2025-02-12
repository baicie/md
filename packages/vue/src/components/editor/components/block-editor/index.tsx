import { EditorContent } from '@tiptap/vue-3'
import { defineComponent } from 'vue'

import { ColumnsMenu } from '../menus/columns-menu'
import { ContentItemMenu } from '../menus/content-item-menu'
import { ImageBlockMenu } from '../menus/image-block-menu'
import { LinkMenu } from '../menus/link-menu'
import { TableColumnMenu, TableRowMenu } from '../menus/table-menu'
import { TextMenu } from '../menus/text-menu'
import { EditorToolbar } from '../toolbar'

import type { Editor } from '@tiptap/core'

export const BlockEditor = defineComponent({
  name: 'BlockEditor',
  props: {
    editor: {
      type: Object as () => Editor | null,
      required: true,
    },
    isReady: {
      type: Boolean,
      default: true,
    },
  },
  setup(props) {
    if (!props.isReady || !props.editor) {
      return () => (
        <div class="flex h-full items-center justify-center">
          Loading editor...
        </div>
      )
    }

    return () => (
      <div class="flex h-full">
        <div class="relative flex flex-col flex-1 h-full overflow-hidden">
          <EditorToolbar editor={props.editor} />
          <div class="flex-1 overflow-auto">
            <EditorContent editor={props.editor} />
            <ContentItemMenu editor={props.editor} />
            <LinkMenu editor={props.editor} />
            <TextMenu editor={props.editor} />
            <ColumnsMenu editor={props.editor} />
            <TableRowMenu editor={props.editor} />
            <TableColumnMenu editor={props.editor} />
            <ImageBlockMenu editor={props.editor} />
          </div>
        </div>
      </div>
    )
  },
})
