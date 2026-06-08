const express = require('express')
const cors = require('cors')
require('dotenv').config()

const authRoutes = require('./src/routes/auth')
const alunosRoutes = require('./src/routes/alunos')
const planosRoutes = require('./src/routes/planos')

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/alunos', alunosRoutes)
app.use('/api/planos', planosRoutes)

app.get('/', (req, res) => {
  res.json({ message: 'API Academia funcionando! 🏋️' })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})