import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Artist } from './entities/artist.entity';
import { Repository } from 'typeorm';
import { hashPassword, validatePassword } from 'src/adapters/bcrypt.adapter';
import { LoginArtistDto } from './dto/login-artist.dto';


@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(Artist)
        private readonly artistRepository: Repository<Artist>
    ){}

    async register(createArtistDto: CreateArtistDto){

        const {password} = createArtistDto;
        const hashPass = hashPassword(password);

        try {
            const artist = this.artistRepository.create({
                ...createArtistDto,
                password: hashPass
            });

            await this.artistRepository.save(artist);
            
            return {
                artist: {
                    id: artist.id,
                    name: artist.name,
                    email: artist.email
                },
                token: "ABC"
            };

        } catch (error) {
            this.handleDBErrors(error);
        }
        
    }

    async login(loginArtistDto: LoginArtistDto){
        const {email, password} = loginArtistDto;

        const artist = await this.artistRepository.findOne({
            where: {
                email
            },
            select: { email: true, password: true, id: true }
        });

        if(!artist) throw new BadRequestException(`Credentials are incorrect (email)`);


        if(!validatePassword(password, artist.password)){
            throw new BadRequestException(`Credentials are incorrect (password)`);
        }

        return {
            artist: {
                id: artist.id,
                email: artist.email,
            },
            token: "ABC"
        }
    }

    private handleDBErrors = (error: any) => {
        if(error.code === "23505"){
            throw new BadRequestException(`Error: ${error.detail}`);
        }
        throw new InternalServerErrorException(`Error: ${error.detail}`);
    }
}
