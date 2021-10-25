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


router.put("/:id/take-good", function (req, res) {
  const gameId = Number.parseInt(req.params.id)
  if (!req.headers.playerindex)
    return res.status(400).send("Missing playerindex header")
  if (!req.body.good)
    return res.status(400).send("Missing good parameter")
  if (!req.body.count)
    return res.status(400).send("Missing count parameter")
  const game = databaseService.getGame(gameId)
  if (!game)
    return res.status(404).send("Game " + gameId + " not found")

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
    return res.status(404).send("Pas de game " + idSearch)
  }
  res.status(201).json(gameRes)
})

// DELETE game by id
router.delete("/:id", function (req, res) {
  const idSearch = Number.parseInt(req.params.id)
  const gameRes = databaseService.deleteGame(idSearch)
  if (gameRes === false) {
    return res.status(404).send("Pas de game " + idSearch)
  }
  res.status(200).json("OK")
})

// DELETE all game
router.delete("/", function (req, res) {
  databaseService.deleteAllGame()
  res.status(200).json("OK")
})

export default router
