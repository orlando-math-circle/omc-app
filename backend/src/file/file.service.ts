import { EntityRepository, FilterQuery } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import fs from 'fs';
import { basename, extname, resolve } from 'path';
import rimraf from 'rimraf';
import { promisify } from 'util';
import { ConfigSchema } from '../app.config';
import { User } from '../user/user.entity';
import { File } from './file.entity';
import { MulterFile } from './interfaces/multer-file.interface';

const { readdir, lstat, mkdir, unlink } = fs.promises;
const rmrf = promisify(rimraf);

@Injectable()
export class FileService {
  private readonly logger = new Logger(FileService.name);
  private readonly path: fs.PathLike;

  constructor(
    @InjectRepository(File)
    private readonly fileRepository: EntityRepository<File>,
    private readonly config: ConfigService<ConfigSchema>,
  ) {
    this.path = resolve(config.get('FILE_DIRECTORY'));
  }

  async create(
    metadata: MulterFile | MulterFile[],
    userOrId: User | number,
    persist = true,
  ) {
    const metadatas = Array.isArray(metadata) ? metadata : [metadata];

    const files = metadatas.map((metadata) =>
      this.fileRepository.create({
        name: metadata.filename,
        originalName: metadata.originalname,
        size: metadata.size,
        mimetype: metadata.mimetype,
        destination: metadata.destination,
        path: metadata.path.replace(/\\/g, '/'),
        root: metadata.path
          .replace(/\\/g, '/')
          .replace(this.config.get('FILE_DIRECTORY'), ''),
        author: userOrId,
      }),
    );

    if (persist) {
      await this.fileRepository.persist(files).flush();
    }

    if (Array.isArray(metadata)) {
      return files;
    } else {
      return files[0];
    }
  }

  async findOneOrFail(where: FilterQuery<File>) {
    return this.fileRepository.findOneOrFail(where);
  }

  async getDirectory(path: fs.PathLike) {
    const dirent = await lstat(path);

    if (dirent.isDirectory()) {
      return dirent;
    }

    throw new NotFoundException('Not a directory');
  }

  async getPathContents(path = this.path) {
    let pathStr = path.toString();
    const directories = [],
      files = [];

    if (pathStr[pathStr.length - 1] !== '/') {
      pathStr += '/';
    }

    const dirents = await readdir(pathStr, { withFileTypes: true });

    for (const dirent of dirents) {
      const direntPath = pathStr.toString() + dirent.name;

      if (dirent.isFile()) {
        const stat = await lstat(direntPath);

        files.push({
          path: direntPath,
          size: stat.size,
          ext: extname(direntPath).slice(1),
          name: basename(direntPath, '.' + extname(direntPath).slice(1)),
          type: 'file',
        });
      } else if (dirent.isDirectory()) {
        directories.push({
          path: direntPath,
          name: basename(direntPath),
          type: 'directory',
        });
      }
    }

    return {
      directories,
      files,
    };
  }

  createDirectory(path: fs.PathLike) {
    return mkdir(path, { recursive: true });
  }

  async deletePath(path: fs.PathLike) {
    try {
      const stat = await lstat(path);

      if (stat.isDirectory()) {
        await rmrf(path.toString());
      } else if (stat.isFile()) {
        await unlink(path);
      }
    } catch (error) {
      this.logger.error(error);
    }
  }

  async delete(where: FilterQuery<File>) {
    const file = await this.fileRepository.findOneOrFail(where);

    return this.fileRepository.remove(file).flush();
  }
}
