import sendEmail from './sendEmail.js';

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
    http: `<a target="_blank" href="${BASE_URL}/users/verify/${verificationToken}">Click to verify email</a>`,
    html: (
      <p>
        `To confirm your registration please open the link ${BASE_URL}
        /users/verify/${verificationToken}`
      </p>
    ),
  };

  await sendEmail(verificationEmail);
}

const msg = {
  to: 'presich_v@ukr.net',
  from: 'valya.alexandrova.presich@gmail.com',
  subject: 'Sending with SendGrid is Fun',
  text: 'and easy to do anywhere, even with Node.js',
  html: '<strong>and easy to do anywhere, even with Node.js</strong>',
};

export default sendVerificationToken;
