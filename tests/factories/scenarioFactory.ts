import { prisma } from "./../../src/database.js";
import * as recommendationFactory from "./recommendationFactory.js";


export async function createScenarioOneRecommendationWithZeroViews() {
  const data = await recommendationFactory.generateRecommendation()
  await recommendationFactory.createRecommendation(data);

  return data
}

export async function createScenarioTwoRecommendationWithTenViews() {
  const data = await recommendationFactory.generateRecommendation()
  const newData = {...data, score:10}
  await recommendationFactory.createRecommendation(newData);

  return data
}

export async function createScenarioThreeRecommendationWithMinusFiveViews() {
  const data = await recommendationFactory.generateRecommendation()
  const newData = {...data, score:-5}
  await recommendationFactory.createRecommendation(newData);

  return data
}

export async function createScenarioFourElevenRecommendationsWithRandomViews() {
  const data = await recommendationFactory.generateNRecommendationsWithRandomScore(11)
  await recommendationFactory.createRecommendation(data);
}

export async function deleteAllData() {
  await prisma.$transaction([
    prisma.$executeRaw`TRUNCATE TABLE recommendations RESTART IDENTITY`,
  ]);
}