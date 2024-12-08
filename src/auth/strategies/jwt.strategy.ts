import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Artist } from "../entities/artist.entity";
import { JwtPayload } from "../interfaces/jwt-payload.interface";
import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ConfigService } from "@nestjs/config";


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(
        @InjectRepository(Artist)
        private readonly artistRepo: Repository<Artist>,

        private readonly configService: ConfigService
    ){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get("JWT_SECRET")
        })
    }


    async validate(payload: JwtPayload) : Promise<Artist> {

        const {id} = payload;
        if(!id) throw new UnauthorizedException(`Error: payload not have ID`);

        const artist = await this.artistRepo.findOneBy({id});

        if(!artist) throw new UnauthorizedException(`Token not valid`);

        if(!artist.isActive) 
            throw new UnauthorizedException(`User ${artist.name} is unactive. Talk with an admin`);

        return artist;
    }
}