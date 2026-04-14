export function isIdentityAlreadyLinkedError(message: string) {
  const value = message.toLowerCase();
  return (
    value.includes("already linked") ||
    value.includes("linked to another") ||
    value.includes("belongs to another") ||
    value.includes("identity already exists")
  );
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
