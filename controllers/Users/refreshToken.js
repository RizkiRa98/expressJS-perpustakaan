import Users from "../../models/userModel.js";
import jwt from "jsonwebtoken";

// membuat fungsi untuk refresh token
export const refreshToken = async (req, res) => {
  try {
    // Mengambil value yang di set pada cookie
    const refreshToken = req.cookies.refreshToken;

    // Validasi jika tidak ada refresh token
    if (!refreshToken) {
      return res.sendStatus(401); // Unauthorize
    }

    // Jika ada bandingkan token dengan yang ada pada database
    const user = await Users.findAll({
      where: {
        refresh_token: refreshToken,
      },
    });

    // Jika token yang dikirim dari client tidak sesuai dengan yang ada di database
    if (!user[0]) {
      return res.sendStatus(403); //Forbidden
    }

    // Jika cocok maka verifikasi token
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        // Jika terdapat error
        if (err) {
          return res.sendStatus(403); //Forbidden
        }

        // Jika tidak Error ambil value id, name, email, role
        const userId = user[0].id;
        const name = user[0].name;
        const email = user[0].email;
        const role = user[0].role;
        const accessToken = jwt.sign(
          { userId, name, email, role },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "15s" }
        );
        res.json({ accessToken });
      }
    );
  } catch (error) {
    console.log(error);
  }
};
