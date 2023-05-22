import { where } from "sequelize";
import Books from "../../models/BookModel.js";
import Categories from "../../models/CategoryModel.js";

// Fungsi update buku
export const updateBook = async (req, res) => {
  // Cari buku berdasarkan id dari request parameter
  const book = await Books.findOne({
    where: {
      id: req.params.id,
    },
  });

  // Validasi jika id yang dicari tidak ada
  if (!book) {
    return res.status(404).json({
      msg: `Buku dengan id ${req.params.id} tidak ditemukan`,
    });
  }

  const { name, author, publisher, categoryId, status, borrowingId } = req.body;

  // validasi jika ada buku yang sama
  const cekBooks = await Books.findOne({
    where: {
      name: name,
    },
  });
  if (cekBooks && name !== book.name) {
    return res.status(400).json({ msg: "Buku sudah ada" });
  }

  if (status !== "available" && status !== "unavailable") {
    return res
      .status(400)
      .json({ msg: "Status harus available atau unavailable" });
  }

  // Validasi jika category tidak ada
  const cekCategory = await Categories.findOne({
    where: {
      id: categoryId,
    },
  });

  if (!cekCategory) {
    return res.status(404).json({
      msg: `Category dengan Id ${categoryId} tidak ada`,
    });
  }

  // Update Buku
  try {
    await Books.update(
      {
        name: name,
        author: author,
        publisher: publisher,
        categoryId: categoryId,
        status: status,
        borrowingId: borrowingId,
      },
      {
        where: {
          id: book.id,
        },
      }
    );

    // respon status updated
    res.status(200).json({
      msg: `Buku dengan id ${req.params.id} berhasil di update`,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: error });
  }
};
