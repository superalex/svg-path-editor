penpot.ui.open('Penpot path editor', `?theme=${penpot.theme}`);

penpot.ui.onMessage<{ type: string; content: string }>((message) => {
  switch (message.type) {
    case "ready":
      setCurrentSelectionPath();
      initEvents();
      break;
    case "update-path":
      penpot.selection[0].content = message.content;
      break;
    default:
      return;
  }
});

penpot.on('selectionchange', () => {
  setCurrentSelectionPath();
  initEvents();
});

let listeners: symbol[] = [];

function setCurrentSelectionPath() {
  const content = penpot.selection.length > 0 ? penpot.selection[0]?.toD() : '';
  sendMessage({ type: 'set_path', penpot_id: penpot.selection[0]?.id, content: content });
}

function initEvents() {
  listeners.forEach((listener) => {
    penpot.off(listener);
  });

  listeners = penpot.selection.map((shape) => {
    return penpot.on(
      'shapechange',
      () => {
        setCurrentSelectionPath();
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
