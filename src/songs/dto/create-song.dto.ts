import { IsIn, IsPositive, IsString } from "class-validator";


export class CreateSongDto {


    @IsString()
    songUrl: string;

    @IsString()
    title: string;
    
    @IsPositive()
    year: number;

    @IsString()
    imageUrl: string;

    @IsString()
    @IsIn(["pop", "metal", "rock", "reggaeton", "hiphop", "rap", "indie"])
    genre: string;


}
