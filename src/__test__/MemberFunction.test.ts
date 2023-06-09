import {Request, Response} from 'express';
import Member from '../models/memberModel';
import {WhereOptions} from 'sequelize';
import {getMember, getMemberById} from '../controllers/Members/getMembers';
import {addMember} from '../controllers/Members/createMembers';
import {deleteMember} from '../controllers/Members/deleteMembers';
import {updateMember} from '../controllers/Members/updateMembers';
import validator from 'validator';

jest.mock('../models/memberModel', () => ({
  findAll: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  destroy: jest.fn(),
  update: jest.fn(),
}));

// Function get all member
describe('getMember', () => {
  let req: Request;
  let res: Response;

  beforeEach(() => {
    req = {} as Request;
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Case 1 berhasil return member
  it('should return data members', async () => {
    const members = [
      {
        id: 1,
        name: 'John Doe',
        email: 'johndoe@example.com',
        phone: '1234567890',
        createdAt: new Date(),
      },
      {
        id: 2,
        name: 'Jone Do',
        email: 'janedo@example.com',
        phone: '0987654321',
        createdAt: new Date(),
      },
    ];

    (Member.findAll as jest.Mock).mockResolvedValueOnce(members);

    await getMember(req, res);

    expect(Member.findAll).toHaveBeenCalledWith({
      attributes: ['id', 'name', 'email', 'phone', 'createdAt'],
    });
    expect(res.json).toHaveBeenCalledWith(members);
  });
});
// End get all member

// Get member by id
describe('getMemberById', () => {
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
  it('should return member data by id requested', async () => {
    // Mock data member
    const mockMember = {
      id: '1',
      name: 'John Doe',
      email: 'jonhndoe@example.com',
      phone: '1234567890',
      createdAt: new Date(),
    };

    (Member.findOne as jest.Mock).mockResolvedValue(mockMember);

    await getMemberById(req, res);

    // Ekspetasi yang diharapkan
    expect(Member.findOne).toHaveBeenCalledWith({
      attributes: ['id', 'name', 'email', 'phone', 'createdAt'],
      where: {id: req.params.id} as WhereOptions<Member>,
    });
    expect(res.json).toHaveBeenCalledWith(mockMember);
  });

  // Case 2 jika member tidak ditemukan
  it('should return status 404 if user is not found', async () => {
    // Mock memmber findOne dengan return null
    (Member.findOne as jest.Mock).mockResolvedValue(null);

    await getMemberById(req, res);

    // ekspetasi yang diharapkan
    expect(Member.findOne).toHaveBeenCalledWith({
      attributes: ['id', 'name', 'email', 'phone', 'createdAt'],
      where: {id: req.params.id} as WhereOptions<Member>,
    });
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      msg: 'Member Tidak Ditemukan',
    });
  });
});

// END get member by id

// Create Member
describe('createMember', () => {
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
  it('should return if email format is invalid', async () => {
    req.body = {
      name: 'John Doe',
      email: 'invalidemail',
      phone: '08153712481',
    };

    await addMember(req, res);

    // Ekspetasi yang diharapkan
    expect(validator.isEmail('invalidemail')).toEqual(false);
    expect(res.status).toBeCalledWith(400);
    expect(res.json).toBeCalledWith({
      msg: 'Format Email Salah',
    });
  });

  // Case 2 jika format phone salah
  it('should return if phone format is invalid', async () => {
    req.body = {
      name: 'John Doe',
      email: 'johndoe@example.com',
      phone: '1234567890',
    };

    await addMember(req, res);

    // Ekspetasi yang diharapkan
    expect(validator.isMobilePhone('1234567890', 'id-ID')).toEqual(false);
    expect(res.status).toBeCalledWith(400);
    expect(res.json).toBeCalledWith({
      msg: 'Format Nomor Hp Salah! Gunakan format Nomor Indonesia (08)',
    });
  });

  // Case 3 cek email sudah digunakan
  it('should return if email is already used', async () => {
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(true);
    (Member.findOne as jest.Mock).mockReturnValueOnce({});

    req.body = {
      name: 'John Doe',
      email: 'johndoe@example.com',
      phone: '08153712481',
    };

    await addMember(req, res);

    // Ekspetasi yang diharapkan
    expect(Member.findOne).toHaveBeenCalledWith({
      where: {
        email: 'johndoe@example.com',
      },
    });
  });

  // Case 4 jika add member berhasil
  it('should create member and return if all validation pass', async () => {
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(true);
    jest.spyOn(validator, 'isMobilePhone').mockReturnValueOnce(true);

    (Member.findOne as jest.Mock).mockReturnValueOnce(null);

    req.body = {
      name: 'john Doe',
      email: 'johndoe@example.com',
      phone: '08153712481',
    };

    await addMember(req, res);

    // Ekspetasi yang diharapkan
    expect(Member.create).toHaveBeenCalledWith({
      name: 'john Doe',
      email: 'johndoe@example.com',
      phone: '08153712481',
    });
    expect(res.json).toHaveBeenCalledWith({
      msg: 'Registrasi Member Baru Berhasil',
    });
  });
});
// END Create Member

// Delete member by id
describe('deleteMember', () => {
  let req: Request;
  let res: Response;

  beforeEach(() => {
    req = {
      params: {id: '1'},
    } as unknown as Request;
    res = {
      json: jest.fn(),
    } as unknown as Response;
  });

  // Case 1 return semua data member
  it('should delete member and return success message', async () => {
    const member = {
      id: 1,
    };
    (Member.findOne as jest.Mock).mockResolvedValue(member);

    await deleteMember(req, res);

    expect(Member.findOne).toHaveBeenCalledWith({
      where: {
        id: req.params.id,
      } as WhereOptions<Member>,
    });
    expect(Member.destroy).toHaveBeenCalledWith({
      where: {
        id: member.id,
      } as WhereOptions<Member>,
    });
    // expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      msg: `Member dengan Id ${req.params.id} berhasil dihapus`,
    });
  });

  // Case 2 jika member tidak ditemukan
  it('should send 404 status and message if user doesnt exist', async () => {
    // Member findOne dengan value null
    (Member.findOne as jest.Mock).mockResolvedValue(null);

    await deleteMember(req, res);

    // ekspetasi yang diharapkan
    expect(Member.findOne).toHaveBeenCalledWith({
      where: {
        id: req.params.id,
      },
    });
    expect(res.json).toHaveBeenCalledWith({
      msg: `Member dengan id ${req.params.id} tidak ditemukan`,
    });
  });
});
// END Delete member by id

// Update member
describe('updateMember', () => {
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

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Case 1 update member dan return pesan berhasil
  it('should update member and return success message', async () => {
    const member = {
      id: '1',
      name: 'John Doe',
      email: 'janedoe@example.com',
      phone: '08153712481',
    };
    req.body = {
      name: 'John Doe',
      email: 'johndoe@example.com',
      phone: '081234567890',
    };

    // Mock member findOne
    (Member.findOne as jest.Mock).mockResolvedValueOnce(member);

    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(true);
    (Member.findOne as jest.Mock).mockResolvedValueOnce(null);

    jest.spyOn(validator, 'isMobilePhone').mockReturnValueOnce(true);

    (Member.update as jest.Mock).mockResolvedValueOnce([1]);

    await updateMember(req, res);

    expect(Member.findOne).toHaveBeenCalledWith({
      where: {
        id: req.params.id,
      },
    });
    expect(validator.isEmail).toHaveBeenCalledWith(req.body.email);
    expect(Member.findOne).toHaveBeenCalledWith({
      where: {email: req.body.email},
    });
    expect(validator.isMobilePhone).toHaveBeenCalledWith(
      req.body.phone,
      'id-ID',
    );
    expect(Member.update).toHaveBeenCalledWith(
      {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
      },
      {
        where: {
          id: member.id,
        },
      },
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      msg: `Member dengan id ${req.params.id} berhasil di update`,
    });
  });

  // Case 2 jika member tidak ada
  it('should return message if member is not found', async () => {
    // Mock findOne member dengan value null
    (Member.findOne as jest.Mock).mockResolvedValue(null);

    await updateMember(req, res);

    expect(Member.findOne).toHaveBeenCalledWith({
      where: {
        id: req.params.id,
      } as WhereOptions<Member>,
    });
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      msg: `Member dengan id ${req.params.id} tidak ditemukan`,
    });
  });

  // Case 3 jika format email tidak valid
  it('should return status 400 and message email format is wrong', async () => {
    // Mock findOne member
    (Member.findOne as jest.Mock).mockResolvedValue({
      id: '1',
    });

    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false);
    req.body = {
      email: 'invalid-email',
    };

    await updateMember(req, res);

    expect(Member.findOne).toHaveBeenCalledWith({
      where: {
        id: req.params.id,
      } as WhereOptions<Member>,
    });
    expect(validator.isEmail).toHaveBeenCalledWith(req.body.email);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      msg: 'Format Email Salah',
    });
  });

  // Case 4 jika email sudah digunakan
  it('should return if email is already used', async () => {
    // Mock data member
    const mockMember = {
      email: 'existing-email@example.com',
    };

    // Mock findOne member
    (Member.findOne as jest.Mock).mockResolvedValue(mockMember.email);

    req.body = {
      email: 'existing-email@example.com',
    };

    await updateMember(req, res);

    expect(Member.findOne).toHaveBeenCalledWith({
      where: {
        id: req.params.id,
      } as WhereOptions<Member>,
    });
    expect(Member.findOne).toHaveBeenCalledWith({
      where: {
        email: req.body.email,
      },
    });
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      msg: `Email ${req.body.email} sudah digunakan`,
    });
  });

  // Case 5 jika format no hp salah
  it('should return if phone format is invalid', async () => {
    const mockMember = {
      phone: '1234567890',
    };

    // Mock findOne member
    (Member.findOne as jest.Mock).mockResolvedValue(mockMember.phone);

    jest.spyOn(validator, 'isMobilePhone').mockReturnValueOnce(false);

    req.body = {
      phone: mockMember.phone,
    };

    await updateMember(req, res);

    expect(Member.findOne).toHaveBeenCalledWith({
      where: {
        id: req.params.id,
      } as WhereOptions<Member>,
    });
    expect(validator.isMobilePhone).toHaveBeenCalledWith(
      req.body.phone,
      'id-ID',
    );
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      msg: 'Format Nomor Hp Salah! Gunakan format Nomor Indonesia (08)',
    });
  });
});

// END Update member

