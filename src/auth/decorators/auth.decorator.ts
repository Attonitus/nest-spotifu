import { applyDecorators, UseGuards } from "@nestjs/common"
import { ArtistRoleGuard } from "../guards/artist-role.guard"
import { AuthGuard } from "@nestjs/passport"
import { ValidRoles } from "../interfaces/valid-roles.interface"
import { RoleProtected } from "./role-protected.decorator"


export function Auth(...roles: ValidRoles[]){
    return applyDecorators(
        RoleProtected(...roles),
        UseGuards(AuthGuard(), ArtistRoleGuard)
    )
}