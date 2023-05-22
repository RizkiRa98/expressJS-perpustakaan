import Books from "../../models/BookModel.js";
import Categories from "../../models/CategoryModel.js";

// Fungsi tambah books baru
export const addBooks = async (req, res) => {
  const { name, author, publisher, categoryId, status, borrowingId } = req.body;

  // validasi jika ada buku yang sama
  const cekBooks = await Books.findOne({
    where: {
      name: name,
    },
  });
  if (cekBooks) {
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

  // Add Books
  try {
    await Books.create({
      name: name,
      author: author,
      publisher: publisher,
      categoryId: categoryId,
      status: status,
      borrowingId: borrowingId,
    });
    res.json({ msg: "Buku baru berhasil ditambahkan" });
  } catch (error) {
    console.log(error);
    res.json({
      msg: error,
    });
  }
};
