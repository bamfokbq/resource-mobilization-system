import nodemailer from 'nodemailer'

export interface EmailData {
  to: string
  subject: string
  html: string
  text?: string
}

// Create reusable transporter object using SMTP transport
const createTransporter = () => {
  return nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // Use App Password for Gmail
    },
    tls: {
      rejectUnauthorized: false // For development/testing only
    }
  })
}

export async function sendTemporaryPasswordEmail(
  userEmail: string,
  userName: string,
  temporaryPassword: string,
  retryCount: number = 0
): Promise<{ success: boolean; error?: string }> {
  const maxRetries = 3
  const retryDelay = 1000 * (retryCount + 1) // Exponential backoff

  try {
    // Validate required environment variables
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn('⚠️ Email configuration missing. Falling back to console logging.')
      console.log('📧 Email would be sent to:', userEmail)
      console.log('📧 Subject: Welcome to NCD Navigator - Your Temporary Password')
      console.log('📧 Temporary Password:', temporaryPassword)
      return { success: true }
    }

    const transporter = createTransporter()
    
    // Verify connection configuration
    await transporter.verify()
    console.log('✅ Email server connection verified')

    const mailOptions = {
      from: {
        name: 'NCD Navigator',
        address: process.env.EMAIL_FROM || process.env.EMAIL_USER
      },
      to: userEmail,
      subject: 'Welcome to NCD Navigator - Your Temporary Password',
      html: generateTemporaryPasswordEmailHTML(userName, temporaryPassword),
      text: generateTemporaryPasswordEmailText(userName, temporaryPassword),
      // Add email headers for better deliverability
      headers: {
        'X-Priority': '1',
        'X-MSMail-Priority': 'High',
        'Importance': 'high'
      }
    }

    const info = await transporter.sendMail(mailOptions)
    console.log('📧 Email sent successfully:', info.messageId)
    
    return { success: true }
  } catch (error) {
    console.error(`❌ Email sending error (attempt ${retryCount + 1}):`, error)
    
    // Retry logic for transient errors
    if (retryCount < maxRetries && isRetryableError(error)) {
      console.log(`🔄 Retrying email send in ${retryDelay}ms...`)
      await new Promise(resolve => setTimeout(resolve, retryDelay))
      return sendTemporaryPasswordEmail(userEmail, userName, temporaryPassword, retryCount + 1)
    }
    
    // Fallback to console logging if email fails after retries
    console.log('📧 Fallback - Email details logged to console:')
    console.log('📧 To:', userEmail)
    console.log('📧 Subject: Welcome to NCD Navigator - Your Temporary Password')
    console.log('📧 Temporary Password:', temporaryPassword)
    
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to send email' 
    }
  }
}

// Helper function to determine if an error is retryable
function isRetryableError(error: any): boolean {
  if (!error) return false
  
  const retryableErrors = [
    'ECONNRESET',
    'ETIMEDOUT',
    'ENOTFOUND',
    'ECONNREFUSED',
    'EHOSTUNREACH',
    'ENETUNREACH',
    'timeout',
    'connection',
    'network'
  ]
  
  const errorMessage = error.message?.toLowerCase() || ''
  const errorCode = error.code?.toLowerCase() || ''
  
  return retryableErrors.some(retryableError => 
    errorMessage.includes(retryableError) || errorCode.includes(retryableError)
  )
}

// Additional email functions for other notifications
export async function sendPasswordResetEmail(
  userEmail: string,
  userName: string,
  resetToken: string
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn('⚠️ Email configuration missing for password reset.')
      return { success: false, error: 'Email service not configured' }
    }

    const transporter = createTransporter()
    await transporter.verify()

    const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${resetToken}`
    
    const mailOptions = {
      from: {
        name: 'NCD Navigator',
        address: process.env.EMAIL_FROM || process.env.EMAIL_USER
      },
      to: userEmail,
      subject: 'Password Reset Request - NCD Navigator',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Password Reset Request</h2>
          <p>Hello ${userName},</p>
          <p>You requested a password reset for your NCD Navigator account.</p>
          <p>Click the link below to reset your password:</p>
          <a href="${resetUrl}" style="background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Reset Password
          </a>
          <p>This link will expire in 1 hour for security reasons.</p>
          <p>If you didn't request this reset, please ignore this email.</p>
        </div>
      `,
      text: `Password Reset Request\n\nHello ${userName},\n\nYou requested a password reset. Click this link: ${resetUrl}\n\nThis link expires in 1 hour.`
    }

    const info = await transporter.sendMail(mailOptions)
    console.log('📧 Password reset email sent:', info.messageId)
    
    return { success: true }
  } catch (error) {
    console.error('❌ Password reset email error:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to send password reset email' 
    }
  }
}

export function generateTemporaryPasswordEmailHTML(
  userName: string,
  temporaryPassword: string
): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to NCD Navigator</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .password-box { background: #fff; border: 2px solid #e1e5e9; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center; }
        .password { font-family: 'Courier New', monospace; font-size: 18px; font-weight: bold; color: #2d3748; background: #f7fafc; padding: 10px; border-radius: 4px; }
        .warning { background: #fff3cd; border: 1px solid #ffeaa7; color: #856404; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to NCD Navigator!</h1>
          <p>Your account has been created successfully</p>
        </div>
        
        <div class="content">
          <h2>Hello ${userName},</h2>
          
          <p>Welcome to the NCD Navigator platform! Your account has been created and you can now access the system using the temporary password provided below.</p>
          
          <div class="password-box">
            <h3>Your Temporary Password</h3>
            <div class="password">${temporaryPassword}</div>
            <p><small>Please keep this password secure and do not share it with anyone.</small></p>
          </div>
          
          <div class="warning">
            <strong>⚠️ Important Security Notice:</strong><br>
            You will be required to change this temporary password on your first login. Please do not use this password for any other accounts.
          </div>
          
          <h3>Next Steps:</h3>
          <ol>
            <li>Visit the NCD Navigator login page</li>
            <li>Enter your email address and the temporary password above</li>
            <li>You will be automatically redirected to change your password</li>
            <li>Create a strong, unique password for your account</li>
          </ol>
          
          <div style="text-align: center;">
            <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/auth/signin" class="button">
              Login to NCD Navigator
            </a>
          </div>
          
          <p>If you have any questions or need assistance, please contact your system administrator.</p>
          
          <div class="footer">
            <p>This is an automated message. Please do not reply to this email.</p>
            <p>&copy; 2024 NCD Navigator. All rights reserved.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `
}

export function generateTemporaryPasswordEmailText(
  userName: string,
  temporaryPassword: string
): string {
  return `
Welcome to NCD Navigator!

Hello ${userName},

Your account has been created successfully. You can now access the system using the temporary password provided below.

Temporary Password: ${temporaryPassword}

IMPORTANT SECURITY NOTICE:
- You will be required to change this temporary password on your first login
- Please do not use this password for any other accounts
- Keep this password secure and do not share it with anyone

Next Steps:
1. Visit the NCD Navigator login page
2. Enter your email address and the temporary password above
3. You will be automatically redirected to change your password
4. Create a strong, unique password for your account

Login URL: ${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/auth/signin

If you have any questions or need assistance, please contact your system administrator.

This is an automated message. Please do not reply to this email.

© 2024 NCD Navigator. All rights reserved.
  `
}
