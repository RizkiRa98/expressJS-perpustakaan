import express from 'express';

import {getMember, getMemberById} from '../controllers/Members/getMembers';
import {addMember} from '../controllers/Members/createMembers';
import {deleteMember} from '../controllers/Members/deleteMembers';
import {updateMember} from '../controllers/Members/updateMembers';
import {verifyToken} from '../middleware/verifyToken';

const MemberRoutes = express.Router();

MemberRoutes.get('/members', verifyToken, getMember);
MemberRoutes.get('/members/:id', verifyToken, getMemberById);
MemberRoutes.patch('/members/:id', verifyToken, updateMember);
MemberRoutes.delete('/members/:id', verifyToken, deleteMember);
MemberRoutes.post('/members', verifyToken, addMember);

export default MemberRoutes;

