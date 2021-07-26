import express from 'express'

const router = express.Router()

//Routes
router.post('/api/users/signout', (req, res) => {
  res.send('Current user konsta')
})

export { router as signOutRouter }