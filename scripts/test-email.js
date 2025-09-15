// Test script for email functionality
// Run with: node scripts/test-email.js

require('dotenv').config({ path: '.env.local' })
const { sendTemporaryPasswordEmail } = require('../lib/emailService')

async function testEmail() {
  console.log('🧪 Testing email functionality...')
  console.log('📧 Email configuration:')
  console.log('   EMAIL_USER:', process.env.EMAIL_USER ? '✅ Set' : '❌ Missing')
  console.log('   EMAIL_PASS:', process.env.EMAIL_PASS ? '✅ Set' : '❌ Missing')
  console.log('   EMAIL_FROM:', process.env.EMAIL_FROM || 'Using EMAIL_USER')
  console.log('   EMAIL_SERVICE:', process.env.EMAIL_SERVICE || 'gmail (default)')
  console.log('')

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log('⚠️  Email credentials not configured. Test will use console logging fallback.')
    console.log('   To test real email sending, configure EMAIL_USER and EMAIL_PASS in .env.local')
    console.log('')
  }

  try {
    const result = await sendTemporaryPasswordEmail(
      'test@example.com', // Replace with your test email
      'Test User',
      'TempPass123!@#'
    )

    if (result.success) {
      console.log('✅ Email test completed successfully!')
      console.log('📧 Check your email inbox for the test message.')
    } else {
      console.log('❌ Email test failed:', result.error)
    }
  } catch (error) {
    console.error('❌ Test error:', error.message)
  }
}

testEmail()
