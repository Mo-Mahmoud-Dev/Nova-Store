<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '@/stores/auth'

/**
 * Emits:
 *  - authenticated(user)  -> fired after a successful sign in / sign up.
 *    Handle it in the parent to store the session and redirect, e.g.
 *    <Authentication @authenticated="onAuth" />
 */
const emit = defineEmits(['authenticated'])
const router = useRouter()
const route = useRoute()
const { login } = useAuth()

const mode = ref('signin') // 'signin' | 'signup'
const isSignup = computed(() => mode.value === 'signup')

const form = reactive({ name: '', email: '', password: '', confirm: '' })
const touched = reactive({ name: false, email: false, password: false, confirm: false })
const showPassword = ref(false)
const loading = ref(false)
const serverError = ref('')

const errors = computed(() => {
  const e = {}
  if (isSignup.value && !form.name.trim()) e.name = 'Enter your name.'
  if (!form.email.trim()) e.email = 'Enter your email address.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email address, like name@example.com.'
  if (!form.password) e.password = 'Enter your password.'
  else if (isSignup.value && form.password.length < 8) e.password = 'Use at least 8 characters.'
  if (isSignup.value && form.confirm !== form.password) e.confirm = 'Passwords don’t match.'
  return e
})

const isValid = computed(() => Object.keys(errors.value).length === 0)

function show(field) {
  return touched[field] && errors.value[field]
}

function setMode(next) {
  mode.value = next
  serverError.value = ''
  Object.keys(touched).forEach((k) => (touched[k] = false))
}

watch(() => [form.email, form.password], () => (serverError.value = ''))

/* ------------------------------------------------------------------ */
/* TODO: replace these with your real API calls.                       */
/* Each should resolve with the user object or throw an Error whose    */
/* message is safe to show to the person.                              */
/* ------------------------------------------------------------------ */
async function signIn({ email, password }) {
  // const res = await fetch('/api/auth/login', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ email, password }),
  // })
  // if (!res.ok) throw new Error('Email or password is incorrect.')
  // return res.json()
  await new Promise((r) => setTimeout(r, 600))
  return { name: email.split('@')[0], email }
}

async function signUp({ name, email, password }) {
  // const res = await fetch('/api/auth/register', { ... })
  await new Promise((r) => setTimeout(r, 600))
  return { name, email }
}

async function submit() {
  Object.keys(touched).forEach((k) => (touched[k] = true))
  if (!isValid.value || loading.value) return

  loading.value = true
  serverError.value = ''
  try {
    const user = isSignup.value
      ? await signUp({ name: form.name.trim(), email: form.email.trim(), password: form.password })
      : await signIn({ email: form.email.trim(), password: form.password })
    login(user)
    emit('authenticated', user)
    // Go back to the page the person wanted, or to their account
    router.push(route.query.redirect || { name: 'account' })
  } catch (err) {
    serverError.value = err?.message || 'Something went wrong. Try again in a moment.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main class="auth">
    <section class="auth__panel" aria-labelledby="auth-title">
      <div class="auth__tabs" role="tablist" aria-label="Authentication mode">
        <button
          type="button"
          role="tab"
          :aria-selected="!isSignup"
          :class="['auth__tab', { 'is-active': !isSignup }]"
          @click="setMode('signin')"
        >
          Sign in
        </button>
        <button
          type="button"
          role="tab"
          :aria-selected="isSignup"
          :class="['auth__tab', { 'is-active': isSignup }]"
          @click="setMode('signup')"
        >
          Create account
        </button>
      </div>

      <h1 id="auth-title" class="auth__title">
        {{ isSignup ? 'Create your account' : 'Welcome back' }}
      </h1>
      <p class="auth__lead">
        {{ isSignup ? 'It takes less than a minute.' : 'Sign in to continue to your account.' }}
      </p>

      <p v-if="serverError" class="auth__alert" role="alert">{{ serverError }}</p>

      <form novalidate @submit.prevent="submit">
        <div v-if="isSignup" class="field">
          <label for="name">Name</label>
          <input
            id="name"
            v-model="form.name"
            type="text"
            autocomplete="name"
            :aria-invalid="!!show('name')"
            aria-describedby="name-error"
            @blur="touched.name = true"
          />
          <p v-if="show('name')" id="name-error" class="field__error">{{ errors.name }}</p>
        </div>

        <div class="field">
          <label for="email">Email</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            autocomplete="email"
            inputmode="email"
            :aria-invalid="!!show('email')"
            aria-describedby="email-error"
            @blur="touched.email = true"
          />
          <p v-if="show('email')" id="email-error" class="field__error">{{ errors.email }}</p>
        </div>

        <div class="field">
          <div class="field__row">
            <label for="password">Password</label>
            <a v-if="!isSignup" class="link" href="/forgot-password">Forgot password?</a>
          </div>
          <div class="field__control">
            <input
              id="password"
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              :autocomplete="isSignup ? 'new-password' : 'current-password'"
              :aria-invalid="!!show('password')"
              aria-describedby="password-error"
              @blur="touched.password = true"
            />
            <button
              type="button"
              class="field__toggle"
              :aria-pressed="showPassword"
              @click="showPassword = !showPassword"
            >
              {{ showPassword ? 'Hide' : 'Show' }}
            </button>
          </div>
          <p v-if="show('password')" id="password-error" class="field__error">{{ errors.password }}</p>
          <p v-else-if="isSignup" class="field__hint">Use at least 8 characters.</p>
        </div>

        <div v-if="isSignup" class="field">
          <label for="confirm">Confirm password</label>
          <input
            id="confirm"
            v-model="form.confirm"
            :type="showPassword ? 'text' : 'password'"
            autocomplete="new-password"
            :aria-invalid="!!show('confirm')"
            aria-describedby="confirm-error"
            @blur="touched.confirm = true"
          />
          <p v-if="show('confirm')" id="confirm-error" class="field__error">{{ errors.confirm }}</p>
        </div>

        <button class="btn" type="submit" :disabled="loading">
          <span v-if="loading" class="spinner" aria-hidden="true"></span>
          {{ loading ? (isSignup ? 'Creating account…' : 'Signing in…') : isSignup ? 'Create account' : 'Sign in' }}
        </button>
      </form>

      <p class="auth__switch">
        <template v-if="isSignup">
          Already have an account?
          <button type="button" class="link" @click="setMode('signin')">Sign in</button>
        </template>
        <template v-else>
          New here?
          <button type="button" class="link" @click="setMode('signup')">Create an account</button>
        </template>
      </p>
    </section>
  </main>
</template>

<style scoped>
.auth {
  --ink: #1b2a2f;
  --muted: #5d6b70;
  --line: #d5dcde;
  --surface: #ffffff;
  --page: #eef2f2;
  --accent: #0f6b66;
  --accent-ink: #ffffff;
  --danger: #b3261e;
  --danger-bg: #fbeceb;

  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px 16px;
  background: var(--page);
  color: var(--ink);
  font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
}

.auth__panel {
  width: 100%;
  max-width: 420px;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 10px;
  padding: 28px;
}

.auth__tabs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  border-bottom: 1px solid var(--line);
  margin-bottom: 24px;
}

.auth__tab {
  appearance: none;
  background: none;
  border: 0;
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
  padding: 10px 0;
  font: inherit;
  font-weight: 500;
  color: var(--muted);
  cursor: pointer;
}
.auth__tab.is-active {
  color: var(--ink);
  border-bottom-color: var(--accent);
}

.auth__title {
  margin: 0 0 4px;
  font-size: 1.5rem;
  line-height: 1.25;
}
.auth__lead {
  margin: 0 0 20px;
  color: var(--muted);
}

.auth__alert {
  margin: 0 0 16px;
  padding: 10px 12px;
  border-radius: 6px;
  background: var(--danger-bg);
  color: var(--danger);
  font-size: 0.925rem;
}

.field {
  margin-bottom: 16px;
}
.field label {
  display: block;
  margin-bottom: 6px;
  font-size: 0.925rem;
  font-weight: 500;
}
.field__row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}
.field__row .link {
  font-size: 0.875rem;
}
.field__control {
  position: relative;
}
.field input {
  width: 100%;
  box-sizing: border-box;
  padding: 10px 12px;
  font: inherit;
  color: inherit;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 6px;
}
.field__control input {
  padding-right: 64px;
}
.field input[aria-invalid='true'] {
  border-color: var(--danger);
}
.field__toggle {
  position: absolute;
  top: 50%;
  right: 6px;
  transform: translateY(-50%);
  background: none;
  border: 0;
  padding: 6px 8px;
  font: inherit;
  font-size: 0.875rem;
  color: var(--accent);
  cursor: pointer;
}
.field__error,
.field__hint {
  margin: 6px 0 0;
  font-size: 0.85rem;
}
.field__error {
  color: var(--danger);
}
.field__hint {
  color: var(--muted);
}

.btn {
  width: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 8px;
  padding: 11px 16px;
  font: inherit;
  font-weight: 600;
  color: var(--accent-ink);
  background: var(--accent);
  border: 0;
  border-radius: 6px;
  cursor: pointer;
}
.btn:disabled {
  opacity: 0.7;
  cursor: progress;
}

.spinner {
  width: 14px;
  height: 14px;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.auth__switch {
  margin: 20px 0 0;
  text-align: center;
  color: var(--muted);
  font-size: 0.925rem;
}

.link {
  background: none;
  border: 0;
  padding: 0;
  font: inherit;
  color: var(--accent);
  text-decoration: underline;
  text-underline-offset: 2px;
  cursor: pointer;
}

.auth :is(button, input, a):focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

@media (prefers-reduced-motion: reduce) {
  .spinner {
    animation-duration: 2s;
  }
}
@media (max-width: 480px) {
  .auth__panel {
    padding: 20px;
  }
}
</style>