import {Request, Response} from 'express';
import Member from '../../models/memberModel';
import validator from 'validator';
import {WhereOptions} from 'sequelize';

// Fungsi update member
export const updateMember = async (
  req: Request,
  res: Response,
): Promise<void> => {
  // Cari member berdasarkan id dari request parameter
  const members = await Member.findOne({
    where: {
      id: req.params.id,
    } as WhereOptions<Member>,
  });

  // Validasi jika member dengan id yang di request tidak ditemukan
  if (!members) {
    res
      .status(404)
      .json({msg: `Member dengan id ${req.params.id} tidak ditemukan`});
    return;
  }

  // Request dari body
  const {name, email, phone} = req.body;

  // Validasi email
  if (email) {
    if (!validator.isEmail(email)) {
      res.status(400).json({msg: 'Format Email Salah'});
      return;
    }

    const cekEmail = await Member.findOne({
      where: {
        email: email,
      },
    });
    if (cekEmail && email !== members.email) {
      res.status(400).json({
        msg: `Email ${email} sudah digunakan`,
      });
      return;
    }
  }

  // Validasi format noHP
  if (phone) {
    if (!validator.isMobilePhone(phone, 'id-ID')) {
      res.status(400).json({
        msg: 'Format Nomor Hp Salah! Gunakan format Nomor Indonesia (08)',
      });
      return;
    }
  }

  // Update member
  try {
    await Member.update(
      {
        name: name,
        email: email,
        phone: phone,
      },
      {
        where: {
          id: members.id,
        } as WhereOptions<Member>,
      },
    );
    // respond status Updated
    res.status(200).json({
      msg: `Member dengan id ${req.params.id} berhasil di update`,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({msg: error});
  }
};

