export async function requestPasswordReset({ email, locale }) {
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
    const error = new Error(data?.error || "Password reset request failed");
    error.status = response.status;
    throw error;
  }

  return data;
}
