import { recommendationService } from "./../../../src/services/recommendationsService.js"
import { recommendationRepository } from "../../../src/repositories/recommendationRepository.js";
import * as scenarioFactory from "../../factories/scenarioFactory.js"
import * as recommendationFactory from "../../factories/recommendationFactory.js"
import { jest } from "@jest/globals"

beforeEach(async () => {
    await scenarioFactory.deleteAllData();
});

describe("GET recommendationService test suite", () => {

    it("test all get functions", async () => {

        jest.spyOn(recommendationRepository, "findAll").mockImplementationOnce((): any => { })
        jest.spyOn(recommendationRepository, "getAmountByScore").mockImplementationOnce((): any => { })
        jest.spyOn(recommendationRepository, "find").mockImplementationOnce((): any => { return true })

        await recommendationService.get()
        await recommendationService.getTop(1)
        await recommendationService.getById(1)

        expect(recommendationRepository.findAll).toBeCalled()
        expect(recommendationRepository.getAmountByScore).toBeCalled()
        expect(recommendationRepository.find).toBeCalled()
    })

    it("test getById with inexistent id", async () => {

        jest.spyOn(recommendationRepository, "find").mockImplementationOnce((): any => { })

        const response = recommendationService.getById(1)

        const error = {
            message: "",
            type: "not_found"
        }

        expect(response).rejects.toEqual(error)
    })

    it("test getRandom 70% chance, when does have a recommendation with a score greater than 10.", async () => {

        jest.spyOn(Math, "random").mockImplementationOnce((): any => { return 0.6 })
        jest.spyOn(recommendationRepository, "findAll").mockImplementationOnce((): any => {
            const array = recommendationFactory.generateNRecommendationsWithRandomScore(1, 11)
            return array;
        })

        const response = await recommendationService.getRandom()

        expect(response.score).toBeGreaterThan(10);
    })

    it("test getRandom 70% chance when does not have a recommendation with a score greater than 10", async () => {

        jest.spyOn(Math, "random").mockImplementationOnce((): any => { return 0.6 })
        jest.spyOn(recommendationRepository, "findAll")
            .mockReturnValue(null)
            .mockImplementationOnce((): any => {
                const array = recommendationFactory.generateNRecommendationsWithRandomScore(1)
                return array;
            })

        const response = await recommendationService.getRandom()

        expect(response.score).toBeLessThanOrEqual(10);
    })

    it("test getRandom 30% chance when does have a recommendation with a score less or equal to 10.", async () => {

        jest.spyOn(Math, "random").mockImplementationOnce((): any => { return 0.8 })
        jest.spyOn(recommendationRepository, "findAll").mockImplementationOnce((): any => {
            return recommendationFactory.generateNRecommendationsWithRandomScore(1)
        })

        const response = await recommendationService.getRandom()

        expect(response.score).toBeLessThanOrEqual(10);
    })

    it("test getRandom 30% chance when does not have a recommendation with a score less or equal than 10", async () => {

        jest.spyOn(Math, "random").mockImplementationOnce((): any => { return 0.8 })
        jest.spyOn(recommendationRepository, "findAll")
            .mockReturnValue(null)
            .mockImplementationOnce((): any => {
                return recommendationFactory.generateNRecommendationsWithRandomScore(1, 11)
            })

        const response = await recommendationService.getRandom()

        expect(response.score).toBeGreaterThan(10);
    })

    it("test getRandom without any recommendations it should return not found", async () => {

        jest.spyOn(recommendationRepository, "findAll")
            .mockImplementationOnce((): any => { return [""] })


        const error = {
            message: "",
            type: "not_found"
        }

        try {
            recommendationService.getRandom()
        } catch (err) {
            expect(err.data).toEqual(error)
        }
    })
})