import { Controller, Get, Post, Body} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { LoginArtistDto } from './dto/login-artist.dto';
import { GetArtist } from './decorators/get-artist.decorator';
import { Artist } from './entities/artist.entity';
import { ValidRoles } from './interfaces/valid-roles.interface';
import { Auth } from './decorators/auth.decorator';

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

  @Get('/check-status')
  @Auth()
  checkStatus(@GetArtist() artist: Artist){
    return this.authService.checkAuth(artist)
  }

  // @Get('/private')
  // @Auth(ValidRoles.admin)
  // private( @GetArtist('email') artist: Artist ){
  //   console.log(artist);
  //   return 'helow';
  // }

}
