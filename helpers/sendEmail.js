import nodemailer from 'nodemailer';

const { META_PASSWORD, BASE_FROM_EMAIL } = process.env;
if (!BASE_FROM_EMAIL || !META_PASSWORD) {
  throw new Error(
    'BASE_FROM_EMAIL and META_PASSWORD must be defined in your .env file'
  );
}

const transport = nodemailer.createTransport({
  host: 'smtp.meta.ua',
  port: 465,
  auth: {
    user: BASE_FROM_EMAIL,
    pass: META_PASSWORD,
  },
});

async function sendEmail(message) {
  return await transport.sendMail(message);
}

export default sendEmail;
