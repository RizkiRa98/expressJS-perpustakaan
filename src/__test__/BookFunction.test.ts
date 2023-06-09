import {Request, Response} from 'express';
import {getBooks, getBookById} from '../controllers/Books/getBooks';
import Books from '../models/booksModel';
import Categories from '../models/categoryModel';
import Borrowing from '../models/borrowingModel';
import {WhereOptions} from 'sequelize';
import {addBooks} from '../controllers/Books/createBooks';
import {deleteBooks} from '../controllers/Books/deleteBooks';
import {updateBook} from '../controllers/Books/updateBooks';

jest.mock('../models/booksModel', () => ({
  findAll: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  destroy: jest.fn(),
  update: jest.fn(),
}));
jest.mock('../models/categoryModel', () => ({
  findOne: jest.fn(),
}));
jest.mock('../models/borrowingModel');

// Get All Books
describe('getBooks', () => {
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

  // Case 1 berhasil return data member
  it('should return data books', async () => {
    const books = [
      {
        id: 1,
        name: 'Book 1',
        author: 'Author 1',
        publisher: 'Publisher 1',
        categoryId: 1,
        status: 'Available',
        borrowingId: null,
        createdAt: new Date(),
        Category: {
          id: 1,
          name: 'Category 1',
        },
      },
    ] as unknown as Books;

    (Books.findAll as jest.Mock).mockResolvedValueOnce(books);

    await getBooks(req, res);

    expect(Books.findAll).toHaveBeenCalledWith({
      attributes: [
        'id',
        'name',
        'author',
        'publisher',
        'categoryId',
        'status',
        'borrowingId',
        'createdAt',
      ],
      include: [
        {
          model: Categories,
          attributes: ['id', 'name'],
        },
      ],
    });
    expect(res.json).toHaveBeenCalledWith(books);
  });
});
// END get all books

// Get books by id
describe('getBooksById', () => {
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

  // Case 1 books yang di request tidak ada
  it('should return status 404 if books is not found', async () => {
    // Mock books findOne dengan return null
    (Books.findOne as jest.Mock).mockResolvedValue(null);

    await getBookById(req, res);

    // Ekspetasi yang diharapkan
    expect(Books.findOne).toHaveBeenCalledWith({
      attributes: [
        'id',
        'name',
        'author',
        'publisher',
        'categoryId',
        'status',
        'borrowingId',
        'createdAt',
      ],
      include: [
        {
          model: Categories,
          attributes: ['id', 'name'],
        },
        {
          model: Borrowing,
          attributes: ['id', 'memberId'],
        },
      ],
      where: {
        id: req.params.id,
      } as WhereOptions<Books>,
    });
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      msg: 'Buku tidak ditemukan',
    });
  });

  // Case 2 berhasil menampilkan data
  it('should return books data by id requested', async () => {
    // Mock data books
    const books = [
      {
        id: 1,
        name: 'Book 1',
        author: 'Author 1',
        publisher: 'Publisher 1',
        categoryId: 1,
        status: 'Available',
        borrowingId: null,
        createdAt: new Date(),
        Category: {
          id: 1,
          name: 'Category 1',
        },
      },
    ] as unknown as Books;

    // Mock findOne Books
    (Books.findOne as jest.Mock).mockResolvedValue(books);

    await getBookById(req, res);

    // ekspetasi yang diharapkan
    expect(Books.findOne).toHaveBeenCalledWith({
      attributes: [
        'id',
        'name',
        'author',
        'publisher',
        'categoryId',
        'status',
        'borrowingId',
        'createdAt',
      ],
      include: [
        {
          model: Categories,
          attributes: ['id', 'name'],
        },
        {
          model: Borrowing,
          attributes: ['id', 'memberId'],
        },
      ],
      where: {
        id: req.params.id,
      } as WhereOptions<Books>,
    });
    expect(res.json).toHaveBeenCalledWith(books);
  });
});

// END get books by id

// Create books
describe('addBooks', () => {
  let req: Request;
  let res: Response;

  beforeEach(() => {
    req = {
      body: {
        name: 'Book Name',
        author: 'Book Author',
        publisher: 'Book Publisher',
        categoryId: 1,
        status: 'available',
        borrowingId: 'borrowing-id',
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

  // Case 1
  // hasil yang terbaca buku berhasil ditambahkan bukan buku sudah ada
  it('should return error if book already exists', async () => {
    // (Books.findOne as jest.Mock).mockResolvedValue(null);
    Books.findOne = jest.fn().mockResolvedValueOnce({});
    await addBooks(req, res);

    expect(Books.findOne).toHaveBeenCalledWith({where: {name: 'Book Name'}});
    expect(res.json).toHaveBeenCalledWith({msg: 'Buku sudah ada'});
  });

  // Case 2 jika status bukan available atau not available
  it('should return error if status is invalid', async () => {
    req.body.status = 'invalid';

    await addBooks(req, res);

    expect(res.json).toHaveBeenCalledWith({
      msg: 'Status harus available atau unavailable',
    });
  });

  // Case 4 jika category tidak ada
  it('should return error if category does not exist', async () => {
    const findOneCategoryMock = jest
      .spyOn(Categories, 'findOne')
      .mockResolvedValue(null);

    await addBooks(req, res);

    expect(findOneCategoryMock).toHaveBeenCalledWith({
      where: {id: 1},
    });
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      msg: 'Category dengan Id 1 tidak ada',
    });
  });

  // Case 4 sukses menambahkan buku
  it('should add a new book successfully', async () => {
    Categories.findOne = jest.fn().mockResolvedValueOnce(req.body.categoryId);
    Books.findOne = jest.fn().mockResolvedValueOnce(null);
    Books.create = jest.fn().mockResolvedValueOnce(undefined);

    await addBooks(req, res);

    expect(Books.findOne).toHaveBeenCalledWith({
      where: {name: 'Book Name'},
    });

    expect(Categories.findOne).toHaveBeenCalledWith({
      where: {id: req.body.categoryId} as WhereOptions<Categories>,
    });

    expect(Books.create).toHaveBeenCalledWith({
      name: 'Book Name',
      author: 'Book Author',
      publisher: 'Book Publisher',
      categoryId: 1,
      status: 'available',
      borrowingId: 'borrowing-id',
    });
    expect(res.json).toHaveBeenCalledWith({
      msg: 'Buku baru berhasil ditambahkan',
    });
  });
  // Case 5 jika terjadi error
  it('should return an error if an exception occurs', async () => {
    Books.findOne = jest.fn().mockRejectedValueOnce('Some error message');

    await addBooks(req, res);

    expect(Books.findOne).toHaveBeenCalledWith({
      where: {
        name: 'Book Name',
      },
    });
    expect(res.json).toHaveBeenCalledWith({
      msg: 'Some error message',
    });
  });
});
// END create books

// Delete Books
describe('deleteBooks', () => {
  let req: Request;
  let res: Response;

  beforeEach(() => {
    req = {
      params: {
        id: '1',
      },
    } as unknown as Request;

    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    } as unknown as Response;
  });
  // Case 1 delete Books jika data ada
  it('should delete books and return success message', async () => {
    // Mock data id buku
    const mockBooks = {
      id: '1',
    };

    // Mock findOne book
    (Books.findOne as jest.Mock).mockResolvedValue(mockBooks);

    await deleteBooks(req, res);

    expect(Books.findOne).toHaveBeenCalledWith({
      where: {
        id: '1',
      } as WhereOptions<Books>,
    });
    expect(Books.destroy).toHaveBeenCalledWith({
      where: {
        id: req.params.id,
      } as WhereOptions<Books>,
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      msg: `Buku dengan Id ${req.params.id} berhasil dihapus`,
    });
  });

  // Case 2 jika id books tidak ditemukan
  it('should send 404 message if books doesnt exist', async () => {
    // Mock findOne books dengan value null
    (Books.findOne as jest.Mock).mockResolvedValue(null);

    await deleteBooks(req, res);

    // ekspetasi yang diharapkan
    expect(Books.findOne).toHaveBeenCalledWith({
      where: {
        id: req.params.id,
      },
    });
    expect(res.json).toHaveBeenCalledWith({
      msg: `Buku dengan id ${req.params.id} tidak ditemukan`,
    });
  });
});

// END delete books

// Update books
describe('updateBook', () => {
  let req: Request;
  let res: Response;

  beforeEach(() => {
    req = {
      params: {
        id: '1',
      },
      body: {
        name: 'Updated Book Name',
        author: 'Updated Author Name',
        publisher: 'Updated Publisher Name',
        categoryId: 1,
        status: 'available',
        borrowingId: 1,
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

  // Case 1 jika update berhasil
  it('should update book when valid data provided', async () => {
    (Categories.findOne as jest.Mock).mockResolvedValueOnce(
      req.body.categoryId,
    );
    (Books.findOne as jest.Mock).mockResolvedValueOnce({});
    (Books.update as jest.Mock).mockResolvedValueOnce([1]);

    await updateBook(req, res);
    expect(Books.findOne).toHaveBeenCalledWith({
      where: {
        id: '1',
      } as WhereOptions<Books>,
    });
    expect(Categories.findOne).toHaveBeenCalledWith({
      where: {
        id: 1,
      },
    });
    expect(Books.update).toHaveBeenCalledWith(
      {
        name: 'Updated Book Name',
        author: 'Updated Author Name',
        publisher: 'Updated Publisher Name',
        categoryId: 1,
        status: 'available',
        borrowingId: 1,
      },
      {
        where: {
          id: '1',
        },
      },
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      msg: `Buku dengan id ${req.params.id} berhasil di update`,
    });
  });

  // Case 2 jika buku tidak ditemukan
  it('should return 404 status if book is not found', async () => {
    (Books.findOne as jest.Mock).mockResolvedValueOnce(null);

    await updateBook(req, res);

    expect(Books.findOne).toHaveBeenCalledWith({
      where: {
        id: '1',
      },
    });
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      msg: `Buku dengan id ${req.params.id} tidak ditemukan`,
    });
  });

  // Case 3 jika nama buku sudah ada
  // it('should return error if book already exists', async () => {
  //   (Books.findOne as jest.Mock).mockResolvedValueOnce({
  //     id: '1',
  //     name: 'Existing Book',
  //   });
  //   (Categories.findOne as jest.Mock).mockResolvedValueOnce({
  //     id: req.body.categoryId,
  //   });

  //   await updateBook(req, res);

  //   expect(Books.findOne).toHaveBeenCalledWith({
  //     where: {id: '1'},
  //   });
  //   expect(Categories.findOne).toHaveBeenCalledWith({
  //     where: {id: req.body.categoryId},
  //   });

  //   expect(res.status).toHaveBeenCalledWith(400);
  //   expect(res.json).toHaveBeenCalledWith({msg: 'Buku sudah ada'});
  // });

  // Case 3 jika category tidak ada
  it('should return error if category is not found', async () => {
    (Books.findOne as jest.Mock).mockResolvedValueOnce({} as Books);
    (Categories.findOne as jest.Mock).mockResolvedValueOnce(null);

    await updateBook(req, res);

    expect(Books.findOne).toHaveBeenCalledWith({
      where: {
        id: '1',
      },
    });
    expect(Categories.findOne).toHaveBeenCalledWith({
      where: {
        id: 1,
      },
    });
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      msg: 'Category dengan Id 1 tidak ada',
    });
  });

  // Case 3 jika status bukan available atau unavailable
  it('should return error if status is invalid', async () => {
    (Books.findOne as jest.Mock).mockResolvedValueOnce({});
    (Categories.findOne as jest.Mock).mockResolvedValueOnce({
      id: req.body.categoryId,
    });

    req.body.status = 'invalid';

    await updateBook(req, res);

    expect(res.json).toHaveBeenCalledWith({
      msg: 'Status harus available atau unavailable',
    });
  });
});
// END update books

