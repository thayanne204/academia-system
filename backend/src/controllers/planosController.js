const supabase = require('../config/supabase')

const listar = async (req, res) => {
  const { data, error } = await supabase
    .from('planos')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) return res.status(400).json({ error: error.message })
  res.json(data)
}

const buscarPorId = async (req, res) => {
  const { id } = req.params
  const { data, error } = await supabase
    .from('planos')
    .select('*')
    .eq('id', id)
    .single()
  if (error) return res.status(404).json({ error: 'Plano não encontrado' })
  res.json(data)
}

const criar = async (req, res) => {
  const { nome, descricao, duracao_meses, preco } = req.body
  const { data, error } = await supabase
    .from('planos')
    .insert([{ nome, descricao, duracao_meses, preco }])
    .select()
  if (error) return res.status(400).json({ error: error.message })
  res.status(201).json(data[0])
}

const atualizar = async (req, res) => {
  const { id } = req.params
  const { nome, descricao, duracao_meses, preco } = req.body
  const { data, error } = await supabase
    .from('planos')
    .update({ nome, descricao, duracao_meses, preco })
    .eq('id', id)
    .select()
  if (error) return res.status(400).json({ error: error.message })
  res.json(data[0])
}

const deletar = async (req, res) => {
  const { id } = req.params
  const { error } = await supabase
    .from('planos')
    .delete()
    .eq('id', id)
  if (error) return res.status(400).json({ error: error.message })
  res.json({ message: 'Plano deletado com sucesso' })
}

module.exports = { listar, buscarPorId, criar, atualizar, deletar }