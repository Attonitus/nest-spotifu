import { IsEmail, IsString, MinLength } from "class-validator";


export class LoginArtistDto{

    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    password: string;
}