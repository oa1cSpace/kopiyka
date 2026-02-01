import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class UserGetRespDto {
    @ApiProperty({
        description: 'user id',
        example: '5e039a4f-c2ed-4e0c-931d-c90951349419',
    })
    id: string;

    @ApiPropertyOptional({
    description: 'user name',
    example: 'John',
    })
    name: string;

    @ApiProperty({
        description: 'user e-mail',
        example: 'john.doe@mail.com',
    })
    email: string;
}