import {Request, Response} from 'express';
import Categories from '../models/categoryModel';
import {
  getCategory,
  getCategoryById,
} from '../controllers/Category/getCategory';
import {WhereOptions} from 'sequelize';
import {addCategory} from '../controllers/Category/createCategory';
import {deleteCategory} from '../controllers/Category/deleteCategory';
import {updateCategory} from '../controllers/Category/updateCategory';

jest.mock('../models/categoryModel');

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

    // Mock findOne category
    (Categories.findOne as jest.Mock).mockResolvedValue(mockCategory);

    await getCategoryById(req, res);

    // Ekspetasi yang diharapkan
    expect(Categories.findOne).toHaveBeenCalledWith({
      attributes: ['id', 'name', 'createdAt'],
      where: {
        id: req.params.id,
      } as WhereOptions<Categories>,
    });
    expect(res.json).toHaveBeenCalledWith(mockCategory);
  });

  // Case 2 jika category tidak ditemukan
  it('should return status 404 if category is not found', async () => {
    // Mock category findOne dengan return null
    (Categories.findOne as jest.Mock).mockResolvedValue(null);

    await getCategoryById(req, res);

    // ekspetasi yang diharapkan
    expect(Categories.findOne).toHaveBeenCalledWith({
      attributes: ['id', 'name', 'createdAt'],
      where: {
        id: req.params.id,
      } as WhereOptions<Categories>,
    });
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      msg: `Category dengan ID ${req.params.id} tidak ditemukan`,
    });
  });
});

// End Get category by ID

// Create category
describe('createCategory', () => {
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

  // Case 1 cek category jika sudah ada
  it('should return if category name is already saved', async () => {
    (Categories.findOne as jest.Mock).mockReturnValueOnce([]);

    req.body = {
      name: 'example-category1',
    };

    await addCategory(req, res);

    // ekspetasi yang diharapkan
    expect(Categories.findOne).toHaveBeenCalledWith({
      where: {
        name: 'example-category1',
      },
    });
  });

  // Case 2 jika create category berhasil
  it('should create category and return if all validation pass', async () => {
    (Categories.findOne as jest.Mock).mockReturnValueOnce(null);

    req.body = {
      name: 'example-category1',
    };

    await addCategory(req, res);

    // Ekspetasi yang diharapkan
    expect(Categories.create).toHaveBeenCalledWith({
      name: 'example-category1',
    });
    expect(res.json).toHaveBeenCalledWith({
      msg: 'Category Baru Berhasil Ditambahkan',
    });
  });
});

// End create category

// Delete category
describe('deleteMember', () => {
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

  // Case 1 delete  category jika data ada
  it('should delete category and return success message', async () => {
    const mockCategory = {
      id: '1',
    };

    // Mock findOne category
    (Categories.findOne as jest.Mock).mockResolvedValue(mockCategory);

    await deleteCategory(req, res);

    expect(Categories.findOne).toHaveBeenCalledWith({
      where: {
        id: req.params.id,
      } as WhereOptions<Categories>,
    });
    expect(Categories.destroy).toHaveBeenCalledWith({
      where: {
        id: mockCategory.id,
      } as WhereOptions<Categories>,
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      msg: `Category dengan Id ${req.params.id} berhasil dihapus`,
    });
  });

  // Case 2 jika id category tidak ditemukan
  it('should send 404 and message if category doesnt exist', async () => {
    // Mock findOne category dengan value null
    (Categories.findOne as jest.Mock).mockResolvedValue(null);

    await deleteCategory(req, res);

    // ekspetaasi yang diharapkan
    expect(Categories.findOne).toHaveBeenCalledWith({
      where: {
        id: req.params.id,
      },
    });
    expect(res.json).toHaveBeenCalledWith({
      msg: `Category dengan id ${req.params.id} tidak ditemukan`,
    });
  });
});
// END Delete category

// Update category
describe('updateCategory', () => {
  let req: Request;
  let res: Response;
  // membuat fungsi buatan menggunakan jest.mock
  let findOneMock: jest.Mock;
  let updateMock: jest.Mock;

  beforeEach(() => {
    req = {
      params: {id: '1'},
      body: {},
    } as unknown as Request;
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    // membuat function tiruan kosong
    findOneMock = jest.fn();
    updateMock = jest.fn();

    // spyOn pada findOne dan update menggunakan mockImplementation
    jest.spyOn(Categories, 'findOne').mockImplementation(findOneMock);
    jest.spyOn(Categories, 'update').mockImplementation(updateMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Case 1 Jika member category ditemukan
  it('should return message if category is not found', async () => {
    // Mock findOne category dengan value null
    (Categories.findOne as jest.Mock).mockResolvedValue(null);

    await updateCategory(req, res);

    expect(Categories.findOne).toHaveBeenCalledWith({
      where: {
        id: req.params.id,
      } as WhereOptions<Categories>,
    });
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      msg: `category dengan id ${req.params.id} tidak ditemukan`,
    });
  });

  // Case 2 jika nama category sudah digunakan
  it('should return if name category is already used', async () => {
    // Mock data category
    const mockCategory = {
      id: '1',
      name: 'existing-category-name',
    };

    // Mock findOne category
    (Categories.findOne as jest.Mock).mockResolvedValue(mockCategory.name);

    req.body = {
      name: 'existing-category-name',
    };

    await updateCategory(req, res);

    expect(Categories.findOne).toHaveBeenCalledWith({
      where: {
        id: req.params.id,
      } as WhereOptions<Categories>,
    });
    expect(Categories.findOne).toHaveBeenCalledWith({
      where: {
        name: req.body.name,
      },
    });
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      msg: `Name category ${req.body.name} sudah digunakan`,
    });
  });

  // Case 3 jika berhasil lakukan update
  it('should update category and return success message', async () => {
    const category = {
      id: '1',
      name: 'old-category-name',
    };
    req.body = {
      name: 'new-category-name',
    };

    // Mock member findOne
    (Categories.findOne as jest.Mock).mockResolvedValueOnce(category);

    (Categories.update as jest.Mock).mockResolvedValueOnce([1]);

    await updateCategory(req, res);

    expect(Categories.findOne).toHaveBeenCalledWith({
      where: {
        id: req.params.id,
      } as WhereOptions<Categories>,
    });
    expect(Categories.update).toHaveBeenCalledWith(
      {
        name: 'new-category-name',
      },
      {
        where: {
          id: '1',
        },
      },
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      msg: `Category dengan id ${req.params.id} berhasil di update`,
    });
  });
});
// END Update category

