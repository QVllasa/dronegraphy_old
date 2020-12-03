import {Roles} from "./role.interface";
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
    private roles: Roles;
    private token: string;
    private claims: JWTTokenDecoded;
    emailVerified: boolean;

    constructor(
        public uid: string,
        public email: string,
        public firstName: string,
        public lastName: string,
    ) {

    }

    getToken() {
        return this.token;
    }

    setToken(token) {
        this.token = token;
    }

    getClaims(): JWTTokenDecoded | null {
        this.claims = helper.decodeToken<JWTTokenDecoded>(this.token);
        return this.token ? this.claims : null;
    }

    getRoles(): Roles | null {
        console.log('getting roles....')
        if (!this.getClaims()) {
            return null
        }

        this.roles = {
            admin: this.getClaims().admin,
            creator: this.getClaims().creator,
            member: this.getClaims().member
        }
        return this.roles;


    }

}

