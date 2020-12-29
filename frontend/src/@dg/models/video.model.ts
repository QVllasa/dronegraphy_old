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
    category: string[];
    downloads: number;
    views: number;
    creator?: User;
    thumbnail?: string;
    sell?: boolean;
    hls?: string;
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
    public category: string[];
    public downloads: number;
    public views: number;
    public thumbnail?: string;

    #sell: boolean;
    #published: boolean;
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

    getResolution() {
        return this.width + 'x' + this.height
    }

    published(): boolean {
        return this.#published;
    }

}
