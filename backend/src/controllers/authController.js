const supabase = require('../config/supabase')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const register = async (req, res) => {
  const { nome, email, senha } = req.body
  try {
    const senhaHash = await bcrypt.hash(senha, 10)
    const { data, error } = await supabase
      .from('usuarios')
      .insert([{ nome, email, senha: senhaHash }])
      .select()
    if (error) return res.status(400).json({ error: error.message })
    res.status(201).json({ message: 'Usuário criado com sucesso!', user: data[0] })
  } catch (err) {
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
}

const login = async (req, res) => {
  const { email, senha } = req.body
  try {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('email', email)
      .single()
    if (error || !data) return res.status(401).json({ error: 'Email ou senha inválidos' })
    const senhaValida = await bcrypt.compare(senha, data.senha)
    if (!senhaValida) return res.status(401).json({ error: 'Email ou senha inválidos' })
    const token = jwt.sign({ id: data.id, email: data.email }, process.env.JWT_SECRET, { expiresIn: '8h' })
    res.json({ token, user: { id: data.id, nome: data.nome, email: data.email } })
  } catch (err) {
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
}

module.exports = { register, login }