import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth';
import { AccessService } from '../services/AccessService';

const accessService = new AccessService();

export class AccessController {
  async findAll(req: AuthRequest, res: Response) {
    const user = req.user;
    const { type, status, startDate, endDate } = req.query;

    const filters = {
      entityId: user?.role === 'SUPERADMIN' ? undefined : user?.entityId,
      type: type as string,
      status: status as string,
      startDate: startDate ? new Date(startDate as string) : undefined,
      endDate: endDate ? new Date(endDate as string) : undefined,
    };

    const accessLogs = await accessService.findAll(filters);
    return res.json(accessLogs);
  }

  async findById(req: AuthRequest, res: Response) {
    const { id } = req.params;
    const accessLog = await accessService.findById(id);
    return res.json(accessLog);
  }

  async create(req: AuthRequest, res: Response) {
    const user = req.user;
    const data = {
      ...req.body,
      operatorId: user?.id,
    };

    const accessLog = await accessService.create(data);
    return res.status(201).json(accessLog);
  }

  async generateVisitorQRCode(req: AuthRequest, res: Response) {
    const user = req.user;
    const data = {
      ...req.body,
      createdBy: user?.id,
    };

    const qrCode = await accessService.generateVisitorQRCode(data);
    return res.status(201).json(qrCode);
  }

  async validateQRCode(req: AuthRequest, res: Response) {
    // Suporta tanto /validate/:code quanto POST /validate com body
    const code = req.params.code || req.body.code;
    
    if (!code) {
      return res.status(400).json({ message: 'Código do QR Code é obrigatório' });
    }

    const qrCodeData = await accessService.validateVisitorQRCode(code);
    
    // Se validação OK, registrar o acesso automaticamente
    const user = req.user;
    const accessLog = await accessService.useVisitorQRCode(code, user?.id!);
    
    return res.json({
      message: 'QR Code válido! Acesso registrado com sucesso.',
      visitor: {
        visitorName: qrCodeData.visitorName,
        visitorDocument: qrCodeData.visitorDoc,
      },
      accessLog,
    });
  }

  async useQRCode(req: AuthRequest, res: Response) {
    const user = req.user;
    const { code } = req.params;

    const accessLog = await accessService.useVisitorQRCode(code, user?.id!);
    return res.status(201).json(accessLog);
  }

  async getStats(req: AuthRequest, res: Response) {
    const user = req.user;
    const entityId = user?.role === 'SUPERADMIN' ? undefined : user?.entityId;

    const stats = await accessService.getStats(entityId);
    return res.json(stats);
  }

  // Listar todos os QR Codes
  async findAllQRCodes(req: AuthRequest, res: Response) {
    const user = req.user;
    const entityId = user?.role === 'SUPERADMIN' ? undefined : user?.entityId;

    const qrCodes = await accessService.findAllQRCodes(entityId);
    return res.json(qrCodes);
  }

  // Buscar QR Code por ID
  async findQRCodeById(req: AuthRequest, res: Response) {
    const { id } = req.params;
    const qrCode = await accessService.findQRCodeById(id);
    return res.json(qrCode);
  }

  // Deletar QR Code
  async deleteQRCode(req: AuthRequest, res: Response) {
    const { id } = req.params;
    await accessService.deleteQRCode(id);
    return res.status(204).send();
  }
}
