import sendGridEmail from './sendGridEmail.js';

async function sendVerificationToken(email, verificationToken) {
  const { BASE_FROM_EMAIL, BASE_URL } = process.env;
  if (!BASE_FROM_EMAIL || !BASE_URL) {
    throw new Error(
      'BASE_FROM_EMAIL and BASE_URL must be defined in your .env file'
    );
  }
  const verificationEmail = {
    to: email,
    from: BASE_FROM_EMAIL,
    subject: 'Welcome!',
    html: `<a target="_blank" href="${BASE_URL}/users/verify/${verificationToken}">Click to verify email</a>`,
    text: `To confirm your registration please open the link ${BASE_URL}/users/verify/${verificationToken}`,
  };

  try {
    await sendGridEmail(verificationEmail);
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw new Error('Failed to send verification email');
  }
}

export default sendVerificationToken;
