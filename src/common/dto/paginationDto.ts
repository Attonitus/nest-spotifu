import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsPositive } from "class-validator";


export class PaginationDto{

    @IsPositive()
    @IsOptional()
    @Type(() => Number)
    limit?: number;

    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    offset?: number;

}