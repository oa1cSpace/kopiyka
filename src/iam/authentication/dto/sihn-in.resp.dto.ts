import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class SignInRespDto {
    @IsString()
    @ApiProperty({ example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI3MDZlMmRhMS0zYTBjLTQwZWItODI0Yy04N2FkZGM5YTNhY2UiLCJlbWFpbCI6InVzZXJAbWFpbC5jb20iLCJpYXQiOjE3Mzc3NTI1MTYsImV4cCI6MTczNzc1NjExNiwiYXVkIjoibG9jYWxob3N0OjU1MDAiLCJpc3MiOiJsb2NhbGhvc3Q6NTUwMCJ9.-pKJhaIrkrexYr4WfX6pcNLhC0qXrH-ywo6ofd3dOSQ" })
    accessToken: string;

    @IsString()
    @ApiProperty({ example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI3MDZlMmRhMS0zYTBjLTQwZWItODI0Yy04N2FkZGM5YTNhY2UiLCJpYXQiOjE3Mzc3NTI1MTYsImV4cCI6MTczNzc1NjExNiwiYXVkIjoibG9jYWxob3N0OjU1MDAiLCJpc3MiOiJsb2NhbGhvc3Q6NTUwMCJ9.cSv42zgrUhs3drFJZUrnOofpsNhPD85omChlDhzaGw4" })
    refreshToken: string;
}
