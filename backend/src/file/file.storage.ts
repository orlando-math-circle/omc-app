import fs from 'fs';

const { mkdir } = fs.promises;

export class FileStorage {
  public base: string;
  public folder?: string;
  public path: string;

  constructor(base: string, folder?: string) {
    this.base = base;

    // Ensures a consistent trailing slash.
    if (base[base.length - 1] !== '/') {
      this.base += '/';
    }

    if (folder) {
      this.folder = folder.charAt(0) === '/' ? folder.substring(1) : folder;
      this.path = this.base + this.folder;
    } else {
      this.path = this.base;
    }

    console.log(this.base, this.folder, this.path);
  }

  async ensureDirectory() {
    await mkdir(this.path, { recursive: true });
  }
}
