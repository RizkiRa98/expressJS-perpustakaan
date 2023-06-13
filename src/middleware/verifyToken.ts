// Middleware application level
import {Request, Response, NextFunction} from 'express';
import Users from '../models/userModel';
import jwt from 'jsonwebtoken';

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
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    res.status(401).json({msg: 'Unauthorize, anda belum login!'});
    return;
  }

  try {
    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

    if (!accessTokenSecret) {
      throw new Error('Access token secret is not defined');
    }
    const decoded = jwt.verify(token, accessTokenSecret) as unknown as {
      userId: number;
      email: string;
      name: string;
      role: 'super admin' | 'admin';
    };

    const user = await Users.findOne({
      where: {
        email: decoded.email,
      },
    });

    if (!user) {
      res.status(404).json({msg: 'Anda Belum Login!'});
      return;
    }
    // req.userId = user.id as number;
    // req.name = user.name;
    // req.email = user.email;
    // req.role = user.role;
    req.userId = decoded.userId;
    req.name = decoded.name;
    req.email = decoded.email;
    req.role = decoded.role;
    next();
  } catch (error) {
    res.status(401).json({msg: 'Token tidak valid!'});
  }
};

