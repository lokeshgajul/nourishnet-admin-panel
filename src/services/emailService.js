import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendApprovalEmail = async (email, ngoName) => {

  const mailOptions = {
    from: `"NourishNet Team" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'NourishNet - NGO Application Approved!',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2 style="color: #10b981;">Congratulations ${ngoName}!</h2>
        <p>Your application to join <strong>NourishNet</strong> has been approved.</p>
        <p>You can now log in to your dashboard and start posting food donation requests.</p>
        <br />
        <p>Best Regards,<br />Team NourishNet</p>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};

export const sendRejectionEmail = async (email, ngoName, reason) => {
  const mailOptions = {
    from: `"NourishNet Team" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'NourishNet - NGO Application Update',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2 style="color: #ef4444;">Application Status Update</h2>
        <p>Dear ${ngoName},</p>
        <p>We regret to inform you that your application has been rejected at this time.</p>
        ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}
        <p>Please feel free to reach out if you have any questions.</p>
        <br />
        <p>Best Regards,<br />Team NourishNet</p>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};

export const sendCredentialsEmail = async (email, ngoName, password) => {

  
  console.log(process.env.EMAIL_USER, ngoName);
 
  const mailOptions = {
    from: `"NourishNet Team" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'NourishNet - Your Account Credentials',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; border: 1px solid #e5e7eb; border-radius: 12px; max-width: 600px; margin: auto;">
        <h2 style="color: #10b981; text-align: center;">Welcome to NourishNet!</h2>
        <p>Dear <strong>${ngoName}</strong>,</p>
        <p>Your application has been approved. Below are your account credentials to access the platform:</p>
        
        <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px dashed #d1d5db;">
          <p style="margin: 0; font-size: 14px; color: #6b7280;">Login Email:</p>
          <p style="margin: 5px 0 15px 0; font-weight: bold; font-size: 16px;">${email}</p>
          
          <p style="margin: 0; font-size: 14px; color: #6b7280;">Temporary Password:</p>
          <p style="margin: 5px 0 0 0; font-weight: bold; font-size: 16px; color: #10b981;">${password}</p>
        </div>
        
        <p>For security reasons, we recommend you change your password after your first login.</p>
        
        <div style="text-align: center; margin-top: 30px;">
          <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/login" 
             style="background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
            Login to Dashboard
          </a>
        </div>
        
        <br />
        <p style="border-top: 1px solid #eee; padding-top: 20px; font-size: 14px; color: #9ca3af;">
          Best Regards,<br />Team NourishNet
        </p>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};
