import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

const { SECRET_KEY } = process.env;

@Injectable()
export class AuthService {
    constructor(private jwtService: JwtService) { }

    async getToken(email: string, password: string) {
        const payload = { email: email, password: password };

        const token = this.jwtService.sign(payload, {
            secret: SECRET_KEY,
            algorithm: 'HS256',
            expiresIn: '1h'
        });

        return { token }
    }

}
