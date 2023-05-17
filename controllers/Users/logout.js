import Users from "../../models/userModel.js";

export const Logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  // Validasi jika tidak ada refresh token
  if (!refreshToken) {
    return res.sendStatus(204); // No Content
  }

  // Jika token ada, bandingkan token dengan yang ada pada database
  const user = await Users.findAll({
    where: {
      refresh_token: refreshToken,
    },
  });

  // Jika token yang dikirim dari client tidak sesuai dengan yang ada di database
  if (!user[0]) {
    return res.sendStatus(204); //No Content
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
      },
    }
  );

  // JIka refresh token sudah di hapus maka hapus cookie pada sisi client
  res.clearCookie("refreshToken");
  return res.sendStatus(200);
};
