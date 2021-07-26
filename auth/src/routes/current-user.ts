import express from 'express'

const router = express.Router()

//Routes
router.get('/api/users/current-user', (req, res) => {
  res.send('Current user konsta')
})

export { router as currentUserRouter }