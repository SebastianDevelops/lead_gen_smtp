import nodemailer from 'nodemailer';
import express from 'express';
import dotenv from 'dotenv';
import { EmailConfig, SMTPConfig } from './types';

dotenv.config();

class SMTPServer {
  private transporter: nodemailer.Transporter;
  private app: express.Application;

  constructor() {
    console.log('Initializing SMTP Server...');
    const smtpConfig: SMTPConfig = {
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '465'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER!,
        pass: process.env.SMTP_PASS!
      }
    };

    console.log('Creating SMTP transporter...');
    this.transporter = nodemailer.createTransport(smtpConfig);
    console.log('Setting up Express app...');
    this.app = express();
    this.app.use(express.json());
    this.setupRoutes();
    console.log('SMTP Server initialized successfully');
  }

  private setupRoutes(): void {
    console.log('Setting up API routes...');
    
    this.app.post('/send-email', async (req, res) => {
      console.log('POST /send-email - Request received');
      try {
        const { to, subject, text, html, attachments }: EmailConfig = req.body;
        console.log(`Email request: to=${to}, subject=${subject}`);
        
        if (!to || !subject) {
          console.log('Missing required fields');
          return res.status(400).json({ error: 'Missing required fields: to, subject' });
        }

        const mailOptions = {
          from: process.env.SMTP_USER!,
          to,
          subject,
          text,
          html,
          attachments
        };

        console.log('Sending email...');
        const result = await this.transporter.sendMail(mailOptions);
        console.log(`Email sent successfully: ${result.messageId}`);
        res.json({ success: true, messageId: result.messageId });
      } catch (error: any) {
        console.error('Email send error:', error.message);
        res.status(500).json({ error: error.message });
      }
    });

    this.app.get('/health', (req, res) => {
      console.log('GET /health - Health check requested');
      res.json({ status: 'OK', service: 'SMTP Server' });
    });
    
    console.log('Routes configured successfully');
  }

  public async sendEmail(config: EmailConfig): Promise<string> {
    const mailOptions = {
      from: process.env.SMTP_USER!,
      to: config.to,
      subject: config.subject,
      text: config.text,
      html: config.html,
      attachments: config.attachments
    };

    const result = await this.transporter.sendMail(mailOptions);
    return result.messageId;
  }

  public start(port: number = 3001): void {
    console.log(`Starting server on port ${port}...`);
    this.app.listen(port, () => {
      console.log(`✅ SMTP Server running on http://localhost:${port}`);
      console.log('Available endpoints:');
      console.log(`  POST http://localhost:${port}/send-email`);
      console.log(`  GET  http://localhost:${port}/health`);
    });
  }
}

const server = new SMTPServer();
server.start(parseInt(process.env.PORT || '3001'));

export default SMTPServer;