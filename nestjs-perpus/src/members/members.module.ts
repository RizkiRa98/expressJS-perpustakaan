import { Module } from '@nestjs/common';
import { MembersController } from './members.controller';
import { MembersService } from './members.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Member } from 'src/models/entities/members';

@Module({
  imports: [SequelizeModule.forFeature([Member])],
  controllers: [MembersController],
  providers: [MembersService],
})
export class MembersModule {}
