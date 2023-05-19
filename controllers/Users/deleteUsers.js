import Users from "../../models/userModel.js";

export const deleteUser = async (req, res) => {
  try {
    // Cari user berdasarkan parameter yang di request
    const user = await Users.findOne({
      where: {
        id: req.params.id,
      },
    });
    // Validasi jika user dengan Id yang di request tidak ditemukan
    if (!user) {
      return res
        .status(404)
        .json({ msg: `User dengan id ${req.params.id} tidak ditemukan` });
    }

    // JIka yang request delete bukan super admin
    if (req.role === "super admin") {
      // Jika user ada maka hapus
      await Users.destroy({
        where: {
          id: user.id,
        },
      });
    } else {
      return res.status(403).json({
        msg: "Akses ditolak! Role admin tidak bisa menghapus user.",
      });
    }

    // Respond status ok
    res
      .status(200)
      .json({ msg: `User dengan Id ${req.params.id} berhasil dihapus` });
  } catch (error) {
    // Jika terjadi error pada try
    res.status(400).json({ msg: error });
  }
};
