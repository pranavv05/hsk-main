// backend/services/notification.service.js
const nodemailer = require('nodemailer');

// Validate required environment variables
const requiredEnvVars = ['EMAIL_USER', 'EMAIL_PASS', 'EMAIL_FROM'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

// Log configuration status
console.log('Email Notification Service Initializing...');
console.log('NODE_ENV:', process.env.NODE_ENV);

if (missingVars.length > 0) {
  const errorMsg = `Missing required email configuration in environment variables: ${missingVars.join(', ')}`;
  console.error('❌', errorMsg);
  if (process.env.NODE_ENV === 'production') {
    throw new Error(errorMsg);
  } else {
    console.warn('⚠️  Running in development mode with incomplete email configuration. Emails will not be sent.');
  }
} else {
  console.log('✅ Email configuration verified');
}

// Create a test email configuration
const createTestAccount = async () => {
  if (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'development') {
    try {
      const testAccount = await nodemailer.createTestAccount();
      console.log('✅ Using Ethereal test account for email');
      return {
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass
        },
        debug: true
      };
    } catch (error) {
      console.error('Failed to create test email account:', error);
      throw error;
    }
  }
  return null;
};

// Configure email transporter
const createTransporter = async () => {
  try {
    const testConfig = await createTestAccount();
    
    const config = testConfig || {
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      tls: {
        rejectUnauthorized: false
      },
      debug: process.env.NODE_ENV !== 'production'
    };

    const transporter = nodemailer.createTransport(config);

    // Verify connection configuration
    try {
      await transporter.verify();
      console.log('✅ SMTP connection verified');
      
      if (testConfig) {
        console.log('📧 Test email account created. Preview URL: https://ethereal.email');
        console.log('Test credentials:', {
          user: config.auth.user,
          pass: config.auth.pass
        });
      }
      
      return transporter;
    } catch (verifyError) {
      console.error('❌ SMTP Connection Error:', {
        code: verifyError.code,
        command: verifyError.command,
        message: verifyError.message,
        stack: verifyError.stack
      });
      
      if (!testConfig) {
        console.warn('⚠️  Falling back to test email account due to SMTP configuration error');
        return createTransporter(true); // Force test account
      }
      
      throw verifyError;
    }
  } catch (error) {
    console.error('❌ Failed to create email transporter:', error);
    throw error;
  }
};

// Initialize transporter
let transporter;
(async () => {
  try {
    transporter = await createTransporter();
  } catch (error) {
    console.error('❌ Failed to initialize email service:', error);
    // Continue without email functionality
    transporter = { sendMail: () => Promise.reject(new Error('Email service not initialized')) };
  }
})();

/**
 * Sends an email notification to a vendor when they're assigned a new service request
 * @param {Object} options - Notification options
 * @param {string} options.vendorEmail - Vendor's email address
 * @param {string} options.vendorName - Vendor's name
 * @param {Object} options.request - Service request details
 * @param {number} [retryCount=0] - Internal use for retry attempts
 * @returns {Promise<boolean>} - True if email was sent successfully
 */
const sendVendorAssignmentNotification = async ({
  vendorEmail,
  vendorName,
  request,
  retryCount = 0
}) => {
  const maxRetries = 2;
  const retryDelay = 2000; // 2 seconds
  
  // Log notification attempt
  console.log(`\n📨 Sending vendor assignment notification to: ${vendorEmail}`);
  console.log('Request ID:', request.id);
  console.log('Retry attempt:', retryCount);
  
  try {
    // Validate required fields
    if (!vendorEmail || !vendorName || !request) {
      throw new Error('Missing required parameters for vendor notification');
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM || `"Home Service Kendra" <${process.env.EMAIL_USER}>`,
      to: vendorEmail,
      subject: `New Service Request: ${request.title || 'New Assignment'}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4F46E5;">New Service Request Assigned</h2>
          <p>Hello ${vendorName},</p>
          
          <div style="background-color: #F9FAFB; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #111827;">${request.title || 'Service Request'}</h3>
            ${request.serviceType ? `<p><strong>Service Type:</strong> ${request.serviceType}</p>` : ''}
            <p><strong>Requested On:</strong> ${new Date(request.createdAt || Date.now()).toLocaleString()}</p>
            <p><strong>Status:</strong> <span style="color: #2563EB; font-weight: 500;">Assigned to You</span></p>
            
            ${request.user ? `
            <div style="margin: 20px 0; padding: 15px; background-color: #EFF6FF; border-radius: 6px;">
              <h4 style="margin-top: 0; color: #1E40AF;">Customer Details</h4>
              <p><strong>Name:</strong> ${request.user.name || 'Not provided'}</p>
              ${request.user.email ? `<p><strong>Email:</strong> ${request.user.email}</p>` : ''}
              ${request.user.phone ? `<p><strong>Phone:</strong> ${request.user.phone}</p>` : ''}
              ${request.user.address ? `<p><strong>Address:</strong><br>${String(request.user.address).replace(/\n/g, '<br>')}</p>` : ''}
            </div>` : ''}
            
            <div style="margin-top: 20px;">
              <h4 style="margin-bottom: 10px; color: #1E40AF;">Service Description</h4>
              <p style="white-space: pre-line; background-color: white; padding: 10px; border-radius: 4px; border: 1px solid #E5E7EB;">
                ${request.description || 'No additional details provided.'}
              </p>
            </div>
          </div>
          
          <div style="margin-top: 30px; font-size: 14px; color: #6B7280; text-align: center;">
            <p>This is an automated notification. Please do not reply to this email.</p>
            <p>© ${new Date().getFullYear()} Home Service Kendra. All rights reserved.</p>
          </div>
        </div>
      `
    };

    // Send the email with retry logic
    try {
      if (!transporter || !transporter.sendMail) {
        throw new Error('Email service not properly initialized');
      }
      
      const info = await transporter.sendMail(mailOptions);
      
      // Log success with preview URL for test emails
      let successMessage = `✅ Notification sent to ${vendorEmail}`;
      if (info.messageId) {
        successMessage += ` (Message ID: ${info.messageId})`;
        
        // For test emails, log the preview URL
        if (info.response && info.response.includes('ethereal.email')) {
          successMessage += `\n📧 Preview: ${nodemailer.getTestMessageUrl(info)}`;
        }
      }
      
      console.log(successMessage);
      return true;
    } catch (sendError) {
      const errorMessage = `❌ Failed to send email (Attempt ${retryCount + 1}/${maxRetries + 1}): ${sendError.message}`;
      console.error(errorMessage);
      
      if (sendError.response) {
        console.error('SMTP Error Response:', sendError.response);
      }
      
      if (retryCount < maxRetries) {
        console.log(`⏳ Retrying in ${retryDelay/1000} seconds...`);
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        return sendVendorAssignmentNotification({
          vendorEmail,
          vendorName,
          request,
          retryCount: retryCount + 1
        });
      }
      
      throw new Error(`Failed after ${maxRetries + 1} attempts: ${sendError.message}`);
    }
  } catch (error) {
    const errorMessage = `Failed to send notification to ${vendorEmail}: ${error.message}`;
    console.error(errorMessage, error);
    
    // Log more detailed error information for debugging
    if (error.response) {
      console.error('SMTP Error Response:', error.response);
    }
    
    throw new Error(errorMessage);
  }
};

module.exports = {
  sendVendorAssignmentNotification
};
