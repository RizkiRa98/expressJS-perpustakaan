import { Controller, Post, Body, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() authDto: AuthDto) {
    try {
      const accessToken = await this.authService.login(authDto);
      console.log(accessToken);
      return {
        Acess_Token: accessToken,
      };
    } catch (error) {
      console.log(error);
      return {
        Error: error,
      };
    }
  }

  // Function logout
  @Post('logout')
  async logout(@Req() req: Request, @Res() res: Response): Promise<void> {
    await this.authService.logout(req, res);
  }
}
