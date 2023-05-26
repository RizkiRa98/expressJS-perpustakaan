import {Request, Response} from 'express';
import Books from '../../models/booksModel';
import Borrowing from '../../models/borrowingModel';
import {WhereOptions} from 'sequelize';

// Membuat fungsi delete peminjam
export const deleteBorrowing = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const borrowing = await Borrowing.findOne({
      where: {
        id: req.params.id,
      } as WhereOptions<Borrowing>,
    });

    // validasi jika borrowing tidak ada
    if (!borrowing) {
      res.status(404).json({
        msg: `Peminjaman dengan id ${req.params.id} tidak ditemukan`,
      });
      return;
    }

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

    await Borrowing.destroy({
      where: {
        id: borrowing.id,
      } as WhereOptions<Borrowing>,
    });

    // respon status ok
    res.status(200).json({
      msg: `Peminjaman dengan Id ${req.params.id} berhasil dihapus`,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({msg: error});
  }
};

