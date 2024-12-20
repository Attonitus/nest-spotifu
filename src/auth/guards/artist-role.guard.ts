import { CanActivate, ExecutionContext, ForbiddenException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { META_ROLES } from '../decorators/role-protected.decorator';

@Injectable()
export class ArtistRoleGuard implements CanActivate {

  constructor(
    private readonly reflector: Reflector
  ){}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    const validRoles: string[] = this.reflector.get(META_ROLES, context.getHandler());

    if(!validRoles) return true;

    if(validRoles.length === 0) return true;

    const req = context.switchToHttp().getRequest();
    const user = req.user;

    if(!user) throw new InternalServerErrorException(`Error: Artist not found!`);

    for (const role of user.roles) {
      if(validRoles.includes(role)){
        return true;
      }
    }

    throw new ForbiddenException(`Artist ${user.name} need a valid role: ${validRoles}`)
  }
}
