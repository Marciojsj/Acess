'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Building2, DoorOpen, TrendingUp } from 'lucide-react';
import type { AccessStats } from '@/types';

export default function DashboardPage() {
  const [stats, setStats] = useState<AccessStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get<AccessStats>('/access/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total de Acessos',
      value: stats?.total || 0,
      icon: DoorOpen,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Entradas',
      value: stats?.entries || 0,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Saídas',
      value: stats?.exits || 0,
      icon: Users,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Hoje',
      value: stats?.today || 0,
      icon: Building2,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Visão geral do sistema de controle de acesso
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {card.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${card.bgColor}`}>
                  <Icon className={`h-4 w-4 ${card.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {card.title === 'Hoje' ? 'Acessos hoje' : 'Registros totais'}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Welcome Card */}
      <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
        <CardHeader>
          <CardTitle className="text-2xl">
            Bem-vindo ao Access Control! 🎉
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-primary-foreground/90">
            Sistema completo de controle de acesso com autenticação JWT,
            gestão de usuários, entidades e QR Code para visitantes.
          </p>
          <div className="mt-4 grid gap-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary-foreground" />
              <span>Backend API rodando em http://localhost:3000</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary-foreground" />
              <span>Frontend Next.js 14 com App Router</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary-foreground" />
              <span>Design inspirado em Frappe/ERPNext</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
