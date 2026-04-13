export function isIdentityAlreadyLinkedError(message: string) {
  const value = message.toLowerCase();
  return (
    value.includes("already linked") ||
    value.includes("linked to another") ||
    value.includes("belongs to another") ||
    value.includes("identity already exists")
  );
}

export function getDiscordLinkErrorMessage(rawMessage: string) {
  if (isIdentityAlreadyLinkedError(rawMessage)) {
    return "This Discord account is already linked to another user.";
  }

  return rawMessage;
}
