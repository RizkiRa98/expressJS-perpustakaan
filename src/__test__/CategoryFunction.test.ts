import {Request, Response} from 'express';
import Categories from '../models/categoryModel';
import {
  getCategory,
  getCategoryById,
} from '../controllers/Category/getCategory';

jest.mock('../models/categoryModel', () => ({
  findAll: jest.fn(),
  findOne: jest.fn(),
}));

// Function get all category
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
  it('should return data category', async () => {
    const category = [
      {
        id: 1,
        name: 'example-category1',
        createdAt: new Date(),
      },
      {
        id: 2,
        name: 'example-category2',
        createdAt: new Date(),
      },
    ];

    (Categories.findAll as jest.Mock).mockResolvedValueOnce(category);

    await getCategory(req, res);

    expect(Categories.findAll).toHaveBeenCalledWith({
      attributes: ['id', 'name', 'createdAt'],
    });
    expect(res.json).toHaveBeenCalledWith(category);
  });
});
// END Function get all

// Get category by id
describe('getCategoryById', () => {
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

  // Case 1 jika berhasil menampilkan data
  it('should return category data by Id requested', async () => {
    // Mock data category
    const mockCategory = {
      id: '1',
      name: 'example-category1',
      createdAt: new Date(),
    };
  });
});

