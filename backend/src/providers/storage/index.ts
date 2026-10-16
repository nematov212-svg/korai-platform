import { IStorageProvider } from './storage.interface.js';
import { LocalStorageProvider } from './local.storage.js';

let storageInstance: IStorageProvider | null = null;

export function getStorageProvider(): IStorageProvider {
  if (!storageInstance) {
    storageInstance = new LocalStorageProvider();
  }
  return storageInstance;
}

export * from './storage.interface.js';
