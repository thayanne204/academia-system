const express = require('express')
const router = express.Router()
const { listar, buscarPorId, criar, atualizar, deletar } = require('../controllers/alunosController')
const authMiddleware = require('../middlewares/auth')

router.get('/', authMiddleware, listar)
router.get('/:id', authMiddleware, buscarPorId)
router.post('/', authMiddleware, criar)
router.put('/:id', authMiddleware, atualizar)
router.delete('/:id', authMiddleware, deletar)

module.exports = router