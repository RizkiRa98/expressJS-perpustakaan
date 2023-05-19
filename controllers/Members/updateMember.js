import Member from "../../models/MemberModel.js";
import validator from "validator";

// Fungsi update member
export const updateMember = async (req, res) => {
  // Cari member berdasarkan id dari request parameter
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

  const { name, email, phone } = req.body; //request dari body

  // Validasi email
  if (email) {
    if (!validator.isEmail(email)) {
      return res.status(400).json({ msg: "Format Email Salah" });
    }

    const cekEmail = await Member.findOne({
      where: {
        email: email,
      },
    });
    if (cekEmail && email !== members.email) {
      return res.status(400).json({
        msg: `Email ${email} sudah digunakan`,
      });
    }
  }

  // Validasi format noHP
  if (phone) {
    if (!validator.isMobilePhone(phone, "id-ID")) {
      return res.status(400).json({
        msg: "Format Nomor Hp Salah! Gunakan format Nomor Indonesia (08)",
      });
    }
  }

  // Update member
  try {
    await Member.update(
      {
        name: name,
        email: email,
        phone: phone,
      },
      {
        where: {
          id: members.id,
        },
      }
    );
    // respond status Updated
    res.status(200).json({
      msg: `Member dengan id ${req.params.id} berhasil di update`,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: error });
  }
};
