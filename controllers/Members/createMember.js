import Member from "../../models/MemberModel.js";
import validator from "validator";

// Fungsi tambah member baru
export const addMember = async (req, res) => {
  const { name, email, phone } = req.body; //request dari body

  // Validasi format email
  if (email) {
    if (!validator.isEmail(email)) {
      return res.status(400).json({ msg: "Format Email Salah" });
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

  // Validasi email jika sudah digunakan
  const cekEmail = await Member.findOne({
    where: {
      email: email,
    },
  });
  if (cekEmail) {
    return res.status(400).json({ msg: "Email Sudah Digunakan" });
  }

  // Create member
  try {
    await Member.create({
      name: name,
      email: email,
      phone: phone,
    });
    res.json({ msg: "Registrasi Member Baru Berhasil" });
  } catch (error) {
    res.json({
      msg: error,
    });
  }
};
