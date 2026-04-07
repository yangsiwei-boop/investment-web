<template>
  <div class="file-upload">
    <div
      class="upload-area"
      :class="{ 'drag-over': isDragOver }"
      @click="triggerUpload"
      @dragover.prevent="isDragOver = true"
      @dragleave.prevent="isDragOver = false"
      @drop.prevent="handleDrop"
    >
      <input
        ref="inputRef"
        type="file"
        :accept="accept"
        :multiple="multiple"
        @change="handleFileChange"
        hidden
      />

      <div v-if="!uploading && !file" class="upload-content">
        <div class="icon">{{ icon }}</div>
        <h3>{{ title }}</h3>
        <p>{{ description }}</p>
        <p class="hint">{{ hint }}</p>
      </div>

      <div v-else-if="uploading" class="upload-progress">
        <el-progress type="circle" :percentage="progress" :width="80" />
        <p>上传中...</p>
      </div>

      <div v-else-if="file" class="uploaded-file">
        <div class="file-info">
          <div class="file-icon">{{ getFileIcon(file.name) }}</div>
          <div class="file-details">
            <div class="file-name">{{ file.name }}</div>
            <div class="file-size">{{ formatSize(file.size) }}</div>
          </div>
        </div>
        <div class="file-actions">
          <el-button size="small" @click.stop="previewFile">查看</el-button>
          <el-button size="small" type="danger" @click.stop="removeFile">删除</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

interface Props {
  title?: string
  description?: string
  hint?: string
  icon?: string
  accept?: string
  multiple?: boolean
  maxSize?: number // in MB
}

const props = withDefaults(defineProps<Props>(), {
  title: '点击或拖拽上传文件',
  description: '支持 PDF、PPT、PPTX 格式',
  hint: '文件大小不超过 50MB',
  icon: '📄',
  accept: '.pdf,.ppt,.pptx',
  multiple: false,
  maxSize: 50
})

const emit = defineEmits<{
  upload: [file: File]
  remove: []
}>()

const inputRef = ref<HTMLInputElement>()
const isDragOver = ref(false)
const uploading = ref(false)
const progress = ref(0)
const file = ref<File | null>(null)

function triggerUpload() {
  if (!uploading.value) {
    inputRef.value?.click()
  }
}

function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  const files = target.files
  if (files && files.length > 0) {
    processFile(files[0])
  }
}

function handleDrop(event: DragEvent) {
  isDragOver.value = false
  const files = event.dataTransfer?.files
  if (files && files.length > 0) {
    processFile(files[0])
  }
}

function processFile(selectedFile: File) {
  // 检查文件大小
  if (selectedFile.size > props.maxSize * 1024 * 1024) {
    ElMessage.error(`文件大小不能超过 ${props.maxSize}MB`)
    return
  }

  // 检查文件类型
  const ext = selectedFile.name.split('.').pop()?.toLowerCase()
  const acceptedExts = props.accept.split(',').map(e => e.replace('.', '').toLowerCase())
  if (!acceptedExts.includes(ext || '')) {
    ElMessage.error('不支持的文件格式')
    return
  }

  file.value = selectedFile
  emit('upload', selectedFile)
}

function getFileIcon(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase()
  switch (ext) {
    case 'pdf':
      return '📕'
    case 'ppt':
    case 'pptx':
      return '📊'
    case 'doc':
    case 'docx':
      return '📄'
    case 'xls':
    case 'xlsx':
      return '📊'
    case 'jpg':
    case 'jpeg':
    case 'png':
      return '🖼️'
    default:
      return '📄'
  }
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

function previewFile() {
  if (file.value) {
    const url = URL.createObjectURL(file.value)
    window.open(url, '_blank')
  }
}

function removeFile() {
  file.value = null
  if (inputRef.value) {
    inputRef.value.value = ''
  }
  emit('remove')
}

// 暴露方法供父组件调用
function setProgress(value: number) {
  progress.value = value
  uploading.value = value < 100
}

function reset() {
  file.value = null
  progress.value = 0
  uploading.value = false
  if (inputRef.value) {
    inputRef.value.value = ''
  }
}

defineExpose({
  setProgress,
  reset
})
</script>

<style scoped lang="scss">
.file-upload {
  width: 100%;
}

.upload-area {
  border: 2px dashed #d1d5db;
  border-radius: 12px;
  padding: 24px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  background: #f9fafb;

  &:hover {
    border-color: #667eea;
    background: #f5f3ff;
  }

  &.drag-over {
    border-color: #667eea;
    background: #f0f0ff;
  }
}

.upload-content {
  .icon {
    font-size: 40px;
    margin-bottom: 12px;
  }

  h3 {
    color: #374151;
    font-size: 15px;
    font-weight: 600;
    margin-bottom: 6px;
  }

  p {
    color: #6b7280;
    font-size: 13px;
    margin-bottom: 4px;
  }

  .hint {
    color: #9ca3af;
    font-size: 12px;
  }
}

.upload-progress {
  padding: 20px;

  p {
    color: #6b7280;
    font-size: 14px;
    margin-top: 12px;
  }
}

.uploaded-file {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.file-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.file-icon {
  font-size: 24px;
}

.file-details {
  text-align: left;
}

.file-name {
  font-size: 14px;
  color: #374151;
  font-weight: 500;
}

.file-size {
  font-size: 12px;
  color: #9ca3af;
  margin-top: 2px;
}

.file-actions {
  display: flex;
  gap: 8px;
}
</style>
