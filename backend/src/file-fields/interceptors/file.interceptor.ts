import {
  CallHandler,
  ExecutionContext,
  Injectable,
  mixin,
  NestInterceptor,
  Type,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { transformException } from '@nestjs/platform-express/multer/multer/multer.utils';
import multer from 'multer';
import { FILE_DIRECTORY } from '../../app.constants';
import { FileStorage } from '../../file/file.storage';
import { FileFieldService } from '../file-field.service';

/**
 * Adaptation from the NestJS FileInterceptor to allow for custom folder paths.
 *
 * @param field Multipart Form field to extract the file from.
 */
export function FileInterceptor(): Type<NestInterceptor> {
  @Injectable()
  class MixinInterceptor implements NestInterceptor {
    constructor(
      private readonly fileFieldService: FileFieldService,
      private readonly config: ConfigService,
    ) {}

    async intercept(context: ExecutionContext, next: CallHandler) {
      const ctx = context.switchToHttp();
      const req = ctx.getRequest();
      const res = ctx.getResponse();

      const fileField = await this.fileFieldService.findOneOrFail({
        name: req.params.name,
      });
      const fileStorage = new FileStorage(
        this.config.get(FILE_DIRECTORY),
        fileField.folder,
      );

      await fileStorage.ensureDirectory();

      await new Promise((resolve, reject) => {
        const storage = multer.diskStorage({
          destination: function (req, file, callback) {
            callback(null, fileStorage.path);
          },
          filename: function (req, file, callback) {
            callback(null, `${Date.now()}-${file.originalname}`);
          },
        });

        multer({ storage, fileFilter: fileField.fileFilter }).single(
          fileField.name,
        )(req, res, (err: any) => {
          if (err) {
            const error = transformException(err);
            return reject(error);
          }
          resolve();
        });
      });

      return next.handle();
    }
  }

  const Interceptor = mixin(MixinInterceptor);
  return Interceptor as Type<NestInterceptor>;
}
