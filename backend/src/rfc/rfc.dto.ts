import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEnum, IsOptional, ValidateNested, IsBoolean, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export enum RiskLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

export enum RfcStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  UNDER_EVALUATION = 'UNDER_EVALUATION',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  PLANNED = 'PLANNED',
  IMPLEMENTING = 'IMPLEMENTING',
  VERIFICATION = 'VERIFICATION',
  CLOSED = 'CLOSED',
}

export class RfcTaskDto {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsBoolean()
  completed: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  assignedTo?: string;
}

export class ImpactAssessmentDto {
  @ApiProperty()
  @IsString()
  category: string; // e.g., 'Financial', 'Security', 'Operational'

  @ApiProperty()
  score: number; // 1-5
}

export class CreateRfcDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  justification: string;

  @ApiProperty({ enum: RiskLevel })
  @IsEnum(RiskLevel)
  riskLevel: RiskLevel;

  @ApiProperty()
  @IsString()
  scope: string;

  @ApiProperty()
  @IsString()
  rollbackPlan: string;
}

export class TransitionRfcDto {
  @ApiProperty({ enum: RfcStatus })
  @IsEnum(RfcStatus)
  status: RfcStatus;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  comment?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RfcTaskDto)
  tasks?: RfcTaskDto[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ImpactAssessmentDto)
  impactAssessment?: ImpactAssessmentDto[];

  @ApiProperty({ required: false })
  @IsOptional()
  metadata?: any;
}
