import { Router } from 'express';
import { AccessController } from '../controllers/AccessController';
import { authenticate } from '../middlewares/auth';
import { permit } from '../middlewares/permissions';

const router = Router();
const accessController = new AccessController();

// Todas as rotas requerem autenticação
router.use(authenticate);

// Listar registros de acesso - Todos autenticados
router.get('/', (req, res) => accessController.findAll(req, res));

// Estatísticas de acesso - Todos autenticados
router.get('/stats', (req, res) => accessController.getStats(req, res));

// Buscar registro por ID - Todos autenticados
router.get('/:id', (req, res) => accessController.findById(req, res));

// Criar registro de acesso - OPERATOR, ADMIN, SUPERADMIN
router.post('/', permit('SUPERADMIN', 'ADMIN', 'OPERATOR'), (req, res) =>
  accessController.create(req, res)
);

// QR Code Routes

// Listar QR Codes - ADMIN, SUPERADMIN
router.get('/qrcode', permit('SUPERADMIN', 'ADMIN', 'OPERATOR'), (req, res) =>
  accessController.findAllQRCodes(req, res)
);

// Buscar QR Code por ID - ADMIN, SUPERADMIN
router.get('/qrcode/:id', permit('SUPERADMIN', 'ADMIN', 'OPERATOR'), (req, res) =>
  accessController.findQRCodeById(req, res)
);

// Gerar QR Code para visitante - ADMIN, SUPERADMIN
router.post('/qrcode', permit('SUPERADMIN', 'ADMIN'), (req, res) =>
  accessController.generateVisitorQRCode(req, res)
);

// Deletar QR Code - ADMIN, SUPERADMIN
router.delete('/qrcode/:id', permit('SUPERADMIN', 'ADMIN'), (req, res) =>
  accessController.deleteQRCode(req, res)
);

// Validar QR Code (POST com body contendo code) - OPERATOR, ADMIN, SUPERADMIN
router.post('/qrcode/validate', permit('SUPERADMIN', 'ADMIN', 'OPERATOR'), (req, res) =>
  accessController.validateQRCode(req, res)
);

// Endpoints legados (manter compatibilidade)
router.post('/qrcode/generate', permit('SUPERADMIN', 'ADMIN'), (req, res) =>
  accessController.generateVisitorQRCode(req, res)
);

router.get('/qrcode/validate/:code', permit('SUPERADMIN', 'ADMIN', 'OPERATOR'), (req, res) =>
  accessController.validateQRCode(req, res)
);

router.post('/qrcode/use/:code', permit('SUPERADMIN', 'ADMIN', 'OPERATOR'), (req, res) =>
  accessController.useQRCode(req, res)
);

export default router;
