export async function requestPasswordReset({ email, locale }) {
  console.info("[password-reset] POST /api/password-reset-request", {
    locale: locale ?? null,
    emailHint: email ? `${String(email).slice(0, 2)}***@${String(email).split("@")[1] || "?"}` : "(empty)",
  });

  const response = await fetch("/api/password-reset-request", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      locale,
    }),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok || data?.success !== true) {
    console.error("[password-reset] API error", {
      httpStatus: response.status,
      code: data?.code,
      error: data?.error,
      detail: data?.detail,
    });
    const error = new Error(data?.error || "Password reset request failed");
    error.status = response.status;
    error.apiCode = data?.code;
    error.apiDetail = data?.detail;
    throw error;
  }

  console.info("[password-reset] success");
  return data;
}
