import bcrypt from "bcryptjs";

const comparePassword = async (
  enteredPassword: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(enteredPassword, hashedPassword);
};

export default comparePassword;