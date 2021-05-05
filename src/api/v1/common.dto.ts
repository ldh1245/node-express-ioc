import { IsNumber, Min, Max } from 'class-validator';

export class PaginationQuery {
    @IsNumber()
    @Min(1)
    page: number;

    @IsNumber()
    @Min(1)
    @Max(20)
    limit: number;
}
