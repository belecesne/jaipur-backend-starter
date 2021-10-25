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
  if (!good)
    return res.status(400).send("Missing good parameter")
  const game = databaseService.getGame(gameId)
  if (!game)
    return res.status(404).send("Game " + gameId + " not found")

  try {
    const out = gameService.takeGood(game, playerIndex, good)
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
  if (!idSearch) {
    return res.status(400).send("Missing name parameter")
  }
  const gameRes = databaseService.getGame(idSearch)
  if (gameRes.id !== idSearch) {
    return res.status(404).send("Pas de game " + idSearch)
  }
  res.status(201).json(gameRes)
})

export default router
