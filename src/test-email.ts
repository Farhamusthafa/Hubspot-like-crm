import { sendEmail } from './utils/sendEmail';

const testEmail = async () => {
  console.log('Testing email configuration...');
  console.log('EMAIL_USER:', process.env.EMAIL_USER ? 'SET' : 'NOT SET');
  console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? 'SET' : 'NOT SET');
  
  try {
    const result = await sendEmail(
      ['test@example.com'], // Replace with your test email
      'Test Email from CRM',
      '<h1>Test Email</h1><p>This is a test email from the CRM system.</p>'
    );
    console.log('Email test successful:', result);
  } catch (error) {
    console.error('Email test failed:', error);
  }
};

testEmail();
