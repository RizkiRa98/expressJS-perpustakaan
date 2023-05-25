import { Request, Response } from "express";
import Users from "../../models/userModel";

// fungsi get user menggunakan async agar bisa dilakukan saat melakukan proses yg lain
export const getUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await Users.findAll({
      attributes: ["id", "name", "email", "role", "createdAt"],
    });
    res.json(users); //berikan response berupa data users berbentuk JSON
  } catch (error) {
    console.log(error);
  }
};

// View User by id
export const getUserById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const users = await Users.findOne({
      attributes: ["id", "name", "email", "role", "createdAt"],
      where: {
        id: req.params.id,
      } as any,
    });
    if (!users) {
      res.status(404).json({
        msg: "User tidak ditemukan",
      });
    } else {
      res.json(users);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Terjadi kesalahan server",
    });
  }
};
