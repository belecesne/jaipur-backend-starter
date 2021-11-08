import fs from "fs"
import request from "supertest"
import app from "../app"
import lodash from "lodash"

// Prevent database service to write tests game to filesystem
jest.mock("fs")
afterEach(() => {
  jest.clearAllMocks()
})
// Prevent shuffle for tests
jest.mock("lodash")
lodash.shuffle.mockImplementation((array) => array)

describe("Game router", () => {
  test("should create a game", async () => {
    const expectedGame = {
      id: 1,
      name: "test",
      market: ["camel", "camel", "camel", "diamonds", "diamonds"],
      _deck: [
        "silver",
        "silver",
        "silver",
        "silver",
        "silver",
        "silver",
        "cloth",
        "cloth",
        "cloth",
        "cloth",
        "cloth",
        "cloth",
        "cloth",
        "cloth",
        "spice",
        "spice",
        "spice",
        "spice",
        "spice",
        "spice",
        "spice",
        "spice",
        "leather",
        "leather",
        "leather",
        "leather",
        "leather",
        "leather",
        "leather",
        "leather",
        "leather",
        "leather",
        "camel",
        "camel",
        "camel",
        "camel",
        "camel",
        "camel",
        "camel",
        "camel",
      ],
      _players: [
        {
          hand: ["diamonds", "diamonds", "diamonds", "diamonds", "gold"],
          camelsCount: 0,
          score: 0,
        },
        {
          hand: ["gold", "gold", "gold", "gold", "gold"],
          camelsCount: 0,
          score: 0,
        },
      ],
      currentPlayerIndex: 0,
      tokens: {
        diamonds: [7, 7, 5, 5, 5],
        gold: [6, 6, 5, 5, 5],
        silver: [5, 5, 5, 5, 5],
        cloth: [5, 3, 3, 2, 2, 1, 1],
        spice: [5, 3, 3, 2, 2, 1, 1],
        leather: [4, 3, 2, 1, 1, 1, 1, 1, 1],
      },
      _bonusTokens: {
        3: [2, 1, 2, 3, 1, 2, 3],
        4: [4, 6, 6, 4, 5, 5],
        5: [8, 10, 9, 8, 10],
      },
      isDone: false,
    }

    const response = await request(app).post("/games").send({ name: "test" })
    expect(response.statusCode).toBe(201)
    expect(response.body).toStrictEqual(expectedGame)
  })
})

describe("missing arguments", () => {
  test("should create a game", async () => {
    const response = await request(app).post("/games").send()
    expect(response.statusCode).toBe(400)
  })
})

describe("get all games", () => {
  test("should get all games", async () => {
    fs.readFileSync.mockImplementation(() => {
      return JSON.stringify([{ id: 1 }, { id: 2 }, { id: 3 }])
    })
    const response = await request(app).get("/games").send()
    expect(response.statusCode).toBe(201)
    expect(response.body).toStrictEqual([{ id: 1 }, { id: 2 }, { id: 3 }])
  })

  test("should get all games empty", async () => {
    fs.readFileSync.mockImplementation(() => {
      return JSON.stringify([])
    })
    const response = await request(app).get("/games").send()
    expect(response.statusCode).toBe(201)
    expect(response.body).toStrictEqual([])
  })
})

describe("get game by id", () => {
  test("should get one game by id", async () => {
    fs.readFileSync.mockImplementation(() => {
      return JSON.stringify([{ id: 1 }, { id: 2 }, { id: 3 }])
    })
    const response = await request(app).get("/games/1").send()
    expect(response.statusCode).toBe(201)
    expect(response.body).toStrictEqual({ id: 1 })
  })

  test("should get one game which didn't exist", async () => {
    fs.readFileSync.mockImplementation(() => {
      return JSON.stringify([{ id: 1 }, { id: 2 }, { id: 3 }])
    })
    const response = await request(app).get("/games/5").send()
    expect(response.statusCode).toBe(404)
    expect(response.body).toStrictEqual({})
  })

  test("should get one game from empty games", async () => {
    fs.readFileSync.mockImplementation(() => {
      return JSON.stringify([])
    })
    const response = await request(app).get("/games/5").send()
    expect(response.statusCode).toBe(404)
    expect(response.body).toStrictEqual({})
  })

  test("should get one game from empty gmes", async () => {
    fs.readFileSync.mockImplementation(() => {
      return JSON.stringify([{ id: 1 }, { id: 2 }, { id: 3 }])
    })
    const response = await request(app).get("/games/").send()
    expect(response.statusCode).toBe(201)
    expect(response.body).toStrictEqual([{ id: 1 }, { id: 2 }, { id: 3 }])
  })
})
