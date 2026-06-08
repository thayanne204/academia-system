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
        <router-link to="/dashboard" class="nav-item active">
          <i class="ti ti-layout-dashboard"></i> Dashboard
        </router-link>
        <router-link to="/alunos" class="nav-item">
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
          <h1>Dashboard</h1>
          <p class="page-sub">Visão geral da academia</p>
        </div>
        <div class="avatar">{{ iniciais }}</div>
      </div>

      <!-- Cards de resumo -->
      <div class="cards">
        <div class="card">
          <div class="card-icon"><i class="ti ti-users"></i></div>
          <div class="card-label">ALUNOS ATIVOS</div>
          <div class="card-val">{{ totalAlunos }}</div>
          <div class="card-delta up">cadastrados</div>
        </div>
        <div class="card">
          <div class="card-icon"><i class="ti ti-receipt"></i></div>
          <div class="card-label">PLANOS</div>
          <div class="card-val">{{ totalPlanos }}</div>
          <div class="card-delta up">disponíveis</div>
        </div>
        <div class="card">
          <div class="card-icon"><i class="ti ti-user-check"></i></div>
          <div class="card-label">ATIVOS</div>
          <div class="card-val">{{ alunosAtivos }}</div>
          <div class="card-delta up">este mês</div>
        </div>
        <div class="card">
          <div class="card-icon inactive"><i class="ti ti-user-x"></i></div>
          <div class="card-label">INATIVOS</div>
          <div class="card-val muted">{{ alunosInativos }}</div>
          <div class="card-delta down">este mês</div>
        </div>
      </div>

      <!-- Tabela + gráfico -->
      <div class="bottom">
        <div class="panel">
          <div class="panel-title">Alunos recentes</div>
          <div v-if="carregando" class="loading">Carregando...</div>
          <div v-else>
            <div v-for="aluno in alunosRecentes" :key="aluno.id" class="row">
              <div>
                <div class="row-name">{{ aluno.nome }}</div>
                <div class="row-plan">{{ aluno.planos?.nome || 'Sem plano' }}</div>
              </div>
              <span :class="['badge', aluno.ativo ? 'on' : 'off']">
                {{ aluno.ativo ? 'Ativo' : 'Inativo' }}
              </span>
            </div>
          </div>
        </div>

        <div class="panel">
          <div class="panel-title">Planos populares</div>
          <div class="bar-wrap">
            <div v-for="plano in planosPopulares" :key="plano.nome" class="bar-row">
              <div class="bar-label">
                <span>{{ plano.nome }}</span>
                <span>{{ plano.percent }}%</span>
              </div>
              <div class="bar-bg">
                <div class="bar-fill" :style="{ width: plano.percent + '%' }"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </main>
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
      carregando: true,
      totalAlunos: 0,
      totalPlanos: 0,
      alunosAtivos: 0,
      alunosInativos: 0,
      alunosRecentes: [],
      planosPopulares: []
    }
  },
  computed: {
    iniciais() {
      const nome = this.authStore.user?.nome || 'U'
      return nome.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
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
        const alunos = resAlunos.data
        const planos = resPlanos.data

        this.totalAlunos = alunos.length
        this.totalPlanos = planos.length
        this.alunosAtivos = alunos.filter(a => a.ativo).length
        this.alunosInativos = alunos.filter(a => !a.ativo).length
        this.alunosRecentes = alunos.slice(0, 5)

        const contagem = {}
        alunos.forEach(a => {
          const nome = a.planos?.nome || 'Sem plano'
          contagem[nome] = (contagem[nome] || 0) + 1
        })
        this.planosPopulares = Object.entries(contagem).map(([nome, qtd]) => ({
          nome,
          percent: Math.round((qtd / alunos.length) * 100)
        })).sort((a, b) => b.percent - a.percent).slice(0, 4)
      } catch (e) {
        console.error(e)
      } finally {
        this.carregando = false
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

.app {
  display: flex;
  min-height: 100vh;
  background: #000;
  font-family: sans-serif;
}

/* Sidebar */
.sidebar {
  width: 210px;
  background: #060606;
  border-right: 0.5px solid #1a1a1a;
  padding: 28px 0;
  display: flex;
  flex-direction: column;
}

.slogo {
  padding: 0 20px 24px;
  border-bottom: 0.5px solid #1a1a1a;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo-icon {
  width: 32px;
  height: 32px;
  background: #111;
  border: 0.5px solid #c9a84c;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #c9a84c;
  font-size: 16px;
  flex-shrink: 0;
}

.logo-txt {
  color: #f5f0e8;
  font-size: 12px;
  font-weight: 500;
  line-height: 1.4;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 20px;
  color: #444;
  font-size: 13px;
  cursor: pointer;
  text-decoration: none;
}

.nav-item i { font-size: 16px; }
.nav-item:hover { color: #888; background: #0a0a0a; }
.nav-item.active { color: #c9a84c; background: #0f0f0f; }

.sidebar-footer {
  margin-top: auto;
  padding: 0 20px;
}

.logout-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: 0.5px solid #1a1a1a;
  border-radius: 8px;
  color: #444;
  font-size: 13px;
  padding: 8px 14px;
  cursor: pointer;
  width: 100%;
}

.logout-btn:hover { border-color: #c9a84c; color: #c9a84c; }

/* Main */
.main {
  flex: 1;
  padding: 28px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow: hidden;
}

.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

h1 { color: #f5f0e8; font-size: 18px; font-weight: 500; margin: 0 0 4px; }
.page-sub { color: #333; font-size: 12px; margin: 0; }

.avatar {
  width: 34px;
  height: 34px;
  background: #111;
  border: 0.5px solid #c9a84c;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #c9a84c;
  font-size: 12px;
  font-weight: 500;
}

/* Cards */
.cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.card {
  background: #0a0a0a;
  border: 0.5px solid #1a1a1a;
  border-radius: 10px;
  padding: 18px;
}

.card-icon {
  width: 28px;
  height: 28px;
  background: #111;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
  color: #c9a84c;
  font-size: 14px;
}

.card-icon.inactive { color: #333; }
.card-label { color: #444; font-size: 11px; letter-spacing: .5px; margin-bottom: 8px; }
.card-val { color: #f5f0e8; font-size: 24px; font-weight: 500; }
.card-val.muted { color: #333; }
.card-delta { font-size: 11px; margin-top: 6px; }
.card-delta.up { color: #c9a84c; }
.card-delta.down { color: #333; }

/* Bottom */
.bottom {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 12px;
}

.panel {
  background: #0a0a0a;
  border: 0.5px solid #1a1a1a;
  border-radius: 10px;
  padding: 18px;
}

.panel-title {
  color: #f5f0e8;
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 0.5px solid #111;
}

.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 0.5px solid #0d0d0d;
}

.row:last-child { border-bottom: none; }
.row-name { color: #888; font-size: 12px; }
.row-plan { color: #333; font-size: 11px; margin-top: 2px; }

.badge {
  font-size: 10px;
  padding: 3px 10px;
  border-radius: 20px;
  border: 0.5px solid;
}

.badge.on { color: #c9a84c; border-color: #c9a84c; background: #0f0d00; }
.badge.off { color: #333; border-color: #222; background: #0a0a0a; }

.bar-wrap { display: flex; flex-direction: column; gap: 14px; }
.bar-row { display: flex; flex-direction: column; gap: 5px; }
.bar-label { display: flex; justify-content: space-between; color: #444; font-size: 11px; }
.bar-bg { background: #111; border-radius: 2px; height: 4px; }
.bar-fill { background: #c9a84c; border-radius: 2px; height: 4px; }

.loading { color: #333; font-size: 13px; text-align: center; padding: 20px; }

@media (max-width: 768px) {
  .app { flex-direction: column; }
  .sidebar { width: 100%; flex-direction: row; padding: 12px 16px; align-items: center; border-right: none; border-bottom: 0.5px solid #1a1a1a; }
  .slogo { padding: 0; border-bottom: none; margin-bottom: 0; }
  .slogo .logo-txt { display: none; }
  nav { display: flex; flex-direction: row; gap: 4px; margin-left: auto; }
  .nav-item { padding: 8px 10px; font-size: 0; }
  .nav-item i { font-size: 18px !important; }
  .sidebar-footer { margin-top: 0; padding: 0; }
  .cards { grid-template-columns: 1fr 1fr; }
  .bottom { grid-template-columns: 1fr; }
  .main { padding: 16px; gap: 14px; }
}
</style>