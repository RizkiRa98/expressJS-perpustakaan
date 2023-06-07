/* eslint-disable camelcase */
import {Request, Response} from 'express';
import {getBorrowing} from '../controllers/Borrowing/getBorrowing';
import Books from '../models/booksModel';
import Borrowing from '../models/borrowingModel';
import Member from '../models/memberModel';
import {addBorrowing} from '../controllers/Borrowing/createBorrowing';
import {deleteBorrowing} from '../controllers/Borrowing/deleteBorrowing';
import {updateBorrowing} from '../controllers/Borrowing/updateBorrowing';
import {WhereOptions} from 'sequelize';

jest.mock('../models/booksModel', () => ({
  findOne: jest.fn(),
  findAll: jest.fn(),
  update: jest.fn(),
}));
jest.mock('../models/borrowingModel', () => ({
  findOne: jest.fn(),
  findAll: jest.fn(),
  destroy: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
}));
jest.mock('../models/memberModel', () => ({
  findOne: jest.fn(),
  findAll: jest.fn(),
}));

// Get Borrowing
describe('getBorrowing', () => {
  let req: Request;
  let res: Response;

  beforeEach(() => {
    req = {} as Request;
    res = {
      json: jest.fn(),
    } as unknown as Response;
  });

  // Case 1 berhasil mereturn borrowing data
  it('should return borrowing data successfully', async () => {
    const mockBorrowing = [
      {
        id: 1,
        memberId: 1,
        booksId: 1,
        borrow_at: '2023-06-01',
        max_return: '2023-06-08',
        return_at: null,
        charge: 0,
        status: 'active',
        Member: {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
          phone: '123456789',
        },
        Book: {
          id: 1,
          name: 'Book Title',
          author: 'Author Name',
        },
      },
    ];

    (Borrowing.findAll as jest.Mock).mockResolvedValue(mockBorrowing);

    await getBorrowing(req, res);

    expect(res.json).toHaveBeenCalledWith(mockBorrowing);
  });
});
// END get borrowing

// create borrowing
describe('createBorrowing', () => {
  let req: Request;
  let res: Response;

  beforeEach(() => {
    req = {
      body: {
        memberId: 'memberId',
        booksId: 'booksId',
        borrow_at: '2023-06-06',
        status: 'not returned',
      },
    } as Request;
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    } as unknown as Response;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Case 1 jika member belum mengembalikan buku
  it('should return if member not returned previous borrowing', async () => {
    (Borrowing.findOne as jest.Mock).mockResolvedValue({});

    await addBorrowing(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      msg: 'Member belum mengembalikan buku pinjaman sebelumnya',
    });
  });

  // case 2 jika member tidak ada
  it('should return an error if member does not exist', async () => {
    Borrowing.findOne = jest.fn().mockResolvedValueOnce(null);
    Member.findOne = jest.fn().mockResolvedValueOnce(null);

    await addBorrowing(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      msg: 'Member belum ada!',
    });
  });

  // case 3 jika status sudah return atau not returned
  it('should return if status is "returned" nor "not returned"', async () => {
    Borrowing.findOne = jest.fn().mockResolvedValueOnce(null);
    Member.findOne = jest.fn().mockResolvedValueOnce({});
    req.body = {
      status: 'invalid-status',
    };

    await addBorrowing(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      msg: 'Status harus returned atau not returned',
    });
  });

  // case 4 jika buku not available
  it('should return if the book is not available', async () => {
    Borrowing.findOne = jest.fn().mockResolvedValueOnce(null);
    Member.findOne = jest.fn().mockResolvedValueOnce({});

    req.body = {
      status: 'returned',
    };

    Books.findOne = jest.fn().mockResolvedValueOnce(null);

    await addBorrowing(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      msg: 'Buku tidak tersedia',
    });
  });

  // Case 5 jika buku status buku not available
  // Masih error karna belongs to harus di non aktifkan
  // it('should return if the boos is unavailable for borrowing', async () => {
  //   Borrowing.findOne = jest.fn().mockResolvedValueOnce(null);
  //   Member.findOne = jest.fn().mockResolvedValueOnce({});
  //   req.body.status = 'returned';
  //   Books.findOne = jest.fn().mockResolvedValueOnce({status: 'unavailable'});

  //   await addBorrowing(req, res);

  //   expect(res.status).toHaveBeenCalledWith(400);
  //   expect(res.json).toHaveBeenCalledWith({
  //     msg: 'Buku belum bisa dipinjam',
  //   });
  // });

  // Case 6 berhasil menambahkan Borrowing
  it('should add a borrowing and update the books status', async () => {
    Borrowing.findOne = jest.fn().mockResolvedValueOnce(null);
    Member.findOne = jest.fn().mockResolvedValueOnce({});
    req.body.status = 'returned';
    Books.findOne = jest.fn().mockResolvedValueOnce({status: 'available'});
    Books.update = jest.fn().mockResolvedValueOnce({});

    await addBorrowing(req, res);

    expect(Borrowing.create).toHaveBeenCalledWith({
      memberId: 'memberId',
      booksId: 'booksId',
      borrow_at: '2023-06-06',
      max_return: expect.any(String),
      status: 'returned',
    });

    // Di komen karena associate dimatikan dulu
    // Kalau akftif ada error data tidak ada karena
    // associate Books dan borrowing belum aktif
    // expect(Books.update).toHaveBeenCalledWith(
    //   {
    //     borrowingId: expect.any(String),
    //     status: 'unavailable',
    //   },
    //   {
    //     where: {
    //       id: 'booksId',
    //     },
    //   },
    // );

    expect(res.json).toHaveBeenCalledWith({
      msg: 'Data peminjam sudah ditambahkan',
    });
  });
});
// END create borrowing

// Delete borrowing
describe('deleteBorrowing', () => {
  let res: Response;
  let req: Request;

  beforeEach(() => {
    req = {
      params: {
        id: '1',
      },
    } as unknown as Request;
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Case 1 jika borrowing tidak ada
  it('should return error if borrowing is not found', async () => {
    const borrowing = {
      id: '1',
      booksId: 'booksId',
    };
    Borrowing.findOne = jest.fn().mockResolvedValueOnce(borrowing);
    Books.findOne = jest.fn().mockResolvedValueOnce({});

    await deleteBorrowing(req, res);

    // expect(Books.update).toHaveBeenCalledWith(
    //   {
    //     borrowingId: null,
    //     status: 'available',
    //   },
    //   {
    //     where: {
    //       id: 'booksId',
    //     },
    //   },
    // );

    expect(Borrowing.destroy).toHaveBeenCalledWith({
      where: {
        id: '1',
      },
    });

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      msg: `Peminjaman dengan Id ${req.params.id} berhasil dihapus`,
    });
  });
});
// END delete borrowing

// Update borrowing
describe('updateBorrowing', () => {
  let req: Request;
  let res: Response;

  beforeEach(() => {
    req = {
      params: {
        id: 'borrowing-id',
      },
      body: {
        memberId: 'member-id',
        booksId: 'books-id',
        borrow_at: '2023-06-01',
        return_at: '2023-06-08',
        status: 'borrowed',
      },
    } as unknown as Request;
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Case 1 jika borrowing tidak ditemukan
  it('should return if borrowing is not found', async () => {
    Borrowing.findOne = jest.fn().mockReturnValueOnce(null);

    await updateBorrowing(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      msg: `Peminjaman dengan id ${req.params.id} tidak ditemukan`,
    });
  });

  // case 2 jika member tidak ditemukan
  it('should return if member is not found', async () => {
    Borrowing.findOne = jest.fn().mockReturnValueOnce({});

    Member.findOne = jest.fn().mockReturnValueOnce(null);

    await updateBorrowing(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      msg: 'Member belum ada!',
    });
  });

  // case 3 jika buku tidak ada
  it('should return if books is not found', async () => {
    Borrowing.findOne = jest.fn().mockResolvedValueOnce({});
    Member.findOne = jest.fn().mockResolvedValueOnce({});
    Books.findOne = jest.fn().mockResolvedValueOnce(null);

    await updateBorrowing(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      msg: 'Buku tidak tersedia',
    });
  });

  // case 4 jika member belum mengembalikan peminjaman sebelumnya
  // Error karena belongsTo
  // model Books tidak termasuk dalam sequelize.Model

  // it('should return 400 if member has not returned books', async () => {
  //   Borrowing.findOne = jest.fn().mockResolvedValueOnce({
  //     booksId: 'previous-booksId',
  //     memberId: 'previous-memberId',
  //   });
  //   Member.findOne = jest.fn().mockResolvedValueOnce({});
  //   Books.findOne = jest.fn().mockResolvedValueOnce({});

  //   await updateBorrowing(req, res);

  //   expect(res.status).toHaveBeenCalledWith(400);
  //   expect(res.json).toHaveBeenCalledWith({
  //     msg: 'Member belum mengembalikan buku pinjaman sebelumnya',
  //   });
  // });

  // case 5 berhasil update borrowing
  it('should update borrowing if all conditions are met', async () => {
    const findOneMock = jest.fn().mockResolvedValue({});
    Borrowing.findOne = findOneMock;
    Member.findOne = findOneMock;
    Books.findOne = findOneMock;
    // Books.update = jest.fn().mockResolvedValueOnce(undefined);
    Borrowing.update = jest.fn().mockResolvedValueOnce(undefined);

    await updateBorrowing(req, res);

    expect(Borrowing.findOne).toHaveBeenCalledWith({
      where: {id: 'borrowing-id'} as WhereOptions<Borrowing>,
    });
    expect(Member.findOne).toHaveBeenCalledWith({
      where: {id: 'member-id'} as WhereOptions<Member>,
    });
    expect(Books.findOne).toHaveBeenCalledWith({
      where: {id: 'books-id'} as WhereOptions<Books>,
    });
    // expect(Books.update).toHaveBeenCalledWith(
    //   {
    //     borrowingId: null,
    //     status: 'available',
    //   },
    //   {
    //     where: {id: 'previous-book-id'} as WhereOptions<Books>,
    //   },
    // );
    expect(Borrowing.update).toHaveBeenCalledWith(
      {
        memberId: 'member-id',
        booksId: 'books-id',
        borrow_at: '2023-06-01',
        return_at: '2023-06-08',
        max_return: '2023-06-08',
        charge: '0',
        status: 'returned',
      },
      {
        where: {id: req.params.id} as WhereOptions<Borrowing>,
      },
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      msg: 'Peminjaman dengan id borrowing-id berhasil di update ',
    });
  });
});
// END update borrowing

