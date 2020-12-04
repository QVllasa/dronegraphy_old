import {defaultRoles, Roles} from "./role.interface";
import {AuthenticationService} from "../services/auth.service";
import {JwtHelperService} from "@auth0/angular-jwt";
import {JWTTokenDecoded} from "./JWTTokenDecoded.interface";

const helper = new JwtHelperService();

export interface IUser {
    uid: string;
    email: string;
    firstName: string;
    lastName: string;
    // imgPath?: string;
    // activated?: boolean;
    // [videos: number]: Video[];
    // orders?: Order[];
    // favorites?: Video[];
    // saved?: IUser[];
    // job?: any;
}

export class User implements IUser {
    // public uid: string;
    // public email: string;
    // public firstName: string;
    // public lastName: string;
    private roles: Roles = null
    private token: string = null;
    private claims: JWTTokenDecoded = null;
    emailVerified: boolean;

    constructor(
        public uid: string,
        public email: string,
        public firstName: string,
        public lastName: string
    ) {
    }

    getToken() {
        return this.token;
    }

    setToken(token) {
        this.token = token;
        console.log(token)
    }

    setClaims(claims: JWTTokenDecoded) {
        console.log("claims setted")
        console.log(this.claims)
        this.claims = claims;
    }

    setRoles(roles) {
        console.log(roles)
        this.roles = roles;
    }

    getRoles(): Roles | null {
        return this.roles ? this.roles : null;
    }

}

