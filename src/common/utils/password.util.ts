import * as bcrypt from 'bcrypt';

// Function to hash a password
export async function hashPassword(password: string | number) {
  const saltRounds = 10; // Number of salt rounds (recommended: 10-12)
  return await bcrypt.hash(password.toString(), saltRounds);
}

// Function to compare a password with a hashed password
export async function comparePassword(
  plainPassword: string | number,
  hashedPassword: string | number,
) {
  return await bcrypt.compare(
    plainPassword.toString(),
    hashedPassword.toString(),
  );
}
