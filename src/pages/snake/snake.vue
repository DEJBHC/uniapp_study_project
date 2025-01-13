<template>
  <view class="snake-container">
    <view class="game-wrapper">
      <!-- 游戏区域 -->
      <view class="game-area">
        <view class="game-grid"
              v-for="(row, rowIndex) in gameMatrix"
              :key="rowIndex">
          <view class="grid-cell"
                v-for="(cell, colIndex) in row"
                :key="colIndex"
                :class="{
                  'snake-head': isSnakeHead(rowIndex, colIndex),
                  'snake-body': isSnakeBody(rowIndex, colIndex),
                  'food': isFood(rowIndex, colIndex)
                }">
          </view>
        </view>
      </view>

      <!-- 控制区域 -->
      <view class="info-area">
        <view class="score-section">
          <text>得分: {{ score }}</text>
        </view>
        <view class="control-section">
          <button class="control-btn"
                  @click.stop="changeDirection('left')"
                  @touchstart.stop
                  @touchend.stop>←</button>
          <view class="vertical-controls">
            <button class="control-btn"
                    @click.stop="changeDirection('up')"
                    @touchstart.stop
                    @touchend.stop>↑</button>
            <button class="control-btn"
                    @click.stop="changeDirection('down')"
                    @touchstart.stop
                    @touchend.stop>↓</button>
          </view>
          <button class="control-btn"
                  @click.stop="changeDirection('right')"
                  @touchstart.stop
                  @touchend.stop>→</button>
        </view>
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

// 类型定义
type Direction = 'up' | 'down' | 'left' | 'right'
type Position = {
  x: number
  y: number
}

// 游戏配置
const GRID_SIZE = 20
const INITIAL_SPEED = 200
const SPEED_INCREASE = 10

// 游戏状态
const gameMatrix = ref<number[][]>(Array(GRID_SIZE).fill(0).map(() => Array(GRID_SIZE).fill(0)))
const snake = ref<Position[]>([{ x: 10, y: 10 }]) // 蛇的身体，第一个元素是头部
const food = ref<Position>({ x: 5, y: 5 })
const direction = ref<Direction>('right')
const nextDirection = ref<Direction>('right')
const score = ref(0)
const isPaused = ref(false)
const gameInterval = ref<number | null>(null)
const gameSpeed = ref(INITIAL_SPEED)

// 游戏控制方法
const startGame = () => {
  isPaused.value = false
  score.value = 0
  snake.value = [{ x: 10, y: 10 }]
  direction.value = 'right'
  nextDirection.value = 'right'
  generateFood()

  if (gameInterval.value) {
    clearInterval(gameInterval.value)
  }

  gameInterval.value = setInterval(() => {
    moveSnake()
  }, gameSpeed.value)
}

const generateFood = () => {
  let newFood: Position
  do {
    newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE)
    }
  } while (isSnakePosition(newFood))

  food.value = newFood
}

const isSnakePosition = (pos: Position): boolean => {
  return snake.value.some(segment => segment.x === pos.x && segment.y === pos.y)
}

const moveSnake = () => {
  if (isPaused.value) return

  // 更新方向
  direction.value = nextDirection.value

  // 计算新的头部位置
  const head = snake.value[0]
  const newHead = { ...head }

  switch (direction.value) {
    case 'up':
      newHead.y = (newHead.y - 1 + GRID_SIZE) % GRID_SIZE
      break
    case 'down':
      newHead.y = (newHead.y + 1) % GRID_SIZE
      break
    case 'left':
      newHead.x = (newHead.x - 1 + GRID_SIZE) % GRID_SIZE
      break
    case 'right':
      newHead.x = (newHead.x + 1) % GRID_SIZE
      break
  }

  // 检查是否撞到自己
  if (isSnakePosition(newHead)) {
    gameOver()
    return
  }

  // 移动蛇
  snake.value.unshift(newHead)

  // 检查是否吃到食物
  if (newHead.x === food.value.x && newHead.y === food.value.y) {
    score.value += 10
    generateFood()
    // 加快游戏速度
    if (gameSpeed.value > 50) {
      gameSpeed.value -= SPEED_INCREASE
      if (gameInterval.value) {
        clearInterval(gameInterval.value)
        gameInterval.value = setInterval(() => {
          moveSnake()
        }, gameSpeed.value)
      }
    }
  } else {
    snake.value.pop() // 如果没吃到食物，移除尾部
  }

  updateGameMatrix()
}

const updateGameMatrix = () => {
  // 清空矩阵
  gameMatrix.value = Array(GRID_SIZE).fill(0).map(() => Array(GRID_SIZE).fill(0))

  // 绘制蛇
  snake.value.forEach((segment, index) => {
    gameMatrix.value[segment.y][segment.x] = index === 0 ? 2 : 1 // 2表示头部，1表示身体
  })

  // 绘制食物
  gameMatrix.value[food.value.y][food.value.x] = 3 // 3表示食物
}

const changeDirection = (newDirection: Direction) => {
  // 防止反向移动
  const opposites = {
    up: 'down',
    down: 'up',
    left: 'right',
    right: 'left'
  }

  if (opposites[newDirection] !== direction.value) {
    nextDirection.value = newDirection
  }
}

const togglePause = () => {
  isPaused.value = !isPaused.value
}

const gameOver = () => {
  if (gameInterval.value) {
    clearInterval(gameInterval.value)
    gameInterval.value = null
  }

  uni.showModal({
    title: '游戏结束',
    content: `得分: ${score.value}\n是否重新开始？`,
    success: (res) => {
      if (res.confirm) {
        startGame()
      } else {
        uni.navigateBack()
      }
    }
  })
}

// 辅助方法
const isSnakeHead = (row: number, col: number): boolean => {
  return gameMatrix.value[row][col] === 2
}

const isSnakeBody = (row: number, col: number): boolean => {
  return gameMatrix.value[row][col] === 1
}

const isFood = (row: number, col: number): boolean => {
  return gameMatrix.value[row][col] === 3
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
</script>

<style>
.snake-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  box-sizing: border-box;
}

.game-wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
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
  width: 15px;
  height: 15px;
  border: 1px solid #ccc;
}

.snake-head {
  background-color: #4CAF50;
  border-radius: 4px;
}

.snake-body {
  background-color: #81C784;
}

.food {
  background-color: #F44336;
  border-radius: 50%;
}

.info-area {
  width: 100%;
  max-width: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.score-section {
  font-size: 18px;
  font-weight: bold;
}

.control-section {
  display: flex;
  align-items: center;
  gap: 10px;
}

.vertical-controls {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.control-btn {
  width: 44px;
  height: 44px;
  padding: 0;
  font-size: 20px;
  background-color: #2196F3;
  color: white;
  border: none;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pause-btn {
  width: 80px;
  height: 36px;
  font-size: 16px;
  background-color: #FF9800;
  color: white;
  border: none;
  border-radius: 8px;
}

.control-btn:active,
.pause-btn:active {
  opacity: 0.8;
}
</style>