'use client';

import { Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore } from '@/store/auth';

export default function ConfigPage() {
  const { user } = useAuthStore();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Settings className="h-8 w-8" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
          <p className="text-muted-foreground">
            Gerencie suas preferências e perfil
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Perfil</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Nome</p>
            <p className="font-medium">{user?.name}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="font-medium">{user?.email}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Cargo</p>
            <p className="font-medium">{user?.role}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Em Desenvolvimento</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Módulo de Configurações será implementado em breve.
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>✅ Editar perfil</li>
            <li>✅ Alterar senha</li>
            <li>✅ Preferências do sistema</li>
            <li>✅ Notificações</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
