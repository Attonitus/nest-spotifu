import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { LoginArtistDto } from './dto/login-artist.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  registerArtist(@Body() createArtistDto: CreateArtistDto) {
    return this.authService.register(createArtistDto);
  }

  @Post('/login')
  loginArtist(@Body() loginArtistDto: LoginArtistDto){
    return this.authService.login(loginArtistDto);
  }

}
