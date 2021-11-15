import * as gameService from "./gameService"

describe("Game service", () => {
  test("should init a deck", () => {
    const defaultDeck = gameService.initDeck()
    expect(defaultDeck.length).toBe(52)
    expect(defaultDeck.filter((card) => card === "diamonds").length).toBe(6)
    // etc
  })

  test("should draw cards", () => {
    const deck = ["camel", "diamonds", "gold"]
    const drawedCard = gameService.drawCards(deck, 1)
    expect(deck.length).toBe(2)
    expect(drawedCard).toStrictEqual(["camel"])
  })

  test("draw Cards but no cards", () => {
    const deck = []
    const drawedCard = gameService.drawCards(deck, 1)
    expect(deck.length).toBe(0)
    expect(drawedCard).toStrictEqual([])
  })

  test("draw default Cards", () => {
    const deck = []
    const drawedCard = gameService.drawCards(deck)
    expect(deck.length).toBe(0)
    expect(drawedCard).toStrictEqual([])
  })

  test("should put camels from hand to herd", () => {
    const game = {
      _players: [
        { hand: ["camel", "gold"], camelsCount: 0 },
        { hand: ["gold", "gold"], camelsCount: 0 },
      ],
    }
    gameService.putCamelsFromHandToHerd(game)
    expect(game._players[0].hand.length).toBe(1)
    expect(game._players[0].hand).toStrictEqual(["gold"])
    expect(game._players[0].camelsCount).toBe(1)

    expect(game._players[1].hand.length).toBe(2)
    expect(game._players[1].hand).toStrictEqual(["gold", "gold"])
    expect(game._players[1].camelsCount).toBe(0)
  })
})

describe("Sell cards", () => {
  test("should sell cards but bad player index", () => {
    const game = {
      id: 1,
      name: "test",
      currentPlayerIndex: 0,
    }
    expect(() => gameService.sellCards(game, 1, "gold", 2)).toThrow()
  })
  test("should sell cards but bad count", () => {
    const game = {
      id: 1,
      name: "test",
      currentPlayerIndex: 0,
    }
    expect(() => gameService.sellCards(game, 0, "gold", -1)).toThrow()
  })
  test("should sell cards but not enough good", () => {
    const game = {
      id: 1,
      name: "test",
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
    }
    expect(() => gameService.sellCards(game, 0, "gold", 4)).toThrow()
  })
  test("should sell cards all good", () => {
    const game = {
      id: 1,
      name: "test",
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
      currentPlayerIndex: 1,
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
    }
    const gameReturned = gameService.sellCards(game, 1, "gold", 3)
    expect(gameReturned).toStrictEqual({
      id: 1,
      name: "test",
      _players: [
        {
          hand: ["diamonds", "diamonds", "diamonds", "diamonds", "gold"],
          camelsCount: 0,
          score: 0,
        },
        {
          hand: ["gold", "gold"],
          camelsCount: 0,
          score: 18,
        },
      ],
      currentPlayerIndex: 1,
      tokens: {
        diamonds: [7, 7, 5, 5, 5],
        gold: [6, 6],
        silver: [5, 5, 5, 5, 5],
        cloth: [5, 3, 3, 2, 2, 1, 1],
        spice: [5, 3, 3, 2, 2, 1, 1],
        leather: [4, 3, 2, 1, 1, 1, 1, 1, 1],
      },
      _bonusTokens: {
        3: [2, 1, 2, 3, 1, 2],
        4: [4, 6, 6, 4, 5, 5],
        5: [8, 10, 9, 8, 10],
      },
    })
  })
  test("should sell cards all good but no bonus token", () => {
    const game = {
      id: 1,
      name: "test",
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
    }
    const gameReturned = gameService.sellCards(game, 0, "gold", 1)
    expect(gameReturned).toStrictEqual({
      id: 1,
      name: "test",
      _players: [
        {
          hand: ["diamonds", "diamonds", "diamonds", "diamonds"],
          camelsCount: 0,
          score: 5,
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
        gold: [6, 6, 5, 5],
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
    })
  })
  test("should sell cards all good but no enoguh token", () => {
    const game = {
      id: 1,
      name: "test",
      _players: [
        {
          hand: ["diamonds", "diamonds", "diamonds", "diamonds", "gold"],
          camelsCount: 0,
          score: 0,
        },
        {
          hand: ["gold", "gold", "gold", "gold", "gold", "gold", "gold"],
          camelsCount: 0,
          score: 0,
        },
      ],
      currentPlayerIndex: 1,
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
    }
    const gameReturned = gameService.sellCards(game, 1, "gold", 7)
    expect(gameReturned).toStrictEqual({
      id: 1,
      name: "test",
      _players: [
        {
          hand: ["diamonds", "diamonds", "diamonds", "diamonds", "gold"],
          camelsCount: 0,
          score: 0,
        },
        {
          hand: [],
          camelsCount: 0,
          score: 37,
        },
      ],
      currentPlayerIndex: 1,
      tokens: {
        diamonds: [7, 7, 5, 5, 5],
        gold: [],
        silver: [5, 5, 5, 5, 5],
        cloth: [5, 3, 3, 2, 2, 1, 1],
        spice: [5, 3, 3, 2, 2, 1, 1],
        leather: [4, 3, 2, 1, 1, 1, 1, 1, 1],
      },
      _bonusTokens: {
        3: [2, 1, 2, 3, 1, 2, 3],
        4: [4, 6, 6, 4, 5, 5],
        5: [8, 10, 9, 8],
      },
      isDone: true
    })
  })
  test("should sell cards all good but no enoguh bonus token", () => {
    const game = {
      id: 1,
      name: "test",
      _players: [
        {
          hand: ["diamonds", "diamonds", "diamonds", "diamonds", "gold"],
          camelsCount: 0,
          score: 0,
        },
        {
          hand: ["gold", "gold", "gold", "gold", "gold", "gold", "gold"],
          camelsCount: 0,
          score: 0,
        },
      ],
      currentPlayerIndex: 1,
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
        5: [],
      },
    }
    const gameReturned = gameService.sellCards(game, 1, "gold", 7)
    expect(gameReturned).toStrictEqual({
      id: 1,
      name: "test",
      _players: [
        {
          hand: ["diamonds", "diamonds", "diamonds", "diamonds", "gold"],
          camelsCount: 0,
          score: 0,
        },
        {
          hand: [],
          camelsCount: 0,
          score: 27,
        },
      ],
      currentPlayerIndex: 1,
      tokens: {
        diamonds: [7, 7, 5, 5, 5],
        gold: [],
        silver: [5, 5, 5, 5, 5],
        cloth: [5, 3, 3, 2, 2, 1, 1],
        spice: [5, 3, 3, 2, 2, 1, 1],
        leather: [4, 3, 2, 1, 1, 1, 1, 1, 1],
      },
      _bonusTokens: {
        3: [2, 1, 2, 3, 1, 2, 3],
        4: [4, 6, 6, 4, 5, 5],
        5: [],
      },
      isDone: true
    })
  })
})

describe("Test takeGood", () => {
  function baseGame() {
    return {
      _deck: ["diamonds"],
      market: ["cloth"],
      _players: [{ hand: [], camelsCount: 0 }],
      currentPlayerIndex: 0,
    }
  }

  test("Normal call", () => {
    const game = baseGame()
    gameService.takeGood(game, 0, "cloth")
    expect(game.market).toStrictEqual(["diamonds"])
    expect(game._players[0].hand).toStrictEqual(["cloth"])
    expect(game._deck).toStrictEqual([])
  })

  test("Bad player id", () => {
    const game = baseGame()
    game.currentPlayerIndex = 1
    expect(gameService.takeGood.bind(null, game, 0, "foo")).toThrow()
  })

  test("Too many cards in hand", () => {
    const game = baseGame()
    game._players[0].hand = Array(7).fill("cloth")
    expect(gameService.takeGood.bind(null, game, 0, "foo")).toThrow()
  })

  test("Lots of camels in hand", () => {
    const game = baseGame()
    game._players[0].hand = Array(7).fill("camel")
    gameService.takeGood(game, 0, "cloth")
    expect(game._players[0].hand.indexOf("cloth")).toBeDefined()
  })

  test("Good not found", () => {
    const game = baseGame()
    expect(gameService.takeGood.bind(null, game, 0, "missing")).toThrow()
  })
})

describe("Test exchange", () => {
  function baseGame() {
    return {
      market: ["cloth", "camel"],
      _players: [{ hand: ["diamonds", "gold"], camelsCount: 0 }],
      currentPlayerIndex: 0,
    }
  }

  test("Normal case", () => {
    const game = baseGame()
    gameService.exchange(game, 0, ["cloth", "camel"], ["diamonds", "gold"])

    expect(game.market.sort()).toEqual(["diamonds", "gold"].sort())
    expect(game._players[0].hand.sort()).toEqual(["cloth", "camel"].sort())
  })

  test("Single item", () => {
    const game = baseGame()
    gameService.exchange(game, 0, ["cloth"], ["diamonds"])

    expect(game.market.sort()).toEqual(["diamonds", "camel"].sort())
    expect(game._players[0].hand.sort()).toEqual(["cloth", "gold"].sort())
  })

  test("No item", () => {
    const game = baseGame()
    gameService.exchange(game, 0, [], [])

    expect(game.market.sort()).toEqual(["cloth", "camel"].sort())
    expect(game._players[0].hand.sort()).toEqual(["diamonds", "gold"].sort())
  })

  test("Bad player index", () => {
    const game = baseGame()
    expect(gameService.exchange.bind(null, game, 1, [], [])).toThrow()
  })

  test("Different give and take length", () => {
    const game = baseGame()
    expect(
      gameService.exchange.bind(null, game, 0, ["cloth"], ["diamonds", "gold"])
    ).toThrow()
  })

  test("Given card not in hand", () => {
    const game = baseGame()
    expect(
      gameService.exchange.bind(null, game, 0, ["cloth"], ["silver"])
    ).toThrow()
  })

  test("Taken card not in market", () => {
    const game = baseGame()
    expect(
      gameService.exchange.bind(null, game, 0, ["silver"], ["diamonds"])
    ).toThrow()
  })
})

describe("Test takeAllCamels", () => {
  function baseGame() {
    return {
      market: ["camel", "cloth", "camel"],
      _players: [{ hand: ["diamonds"], camelsCount: 0 }],
      currentPlayerIndex: 0,
    }
  }

  test("Normal case", () => {
    const game = baseGame()
    gameService.takeAllCamels(game, 0)

    expect(game.market).toEqual(["cloth"])
    expect(game._players[0].hand.sort()).toEqual(
      ["diamonds", "camel", "camel"].sort()
    )
  })

  test("No camel", () => {
    const game = baseGame()
    game.market = ["cloth"]
    gameService.takeAllCamels(game, 0)

    expect(game.market).toEqual(["cloth"])
    expect(game._players[0].hand).toEqual(["diamonds"])
  })

  test("Bad player id", () => {
    const game = baseGame()
    expect(gameService.takeAllCamels.bind(null, game, 1)).toThrow()
  })
})

describe("Test isDone", () => {
  function baseGame() {
    return {
      market: ["camel", "cloth", "camel"],
      _players: [{ hand: ["diamonds"], camelsCount: 0 }],
      currentPlayerIndex: 0,
    }
  }

  test("Normal case", () => {
    const game = baseGame()
    const res = gameService.isDone(game)

    expect(res).toStrictEqual(false)
  })
})