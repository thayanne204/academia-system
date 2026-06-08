<template>
  <div class="login-wrap">

    <div class="left">
      <div class="logo">
        <i class="ti ti-barbell"></i>
      </div>
      <h1>Academia System</h1>
      <p class="desc">Gestão completa de alunos,<br>planos e mensalidades.</p>
      <div class="stats">
        <div class="stat">
          <span class="sn">248</span>
          <span class="sl">alunos</span>
        </div>
        <div class="stat">
          <span class="sn">4</span>
          <span class="sl">planos</span>
        </div>
        <div class="stat">
          <span class="sn">12</span>
          <span class="sl">meses</span>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="bar"></div>
      <h2>{{ isRegister ? 'Criar conta' : 'Bem-vindo de volta' }}</h2>
      <p class="sub">{{ isRegister ? 'Preencha os dados abaixo' : 'Entre com suas credenciais' }}</p>

      <div v-if="erro" class="erro">{{ erro }}</div>

      <form @submit.prevent="submeter">
        <div v-if="isRegister" class="campo">
          <label>NOME</label>
          <div class="input-wrap">
            <input v-model="nome" type="text" placeholder="Seu nome completo" required />
            <i class="ti ti-user"></i>
          </div>
        </div>

        <div class="campo">
          <label>EMAIL</label>
          <div class="input-wrap">
            <input v-model="email" type="email" placeholder="seu@email.com" required />
            <i class="ti ti-mail"></i>
          </div>
        </div>

        <div class="campo">
          <label>SENHA</label>
          <div class="input-wrap">
            <input v-model="senha" type="password" placeholder="••••••••" required />
            <i class="ti ti-lock"></i>
          </div>
        </div>

        <button type="submit" :disabled="carregando">
          {{ carregando ? 'Aguarde...' : (isRegister ? 'Cadastrar' : 'Entrar') }}
        </button>
      </form>

      <div class="divider">
        <span></span>
        <p>ou</p>
        <span></span>
      </div>

      <p class="toggle" @click="isRegister = !isRegister">
        {{ isRegister ? 'Já tem conta? Entrar' : 'Não tem conta? Criar agora' }}
      </p>
    </div>

  </div>
</template>

<script>
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

export default {
  setup() {
    return {
      authStore: useAuthStore(),
      router: useRouter()
    }
  },
  data() {
    return {
      nome: '',
      email: '',
      senha: '',
      erro: '',
      carregando: false,
      isRegister: false
    }
  },
  methods: {
    async submeter() {
      this.erro = ''
      this.carregando = true
      try {
        if (this.isRegister) {
          await this.authStore.register(this.nome, this.email, this.senha)
          this.isRegister = false
        } else {
          await this.authStore.login(this.email, this.senha)
          this.router.push('/dashboard')
        }
      } catch (e) {
        this.erro = e.response?.data?.error || 'Erro ao entrar'
      } finally {
        this.carregando = false
      }
    }
  }
}
</script>

<style scoped>
@import url('https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css');

.login-wrap {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #000;
  gap: 64px;
  padding: 2rem;
}

.left {
  flex: 1;
  max-width: 260px;
}

.logo {
  width: 42px;
  height: 42px;
  background: #111;
  border: 0.5px solid #c9a84c;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
}

.logo i {
  font-size: 20px;
  color: #c9a84c;
}

h1 {
  color: #f5f0e8;
  font-size: 20px;
  font-weight: 500;
  margin: 0 0 10px;
}

.desc {
  color: #333;
  font-size: 13px;
  line-height: 1.8;
  margin: 0;
}

.stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-top: 2.5rem;
  padding-top: 2rem;
  border-top: 0.5px solid #1a1a1a;
}

.sn {
  color: #f5f0e8;
  font-size: 22px;
  font-weight: 500;
  display: block;
}

.sl {
  color: #333;
  font-size: 12px;
  margin-top: 2px;
  display: block;
}

.card {
  background: #0a0a0a;
  border: 0.5px solid #2a2a2a;
  border-radius: 14px;
  padding: 40px 36px;
  width: 320px;
}

.bar {
  width: 28px;
  height: 2px;
  background: #c9a84c;
  border-radius: 2px;
  margin-bottom: 24px;
}

h2 {
  color: #f5f0e8;
  font-size: 20px;
  font-weight: 500;
  margin: 0 0 6px;
}

.sub {
  color: #444;
  font-size: 13px;
  margin: 0 0 28px;
}

.campo {
  margin-bottom: 18px;
}

label {
  color: #555;
  font-size: 11px;
  letter-spacing: 1px;
  display: block;
  margin-bottom: 7px;
}

.input-wrap {
  position: relative;
}

.input-wrap input {
  width: 100%;
  background: #000;
  border: 0.5px solid #222;
  border-radius: 8px;
  padding: 12px 38px 12px 14px;
  color: #f5f0e8;
  font-size: 14px;
  box-sizing: border-box;
  outline: none;
}

.input-wrap input:focus {
  border-color: #c9a84c;
}

.input-wrap i {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #333;
  font-size: 16px;
}

button {
  width: 100%;
  background: #c9a84c;
  color: #000;
  border: none;
  border-radius: 8px;
  padding: 13px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  letter-spacing: .5px;
  margin-top: 4px;
}

button:hover {
  background: #d4b358;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.erro {
  background: #1a0000;
  border: 0.5px solid #ff4444;
  color: #ff6666;
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 13px;
  margin-bottom: 16px;
}

.divider {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 20px 0;
}

.divider span {
  flex: 1;
  height: 0.5px;
  background: #1a1a1a;
}

.divider p {
  color: #333;
  font-size: 12px;
  margin: 0;
}

.toggle {
  color: #c9a84c;
  text-align: center;
  font-size: 13px;
  cursor: pointer;
}

.toggle:hover {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .login-wrap {
    flex-direction: column;
    gap: 32px;
    padding: 2rem 1.2rem;
    justify-content: flex-start;
    padding-top: 3rem;
  }
  .left {
    max-width: 100%;
    text-align: center;
  }
  .logo {
    margin: 0 auto 24px;
  }
  .stats {
    margin-top: 1.5rem;
    padding-top: 1.5rem;
  }
  .card {
    width: 100%;
    padding: 28px 20px;
  }
}
</style>