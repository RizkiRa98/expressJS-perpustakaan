import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/models/entities/users';
import { CreateUserDto } from './dto/createUser.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  // Function get all user
  async findAllUser(): Promise<User[]> {
    return this.userModel.findAll({
      attributes: ['id', 'name', 'email', 'role', 'createdAt'],
    });
  }

  // Function get user by ID
  async findUserById(id: number): Promise<User> {
    return this.userModel.findOne({
      attributes: ['id', 'name', 'email', 'role', 'createdAt'],
      where: {
        id: id,
      },
    });
  }

  // Function create user
  async createUser(createUserDto: CreateUserDto): Promise<void> {
    const { name, email, password, confPassword, role } = createUserDto;

    // Validasi format email
    // Saat melakukan request dengan format email salah validasi ini masih belum muncul
    if (!createUserDto.email) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Format Email Salah!',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    // Validasi email jika sudah digunakan
    const cekEmail = await this.userModel.findOne({
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

    // Validasi password
    if (password !== confPassword) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Password dan Confirm Password Berbeda',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    // Validasi role
    if (role !== 'super admin' && role !== 'admin') {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Nama role harus super admin atau admin',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    // Jika password dan confpassword sesuai
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);

    // Create User
    try {
      await this.userModel.create({
        name,
        email,
        password: hashPassword,
        role,
      });
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }

  // Delete User
  async deleteUser(id: number) {
    const user = await this.userModel.findOne({
      where: { id },
    });

    if (!user) {
      return {
        message: 'User Tidak Ditermukan',
      };
    }

    await this.userModel.destroy({
      where: { id },
    });

    return {
      message: `User dengan id ${id} berhasil dihapus`,
    };
  }
}
