import { contextBridge } from 'electron';
import Store from 'electron-store';

const store = new Store();

contextBridge.exposeInMainWorld('api', {
  getToken: () => store.get('jwtToken'),
  setToken: (token: string) => store.set('jwtToken', token),
  removeToken: () => store.delete('jwtToken'),
});
