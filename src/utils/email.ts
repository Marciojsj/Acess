import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendEmail({ to, subject, html }: EmailOptions) {
    try {
      const info = await this.transporter.sendMail({
        from: process.env.SMTP_FROM,
        to,
        subject,
        html,
      });

      console.log('Email enviado:', info.messageId);
      return info;
    } catch (error) {
      console.error('Erro ao enviar email:', error);
      throw error;
    }
  }

  async sendWelcomeEmail(name: string, email: string) {
    const html = `
      <h1>Bem-vindo ao Sistema de Controle de Acesso!</h1>
      <p>Olá <strong>${name}</strong>,</p>
      <p>Sua conta foi criada com sucesso.</p>
      <p>Email: ${email}</p>
      <p>Acesse o sistema e altere sua senha no primeiro login.</p>
    `;

    await this.sendEmail({
      to: email,
      subject: 'Bem-vindo ao Sistema de Controle de Acesso',
      html,
    });
  }

  async sendQRCodeEmail(name: string, email: string, qrCodeImage: string) {
    const html = `
      <h1>QR Code de Acesso</h1>
      <p>Olá <strong>${name}</strong>,</p>
      <p>Seu QR Code de acesso foi gerado com sucesso.</p>
      <p>Use-o na portaria para registrar sua entrada.</p>
      <img src="${qrCodeImage}" alt="QR Code" />
    `;

    await this.sendEmail({
      to: email,
      subject: 'Seu QR Code de Acesso',
      html,
    });
  }
}
