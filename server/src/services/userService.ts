import db from '../utils/db';
import bcrypt from 'bcrypt';
import generateToken from '../utils/generateToken';
import { WalletType } from '../utils/enums';

export async function registerUser(
  name: string,
  email: string,
  password: string,
) {
  // validate all fields
  if ([name, email, password].some((field) => !field || field.trim() === ''))
    throw new Error('All fields are required.');

  // check if user already exists
  const userExists = await db.user.findUnique({ where: { email } });
  if (userExists) throw new Error('User already exist');

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create new user
  const newUser = await db.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      wallets: {
        create: {
          name: 'Main Wallet',
          type: WalletType.MAIN,
          balance: 0,
        },
      },
    },
  });

  return { id: newUser.id, name, email };
}

export async function loginUser(email: string, password: string) {
  // validate all fields
  if ([email, password].some((field) => !field || field.trim() === ''))
    throw new Error('All fields are required.');

  // check if the user exists or password is correct
  const user = await db.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error('Invalid email or password');
  }

  const token = generateToken(user.id);

  return { user: { id: user.id, name: user.name, email }, token };
}
