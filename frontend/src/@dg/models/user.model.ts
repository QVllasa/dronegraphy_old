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
    // public uid: string;
    // public email: string;
    // public firstName: string;
    // public lastName: string;
    #roles: Roles = null
    #token: string = null;
    #claims: IClaims = null;
    emailVerified: boolean;

    constructor(
        public uid: string,
        public email: string,
        public firstName: string,
        public lastName: string
    ) {
        // this.uid = uid;
        // this.email = email;
        // this.firstName = firstName;
        // this.lastName = lastName;
    }

    setFirstName(fname){
        this.firstName = fname
    }

    setLastName(lname){
        this.lastName = lname
    }

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

