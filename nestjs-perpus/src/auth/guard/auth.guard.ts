import { AuthGuard } from '@nestjs/passport';
import {
  CanActivate,
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
// import { User } from 'src/models/entities/users';
import * as jwt from 'jsonwebtoken';
import { Observable } from 'rxjs';

// Menambahkan custom request menggunakan interface
interface UserRequest extends Request {
  userId?: number;
  name?: string;
  email?: string;
  role?: 'super admin' | 'admin';
}

@Injectable()
export class JwtGuard extends AuthGuard('jwt') implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<UserRequest>();
    const authHeader = request.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('Unauthorze, anda belum login');
    }

    try {
      const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

      if (!accessTokenSecret) {
        throw new Error('Access token secret is not defined');
      }

      const decoded = jwt.verify(token, accessTokenSecret) as {
        userId: number;
        email: string;
        name: string;
        role: 'super admin' | 'admin';
      };

      request.userId = decoded.userId;
      request.name = decoded.name;
      request.email = decoded.email;
      request.role = decoded.role;

      return super.canActivate(context);
    } catch (error) {
      console.log(error);

      throw new UnauthorizedException('Token tidak valid!');
    }
  }
}
