// backend/services/notification.service.js
const nodemailer = require('nodemailer');

// Validate required environment variables
const requiredEnvVars = ['EMAIL_SERVICE', 'EMAIL_USER', 'EMAIL_PASS', 'EMAIL_FROM'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0 && process.env.NODE_ENV === 'production') {
  console.error('Missing required email configuration in environment variables:', missingVars.join(', '));
  console.error('Email notifications will not work until this is fixed.');
}

// Configure email transporter
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false // Only for development with self-signed certificates
  }
});

// Verify connection configuration
transporter.verify(function(error, success) {
  if (error) {
    console.error('Error verifying email transporter:', error);
  } else {
    console.log('Email server is ready to take our messages');
  }
});

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
      const info = await transporter.sendMail(mailOptions);
      console.log(`Notification sent to ${vendorEmail} (Message ID: ${info.messageId})`);
      return true;
    } catch (sendError) {
      if (retryCount < maxRetries) {
        console.warn(`Attempt ${retryCount + 1} failed. Retrying in ${retryDelay}ms...`, sendError.message);
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        return sendVendorAssignmentNotification({
          vendorEmail,
          vendorName,
          request,
          retryCount: retryCount + 1
        });
      }
      throw sendError; // Re-throw if max retries reached
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
