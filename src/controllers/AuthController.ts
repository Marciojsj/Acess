import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';

const authService = new AuthService();

export class AuthController {
  async login(req: Request, res: Response) {
    const result = await authService.login(req.body);
    return res.json(result);
  }

  async register(req: Request, res: Response) {
    const result = await authService.register(req.body);
    return res.status(201).json(result);
  }

  async refreshToken(req: Request, res: Response) {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ message: 'Refresh token não fornecido' });
    }

    const result = await authService.refreshToken(refreshToken);
    return res.json(result);
  }

  async logout(req: Request, res: Response) {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ message: 'Refresh token não fornecido' });
    }

    const result = await authService.logout(refreshToken);
    return res.json(result);
  }
}
