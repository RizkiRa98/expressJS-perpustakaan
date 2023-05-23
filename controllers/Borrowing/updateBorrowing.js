import Books from "../../models/BookModel.js";
import Borrowing from "../../models/BorrowingModel.js";
import Member from "../../models/MemberModel.js";

// Fungsi update peminjaman
export const updateBorrowing = async (req, res) => {
  // cari borrowing berdasarkan id
  const borrowing = await Borrowing.findOne({
    where: {
      id: req.params.id,
    },
  });

  // Validasi jika id tidak ada
  if (!borrowing) {
    return res.status(400).json({
      msg: `Peminjaman dengan id ${req.params.id} tidak ditemukan`,
    });
  }

  let { memberId, booksId, borrow_at, return_at, max_return, status } =
    req.body;

  // Cek member
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

  // Cek buku tersedia atau tidak
  const availableBook = await Books.findOne({
    where: {
      id: booksId,
    },
  });
  if (!availableBook) {
    return res.status(404).json({
      msg: "Buku tidak tersedia",
    });
  }

  // Validasi jika member dengan status not_returned tidak bisa meminjam terlebih dahulu

  if (booksId === borrowing.booksId && memberId === borrowing.memberId) {
    return res.status(400).json({
      msg: "Member belum mengembalikan buku pinjaman sebelumnya",
    });
  }

  // add borrowing
  try {
    // Max return otomatis menjadi 7 setelah borrow_at
    const borrowDate = new Date(borrow_at);
    const maxReturnDate = new Date(
      borrowDate.getTime() + 7 * 24 * 60 * 60 * 1000
    );

    // Perhitungan denda
    const maxReturn = new Date(borrowing.max_return);
    const returnDate = new Date(return_at);
    const dayDifference = Math.floor(
      (returnDate - maxReturn) / (1000 * 60 * 60 * 24)
    );

    let charge = 0;
    if (dayDifference >= 1) {
      charge = 5000 + (dayDifference - 1) * 1000;
    }

    // Konversi menjadi string
    charge = charge.toString();

    // Jika return_at di update lakukan update pada tabel buku juga
    if (return_at) {
      status = "returned";
      // cek jika ada borrowing Id pada books maka ubah borrowingId menjadi null dan status books menjadi available

      const cekBorrowingId = await Books.findOne({
        where: {
          borrowingId: req.params.id,
        },
      });

      if (cekBorrowingId) {
        await Books.update(
          {
            borrowingId: null,
            status: "available",
          },
          {
            where: {
              id: borrowing.booksId,
            },
          }
        );
      }
    }

    // Update borrowing
    await Borrowing.update(
      {
        memberId: memberId,
        booksId: booksId,
        borrow_at: borrow_at,
        return_at: return_at,
        max_return: borrow_at
          ? maxReturnDate.toISOString().split("T")[0]
          : borrowing.max_return,
        charge: charge,
        status: status,
      },
      {
        where: {
          id: borrowing.id,
        },
      }
    );

    // respon status updated
    res.status(200).json({
      msg: `Peminjaman dengan id ${req.params.id} berhasil di update `,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      msg: error,
    });
  }
};
