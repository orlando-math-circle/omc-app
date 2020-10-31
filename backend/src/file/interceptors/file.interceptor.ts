import {
  CallHandler,
  ExecutionContext,
  Inject,
  mixin,
  NestInterceptor,
  Type,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CONFIGURATION_SERVICE_TOKEN } from '@nestjs/config/dist/config.constants';
import { transformException } from '@nestjs/platform-express/multer/multer/multer.utils';
import multer from 'multer';
import { extname } from 'path';
import { FILE_DIRECTORY } from '../../app.constants';
import { FileStorage } from '../file.storage';

type MulterInstance = any;

/**
 * Adaptation from the NestJS FileInterceptor to allow for custom folder paths.
 *
 * @param field Multipart Form field to extract the file from.
 */
export function FileInterceptor(
  field: string,
  folder?: string,
  limits?: multer.Options['limits'],
): Type<NestInterceptor> {
  class MixinInterceptor implements NestInterceptor {
    protected multer: MulterInstance;
    private fileStorage: FileStorage;

    constructor(@Inject(CONFIGURATION_SERVICE_TOKEN) config: ConfigService) {
      const fileStorage = new FileStorage(config.get(FILE_DIRECTORY), folder);

      this.multer = multer({
        storage: multer.diskStorage({
          destination(request, file, callback) {
            callback(null, fileStorage.path);
          },
          filename(request, file, callback) {
            callback(
              null,
              `${file.fieldname}-${Date.now()}${extname(file.originalname)}`,
            );
          },
        }),
        limits,
      });

      this.fileStorage = fileStorage;
    }

    async intercept(context: ExecutionContext, next: CallHandler) {
      const ctx = context.switchToHttp();

      await this.fileStorage.ensureDirectory();

      await new Promise((resolve, reject) =>
        this.multer.single(field)(
          ctx.getRequest(),
          ctx.getResponse(),
          (error: any) => {
            if (error) {
              const err = transformException(error);
              return reject(err);
            }
            resolve();
          },
        ),
      );
      return next.handle();
    }
  }

  const Interceptor = mixin(MixinInterceptor);
  return Interceptor as Type<NestInterceptor>;
}
