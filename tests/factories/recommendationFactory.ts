import { prisma } from "../../src/database.js";
import { faker } from "@faker-js/faker";

export async function generateRecommendation() {
  const recommendation = {
    name: faker.random.words(),
    youtubeLink: `https://www.youtube.com/watch?v=${faker.random.alphaNumeric(11)}`,
  }
  return recommendation;
}

export async function generateNRecommendationsWithRandomScore(number:number, above?:number) {
  let recommendations = [];
  for(let i=0;i<number;i++){
    recommendations.push({
      name: faker.random.words(),
      youtubeLink: `https://www.youtube.com/watch?v=${faker.random.alphaNumeric(11)}`,
      score:Math.floor(Math.random()*15+(above??-5))
    })
  }
  return recommendations;
}


export async function createRecommendation(data) {
  const recommendation = await prisma.recommendation.createMany({data});
  return recommendation;
}