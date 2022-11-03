import { Inject, Injectable, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './jwt.model';
import { UserDto } from '../dto/responed/user.dto';
import { plainToClass } from '@nestjs/class-transformer';

const { SECRET_KEY } = process.env;

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    
    constructor(
        @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
        private jwtService: JwtService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: SECRET_KEY,
            passReqToCallback: true,
            ignoreExpiration: false,
        });
    }

    async validate(payload: any) {
        const token = await this.jwtService.verify(payload.rawHeaders[1].split(' ')[1], {
            secret: SECRET_KEY,
        });
        if (token === undefined) {
            throw new UnauthorizedException();
        }
        const user = await this.findByPhone(token.email);
        return user;
    }

    private async findByPhone(email: string) {
        const user: UserEntity = await this.userRepository.findOneBy({email: email});
        const dto: UserDto = plainToClass(UserDto, {
            ...user
        }, {excludeExtraneousValues: true});
        return dto;
    }
}