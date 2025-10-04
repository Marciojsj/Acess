import { Request, Response } from 'express';
import { EntityService } from '../services/EntityService';

const entityService = new EntityService();

export class EntityController {
  async findAll(_req: Request, res: Response) {
    const entities = await entityService.findAll();
    return res.json(entities);
  }

  async findById(req: Request, res: Response) {
    const { id } = req.params;
    const entity = await entityService.findById(id);
    return res.json(entity);
  }

  async create(req: Request, res: Response) {
    const entity = await entityService.create(req.body);
    return res.status(201).json(entity);
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const entity = await entityService.update(id, req.body);
    return res.json(entity);
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    const result = await entityService.delete(id);
    return res.json(result);
  }
}
