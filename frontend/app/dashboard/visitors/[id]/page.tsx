'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Download, Printer, QrCode as QrCodeIcon, Calendar, User, FileText, Building2 } from 'lucide-react';
import QRCode from 'react-qr-code';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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

export default function VisitorQRCodePage() {
  const params = useParams();
  const router = useRouter();
  const [qrCode, setQrCode] = useState<VisitorQRCode | null>(null);
  const [loading, setLoading] = useState(true);
  const qrRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchQRCode();
  }, [params.id]);

  const fetchQRCode = async () => {
    try {
      const response = await api.get(`/access/qrcode/${params.id}`);
      setQrCode(response.data);
    } catch (error) {
      console.error('Erro ao buscar QR Code:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = () => {
    if (!qrCode) return null;

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

  const handleDownload = () => {
    if (!qrRef.current) return;

    const svg = qrRef.current.querySelector('svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');

      const downloadLink = document.createElement('a');
      downloadLink.download = `qrcode_${qrCode?.visitorName.replace(/\s/g, '_')}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Carregando...</div>
      </div>
    );
  }

  if (!qrCode) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">QR Code não encontrado</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between print:hidden">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">QR Code do Visitante</h1>
            <p className="mt-1 text-sm text-gray-500">{qrCode.visitorName}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleDownload}>
            <Download className="w-4 h-4 mr-2" />
            Baixar
          </Button>
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="w-4 h-4 mr-2" />
            Imprimir
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* QR Code */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCodeIcon className="w-5 h-5" />
              QR Code
            </CardTitle>
            <CardDescription>
              Status: {getStatusBadge()}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div ref={qrRef} className="p-4 bg-white rounded-lg">
              <QRCode value={qrCode.code} size={256} />
            </div>
            <p className="mt-4 text-sm text-center text-gray-500 font-mono break-all">
              {qrCode.code}
            </p>
          </CardContent>
        </Card>

        {/* Informações */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Dados do Visitante
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-500">Nome</label>
                <p className="mt-1 text-base text-gray-900">{qrCode.visitorName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  <FileText className="w-4 h-4 inline mr-1" />
                  Documento
                </label>
                <p className="mt-1 text-base text-gray-900">{qrCode.visitorDocument}</p>
              </div>
              {qrCode.visitorPhone && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Telefone</label>
                  <p className="mt-1 text-base text-gray-900">{qrCode.visitorPhone}</p>
                </div>
              )}
              {qrCode.entity && (
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    <Building2 className="w-4 h-4 inline mr-1" />
                    Entidade
                  </label>
                  <p className="mt-1 text-base text-gray-900">{qrCode.entity.name}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Validade
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-500">Criado em</label>
                <p className="mt-1 text-base text-gray-900">
                  {new Date(qrCode.createdAt).toLocaleString('pt-BR')}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Expira em</label>
                <p className="mt-1 text-base text-gray-900">
                  {new Date(qrCode.expiresAt).toLocaleString('pt-BR')}
                </p>
              </div>
              {qrCode.usedAt && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Usado em</label>
                  <p className="mt-1 text-base text-gray-900">
                    {new Date(qrCode.usedAt).toLocaleString('pt-BR')}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Print styles */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print\\:block {
            visibility: visible !important;
          }
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
