import { IsNumber, IsString, Length, Min, Max, IsNotEmpty } from 'class-validator';

export class CreateMemberRequestDto {
    @IsString()
    @IsNotEmpty()
    firstName: string;

    @IsString()
    @IsNotEmpty()
    lastName: string;

    @IsNumber()
    @Min(0)
    @Max(100)
    age: number;
}

export class MemberDetailRequestParam {
    @IsString()
    @Length(24)
    id: string;
}
