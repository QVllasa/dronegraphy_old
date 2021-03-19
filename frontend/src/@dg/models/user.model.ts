import {IClaims} from './JWTTokenDecoded.interface';
import {Deserializable} from './deserialize.interface';
import {environment} from '../../environments/environment';
import {Video} from './video.model';

export interface IUser {
    uid: string;
    firstName: string;
    lastName: string;
    email?: string;
    createdAt: string;
    updatedAt: string;
}

export class Member implements IUser, Deserializable {
    uid: string;
    firstName: string;
    lastName: string;
    email?: string;
    createdAt: string;
    updatedAt: string;
    favoriteVideos?: string[];


    role: string = null;
    claims: IClaims = null;

    deserialize(input: IUser): this {
        Object.assign(this, input);
        return this;
    }

    setClaims(claims: IClaims) {
        this.claims = claims;
    }

    getRole(): string | null {
        if (this.claims) {
            this.role = this.claims['role'];
        }
        return this.role ? this.role : null;
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

export class Creator implements IUser, Deserializable {
    uid: string;
    firstName: string;
    lastName: string;
    email?: string;
    createdAt: string;
    updatedAt: string;
    profileImage?: string;
    footage: Video[];
    videoCount: number;
    key: number;
    slogan?: string;
    location?: string;

    // imgPath?: string;
    // activated?: boolean;
    // [videos: number]: Video[];
    // orders?: Order[];
    // favorites?: Video[];
    // saved?: IUser[];
    // job?: any;


    #role: string = null;
    #claims: IClaims = null;

    deserialize(input: IUser): this {
        Object.assign(this, input);
        return this;
    }

    getFullName() {
        return this.firstName + ' ' + this.lastName;
    }

    getFootage(): Video[] {
        return this.footage;
    }

    setFootage(videos: Video[]) {
        this.footage = videos;
    }

    getSlogan() {
        return this.slogan ? this.slogan : 'Nothing to show';
    }

    getLocation() {
        return this.location ? this.location : 'Nothing to show';
    }

    getProfileImage() {
        return environment.apiUrl + '/photos/' + this.profileImage;
    }

    setProfileImage(id) {
        this.profileImage = id;
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


}
