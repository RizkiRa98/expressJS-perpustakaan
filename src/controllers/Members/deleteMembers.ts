import {Request, Response} from 'express';
import Member from '../../models/memberModel';
import {WhereOptions} from 'sequelize';

export const deleteMember = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    // Cari member berdasarkan parameter yang di request
    const members = await Member.findOne({
      where: {
        id: req.params.id,
      } as WhereOptions<Member>,
    });

    // Validasi jika member dengan id yang di request tidak ditemukan
    if (!members) {
      res.json({msg: `Member dengan id ${req.params.id} tidak ditemukan`});
      return;
    }

    // JIka id yang direquest ada
    await Member.destroy({
      where: {
        id: members.id,
      } as WhereOptions<Member>,
    });

    // Respond status ok
    res.json({msg: `Member dengan Id ${req.params.id} berhasil dihapus`});
  } catch (error) {
    console.log(error);
    // Jika terjadi error pada try
    res.json({msg: error});
  }
};

