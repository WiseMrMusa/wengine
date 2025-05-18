import { Type } from "@sinclair/typebox";

export enum Permission {
    Owner = "OWNER",
    Admin = "ADMIN"
}

export const PermissionSchema = Type.Union([
    Type.Literal(Permission.Owner),
    Type.Literal(Permission.Admin)
]);