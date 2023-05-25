import { Request, Response } from "express";
import Users from "../../models/userModel";

export const Logout = async (req: Request, res: Response): Promise<void> => {
  const refreshToken = req.cookies.refreshToken;

  // Validasi jika tidak ada refresh token
  if (!refreshToken) {
    res.sendStatus(204); // No Content
    return;
  }

  // Jika token ada, bandingkan token dengan yang ada pada database
  const user = await Users.findAll({
    where: {
      refresh_token: refreshToken,
    },
  });

  // Jika token yang dikirim dari client tidak sesuai dengan yang ada di database
  if (!user[0]) {
    res.sendStatus(204); //No Content
    return;
  }

  // Ambil user ID dari database
  const userId = user[0].id;
  // Update refresh token menjadi null berdasarkan userId
  await Users.update(
    {
      refresh_token: null,
    },
    {
      where: {
        id: userId,
      } as any,
    }
  );

  // JIka refresh token sudah di hapus maka hapus cookie pada sisi client
  res.clearCookie("refreshToken");
  res.json({
    msg: "Berhasil Logout",
  });
  return;
};
