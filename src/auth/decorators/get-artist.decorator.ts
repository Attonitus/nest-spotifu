import { createParamDecorator, ExecutionContext, InternalServerErrorException } from "@nestjs/common";

export const GetArtist = createParamDecorator(
    (data: string, ctx: ExecutionContext) => {

        const req = ctx.switchToHttp().getRequest();
        const user = req.user;
        if(!user) throw new InternalServerErrorException(`Error: Artist not found!`);

        if(data === 'email'){
            return req.user.email;
        }

        return req.user;
    }
)