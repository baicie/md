"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var e=require("@tiptap/core");const t=(e,t)=>{t.blockQuote&&e.searchParams.set("blockquote",t.blockQuote),t.bold&&e.searchParams.set("bold",t.bold),t.bulletList&&e.searchParams.set("bulletlist",t.bulletList),t.code&&e.searchParams.set("code",t.code),t.codeBlock&&e.searchParams.set("codeblock",t.codeBlock),t.hardBreak&&e.searchParams.set("hardbreak",t.hardBreak),t.heading&&e.searchParams.set("heading",t.heading),t.horizontalRule&&e.searchParams.set("horizontalrule",t.horizontalRule),t.italic&&e.searchParams.set("italic",t.italic),t.link&&e.searchParams.set("link",t.link),t.listItem&&e.searchParams.set("listitem",t.listItem),t.orderedList&&e.searchParams.set("orderedlist",t.orderedList),t.paragraph&&e.searchParams.set("paragraph",t.paragraph),t.strike&&e.searchParams.set("strikethrough",t.strike),t.table&&e.searchParams.set("table",t.table),t.tableCell&&e.searchParams.set("tablecell",t.tableCell),t.tableHeader&&e.searchParams.set("tableheader",t.tableHeader),t.tableRow&&e.searchParams.set("tablerow",t.tableRow),t.underline&&e.searchParams.set("underline",t.underline)},a={docx:"docx",odt:"odt",md:"md",gfm:"md"},r=e.Extension.create({name:"export",addOptions:()=>({endpoint:"https://api.tiptap.dev/v1/convert",token:"",appId:""}),addCommands(){return{export:e=>()=>{const{format:r,content:s,onExport:o}=e,l=s||this.editor.getJSON(),n=new FormData;n.append("prosemirrorJson",JSON.stringify(l)),n.append("to",r);const i=new URL(`${this.options.endpoint}/export`),d=`export-${Date.now()}.${a[r]}`;return e.types&&t(i,e.types),fetch(i.href,{method:"POST",body:n,headers:{Authorization:`Bearer ${this.options.token}`,"X-App-Id":this.options.appId}}).then((e=>{if(!e.ok)throw new Error(e.statusText);return e.blob()})).then((e=>{const t=()=>{const t=URL.createObjectURL(e),a=document.createElement("a");a.href=t,a.download=d,a.click(),window.requestAnimationFrame((()=>{a.remove(),URL.revokeObjectURL(t)}))};if(o)return o({blob:e,filename:d,error:null,download:t});t()})).catch((e=>{if(!o)throw e;o({error:e})})),!0}}}});exports.Export=r,exports.createTypeOptionParams=t,exports.default=r,exports.formatMap=a;