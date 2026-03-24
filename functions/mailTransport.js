/**
 * O singură configurație SMTP pentru Cloud Functions și scripturi locale (ex. sendReminderSamples).
 *
 * Env: MAIL_HOST, MAIL_PORT, MAIL_SECURE, MAIL_USER, MAIL_PASS, MAIL_FROM
 *
 * Dacă primești 535 de pe laptop dar mailul merge din Firebase: uneori hostul blochează SMTP
 * din IP-uri necunoscute. Încearcă din terminal:
 *   MAIL_PORT=587 MAIL_SECURE=false node scripts/sendReminderSamples.js ...
 * Actualizează DEFAULT_PASS sau MAIL_PASS cu parola curentă din cPanel (Email Accounts).
 */

const nodemailer = require("nodemailer");

const DEFAULT_HOST = "mail.real-amor.com";
const DEFAULT_PORT = 465;
const DEFAULT_USER = "office@real-amor.com";
const DEFAULT_PASS = "M}7QZ.WxG#LgQEKN";
const DEFAULT_FROM = "office@real-amor.com";

function createMailTransporter() {
  const port = Number(process.env.MAIL_PORT || DEFAULT_PORT);

  let secure;
  if (process.env.MAIL_SECURE === "true") {
    secure = true;
  } else if (process.env.MAIL_SECURE === "false") {
    secure = false;
  } else {
    secure = port === 465;
  }

  const options = {
    host: process.env.MAIL_HOST || DEFAULT_HOST,
    port,
    secure,
    auth: {
      user: process.env.MAIL_USER || DEFAULT_USER,
      pass: (process.env.MAIL_PASS || DEFAULT_PASS).trim(),
    },
  };

  if (!secure) {
    options.requireTLS = true;
  }

  return nodemailer.createTransport(options);
}

function getMailFrom() {
  return process.env.MAIL_FROM || DEFAULT_FROM;
}

module.exports = {
  createMailTransporter,
  getMailFrom,
};
