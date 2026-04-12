const LOCAL_AUTH_CALLBACK_URL = "http://localhost:3000/auth/callback";

export function getAuthCallbackUrl() {
  return process.env.NEXT_PUBLIC_AUTH_CALLBACK_URL || LOCAL_AUTH_CALLBACK_URL;
}
