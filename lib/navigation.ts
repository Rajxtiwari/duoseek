const DEFAULT_INTERNAL_PATH = "/";

export function getSafeInternalPath(candidate: string | null | undefined, fallback = DEFAULT_INTERNAL_PATH) {
  if (!candidate || !candidate.startsWith("/") || candidate.startsWith("//") || candidate.includes("\\")) {
    return fallback;
  }

  try {
    const resolved = new URL(candidate, "http://local.test");
    if (resolved.origin !== "http://local.test") {
      return fallback;
    }

    return `${resolved.pathname}${resolved.search}${resolved.hash}` || fallback;
  } catch {
    return fallback;
  }
}