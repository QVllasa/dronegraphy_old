export interface JWTTokenDecoded {
    admin: boolean,
    creator: boolean,
    member: boolean,
    iss: string;
    aud: string;
    auth_time: number;
    user_id: string;
    sub: string;
    iat: number;
    exp: number;
    email: string;
    email_verified: boolean;
}

