'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Filter, ArrowDownToLine, ArrowUpFromLine, Search, Calendar, FileDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import api from '@/lib/api';
import type { AccessLog, User, Entity } from '@/types';

const accessTypeLabels: Record<string, string> = {
  ENTRY: 'Entrada',
  EXIT: 'Saída',
};

const accessTypeColors: Record<string, string> = {
  ENTRY: 'bg-green-100 text-green-800',
  EXIT: 'bg-red-100 text-red-800',
};

const accessTypeIcons: Record<string, any> = {
  ENTRY: ArrowDownToLine,
  EXIT: ArrowUpFromLine,
};

export default function AccessPage() {
  const router = useRouter();
  const [accessLogs, setAccessLogs] = useState<AccessLog[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [entities, setEntities] = useState<Entity[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    userId: '',
    entityId: '',
    type: '',
    startDate: '',
    endDate: '',
    search: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [logsResponse, usersResponse, entitiesResponse] = await Promise.all([
        api.get('/access'),
        api.get('/users'),
        api.get('/entities'),
      ]);

      setAccessLogs(logsResponse.data);
      setUsers(usersResponse.data);
      setEntities(entitiesResponse.data);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const getUserName = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    return user?.name || 'Desconhecido';
  };

  const getEntityName = (entityId: string | null) => {
    if (!entityId) return '-';
    const entity = entities.find((e) => e.id === entityId);
    return entity?.name || '-';
  };

  const filteredLogs = accessLogs.filter((log) => {
    if (filters.userId && log.userId !== filters.userId) return false;
    if (filters.entityId && log.entityId !== filters.entityId) return false;
    if (filters.type && log.type !== filters.type) return false;
    if (filters.startDate && new Date(log.timestamp) < new Date(filters.startDate)) return false;
    if (filters.endDate && new Date(log.timestamp) > new Date(filters.endDate)) return false;
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const userName = getUserName(log.userId).toLowerCase();
      const entityName = getEntityName(log.entityId).toLowerCase();
      if (!userName.includes(searchLower) && !entityName.includes(searchLower)) return false;
    }
    return true;
  });

  const handleExport = () => {
    // Simples exportação para CSV
    const headers = ['Data/Hora', 'Tipo', 'Usuário', 'Entidade', 'Observações'];
    const rows = filteredLogs.map((log) => [
      new Date(log.timestamp).toLocaleString('pt-BR'),
      accessTypeLabels[log.type],
      getUserName(log.userId),
      getEntityName(log.entityId),
      log.notes || '',
    ]);

    const csv = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `acessos_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Controle de Acesso</h1>
          <p className="mt-1 text-sm text-gray-500">
            Histórico de entradas e saídas • {filteredLogs.length} registros
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filtros
          </Button>
          <Button
            variant="outline"
            onClick={handleExport}
          >
            <FileDown className="w-4 h-4 mr-2" />
            Exportar
          </Button>
          <Button onClick={() => router.push('/dashboard/access/register')}>
            <Plus className="w-4 h-4 mr-2" />
            Registrar Acesso
          </Button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <Card>
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
            <CardDescription>Filtre os registros de acesso</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label>Buscar</Label>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Nome ou entidade..."
                    className="pl-8"
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Usuário</Label>
                <Select
                  value={filters.userId}
                  onValueChange={(value) => setFilters({ ...filters, userId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos</SelectItem>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Entidade</Label>
                <Select
                  value={filters.entityId}
                  onValueChange={(value) => setFilters({ ...filters, entityId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todas</SelectItem>
                    {entities.map((entity) => (
                      <SelectItem key={entity.id} value={entity.id}>
                        {entity.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Tipo</Label>
                <Select
                  value={filters.type}
                  onValueChange={(value) => setFilters({ ...filters, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos</SelectItem>
                    <SelectItem value="ENTRY">Entrada</SelectItem>
                    <SelectItem value="EXIT">Saída</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Data Inicial</Label>
                <Input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Data Final</Label>
                <Input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <Button
                variant="outline"
                onClick={() =>
                  setFilters({
                    userId: '',
                    entityId: '',
                    type: '',
                    startDate: '',
                    endDate: '',
                    search: '',
                  })
                }
              >
                Limpar Filtros
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Acessos</CardTitle>
          <CardDescription>
            Lista completa de entradas e saídas registradas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data/Hora</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Usuário</TableHead>
                <TableHead>Entidade</TableHead>
                <TableHead>Observações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-gray-500">
                    Nenhum registro encontrado
                  </TableCell>
                </TableRow>
              ) : (
                filteredLogs.map((log) => {
                  const Icon = accessTypeIcons[log.type];
                  return (
                    <TableRow key={log.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          {new Date(log.timestamp).toLocaleString('pt-BR')}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={accessTypeColors[log.type]}>
                          <Icon className="w-3 h-3 mr-1" />
                          {accessTypeLabels[log.type]}
                        </Badge>
                      </TableCell>
                      <TableCell>{getUserName(log.userId)}</TableCell>
                      <TableCell>{getEntityName(log.entityId)}</TableCell>
                      <TableCell className="max-w-xs truncate">
                        {log.notes || '-'}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
