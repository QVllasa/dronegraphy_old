import {Creator} from './user.model';
import {Deserializable} from './deserialize.interface';
import {environment} from '../../environments/environment';

interface FileInfo {
    size: number;
    contentType: string;
    name: string;

}

export interface IVideo {
    id: string;
    title: string;
    location: string;
    formats: string[];
    height: number;
    width: number;
    length: number;
    fps: number;
    camera: string;
    tags: string[];
    categories: number[];
    downloads: number;
    converted: boolean;
    views: number;
    storageRef: string;
    storageContent: FileInfo[];
    creator?: Creator;
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
    public storageRef: string;
    public storageContent: FileInfo[];
    public tags: string[];
    public categories: number[];
    public downloads: number;
    public views: number;
    public createdAt: Date;
    public updatedAt: Date;
    public thumbnail?: string;
    public published: boolean;
    public converted: boolean;

    #sell: boolean;
    #onBanner: boolean;
    #creator: Creator;
    #favoriteBy: any;


    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }

    setLicense(bool: boolean) {
        this.#sell = bool;
    }

    getLicense(): boolean | null {
        return this.#sell ? this.#sell : null;
    }

    getHLS(): string | null {
        // return this.#hls;
        return environment.apiUrl + '/' + this.storageRef + '/hls/playlist.m3u8';
    }

    setThumbnail(fileName) {
        this.thumbnail = fileName;
    }

    getThumbnail(): string | null {
        return this.thumbnail ? 'http://localhost:8080/img/' + this.thumbnail : null;
    }

    setCreator(creator: Creator) {
        this.#creator = creator;
    }

    getCreator(): Creator {
        return this.#creator;
    }

    getDownloadsCount() {
        return;
    }

    getResolution() {
        return this.width + 'x' + this.height;
    }


}
