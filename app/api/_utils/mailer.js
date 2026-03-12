import nodemailer from "nodemailer";

let cachedTransporter = null;

function parseSmtpPort(value) {
  const port = Number(value);
  if (!Number.isInteger(port) || port <= 0) {
    throw new Error("Invalid SMTP_PORT");
  }
  return port;
}

function parseSmtpSecure(value, port) {
  if (typeof value === "string" && value.trim() !== "") {
    return value === "true";
  }
  return port === 465;
}

function getSmtpConfig() {
  const host = String(process.env.SMTP_HOST || "").trim();
  const port = parseSmtpPort(process.env.SMTP_PORT);
  const secure = parseSmtpSecure(process.env.SMTP_SECURE, port);
  const user = String(process.env.SMTP_USER || "").trim();
  const pass = String(process.env.SMTP_PASS || "");
  const from =
    String(process.env.MAIL_FROM || "").trim() || user;

  if (!host) throw new Error("Missing SMTP_HOST");
  if (!user) throw new Error("Missing SMTP_USER");
  if (!pass) throw new Error("Missing SMTP_PASS");
  if (!from) throw new Error("Missing MAIL_FROM");

  return {
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
    from,
  };
}

export function getMailTransporter() {
  if (cachedTransporter) {
    return cachedTransporter;
  }

  const config = getSmtpConfig();
  cachedTransporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: config.auth,
  });

  return cachedTransporter;
}

export function getMailFrom() {
  return getSmtpConfig().from;
}

export async function sendMail(options) {
  const transporter = getMailTransporter();

  return transporter.sendMail({
    from: getMailFrom(),
    ...options,
  });
}
