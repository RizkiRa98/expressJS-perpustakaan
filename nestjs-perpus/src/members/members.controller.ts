import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Delete,
  Put,
} from '@nestjs/common';
import { MembersService } from './members.service';
import { Member } from 'src/models/entities/members';
import { MemberDto } from './dto/member.dto';

@Controller('members')
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  // Get all data member
  @Get()
  async findAll(): Promise<Member[]> {
    const member = await this.membersService.findAllMember();
    return member;
  }

  // Get data member by id
  @Get(':id')
  async findById(@Param('id') id: number): Promise<Member | null> {
    const member = await this.membersService.findMemberById(id);
    if (!member) {
      throw new NotFoundException('User Tidak Ditemukan');
    }
    return member;
  }

  // Create data member
  @Post('createMember')
  async createMember(@Body() memberDto: MemberDto) {
    await this.membersService.createMember(memberDto);
    return {
      message: 'Member Berhasil Ditambah',
    };
  }

  // Delete Member by id
  @Delete(':id')
  async deleteUserById(@Param('id', ParseIntPipe) id: number) {
    return this.membersService.deleteMember(id);
  }

  // Update Member by id
  @Put(':id')
  async updateMemberById(
    @Param('id', ParseIntPipe) id: number,
    @Body() memberDto: MemberDto,
  ) {
    return await this.membersService.updateMember(id, memberDto);
  }
}
