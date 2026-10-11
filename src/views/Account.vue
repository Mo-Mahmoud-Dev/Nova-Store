<script setup>
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/stores/auth'

const router = useRouter()
const { user, updateUser, logout } = useAuth()

/* ------------------------------ Profile ------------------------------ */
const profile = reactive({ name: user.value?.name ?? '', email: user.value?.email ?? '' })
const profileSaving = ref(false)
const profileMessage = ref({ type: '', text: '' })

const profileErrors = computed(() => {
  const e = {}
  if (!profile.name.trim()) e.name = 'Enter your name.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) e.email = 'Enter a valid email address, like name@example.com.'
  return e
})
const profileDirty = computed(
  () => profile.name !== user.value?.name || profile.email !== user.value?.email
)

/* ------------------------------ Password ----------------------------- */
const pw = reactive({ current: '', next: '', confirm: '' })
const pwSaving = ref(false)
const pwMessage = ref({ type: '', text: '' })

const pwErrors = computed(() => {
  const e = {}
  if (!pw.current) e.current = 'Enter your current password.'
  if (pw.next.length < 8) e.next = 'Use at least 8 characters.'
  if (pw.confirm !== pw.next) e.confirm = 'Passwords don’t match.'
  return e
})

/* ------------------------------ Delete ------------------------------- */
const confirmingDelete = ref(false)
const deleteText = ref('')
const deleting = ref(false)
const canDelete = computed(() => deleteText.value.trim().toLowerCase() === 'delete')

/* ------------------------------------------------------------------ */
/* TODO: replace these stubs with your real API calls.                 */
/* ------------------------------------------------------------------ */
const api = {
  async updateProfile(data) {
    // await fetch('/api/account', { method: 'PATCH', body: JSON.stringify(data), ... })
    await new Promise((r) => setTimeout(r, 500))
    return { ...data }
  },
  async changePassword() {
    // await fetch('/api/account/password', { method: 'POST', ... })
    await new Promise((r) => setTimeout(r, 500))
  },
  async signOut() {
    await new Promise((r) => setTimeout(r, 200))
  },
  async deleteAccount() {
    await new Promise((r) => setTimeout(r, 600))
  },
}

async function saveProfile() {
  profileMessage.value = { type: '', text: '' }
  if (Object.keys(profileErrors.value).length) return
  profileSaving.value = true
  try {
    const updated = await api.updateProfile({ name: profile.name.trim(), email: profile.email.trim() })
    updateUser(updated)
    profileMessage.value = { type: 'success', text: 'Profile saved.' }
  } catch (err) {
    profileMessage.value = { type: 'error', text: err?.message || 'Couldn’t save your profile. Try again.' }
  } finally {
    profileSaving.value = false
  }
}

function resetProfile() {
  profile.name = user.value?.name ?? ''
  profile.email = user.value?.email ?? ''
  profileMessage.value = { type: '', text: '' }
}

async function savePassword() {
  pwMessage.value = { type: '', text: '' }
  if (Object.keys(pwErrors.value).length) {
    pwMessage.value = { type: 'error', text: Object.values(pwErrors.value)[0] }
    return
  }
  pwSaving.value = true
  try {
    await api.changePassword({ current: pw.current, next: pw.next })
    pw.current = pw.next = pw.confirm = ''
    pwMessage.value = { type: 'success', text: 'Password changed.' }
  } catch (err) {
    pwMessage.value = { type: 'error', text: err?.message || 'Couldn’t change your password. Try again.' }
  } finally {
    pwSaving.value = false
  }
}

async function signOut() {
  await api.signOut()
  logout()
  router.push({ name: 'Authentication' })
}

async function deleteAccount() {
  if (!canDelete.value) return
  deleting.value = true
  try {
    await api.deleteAccount()
    logout()
    router.push({ name: 'home' })
  } finally {
    deleting.value = false
  }
}

const initials = computed(() =>
  (user.value?.name || '?')
    .split(/\s+/)
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
)
</script>

<template>
  <main class="account">
    <header class="account__head">
      <div class="avatar" aria-hidden="true">{{ initials }}</div>
      <div>
        <h1>Your account</h1>
        <p class="muted">{{ user.email }}</p>
      </div>
      <button type="button" class="btn btn--ghost account__signout" @click="signOut">Sign out</button>
    </header>

    <!-- Profile -->
    <section class="card" aria-labelledby="profile-title">
      <h2 id="profile-title">Profile</h2>
      <form novalidate @submit.prevent="saveProfile">
        <div class="field">
          <label for="acc-name">Name</label>
          <input id="acc-name" v-model="profile.name" type="text" autocomplete="name" :aria-invalid="!!profileErrors.name" />
          <p v-if="profileErrors.name" class="field__error">{{ profileErrors.name }}</p>
        </div>
        <div class="field">
          <label for="acc-email">Email</label>
          <input id="acc-email" v-model="profile.email" type="email" autocomplete="email" :aria-invalid="!!profileErrors.email" />
          <p v-if="profileErrors.email" class="field__error">{{ profileErrors.email }}</p>
        </div>

        <p v-if="profileMessage.text" :class="['msg', `msg--${profileMessage.type}`]" role="status">
          {{ profileMessage.text }}
        </p>

        <div class="actions">
          <button class="btn" type="submit" :disabled="!profileDirty || profileSaving">
            {{ profileSaving ? 'Saving…' : 'Save changes' }}
          </button>
          <button class="btn btn--ghost" type="button" :disabled="!profileDirty" @click="resetProfile">Discard</button>
        </div>
      </form>
    </section>

    <!-- Password -->
    <section class="card" aria-labelledby="pw-title">
      <h2 id="pw-title">Password</h2>
      <form novalidate @submit.prevent="savePassword">
        <div class="field">
          <label for="pw-current">Current password</label>
          <input id="pw-current" v-model="pw.current" type="password" autocomplete="current-password" />
        </div>
        <div class="field">
          <label for="pw-next">New password</label>
          <input id="pw-next" v-model="pw.next" type="password" autocomplete="new-password" />
          <p class="field__hint">Use at least 8 characters.</p>
        </div>
        <div class="field">
          <label for="pw-confirm">Confirm new password</label>
          <input id="pw-confirm" v-model="pw.confirm" type="password" autocomplete="new-password" />
        </div>

        <p v-if="pwMessage.text" :class="['msg', `msg--${pwMessage.type}`]" role="status">{{ pwMessage.text }}</p>

        <div class="actions">
          <button class="btn" type="submit" :disabled="pwSaving">
            {{ pwSaving ? 'Changing…' : 'Change password' }}
          </button>
        </div>
      </form>
    </section>

    <!-- Danger zone -->
    <section class="card card--danger" aria-labelledby="danger-title">
      <h2 id="danger-title">Delete account</h2>
      <p class="muted">
        This permanently removes your account and all of its data. You can’t undo this.
      </p>

      <button v-if="!confirmingDelete" type="button" class="btn btn--danger" @click="confirmingDelete = true">
        Delete account
      </button>

      <form v-else class="confirm" @submit.prevent="deleteAccount">
        <div class="field">
          <label for="del-confirm">Type <strong>delete</strong> to confirm</label>
          <input id="del-confirm" v-model="deleteText" type="text" autocomplete="off" />
        </div>
        <div class="actions">
          <button class="btn btn--danger" type="submit" :disabled="!canDelete || deleting">
            {{ deleting ? 'Deleting…' : 'Delete my account' }}
          </button>
          <button class="btn btn--ghost" type="button" @click="((confirmingDelete = false), (deleteText = ''))">
            Cancel
          </button>
        </div>
      </form>
    </section>
  </main>
</template>

<style scoped>
.account {
  --ink: #1b2a2f;
  --muted: #5d6b70;
  --line: #d5dcde;
  --surface: #ffffff;
  --page: #eef2f2;
  --accent: #0f6b66;
  --accent-ink: #ffffff;
  --danger: #b3261e;
  --danger-bg: #fbeceb;
  --ok: #1d6b3a;
  --ok-bg: #e8f4ec;

  min-height: 100vh;
  padding: 32px 16px 56px;
  background: var(--page);
  color: var(--ink);
  font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
}
.account > * {
  max-width: 640px;
  margin-left: auto;
  margin-right: auto;
}

.account__head {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}
.account__head h1 {
  margin: 0;
  font-size: 1.5rem;
  line-height: 1.25;
}
.account__head p {
  margin: 2px 0 0;
}
.account__signout {
  margin-left: auto;
}

.avatar {
  flex: none;
  width: 52px;
  height: 52px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: var(--accent);
  color: var(--accent-ink);
  font-weight: 600;
  font-size: 1.1rem;
}

.card {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 10px;
  padding: 24px;
  margin-bottom: 20px;
}
.card h2 {
  margin: 0 0 16px;
  font-size: 1.1rem;
}
.card--danger {
  border-color: #e3b5b2;
}
.card--danger h2 {
  color: var(--danger);
  margin-bottom: 6px;
}
.card--danger .muted {
  margin: 0 0 16px;
}

.muted {
  color: var(--muted);
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
.field input[aria-invalid='true'] {
  border-color: var(--danger);
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

.msg {
  margin: 0 0 16px;
  padding: 10px 12px;
  border-radius: 6px;
  font-size: 0.925rem;
}
.msg--success {
  background: var(--ok-bg);
  color: var(--ok);
}
.msg--error {
  background: var(--danger-bg);
  color: var(--danger);
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.btn {
  padding: 10px 16px;
  font: inherit;
  font-weight: 600;
  color: var(--accent-ink);
  background: var(--accent);
  border: 1px solid var(--accent);
  border-radius: 6px;
  cursor: pointer;
}
.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.btn--ghost {
  color: var(--ink);
  background: transparent;
  border-color: var(--line);
}
.btn--danger {
  background: var(--danger);
  border-color: var(--danger);
}

.account :is(button, input):focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

@media (max-width: 520px) {
  .account__head {
    flex-wrap: wrap;
  }
  .account__signout {
    margin-left: 0;
  }
  .card {
    padding: 18px;
  }
}
</style>