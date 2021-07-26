import express from 'express'

const router = express.Router()

//Routes
router.post('/api/users/signin', (req, res) => {
  res.send('Current user konsta')
})

export { router as signInRouter }