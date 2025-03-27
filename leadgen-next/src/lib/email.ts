import nodemailer from 'nodemailer';

// Configure Nodemailer with SMTP settings for Gmail
export const createTransporter = () => {
  const email = process.env.EMAIL_USER;
  const password = process.env.EMAIL_PASS;
  
  if (!email || !password) {
    throw new Error('Email configuration missing. Please check your .env.local file.');
  }
  
  console.log(`Attempting to create email transporter for: ${email}`);
  
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: email,
      pass: password,
    },
    debug: true, // Enable debug output
  });
  
  return transporter;
};

interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

// Function to send an email with ADF/XML content
export const sendLeadEmail = async (
  xmlContent: string, 
  destination: string, 
  subject = 'New Lead'
): Promise<EmailResult> => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: destination,
      subject,
      text: xmlContent,
    };
    
    console.log(`Attempting to send email to: ${destination}`);
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    
    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Email sending failed with error:', err);
    // More detailed error logging
    if ((error as any).code === 'EAUTH') {
      console.error('This appears to be an authentication error. Please check that you are using an App Password for Gmail and not your regular password.');
    }
    
    return {
      success: false,
      error: err.message || 'Unknown email error',
    };
  }
}; 