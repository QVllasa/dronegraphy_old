import {IUser, User} from './user.model';
import {Deserializable} from "./deserialize.interface";

export interface IVideo {
    id: number;
    title: string;
    location: string;
    formats: string[];
    res: string;
    length: string;
    fps: number;
    camera: string;
    tags: string[];
    category: string[];
    downloads: number;
    views: number;
}

export class Video implements IVideo, Deserializable {

    public id: number;
    public title: string;
    public location: string;
    public formats: string[];
    public res: string;
    public length: string;
    public fps: number;
    public camera: string;
    public tags: string[];
    public category: string[];
    public downloads: number;
    public views: number;
    public thumbnail?: string;

    #sell: boolean;
    #onBanner: boolean;
    #itemPath: string;

    #creator: User;
    #favoriteBy: any;


    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }

    setLicense(bool: boolean) {
        this.#sell = bool;
    }

    getLicense(): boolean | null {
        return this.#sell
    }

    setItemPath(path: string) {
        this.#itemPath = path;
    }

    getItemPath(): string | null {
        return this.#itemPath;
    }

    setThumbnail(path) {
        this.thumbnail = path;
    }

    getThumbnail(): string | null {
        return this.thumbnail
    }

    setCreator(creator: User) {
        this.#creator = creator
    }

    getCreator(): User {
        return this.#creator
    }

    getDownloadsCount() {
        return
    }

}
