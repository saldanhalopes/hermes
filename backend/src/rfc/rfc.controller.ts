import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Controller, Post, Get, Patch, Body, Param, UseGuards, Req } from '@nestjs/common';
import { RfcService } from './rfc.service';
import { CreateRfcDto, TransitionRfcDto } from './rfc.dto';
import { FirebaseStoreAuthGuard } from '../firebase/auth.guard';

@ApiTags('rfc')
@ApiBearerAuth()
@UseGuards(FirebaseStoreAuthGuard)
@Controller('rfc')
export class RfcController {
  constructor(private readonly rfcService: RfcService) {}

  @Post()
  @ApiOperation({ summary: 'Criar uma nova solicitação de mudança' })
  create(@Body() dto: CreateRfcDto, @Req() req: any) {
    return this.rfcService.create(dto, req.user);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as RFCs do tenant' })
  findAll(@Req() req: any) {
    return this.rfcService.findAll(req.user.tenantId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter detalhes de uma RFC específica' })
  findOne(@Param('id') id: string, @Req() req: any) {
    return this.rfcService.findOne(id, req.user.tenantId);
  }

  @Patch(':id/transition')
  @ApiOperation({ summary: 'Realizar transição de status da RFC' })
  transitionStatus(
    @Param('id') id: string,
    @Body() dto: TransitionRfcDto,
    @Req() req: any
  ) {
    return this.rfcService.transitionStatus(id, dto, req.user);
  }
}
