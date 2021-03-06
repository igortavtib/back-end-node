import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { getRepository } from "typeorm";

import authConfig from "../config/authConfig";

import AppError from '../errors/AppError';

import User from "../models/User";

interface Request {
  email: string;
  password: string;
}

interface Response {
  user: User;
  token: string;
}

export default class AuthenticateUserService {
  public async execute({email, password}: Request): Promise<Response> {

    const userRepository = getRepository(User);

    const user = await userRepository.findOne({where: { email }});

    if(!user) {
      throw new AppError('Invalid email/password combination!', 401);
    }

    const passwordMatched = await compare(password, user.password);

    if(!passwordMatched) {
      throw new AppError('Invalid email/password combination!', 401);
    }

    const { secret, expiresIn } = authConfig.jwt;

    const token = sign({}, secret, {
      subject: user.id,
      expiresIn
    });

    return {
      user,
      token
    }
  }
}
