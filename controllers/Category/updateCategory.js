import Categories from "../../models/CategoryModel.js";

// Fungsi update category
export const updateCategory = async (req, res) => {
  // Cari category berdasarkan id dari request parameter
  const category = await Categories.findOne({
    where: {
      id: req.params.id,
    },
  });

  // Validasi jika category dengan id yang di request tidak ditemukan
  if (!category) {
    return res
      .status(404)
      .json({ msg: `category dengan id ${req.params.id} tidak ditemukan` });
  }

  const { name } = req.body; //request dari body

  // Validasi email
  if (category) {
    const cekCategory = await Categories.findOne({
      where: {
        name: name,
      },
    });
    if (cekCategory && name !== Categories.name) {
      return res.status(400).json({
        msg: `Name category ${name} sudah digunakan`,
      });
    }
  }

  // Update Category
  try {
    await Categories.update(
      {
        name: name,
      },
      {
        where: {
          id: category.id,
        },
      }
    );
    // respond status Updated
    res.status(200).json({
      msg: `Category dengan id ${req.params.id} berhasil di update`,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: error });
  }
};
