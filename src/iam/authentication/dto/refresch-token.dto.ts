import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class RefreshTokenDto {
  @IsNotEmpty()
  @ApiProperty({ example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI3MDZlMmRhMS0zYTBjLTQwZWItODI0Yy04N2FkZGM5YTNhY2UiLCJpYXQiOjE3Mzc3NTI1MTYsImV4cCI6MTczNzc1NjExNiwiYXVkIjoibG9jYWxob3N0OjU1MDAiLCJpc3MiOiJsb2NhbGhvc3Q6NTUwMCJ9.cSv42zgrUhs3drFJZUrnOofpsNhPD85omChlDhzaGw4" })
  refreshToken: string;
}
