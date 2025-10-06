'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Pencil, Trash2, Building2, Mail, Phone, MapPin, Users, Calendar } from 'lucide-react';
import { useToast } from '@/components/ui/toast';
import { DeleteDialog } from '@/components/ui/delete-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import api from '@/lib/api';
import type { Entity } from '@/types';

const entityTypeLabels: Record<string, string> = {
  SCHOOL: 'Escola',
  CONDOMINIUM: 'Condomínio',
  COMPANY: 'Empresa',
  EVENT: 'Evento',
};

const entityTypeColors: Record<string, string> = {
  SCHOOL: 'bg-blue-100 text-blue-800',
  CONDOMINIUM: 'bg-green-100 text-green-800',
  COMPANY: 'bg-purple-100 text-purple-800',
  EVENT: 'bg-orange-100 text-orange-800',
};

export default function EntityDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  const [entity, setEntity] = useState<Entity | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, deleting: false });

  useEffect(() => {
    fetchEntity();
  }, [params.id]);

  const fetchEntity = async () => {
    try {
      const response = await api.get(`/entities/${params.id}`);
      setEntity(response.data);
    } catch (error) {
      console.error('Erro ao buscar entidade:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = () => {
    setDeleteDialog({ open: true, deleting: false });
  };

  const handleDeleteConfirm = async () => {
    setDeleteDialog({ open: true, deleting: true });

    try {
      await api.delete(`/entities/${params.id}`);
      showToast('Entidade excluída com sucesso!', 'success');
      router.push('/dashboard/entities');
    } catch (error) {
      console.error('Erro ao excluir entidade:', error);
      showToast('Erro ao excluir entidade', 'error');
      setDeleteDialog({ open: false, deleting: false });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Carregando...</div>
      </div>
    );
  }

  if (!entity) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Entidade não encontrada</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{entity.name}</h1>
          <p className="mt-1 text-sm text-gray-500">Detalhes da entidade</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => router.push(`/dashboard/entities/${entity.id}/edit`)}
          >
            <Pencil className="w-4 h-4 mr-2" />
            Editar
          </Button>
          <Button variant="destructive" onClick={handleDeleteClick}>
            <Trash2 className="w-4 h-4 mr-2" />
            Excluir
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Informações Básicas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Informações Básicas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Nome</label>
              <p className="mt-1 text-base text-gray-900">{entity.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Tipo</label>
              <div className="mt-1">
                <Badge className={entityTypeColors[entity.type]}>
                  {entityTypeLabels[entity.type]}
                </Badge>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                <Users className="w-4 h-4 inline mr-1" />
                Usuários Máximos
              </label>
              <p className="mt-1 text-base text-gray-900">{entity.maxUsers}</p>
            </div>
          </CardContent>
        </Card>

        {/* Contato */}
        <Card>
          <CardHeader>
            <CardTitle>Contato</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {entity.email && (
              <div>
                <label className="text-sm font-medium text-gray-500">
                  <Mail className="w-4 h-4 inline mr-1" />
                  E-mail
                </label>
                <p className="mt-1 text-base text-gray-900">{entity.email}</p>
              </div>
            )}
            {entity.phone && (
              <div>
                <label className="text-sm font-medium text-gray-500">
                  <Phone className="w-4 h-4 inline mr-1" />
                  Telefone
                </label>
                <p className="mt-1 text-base text-gray-900">{entity.phone}</p>
              </div>
            )}
            {entity.address && (
              <div>
                <label className="text-sm font-medium text-gray-500">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Endereço
                </label>
                <p className="mt-1 text-base text-gray-900 whitespace-pre-line">
                  {entity.address}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Informações do Sistema */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Informações do Sistema
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="text-sm font-medium text-gray-500">ID</label>
              <p className="mt-1 text-base text-gray-900 font-mono text-xs">
                {entity.id}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Criado em</label>
              <p className="mt-1 text-base text-gray-900">
                {new Date(entity.createdAt).toLocaleString('pt-BR')}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Atualizado em</label>
              <p className="mt-1 text-base text-gray-900">
                {new Date(entity.updatedAt).toLocaleString('pt-BR')}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <DeleteDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, deleting: false })}
        onConfirm={handleDeleteConfirm}
        loading={deleteDialog.deleting}
        title="Excluir Entidade"
        description={`Tem certeza que deseja excluir a entidade "${entity?.name}"? Esta ação não pode ser desfeita.`}
      />
    </div>
  );
}
