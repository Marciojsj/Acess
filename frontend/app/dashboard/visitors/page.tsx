'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, QrCode as QrCodeIcon, Scan, Calendar, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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

interface VisitorQRCode {
  id: string;
  visitorName: string;
  visitorDocument: string;
  visitorPhone?: string;
  code: string;
  expiresAt: string;
  usedAt?: string;
  entityId?: string;
  entity?: {
    id: string;
    name: string;
  };
  createdAt: string;
}

export default function VisitorsPage() {
  const router = useRouter();
  const [qrCodes, setQrCodes] = useState<VisitorQRCode[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQRCodes();
  }, []);

  const fetchQRCodes = async () => {
    try {
      const response = await api.get('/access/qrcode');
      console.log('QR Codes response:', response.data);
      setQrCodes(response.data);
    } catch (error: any) {
      console.error('Erro ao buscar QR Codes:', error);
      if (error.response?.status === 404) {
        // Se endpoint não existe, deixa array vazio
        setQrCodes([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este QR Code?')) return;

    try {
      await api.delete(`/access/qrcode/${id}`);
      fetchQRCodes();
    } catch (error) {
      console.error('Erro ao excluir QR Code:', error);
      alert('Erro ao excluir QR Code');
    }
  };

  const getStatusBadge = (qrCode: VisitorQRCode) => {
    if (qrCode.usedAt) {
      return <Badge className="bg-gray-100 text-gray-800">Usado</Badge>;
    }
    
    const now = new Date();
    const expiresAt = new Date(qrCode.expiresAt);
    
    if (expiresAt < now) {
      return <Badge className="bg-red-100 text-red-800">Expirado</Badge>;
    }
    
    return <Badge className="bg-green-100 text-green-800">Ativo</Badge>;
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
          <h1 className="text-3xl font-bold text-gray-900">Visitantes (QR Code)</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gerencie QR Codes para visitantes • {qrCodes.length} códigos
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => router.push('/dashboard/visitors/scanner')}
          >
            <Scan className="w-4 h-4 mr-2" />
            Scanner
          </Button>
          <Button onClick={() => router.push('/dashboard/visitors/new')}>
            <Plus className="w-4 h-4 mr-2" />
            Gerar QR Code
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <QrCodeIcon className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{qrCodes.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ativos</CardTitle>
            <QrCodeIcon className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {qrCodes.filter(q => !q.usedAt && new Date(q.expiresAt) > new Date()).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usados</CardTitle>
            <QrCodeIcon className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {qrCodes.filter(q => q.usedAt).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expirados</CardTitle>
            <QrCodeIcon className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {qrCodes.filter(q => !q.usedAt && new Date(q.expiresAt) < new Date()).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>QR Codes de Visitantes</CardTitle>
          <CardDescription>
            Lista de QR Codes gerados para visitantes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Visitante</TableHead>
                <TableHead>Documento</TableHead>
                <TableHead>Entidade</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Expira em</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {qrCodes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-gray-500">
                    Nenhum QR Code gerado ainda
                  </TableCell>
                </TableRow>
              ) : (
                qrCodes.map((qrCode) => (
                  <TableRow key={qrCode.id}>
                    <TableCell className="font-medium">
                      {qrCode.visitorName}
                    </TableCell>
                    <TableCell>{qrCode.visitorDocument}</TableCell>
                    <TableCell>
                      {qrCode.entity?.name || '-'}
                    </TableCell>
                    <TableCell>{getStatusBadge(qrCode)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {new Date(qrCode.expiresAt).toLocaleString('pt-BR')}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => router.push(`/dashboard/visitors/${qrCode.id}`)}
                        >
                          <QrCodeIcon className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(qrCode.id)}
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
