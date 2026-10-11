<template>
  <Teleport to="body">
    <Transition name="popup-fade">
      <div
        v-if="modelValue"
        class="popup-overlay"
        @click.self="close"
      >
        <Transition name="popup-scale" appear>
          <div v-if="modelValue" class="popup-box" role="dialog" aria-modal="true">
            <!-- Header -->
            <div class="popup-header">
              <slot name="header">
                <h3 class="popup-title">Quick View</h3>
                <button class="popup-close" type="button" @click="close" aria-label="Close">
                  &times;
                </button>
              </slot>
            </div>

            <!-- Body -->
            <div class="popup-body">
              <slot></slot>
            </div>

            <!-- Footer -->
            <div v-if="$slots.footer" class="popup-footer">
              <slot name="footer"></slot>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { watch, onBeforeUnmount } from "vue";

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue"]);

function close() {
  emit("update:modelValue", false);
}

// Prevent background scroll while the popup is open
function lockScroll(locked) {
  document.body.style.overflow = locked ? "hidden" : "";
}

// Close on Escape
function onKeydown(e) {
  if (e.key === "Escape") close();
}

watch(
  () => props.modelValue,
  (isOpen, wasOpen) => {
    // Only touch body scroll / listeners when the state actually matters,
    // so a closed popup never clobbers another component's scroll lock.
    if (isOpen) {
      lockScroll(true);
      document.addEventListener("keydown", onKeydown);
    } else if (wasOpen) {
      lockScroll(false);
      document.removeEventListener("keydown", onKeydown);
    }
  },
  { immediate: true }
);

onBeforeUnmount(() => {
  document.removeEventListener("keydown", onKeydown);
  if (props.modelValue) lockScroll(false);
});

defineExpose({ close });
</script>

<style scoped>
.popup-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: rgba(15, 15, 15, 0.55);
  backdrop-filter: blur(2px);
}

.popup-box {
  width: 100%;
  max-width: 900px;
  max-height: 90vh;
  overflow-y: auto;
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
}

.popup-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid #eee;
  position: sticky;
  top: 0;
  background: #fff;
  z-index: 1;
}

.popup-title {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
}

.popup-close {
  border: none;
  background: transparent;
  font-size: 1.6rem;
  line-height: 1;
  cursor: pointer;
  color: #444;
  padding: 4px 8px;
  border-radius: 6px;
  transition: background 0.2s ease, color 0.2s ease;
}

.popup-close:hover {
  background: #f2f2f2;
  color: #000;
}

.popup-body {
  padding: 24px;
  flex: 1;
}

.popup-footer {
  padding: 16px 24px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  position: sticky;
  bottom: 0;
  background: #fff;
}

/* Overlay fade transition */
.popup-fade-enter-active,
.popup-fade-leave-active {
  transition: opacity 0.25s ease;
}
.popup-fade-enter-from,
.popup-fade-leave-to {
  opacity: 0;
}

/* Box scale + fade transition */
.popup-scale-enter-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.popup-scale-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.popup-scale-enter-from,
.popup-scale-leave-to {
  opacity: 0;
  transform: scale(0.94) translateY(10px);
}
.popup-scale-enter-to,
.popup-scale-leave-from {
  opacity: 1;
  transform: scale(1) translateY(0);
}

@media (max-width: 640px) {
  .popup-box {
    max-height: 95vh;
    border-radius: 10px;
  }
  .popup-header,
  .popup-body,
  .popup-footer {
    padding: 16px;
  }
}
</style>