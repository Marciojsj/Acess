'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, Eye, Loader2, Building2 } from 'lucide-react';
import type { Entity } from '@/types';

const entityTypeColors = {
  SCHOOL: 'bg-blue-500',
  CONDOMINIUM: 'bg-green-500',
  COMPANY: 'bg-purple-500',
  EVENT: 'bg-orange-500',
};

const entityTypeLabels = {
  SCHOOL: 'Escola',
  CONDOMINIUM: 'Condomínio',
  COMPANY: 'Empresa',
  EVENT: 'Evento',
};

export default function EntitiesPage() {
  const [entities, setEntities] = useState<Entity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEntities();
  }, []);

  const fetchEntities = async () => {
    try {
      const response = await api.get<Entity[]>('/entities');
      setEntities(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao carregar entidades');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta entidade?')) return;

    try {
      await api.delete(`/entities/${id}`);
      setEntities(entities.filter(e => e.id !== id));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Erro ao excluir entidade');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Building2 className="h-8 w-8" />
            Entidades
          </h1>
          <p className="text-muted-foreground">
            Gerencie escolas, condomínios, empresas e eventos
          </p>
        </div>
        <Link href="/dashboard/entities/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nova Entidade
          </Button>
        </Link>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4 text-red-600">
          {error}
        </div>
      )}

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Entidades ({entities.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Usuários</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entities.map((entity) => (
                <TableRow key={entity.id}>
                  <TableCell className="font-medium">{entity.name}</TableCell>
                  <TableCell>
                    <Badge className={entityTypeColors[entity.type]}>
                      {entityTypeLabels[entity.type]}
                    </Badge>
                  </TableCell>
                  <TableCell>{entity.email || '-'}</TableCell>
                  <TableCell>{entity.phone || '-'}</TableCell>
                  <TableCell>{entity.maxUsers}</TableCell>
                  <TableCell>
                    <Badge variant={entity.isActive ? 'default' : 'secondary'}>
                      {entity.isActive ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/dashboard/entities/${entity.id}`}>
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link href={`/dashboard/entities/${entity.id}/edit`}>
                        <Button variant="ghost" size="icon">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(entity.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {entities.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Nenhuma entidade encontrada
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
