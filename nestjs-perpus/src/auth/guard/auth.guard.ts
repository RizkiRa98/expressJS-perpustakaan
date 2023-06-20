import { AuthGuard } from '@nestjs/passport';
import { Request, Response, NextFunction } from 'express';
import { User } from 'src/models/entities/users';

interface UserRequest extends Request {
  userId?: number;
  name?: string;
  email?: string;
  role?: 'super admin' | 'admin';
}
export class JwtGuard extends AuthGuard('jwt') {
  constructor() {
    super();
  }
  async use(req: UserRequest, res: Response, next: NextFunction) {
    // const authHeader = req.headers.authorization;
    // const token = authHeader && authHeader.split(' ')[1];
    if (!req.cookies.refreshToken) {
      res.status(401).json({
        msg: 'Unathorize, anda belum login!',
      });
    }

    const user = await User.findOne({
      where: { refresh_token: req.cookies.refreshToken },
    });

    if (!user) {
      res.status(404).json({
        msg: 'Anda Belum Login!',
      });
      return;
    }

    req.userId = user.id;
    req.name = user.name;
    req.email = user.email;
    req.role = user.role;
    next();
  }
}
