export interface Roles {
    member: boolean;
    creator: boolean;
    admin: boolean;
}


export const defaultRoles: Roles = {
    admin: false,
    creator: false,
    member: true,
}
