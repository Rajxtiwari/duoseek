export function isIdentityAlreadyLinkedError(message: string) {
  const value = message.toLowerCase();
  return (
    value.includes("already linked") ||
    value.includes("linked to another") ||
    value.includes("belongs to another") ||
    value.includes("identity already exists")
  );
}

export function hasLinkedIdentity(user: { identities?: Array<{ provider?: string | null }> } | null, provider: string) {
  return Boolean(user?.identities?.some((identity) => identity.provider === provider));
}

export function getLinkedIdentityAvatarUrl(
  user: {
    identities?: Array<{
      provider?: string | null;
      identity_data?: Record<string, unknown> | null;
    }>;
    user_metadata?: Record<string, unknown> | null;
  } | null,
  provider: string,
) {
  const identity = user?.identities?.find((entry) => entry.provider === provider);
  const identityData = identity?.identity_data ?? null;
  const identityAvatar =
    (typeof identityData?.avatar_url === "string" && identityData.avatar_url) ||
    (typeof identityData?.picture === "string" && identityData.picture) ||
    (typeof identityData?.avatar === "string" && identityData.avatar) ||
    null;

  const metadata = user?.user_metadata ?? null;
  const metadataAvatar =
    (typeof metadata?.avatar_url === "string" && metadata.avatar_url) ||
    (typeof metadata?.picture === "string" && metadata.picture) ||
    null;

  return identityAvatar || metadataAvatar || null;
}

export function isManualLinkingDisabledError(message: string) {
  const value = message.toLowerCase();
  return (
    value.includes("manual link") ||
    value.includes("manual linking") ||
    value.includes("identity linking is disabled") ||
    value.includes("linking is disabled")
  );
}

export function getProviderLinkErrorMessage(providerLabel: string, rawMessage: string) {
  if (isIdentityAlreadyLinkedError(rawMessage)) {
    return `This ${providerLabel} account is already linked to another user.`;
  }

  if (isManualLinkingDisabledError(rawMessage)) {
    return `Manual account linking is disabled in Supabase. Enable manual linking for ${providerLabel} in Auth provider settings, then try again.`;
  }

  return rawMessage;
}

export function getDiscordLinkErrorMessage(rawMessage: string) {
  return getProviderLinkErrorMessage("Discord", rawMessage);
}
