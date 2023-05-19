import express from "express";

import { getMember, getMemberById } from "../controllers/Members/getMember.js";
import { addMember } from "../controllers/Members/createMember.js";
import { deleteMember } from "../controllers/Members/deleteMember.js";
import { updateMember } from "../controllers/Members/updateMember.js";
import { verifyToken } from "../middleware/verifyToken.js";

const MemberRoutes = express.Router();

MemberRoutes.get("/members", verifyToken, getMember);
MemberRoutes.get("/members/:id", verifyToken, getMemberById);
MemberRoutes.patch("/members/:id", verifyToken, updateMember);
MemberRoutes.delete("/members/:id", verifyToken, deleteMember);
MemberRoutes.post("/members", verifyToken, addMember);

export default MemberRoutes;
