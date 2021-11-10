import * as databaseService from "./databaseService"
import { shuffle } from "lodash"

// Return a shuffled starting deck except 3 camels
export function initDeck() {
  const deck = []
  for (let i = 0; i < 6; i++) {
    deck.push("diamonds")
  }
  for (let i = 0; i < 6; i++) {
    deck.push("gold")
  }
  for (let i = 0; i < 6; i++) {
    deck.push("silver")
  }
  for (let i = 0; i < 8; i++) {
    deck.push("cloth")
  }
  for (let i = 0; i < 8; i++) {
    deck.push("spice")
  }
  for (let i = 0; i < 10; i++) {
    deck.push("leather")
  }
  for (let i = 0; i < 11 - 3; i++) {
    deck.push("camel")
  }
  return shuffle(deck)
}

// Draw {count} cards of a deck
export function drawCards(deck, count = 1) {
  if (deck.length === 0) {
    return []
  }
  const drawnCards = []
  const length = deck.length
  for (let i = 0; i < length && i < count; i++) {
    drawnCards.push(deck.shift())
  }
  return drawnCards
}

// Transfer camels from players hand (_players[i].hand) to their herd (_players[i].camelsCount)
export function putCamelsFromHandToHerd(game) {
  game._players.forEach((player) => {
    const deckSize = player.hand.length
    player.hand = player.hand.filter((e) => e !== "camel")
    player.camelsCount += deckSize - player.hand.length
  })
}

// Create a game object
export function createGame(name) {
  const deck = initDeck()
  const market = ["camel", "camel", "camel", ...drawCards(deck, 2)]
  const game = {
    id: databaseService.getGames().length + 1,
    name,
    market,
    _deck: deck,
    _players: [
      { hand: drawCards(deck, 5), camelsCount: 0, score: 0 },
      { hand: drawCards(deck, 5), camelsCount: 0, score: 0 },
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
      3: shuffle([2, 1, 2, 3, 1, 2, 3]),
      4: shuffle([4, 6, 6, 4, 5, 5]),
      5: shuffle([8, 10, 9, 8, 10]),
    },
    isDone: false,
  }
  putCamelsFromHandToHerd(game)
  databaseService.saveGame(game)
  return game
}

export function takeGood(game, playerIndex, good) {
  if (playerIndex !== game.currentPlayerIndex)
    throw new Error(
      "Not player " + playerIndex + " turn, expected " + game.currentPlayerIndex
    )
  const player = game._players[playerIndex]
  const handCount = player.hand.filter((e) => e !== "camel").length
  console.log("here")
  if (handCount + 1 > 7) throw new Error("Too many cards: " + handCount)
  if (!game.market.includes(good)) throw new Error(good + ": good not found")

  console.log("Game " + game + ", player " + playerIndex + ", removing " + good)
  player.hand.push(good)
  game.market.splice(
    game.market.findIndex((e) => e === good),
    1
  )
  game.market.push(drawCards(game._deck, 1)[0])
  return game
}

function isSubset(set, sub) {
  return sub.every(
    (e) =>
      set.includes(e) &&
      sub.filter((f) => f === e).length <= set.filter((f) => f === e).length
  )
}

function removeItem(set, elt) {
  set.splice(set.indexOf(elt), 1)
}

function removeItems(set, elts) {
  elts.forEach((e) => removeItem(set, e))
}

function addItems(set, elts) {
  elts.forEach((e) => set.push(e))
}

export function exchange(game, playerIndex, take, give) {
  if (playerIndex !== game.currentPlayerIndex)
    throw new Error(
      "Not player " + playerIndex + " turn, expected " + game.currentPlayerIndex
    )
  const player = game._players[playerIndex]

  if (take.length !== give.length)
    throw new Error("Number of gards taken must be the same as given")
  if (!isSubset(game.market, take))
    throw new Error(
      "Taken cards are not all available in the market: " +
        take +
        " is not a subset of " +
        game.market
    )
  if (!isSubset(player.hand, give))
    throw new Error(
      "Given cards are not all in the player's hand: " +
        give +
        " is not a subset of " +
        player.hand
    )

  removeItems(game.market, take)
  removeItems(player.hand, give)
  addItems(game.market, give)
  addItems(player.hand, take)
  return game
}

export function takeAllCamels(game, playerIndex) {
  if (playerIndex !== game.currentPlayerIndex)
    throw new Error(
      "Not player " + playerIndex + " turn, expected " + game.currentPlayerIndex
    )
  const player = game._players[playerIndex]

  const camels = game.market.filter((e) => e === "camel")
  console.log("before:\n" + camels + "\n" + game.market + "\n" + player.hand)
  removeItems(game.market, camels)
  addItems(player.hand, camels)
  console.log("after:\n" + camels + "\n" + game.market + "\n" + player.hand)
  return game
}

export function sellCards(game, playerIndex, good, count) {
  if (playerIndex !== game.currentPlayerIndex)
    throw new Error(
      "Not player " + playerIndex + " turn, expected " + game.currentPlayerIndex
    )
  const player = game._players[playerIndex]
  const handGoodCount = player.hand.filter((e) => e === good).length
  if (count < 1) {
    throw new Error("Bad count: " + count + " is incorrect")
  }
  if (handGoodCount < count)
    throw new Error("Not enough " + good + " in your hand")
  const token = game.tokens[good]
  for (let i = 0; i < count; i++) {
    removeItem(player.hand, good)
    if (token.length > 0) {
      player.score += token.pop()
    }
  }
  try {
    player.score += game._bonusTokens[count > 5 ? 5 : count].pop()
  } catch (e) {
    player.score += 0
  }
  return game
}
