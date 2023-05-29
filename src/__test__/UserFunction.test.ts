/* eslint-disable max-len */
import {createUser} from '../controllers/Users/createUsers';
import {Request, Response} from 'express';
import bcrypt from 'bcrypt';
import validator from 'validator';
import Users from '../models/userModel';
import {getUser} from '../controllers/Users/getUsers';

// Mocking request dan response untuk objects
const mockRequest = (params = {}): Request =>
  ({
    ...params,
  } as Request);

const mockResponse = (): Response => {
  const res: Response = {} as Response;
  res.json = jest.fn().mockReturnValue(res);
  res.status = jest.fn().mockReturnValue(res);
  return res;
};

// Mock lokasi models
jest.mock('../models/userModel', () => ({
  findOne: jest.fn(),
  create: jest.fn(),
}));

// Create User Function
describe('createUser', () => {
  let req: Request;
  let res: Response;

  beforeEach(() => {
    req = {} as Request;
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    } as unknown as Response;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Case 1 jika format email salah
  it('should return if the email format is invalid', async () => {
    req.body = {
      name: 'John Doe',
      email: 'invalidemail',
      password: 'password',
      confPassword: 'password',
      role: 'super admin',
    };

    await createUser(req, res);

    // Ekspetasi yang diharapkan
    expect(validator.isEmail('invalidemail')).toEqual(false);
    expect(res.status).toBeCalledWith(400);
    expect(res.json).toBeCalledWith({msg: 'Format Email Salah'});
  });

  // Case 2 jika email sudah digunakan
  it('should return if the email is already used', async () => {
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(true);
    (Users.findOne as jest.Mock).mockReturnValueOnce({});

    req.body = {
      name: 'John Doe',
      email: 'test@example.com',
      password: 'password',
      confPassword: 'password',
      role: 'super admin',
    };

    await createUser(req, res);
    expect(Users.findOne).toHaveBeenCalledWith({
      where: {
        email: 'test@example.com',
      },
    });

    // Ekspetasi yang diharapkan
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({msg: 'Email Sudah Digunakan'});
  });

  // Case 3 jika password dan confirm password berbeda
  it('should return if password and conf password do not match', async () => {
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(true);
    req.body = {
      name: 'John Doe',
      email: 'test@example.com',
      password: 'password1',
      confPassword: 'password2',
      role: 'super admin',
    };

    await createUser(req, res);

    // Ekspetasi yang diharapkan
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      msg: 'Password dan Confirm Password Berbeda',
    });
  });

  // Case 4 jika role bukan super admin atau admin
  it('should return if role it not super admin or admin', async () => {
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(true);

    req.body = {
      name: 'John Doe',
      email: 'test@example.com',
      password: 'password',
      confPassword: 'password',
      role: 'invalid role',
    };

    await createUser(req, res);

    // Ekspetasi yang diharapkan
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      msg: 'Nama role harus super admin atau admin',
    });
  });

  // Case 5 jika create user berhasil
  it('should create user and return if all validations pass', async () => {
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(true);
    // jest.spyOn(bcrypt, 'genSalt').mockResolvedValueOnce('salt');
    jest.spyOn(bcrypt, 'genSalt').mockImplementationOnce(async () => 'salt');
    jest
      .spyOn(bcrypt, 'hash')
      .mockImplementationOnce(async () => 'hashedPassword');

    (Users.findOne as jest.Mock).mockReturnValueOnce(null);

    req.body = {
      name: 'John Doe',
      email: 'test@example.com',
      password: 'password',
      confPassword: 'password',
      role: 'super admin',
    };

    await createUser(req, res);

    // Ekspetasi yang diharapkan
    expect(Users.create).toHaveBeenCalledWith({
      name: 'John Doe',
      email: 'test@example.com',
      password: 'hashedPassword',
      role: 'super admin',
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      msg: 'Registrasi Berhasil',
    });
  });
});

// End Create User Function

// Get User Function
describe('getUser', () => {
  it('should return all users data', async () => {
    const mockUsers = [
      {
        id: 1,
        name: 'John Doe',
        email: 'johndoe@example.com',
        role: 'super admin',
        createdAt: new Date(),
      },
      {
        id: 2,
        name: 'Jane Smith',
        email: 'janesmith@example.com',
        role: 'admin',
        createdAt: new Date(),
      },
    ];

    (Users.findAll as jest.Mock).mockResolvedValueOnce(mockUsers);

    const req = mockRequest();
    const res = mockResponse();

    await getUser(req, res);

    // Ekpetasi yang diharapkan
    expect(Users.findAll).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockUsers);
  });
});

