'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Camera, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import api from '@/lib/api';

export default function ScannerPage() {
  const router = useRouter();
  const [scanning, setScanning] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    visitor?: any;
  } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    return () => {
      // Cleanup: stop camera when component unmounts
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setScanning(true);
      }
    } catch (error) {
      console.error('Erro ao acessar câmera:', error);
      alert('Erro ao acessar câmera. Verifique as permissões.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setScanning(false);
  };

  const validateQRCode = async (code: string) => {
    setSubmitting(true);
    setResult(null);

    try {
      const response = await api.post('/access/qrcode/validate', { code });
      
      setResult({
        success: true,
        message: 'QR Code válido! Acesso registrado com sucesso.',
        visitor: response.data.visitor,
      });

      // Auto-close after 3 seconds
      setTimeout(() => {
        router.push('/dashboard/access');
      }, 3000);
    } catch (error: any) {
      setResult({
        success: false,
        message: error.response?.data?.message || 'QR Code inválido ou expirado',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualCode.trim()) {
      validateQRCode(manualCode.trim());
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Scanner de QR Code</h1>
          <p className="mt-1 text-sm text-gray-500">Valide e registre acesso de visitantes</p>
        </div>
      </div>

      {/* Result Message */}
      {result && (
        <Card className={result.success ? 'border-green-500' : 'border-red-500'}>
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              {result.success ? (
                <CheckCircle2 className="w-8 h-8 text-green-500 flex-shrink-0" />
              ) : (
                <XCircle className="w-8 h-8 text-red-500 flex-shrink-0" />
              )}
              <div className="flex-1">
                <h3 className={`text-lg font-semibold ${result.success ? 'text-green-900' : 'text-red-900'}`}>
                  {result.success ? 'Sucesso!' : 'Erro'}
                </h3>
                <p className={result.success ? 'text-green-700' : 'text-red-700'}>
                  {result.message}
                </p>
                {result.visitor && (
                  <div className="mt-2 text-sm text-gray-600">
                    <p><strong>Visitante:</strong> {result.visitor.visitorName}</p>
                    <p><strong>Documento:</strong> {result.visitor.visitorDocument}</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {/* Camera Scanner */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="w-5 h-5" />
              Scanner de Câmera
            </CardTitle>
            <CardDescription>
              Use a câmera para escanear o QR Code
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!scanning ? (
              <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed rounded-lg">
                <Camera className="w-12 h-12 text-gray-400 mb-4" />
                <Button onClick={startCamera}>
                  Iniciar Câmera
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                  />
                </div>
                <Button onClick={stopCamera} variant="outline" className="w-full">
                  Parar Câmera
                </Button>
                <p className="text-sm text-center text-gray-500">
                  Nota: O scanner automático com câmera requer biblioteca adicional.
                  Use a entrada manual abaixo por enquanto.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Manual Input */}
        <Card>
          <CardHeader>
            <CardTitle>Entrada Manual</CardTitle>
            <CardDescription>
              Digite o código do QR Code manualmente
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleManualSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code">Código do QR Code</Label>
                <Input
                  id="code"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  placeholder="Cole ou digite o código aqui..."
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={submitting || !manualCode.trim()}
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Validando...
                  </>
                ) : (
                  'Validar QR Code'
                )}
              </Button>
            </form>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Dica:</strong> O código QR está disponível na página de detalhes
                de cada visitante. Você pode copiar e colar aqui para validar.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Como usar</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-2 text-sm text-gray-600">
            <li>1. <strong>Scanner de Câmera:</strong> Clique em "Iniciar Câmera" e aponte para o QR Code do visitante</li>
            <li>2. <strong>Entrada Manual:</strong> Digite ou cole o código do QR Code e clique em "Validar"</li>
            <li>3. O sistema verificará se o QR Code é válido e não expirou</li>
            <li>4. Se válido, o acesso será registrado automaticamente</li>
            <li>5. Cada QR Code pode ser usado apenas uma vez</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
