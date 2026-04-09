import { IsEmail, IsString, IsEnum, MinLength, IsOptional, IsBoolean } from 'class-validator';

export enum UserRole {
  REQUESTER = 'REQUESTER',
  EVALUATOR = 'EVALUATOR',
  CAB_MEMBER = 'CAB_MEMBER',
  IMPLEMENTER = 'IMPLEMENTER',
  AUDITOR = 'AUDITOR',
  ADMIN = 'ADMIN',
}

export class CreateUserDto {
  @IsEmail({}, { message: 'E-mail inválido' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'A senha deve ter pelo menos 6 caracteres' })
  password: string;

  @IsString()
  name: string;

  @IsEnum(UserRole, { message: 'Papel de usuário inválido' })
  role: UserRole;
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(UserRole, { message: 'Papel de usuário inválido' })
  role?: UserRole;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
