'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import type { Entity, Role } from '@/types';

export default function NewUserPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [entities, setEntities] = useState<Entity[]>([]);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'USER' as Role,
    entityId: '',
    phone: '',
    document: '',
  });

  useEffect(() => {
    fetchEntities();
  }, []);

  const fetchEntities = async () => {
    try {
      const response = await api.get<Entity[]>('/entities');
      setEntities(response.data);
    } catch (err) {
      console.error('Erro ao carregar entidades:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.post('/users', {
        ...formData,
        entityId: formData.entityId || undefined,
      });
      router.push('/dashboard/users');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao criar usuário');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/users">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Novo Usuário</h1>
          <p className="text-muted-foreground">
            Preencha os dados para criar um novo usuário
          </p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Dados do Usuário</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4 text-red-600">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nome */}
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  disabled={loading}
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  disabled={loading}
                />
              </div>

              {/* Senha */}
              <div className="space-y-2">
                <Label htmlFor="password">Senha *</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  minLength={8}
                  disabled={loading}
                />
              </div>

              {/* Cargo */}
              <div className="space-y-2">
                <Label htmlFor="role">Cargo *</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => setFormData({ ...formData, role: value as Role })}
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SUPERADMIN">Super Admin</SelectItem>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                    <SelectItem value="OPERATOR">Operador</SelectItem>
                    <SelectItem value="USER">Usuário</SelectItem>
                    <SelectItem value="VISITOR">Visitante</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Entidade */}
              <div className="space-y-2">
                <Label htmlFor="entityId">Entidade</Label>
                <Select
                  value={formData.entityId}
                  onValueChange={(value) => setFormData({ ...formData, entityId: value })}
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma entidade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Nenhuma</SelectItem>
                    {entities.map((entity) => (
                      <SelectItem key={entity.id} value={entity.id}>
                        {entity.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Telefone */}
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  disabled={loading}
                />
              </div>

              {/* Documento */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="document">Documento (CPF/RG)</Label>
                <Input
                  id="document"
                  value={formData.document}
                  onChange={(e) => setFormData({ ...formData, document: e.target.value })}
                  disabled={loading}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Salvar Usuário
                  </>
                )}
              </Button>
              <Link href="/dashboard/users">
                <Button type="button" variant="outline" disabled={loading}>
                  Cancelar
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
