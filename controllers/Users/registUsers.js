import Users from "../../models/userModel.js";
import bcrypt from "bcrypt";
import validator from "validator";

// Fungsi registrasi user baru
export const Register = async (req, res) => {
  const { name, email, password, confPassword, role } = req.body; // request from body atau dari luar

  // Validasi format email
  console.log(password);
  if (email) {
    if (!validator.isEmail(email)) {
      return res.status(400).json({ msg: "Format Email Salah" });
    }
  }

  // Validasi email
  const cekEmail = await Users.findOne({
    where: {
      email: email,
    },
  });
  if (cekEmail) {
    return res.status(400).json({ msg: "Email Sudah Digunakan" });
  }

  // Validasi password
  if (password !== confPassword) {
    return res
      .status(400)
      .json({ msg: "Password dan Confirm Password Berbeda" });
  }

  // JIka password dan confirm password cocok
  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(password, salt);

  // Create User
  try {
    await Users.create({
      name: name,
      email: email,
      password: hashPassword,
      role: role,
    });
    res.json({ msg: "Registrasi Berhasil" });
  } catch (error) {
    console.log(error);
    res.json({ msg: error });
  }
};
