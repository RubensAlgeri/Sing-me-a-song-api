import { prisma } from "./../../src/database.js";
import * as recommendationFactory from "./recommendationFactory.js";


export async function createScenarioOneRecommendation() {
  const data = await recommendationFactory.generateRecommendation()
  await recommendationFactory.createRecommendation(data);

  return data
}

export async function deleteAllData() {
  await prisma.$transaction([
    prisma.$executeRaw`TRUNCATE TABLE recommendations RESTART IDENTITY`,
  ]);
}