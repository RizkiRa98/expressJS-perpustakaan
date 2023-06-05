import {Request, Response} from 'express';
import {getBooks, getBookById} from '../controllers/Books/getBooks';
import Books from '../models/booksModel';
import Categories from '../models/categoryModel';
import Borrowing from '../models/borrowingModel';
import {WhereOptions} from 'sequelize';
import {addBooks} from '../controllers/Books/createBooks';
import {deleteBooks} from '../controllers/Books/deleteBooks';
import {updateBook} from '../controllers/Books/updateBooks';

jest.mock('../models/booksModel');
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
        id: req.params.id,
      } as WhereOptions<Books>,
    });
    expect(Books.destroy).toHaveBeenCalledWith({
      where: {
        id: mockBooks.id,
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
  // Mmebuat funsi buatan menggunakan jest.mock
  let findOneMock: jest.Mock;
  let updateMock: jest.Mock;

  beforeEach(() => {
    req = {
      params: {
        id: '1',
      },
      body: {},
    } as unknown as Request;
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    // membuat function tiruan menggunakan jest.fn()
    findOneMock = jest.fn();
    updateMock = jest.fn();

    jest.spyOn(Books, 'findOne').mockImplementation(findOneMock);
    jest.spyOn(Books, 'update').mockImplementation(updateMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Case 1 jika update berhasil
  it('should update book when valid data provided', async () => {
    const book = {
      id: '1',
      name: 'Book Name',
      author: 'Author Name',
      publisher: 'Publisher Name',
      categoryId: 1,
      status: 'available',
      borrowingId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    req.body = {
      name: 'new-book-name',
      author: 'new-book-author',
      publisher: 'new-book-publisher',
      categoryId: 2,
      status: 'unavailable',
    };

    (Books.findOne as jest.Mock).mockResolvedValueOnce(book);
    (Books.update as jest.Mock).mockResolvedValueOnce([1]);

    await updateBook(req, res);
    expect(Books.findOne).toHaveBeenCalledWith({
      where: {
        id: '1',
      } as WhereOptions<Books>,
    });
    expect(Books.update).toHaveBeenCalledWith(
      {
        name: 'new-book-name',
        author: 'new-book-author',
        publisher: 'new-book-publisher',
        categoryId: 2,
        status: 'unavailable',
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

  // Case 3 jika buku dengan nama yang sama sudah ada
  it('should return if book with same name is already exist', async () => {
    //  Mock data buku
    const book = {
      id: 2,
      name: 'Duplicate Book Name',
      author: 'Author Name',
      publisher: 'Publisher Name',
      categoryId: 1,
      status: 'available',
      borrowingId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    req.body = {
      name: 'Duplicate Book Name',
      author: 'New Author Name',
      publisher: 'New Publisher Name',
      categoryId: 2,
      status: 'unavailable',
      borrowingId: 1,
    };

    (Books.findOne as jest.Mock).mockResolvedValueOnce(book);
    // (Books.findOne as jest.Mock).mockResolvedValueOnce(null);

    await updateBook(req, res);

    expect(Books.findOne).toHaveBeenCalledWith({
      where: {
        id: '1',
      },
    });
    expect(Books.findOne).toHaveBeenCalledWith({
      where: {
        name: 'Duplicate Book Name',
      },
    });
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      msg: 'Buku sudah ada',
    });
  });
});
// END update books

