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

export class User implements IUser, Deserializable {
    uid: string;
    firstName: string;
    lastName: string;
    email?: string;
    createdAt: string;
    updatedAt: string;
    favoriteVideos?: string[];
    profileImage?: string;
    footage: Video[];
    videoCount: number;
    key: number;
    slogan?: string;
    location?: string;


    #role: string = null;
    #claims: IClaims = null;

    deserialize(input: IUser): this {
        Object.assign(this, input);
        return this;
    }

    getFullName() {
        return this.firstName + ' ' + this.lastName;
    }

    setClaims(claims: IClaims) {
        this.#claims = claims;
    }

    getRole(): string | null {
        if (this.#claims) {
            this.#role = this.#claims['role'];
        }
        return this.#role ? this.#role : null;
    }

    setFavorite(id: string) {
        if (!this.favoriteVideos || (this.favoriteVideos.length === 0)) {
            this.favoriteVideos = [];
            this.favoriteVideos.push(id);
        } else {
            this.favoriteVideos.push(id);
        }
    }

    getFavorites(): string[] {
        if (!this.favoriteVideos || (this.favoriteVideos.length === 0)) {
            return [];
        }
        return this.favoriteVideos;
    }

    removeFavorite(id: string, count: number) {
        if (!this.favoriteVideos || (this.favoriteVideos.length === 0)) {
            return;
        }
        this.favoriteVideos.splice(this.favoriteVideos.indexOf(id), count);
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
        return environment.apiUrl + '/profileImages/' + this.profileImage;
    }

    setProfileImage(id) {
        this.profileImage = id;
    }

}


