// backend/services/notification.service.js

console.log('📧 Email Notification Service: DISABLED by user request');

// Mock transporter to prevent errors if referenced
const transporter = {
  sendMail: async () => {
    console.log('Dummy email sent (Setup Disabled)');
    return { messageId: 'disabled-mock-id' };
  },
  verify: async () => true
};

/**
 * Mock function that just logs the notification
 */
const sendVendorAssignmentNotification = async ({
  vendorEmail,
  vendorName,
  request,
  retryCount = 0
}) => {
  console.log(`\n[DISABLED] Would send vendor assignment notification to: ${vendorEmail}`);
  console.log('Request ID:', request.id);
  return true;
};

module.exports = {
  sendVendorAssignmentNotification
};
