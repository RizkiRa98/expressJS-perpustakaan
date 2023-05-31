/* eslint-disable @typescript-eslint/no-explicit-any */
import {Request, Response} from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {Login} from '../controllers/Users/loginUsers';
import {Logout} from '../controllers/Users/logoutUsers';
import Users from '../models/userModel';

// Mock dependecies
jest.mock('bcrypt');
jest.mock('jsonwebtoken');
jest.mock('../models/userModel');

// Unit test untuk fungsi login
describe('Login', () => {
  let req: Request;
  let res: Response;

  beforeEach(() => {
    // Reset mocks dan request/response
    req = {} as Request;
    res = {
      json: jest.fn(),
      status: jest.fn(),
      cookie: jest.fn(),
    } as unknown as Response;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Case 1 jika email salah
  it('should handle invalid email', async () => {
    req.body = {
      email: 'nonexistent@example.com',
      password: 'password',
    };
    // Mock Users.findAll untuk return empty array
    (Users.findAll as jest.Mock).mockResolvedValueOnce([]);

    await Login(req, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  // Case 2 jika password salah
  it('should handle invalid password', async () => {
    const mockUser = {
      id: 1,
      name: 'Test User',
      email: 'test@example.com',
      role: 'user',
      password: 'hashed_password',
    };

    // Mock Users.findAll untuk return empty array
    (Users.findAll as jest.Mock).mockResolvedValueOnce([mockUser]);

    // Mock bcrypt.compare untuk mereturn false
    (bcrypt.compare as jest.Mock).mockResolvedValueOnce(false);

    req.body = {
      email: 'existing@example.com',
      password: 'wrong-password',
    };
    await Login(req as Request, res as Response);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  // Case 3 Jika berhasil login
  it('should handle successful login', async () => {
    const mockUser = {
      id: '1',
      name: 'John Doe',
      email: 'existing@example.com',
      role: 'user',
      password: 'hashed-password',
    };

    const mockAccessToken = 'mock-access-token';
    const mockRefreshToken = 'mock-refresh-token';

    (Users.findAll as jest.Mock).mockResolvedValue([mockUser]);
    (bcrypt.compare as jest.Mock).mockReturnValue(true);
    (jwt.sign as jest.Mock)
      .mockReturnValueOnce(mockAccessToken)
      .mockReturnValueOnce(mockRefreshToken);

    req.body = {
      email: 'existing@example.com',
      password: 'correct-password',
    };

    await Login(req, res);

    expect(res.status).not.toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({accessToken: mockAccessToken});
    expect(res.cookie).toHaveBeenCalledWith('refreshToken', mockRefreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
  });
});
// END fungsi login

// Unit test fungsi logout
// Mock dependencies
jest.mock('../models/userModel', () => ({
  findAll: jest.fn(),
  update: jest.fn(),
}));

describe('Logout Controller', () => {
  let req: Request;
  let res: Response;

  beforeEach(() => {
    req = {
      cookies: {
        refreshToken: 'validRefreshToken',
      },
    } as unknown as Request;
    res = {
      status: jest.fn().mockReturnThis(),
      clearCookie: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Case 1 jika logout berhasil
  it('should clear refresh token and return success message', async () => {
    const userId = 1;
    const user = {
      id: userId,
    };

    // Mock Users.findAll berdasarkan id
    (Users.findAll as jest.Mock).mockResolvedValueOnce([user]);

    await Logout(req, res);

    expect(Users.findAll).toHaveBeenCalledWith({
      where: {
        refresh_token: req.cookies?.refreshToken,
      },
    });
    expect(Users.update).toHaveBeenCalledWith(
      {refresh_token: null},
      {
        where: {id: userId},
      },
    );

    expect(res.clearCookie).toHaveBeenCalledWith('refreshToken');
    expect(res.json).toHaveBeenCalledWith({
      msg: 'Berhasil Logout',
    });
  });

  // Case 2 jika refresh token tidak ada
  it('should return 204 when refresh token doesnt exists', async () => {
    // set refresh token menjadi undifined
    req.cookies.refreshToken = undefined;

    await Logout(req, res);

    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.json).not.toHaveBeenCalled();
    expect(Users.findAll).not.toHaveBeenCalled();
    expect(Users.update).not.toHaveBeenCalled();
    expect(res.clearCookie).not.toHaveBeenCalled();
  });

  // Case 3 jika refresh token tidak cocok dengan yang di database
  it('should return 204 when refresh token doesnt match database', async () => {
    (Users.findAll as jest.Mock).mockResolvedValueOnce([]);

    await Logout(req, res);

    expect(res.status).toHaveBeenCalledWith(204);
    expect(Users.findAll).toHaveBeenCalledWith({
      where: {
        refresh_token: req.cookies?.refreshToken,
      },
    });
    expect(Users.update).not.toHaveBeenCalled();
    expect(res.clearCookie).not.toHaveBeenCalled();
  });
});

