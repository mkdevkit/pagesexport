const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  readConfig: () => ipcRenderer.invoke('read-config'),
  saveConfig: (content) => ipcRenderer.invoke('save-config', content),
  openConfigFolder: () => ipcRenderer.invoke('open-config-folder'),
})
