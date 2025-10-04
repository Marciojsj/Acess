import QRCode from 'qrcode';

export class QRCodeGenerator {
  async generateQRCode(data: any): Promise<string> {
    try {
      const qrCodeDataURL = await QRCode.toDataURL(JSON.stringify(data));
      return qrCodeDataURL;
    } catch (error) {
      console.error('Erro ao gerar QR Code:', error);
      throw new Error('Falha ao gerar QR Code');
    }
  }

  async generateQRCodeBuffer(data: any): Promise<Buffer> {
    try {
      const qrCodeBuffer = await QRCode.toBuffer(JSON.stringify(data));
      return qrCodeBuffer;
    } catch (error) {
      console.error('Erro ao gerar QR Code:', error);
      throw new Error('Falha ao gerar QR Code');
    }
  }
}
