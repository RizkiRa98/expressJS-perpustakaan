import express from "express";
// Import controller Users
import { getUser } from "../controllers/Users/getUsers.js";
import { Register } from "../controllers/Users/registUsers.js";
import { Login } from "../controllers/Users/loginUsers.js";
import { Logout } from "../controllers/Users/logout.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { refreshToken } from "../controllers/Users/refreshToken.js";

const UserRoutes = express.Router();
UserRoutes.get("/users", verifyToken, getUser);
UserRoutes.post("/users", verifyToken, Register);
UserRoutes.post("/login", Login);
UserRoutes.delete("/logout", Logout);
UserRoutes.get("/token", refreshToken);

export default UserRoutes;
