import Categories from "../../models/CategoryModel.js";

// Fungsi tambah category baru
export const addCategory = async (req, res) => {
  const { name } = req.body; //request dari body

  // validasi jika category sudah ada
  const cekCategory = await Categories.findOne({
    where: {
      name: name,
    },
  });
  if (cekCategory) {
    return res.status(400).json({
      msg: "Nama category sudah ada",
    });
  }

  // Create member
  try {
    await Categories.create({
      name: name,
    });
    res.json({ msg: "Category Baru Berhasil Ditambahkan" });
  } catch (error) {
    res.json({
      msg: error,
    });
  }
};
