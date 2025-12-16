import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { map } from 'rxjs/operators';

@Injectable()
export class EmptyToNullInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest();

    if (request.body && typeof request.body === 'object') {
      for (const [key, value] of Object.entries(request.body)) {
        if (value === '') request.body[key] = null;
      }
    }

    return next.handle().pipe(map((data) => data));
  }
}
