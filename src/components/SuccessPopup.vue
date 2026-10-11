<template>
  <Teleport to="body">
    <Transition name="subscribe-popup">
      <div v-if="modelValue" class="subscribe-popup-overlay" @click.self="close">
        <div class="subscribe-popup-box" role="dialog" aria-modal="true" aria-labelledby="success-popup-title">
          <button class="subscribe-popup-close" type="button" @click="close" aria-label="Close">
            &times;
          </button>

          <div class="subscribe-popup-icon">✓</div>
          <h3 id="success-popup-title" class="subscribe-popup-title">{{ title }}</h3>
          <p class="subscribe-popup-text">{{ message }}</p>

          <button class="subscribe-popup-btn" type="button" @click="close">{{ buttonText }}</button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
defineProps({
  modelValue: { type: Boolean, default: false },
  title: { type: String, default: "Sent " },
  message: { type: String, default: "Thanks for subscribing! You'll receive the latest offers via email." },
  buttonText: { type: String, default: "Got it" },
});

const emit = defineEmits(["update:modelValue"]);

function close() {
  emit("update:modelValue", false);
}
</script>

<style scoped lang="scss">
.subscribe-popup-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.subscribe-popup-box {
  position: relative;
  width: 100%;
  max-width: 400px;
  background: #fff;
  border-radius: 14px;
  padding: 36px 28px 28px;
  text-align: center;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.25);
}

.subscribe-popup-close {
  position: absolute;
  top: 10px;
  right: 14px;
  background: none;
  border: none;
  font-size: 1.8rem;
  line-height: 1;
  color: #888;
  cursor: pointer;

  &:hover {
    color: #111;
  }
}

.subscribe-popup-icon {
  width: 60px;
  height: 60px;
  margin: 0 auto 16px;
  border-radius: 50%;
  background: #e8f5e9;
  color: #2e7d32;
  font-size: 1.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.subscribe-popup-title {
  margin: 0 0 8px;
  font-size: 1.3rem;
  color: #111;
}

.subscribe-popup-text {
  margin: 0 0 22px;
  font-size: 0.95rem;
  color: #555;
}

.subscribe-popup-btn {
  padding: 10px 32px;
  border: none;
  border-radius: 8px;
  background: #111;
  color: #fff;
  font-size: 0.95rem;
  cursor: pointer;

  &:hover {
    background: #333;
  }
}

// Animation
.subscribe-popup-enter-active,
.subscribe-popup-leave-active {
  transition: opacity 0.25s ease;

  .subscribe-popup-box {
    transition: transform 0.25s ease;
  }
}

.subscribe-popup-enter-from,
.subscribe-popup-leave-to {
  opacity: 0;

  .subscribe-popup-box {
    transform: translateY(20px) scale(0.96);
  }
}
</style>