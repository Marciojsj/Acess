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
    const { code } = req.params;
    const qrCodeData = await accessService.validateVisitorQRCode(code);
    return res.json(qrCodeData);
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
}
