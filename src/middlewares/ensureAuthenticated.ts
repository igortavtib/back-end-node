import { NextFunction, Request, Response} from "express";
import { verify } from "jsonwebtoken";

import authConfig from "../config/authConfig";

interface TokenPayload {
  iat: number;
  exp: number;
  sub: string;
}

export default function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction): void {
    const authHeader = request.headers.authorization;

    if(!authHeader) {
      throw new Error('No authorization token found!')
    }

    const [, token ] = authHeader.split(' ');

    try {
      const decoded = verify(token, authConfig.jwt.secret);

      const { sub } = decoded as TokenPayload;

      request.user = {
        id: sub
      }

      next();
    } catch(err) {
      throw new Error('Invalid JWT token')
    }
}