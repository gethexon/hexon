import faker from "faker";
export function genArticle() {
  return {
    title: faker.lorem.sentence(10),
    brief: faker.lorem.sentence(100),
    tags: new Array(faker.datatype.number(10))
      .fill(0)
      .map((i) => faker.lorem.word()),
    date: faker.datatype.datetime().toString(),
    slug: faker.lorem.sentence(10),
  };
}
export function genArticles(count) {
  return new Array(count).fill(0).map((i) => genArticle());
}
