import {Request, Response} from 'express';
import Member from '../../models/memberModel';
import validator from 'validator';

// Fungsi tambah member baru
export const addMember = async (req: Request, res: Response): Promise<void> => {
  // Request dari body
  const {name, email, phone} = req.body;

  // Validasi format email
  if (email) {
    if (!validator.isEmail(email)) {
      res.status(400).json({msg: 'Format Email Salah'});
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

  // Validasi email jika sudah digunakan
  const cekEmail = await Member.findOne({
    where: {
      email: email,
    },
  });
  if (cekEmail) {
    res.status(400).json({msg: 'Email Sudah Digunakan'});
    return;
  }

  // Create member
  try {
    await Member.create({
      name: name,
      email: email,
      phone: phone,
    });
    res.json({msg: 'Registrasi Member Baru Berhasil'});
  } catch (error) {
    res.json({
      msg: error,
    });
  }
};

