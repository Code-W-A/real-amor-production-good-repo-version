# Local i18n

This directory contains the local i18n infrastructure used to replace runtime translation calls step by step.

## Conventions

- Message files live in `i18n/messages/{lang}/{namespace}.json`.
- Message files are flat JSON objects with string values only.
- Keys must follow the existing names already used in `translatedLinks` and `translatedTexts`.
- French (`fr`) is the canonical source and must copy the current app strings exactly, without text normalization.
- New namespaces are added only when a migration stage starts using them.

## API

- `getMessages(lang, namespace)` returns the requested namespace merged with the `fr` fallback.
- `t(lang, namespace, key)` returns the resolved string for a single key.
- Missing keys fall back to the key name and log a warning only in development.
