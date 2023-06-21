import { IsEmail, IsMobilePhone, IsNotEmpty } from 'class-validator';

export class MemberDto {
  @IsNotEmpty({ message: 'Nama Tidak Boleh Kosong' })
  name: string;

  @IsNotEmpty()
  @IsEmail({}, { message: 'Format email salah' })
  email: string;

  @IsNotEmpty({ message: 'Nama Tidak Boleh Kosong' })
  @IsMobilePhone('id-ID', {}, { message: 'Format nomor telepon salah' })
  phone: string;
}
