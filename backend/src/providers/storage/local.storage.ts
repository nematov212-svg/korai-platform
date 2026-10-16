import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import sharp from 'sharp';
import { IStorageProvider, SavedFile } from './storage.interface.js';
import { config } from '../../config/index.js';
import { ApiError } from '../../utils/errors.js';

export class LocalStorageProvider implements IStorageProvider {
  private uploadDir: string;

  constructor() {
    this.uploadDir = path.resolve(process.cwd(), config.storage.uploadDir);
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async saveFile(buffer: Buffer, originalName: string, mimeType: string): Promise<SavedFile> {
    // Validate image using sharp
    let image = sharp(buffer);
    let metadata;
    try {
      metadata = await image.metadata();
    } catch (err) {
      throw ApiError.badRequest('Fayl haqiqiy tasvir formati emas yoki buzilgan');
    }

    if (!metadata.format) {
      throw ApiError.badRequest('Qo‘llab-quvvatlanmaydigan rasm formati');
    }

    // Resize if too huge (max dimension 2560px) to conserve memory and bandwidth
    if ((metadata.width && metadata.width > 2560) || (metadata.height && metadata.height > 2560)) {
      image = image.resize({
        width: metadata.width && metadata.width > 2560 ? 2560 : undefined,
        height: metadata.height && metadata.height > 2560 ? 2560 : undefined,
        fit: 'inside',
        withoutEnlargement: true,
      });
    }

    const uniqueId = crypto.randomBytes(16).toString('hex');
    const ext = metadata.format === 'jpeg' ? 'jpg' : metadata.format;
    const filename = `${Date.now()}-${uniqueId}.${ext}`;
    const destinationPath = path.join(this.uploadDir, filename);

    // Optimize output as webp or jpeg
    let processedBuffer: Buffer;
    if (metadata.format === 'png') {
      processedBuffer = await image.png({ quality: 90, compressionLevel: 8 }).toBuffer();
    } else if (metadata.format === 'webp') {
      processedBuffer = await image.webp({ quality: 85 }).toBuffer();
    } else {
      processedBuffer = await image.jpeg({ quality: 85, progressive: true }).toBuffer();
    }

    await fs.promises.writeFile(destinationPath, processedBuffer);

    const relativePath = `${config.storage.uploadDir}/${filename}`;
    const url = `/uploads/${filename}`;

    return {
      filename,
      storagePath: relativePath,
      url,
      sizeBytes: processedBuffer.length,
      mimeType: `image/${ext}`,
      width: metadata.width,
      height: metadata.height,
    };
  }

  async deleteFile(storagePath: string): Promise<boolean> {
    const fullPath = path.resolve(process.cwd(), storagePath);
    // Prevent path traversal outside uploadDir
    if (!fullPath.startsWith(this.uploadDir)) {
      return false;
    }

    if (fs.existsSync(fullPath)) {
      await fs.promises.unlink(fullPath);
      return true;
    }
    return false;
  }

  async getFileStream(storagePath: string) {
    const fullPath = path.resolve(process.cwd(), storagePath);
    if (!fullPath.startsWith(this.uploadDir) || !fs.existsSync(fullPath)) {
      throw ApiError.notFound('Tasvir fayli topilmadi');
    }
    return fs.createReadStream(fullPath);
  }

  getFileUrl(storagePath: string): string {
    const filename = path.basename(storagePath);
    return `/uploads/${filename}`;
  }
}
