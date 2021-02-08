import {IClaims} from "./JWTTokenDecoded.interface";
import {Deserializable} from "./deserialize.interface";
import {Video} from "./video.model";
import {environment} from "../../environments/environment";

export interface IUser {
    uid: string;
    firstName: string;
    lastName: string;
    email?: string;
    profileImage?: string;
    favoriteVideos?: string[];
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
    firstName: string;
    lastName: string;
    email?: string;
    favoriteVideos?: string[];
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

    setFavorites(favorites: string[]) {
        this.favoriteVideos = favorites
    }

    getFavorites(): string[] | null {
        if (!this.favoriteVideos || (this.favoriteVideos.length === 0)) {
            return null
        }
        return this.favoriteVideos
    }

    removeFavorite(id: string, count: number) {
        if (!this.favoriteVideos || (this.favoriteVideos.length === 0)) {
            return
        }
        this.favoriteVideos.splice(this.favoriteVideos.indexOf(id), count)
    }

}

