// src/types/global.d.ts

export {};

declare global {
  interface Window {
    api: {
      getToken: () => string | undefined;
      setToken: (token: string) => void;
      removeToken: () => void;
    };
  }
}
