import { Readable } from 'stream';

export interface SavedFile {
  filename: string;
  storagePath: string;
  url: string;
  sizeBytes: number;
  mimeType: string;
  width?: number;
  height?: number;
}

export interface IStorageProvider {
  saveFile(buffer: Buffer, originalName: string, mimeType: string): Promise<SavedFile>;
  deleteFile(storagePath: string): Promise<boolean>;
  getFileStream(storagePath: string): Promise<Readable>;
  getFileUrl(storagePath: string): string;
}
