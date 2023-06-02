import {Request, Response} from 'express';
import {getBooks, getBookById} from '../controllers/Books/getBooks';
import Books from '../models/booksModel';
import Categories from '../models/categoryModel';
import Borrowing from '../models/borrowingModel';
import {WhereOptions} from 'sequelize';
import {addBooks} from '../controllers/Books/createBooks';

jest.mock('../models/booksModel', () => ({
  findOne: jest.fn(),
  findAll: jest.fn(),
}));
jest.mock('../models/categoryModel');
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
describe('createBooks', () => {
  let req: Request;
  let res: Response;

  beforeEach(() => {
    req = {} as Request;
    res = {
      json: jest.fn(),
      status: jest.fn(),
    } as unknown as Response;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Case 1 jika buku sudah ada
  it('should return if books name is already use', async () => {
    // mock books dengan return empty array
    (Books.findOne as jest.Mock).mockReturnValueOnce([]);

    req.body = {
      name: 'saved-book-name',
    };

    await addBooks(req, res);

    // ekspetasi yang diharapkan
    // expect(res.status).toHaveBeenCalledWith(404);
    expect(Books.findOne).toHaveBeenCalledWith({
      where: {
        name: 'saved-book-name',
      },
    });
    expect(res.json).toHaveBeenCalledWith({
      msg: 'Buku sudah ada',
    });
  });
});

// END create books

