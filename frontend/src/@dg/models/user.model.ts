import {Roles} from "./role.interface";
import {IClaims} from "./JWTTokenDecoded.interface";
import {Deserializable} from "./deserialize.interface";
import {Video} from "./video.model";

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

export class User implements IUser, Deserializable {

    public uid: string;
    public email: string;
    public firstName: string;
    public lastName: string;
    public favorite?: Video[];
    public slogan?: string;

    #roles: Roles = null
    #claims: IClaims = null;

    deserialize(input: IUser): this {
        Object.assign(this, input);
        return this;
    }

    getFullName() {
        return this.firstName + ' ' + this.lastName
    }

    setClaims(claims: IClaims) {
        this.#claims = claims;
    }

    getRoles(): Roles | null {
        if (this.#claims) {
            this.#roles = this.#claims["roles"]
        }
        return this.#roles ? this.#roles : null;
    }

    setPhotoUri(){

    }

    getPhotoUri(){

    }

    removePhoto(){

    }

    setFavorite(video: Video) {
        this.favorite.push(video)
    }

    getFavorite(): Video[] | null {
        if (!this.favorite || (this.favorite.length === 0)) {
            return null
        }
        return this.favorite
    }

    removeFavorite(video: Video, count: number) {
        if (!this.favorite || (this.favorite.length === 0)) {
            return
        }
        this.favorite.splice(this.favorite.indexOf(video), count)
    }

}

