import { DragHandlePlugin as e, dragHandlePluginDefaultKey as r } from "@baicie/md-extension-drag-handle";
import n, { useEffect as i, useRef as l, useState as t } from "react";
const o=o=>{const{className:u="drag-handle",children:a,editor:p,pluginKey:s=r,onNodeChange:c,tippyOptions:d={}}=o,[g,m]=t(null),h=l(null);return i((()=>g?p.isDestroyed?()=>{h.current=null}:(h.current||(h.current=e({editor:p,element:g,pluginKey:s,tippyOptions:d,onNodeChange:c}),p.registerPlugin(h.current)),()=>{p.unregisterPlugin(s),h.current=null}):()=>{h.current=null}),[g,p,c,s]),n.createElement("div",{className:u,ref:m},a)};export { o as default, o as DragHandle };

