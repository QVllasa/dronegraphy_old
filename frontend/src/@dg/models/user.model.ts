import {Roles} from "./role.interface";
import {IClaims} from "./JWTTokenDecoded.interface";

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
    #roles: Roles = null
    #claims: IClaims = null;


    constructor(
        public uid: string,
        public email: string,
        public firstName: string,
        public lastName: string
    ) {}


    setClaims(claims: IClaims) {
        this.#claims = claims;
    }

    getRoles(): Roles | null {
        if(this.#claims){
            this.#roles = this.#claims["roles"]
        }
        return this.#roles ? this.#roles : null;
    }

}

