import express from "express";
// Import controller Users
import { getUser, getUserById } from "../controllers/Users/getUsers.js";
import { Register } from "../controllers/Users/registUsers.js";
import { updateUser } from "../controllers/Users/updateUsers.js";
import { deleteUser } from "../controllers/Users/deleteUsers.js";
import { Login } from "../controllers/Users/loginUsers.js";
import { Logout } from "../controllers/Users/logout.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { refreshToken } from "../controllers/Users/refreshToken.js";

const UserRoutes = express.Router();
UserRoutes.get("/users", verifyToken, getUser);
UserRoutes.get("/users/:id", verifyToken, getUserById);
UserRoutes.post("/users", verifyToken, Register);
UserRoutes.patch("/users/:id", verifyToken, updateUser);
UserRoutes.delete("/users/:id", verifyToken, deleteUser);
UserRoutes.post("/login", Login);
UserRoutes.delete("/logout", Logout);
UserRoutes.get("/token", refreshToken);

export default UserRoutes;
