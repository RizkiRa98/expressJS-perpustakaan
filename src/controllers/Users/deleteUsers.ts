import {Request, Response} from 'express';
import Users from '../../models/userModel';
import {WhereOptions} from 'sequelize';

// membuat custom request untuk role
interface RoleRequest extends Request {
  id?: number;
  role?: 'super admin' | 'admin';
}

export const deleteUser = async (
  req: RoleRequest,
  res: Response,
): Promise<void> => {
  try {
    // Cari user berdasarkan parameter yang di request
    const user = await Users.findOne({
      where: {
        id: req.params.id,
      } as WhereOptions<Users>,
    });
    // Validasi jika user dengan Id yang di request tidak ditemukan
    if (!user) {
      res
        .status(404)
        .json({msg: `User dengan id ${req.params.id} tidak ditemukan`});
      return;
    }

    // JIka yang request delete bukan super admin
    if (req.role === 'super admin') {
      // Jika user ada maka hapus
      await Users.destroy({
        where: {
          id: user.id,
        } as WhereOptions<Users>,
      });
    } else {
      res.status(403).json({
        msg: 'Akses ditolak! Role admin tidak bisa menghapus user.',
      });
      return;
    }

    // Respond status ok
    res
      .status(200)
      .json({msg: `User dengan Id ${req.params.id} berhasil dihapus`});
  } catch (error) {
    // Jika terjadi error pada try
    console.log(error);

    res.status(400).json({msg: error});
  }
};

