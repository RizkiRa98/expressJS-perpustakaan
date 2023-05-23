import Books from "../../models/BookModel.js";
import Borrowing from "../../models/BorrowingModel.js";
import Categories from "../../models/CategoryModel.js";

// Fungsi view books
export const getBooks = async (req, res) => {
  try {
    const book = await Books.findAll({
      attributes: [
        "id",
        "name",
        "author",
        "publisher",
        "categoryId",
        "status",
        "borrowingId",
        "createdAt",
      ],
      include: [
        {
          model: Categories,
          attributes: ["id", "name"],
        },
        // {
        //   model: Borrowing,
        //   attributes: ["id", "memberId"],
        // },
      ],
    });
    res.json(book);
  } catch (error) {
    console.log(error);
    res.json({ msg: error });
  }
};

// View buku berdasarkan Id
export const getBookById = async (req, res) => {
  try {
    const book = await Books.findOne({
      attributes: [
        "id",
        "name",
        "author",
        "publisher",
        "categoryId",
        "status",
        "borrowingId",
        "createdAt",
      ],
      where: {
        id: req.params.id,
      },
      include: [
        {
          model: Categories,
          attributes: ["id", "name"],
        },
        {
          model: Borrowing,
          attributes: ["id", "memberId"],
        },
      ],
    });
    res.json(book);
  } catch (error) {
    console.log(error);
    res.json({ msg: error });
  }
};
