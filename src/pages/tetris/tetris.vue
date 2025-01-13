<template>

  <view class="game-container"
        @touchstart="handleTouchStart"
        @touchmove="handleTouchMove"
        @touchend="handleTouchEnd">
    <view class="game-wrapper">
      <!-- 游戏主区域 -->
      <view class="game-area" :class="{ paused: isPaused }">
        <view class="game-grid"
              v-for="(row, rowIndex) in gameMatrix"
              :key="rowIndex">
          <view class="grid-cell"
                v-for="(cell, colIndex) in row"
                :key="colIndex"
                :class="[cell ? `piece-${cell}` : '']">
          </view>
        </view>

        <!-- 暂停遮罩 -->
        <view v-if="isPaused" class="pause-overlay">
          <text>已暂停</text>
          <text class="tip">点击屏幕继续</text>
        </view>
      </view>

      <!-- 信息和控制区域 -->
      <view class="info-area">
        <!-- 左移按钮 -->
        <button class="control-btn"
                @click.stop="moveLeft"
                @touchstart.stop
                @touchend.stop>←</button>

        <!-- 预览和分数区域 -->
        <view class="preview-section">
          <text class="preview-title">下一个</text>
          <view class="preview-grid">
            <view class="preview-row"
                  v-for="(row, rowIndex) in previewMatrix"
                  :key="rowIndex">
              <view class="preview-cell"
                    v-for="(cell, colIndex) in row"
                    :key="colIndex"
                    :class="[cell ? `piece-${nextPieceType}` : '']">
              </view>
            </view>
          </view>
          <view class="score-info">
            <text>已消除行数：{{ clearedLines }}</text>
          </view>
        </view>

        <!-- 右移按钮 -->
        <button class="control-btn"
                @click.stop="moveRight"
                @touchstart.stop
                @touchend.stop>→</button>
      </view>

      <!-- 旋转和暂停按钮区域 -->
      <view class="action-buttons">
        <button class="rotate-btn"
                @click.stop="rotate"
                @touchstart.stop
                @touchend.stop>旋转</button>
        <button class="pause-btn"
                @click.stop="togglePause"
                @touchstart.stop
                @touchend.stop>
          {{ isPaused ? '继续' : '暂停' }}
        </button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

// 定义类型
type Position = {
  x: number
  y: number
}

type TouchInfo = {
  x: number
  y: number
}

type TetrominoType = 'I' | 'J' | 'L' | 'O' | 'S' | 'T' | 'Z'

interface Tetromino {
  shape: number[][]
  type: TetrominoType
}

// 定义俄罗斯方块形状
const TETROMINOES: Record<TetrominoType, Tetromino> = {
  I: {
    shape: [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ],
    type: 'I'
  },
  J: {
    shape: [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0]
    ],
    type: 'J'
  },
  L: {
    shape: [
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0]
    ],
    type: 'L'
  },
  O: {
    shape: [
      [1, 1],
      [1, 1]
    ],
    type: 'O'
  },
  S: {
    shape: [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0]
    ],
    type: 'S'
  },
  T: {
    shape: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0]
    ],
    type: 'T'
  },
  Z: {
    shape: [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0]
    ],
    type: 'Z'
  }
}

// 状态定义
const gameMatrix = ref<(TetrominoType | 0)[][]>(Array(20).fill(0).map(() => Array(10).fill(0)))
const fixedBlocks = ref<(TetrominoType | 0)[][]>(Array(20).fill(0).map(() => Array(10).fill(0)))
const currentPiece = ref<number[][]>([])
const currentPieceType = ref<TetrominoType>('I')
const currentPiecePosition = ref<Position>({ x: 0, y: 0 })
const nextPiece = ref<number[][]>([])
const nextPieceType = ref<TetrominoType>('I')
const previewMatrix = ref<number[][]>(Array(4).fill(0).map(() => Array(4).fill(0)))
const clearedLines = ref(0)
const isPaused = ref(false)
const gameInterval = ref<number | null>(null)
const gameSpeed = ref(1000)

// 触摸相关状态
const touchStart = ref<TouchInfo | null>(null)
const touchStartTime = ref(0)
const lastMoveTime = ref(0)
const moveDelay = 150
const swipeThreshold = 40
const tapTimeout = 200
const doubleTapTimeout = 300
const lastTapTime = ref(0)
const isSwiping = ref(false)
const hasMoved = ref(false)
const touchStartPosition = ref<TouchInfo | null>(null)

// 游戏控制方法
const startGame = () => {
  isPaused.value = false
  generateNewPiece()
  generateNextPiece()
  if (gameInterval.value) {
    clearInterval(gameInterval.value)
  }
  gameInterval.value = setInterval(() => {
    moveDown()
  }, gameSpeed.value)
}

const resetGame = () => {
  if (gameInterval.value) {
    clearInterval(gameInterval.value)
    gameInterval.value = null
  }
  fixedBlocks.value = Array(20).fill(0).map(() => Array(10).fill(0))
  gameMatrix.value = Array(20).fill(0).map(() => Array(10).fill(0))
  previewMatrix.value = Array(4).fill(0).map(() => Array(4).fill(0))
  clearedLines.value = 0
  nextPiece.value = []
  isPaused.value = false
  startGame()
}

const gameOver = () => {
  if (gameInterval.value) {
    clearInterval(gameInterval.value)
    gameInterval.value = null
  }
  uni.showModal({
    title: '游戏结束',
    content: '是否重新开始？',
    success: (res) => {
      if (res.confirm) {
        resetGame()
      } else {
        uni.navigateBack()
      }
    }
  })
}

// 生命周期钩子
onMounted(() => {
  startGame()
})

onBeforeUnmount(() => {
  if (gameInterval.value) {
    clearInterval(gameInterval.value)
  }
})

// 移动方法
const moveLeft = () => {
  if (!isPaused.value && canMove(-1, 0)) {
    currentPiecePosition.value.x--
    updateGameMatrix()
    vibrateOnMove()
  }
}

const moveRight = () => {
  if (!isPaused.value && canMove(1, 0)) {
    currentPiecePosition.value.x++
    updateGameMatrix()
    vibrateOnMove()
  }
}

const moveDown = () => {
  if (isPaused.value) return

  if (canMove(0, 1)) {
    currentPiecePosition.value.y++
    updateGameMatrix()
    vibrateOnMove()
  } else {
    fixPiece()
    if (currentPiecePosition.value.y <= 0) {
      gameOver()
      return
    }
    generateNewPiece()
  }
}

// 其他必要的方法实现...
const canMove = (offsetX: number, offsetY: number): boolean => {
  for (let y = 0; y < currentPiece.value.length; y++) {
    for (let x = 0; x < currentPiece.value[y].length; x++) {
      if (currentPiece.value[y][x]) {
        const newX = x + currentPiecePosition.value.x + offsetX
        const newY = y + currentPiecePosition.value.y + offsetY

        if (newX < 0 || newX >= 10 || newY >= 20) {
          return false
        }

        if (newY >= 0 && fixedBlocks.value[newY][newX]) {
          return false
        }
      }
    }
  }
  return true
}

const vibrateOnMove = () => {
  uni.vibrateShort({
    success: function () {
      console.log('振动成功')
    }
  })
}

// 游戏矩阵更新方法
const updateGameMatrix = () => {
  // 创建新矩阵，复制已固定的方块
  gameMatrix.value = fixedBlocks.value.map(row => [...row])

  // 将当前活动方块添加到游戏矩阵
  for (let y = 0; y < currentPiece.value.length; y++) {
    for (let x = 0; x < currentPiece.value[y].length; x++) {
      if (currentPiece.value[y][x]) {
        const matrixY = y + currentPiecePosition.value.y
        const matrixX = x + currentPiecePosition.value.x
        if (matrixY >= 0 && matrixY < 20 && matrixX >= 0 && matrixX < 10) {
          gameMatrix.value[matrixY][matrixX] = currentPieceType.value
        }
      }
    }
  }
}

// 预览矩阵更新方法
const updatePreviewMatrix = () => {
  previewMatrix.value = Array(4).fill(0).map(() => Array(4).fill(0))

  const offsetX = Math.floor((4 - nextPiece.value[0].length) / 2)
  const offsetY = Math.floor((4 - nextPiece.value.length) / 2)

  for (let y = 0; y < nextPiece.value.length; y++) {
    for (let x = 0; x < nextPiece.value[y].length; x++) {
      if (nextPiece.value[y][x]) {
        previewMatrix.value[y + offsetY][x + offsetX] = 1
      }
    }
  }
}

// 方块旋转相关方法
const rotate = () => {
  if (!isPaused.value) {
    const rotatedPiece = getRotatedPiece()
    if (canRotate(rotatedPiece) || tryWallKick(rotatedPiece)) {
      currentPiece.value = rotatedPiece
      updateGameMatrix()
      vibrateOnMove()
    }
  }
}

const getRotatedPiece = (): number[][] => {
  const piece = currentPiece.value
  const N = piece.length
  const rotated = Array(N).fill(0).map(() => Array(N).fill(0))

  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      rotated[x][N - 1 - y] = piece[y][x]
    }
  }

  return rotated
}

const canRotate = (rotatedPiece: number[][]): boolean => {
  for (let y = 0; y < rotatedPiece.length; y++) {
    for (let x = 0; x < rotatedPiece[y].length; x++) {
      if (rotatedPiece[y][x]) {
        const newX = x + currentPiecePosition.value.x
        const newY = y + currentPiecePosition.value.y

        if (newX < 0 || newX >= 10 || newY >= 0 && newY >= 20) {
          return false
        }

        if (newY >= 0 && fixedBlocks.value[newY][newX]) {
          return false
        }
      }
    }
  }
  return true
}

const tryWallKick = (rotatedPiece: number[][]): boolean => {
  // 尝试左移
  currentPiecePosition.value.x--
  if (canRotate(rotatedPiece)) return true

  // 尝试右移
  currentPiecePosition.value.x += 2
  if (canRotate(rotatedPiece)) return true

  // 还原位置
  currentPiecePosition.value.x--
  return false
}

// 方块固定和消行相关方法
const fixPiece = () => {
  for (let y = 0; y < currentPiece.value.length; y++) {
    for (let x = 0; x < currentPiece.value[y].length; x++) {
      if (currentPiece.value[y][x]) {
        const matrixY = y + currentPiecePosition.value.y
        const matrixX = x + currentPiecePosition.value.x
        if (matrixY >= 0 && matrixY < 20 && matrixX >= 0 && matrixX < 10) {
          fixedBlocks.value[matrixY][matrixX] = currentPieceType.value
        }
      }
    }
  }
  checkAndClearLines()
}

const checkAndClearLines = () => {
  let linesCleared = 0

  for (let y = 19; y >= 0; y--) {
    if (isLineComplete(y)) {
      clearLine(y)
      linesCleared++
      y++ // 重新检查当前行
    }
  }

  if (linesCleared > 0) {
    clearedLines.value += linesCleared
  }
}

const isLineComplete = (y: number): boolean => {
  return fixedBlocks.value[y].every(cell => cell !== 0)
}

const clearLine = (y: number) => {
  for (let i = y; i > 0; i--) {
    fixedBlocks.value[i] = [...fixedBlocks.value[i - 1]]
  }
  fixedBlocks.value[0] = Array(10).fill(0)
}

// 游戏暂停控制
const togglePause = () => {
  if (isPaused.value) {
    resumeGame()
  } else {
    pauseGame()
  }
}

const pauseGame = () => {
  if (gameInterval.value) {
    clearInterval(gameInterval.value)
    gameInterval.value = null
  }
  isPaused.value = true
}

const resumeGame = () => {
  if (!gameInterval.value) {
    gameInterval.value = setInterval(() => {
      moveDown()
    }, gameSpeed.value)
  }
  isPaused.value = false
}

// 触摸事件处理方法
const handleTouchStart = (event: TouchEvent) => {
  if (event.touches.length !== 1) return

  const touch = event.touches[0]
  touchStart.value = {
    x: touch.clientX,
    y: touch.clientY
  }
  touchStartPosition.value = {
    x: touch.clientX,
    y: touch.clientY
  }
  touchStartTime.value = Date.now()
  isSwiping.value = false
  hasMoved.value = false
}

const handleTouchMove = (event: TouchEvent) => {
  if (!touchStart.value || event.touches.length !== 1 || hasMoved.value) return

  const touch = event.touches[0]
  const deltaX = touch.clientX - touchStartPosition.value!.x
  const deltaY = touch.clientY - touchStartPosition.value!.y

  if (Math.abs(deltaX) > swipeThreshold || Math.abs(deltaY) > swipeThreshold) {
    isSwiping.value = true
    event.preventDefault()

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > 0) {
        moveRight()
      } else {
        moveLeft()
      }
    } else {
      if (deltaY > 0) {
        moveDown()
      }
    }

    hasMoved.value = true
  }
}

const handleTouchEnd = (event: TouchEvent) => {
  if (!touchStart.value) return

  // 检查事件目标是否是按钮
  const target = event.target as HTMLElement
  if (target.tagName.toLowerCase() === 'button') {
    return
  }

  const touchDuration = Date.now() - touchStartTime.value

  if (!isSwiping.value && touchDuration < tapTimeout) {
    const currentTime = Date.now()
    const timeSinceLastTap = currentTime - lastTapTime.value

    if (timeSinceLastTap < doubleTapTimeout) {
      rotate()
      lastTapTime.value = 0
    } else {
      lastTapTime.value = currentTime
    }
  }

  touchStart.value = null
  hasMoved.value = false
  isSwiping.value = false
}

// 生成新方块
const generateNewPiece = () => {
  // 如果有下一个方块，使用它
  if (nextPiece.value.length) {
    currentPiece.value = JSON.parse(JSON.stringify(nextPiece.value)) // 深拷贝防止引用
    currentPieceType.value = nextPieceType.value
  } else {
    // 第一次生成方块时
    const pieces = Object.keys(TETROMINOES) as TetrominoType[]
    const randomPiece = pieces[Math.floor(Math.random() * pieces.length)]
    currentPiece.value = JSON.parse(JSON.stringify(TETROMINOES[randomPiece].shape))
    currentPieceType.value = randomPiece
  }

  // 设置方块初始位置（居中）
  currentPiecePosition.value = {
    x: Math.floor((10 - currentPiece.value[0].length) / 2),
    y: 0
  }

  // 生成下一个方块
  generateNextPiece()

  // 更新游戏矩阵显示
  updateGameMatrix()
}

// 生成下一个方块
const generateNextPiece = () => {
  const pieces = Object.keys(TETROMINOES) as TetrominoType[]
  const randomPiece = pieces[Math.floor(Math.random() * pieces.length)]
  nextPiece.value = JSON.parse(JSON.stringify(TETROMINOES[randomPiece].shape))
  nextPieceType.value = randomPiece
  updatePreviewMatrix()
}

// 导出所有需要的方法和状态
defineExpose({
  moveLeft,
  moveRight,
  moveDown,
  rotate,
  togglePause,
  startGame,
  resetGame,
  handleTouchStart,
  handleTouchMove,
  handleTouchEnd,
  isPaused,
  gameMatrix,
  previewMatrix,
  clearedLines,
  nextPieceType
})
</script>

<style>
.game-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 100vw;
  overflow: hidden;
  padding: 10px;
  touch-action: none; /* 防止浏览器默认触摸行为 */
  user-select: none; /* 防止文本选择 */
  -webkit-user-select: none;
  -webkit-touch-callout: none;
  box-sizing: border-box;
}

.game-wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.game-area {
  border: 2px solid #333;
  background-color: #f0f0f0;
  width: fit-content;
}

.game-grid {
  display: flex;
}

.grid-cell {
  width: 20px; /* 从30px减小到20px */
  height: 20px; /* 从30px减小到20px */
  border: 1px solid #ccc;
}

.grid-cell.active {
  background-color: #007AFF;
}

.control-area {
  margin-top: 10px;
}

.control-row {
  display: flex;
  justify-content: center;
  gap: 5px;
  margin: 5px 0;
}

.control-row button {
  width: 40px; /* 从60px减小到40px */
  height: 40px; /* 从60px减小到40px */
  font-size: 14px;
  padding: 0;
}

.score-info {
  font-size: 14px;
  margin: 5px 0;
}

.preview-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 5px;
  border: 2px solid #333;
  background-color: #f8f8f8;
}

.preview-title {
  font-size: 16px;
  margin-bottom: 10px;
  color: #333;
}

.preview-grid {
  width: 80px;
  height: 80px;
  margin: 0 5px;
  background-color: #fff;
  border: 1px solid #ccc;
}

.preview-row {
  display: flex;
  height: 20px; /* 从30px减小到20px */
}

.preview-cell {
  width: 20px; /* 从30px减小到20px */
  height: 20px; /* 从30px减小到20px */
  border: 1px solid #eee;
}

.preview-cell.active {
  background-color: #007AFF;
}

/* 方块颜色样式 */
.piece-I {
  background-color: #00f0f0; /* 青色 */
  border: 1px solid #00d0d0;
}

.piece-J {
  background-color: #0000f0; /* 蓝色 */
  border: 1px solid #0000d0;
}

.piece-L {
  background-color: #f0a000; /* 橙色 */
  border: 1px solid #d08000;
}

.piece-O {
  background-color: #f0f000; /* 黄色 */
  border: 1px solid #d0d000;
}

.piece-S {
  background-color: #00f000; /* 绿色 */
  border: 1px solid #00d000;
}

.piece-T {
  background-color: #a000f0; /* 紫色 */
  border: 1px solid #8000d0;
}

.piece-Z {
  background-color: #f00000; /* 红色 */
  border: 1px solid #d00000;
}

/* 给方块添加渐变效果 */
.grid-cell[class*="piece-"],
.preview-cell[class*="piece-"] {
  background-image: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.1) 50%, transparent 50%, transparent 100%);
  box-shadow: inset 0 0 8px rgba(0,0,0,0.1);
}

.pause-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 18px; /* 从24px减小到18px */
  z-index: 100;
}

.pause-overlay .tip {
  font-size: 12px; /* 从16px减小到12px */
  margin-top: 5px;
  opacity: 0.8;
}

.game-controls {
  margin-top: 10px;
  display: flex;
  justify-content: center;
}

.control-btn {
  padding: 6px 15px;
  font-size: 14px;
  background-color: #007AFF;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.control-btn:hover {
  background-color: #0056b3;
}

.paused .grid-cell {
  transition: opacity 0.3s;
  opacity: 0.5;
}

.info-area {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 10px;
  width: 100%;
  max-width: 300px;
}

.preview-section {
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.control-btn {
  width: 40px;
  height: 40px;
  font-size: 18px;
  padding: 0;
  border-radius: 20px;
  background-color: #007AFF;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  flex-shrink: 0;
}

.control-btn:active {
  background-color: #0056b3;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 10px;
}

.rotate-btn, .pause-btn {
  width: 50px;
  height: 35px;
  font-size: 14px;
  padding: 0;
  border-radius: 5px;
  background-color: #007AFF;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
}

.preview-grid {
  width: 80px;
  height: 80px;
  margin: 0 5px;
}

/* 确保整体布局不超出屏幕 */
.game-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 100vw;
  overflow: hidden;
  padding: 10px;
  box-sizing: border-box;
}

.game-wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* 确保按钮有足够的点击区域 */
.control-btn {
  min-width: 44px;
  min-height: 44px;
  padding: 10px;
  margin: 0 5px;
  touch-action: manipulation; /* 优化触摸操作 */
}

.rotate-btn,
.pause-btn {
  min-width: 44px;
  min-height: 35px;
  padding: 8px;
  margin: 0 5px;
  touch-action: manipulation;
}
</style>