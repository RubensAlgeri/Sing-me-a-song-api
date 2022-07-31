import {recommendationService} from "./../../src/services/recommendationsService.js"
import {recommendationRepository} from "../../src/repositories/recommendationRepository.js";
import { CreateRecommendationData } from "./../../src/services/recommendationsService.js";
import * as scenarioFactory from "../factories/scenarioFactory.js"
import * as recommendationFactory from "../factories/recommendationFactory.js"

import {jest} from "@jest/globals"

beforeEach(async() => {
  await scenarioFactory.deleteAllData();
});

describe("recommendationService test suite", () => {

  it("insert a recommendation it should call create function 1 time", async () => {

    const recommendation = await recommendationFactory.generateRecommendation();

    jest.spyOn(recommendationRepository, "findByName").mockImplementationOnce(():any => { return null} ) 
    jest.spyOn(recommendationRepository, "create").mockImplementationOnce(():any => { return null} ) 

    await recommendationService.insert(recommendation)

    expect(recommendationRepository.findByName).toHaveBeenCalledTimes(1)
    expect(recommendationRepository.create).toHaveBeenCalledTimes(1)
  })

  it("insert a recommendation it should call create function", async () => {

    const recommendation = await recommendationFactory.generateRecommendation();

    jest.spyOn(recommendationRepository, "findByName").mockImplementationOnce(():any => { return {...recommendation,score:0}} ) 

    const response = recommendationService.insert(recommendation)

    const error = {
      message:"Recommendations names must be unique",
      type:"conflict"
    }

    expect(response).rejects.toEqual(error)
  })

  it("insert a used name recommendation it should return conflict error", async () => {

    const recommendation = await recommendationFactory.generateRecommendation();

    jest.spyOn(recommendationRepository, "findByName").mockImplementationOnce(():any => { return {...recommendation,score:0}} ) 

    const response = recommendationService.insert(recommendation)

    const error = {
      message:"Recommendations names must be unique",
      type:"conflict"
    }

    expect(response).rejects.toEqual(error)
  })

  it("increase the score of a registered recommendation", async () => {

    const recommendation = await scenarioFactory.createScenarioOneRecommendationWithZeroViews();

    jest.spyOn(recommendationRepository, "find").mockImplementationOnce(():any => { return {...recommendation,score:0}} ) 
    jest.spyOn(recommendationRepository, "updateScore").mockImplementationOnce(():any => { return null }) 

    await recommendationService.upvote(1)

    expect(recommendationRepository.find).toBeCalledTimes(1)
    expect(recommendationRepository.updateScore).toHaveBeenCalledTimes(1)
  })

  it("increase the score of a unregistered recommendation", async () => {

    jest.spyOn(recommendationRepository, "find").mockImplementationOnce(():any => { return null} ) 

    const response = recommendationService.upvote(1)
    
    const error = {
      message:"",
      type:"not_found"
    }

    expect(response).rejects.toEqual(error)
  })

  it("decrease the score of a registered recommendation", async () => {

    const recommendation = await scenarioFactory.createScenarioOneRecommendationWithZeroViews();

    jest.spyOn(recommendationRepository, "find").mockImplementationOnce(():any => { return {...recommendation,score:0}} ) 
    jest.spyOn(recommendationRepository, "updateScore").mockImplementationOnce(():any => { return {...recommendation,score:0} }) 
    jest.spyOn(recommendationRepository, "remove").mockImplementationOnce(():any => { return null }) 

    await recommendationService.downvote(1)

    expect(recommendationRepository.find).toBeCalled()
    expect(recommendationRepository.updateScore).toBeCalled()
    expect(recommendationRepository.remove).not.toBeCalled()
  })

  it("decrease the score of a unregistered recommendation", async () => {

    jest.spyOn(recommendationRepository, "find").mockImplementationOnce(():any => { return null} ) 

    const response = recommendationService.downvote(1)
    
    const error = {
      message:"",
      type:"not_found"
    }

    expect(response).rejects.toEqual(error)
  })

  it("decrease the score of a registered recommendation below -5 of score it should delete it", async () => {

    const recommendation = await scenarioFactory.createScenarioThreeRecommendationWithMinusFiveViews();

    jest.spyOn(recommendationRepository, "find").mockImplementationOnce(():any => { return recommendation} ) 
    jest.spyOn(recommendationRepository, "updateScore").mockImplementationOnce(():any => { return {...recommendation,score:-6} }) 
    jest.spyOn(recommendationRepository, "remove").mockImplementationOnce(():any => { return null }) 

    await recommendationService.downvote(1)

    expect(recommendationRepository.find).toBeCalled()
    expect(recommendationRepository.updateScore).toBeCalled()
    expect(recommendationRepository.remove).toBeCalled()
  })

  it("test all get functions", async () => {

    jest.spyOn(recommendationRepository, "findAll").mockImplementationOnce(():any => {}) 
    jest.spyOn(recommendationRepository, "getAmountByScore").mockImplementationOnce(():any => {}) 
    jest.spyOn(recommendationRepository, "find").mockImplementationOnce(():any => {return true}) 

    await recommendationService.get()
    await recommendationService.getTop(1)
    await recommendationService.getById(1)

    expect(recommendationRepository.findAll).toBeCalled()
    expect(recommendationRepository.getAmountByScore).toBeCalled()
    expect(recommendationRepository.find).toBeCalled()
  })

  it("test getById with inexistent id", async () => {

    jest.spyOn(recommendationRepository, "find").mockImplementationOnce(():any => {}) 

    const response = recommendationService.getById(1)

    const error = {
      message:"",
      type:"not_found"
    }

    expect(response).rejects.toEqual(error)
  })

  it("test getRandom 70% chance, when does have a recommendation with a score greater than 10.", async () => {

    jest.spyOn(Math, "random").mockImplementationOnce(():any => {return 0.6})
    jest.spyOn(recommendationRepository, "findAll").mockImplementationOnce(():any => {
      const array = recommendationFactory.generateNRecommendationsWithRandomScore(1,11)
      return array;
    })

    const response = await recommendationService.getRandom()

    expect(response.score).toBeGreaterThan(10);
  })

  it("test getRandom 70% chance when does not have a recommendation with a score greater than 10", async () => {

    jest.spyOn(Math, "random").mockImplementationOnce(():any => {return 0.6})
    jest.spyOn(recommendationRepository, "findAll")
    .mockReturnValue(null)
    .mockImplementationOnce(():any => {
      const array = recommendationFactory.generateNRecommendationsWithRandomScore(1)
      return array;
    })

    const response = await recommendationService.getRandom()

    expect(response.score).toBeLessThanOrEqual(10);
  })

  it("test getRandom 30% chance when does have a recommendation with a score less or equal to 10.", async () => {

    jest.spyOn(Math, "random").mockImplementationOnce(():any => {return 0.8})
    jest.spyOn(recommendationRepository, "findAll").mockImplementationOnce(():any => {
      return recommendationFactory.generateNRecommendationsWithRandomScore(1)
    })

    const response = await recommendationService.getRandom()

    expect(response.score).toBeLessThanOrEqual(10);
  })

  it("test getRandom 30% chance when does not have a recommendation with a score less or equal than 10", async () => {

    jest.spyOn(Math, "random").mockImplementationOnce(():any => {return 0.8})
    jest.spyOn(recommendationRepository, "findAll")
    .mockReturnValue(null)
    .mockImplementationOnce(():any => {
      return recommendationFactory.generateNRecommendationsWithRandomScore(1,11)
    })

    const response = await recommendationService.getRandom()

    expect(response.score).toBeGreaterThan(10);
  })

  it("test getRandom without any recommendations it should return not found", async () => {

    jest.spyOn(recommendationRepository, "findAll")
    .mockImplementationOnce(():any => {return [""]})

    
    const error = {
      message:"",
      type:"not_found"
    }
    
    try {
      recommendationService.getRandom()
    } catch (err) {
      expect(err.data).toEqual(error)
    }
  })
})