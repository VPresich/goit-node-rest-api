import sgMail from '@sendgrid/mail';

const { SENDGRID_API_KEY } = process.env;
sgMail.setApiKey(SENDGRID_API_KEY);

async function sendGridEmail(message) {
  return await sgMail.send(message);
}

export default sendGridEmail;
