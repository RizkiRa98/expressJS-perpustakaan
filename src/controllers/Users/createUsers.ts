import { Request, Response } from "express";
import Users from "../../models/userModel";
import bcrypt from "bcrypt";
import validator from "validator";

// Fungsi registrasi user baru
export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { name, email, password, confPassword, role } = req.body; // request from body atau dari luar

  // Validasi format email
  if (email) {
    if (!validator.isEmail(email)) {
      res.status(400).json({ msg: "Format Email Salah" });
      return;
    }
  }

  // Validasi email jika sudah digunakan
  const cekEmail = await Users.findOne({
    where: {
      email: email,
    },
  });
  if (cekEmail) {
    res.status(400).json({ msg: "Email Sudah Digunakan" });
    return;
  }

  // Validasi password
  if (password !== confPassword) {
    res.status(400).json({ msg: "Password dan Confirm Password Berbeda" });
    return;
  }

  // validasi role
  if (role !== "super admin" && role !== "admin") {
    res.status(400).json({
      msg: "Nama role harus super admin atau admin",
    });
    return;
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
