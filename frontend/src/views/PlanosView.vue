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
        <router-link to="/alunos" class="nav-item">
          <i class="ti ti-users"></i> Alunos
        </router-link>
        <router-link to="/planos" class="nav-item active">
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
          <h1>Planos</h1>
          <p class="page-sub">{{ planos.length }} planos cadastrados</p>
        </div>
        <button class="btn-new" @click="abrirModal()">
          <i class="ti ti-plus"></i> Novo plano
        </button>
      </div>

      <!-- Cards de planos -->
      <div v-if="carregando" class="loading">Carregando...</div>

      <div v-else-if="planos.length === 0" class="loading">
        Nenhum plano cadastrado ainda.
      </div>

      <div v-else class="planos-grid">
        <div v-for="plano in planos" :key="plano.id" class="plano-card">
          <div class="plano-header">
            <div class="plano-icon"><i class="ti ti-receipt"></i></div>
            <div class="plano-actions">
              <button class="act-btn" @click="abrirModal(plano)" title="Editar">
                <i class="ti ti-edit"></i>
              </button>
              <button class="act-btn danger" @click="deletarPlano(plano.id)" title="Excluir">
                <i class="ti ti-trash"></i>
              </button>
            </div>
          </div>
          <div class="plano-nome">{{ plano.nome }}</div>
          <div class="plano-desc">{{ plano.descricao || 'Sem descrição' }}</div>
          <div class="plano-preco">R$ {{ Number(plano.preco).toFixed(2) }}</div>
          <div class="plano-duracao">{{ plano.duracao_meses }} {{ plano.duracao_meses === 1 ? 'mês' : 'meses' }}</div>
        </div>
      </div>

    </main>

    <!-- Modal -->
    <div v-if="modalAberto" class="modal-overlay" @click.self="fecharModal">
      <div class="modal">
        <div class="modal-header">
          <div class="bar"></div>
          <h2>{{ editando ? 'Editar plano' : 'Novo plano' }}</h2>
          <button class="close-btn" @click="fecharModal">
            <i class="ti ti-x"></i>
          </button>
        </div>

        <div v-if="erro" class="erro">{{ erro }}</div>

        <form @submit.prevent="salvarPlano">
          <div class="form-grid">
            <div class="campo full">
              <label>NOME DO PLANO</label>
              <input v-model="form.nome" type="text" placeholder="Ex: Plano Mensal" required />
            </div>
            <div class="campo full">
              <label>DESCRIÇÃO</label>
              <input v-model="form.descricao" type="text" placeholder="Descreva o plano..." />
            </div>
            <div class="campo">
              <label>PREÇO (R$)</label>
              <input v-model="form.preco" type="number" step="0.01" placeholder="0,00" required />
            </div>
            <div class="campo">
              <label>DURAÇÃO (MESES)</label>
              <input v-model="form.duracao_meses" type="number" min="1" placeholder="1" required />
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
      planos: [],
      carregando: true,
      modalAberto: false,
      editando: false,
      salvando: false,
      erro: '',
      form: {
        id: null,
        nome: '',
        descricao: '',
        preco: '',
        duracao_meses: ''
      }
    }
  },
  async mounted() {
    await this.carregarPlanos()
  },
  methods: {
    async carregarPlanos() {
      try {
        const res = await api.get('/planos')
        this.planos = res.data
      } catch (e) {
        console.error(e)
      } finally {
        this.carregando = false
      }
    },
    abrirModal(plano = null) {
      this.erro = ''
      if (plano) {
        this.editando = true
        this.form = {
          id: plano.id,
          nome: plano.nome,
          descricao: plano.descricao || '',
          preco: plano.preco,
          duracao_meses: plano.duracao_meses
        }
      } else {
        this.editando = false
        this.form = { id: null, nome: '', descricao: '', preco: '', duracao_meses: '' }
      }
      this.modalAberto = true
    },
    fecharModal() {
      this.modalAberto = false
    },
    async salvarPlano() {
      this.erro = ''
      this.salvando = true
      try {
        if (this.editando) {
          const res = await api.put(`/planos/${this.form.id}`, this.form)
          const idx = this.planos.findIndex(p => p.id === this.form.id)
          if (idx !== -1) this.planos[idx] = res.data
        } else {
          const res = await api.post('/planos', this.form)
          this.planos.unshift(res.data)
        }
        this.fecharModal()
      } catch (e) {
        this.erro = e.response?.data?.error || 'Erro ao salvar'
      } finally {
        this.salvando = false
      }
    },
    async deletarPlano(id) {
      if (!confirm('Tem certeza que deseja excluir este plano?')) return
      try {
        await api.delete(`/planos/${id}`)
        this.planos = this.planos.filter(p => p.id !== id)
      } catch (e) {
        alert('Erro ao excluir plano')
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

.main { flex: 1; padding: 28px; display: flex; flex-direction: column; gap: 20px; }
.topbar { display: flex; align-items: center; justify-content: space-between; }
h1 { color: #f5f0e8; font-size: 18px; font-weight: 500; margin: 0 0 4px; }
.page-sub { color: #333; font-size: 12px; margin: 0; }
.btn-new { background: #c9a84c; color: #000; border: none; border-radius: 8px; padding: 9px 18px; font-size: 13px; font-weight: 500; cursor: pointer; display: flex; align-items: center; gap: 6px; }
.btn-new:hover { background: #d4b358; }

.planos-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 16px; }

.plano-card { background: #0a0a0a; border: 0.5px solid #1a1a1a; border-radius: 12px; padding: 22px; display: flex; flex-direction: column; gap: 8px; transition: border-color .2s; }
.plano-card:hover { border-color: #c9a84c; }
.plano-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px; }
.plano-icon { width: 32px; height: 32px; background: #111; border: 0.5px solid #c9a84c; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #c9a84c; font-size: 15px; }
.plano-actions { display: flex; gap: 6px; }
.act-btn { width: 28px; height: 28px; background: #111; border: 0.5px solid #1a1a1a; border-radius: 6px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #444; font-size: 13px; }
.act-btn:hover { border-color: #c9a84c; color: #c9a84c; }
.act-btn.danger:hover { border-color: #ff4444; color: #ff4444; }
.plano-nome { color: #f5f0e8; font-size: 15px; font-weight: 500; }
.plano-desc { color: #333; font-size: 12px; line-height: 1.5; }
.plano-preco { color: #c9a84c; font-size: 22px; font-weight: 500; margin-top: 4px; }
.plano-duracao { color: #444; font-size: 12px; }

.loading { color: #333; font-size: 13px; text-align: center; padding: 32px; }

/* Modal */
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.85); display: flex; align-items: center; justify-content: center; z-index: 100; }
.modal { background: #0a0a0a; border: 0.5px solid #2a2a2a; border-radius: 14px; padding: 36px; width: 480px; max-width: 95vw; }
.modal-header { display: flex; align-items: center; gap: 12px; margin-bottom: 24px; }
.bar { width: 28px; height: 2px; background: #c9a84c; border-radius: 2px; flex-shrink: 0; }
h2 { color: #f5f0e8; font-size: 18px; font-weight: 500; margin: 0; flex: 1; }
.close-btn { background: none; border: none; color: #444; cursor: pointer; font-size: 18px; padding: 0; }
.close-btn:hover { color: #f5f0e8; }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.campo { display: flex; flex-direction: column; gap: 7px; }
.campo.full { grid-column: 1 / -1; }
label { color: #555; font-size: 11px; letter-spacing: 1px; }
input { background: #000; border: 0.5px solid #222; border-radius: 8px; padding: 11px 14px; color: #f5f0e8; font-size: 13px; outline: none; }
input:focus { border-color: #c9a84c; }
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
  .planos-grid { grid-template-columns: 1fr; }
  .form-grid { grid-template-columns: 1fr; }
  .campo.full { grid-column: 1; }
  .modal { padding: 24px 16px; }
}
</style>