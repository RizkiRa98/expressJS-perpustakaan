import {Request, Response} from 'express';
import Member from '../../models/memberModel';
import {WhereOptions} from 'sequelize';

// Fungsi View Member
export const getMember = async (req: Request, res: Response): Promise<void> => {
  try {
    const members = await Member.findAll({
      attributes: ['id', 'name', 'email', 'phone', 'createdAt'],
    });
    res.json(members);
  } catch (error) {
    console.log(error);
    res.json({msg: error});
  }
};

// View member by id
export const getMemberById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const members = await Member.findOne({
      attributes: ['id', 'name', 'email', 'phone', 'createdAt'],
      where: {
        id: req.params.id,
      } as WhereOptions<Member>,
    });
    if (!members) {
      res.status(404).json({
        msg: 'Member Tidak Ditemukan',
      });
      return;
    }
    res.json(members);
  } catch (error) {
    console.log(error);
    res.json({msg: error});
  }
};

