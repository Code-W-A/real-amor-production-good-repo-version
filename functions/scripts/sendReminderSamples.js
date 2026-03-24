#!/usr/bin/env node
/**
 * Trimite pe email, în test, toate tipurile de reminder-e folosind aceeași logică
 * ca producția (sendReminderSamplesToInbox din remindersEngine.js).
 *
 * Rulare (din folderul functions/):
 *   node scripts/sendReminderSamples.js destinatar@exemplu.com
 *   node scripts/sendReminderSamples.js destinatar@exemplu.com --lang=nl
 *   node scripts/sendReminderSamples.js destinatar@exemplu.com --all-langs
 *   node scripts/sendReminderSamples.js destinatar@exemplu.com --username="Sophie"
 *
 * Folosește aceeași configurație SMTP ca functions/index.js (functions/mailTransport.js).
 * Opțional suprascrii: MAIL_HOST, MAIL_PORT, MAIL_USER, MAIL_PASS, MAIL_FROM.
 *
 * Previzualizare fără SMTP:
 *   node scripts/sendReminderSamples.js destinatar@exemplu.com --dry-run
 *
 * Pentru trimitere de pe IP Google (fără 535 local), deploy sendReminderSamplesHttp + curl.
 */

"use strict";

const path = require("path");

const { createMailTransporter } = require(
  path.join(__dirname, "..", "mailTransport")
);
const {
  buildReminderEmail,
  sendReminderSamplesToInbox,
  orderedReminderSampleStages,
} = require(path.join(__dirname, "..", "remindersEngine"));

function parseArgs(argv) {
  const positional = [];
  let lang = "fr";
  let allLangs = false;
  let dryRun = false;
  let username = "Client test";

  for (const a of argv) {
    if (a.startsWith("--lang=")) {
      lang = String(a.slice("--lang=".length)).toLowerCase();
    } else if (a === "--all-langs") {
      allLangs = true;
    } else if (a === "--dry-run") {
      dryRun = true;
    } else if (a.startsWith("--username=")) {
      username = a.slice("--username=".length).replace(/^"|"$/g, "");
    } else if (a === "--help" || a === "-h") {
      return { help: true };
    } else if (!a.startsWith("-")) {
      positional.push(a);
    }
  }

  return {
    email: positional[0] || null,
    lang,
    allLangs,
    dryRun,
    username,
    help: false,
  };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const stages = orderedReminderSampleStages();
  const stageCount = stages.length;

  if (args.help) {
    console.log(`
Usage:
  node scripts/sendReminderSamples.js <email> [options]

Options:
  --lang=fr|nl     Limba mesajului (implicit: fr)
  --all-langs      Trimite fiecare tip și în FR și în NL (${stageCount * 2} emailuri)
  --username=Name  Nume folosit în salut (implicit: "Client test")
  --dry-run        Afișează subiect + corp în terminal, fără SMTP

Environment (opțional — altfel = aceleași valori ca în mailTransport.js / index.js):
  MAIL_HOST, MAIL_PORT, MAIL_USER, MAIL_PASS, MAIL_FROM
`);
    process.exit(0);
  }

  if (!args.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(args.email)) {
    console.error(
      "Lipsește sau e invalid adresa de email. Exemplu:\n  node scripts/sendReminderSamples.js test@exemplu.com"
    );
    process.exit(1);
  }

  const langs = args.allLangs ? ["fr", "nl"] : [args.lang === "nl" ? "nl" : "fr"];

  console.log(`Destinatar: ${args.email}`);
  console.log(`Limbi: ${langs.join(", ")}`);
  console.log(`Etape: ${stages.join(", ")}`);
  if (args.dryRun) console.log("Mod: dry-run (fără trimitere)\n");
  else {
    console.log(
      `SMTP: mailTransport.js (user ${process.env.MAIL_USER || "office@real-amor.com"})\n`
    );
  }

  if (args.dryRun) {
    for (const language of langs) {
      for (const stage of stages) {
        const payload = buildReminderEmail(stage, {
          username: args.username,
          targetLanguage: language,
        });
        if (!payload) {
          console.error(`Sărit: ${stage} (${language}) — fără template`);
          continue;
        }
        console.log(
          `\n---------- [${language}] ${stage} ----------\nSubject: ${payload.subject}\n\n${payload.text}\n`
        );
      }
    }
    console.log("\nGata.");
    return;
  }

  const transporter = createMailTransporter();
  try {
    await transporter.verify();
  } catch (e) {
    if (e && (e.code === "EAUTH" || e.responseCode === 535)) {
      console.error(`
Autentificare SMTP respinsă (535). Pași uzuali:
  • Parola din mailTransport.js (DEFAULT_PASS) sau cPanel s-a schimbat — reseteaz-o în cPanel și
    actualizează DEFAULT_PASS sau rulează cu: MAIL_PASS='parola_nouă' node scripts/...
  • Încearcă portul 587 (STARTTLS), uneori merge când 465 nu merge de pe rețeaua ta:
    MAIL_PORT=587 MAIL_SECURE=false node scripts/sendReminderSamples.js <email> ...
  • Hostingul poate bloca SMTP din IP-uri care nu sunt Google (Functions merge, laptop nu).
  • După deploy: curl la sendReminderSamplesHttp (vezi comentariu în functions/index.js).

Sau: node scripts/sendReminderSamples.js <email> --dry-run (fără trimitere).
`);
    }
    throw e;
  }

  const result = await sendReminderSamplesToInbox({
    transporter,
    to: args.email,
    username: args.username,
    allLangs: args.allLangs,
    langsOverride: args.allLangs ? null : langs,
  });

  for (const row of result.sent) {
    console.log(
      `OK  [${row.lang}] ${row.stage} → messageId=${row.messageId || "n/a"}`
    );
  }
  for (const row of result.errors) {
    console.error(
      `ERR [${row.lang}] ${row.stage}: ${row.reason || "unknown"}`
    );
  }

  if (!result.ok) {
    process.exit(1);
  }

  console.log("\nGata.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
