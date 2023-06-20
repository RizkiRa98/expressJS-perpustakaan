import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { User } from 'src/models/entities/users';

interface UserRequest extends Request {
  userId?: number;
  name?: string;
  email?: string;
  role?: 'super admin' | 'admin';
}

@Injectable()
export class VerifyToken implements NestMiddleware {
  async use(req: UserRequest, res: Response) {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader && authHeader.split(' ')[1];
      if (!token) {
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
    } catch (error) {
      return console.log(error);
    }
  }
}
