import Books from "../../models/BookModel.js";

// Membuat fungsi delete buku
export const deleteBooks = async (req, res) => {
  try {
    const book = await Books.findOne({
      where: {
        id: req.params.id,
      },
    });

    // Validasi jika books tidak eksis
    if (!book) {
      return res.status(404).json({
        msg: `Buku dengan id ${req.params.id} tidak ditemukan`,
      });
    }

    // Jika borrowing Id ada lakukan hapus books id pada borrowing terlebih dahulu berdasarkan borrowing.booksId. lakukan find one borrowing terlebih dahulu where booksid = book.id

    // Jika id yang di request ada
    await Books.destroy({
      where: {
        id: book.id,
      },
    });

    // respond status ok
    res.status(200).json({
      msg: `Buku dengan Id ${req.params.id} berhasil dihapus`,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: error });
  }
};
