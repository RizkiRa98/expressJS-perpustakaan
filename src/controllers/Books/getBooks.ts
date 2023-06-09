import {Request, Response} from 'express';
import Books from '../../models/booksModel';
import Borrowing from '../../models/borrowingModel';
import Categories from '../../models/categoryModel';
import {WhereOptions} from 'sequelize';

// Fungsi view books
export const getBooks = async (req: Request, res: Response): Promise<void> => {
  try {
    const book = await Books.findAll({
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
    res.status(200).json(book);
  } catch (error) {
    console.log(error);
    res.json({msg: error});
  }
};

// View buku berdasarkan Id
export const getBookById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const book = await Books.findOne({
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
      where: {
        id: req.params.id,
      } as WhereOptions<Books>,
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
    });
    if (!book) {
      res.status(404).json({
        msg: 'Buku tidak ditemukan',
      });
      return;
    }
    res.json(book);
  } catch (error) {
    console.log(error);
    res.json({msg: error});
  }
};

