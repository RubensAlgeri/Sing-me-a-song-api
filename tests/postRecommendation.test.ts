import supertest from "supertest";
import { prisma } from "../src/database.js";
import app from "./../src/app.js"
import * as scenarioFactory from "./factories/scenarioFactory.js"
import * as recommendationFactory from "./factories/recommendationFactory.js"

beforeEach(async() => {
    await scenarioFactory.deleteAllData();
  });

const agent = supertest(app);

describe("user tests", () => {
  it("should create recommendation", async () => {
    const recommendation = await recommendationFactory.generateRecommendation();

    const response = await agent.post("/recommendations").send(recommendation);

    const recommendationCreated = await prisma.recommendation.findFirst({
      where: {name: recommendation.name}
    });
    expect(response.status).toBe(201)
    expect(recommendationCreated.name).toBe(recommendation.name);
  });

  it("should not create a recommendation with a name already used", async () => {

    const recommendation = await scenarioFactory.createScenarioOneRecommendationWithZeroViews();

    const response = await agent.post("/recommendations").send(recommendation);

    const recommendationCreated = await prisma.recommendation.findMany({
      where: {name: recommendation.name}
    });

    expect(response.status).toBe(409)
    expect(recommendationCreated.length).toBe(1);
  });

  it("should increase the score of a recommendation by 1", async () => {

    const recommendation = await scenarioFactory.createScenarioOneRecommendationWithZeroViews();

    const response = await agent.post(`/recommendations/1/upvote`);

    const recommendationCreated = await prisma.recommendation.findUnique({
      where: {name: recommendation.name}
    });

    expect(response.status).toBe(200)
    expect(recommendationCreated.score).toBe(1);
  });

  it("should not increase the score of a recommendation that does not exist", async () => {

    const response = await agent.post(`/recommendations/1/upvote`);

    expect(response.status).toBe(404)
  });

  it("should decrease the score of a recommendation by 1", async () => {

    const recommendation = await scenarioFactory.createScenarioTwoRecommendationWithTenViews();

    const response = await agent.post(`/recommendations/1/downvote`);

    const recommendationCreated = await prisma.recommendation.findUnique({
      where: {name: recommendation.name}
    });

    expect(response.status).toBe(200)
    expect(recommendationCreated.score).toBe(9);
  });

  it("should not decrease the score of a recommendation that does not exist", async () => {

    const response = await agent.post(`/recommendations/1/downvote`);

    expect(response.status).toBe(404)
  });

  it("should delete the recommendation if its score is below -5", async () => {

    const recommendation = await scenarioFactory.createScenarioThreeRecommendationWithMinusFiveViews();

    const response = await agent.post(`/recommendations/1/downvote`);

    const recommendationCreated = await prisma.recommendation.findUnique({
      where: {name: recommendation.name}
    });

    expect(response.status).toBe(200)
    expect(recommendationCreated).toBeNull();
  });

  it("should receive the last ten recommendations", async () => {

    await scenarioFactory.createScenarioFourElevenRecommendationsWithRandomViews();

    const response = await agent.get(`/recommendations`);

    const recommendations = await prisma.recommendation.findMany();

    expect(response.body.length).toBe(10)
    expect(recommendations.length).toBe(11);
  });

  it("should receive the recommendation choosed by id", async () => {

    await scenarioFactory.createScenarioFourElevenRecommendationsWithRandomViews();
    let id = Math.floor(Math.random()*10+1);

    const response = await agent.get(`/recommendations/${id}`);

    const recommendationCreated = await prisma.recommendation.findUnique({where:{id}});

    expect(response.body.id).toBe(id)
    expect(recommendationCreated.id).toBe(id);
    expect(response.body).toStrictEqual(recommendationCreated)
  });

  it("should return 404 if the recommendation choosed by id does not exist", async () => {

    let id = Math.floor(Math.random()*10+1);

    const response = await agent.get(`/recommendations/${id}`);

    expect(response.status).toBe(404)
  });

  it("should receive the top 'X' scored recommendations where 'X' is sent by params", async () => {

    await scenarioFactory.createScenarioFourElevenRecommendationsWithRandomViews();
    let amount = Math.floor(Math.random()*10+1);

    const response = await agent.get(`/recommendations/top/${amount}`);

    const recommendationCreated = await prisma.recommendation.findMany(
      {
        orderBy:{score:'desc'},
        take:amount,
      });
    for(let i=0;i<amount-1;i++){
      expect(response.body[i].score).toBeGreaterThanOrEqual(response.body[i+1].score)
    }
    expect(response.body).toStrictEqual(recommendationCreated)
  });
});