// Middleware application level

import jwt from "jsonwebtoken";
import { refreshToken } from "../controllers/Users/refreshToken.js";
import Users from "../models/userModel.js";

export const verifyToken = async (req, res, next) => {
  // const authHeader = req.headers["authorization"];
  // const token = authHeader && authHeader.split(" ")[1];

  // // Jika nilai token yang dikirim adalah null
  // if (token === null) {
  //   return res.sendStatus(401); // Kode 401 adalah kode unauthorize
  // }

  // // Jika token didapatkan, maka lakukan verifikasi token
  // jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
  //   //JIka terdapat error return status 403 Forbidden
  //   if (err) {
  //     return res.sendStatus(403);
  //   }
  //   // request email sama dengan email yang di decode dari token
  //   req.email = decoded.email;
  //   next();
  // });
  if (!req.cookies.refreshToken) {
    return res.status(401).json({ msg: "Unauthorize, anda belum login!" });
  }

  const user = await Users.findOne({
    where: {
      refresh_token: req.cookies.refreshToken,
    },
  });

  if (!user) {
    return res.status(404).json({ msg: "Anda Belum Login!" });
  }
  req.userId = user.id;
  req.name = user.name;
  req.email = user.email;
  req.role = user.role;
  next();
};
