module.exports = {
  images: {
    // Shared hosting often can't run Next's image optimizer (sharp/native deps).
    // Disabling optimization makes <Image> render as a plain <img>, so local PNGs work reliably.
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        port: "",
        pathname: "/v0/b/**",
      },
    ],
  },
  env: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN:
      process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    NEXT_PUBLIC_FIREBASE_PROJECT_ID:
      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET:
      process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID:
      process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID:
      process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
    // Expose a single publishable key to the browser, chosen by STRIPE_MODE.
    // This prevents the frontend from being stuck on test keys when STRIPE_MODE=live.
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:
      String(process.env.STRIPE_MODE || "test").toLowerCase() === "live"
        ? process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_LIVE
        : process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_TEST,
    NEXT_PUBLIC_API_TRANSLATE_ENDPOINT:
      process.env.NEXT_PUBLIC_API_TRANSLATE_ENDPOINT,
    GOOGLE_CLOUD_API_KEY: process.env.GOOGLE_CLOUD_API_KEY,
  },
};
