import { prisma } from "../../src/database.js";
import { faker } from "@faker-js/faker";

export async function generateRecommendation() {
  const recommendation = {
    name: faker.random.words(),
    youtubeLink: "https://www.youtube.com/watch?v=chwyjJbcs1Y"
  }
  return recommendation;
}


export async function createRecommendation(data) {
  const recommendation = await prisma.recommendation.create({data});
  return recommendation;
}