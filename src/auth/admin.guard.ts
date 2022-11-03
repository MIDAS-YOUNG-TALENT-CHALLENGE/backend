import { Injectable, CanActivate, ExecutionContext, NotFoundException, NotAcceptableException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity, UserRole } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AdminGuard implements CanActivate {
    constructor(@InjectRepository(UserEntity) private userRepository: Repository<UserEntity>) {}
    async canActivate(
        context: ExecutionContext,
    ): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const { userId } = request.user;
        if (userId === undefined) throw new UnauthorizedException();
        return this.checkUserRole(userId);
    }
    private async checkUserRole(userId: number): Promise<boolean> {
        const { role } = await this.userRepository.findOneBy({ userId: userId });
        if (role === null) throw new NotFoundException('유저를 찾을 수 없습니다.');
        if (role === UserRole.EMPOLYEE) throw new NotAcceptableException('권한이 없습니다.');
        if (role === UserRole.SUPERVISOR) return true;
    }
}