/* eslint-disable camelcase */
import {Request, Response} from 'express';
import Books from '../../models/booksModel';
import Borrowing from '../../models/borrowingModel';
import Member from '../../models/memberModel';
import {WhereOptions} from 'sequelize';

// fungsi add borrowing
export const addBorrowing = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const {memberId, booksId, borrow_at, status} = req.body;

  // Validasi jika member dengan status not_returned tidak bisa meminjam
  const cekStatus = await Borrowing.findOne({
    where: {
      memberId: memberId,
      status: 'not returned',
    },
  });

  if (cekStatus) {
    res.status(200).json({
      msg: 'Member belum mengembalikan buku pinjaman sebelumnya',
    });
    return;
  }

  // Cek Member
  const cekMember = await Member.findOne({
    where: {
      id: memberId,
    } as WhereOptions<Member>,
  });

  if (!cekMember) {
    res.status(404).json({
      msg: 'Member belum ada!',
    });
    return;
  }

  // Status harus returned atau not_returned
  if (status !== 'returned' && status !== 'not returned') {
    res.status(400).json({
      msg: 'Status harus returned atau not returned',
    });
    return;
  }

  // Cek buku tersedia atau tidak
  const availableBook = await Books.findOne({
    where: {
      id: booksId,
    } as WhereOptions<Books>,
  });

  if (!availableBook) {
    res.status(404).json({msg: 'Buku tidak tersedia'});
    return;
  }

  // Jika booksId dan statusnya unavailable maka tidak bisa dipinjam
  const cekBook = await Books.findOne({
    where: {
      id: booksId,
    } as WhereOptions<Books>,
  });

  if (cekBook && cekBook.status === 'unavailable') {
    res.status(400).json({
      msg: 'Buku belum bisa dipinjam',
    });
    return;
  }

  // add borrowing
  try {
    // Max return otomatis menjadi 7 hari setelah borrow_at
    const borrowDate = new Date(borrow_at);
    const maxReturnDate = new Date(
      borrowDate.getTime() + 7 * 24 * 60 * 60 * 1000,
    );
    console.log('borrowAt:', borrow_at);
    // add borrowing
    const addBorrowing = await Borrowing.create({
      memberId: memberId,
      booksId: booksId,
      borrow_at: borrow_at,
      max_return: maxReturnDate.toISOString().split('T')[0],
      status: status,
    });

    // ambil id dari addBorrowing
    const borrowingId = addBorrowing.id;

    // cek borrowing
    const cekBorrowing = await Books.findOne({
      where: {
        id: booksId,
        borrowingId: null,
      } as WhereOptions<Books>,
    });

    if (cekBorrowing) {
      await Books.update(
        {
          borrowingId: borrowingId,
          status: 'unavailable',
        },
        {
          where: {
            id: booksId,
          } as WhereOptions<Books>,
        },
      );
    }

    res.json({msg: 'Data peminjam sudah ditambahkan'});
  } catch (error) {
    console.log(error);
    res.json({msg: error});
  }
};

