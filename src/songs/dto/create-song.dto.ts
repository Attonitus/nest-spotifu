import { Type } from "class-transformer";
import { IsIn, IsNumber, IsPositive, IsString } from "class-validator";

export const VALID_GENRES = ["pop", "metal", "rock", "reggaeton", "hiphop", "rap", "indie", "classical"];

export class CreateSongDto {

    @IsString()
    title: string;
    
    @IsNumber()
    @IsPositive()
    @Type(() => Number)
    year: number;

    @IsString()
    @IsIn(VALID_GENRES)
    genre: string;

}
