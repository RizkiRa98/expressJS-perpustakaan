import Books from "../../models/BookModel.js";
import Borrowing from "../../models/BorrowingModel.js";
import Member from "../../models/MemberModel.js";

// Fungsi untuk view borrowing
export const getBorrowing = async (req, res) => {
  try {
    const borrow = await Borrowing.findAll({
      attributes: [
        "id",
        "memberId",
        "booksId",
        "borrow_at",
        "return_at",
        "max_return",
        "charge",
        "status",
      ],
      include: [
        {
          model: Member,
          attributes: ["id", "name", "email", "phone"],
        },
        {
          model: Books,
          attributes: ["id", "name", "author"],
        },
      ],
    });
    res.json(borrow);
  } catch (error) {
    console.log(error);
    res.json({
      msg: error,
    });
  }
};
