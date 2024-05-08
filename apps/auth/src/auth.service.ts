import { Injectable } from "@nestjs/common";
import { UserDocument } from "./users/entities/user.entity";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Response } from "express";

@Injectable()
export class AuthService {

  constructor(
    private readonly cs: ConfigService,
    private readonly jwtService: JwtService
  ) {

  }

  async login(user: UserDocument, response: Response) {
    const payload =
      {
        email: user.email,
        sub: user._id.toHexString()
      };
    const expiresIn = new Date();


    const token = this.jwtService.sign(payload, {
      expiresIn: this.cs.getOrThrow("JWT_EXPIRE"),
      secret: this.cs.getOrThrow("JWT_SECRET")
    });

    expiresIn.setSeconds(
      expiresIn.getSeconds() + this.cs.getOrThrow("JWT_EXPIRE")
    );

    response.cookie("token", token, { httpOnly: true, expires: expiresIn });
  }


}