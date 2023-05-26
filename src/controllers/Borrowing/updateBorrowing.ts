/* eslint-disable operator-linebreak */
import {Request, Response} from 'express';
import Books from '../../models/booksModel';
import Borrowing from '../../models/borrowingModel';
import Member from '../../models/memberModel';
import {WhereOptions} from 'sequelize';

// Fungsi update peminjaman
export const updateBorrowing = async (
  req: Request,
  res: Response,
): Promise<void> => {
  // cari borrowing berdasarkan id
  const borrowing = await Borrowing.findOne({
    where: {
      id: req.params.id,
    } as WhereOptions<Borrowing>,
  });

  // Validasi jika id tidak ada
  if (!borrowing) {
    res.status(400).json({
      msg: `Peminjaman dengan id ${req.params.id} tidak ditemukan`,
    });
    return;
  }

  let {memberId, booksId, borrowAt, returnAt, status} = req.body;

  // Cek member
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

  // Cek buku tersedia atau tidak
  const availableBook = await Books.findOne({
    where: {
      id: booksId,
    } as WhereOptions<Books>,
  });
  if (!availableBook) {
    res.status(404).json({
      msg: 'Buku tidak tersedia',
    });
    return;
  }

  // Validasi jika member dengan status not_returned tidak bisa meminjam

  if (booksId === borrowing.booksId && memberId === borrowing.memberId) {
    res.status(400).json({
      msg: 'Member belum mengembalikan buku pinjaman sebelumnya',
    });
    return;
  }

  // add borrowing
  try {
    // Max return otomatis menjadi 7 setelah borrow_at
    const borrowDate = new Date(borrowAt);
    const maxReturnDate = new Date(
      borrowDate.getTime() + 7 * 24 * 60 * 60 * 1000,
    );

    // Perhitungan denda
    const maxReturn = new Date(borrowing.max_return);
    const returnDate = new Date(returnAt);
    const dayDifference = Math.floor(
      (returnDate.getTime() - maxReturn.getTime()) / (1000 * 60 * 60 * 24),
    );

    let charge = 0;
    if (dayDifference >= 1) {
      charge = 5000 + (dayDifference - 1) * 1000;
    }

    // Konversi menjadi string
    const chargeString = charge.toString();

    // Jika return_at di update lakukan update pada tabel buku juga
    if (returnAt) {
      status = 'returned';
      // cek jika ada borrowing Id pada books
      // maka ubah borrowingId menjadi null dan status books menjadi available

      const cekBorrowingId = await Books.findOne({
        where: {
          borrowingId: req.params.id,
        },
      });

      if (cekBorrowingId) {
        await Books.update(
          {
            borrowingId: null,
            status: 'available',
          },
          {
            where: {
              id: borrowing.booksId,
            } as WhereOptions<Books>,
          },
        );
      }
    }

    // Update borrowing
    await Borrowing.update(
      {
        memberId: memberId,
        booksId: booksId,
        borrow_at: borrowAt,
        return_at: returnAt,
        max_return: borrowAt
          ? maxReturnDate.toISOString().split('T')[0]
          : borrowing.max_return,
        charge: chargeString,
        status: status,
      },
      {
        where: {
          id: borrowing.id,
        } as WhereOptions<Borrowing>,
      },
    );

    // respon status updated
    res.status(200).json({
      msg: `Peminjaman dengan id ${req.params.id} berhasil di update `,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      msg: error,
    });
  }
};

