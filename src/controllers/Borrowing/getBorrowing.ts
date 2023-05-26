import {Request, Response} from 'express';
import Books from '../../models/booksModel';
import Borrowing from '../../models/borrowingModel';
import Member from '../../models/memberModel';

// Fungsi untuk view borrowing
export const getBorrowing = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const borrow = await Borrowing.findAll({
      attributes: [
        'id',
        'memberId',
        'booksId',
        'borrow_at',
        'return_at',
        'max_return',
        'charge',
        'status',
      ],
      include: [
        {
          model: Member,
          attributes: ['id', 'name', 'email', 'phone'],
        },
        {
          model: Books,
          attributes: ['id', 'name', 'author'],
        },
      ],
    });
    res.json(borrow);
  } catch (error) {
    console.log(error);
    res.json({
      msg: error,
    });
  }
};

