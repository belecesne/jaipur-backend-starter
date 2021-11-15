/* eslint-disable no-import-assign */
import fs from "fs"
import request from "supertest"
import app from "../app"
import lodash from "lodash"
import * as gameService from "../services/gameService"

jest.mock("fs")
afterEach(() => {
  jest.clearAllMocks()
})

// Prevent database service to write tests game to filesystem
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

describe("delete game by id", () => {
  test("should delete one game by id", async () => {
    fs.readFileSync.mockImplementation(() => {
      return JSON.stringify([{ id: 1 }, { id: 2 }, { id: 3 }])
    })
    const response = await request(app).delete("/games/2").send()
    expect(response.statusCode).toBe(200)
    expect(response.body).toStrictEqual("Game 2 deleted")
  })

  test("should delete one game by id which didn't exist", async () => {
    fs.readFileSync.mockImplementation(() => {
      return JSON.stringify([{ id: 1 }, { id: 2 }, { id: 3 }])
    })
    const response = await request(app).delete("/games/5").send()
    expect(response.statusCode).toBe(404)
    expect(response.body).toStrictEqual("Game 5 does not exist")
  })

  test("should delete one game by id from empty games", async () => {
    fs.readFileSync.mockImplementation(() => {
      return JSON.stringify([])
    })
    const response = await request(app).delete("/games/5").send()
    expect(response.statusCode).toBe(404)
    expect(response.body).toStrictEqual("Game 5 does not exist")
  })

  test("missing argument so delete all game", async () => {
    fs.readFileSync.mockImplementation(() => {
      return JSON.stringify([{ id: 1 }, { id: 2 }, { id: 3 }])
    })
    const response = await request(app).delete("/games/").send()
    expect(response.statusCode).toBe(200)
    expect(response.body).toStrictEqual("All game deleted")
  })
})

describe("delete all game", () => {
  test("should delete all game", async () => {
    fs.readFileSync.mockImplementation(() => {
      return JSON.stringify([{ id: 1 }, { id: 2 }, { id: 3 }])
    })
    const response = await request(app).delete("/games").send()
    expect(response.statusCode).toBe(200)
    expect(response.body).toStrictEqual("All game deleted")
  })

  test("should delete all game from empty games", async () => {
    fs.readFileSync.mockImplementation(() => {
      return JSON.stringify([])
    })
    const response = await request(app).delete("/games").send()
    expect(response.statusCode).toBe(200)
    expect(response.body).toStrictEqual("All game deleted")
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
    expect(response.body).toStrictEqual("Game 5 does not exist")
  })

  test("should get one game from empty games", async () => {
    fs.readFileSync.mockImplementation(() => {
      return JSON.stringify([])
    })
    const response = await request(app).get("/games/5").send()
    expect(response.statusCode).toBe(404)
    expect(response.body).toStrictEqual("Game 5 does not exist")
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

describe("sell cards", () => {
  test("should sell cards missing playerindex", async () => {
    fs.readFileSync.mockImplementation(() => {
      return JSON.stringify([{ id: 1 }, { id: 2 }, { id: 3 }])
    })
    const response = await request(app)
      .put("/games/1/sell")
      .set("playerIndex", "foo")
      .send({
        count: 3,
        good: "silver",
      })
    expect(response.statusCode).toBe(400)
    expect(response.body).toStrictEqual("Missing playerindex header")
  })
  test("should sell cards missing sell parameter", async () => {
    fs.readFileSync.mockImplementation(() => {
      return JSON.stringify([
        { id: 1, currentPlayerIndex: 1 },
        { id: 2, currentPlayerIndex: 1 },
        { id: 3, currentPlayerIndex: 1 },
      ])
    })
    const response = await request(app)
      .put("/games/1/sell")
      .set("playerIndex", 1)
      .send({ count: 3 })
    expect(response.statusCode).toBe(400)
    expect(response.body).toStrictEqual("Missing sell parameter")
  })
  test("should sell cards missing count parameter", async () => {
    fs.readFileSync.mockImplementation(() => {
      return JSON.stringify([
        { id: 1, currentPlayerIndex: 1 },
        { id: 2, currentPlayerIndex: 1 },
        { id: 3, currentPlayerIndex: 1 },
      ])
    })
    const response = await request(app)
      .put("/games/1/sell")
      .set("playerIndex", 1)
      .send({ good: "silver" })
    expect(response.statusCode).toBe(400)
    expect(response.body).toStrictEqual("Missing count parameter")
  })
  test("should sell cards bad id", async () => {
    fs.readFileSync.mockImplementation(() => {
      return JSON.stringify([
        { id: 1, currentPlayerIndex: 1 },
        { id: 2, currentPlayerIndex: 1 },
        { id: 3, currentPlayerIndex: 1 },
      ])
    })
    const response = await request(app)
      .put("/games/0/sell")
      .set("playerIndex", 1)
      .send({ good: "silver", count: 3 })
    expect(response.statusCode).toBe(400)
    expect(response.body).toStrictEqual("Game 0 not found")
  })
  test("should sell cards bad playerindex", async () => {
    fs.readFileSync.mockImplementation(() => {
      return JSON.stringify([
        { id: 1, currentPlayerIndex: 1 },
        { id: 2, currentPlayerIndex: 1 },
        { id: 3, currentPlayerIndex: 1 },
      ])
    })
    const response = await request(app)
      .put("/games/1/sell")
      .set("playerIndex", 0)
      .send({ good: "silver", count: 3 })
    expect(response.statusCode).toBe(400)
  })
  test("should sell cards everything ok", async () => {
    fs.readFileSync.mockImplementation(() => {
      return JSON.stringify([
        {
          id: 1,
          currentPlayerIndex: 0,
          _players: [
            {
              hand: ["diamonds", "diamonds", "diamonds", "diamonds", "gold"],
              camelsCount: 0,
              score: 0,
            },
            {
              hand: [],
              camelsCount: 0,
              score: 0,
            },
          ],
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
        },
        { id: 2, currentPlayerIndex: 1 },
        { id: 3, currentPlayerIndex: 1 },
      ])
    })
    const response = await request(app)
      .put("/games/1/sell")
      .set("playerIndex", "0")
      .send({ good: "diamonds", count: 3 })
    expect(response.statusCode).toBe(200)
  })
})

describe("Test take-good route", () => {
  function defaultGames() {
    return [{ id: 1 ,
      isDone: false,}]
  }

  function defaultMockFS() {
    fs.readFileSync.mockImplementation(() => JSON.stringify(defaultGames()))
  }

  function defaultMockTakeGood() {
    const mock = jest.fn().mockReturnValueOnce(defaultGames()[0])
    gameService.takeGood = mock
    return mock
  }

  async function sendReq(game = 1, player = 9, good = "diamonds") {
    return await request(app)
      .put("/games/" + game + "/take-good")
      .set("playerIndex", player.toString())
      .send(good === null ? {} : { good: good })
  }

  test("Normal use", async () => {
    defaultMockFS()
    const mock = defaultMockTakeGood()

    const resp = await sendReq()

    expect(resp.statusCode).toBe(200)
    expect(resp.body).toStrictEqual(defaultGames()[0])

    expect(mock.mock.calls.length).toBe(1)
    const call = mock.mock.calls[0]
    expect(call[0]).toStrictEqual(defaultGames()[0])
    expect(call[1]).toBe(9)
    expect(call[2]).toStrictEqual("diamonds")
  })

  test("Game id not a number", async () => {
    defaultMockFS()
    defaultMockTakeGood()

    const resp = await sendReq("foo", 9)
    expect(resp.statusCode).toBe(400)
  })

  test("Player id not a number", async () => {
    defaultMockFS()
    defaultMockTakeGood()

    const resp = await sendReq(1, "foo")
    expect(resp.statusCode).toBe(400)
  })

  test("No good provided", async () => {
    defaultMockFS()
    defaultMockTakeGood()

    const resp = await sendReq(1, 9, null)
    expect(resp.statusCode).toBe(400)
  })

  test("Game not found", async () => {
    defaultMockFS()
    defaultMockTakeGood()

    const resp = await sendReq(2)
    expect(resp.statusCode).toBe(404)
  })

  test("Error from takeGood", async () => {
    defaultMockFS()
    const mock = jest.fn().mockImplementation(() => {
      throw new Error()
    })
    gameService.takeGood = mock

    const resp = await sendReq()
    expect(resp.statusCode).toBe(400)
  })
})

describe("Test exchange route", () => {
  function defaultGames() {
    return [{ id: 1 ,
      isDone: false}]
  }

  function defaultMockFS() {
    fs.readFileSync.mockImplementation(() => JSON.stringify(defaultGames()))
  }

  function defaultMockExchange() {
    const mock = jest.fn().mockReturnValueOnce(defaultGames()[0])
    gameService.exchange = mock
    return mock
  }

  function defaultBody() {
    return { take: ["diamonds", "camel"], give: ["silver", "cloth"] }
  }

  async function sendReq(game = 1, player = 9, body = defaultBody()) {
    return await request(app)
      .put("/games/" + game + "/exchange")
      .set("playerIndex", player.toString())
      .send(body === null ? {} : body)
  }

  test("Normal use", async () => {
    defaultMockFS()
    const mock = defaultMockExchange()

    const resp = await sendReq()

    expect(resp.statusCode).toBe(200)
    expect(resp.body).toStrictEqual(defaultGames()[0])

    expect(mock.mock.calls.length).toBe(1)
    const call = mock.mock.calls[0]
    expect(call[0]).toStrictEqual(defaultGames()[0])
    expect(call[1]).toBe(9)
    expect(call[2]).toStrictEqual(defaultBody().take)
    expect(call[3]).toStrictEqual(defaultBody().give)
  })

  test("Game id not a number", async () => {
    defaultMockFS()
    defaultMockExchange()

    const resp = await sendReq("foo")
    expect(resp.statusCode).toBe(400)
  })

  test("Player id is not a number", async () => {
    defaultMockFS()
    defaultMockExchange()

    const resp = await sendReq(1, "foo")
    expect(resp.statusCode).toBe(400)
  })

  test("No body provided", async () => {
    defaultMockFS()
    defaultMockExchange()

    const resp = await sendReq(1, 9, null)
    expect(resp.statusCode).toBe(400)
  })

  test("No taken data", async () => {
    defaultMockFS()
    defaultMockExchange()

    const body = defaultBody()
    delete body.take
    const resp = await sendReq(1, 9, body)
    expect(resp.statusCode).toBe(400)
  })

  test("No given data", async () => {
    defaultMockFS()
    defaultMockExchange()

    const body = defaultBody()
    delete body.give
    const resp = await sendReq(1, 9, body)
    expect(resp.statusCode).toBe(400)
  })

  test("Game not found", async () => {
    defaultMockFS()
    defaultMockExchange()

    const resp = await sendReq(2)
    expect(resp.statusCode).toBe(404)
  })

  test("Error from excange", async () => {
    defaultMockFS()
    const mock = jest.fn().mockImplementation(() => {
      throw new Error()
    })
    gameService.exchange = mock

    const resp = await sendReq()
    expect(resp.statusCode).toBe(400)
  })
})

describe("Test take-camels route", () => {
  function defaultGames() {
    return [{ id: 1 }]
  }

  function defaultMockFS() {
    fs.readFileSync.mockImplementation(() => JSON.stringify(defaultGames()))
  }

  function defaultMockTakeCamels() {
    const mock = jest.fn().mockReturnValueOnce(defaultGames()[0])
    gameService.takeAllCamels = mock
    return mock
  }

  async function sendReq(game = 1, player = 9) {
    return await request(app)
      .put("/games/" + game + "/take-camels")
      .set("playerIndex", player.toString())
      .send()
  }

  test("Normal use", async () => {
    defaultMockFS()
    const mock = defaultMockTakeCamels()

    const resp = await sendReq()

    expect(resp.statusCode).toBe(200)
    expect(resp.body).toStrictEqual(defaultGames()[0])

    expect(mock.mock.calls.length).toBe(1)
    const call = mock.mock.calls[0]
    expect(call[0]).toStrictEqual(defaultGames()[0])
    expect(call[1]).toBe(9)
  })

  test("Game id not a number", async () => {
    defaultMockFS()
    defaultMockTakeCamels()

    const resp = await sendReq("foo")
    expect(resp.statusCode).toBe(400)
  })

  test("Player id not a number", async () => {
    defaultMockFS()
    defaultMockTakeCamels()

    const resp = await sendReq(1, "foo")
    expect(resp.statusCode).toBe(400)
  })

  test("Game not found", async () => {
    defaultMockFS()
    defaultMockTakeCamels()

    const resp = await sendReq(2)
    expect(resp.statusCode).toBe(404)
  })

  test("Error from takeAllCamels", async () => {
    defaultMockFS()
    const mock = jest.fn().mockImplementation(() => {
      throw new Error()
    })
    gameService.takeAllCamels = mock

    const resp = await sendReq()
    expect(resp.statusCode).toBe(400)
  })
})
