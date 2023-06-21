import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/models/entities/users';
import { AuthDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { Request, Response } from 'express';

@Injectable()
export class AuthService {
  constructor(@InjectModel(User) private userModel: typeof User) {}

  // Function login
  async login(authDto: AuthDto): Promise<string> {
    try {
      const user = await this.userModel.findOne({
        where: {
          email: authDto.email,
        },
      });

      // Cek jika user email tidak cocok
      if (!user) {
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: 'Email atau Password Salah',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      // Cek kecocokan password dengan password pada user
      const matchPass = await bcrypt.compare(authDto.password, user.password);

      if (!matchPass) {
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: 'Email atau Password Salah',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      // Membuat accessToken dan refreshToken
      const { id, name, email, role } = user;

      // Membuat accessToken
      const accessToken = jwt.sign(
        { userId: id, name, email, role },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '1d' },
      );

      // Membuat refreshToken
      const refreshToken = jwt.sign(
        { userId: id, name, email, role },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '1d' },
      );

      // Update user refresh token
      await this.userModel.update(
        {
          refresh_token: refreshToken,
        },
        { where: { id: user.id } },
      );
      // res.cookie('refreshToken', refreshToken, {
      //   httpOnly: true,
      //   maxAge: 24 * 60 * 60 * 1000,
      // });
      return accessToken;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  // Function Logout
  async logout(req: Request, res: Response): Promise<void> {
    const email = req.body.email;

    // Validasi jika tidak ada email
    if (!email) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
        },
        HttpStatus.NOT_FOUND,
      );
    }

    // Jika email ada, bandingkan dengan yg di database
    const user = await this.userModel.findAll({
      where: {
        email: email,
      },
    });

    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          message: 'Email tidak ditemukan',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    // Lakukan logout dan update refresh token menjadi null
    await this.userModel.update(
      {
        refresh_token: null,
      },
      { where: { email: email } },
    );
    res.clearCookie('refreshToken');
    res.json({
      message: 'Berhasil Logout',
    });
    return;
  }
}
