import Member from "../../models/MemberModel.js";

export const deleteMember = async (req, res) => {
  try {
    // Cari member berdasarkan parameter yang di request
    const members = await Member.findOne({
      where: {
        id: req.params.id,
      },
    });

    // Validasi jika member dengan id yang di request tidak ditemukan
    if (!members) {
      return res
        .status(404)
        .json({ msg: `Member dengan id ${req.params.id} tidak ditemukan` });
    }

    // JIka id yang direquest ada
    await Member.destroy({
      where: {
        id: members.id,
      },
    });

    // Respond status ok
    res
      .status(200)
      .json({ msg: `Member dengan Id ${req.params.id} berhasil dihapus` });
  } catch (error) {
    console.log(error);
    // Jika terjadi error pada try
    res.status(400).json({ msg: error });
  }
};
