'use client';

import { DoorOpen } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AccessPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <DoorOpen className="h-8 w-8" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Controle de Acesso</h1>
          <p className="text-muted-foreground">
            Gerencie entradas e saídas
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Em Desenvolvimento</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Módulo de Controle de Acesso será implementado em breve.
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>✅ Histórico de acessos</li>
            <li>✅ Registrar entrada/saída manual</li>
            <li>✅ Filtros por data, usuário, entidade</li>
            <li>✅ Exportar relatórios</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
