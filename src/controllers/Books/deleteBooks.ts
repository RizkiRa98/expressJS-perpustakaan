import {Request, Response} from 'express';
import Books from '../../models/booksModel';
import {WhereOptions} from 'sequelize';

// Membuat fungsi delete buku
export const deleteBooks = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const book = await Books.findOne({
      where: {
        id: req.params.id,
      } as WhereOptions<Books>,
    });

    // Validasi jika books tidak eksis
    if (!book) {
      res.status(404).json({
        msg: `Buku dengan id ${req.params.id} tidak ditemukan`,
      });
      return;
    }

    // Jika id yang di request ada
    await Books.destroy({
      where: {
        id: book.id,
      } as WhereOptions<Books>,
    });

    // respond status ok
    res.status(200).json({
      msg: `Buku dengan Id ${req.params.id} berhasil dihapus`,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({msg: error});
  }
};

