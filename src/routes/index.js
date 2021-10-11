import express from "express"

import healthRouter from "./healthRouter"
import gameRouter from "./gameRouter"
// Don't forget to import new routers above

const router = express.Router()

router.use("/health", healthRouter)
router.use("/games", gameRouter)
// Add new routers above

export default router
