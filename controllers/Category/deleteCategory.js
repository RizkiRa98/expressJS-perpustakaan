import Categories from "../../models/CategoryModel.js";

// Membuat fungsi delete category
export const deleteCategory = async (req, res) => {
  try {
    const category = await Categories.findOne({
      where: {
        id: req.params.id,
      },
    });
    // Validasi jika category dengan id yang di request tidak ditemukan
    if (!category) {
      return res
        .status(404)
        .json({ msg: `Category dengan id ${req.params.id} tidak ditemukan` });
    }

    // JIka id yang di request ada
    await Categories.destroy({
      where: {
        id: category.id,
      },
    });

    // Respond status ok
    res
      .status(200)
      .json({ msg: `Category dengan Id ${req.params.id} berhasil dihapus` });
  } catch (error) {
    console.log(error);
    // Jika terjadi error pada try
    res.status(400).json({ msg: error });
  }
};
