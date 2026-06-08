<template>
  <div class="app">

    <!-- Sidebar -->
    <aside class="sidebar">
      <div class="slogo">
        <div class="logo-icon">
          <i class="ti ti-barbell"></i>
        </div>
        <span class="logo-txt">Academia System</span>
      </div>

      <nav>
        <router-link to="/dashboard" class="nav-item">
          <i class="ti ti-layout-dashboard"></i> Dashboard
        </router-link>
        <router-link to="/alunos" class="nav-item active">
          <i class="ti ti-users"></i> Alunos
        </router-link>
        <router-link to="/planos" class="nav-item">
          <i class="ti ti-receipt"></i> Planos
        </router-link>
      </nav>

      <div class="sidebar-footer">
        <button class="logout-btn" @click="logout">
          <i class="ti ti-logout"></i> Sair
        </button>
      </div>
    </aside>

    <!-- Main -->
    <main class="main">

      <div class="topbar">
        <div>
          <h1>Alunos</h1>
          <p class="page-sub">{{ alunos.length }} alunos cadastrados</p>
        </div>
        <button class="btn-new" @click="abrirModal()">
          <i class="ti ti-plus"></i> Novo aluno
        </button>
      </div>

      <!-- Busca -->
      <div class="search-wrap">
        <i class="ti ti-search"></i>
        <input v-model="busca" type="text" placeholder="Buscar aluno por nome ou email..." />
      </div>

      <!-- Tabela -->
      <div class="table-wrap">
        <div class="thead">
          <span>NOME</span>
          <span>EMAIL</span>
          <span>TELEFONE</span>
          <span>PLANO</span>
          <span>STATUS</span>
          <span>AÇÕES</span>
        </div>

        <div v-if="carregando" class="loading">Carregando...</div>

        <div v-else-if="alunosFiltrados.length === 0" class="loading">
          Nenhum aluno encontrado.
        </div>

        <div v-else>
          <div v-for="aluno in alunosFiltrados" :key="aluno.id" class="trow">
            <div>
              <div class="tname">{{ aluno.nome }}</div>
            </div>
            <div class="tcell">{{ aluno.email }}</div>
            <div class="tcell">{{ aluno.telefone || '—' }}</div>
            <div class="tcell">{{ aluno.planos?.nome || 'Sem plano' }}</div>
            <div>
              <span :class="['badge', aluno.ativo ? 'on' : 'off']">
                {{ aluno.ativo ? 'Ativo' : 'Inativo' }}
              </span>
            </div>
            <div class="actions-cell">
              <button class="act-btn" @click="abrirModal(aluno)" title="Editar">
                <i class="ti ti-edit"></i>
              </button>
              <button class="act-btn danger" @click="deletarAluno(aluno.id)" title="Excluir">
                <i class="ti ti-trash"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

    </main>

    <!-- Modal -->
    <div v-if="modalAberto" class="modal-overlay" @click.self="fecharModal">
      <div class="modal">
        <div class="modal-header">
          <div class="bar"></div>
          <h2>{{ editando ? 'Editar aluno' : 'Novo aluno' }}</h2>
          <button class="close-btn" @click="fecharModal">
            <i class="ti ti-x"></i>
          </button>
        </div>

        <div v-if="erro" class="erro">{{ erro }}</div>

        <form @submit.prevent="salvarAluno">
          <div class="form-grid">
            <div class="campo">
              <label>NOME</label>
              <input v-model="form.nome" type="text" placeholder="Nome completo" required />
            </div>
            <div class="campo">
              <label>EMAIL</label>
              <input v-model="form.email" type="email" placeholder="email@exemplo.com" required />
            </div>
            <div class="campo">
              <label>TELEFONE</label>
              <input v-model="form.telefone" type="text" placeholder="(00) 00000-0000" />
            </div>
            <div class="campo">
              <label>DATA DE NASCIMENTO</label>
              <input v-model="form.data_nascimento" type="date" />
            </div>
            <div class="campo">
              <label>PLANO</label>
              <select v-model="form.plano_id">
                <option value="">Sem plano</option>
                <option v-for="plano in planos" :key="plano.id" :value="plano.id">
                  {{ plano.nome }}
                </option>
              </select>
            </div>
            <div class="campo" v-if="editando">
              <label>STATUS</label>
              <select v-model="form.ativo">
                <option :value="true">Ativo</option>
                <option :value="false">Inativo</option>
              </select>
            </div>
          </div>

          <div class="modal-actions">
            <button type="button" class="btn-cancel" @click="fecharModal">Cancelar</button>
            <button type="submit" :disabled="salvando">
              {{ salvando ? 'Salvando...' : (editando ? 'Salvar alterações' : 'Cadastrar') }}
            </button>
          </div>
        </form>
      </div>
    </div>

  </div>
</template>

<script>
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'
import api from '../services/api'

export default {
  setup() {
    return {
      authStore: useAuthStore(),
      router: useRouter()
    }
  },
  data() {
    return {
      alunos: [],
      planos: [],
      busca: '',
      carregando: true,
      modalAberto: false,
      editando: false,
      salvando: false,
      erro: '',
      form: {
        id: null,
        nome: '',
        email: '',
        telefone: '',
        data_nascimento: '',
        plano_id: '',
        ativo: true
      }
    }
  },
  computed: {
    alunosFiltrados() {
      if (!this.busca) return this.alunos
      const b = this.busca.toLowerCase()
      return this.alunos.filter(a =>
        a.nome.toLowerCase().includes(b) ||
        a.email.toLowerCase().includes(b)
      )
    }
  },
  async mounted() {
    await this.carregarDados()
  },
  methods: {
    async carregarDados() {
      try {
        const [resAlunos, resPlanos] = await Promise.all([
          api.get('/alunos'),
          api.get('/planos')
        ])
        this.alunos = resAlunos.data
        this.planos = resPlanos.data
      } catch (e) {
        console.error(e)
      } finally {
        this.carregando = false
      }
    },
    abrirModal(aluno = null) {
      this.erro = ''
      if (aluno) {
        this.editando = true
        this.form = {
          id: aluno.id,
          nome: aluno.nome,
          email: aluno.email,
          telefone: aluno.telefone || '',
          data_nascimento: aluno.data_nascimento || '',
          plano_id: aluno.plano_id || '',
          ativo: aluno.ativo
        }
      } else {
        this.editando = false
        this.form = { id: null, nome: '', email: '', telefone: '', data_nascimento: '', plano_id: '', ativo: true }
      }
      this.modalAberto = true
    },
    fecharModal() {
      this.modalAberto = false
    },
    async salvarAluno() {
      this.erro = ''
      this.salvando = true
      try {
        if (this.editando) {
          await api.put(`/alunos/${this.form.id}`, this.form)
          await this.carregarDados()
        } else {
          const res = await api.post('/alunos', this.form)
          this.alunos.unshift(res.data)
        }
        this.fecharModal()
      } catch (e) {
        this.erro = e.response?.data?.error || 'Erro ao salvar'
      } finally {
        this.salvando = false
      }
    },
    async deletarAluno(id) {
      if (!confirm('Tem certeza que deseja excluir este aluno?')) return
      try {
        await api.delete(`/alunos/${id}`)
        this.alunos = this.alunos.filter(a => a.id !== id)
      } catch (e) {
        alert('Erro ao excluir aluno')
      }
    },
    logout() {
      this.authStore.logout()
      this.router.push('/')
    }
  }
}
</script>

<style scoped>
@import url('https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css');

.app { display: flex; min-height: 100vh; background: #000; font-family: sans-serif; }

.sidebar { width: 210px; background: #060606; border-right: 0.5px solid #1a1a1a; padding: 28px 0; display: flex; flex-direction: column; }
.slogo { padding: 0 20px 24px; border-bottom: 0.5px solid #1a1a1a; margin-bottom: 16px; display: flex; align-items: center; gap: 10px; }
.logo-icon { width: 32px; height: 32px; background: #111; border: 0.5px solid #c9a84c; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #c9a84c; font-size: 16px; flex-shrink: 0; }
.logo-txt { color: #f5f0e8; font-size: 12px; font-weight: 500; }
.nav-item { display: flex; align-items: center; gap: 10px; padding: 10px 20px; color: #444; font-size: 13px; cursor: pointer; text-decoration: none; }
.nav-item i { font-size: 16px; }
.nav-item:hover { color: #888; background: #0a0a0a; }
.nav-item.active { color: #c9a84c; background: #0f0f0f; }
.sidebar-footer { margin-top: auto; padding: 0 20px; }
.logout-btn { display: flex; align-items: center; gap: 8px; background: none; border: 0.5px solid #1a1a1a; border-radius: 8px; color: #444; font-size: 13px; padding: 8px 14px; cursor: pointer; width: 100%; }
.logout-btn:hover { border-color: #c9a84c; color: #c9a84c; }

.main { flex: 1; padding: 28px; display: flex; flex-direction: column; gap: 18px; }
.topbar { display: flex; align-items: center; justify-content: space-between; }
h1 { color: #f5f0e8; font-size: 18px; font-weight: 500; margin: 0 0 4px; }
.page-sub { color: #333; font-size: 12px; margin: 0; }
.btn-new { background: #c9a84c; color: #000; border: none; border-radius: 8px; padding: 9px 18px; font-size: 13px; font-weight: 500; cursor: pointer; display: flex; align-items: center; gap: 6px; }
.btn-new:hover { background: #d4b358; }

.search-wrap { background: #0a0a0a; border: 0.5px solid #1a1a1a; border-radius: 8px; padding: 10px 14px; display: flex; align-items: center; gap: 10px; }
.search-wrap i { color: #333; font-size: 16px; }
.search-wrap input { background: none; border: none; outline: none; color: #f5f0e8; font-size: 13px; width: 100%; }
.search-wrap input::placeholder { color: #333; }

.table-wrap { background: #0a0a0a; border: 0.5px solid #1a1a1a; border-radius: 10px; overflow: hidden; }
.thead { display: grid; grid-template-columns: 2fr 2fr 1.2fr 1.2fr 1fr 80px; padding: 12px 18px; border-bottom: 0.5px solid #111; }
.thead span { color: #333; font-size: 11px; letter-spacing: .5px; }
.trow { display: grid; grid-template-columns: 2fr 2fr 1.2fr 1.2fr 1fr 80px; padding: 12px 18px; border-bottom: 0.5px solid #0d0d0d; align-items: center; }
.trow:last-child { border-bottom: none; }
.trow:hover { background: #0d0d0d; }
.tname { color: #f5f0e8; font-size: 13px; }
.tcell { color: #555; font-size: 12px; }
.badge { font-size: 10px; padding: 3px 10px; border-radius: 20px; border: 0.5px solid; }
.badge.on { color: #c9a84c; border-color: #c9a84c; background: #0f0d00; }
.badge.off { color: #333; border-color: #222; }
.actions-cell { display: flex; gap: 6px; }
.act-btn { width: 28px; height: 28px; background: #111; border: 0.5px solid #1a1a1a; border-radius: 6px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #444; font-size: 13px; }
.act-btn:hover { border-color: #c9a84c; color: #c9a84c; }
.act-btn.danger:hover { border-color: #ff4444; color: #ff4444; }
.loading { color: #333; font-size: 13px; text-align: center; padding: 32px; }

/* Modal */
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; z-index: 100; }
.modal { background: #0a0a0a; border: 0.5px solid #2a2a2a; border-radius: 14px; padding: 36px; width: 520px; max-width: 95vw; }
.modal-header { display: flex; align-items: center; gap: 12px; margin-bottom: 24px; position: relative; }
.bar { width: 28px; height: 2px; background: #c9a84c; border-radius: 2px; flex-shrink: 0; }
h2 { color: #f5f0e8; font-size: 18px; font-weight: 500; margin: 0; flex: 1; }
.close-btn { background: none; border: none; color: #444; cursor: pointer; font-size: 18px; padding: 0; }
.close-btn:hover { color: #f5f0e8; }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.campo { display: flex; flex-direction: column; gap: 7px; }
label { color: #555; font-size: 11px; letter-spacing: 1px; }
input, select { background: #000; border: 0.5px solid #222; border-radius: 8px; padding: 11px 14px; color: #f5f0e8; font-size: 13px; outline: none; }
input:focus, select:focus { border-color: #c9a84c; }
select option { background: #0a0a0a; }
.modal-actions { display: flex; gap: 10px; justify-content: flex-end; margin-top: 24px; }
.btn-cancel { background: none; border: 0.5px solid #222; border-radius: 8px; color: #444; font-size: 13px; padding: 10px 20px; cursor: pointer; }
.btn-cancel:hover { border-color: #444; color: #888; }
button[type="submit"] { background: #c9a84c; color: #000; border: none; border-radius: 8px; padding: 10px 24px; font-size: 13px; font-weight: 500; cursor: pointer; }
button[type="submit"]:hover { background: #d4b358; }
button[type="submit"]:disabled { opacity: 0.6; cursor: not-allowed; }
.erro { background: #1a0000; border: 0.5px solid #ff4444; color: #ff6666; padding: 10px 14px; border-radius: 8px; font-size: 13px; margin-bottom: 16px; }

@media (max-width: 768px) {
  .app { flex-direction: column; }
  .sidebar { width: 100%; flex-direction: row; padding: 12px 16px; align-items: center; border-right: none; border-bottom: 0.5px solid #1a1a1a; }
  .slogo { padding: 0; border-bottom: none; margin-bottom: 0; }
  .slogo .logo-txt { display: none; }
  nav { display: flex; flex-direction: row; gap: 4px; margin-left: auto; }
  .nav-item { padding: 8px 10px; font-size: 0; }
  .nav-item i { font-size: 18px !important; }
  .sidebar-footer { margin-top: 0; padding: 0; }
  .main { padding: 16px; gap: 14px; }
  .topbar { flex-direction: column; align-items: flex-start; gap: 12px; }
  .thead { display: none; }
  .trow { grid-template-columns: 1fr; gap: 4px; padding: 14px; }
  .tcell { font-size: 12px; }
  .actions-cell { margin-top: 8px; }
  .form-grid { grid-template-columns: 1fr; }
  .modal { padding: 24px 16px; }
}
</style>