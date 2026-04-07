<template>
  <div class="empty-state">
    <div class="icon">{{ icon }}</div>
    <h4>{{ title }}</h4>
    <p v-if="description">{{ description }}</p>
    <el-button
      v-if="actionText"
      type="primary"
      @click="$emit('action')"
    >
      {{ actionText }}
    </el-button>
  </div>
</template>

<script setup lang="ts">
interface Props {
  icon?: string
  title: string
  description?: string
  actionText?: string
}

withDefaults(defineProps<Props>(), {
  icon: '📭'
})

defineEmits<{
  action: []
}>()
</script>

<style scoped lang="scss">
.empty-state {
  text-align: center;
  padding: 60px 20px;

  .icon {
    font-size: 64px;
    margin-bottom: 16px;
  }

  h4 {
    color: #374151;
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 8px;
  }

  p {
    color: #6b7280;
    font-size: 14px;
    margin-bottom: 20px;
  }
}
</style>
