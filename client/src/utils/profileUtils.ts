import type { User } from "../@types/user";

export const isProfileComplete = (user: User | null): boolean => {
  if (!user) return false;

  return !!(
    user.first_name &&
    user.dob_day &&
    user.gender_identity &&
    user.gender_interest &&
    user.about &&
    user.image &&
    user.spoken_languages?.length > 0 &&
    user.learning_languages?.length > 0
  );
};
