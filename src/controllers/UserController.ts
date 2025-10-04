import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth';
import { UserService } from '../services/UserService';

const userService = new UserService();

export class UserController {
  async findAll(req: AuthRequest, res: Response) {
    const user = req.user;
    
    // Se for SUPERADMIN, pode ver todos os usuários
    // Se for ADMIN, só pode ver usuários da sua entidade
    const entityId = user?.role === 'SUPERADMIN' ? undefined : user?.entityId;
    
    const users = await userService.findAll(entityId);
    return res.json(users);
  }

  async findById(req: AuthRequest, res: Response) {
    const { id } = req.params;
    const user = await userService.findById(id);
    return res.json(user);
  }

  async create(req: AuthRequest, res: Response) {
    const user = await userService.create(req.body);
    return res.status(201).json(user);
  }

  async update(req: AuthRequest, res: Response) {
    const { id } = req.params;
    const user = await userService.update(id, req.body);
    return res.json(user);
  }

  async delete(req: AuthRequest, res: Response) {
    const { id } = req.params;
    const result = await userService.delete(id);
    return res.json(result);
  }
}
