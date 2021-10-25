import fs from "fs"
import path from "path"

const DATABASE_FILE = path.join(__dirname, "../../storage/database.json")

// Get game by ID
export function getGame(id) {
  return getGames().find((e) => Number.parseInt(e.id) === Number.parseInt(id))
}

// Read the file storage/database.json and return the parsed array of games.
export function getGames() {
  try {
    const file = fs.readFileSync(DATABASE_FILE)
    return JSON.parse(file)
  } catch (e) {
    return []
  }
}

// Save a game to storage/database.json
export function saveGame(game) {
  const games = getGames()
  const gameIndex = games.findIndex((g) => g.id === game.id)
  if (gameIndex >= 0) {
    games[gameIndex] = game
  } else {
    games.push(game)
  }
  try {
    fs.mkdirSync(path.dirname(DATABASE_FILE))
  } catch (e) {
    // Do nothing
  }
  fs.writeFileSync(path.join(DATABASE_FILE), JSON.stringify(games))
  return games
}

// Delete a game from storage/database.json
export function deleteGame(game) {
  const games = getGames()
  const gameIndex = games.findIndex((g) => g.id === game.id)
  let res = false
  if (gameIndex >= 0) {
    games.splice(gameIndex, 1)
    res = true
  }
  try {
    fs.mkdirSync(path.dirname(DATABASE_FILE))
  } catch (e) {
    // Do nothing
  }
  fs.writeFileSync(path.join(DATABASE_FILE), JSON.stringify(games))
  return res
}

// Delete a game from storage/database.json
export function deleteAllGame() {
  try {
    fs.mkdirSync(path.dirname(DATABASE_FILE))
  } catch (e) {
    // Do nothing
  }
  fs.writeFileSync(path.join(DATABASE_FILE), JSON.stringify([]))
}
