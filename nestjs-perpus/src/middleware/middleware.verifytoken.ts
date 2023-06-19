import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { User } from 'src/models/entities/users';
import * as jwt from 'jsonwebtoken';

interface UserRequest extends Request {
  userId?: number;
  name?: string;
  email?: string;
  role?: 'super admin' | 'admin';
}

@Injectable()
export class VerifyToken implements NestMiddleware {
  async use(req: UserRequest, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
      res.status(401).json({
        msg: 'Unathorize, anda belum login!',
      });
    }

    try {
      const accessTokenSeccret = process.env.ACCESS_TOKEN_SECRET;

      if (!accessTokenSeccret) {
        throw new Error('Access token secret is not defined');
      }
      const decoded = jwt.verify(token, accessTokenSeccret) as unknown as {
        userId: number;
        email: string;
        name: string;
        role: 'super admin' | 'admin';
      };

      const user = await User.findOne({
        email: decoded.email,
      } as any);

      if (!user) {
        res.status(404).json({
          msg: 'Anda Belum Login!',
        });
        return;
      }

      req.userId = decoded.userId;
      req.name = decoded.name;
      req.email = decoded.email;
      req.role = decoded.role;
      next();
    } catch (error) {
      res.status(401).json({
        msg: 'Token tidak valid!',
      });
    }
  }
}
