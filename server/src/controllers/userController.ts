import { Request, Response } from 'express';
import { loginUser, registerUser } from '../services/userService';

export async function register(req: Request, res: Response): Promise<void> {
  const { name, email, password } = req.body;

  try {
    const user = await registerUser(name, email, password);
    res.status(201).json(user);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: 'Registration failed', error: error.message });
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body;
  try {
    const user = await loginUser(email, password);
    res.status(200).json(user);
  } catch (error: any) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
}
