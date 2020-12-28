import {IClaims} from "./JWTTokenDecoded.interface";
import {Deserializable} from "./deserialize.interface";
import {Video} from "./video.model";
import {environment} from "../../environments/environment";

export interface IUser {
    uid: string;
    email: string;
    firstName: string;
    lastName: string;
    profileImage?: string;
    // imgPath?: string;
    // activated?: boolean;
    // [videos: number]: Video[];
    // orders?: Order[];
    // favorites?: Video[];
    // saved?: IUser[];
    // job?: any;
}

export class User implements IUser, Deserializable {

    uid: string;
    email: string;
    firstName: string;
    lastName: string;
    favorite?: Video[];
    slogan?: string;
    profileImage?: string;

    #role: string = null;
    #claims: IClaims = null;

    deserialize(input: IUser): this {
        Object.assign(this, input);
        return this;
    }

    getFullName() {
        return this.firstName + ' ' + this.lastName
    }

    setProfileImage(id){
        this.profileImage = id;
    }

    getProfileImage(){
        return environment.apiUrl+'/photos/'+this.profileImage
    }

    setClaims(claims: IClaims) {
        this.#claims = claims;
    }

    get role(): string | null {
        if (this.#claims) {
            this.#role = this.#claims["role"]
        }
        return this.#role ? this.#role : null;
    }


    removePhoto() {

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

