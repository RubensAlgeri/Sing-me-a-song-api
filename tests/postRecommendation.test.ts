import supertest from "supertest";
import { prisma } from "../src/database.js";
import app from "./../src/app.js"
import * as scenarioFactory from "./factories/scenarioFactory.js"

beforeEach(async() => {
    await scenarioFactory.deleteAllData();
  });

const agent = supertest(app);

describe("user tests", () => {
  it("should create recommendation", async () => {
    const recommendation = {
      name: "Falamansa - Xote dos Milagres",
      youtubeLink: "https://www.youtube.com/watch?v=chwyjJbcs1Y"
    }

    const response = await agent.post("/recommendations").send(recommendation);

    const recommendationCreated = await prisma.recommendation.findFirst({
      where: {name: recommendation.name}
    });
    expect(response.status).toBe(201)
    expect(recommendationCreated.name).toBe(recommendation.name);
  });

  it("should not create a recommendation with a name already used", async () => {

    const recommendation = await scenarioFactory.createScenarioOneRecommendation();

    const response = await agent.post("/recommendations").send(recommendation);

    const recommendationCreated = await prisma.recommendation.findMany({
      where: {name: recommendation.name}
    });

    expect(response.status).toBe(409)
    expect(recommendationCreated.length).toBe(1);
  });
});