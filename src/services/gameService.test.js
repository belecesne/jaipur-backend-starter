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
