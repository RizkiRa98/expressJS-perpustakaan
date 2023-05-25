import { Request, Response } from "express";
import Users from "../../models/userModel";

// membuat custom request untuk role
interface RoleRequest extends Request {
  id?: Number;
  role?: "super admin" | "admin";
}

export const deleteUser = async (
  req: RoleRequest,
  res: Response
): Promise<void> => {
  try {
    // Cari user berdasarkan parameter yang di request
    const user = await Users.findOne({
      where: {
        id: req.params.id,
      } as any,
    });
    // Validasi jika user dengan Id yang di request tidak ditemukan
    if (!user) {
      res
        .status(404)
        .json({ msg: `User dengan id ${req.params.id} tidak ditemukan` });
      return;
    }

    // JIka yang request delete bukan super admin
    if (req.role === "super admin") {
      // Jika user ada maka hapus
      await Users.destroy({
        where: {
          id: user.id,
        } as any,
      });
    } else {
      res.status(403).json({
        msg: "Akses ditolak! Role admin tidak bisa menghapus user.",
      });
      return;
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
