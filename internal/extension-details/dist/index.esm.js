import{findParentNode as t,findChildren as e,Node as n,mergeAttributes as o,defaultBlockAt as s,isActive as r}from"@tiptap/core";import{Selection as i,Plugin as a,PluginKey as c,TextSelection as d}from"@tiptap/pm/state";import{GapCursor as p}from"@tiptap/pm/gapcursor";const l=(t,e)=>null!==e.view.domAtPos(t).node.offsetParent,u=(n,o)=>{const{state:s,view:r,extensionManager:i}=n,{schema:a,selection:c}=s,{empty:d,$anchor:u}=c,m=!!i.extensions.find((t=>"gapCursor"===t.name));if(!d||u.parent.type!==a.nodes.detailsSummary||!m)return!1;if("right"===o&&u.parentOffset!==u.parent.nodeSize-2)return!1;const f=t((t=>t.type===a.nodes.details))(c);if(!f)return!1;const h=e(f.node,(t=>t.type===a.nodes.detailsContent));if(!h.length)return!1;if(l(f.start+h[0].pos+1,n))return!1;const y=s.doc.resolve(f.pos+f.node.nodeSize),g=p.findFrom(y,1,!1);if(!g)return!1;const{tr:S}=s,v=new p(g);return S.setSelection(v),S.scrollIntoView(),r.dispatch(S),!0},m=n.create({name:"details",content:"detailsSummary detailsContent",group:"block",defining:!0,isolating:!0,allowGapCursor:!1,addOptions:()=>({persist:!1,openClassName:"is-open",HTMLAttributes:{}}),addAttributes(){return this.options.persist?{open:{default:!1,parseHTML:t=>t.hasAttribute("open"),renderHTML:({open:t})=>t?{open:""}:{}}}:[]},parseHTML:()=>[{tag:"details"}],renderHTML({HTMLAttributes:t}){return["details",o(this.options.HTMLAttributes,t),0]},addNodeView(){return({editor:t,getPos:e,node:n,HTMLAttributes:s})=>{const r=document.createElement("div"),i=o(this.options.HTMLAttributes,s,{"data-type":this.name});Object.entries(i).forEach((([t,e])=>r.setAttribute(t,e)));const a=document.createElement("button");a.type="button",r.append(a);const c=document.createElement("div");r.append(c);const d=t=>{if(void 0!==t)if(t){if(r.classList.contains(this.options.openClassName))return;r.classList.add(this.options.openClassName)}else{if(!r.classList.contains(this.options.openClassName))return;r.classList.remove(this.options.openClassName)}else r.classList.toggle(this.options.openClassName);const e=new Event("toggleDetailsContent"),n=c.querySelector(':scope > div[data-type="detailsContent"]');null==n||n.dispatchEvent(e)};return n.attrs.open&&setTimeout((()=>d())),a.addEventListener("click",(()=>{if(d(),this.options.persist){if(t.isEditable&&"function"==typeof e){const{from:n,to:o}=t.state.selection;t.chain().command((({tr:t})=>{const n=e(),o=t.doc.nodeAt(n);return(null==o?void 0:o.type)===this.type&&(t.setNodeMarkup(n,void 0,{open:!o.attrs.open}),!0)})).setTextSelection({from:n,to:o}).focus(void 0,{scrollIntoView:!1}).run()}}else t.commands.focus(void 0,{scrollIntoView:!1})})),{dom:r,contentDOM:c,ignoreMutation:t=>"selection"!==t.type&&(!r.contains(t.target)||r===t.target),update:t=>t.type===this.type&&(void 0!==t.attrs.open&&d(t.attrs.open),!0)}}},addCommands(){return{setDetails:()=>({state:t,chain:e})=>{var n;const{schema:o,selection:s}=t,{$from:r,$to:i}=s,a=r.blockRange(i);if(!a)return!1;const c=t.doc.slice(a.start,a.end);if(!o.nodes.detailsContent.contentMatch.matchFragment(c.content))return!1;const d=(null===(n=c.toJSON())||void 0===n?void 0:n.content)||[];return e().insertContentAt({from:a.start,to:a.end},{type:this.name,content:[{type:"detailsSummary"},{type:"detailsContent",content:d}]}).setTextSelection(a.start+2).run()},unsetDetails:()=>({state:n,chain:o})=>{const{selection:s,schema:r}=n,i=t((t=>t.type===this.type))(s);if(!i)return!1;const a=e(i.node,(t=>t.type===r.nodes.detailsSummary)),c=e(i.node,(t=>t.type===r.nodes.detailsContent));if(!a.length||!c.length)return!1;const d=a[0],p=c[0],l=i.pos,u=n.doc.resolve(l),m={from:l,to:l+i.node.nodeSize},f=p.node.content.toJSON()||[],h=u.parent.type.contentMatch.defaultType,y=[null==h?void 0:h.create(null,d.node.content).toJSON(),...f];return o().insertContentAt(m,y).setTextSelection(l+1).run()}}},addKeyboardShortcuts(){return{Backspace:()=>{const{schema:t,selection:e}=this.editor.state,{empty:n,$anchor:o}=e;return!(!n||o.parent.type!==t.nodes.detailsSummary)&&(0!==o.parentOffset?this.editor.commands.command((({tr:t})=>{const e=o.pos-1,n=o.pos;return t.delete(e,n),!0})):this.editor.commands.unsetDetails())},Enter:({editor:t})=>{const{state:e,view:n}=t,{schema:o,selection:r}=e,{$head:a}=r;if(a.parent.type!==o.nodes.detailsSummary)return!1;const c=l(a.after()+1,t),d=c?e.doc.nodeAt(a.after()):a.node(-2);if(!d)return!1;const p=c?0:a.indexAfter(-1),u=s(d.contentMatchAt(p));if(!u||!d.canReplaceWith(p,p,u))return!1;const m=u.createAndFill();if(!m)return!1;const f=c?a.after()+1:a.after(-1),h=e.tr.replaceWith(f,f,m),y=h.doc.resolve(f),g=i.near(y,1);return h.setSelection(g),h.scrollIntoView(),n.dispatch(h),!0},ArrowRight:({editor:t})=>u(t,"right"),ArrowDown:({editor:t})=>u(t,"down")}},addProseMirrorPlugins(){return[new a({key:new c("detailsSelection"),appendTransaction:(t,n,o)=>{const{editor:s,type:i}=this,a=t.some((t=>t.selectionSet));if(!a||!n.selection.empty||!o.selection.empty)return;if(!r(o,i.name))return;const{$from:c}=o.selection;if(l(c.pos,s))return;const p=((t,e,n)=>{for(let o=t.depth;o>0;o-=1){const s=t.node(o),r=e(s),i=l(t.start(o),n);if(r&&i)return{pos:o>0?t.before(o):0,start:t.start(o),depth:o,node:s}}})(c,(t=>t.type===i),s);if(!p)return;const u=e(p.node,(t=>t.type===o.schema.nodes.detailsSummary));if(!u.length)return;const m=u[0],f="forward"===(n.selection.from<o.selection.from?"forward":"backward")?p.start+m.pos:p.pos+m.pos+m.node.nodeSize,h=d.create(o.doc,f);return o.tr.setSelection(h)}})]}});export{m as Details,m as default};