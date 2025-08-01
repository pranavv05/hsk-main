// backend/services/notification.service.js
const nodemailer = require('nodemailer');

// Configure email transporter (update with your email service details)
const transporter = nodemailer.createTransport({
  service: 'gmail', // or your email service
  auth: {
    user: process.env.EMAIL_USER || 'helphskhelp@gmail.com', // replace with your email
    pass: process.env.EMAIL_PASS || 'Mahadev@1978' // use an App Password for Gmail
  }
});

/**
 * Sends an email notification to a vendor when they're assigned a new service request
 * @param {Object} options - Notification options
 * @param {string} options.vendorEmail - Vendor's email address
 * @param {string} options.vendorName - Vendor's name
 * @param {Object} options.request - Service request details
 */
const sendVendorAssignmentNotification = async ({
  vendorEmail,
  vendorName,
  request
}) => {
  try {
    const mailOptions = {
      from: `"Home Service Kendra" <${process.env.EMAIL_USER || 'noreply@homeservicekendra.com'}>`,
      to: vendorEmail,
      subject: `New Service Request: ${request.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4F46E5;">New Service Request Assigned</h2>
          
          <div style="background-color: #F9FAFB; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #111827;">${request.title}</h3>
            <p><strong>Service Type:</strong> ${request.serviceType}</p>
            <p><strong>Requested On:</strong> ${new Date(request.createdAt).toLocaleString()}</p>
            <p><strong>Status:</strong> <span style="color: #2563EB; font-weight: 500;">Assigned to You</span></p>
            
            <div style="margin: 20px 0; padding: 15px; background-color: #EFF6FF; border-radius: 6px;">
              <h4 style="margin-top: 0; color: #1E40AF;">Customer Details</h4>
              <p><strong>Name:</strong> ${request.user.name}</p>
              <p><strong>Email:</strong> ${request.user.email}</p>
              <p><strong>Phone:</strong> ${request.user.phone || 'Not provided'}</p>
              ${request.user.address ? `<p><strong>Address:</strong><br>${request.user.address.replace(/\n/g, '<br>')}</p>` : ''}
            </div>
            
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

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log('Vendor notification sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending vendor notification:', error);
    throw error;
  }
};

module.exports = {
  sendVendorAssignmentNotification
};
