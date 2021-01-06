import {User} from './user.model';
import {Deserializable} from "./deserialize.interface";

export interface IVideo {
    id: string;
    title: string;
    location: string;
    formats: string[];
    height: number,
    width: number,
    length: number;
    fps: number;
    camera: string;
    tags: string[];
    categories: string[];
    downloads: number;
    views: number;
    creator?: User;
    thumbnail?: string;
    sell?: boolean;
    hls?: string;
    createdAt: Date;
    updatedAt: Date;
    published: boolean;
}

export class Video implements IVideo, Deserializable {

    public id: string;
    public title: string;
    public location: string;
    public formats: string[];
    public height: number;
    public width: number;
    public length: number;
    public fps: number;
    public camera: string;
    public tags: string[];
    public categories: string[];
    public downloads: number;
    public views: number;
    public createdAt: Date;
    public updatedAt: Date;
    public thumbnail?: string;
    public published: boolean;

    #sell: boolean;
    #onBanner: boolean;
    #hls: string;
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
        return this.#sell ? this.#sell : null

    }

    setItemPath(path: string) {
        this.#hls = path;
    }

    getItemPath(): string | null {
        return this.#hls;
    }

    setThumbnail(fileName) {
        this.thumbnail = fileName;
    }

    getThumbnail(): string | null {
        return this.thumbnail ? "http://localhost:8080/img/"+this.thumbnail : null;
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

    getResolution() {
        return this.width + 'x' + this.height
    }





}
