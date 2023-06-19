import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from 'src/models/entities/users';
import { VerifyToken } from 'src/middleware/middleware.verifytoken';
import { CreateUserDto } from './dto/createUser.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Get all data user
  @Get()
  async findAll(): Promise<User[]> {
    const user = await this.usersService.findAllUser();
    return user;
  }

  // Get data user by id
  @Get(':id')
  async findById(@Param('id') id: number): Promise<User | null> {
    const user = await this.usersService.findUserById(id);
    if (!user) {
      throw new NotFoundException('User tidak ditemukan');
    }
    return user;
  }

  // Create data user
  @Post('createUser')
  async createUser(@Body() createUserDto: CreateUserDto) {
    await this.usersService.createUser(createUserDto);
    return { message: 'Registrasi Berhasil' };
  }

  // Delete data user
  @Delete(':id')
  async deleteUserById(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.deleteUser(id);
  }
}
