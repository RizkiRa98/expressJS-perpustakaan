import Users from "../../models/userModel.js";
import bcrypt from "bcrypt";

import validator from "validator";

export const updateUser = async (req, res) => {
  // Cari user berdasarkan id dari request parameter
  const user = await Users.findOne({
    where: {
      id: req.params.id,
    },
  });
  // Validasi jika user tidak ditemukan
  if (!user) {
    return res.status(404).json({
      msg: `User dengan id ${req.params.id} tidak ditemukan`,
    });
  }

  const { name, email, password, confPassword, role } = req.body; //request dari body

  // Validasi email
  if (email) {
    if (!validator.isEmail(email)) {
      return res.status(400).json({ msg: "Format Email Salah" });
    }

    const cekEmail = await Users.findOne({
      where: {
        email: email,
      },
    });
    if (cekEmail && email !== user.email) {
      return res.status(400).json({
        msg: `Email ${email} sudah digunakan`,
      });
    }
  }

  // Validasi email jika mengubah password
  let hashPassword;
  const salt = await bcrypt.genSalt();
  if (typeof password !== "undefined" && password !== null && password !== "") {
    hashPassword = await bcrypt.hash(password, salt);
  } else {
    hashPassword = user.password;
  }

  // Validasi password dan confirm password
  if (password !== confPassword) {
    return res.status(400).json({
      msg: "Password dan Confirm Password Berbeda",
    });
  }

  try {
    await Users.update(
      {
        name: name,
        email: email,
        password: hashPassword,
        role: role,
      },
      {
        where: {
          id: user.id,
        },
      }
    );
    // respond status Updated
    res.status(200).json({
      msg: `User dengan id ${req.params.id} berhasil di update`,
    });
  } catch (error) {
    console.log(error);
  }
};
