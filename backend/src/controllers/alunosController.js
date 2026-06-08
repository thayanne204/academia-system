const supabase = require('../config/supabase')

const listar = async (req, res) => {
  const { data, error } = await supabase
    .from('alunos')
    .select('*, planos(nome)')
    .order('created_at', { ascending: false })
  if (error) return res.status(400).json({ error: error.message })
  res.json(data)
}

const buscarPorId = async (req, res) => {
  const { id } = req.params
  const { data, error } = await supabase
    .from('alunos')
    .select('*, planos(nome)')
    .eq('id', id)
    .single()
  if (error) return res.status(404).json({ error: 'Aluno não encontrado' })
  res.json(data)
}

const criar = async (req, res) => {
  const { nome, email, telefone, data_nascimento, plano_id } = req.body
  const { data, error } = await supabase
    .from('alunos')
    .insert([{ nome, email, telefone, data_nascimento, plano_id }])
    .select()
  if (error) return res.status(400).json({ error: error.message })
  res.status(201).json(data[0])
}

const atualizar = async (req, res) => {
  const { id } = req.params
  const { nome, email, telefone, data_nascimento, plano_id, ativo } = req.body
  const { data, error } = await supabase
    .from('alunos')
    .update({ nome, email, telefone, data_nascimento, plano_id, ativo })
    .eq('id', id)
    .select()
  if (error) return res.status(400).json({ error: error.message })
  res.json(data[0])
}

const deletar = async (req, res) => {
  const { id } = req.params
  const { error } = await supabase
    .from('alunos')
    .delete()
    .eq('id', id)
  if (error) return res.status(400).json({ error: error.message })
  res.json({ message: 'Aluno deletado com sucesso' })
}

module.exports = { listar, buscarPorId, criar, atualizar, deletar }