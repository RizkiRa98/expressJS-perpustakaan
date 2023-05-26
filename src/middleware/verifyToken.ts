// Middleware application level
import {Request, Response, NextFunction} from 'express';
import Users from '../models/userModel';

// Menambahkan custom request menggunakan interface
interface UserRequest extends Request {
  userId?: number;
  name?: string;
  email?: string;
  role?: 'super admin' | 'admin';
}

export const verifyToken = async (
  req: UserRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  if (!req.cookies.refreshToken) {
    res.status(401).json({msg: 'Unauthorize, anda belum login!'});
    return;
  }

  const user = await Users.findOne({
    where: {
      refresh_token: req.cookies.refreshToken,
    },
  });

  if (!user) {
    res.status(404).json({msg: 'Anda Belum Login!'});
    return;
  }
  req.userId = user.id as number;
  req.name = user.name;
  req.email = user.email;
  req.role = user.role;
  next();
};

