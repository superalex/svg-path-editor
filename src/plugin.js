"use strict";penpot.ui.open("Penpot path editor",`?theme=${penpot.theme}`),penpot.ui.onMessage(e=>{switch(e.type){case"ready":setCurrentSelectionPath(),initEvents();break;case"update-path":penpot.selection[0].content=e.content;break;default:return}}),penpot.on("selectionchange",()=>{setCurrentSelectionPath(),initEvents()});let listeners=[];function setCurrentSelectionPath(){const e=penpot.selection.length>0?penpot.selection[0]?.toD():"";sendMessage({type:"set_path",penpot_id:penpot.selection[0]?.id,content:e})}function initEvents(){listeners.forEach(e=>{penpot.off(e)}),listeners=penpot.selection.map(e=>penpot.on("shapechange",()=>{setCurrentSelectionPath()},{shapeId:e.id}))}penpot.on("themechange",e=>{sendMessage({type:"theme",content:e})});function sendMessage(e){penpot.ui.sendMessage(e)}