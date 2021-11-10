import express from "express"
import * as gameService from "../services/gameService"
import * as databaseService from "../services/databaseService"

const router = express.Router()

// Listen to POST /games
router.post("/", function (req, res) {
  if (!req.body.name) {
    return res.status(400).send("Missing name parameter")
  }
  const newGame = gameService.createGame(req.body.name)
  res.status(201).json(newGame)
})

// Listen to PUT
router.put("/:id/take-good", function (req, res) {
  const gameId = Number.parseInt(req.params.id)
  const playerIndex = parseInt(req.headers.playerindex)
  if (playerIndex === undefined)
    return res.status(400).send("Missing playerindex header")
  const good = req.body.good
  if (!good) return res.status(400).send("Missing good parameter")
  const game = databaseService.getGame(gameId)
  if (!game) return res.status(404).send("Game " + gameId + " not found")

  try {
    const out = gameService.takeGood(game, playerIndex, good)
    return res.status(200).json(out)
  } catch (e) {
    console.error(e)
    return res.status(400).send(e)
  }
})

// Exchange
router.put("/:id/exchange", function (req, res) {
  const gameId = Number.parseInt(req.params.id)
  const playerIndex = parseInt(req.headers.playerindex)
  if (playerIndex === undefined)
    return res.status(400).send("Missing playerindex header")
  const take = req.body.take
  if (!take) return res.status(400).send("Missing take parameter")
  const give = req.body.give
  if (!give) return res.status(400).send("Missing give parameter")
  const game = databaseService.getGame(gameId)
  if (!game) return res.status(404).send("Game " + gameId + " not found")

  try {
    const out = gameService.exchange(game, playerIndex, take, give)
    return res.status(200).json(out)
  } catch (e) {
    console.error(e)
    return res.status(400).send(e)
  }
})

// Take all camels
router.put("/:id/take-camels", function (req, res) {
  const gameId = Number.parseInt(req.params.id)
  const playerIndex = parseInt(req.headers.playerindex)
  if (playerIndex === undefined)
    return res.status(400).send("Missing playerindex header")
  const game = databaseService.getGame(gameId)
  if (!game) return res.status(404).send("Game " + gameId + " not found")

  try {
    const out = gameService.takeAllCamels(game, playerIndex)
    return res.status(200).json(out)
  } catch (e) {
    console.error(e)
    return res.status(400).send(e)
  }
})

// GET all games
router.get("/", function (req, res) {
  const games = databaseService.getGames()
  res.status(201).json(games)
})

// GET game by id
router.get("/:id", function (req, res) {
  const idSearch = Number.parseInt(req.params.id)
  const gameRes = databaseService.getGame(idSearch)
  if (gameRes === undefined) {
    return res
      .status(404)
      .json("Game " + idSearch + " does not exist")
      .send("Pas de game " + idSearch)
  }
  res.status(201).json(gameRes)
})

// DELETE game by id
router.delete("/:id", function (req, res) {
  const idSearch = Number.parseInt(req.params.id)
  const gameRes = databaseService.deleteGame(idSearch)
  if (gameRes === false) {
    return res
      .status(404)
      .json("Game " + idSearch + " does not exist")
      .send("Pas de game " + idSearch)
  }
  res.status(200).json("Game " + idSearch + " deleted")
})

// DELETE all game
router.delete("/", function (req, res) {
  databaseService.deleteAllGame()
  res.status(200).json("All game deleted")
})

// SELL CARDS
router.put("/:id/sell", function (req, res) {
  const gameId = Number.parseInt(req.params.id)
  const playerIndex = Number.parseInt(req.headers.playerindex)
  if (isNaN(playerIndex))
    return res.status(400).send("Missing playerindex header")
  const good = req.body.good
  const count = req.body.count
  if (!good) return res.status(400).send("Missing good parameter")
  if (!count) return res.status(400).send("Missing count parameter")
  const game = databaseService.getGame(gameId)
  if (!game) return res.status(404).send("Game " + gameId + " not found")

  try {
    const out = gameService.sellCards(game, playerIndex, good, count)
    return res.status(200).json(out)
  } catch (e) {
    console.error(e)
    return res.status(400).send(e.toString())
  }
})

export default router
