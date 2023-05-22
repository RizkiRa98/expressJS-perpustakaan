import { where } from "sequelize";
import Books from "../../models/BookModel.js";
import Borrowing from "../../models/BorrowingModel.js";

// Membuat fungsi delete peminjam
export const deleteBorrowing = async (req, res) => {
  try {
    const borrowing = await Borrowing.findOne({
      where: {
        id: req.params.id,
      },
    });

    // validasi jika borrowing tidak ada
    if (!borrowing) {
      return res.status(404).json({
        msg: `Peminjaman dengan id ${req.params.id} tidak ditemukan`,
      });
    }

    // cek jika ada borrowing Id pada books maka ubah borrowingId menjadi null dan status books menjadi available

    const cekBorrowingId = await Books.findOne({
      where: {
        borrowingId: req.params.id,
      },
    });

    if (cekBorrowingId) {
      await Books.update(
        {
          borrowingId: null,
          status: "available",
        },
        {
          where: {
            id: borrowing.booksId,
          },
        }
      );
    }

    await Borrowing.destroy({
      where: {
        id: borrowing.id,
      },
    });

    // respon status ok
    res.status(200).json({
      msg: `Peminjaman dengan Id ${req.params.id} berhasil dihapus`,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: error });
  }
};
