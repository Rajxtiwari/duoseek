export type DuoSeekProfile = {
  id: string;
  gamer_handle: string | null;
  avatar_url: string | null;
  full_name: string | null;
  age: number | null;
  gender: string | null;
  dob: string | null;
  phone_number: string | null;
  bio: string | null;
  verification_level: number | null;
  is_verified: boolean | null;
};

export function isLevelOneComplete(profile: DuoSeekProfile | null | undefined) {
  if (!profile) {
    return false;
  }

  return Boolean(
    profile.gamer_handle &&
      profile.full_name &&
      profile.age &&
      profile.age > 0 &&
      profile.gender &&
      profile.dob &&
      profile.bio,
  );
}
