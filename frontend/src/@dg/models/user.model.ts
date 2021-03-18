import {IClaims} from './JWTTokenDecoded.interface';
import {Deserializable} from './deserialize.interface';
import {environment} from '../../environments/environment';
import {IVideo, Video} from './video.model';

export interface IUser {
    uid: string;
    firstName: string;
    lastName: string;
    email?: string;
    favoriteVideos?: string[];
}

export class User implements IUser, Deserializable {

    uid: string;
    firstName: string;
    lastName: string;
    email?: string;
    favoriteVideos?: string[];
    profileImage?: string;

    #role: string = null;
    #claims: IClaims = null;

    deserialize(input: IUser): this {
        Object.assign(this, input);
        return this;
    }

    getFullName() {
        return this.firstName + ' ' + this.lastName;
    }


    setProfileImage(id) {
        this.profileImage = id;
    }


    getProfileImage() {
        return environment.apiUrl + '/photos/' + this.profileImage;
    }

    setClaims(claims: IClaims) {
        this.#claims = claims;
    }

    get role(): string | null {
        if (this.#claims) {
            this.#role = this.#claims['role'];
        }
        return this.#role ? this.#role : null;
    }

    setFavorites(favorites: string[]) {
        this.favoriteVideos = favorites;
    }

    getFavorites(): string[] | null {
        if (!this.favoriteVideos || (this.favoriteVideos.length === 0)) {
            return null;
        }
        return this.favoriteVideos;
    }

    removeFavorite(id: string, count: number) {
        if (!this.favoriteVideos || (this.favoriteVideos.length === 0)) {
            return;
        }
        this.favoriteVideos.splice(this.favoriteVideos.indexOf(id), count);
    }

}

export class Creator extends User {
    footage: Video[];
    videoCount: number;
    key: number;
    slogan?: string;

    // imgPath?: string;
    // activated?: boolean;
    // [videos: number]: Video[];
    // orders?: Order[];
    // favorites?: Video[];
    // saved?: IUser[];
    // job?: any;

    getFootage(): Video[] {
        return this.footage;
    }

    setFootage(videos: Video[]) {
        this.footage = videos;
    }


}
