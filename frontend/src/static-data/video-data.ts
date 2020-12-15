import * as faker from 'faker/locale/en_US';
import {IVideo, Video} from "../@dg/models/video.model";
import {User} from "../@dg/models/user.model";
import {userData} from "./user-data";


const videoData = (): IVideo => {
    return {
        id: faker.random.uuid(),
        title: faker.name.title(),
        location: faker.address.city() + ', ' + faker.address.country(),
        formats: ['4K', 'UHD', 'mp4'],
        res: '1920x1080',
        length: faker.random.number({
            'min': 0.1,
            'max': 0.9
        }).toString(),
        fps: 24,
        camera: 'DJI Mavic Pro',
        tags: ['Forest', 'Sea', 'Wildlife'],
        category: [''],
        downloads: faker.random.number(),
        views: faker.random.number(),
    };
};

export const Videos = (amount): Video[] => {
    const videos = [];
    for (let i = 0; i < amount; i++) {
        const video = new Video().deserialize(videoData())
        video.setLicense(faker.random.boolean())
        video.setItemPath(faker.random.arrayElement(['https://bitdash-a.akamaihd.net/content/MI201109210084_1/m3u8s/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.m3u8']))
        video.setThumbnail(faker.image.image())
        video.setCreator(new User().deserialize(userData()))
        videos.push(video);
    }
    return videos;
};









