import nodemailer from 'nodemailer';

// 创建邮件传输器
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendVerificationEmail(to: string, code: string) {
  const mailOptions = {
    from: `"Your App" <${process.env.SMTP_USER}>`,
    to,
    subject: '验证码 - Your App',
    html: `
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
        <h2 style="color: #333; text-align: center;">您的验证码</h2>
        <p style="color: #666; text-align: center;">请使用以下验证码完成注册：</p>
        <div style="background-color: #f4f4f4; padding: 10px; text-align: center; margin: 20px 0;">
          <span style="font-size: 24px; font-weight: bold; color: #333;">${
            code
          }</span>
        </div>
        <p style="color: #666; text-align: center;">验证码有效期为5分钟。如果您没有请求此验证码，请忽略此邮件。</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Send email failed:', error);
    return false;
  }
}
