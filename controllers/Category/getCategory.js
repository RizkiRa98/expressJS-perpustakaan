import Categories from "../../models/CategoryModel.js";

// Fungsi view category
export const getCategory = async (req, res) => {
  try {
    const category = await Categories.findAll({
      attributes: ["id", "name", "createdAt"],
    });
    res.json(category);
  } catch (error) {
    console.log(error);
    res.json({ msg: error });
  }
};

// Fungsi view category by Id
export const getCategoryById = async (req, res) => {
  try {
    const category = await Categories.findOne({
      attributes: ["id", "name", "createdAt"],
      where: {
        id: req.params.id,
      },
    });
    res.json(category);
  } catch (error) {
    console.log(error);
    res.json({ msg: error });
  }
};
