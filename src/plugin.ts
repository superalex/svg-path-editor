penpot.ui.open('Penpot path editor', `?theme=${penpot.theme}`);

let selectedContent = "";

penpot.ui.onMessage<{ type: string; content: string }>((message) => {
  switch (message.type) {
    case "ready":
      selectPath();
      initEvents();
      break;
    case "update-path":
      penpot.selection[0].content = message.content;
      selectedContent = penpot.selection[0].content;
      break;
    default:
      return;
  }
});

penpot.on('selectionchange', () => {
  selectPath();
  initEvents();
});
let listeners: symbol[] = [];

function selectPath() {
  const selected = penpot.selection[0];
  if (selected?.type == 'path') {
    sendMessage({ type: 'setpath', penpot_id: penpot.selection[0]?.id, content: selected.toD() });
  }
  else {
    sendMessage({ type: 'setpath', penpot_id: null, content: '' });
  }

}

function initEvents() {
  listeners.forEach((listener) => {
    penpot.off(listener);
  });

  listeners = penpot.selection.map((shape) => {
    return penpot.on(
      'shapechange',
      (e) => {
        if (e.content != selectedContent) {
          selectPath();
        }
      },
      { shapeId: shape.id }
    );
  });
}

penpot.on('themechange', (theme) => {
  sendMessage({ type: 'theme', content: theme });
});

function sendMessage(message: PluginMessageEvent) {
  penpot.ui.sendMessage(message);
}
