'use client';

import { QrCode } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function VisitorsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <QrCode className="h-8 w-8" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Visitantes (QR Code)</h1>
          <p className="text-muted-foreground">
            Gerencie visitantes com QR Code
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Em Desenvolvimento</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Sistema de QR Code para visitantes será implementado em breve.
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>✅ Gerar QR Code para visitantes</li>
            <li>✅ Scanner de QR Code com câmera</li>
            <li>✅ Validar e registrar acesso</li>
            <li>✅ QR Code temporário com expiração</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
