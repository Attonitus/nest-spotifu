import { IsIn, IsPositive, IsString } from "class-validator";

export const VALID_GENRES = ["pop", "metal", "rock", "reggaeton", "hiphop", "rap", "indie", "classical"];

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
    @IsIn(VALID_GENRES)
    genre: string;


}
