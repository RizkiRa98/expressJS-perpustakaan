import express from "express";

//import controller
import { getUser, getUserById } from "../controllers/Users/getUsers";
import { createUser } from "../controllers/Users/createUsers";
import { Login } from "../controllers/Users/loginUsers";
import { verifyToken } from "../middleware/verifyToken";
import { Logout } from "../controllers/Users/logoutUsers";
import { deleteUser } from "../controllers/Users/deleteUsers";
import { updateUser } from "../controllers/Users/updateUsers";

const UserRoutes = express.Router();
UserRoutes.get("/getUsers", verifyToken, getUser);
UserRoutes.get("/getUsersById/:id", verifyToken, getUserById);
UserRoutes.post("/createUsers", verifyToken, createUser);
UserRoutes.delete("/deleteUsers/:id", verifyToken, deleteUser);
UserRoutes.patch("/updateUsers/:id", verifyToken, updateUser);
UserRoutes.post("/login", Login);
UserRoutes.delete("/logout", Logout);

export default UserRoutes;
