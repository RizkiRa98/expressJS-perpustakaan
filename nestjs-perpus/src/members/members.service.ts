import {
  HttpException,
  HttpStatus,
  Injectable,
  Body,
  Param,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Member } from 'src/models/entities/members';
import { MemberDto } from './dto/member.dto';
import { isEmail, isMobilePhone } from 'class-validator';

@Injectable()
export class MembersService {
  constructor(
    @InjectModel(Member)
    private memberModel: typeof Member,
  ) {}

  // Function get all member
  async findAllMember(): Promise<Member[]> {
    return this.memberModel.findAll({
      attributes: ['id', 'name', 'email', 'phone', 'createdAt'],
    });
  }

  // Function get member by ID
  async findMemberById(id: number): Promise<Member> {
    return this.memberModel.findOne({
      attributes: ['id', 'name', 'email', 'phone', 'createdAt'],
      where: {
        id: id,
      },
    });
  }

  // Function create member
  async createMember(memberDto: MemberDto): Promise<void> {
    const { name, email, phone } = memberDto;

    // Validasi jika nama kosong
    if (name === null || name === undefined || name === '') {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Nama tidak boleh kosong',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    // Validasi jika format email salah
    if (!isEmail(email)) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Format email salah',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    // Validasi email jika sudah digunakan
    const cekEmail = await this.memberModel.findOne({
      where: {
        email: email,
      },
    });
    if (cekEmail) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Email Sudah Digunakan',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    // Validasi jika format phone salah
    if (!isMobilePhone(phone, 'id-ID')) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Format Nomor Hp Salah! Gunakan format Nomor Indonesia (08)',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    // Create member jika semua lolos validasi
    try {
      await this.memberModel.create({
        name,
        email,
        phone,
      });
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }

  // Delete Member
  async deleteMember(id: number) {
    const member = await this.memberModel.findOne({
      where: { id },
    });

    // Jika member tidak ditemukan
    if (!member) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Member Tidak Ditemukan',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    // Jika member ada lakukan delete
    await this.memberModel.destroy({
      where: { id },
    });

    return {
      message: `User dengan id ${id} berhasil dihapus`,
    };
  }

  // Function update member
  async updateMember(@Param('id') id: number, @Body() memberDto: MemberDto) {
    const member = await this.memberModel.findOne({
      where: { id },
    });

    // Validasi jika member tidak ditemukan
    if (!member) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: `Member dengan id ${id} tidak ditemukan`,
        },
        HttpStatus.NOT_FOUND,
      );
    }

    const { name, email, phone } = memberDto;

    // Validasi jika nama kosong
    if (name === null || name === undefined || name === '') {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Nama tidak boleh kosong',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    // Validasi jika format email salah
    if (!isEmail(email)) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Format email salah',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    // Validasi email jika sudah digunakan
    const cekEmail = await this.memberModel.findOne({
      where: {
        email: email,
      },
    });
    if (cekEmail) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Email Sudah Digunakan',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    // Validasi jika format phone salah
    if (!isMobilePhone(phone, 'id-ID')) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Format Nomor Hp Salah! Gunakan format Nomor Indonesia (08)',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      await this.memberModel.update(
        {
          name,
          email,
          phone,
        },
        {
          where: {
            id,
          },
        },
      );
      return {
        message: 'Member berhasil di update',
      };
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }
}
