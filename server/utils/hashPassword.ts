import bcrypt from "bcrypt";

export const encryptPassword = async (password: string) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

export const comparePassword = async (
  candidatePassword: string,
  hashedPassword: string
) => {
  return await bcrypt.compare(candidatePassword, hashedPassword);
};
