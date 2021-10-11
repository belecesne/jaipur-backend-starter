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
