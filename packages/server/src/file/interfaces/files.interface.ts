import { MulterFile } from './multer-file.interface';

export interface Field {
  [field: string]: MulterFile;
}
