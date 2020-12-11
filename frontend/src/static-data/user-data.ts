import * as faker from 'faker/locale/en_US';


export const userData = () => {
  return {
    uid: faker.random.uuid(),
    email: faker.internet.email(),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    // country: faker.address.country(),
    // role: faker.random.arrayElement(['pilot', 'standard']),
    // imgPath: faker.image.avatar()
  };
};

// export const Users = () => {
//   const users = [];
//
//   for (let i = 0; i < 2; i++) {
//     if (userData().role === 'standard'){
//       users.push(userData());
//     }
//   }
//   return users;
// };
//
// export const Pilots = () => {
//   const pilots = [];
//   for (let i = 0; i < 50; i++) {
//     if (userData().role !== 'standard'){
//       pilots.push(userData());
//     }
//   }
//   return pilots;
// };
//








