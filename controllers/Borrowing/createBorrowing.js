import Books from "../../models/BookModel.js";
import Borrowing from "../../models/BorrowingModel.js";
import Member from "../../models/MemberModel.js";
import { Op } from "sequelize";

// fungsi add borrowing
export const addBorrowing = async (req, res) => {
  const { memberId, booksId, borrow_at, status } = req.body;

  // Validasi jika member dengan status not_returned tidak bisa meminjam terlebih dahulu
  const cekStatus = await Borrowing.findOne({
    where: {
      memberId: memberId,
      status: "not returned",
    },
  });

  if (cekStatus) {
    return res.status(200).json({
      msg: "Member belum mengembalikan buku pinjaman sebelumnya",
    });
  }

  // Cek Member
  const cekMember = await Member.findOne({
    where: {
      id: memberId,
    },
  });

  if (!cekMember) {
    return res.status(404).json({
      msg: "Member belum ada!",
    });
  }

  // Status harus returned atau not_returned
  if (status !== "returned" && status !== "not returned") {
    return res.status(400).json({
      msg: "Status harus returned atau not returned",
    });
  }

  // Cek buku tersedia atau tidak
  const availableBook = await Books.findOne({
    where: {
      id: booksId,
    },
  });

  if (!availableBook) {
    return res.status(404).json({ msg: "Buku tidak tersedia" });
  }

  // Jika booksId dan statusnya unavailable maka tidak bisa dipinjam
  const cekBook = await Books.findOne({
    where: {
      id: booksId,
    },
  });

  if (cekBook && cekBook.status === "unavailable") {
    return res.status(400).json({
      msg: "Buku belum bisa dipinjam",
    });
  }

  // add borrowing
  try {
    // Penghitungan denda
    // const maxReturnDate = new Date(max_return);
    // const returnDate = new Date(return_at);
    // const dayDifference = Math.floor(
    //   returnDate - maxReturnDate / (1000 * 60 * 60 * 24)
    // );

    // let charge = 0;
    // if (dayDifference > 1) {
    //   charge = 5000(dayDifference - 1) * 1000;
    // }

    // Max return otomatis menjadi 7 hari setelah borrow_at
    const borrowDate = new Date(borrow_at);
    const maxReturnDate = new Date(
      borrowDate.getTime() + 7 * 24 * 60 * 60 * 1000
    );

    // add borrowing
    const addBorrowing = await Borrowing.create({
      memberId: memberId,
      booksId: booksId,
      borrow_at: borrow_at,
      max_return: maxReturnDate.toISOString().split("T")[0],
      status: status,
    });

    // ambil id dari addBorrowing
    const borrowingId = addBorrowing.id;

    // cek borrowing
    const cekBorrowing = await Books.findOne({
      where: {
        id: booksId,
        borrowingId: null,
      },
    });

    if (cekBorrowing) {
      await Books.update(
        {
          borrowingId: borrowingId,
          status: "unavailable",
        },
        {
          where: {
            id: booksId,
          },
        }
      );
    }

    res.json({ msg: "Data peminjam sudah ditambahkan" });
  } catch (error) {
    console.log(error);
    res.json({ msg: error });
  }
};
