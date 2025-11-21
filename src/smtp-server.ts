import { Resend } from 'resend';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { EmailConfig } from './types';

dotenv.config();

class EmailServer {
  private resend: Resend;
  private app: express.Application;

  constructor() {
    console.log('Initializing Email Server...');
    this.resend = new Resend('re_VgZL7cdc_JB6DLeXoevAzfRPdhqWHHL9Q');
    console.log('Setting up Express app...');
    this.app = express();
    this.app.use(cors());
    this.app.use(express.json({ limit: '50mb' }));
    this.setupRoutes();
    console.log('Email Server initialized successfully');
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

        const emailData: any = {
          from: 'sebastian@nexfluence.tech',
          to,
          subject,
          text,
          html
        };

        if (attachments && attachments.length > 0) {
          emailData.attachments = attachments.map(att => ({
            filename: att.filename,
            content: typeof att.content === 'string' ? Buffer.from(att.content, 'utf-8') : att.content
          }));
        }

        console.log('Sending email...');
        const { data, error } = await this.resend.emails.send(emailData);
        
        if (error) {
          throw new Error(error.message);
        }
        
        console.log(`Email sent successfully: ${data?.id}`);
        res.json({ success: true, messageId: data?.id });
      } catch (error: any) {
        console.error('Email send error:', error.message);
        res.status(500).json({ error: error.message });
      }
    });

    this.app.get('/health', (req, res) => {
      console.log('GET /health - Health check requested');
      res.json({ status: 'OK', service: 'Email Server' });
    });
    
    console.log('Routes configured successfully');
  }

  public async sendEmail(config: EmailConfig): Promise<string> {
    const emailData: any = {
      from: 'sebastian@nexfluence.tech',
      to: config.to,
      subject: config.subject,
      text: config.text,
      html: config.html
    };

    if (config.attachments && config.attachments.length > 0) {
      emailData.attachments = config.attachments.map(att => ({
        filename: att.filename,
        content: typeof att.content === 'string' ? Buffer.from(att.content, 'utf-8') : att.content
      }));
    }

    const { data, error } = await this.resend.emails.send(emailData);
    
    if (error) {
      throw new Error(error.message);
    }
    
    return data?.id || '';
  }

  public start(port: number = 3001): void {
    console.log(`Starting server on port ${port}...`);
    this.app.listen(port, () => {
      console.log(`✅ Email Server running on http://localhost:${port}`);
      console.log('Available endpoints:');
      console.log(`  POST http://localhost:${port}/send-email`);
      console.log(`  GET  http://localhost:${port}/health`);
    });
  }
}

const server = new EmailServer();
server.start(parseInt(process.env.PORT || '3001'));

export default EmailServer;