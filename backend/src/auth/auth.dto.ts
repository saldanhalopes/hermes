import { IsEmail, IsString, MinLength, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum UserRole {
  REQUESTER = 'REQUESTER',
  EVALUATOR = 'EVALUATOR',
  CAB_MEMBER = 'CAB_MEMBER',
  IMPLEMENTER = 'IMPLEMENTER',
  AUDITOR = 'AUDITOR',
  ADMIN = 'ADMIN',
}

export class SignupDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty()
  @IsString()
  tenantId: string;

  @ApiProperty({ enum: UserRole, default: UserRole.REQUESTER })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole = UserRole.REQUESTER;
}
