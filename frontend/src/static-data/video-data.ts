import * as faker from 'faker/locale/en_US';


const videoData = () => {
  return {
    id: faker.random.uuid(),
    title: faker.name.title(),
    creator: faker.name.findName(),
    location: faker.address.city() + ', ' + faker.address.country(),
    poster: faker.image.image(),
    itemPath: faker.random.arrayElement(['https://bitdash-a.akamaihd.net/content/MI201109210084_1/m3u8s/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.m3u8']),
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
    sell: faker.random.boolean(),
    downloads: faker.random.number(),
    views: faker.random.number(),
    upload: faker.date.past(),
    profileBackground: faker.random.boolean(),
    chosen: faker.random.boolean()
  };
};

export const Videos = () => {
  const videos = [];
  for (let i = 0; i < 200; i++) {
    videos.push(videoData());
  }
  return videos;
};









