import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  example: async (args: any) => ipcRenderer.invoke('example', args),
});
