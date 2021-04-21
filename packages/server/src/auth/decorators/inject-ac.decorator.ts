import { Inject } from '@nestjs/common';
import { ACCESS_CONTROL_TOKEN } from '../../app.constants';

export const InjectAC = () => Inject(ACCESS_CONTROL_TOKEN);
