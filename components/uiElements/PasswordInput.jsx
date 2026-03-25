"use client";

import { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";

/**
 * Câmp parolă cu buton show/hide în dreapta, în același chenar ca inputul.
 * Vizibilitatea este gestionată intern; valoarea rămâne controlată de părinte.
 */
export default function PasswordInput({
  value,
  onChange,
  name,
  id,
  placeholder,
  className = "",
  required = false,
  autoComplete,
  disabled = false,
  hasError = false,
  showPasswordLabel = "Show password",
  hidePasswordLabel = "Hide password",
}) {
  const [visible, setVisible] = useState(false);

  const ICON = 22;

  const shellClass = [
    "password-input-shell",
    "d-flex",
    "align-items-stretch",
    "w-100",
    hasError ? "border-danger-red" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const shellStyle = hasError
    ? undefined
    : {
        border: "1px solid #dddddd",
        borderRadius: 8,
        overflow: "hidden",
        backgroundColor: "transparent",
        transition: "all 0.15s cubic-bezier(0.165, 0.84, 0.44, 1)",
      };

  return (
    <div className={shellClass} style={shellStyle}>
      <input
        id={id}
        name={name}
        type={visible ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="password-input-shell__field border-0 flex-grow-1 min-w-0 bg-transparent text-dark-1"
        required={required}
        autoComplete={autoComplete}
        disabled={disabled}
        style={{
          padding: "15px 8px 15px 22px",
          fontSize: 15,
          lineHeight: 1.5,
          outline: "none",
          boxShadow: "none",
        }}
      />
      <button
        type="button"
        className="password-input-shell__toggle d-flex align-items-center justify-content-center btn border-0 bg-transparent text-dark-1 flex-shrink-0 shadow-none p-0"
        style={{
          width: 48,
          minWidth: 48,
        }}
        onClick={() => setVisible((v) => !v)}
        disabled={disabled}
        tabIndex={disabled ? -1 : 0}
        aria-label={visible ? hidePasswordLabel : showPasswordLabel}
        aria-pressed={visible}
        data-password-toggle
      >
        {visible ? (
          <EyeSlashIcon width={ICON} height={ICON} aria-hidden />
        ) : (
          <EyeIcon width={ICON} height={ICON} aria-hidden />
        )}
      </button>
    </div>
  );
}
