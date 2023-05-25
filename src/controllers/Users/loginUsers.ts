import { Request, Response } from "express";
import Users from "../../models/userModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Fungsi login
export const Login = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await Users.findAll({
      where: {
        email: req.body.email,
      },
    });

    // Cek user ditemukan atau tidak
    if (user.length === 0) {
      res.status(400).json({ msg: "Email atau Password Salah!" });
      return;
    }

    // Cek ke cocokan password yang di request dengan yg di database
    const match = await bcrypt.compare(req.body.password, user[0].password);

    //Jika password dan confirm password tidak cocok
    if (!match) {
      res.status(400).json({ msg: "Email atau Password Salah!" });
      return;
    }

    // Jika cocok maka construct User nya
    const userId = user[0].id;
    const name = user[0].name;
    const email = user[0].email;
    const role = user[0].role;

    // Membuat akses token yang berfungsi selama 1 hari
    const accessToken = jwt.sign(
      { userId, name, email, role },
      process.env.ACCESS_TOKEN_SECRET!,
      {
        expiresIn: "20s",
      }
    );

    // Membuat refresh token
    const refreshToken = jwt.sign(
      { userId, name, email, role },
      process.env.REFRESH_TOKEN_SECRET!,
      {
        expiresIn: "1d",
      }
    );
    await Users.update(
      { refresh_token: refreshToken },
      {
        where: {
          id: userId,
        } as any,
      }
    );

    // Membuat http cookie yang dikirimkan ke sisi client
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, //expired dalam 1 hari
    });
    res.json({ accessToken });
  } catch (error) {
    res.status(404).json({ msg: "User tidak ditemukan!" });
  }
};
