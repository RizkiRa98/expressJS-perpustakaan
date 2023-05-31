/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable max-len */
import {createUser} from '../controllers/Users/createUsers';
import {getUser, getUserById} from '../controllers/Users/getUsers';
import {deleteUser} from '../controllers/Users/deleteUsers';
import {updateUser} from '../controllers/Users/updateUsers';
import {Request, Response} from 'express';
import bcrypt from 'bcrypt';
import validator from 'validator';
import Users from '../models/userModel';
import {WhereOptions} from 'sequelize';

// Mock lokasi models
jest.mock('../models/userModel', () => ({
  findOne: jest.fn(),
  create: jest.fn(),
  destroy: jest.fn(),
  update: jest.fn(),
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

// Get All User Function
describe('getUser', () => {
  let req: Request;
  let res: Response;

  beforeEach(() => {
    req = {} as Request;
    res = {
      json: jest.fn(),
    } as unknown as Response;
  });
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
    Users.findAll = jest.fn().mockResolvedValue(mockUsers);

    await getUser(req, res);

    // Ekpetasi yang diharapkan
    expect(Users.findAll).toHaveBeenCalled();
    // expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockUsers);
  });
});
// END Get All User

// Get Users by Id
describe('getUserById', () => {
  let req: Request;
  let res: Response;

  beforeEach(() => {
    req = {
      params: {id: '1'},
    } as unknown as Request;
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
  });

  // Case 1 jika user ada
  it('should return users data by id requested', async () => {
    const mockUsers = {
      id: '1',
      name: 'John Doe',
      email: 'johndoe@example.com',
      role: 'super admin',
      createdAt: new Date(),
    };

    Users.findOne = jest.fn().mockResolvedValue(mockUsers);

    await getUserById(req, res);

    // Ekspetasi yang diharapkan
    expect(Users.findOne).toHaveBeenCalledWith({
      attributes: ['id', 'name', 'email', 'role', 'createdAt'],
      where: {id: req.params.id} as WhereOptions<Users>,
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockUsers);
  });

  // Case 2 jika user tidak ada
  it('should return status 404 if user is not found', async () => {
    Users.findOne = jest.fn().mockResolvedValue(null);

    await getUserById(req, res);

    // ekspetasi yang diharapkan
    expect(Users.findOne).toHaveBeenCalledWith({
      attributes: ['id', 'name', 'email', 'role', 'createdAt'],
      where: {id: req.params.id} as WhereOptions<Users>,
    });
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      msg: 'User tidak ditemukan',
    });
  });
});
// END Get User By Id

// Delete User By Id
// interface custom request untuk request role dan params id
interface MockRequest extends Request {
  role: 'super admin' | 'admin';
  params: {id: string};
}
describe('deleteUser', () => {
  let req: MockRequest;
  let res: Response;

  beforeEach(() => {
    req = {
      params: {id: '1'},
      role: 'super admin',
    } as MockRequest;
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
  });

  // Case 1 berhasil delete user jika user ada
  it('should delete user and success message if user exist and requester is super admin', async () => {
    const user = {id: 1};
    (Users.findOne as jest.Mock).mockResolvedValue(user);

    await deleteUser(req, res);

    expect(Users.findOne).toHaveBeenCalledWith({
      where: {id: req.params.id} as WhereOptions<Users>,
    });
    expect(Users.destroy).toHaveBeenCalledWith({
      where: {id: user.id} as WhereOptions<Users>,
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      msg: `User dengan Id ${req.params.id} berhasil dihapus`,
    });
  });

  // Case 2 jika user yang request tidak ditemukan
  it('should send 404 status and "User not found" message if user does not exist', async () => {
    // JIka hasil mock kosong gunakan null
    (Users.findOne as jest.Mock).mockResolvedValue(null);

    await deleteUser(req, res);

    // ekspetasi yang diharapkan
    expect(Users.findOne).toHaveBeenCalledWith({
      where: {id: req.params.id},
    });
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      msg: `User dengan id ${req.params.id} tidak ditemukan`,
    });
  });

  // case 3 jika role request bukan super admin
  it('should return status 403 and "Access denied" message if requester is not super admin', async () => {
    // User yang di request dengan id 1
    const user = {id: 1};
    (Users.findOne as jest.Mock).mockResolvedValue(user);

    // mock role yang di request
    req.role = 'admin';

    await deleteUser(req, res);

    // Ekspetasi yang diharapkan
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      msg: 'Akses ditolak! Role admin tidak bisa menghapus user.',
    });
  });
});
// END delete user

// Update User
describe('updateUser', () => {
  let req: Request;
  let res: Response;

  beforeEach(() => {
    req = {
      params: {id: '1'},
      body: {},
    } as unknown as Request;
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Case 1 Jika user yang di request tidak ada
  it('should return status 404 and "Users not found" message if user is not found', async () => {
    // Mock User.findOne untuk return null
    // Nilai null menindikasi user tidak ditemukan
    (Users.findOne as jest.Mock).mockResolvedValue(null);

    await updateUser(req, res);

    expect(Users.findOne).toHaveBeenCalledWith({
      where: {id: req.params.id} as WhereOptions<Users>,
    });
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      msg: `User dengan id ${req.params.id} tidak ditemukan`,
    });
  });

  // Case 2 Jika email yang di request format nya invalid
  it('should return status 400 and "Invalid email format" message if email format is invalid ', async () => {
    // Mock User.findOne untuk return data user
    (Users.findOne as jest.Mock).mockResolvedValue({
      id: '1',
    });

    req.body.email = 'invalid-email';

    await updateUser(req, res);

    expect(Users.findOne).toHaveBeenCalledWith({
      where: {id: req.params.id} as WhereOptions<Users>,
    });
    expect(validator.isEmail).toHaveBeenCalledWith(req.body.email);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      msg: 'Format Email Salah',
    });
  });

  // Case 3 Jika email sudah digunakan
  it('should return status 400 and "Email is already used" message if user is already used', async () => {
    // jest.spyOn(Users, 'update');
    const existingUser = {
      id: '2',
      email: 'existing-email@example.com',
    };

    // mock Users.findOne untuk return user yang memiliki email yang sama
    (Users.findOne as jest.Mock).mockResolvedValue(existingUser.email);

    req.body.email = existingUser.email;

    await updateUser(req, res);

    expect(Users.findOne).toHaveBeenCalledWith({
      where: {id: req.params.id} as WhereOptions<Users>,
    });
    expect(Users.findOne).toHaveBeenCalledWith({
      where: {email: req.body.email},
    });
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      msg: `Email ${req.body.email} sudah digunakan`,
    });
  });

  // Case 4 update user berhasil
  it('should update user and return status 200 and success message', async () => {
    // jest.spyOn(Users, 'update');
    const user = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password',
      role: 'admin',
    };
    const updatedUser = {
      id: '1',
      name: 'Updated Name',
      email: 'updated-email@example.com',
      password: 'password',
      role: 'admin',
    };

    // Mock Users.findOne to return user data
    (Users.findOne as jest.Mock).mockResolvedValue(user);

    // Request body
    req.body.name = updatedUser.name;
    req.body.email = updatedUser.email;
    req.body.password = 'new-password';
    req.body.confPassword = 'new-password';
    req.body.role = updatedUser.role;

    await updateUser(req, res);

    // Expectations
    expect(Users.findOne).toHaveBeenCalledWith({
      where: {id: req.params.id} as WhereOptions<Users>,
    });
    expect(Users.update).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      msg: `User dengan id ${req.params.id} berhasil di update`,
    });
  });
});

// END update user

