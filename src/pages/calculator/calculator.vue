<template>
  <view class="calculator"
        @touchstart="handleTouchStart"
        @touchmove="handleTouchMove"
        @touchend="handleTouchEnd">
    <view style="margin-top: 15px" class="custom-nav">
      <view class="nav-left" @tap="gotoClock">
        <text class="back-icon">计算器</text>
      </view>
      <view class="nav-right" @tap="gotoPlay">
        <text class="back-icon">休息一下</text>
      </view>
    </view>
    <!-- 显示区域 -->
    <view class="display">
      <text class="history">{{ history }}</text>
      <text class="current">{{ current || '0' }}</text>
    </view>

    <!-- 按键区域 -->
    <view class="keypad">
      <!-- 第一行 -->
      <view class="key-row">
        <button class="key function" @tap="clear">C</button>
        <button class="key function" @tap="toggleSign">±</button>
        <button class="key function" @tap="percentage">%</button>
        <button class="key operator" @tap="setOperation('÷')">÷</button>
      </view>
      <!-- 第二行 -->
      <view class="key-row">
        <button class="key number" @tap="appendNumber('7')">7</button>
        <button class="key number" @tap="appendNumber('8')">8</button>
        <button class="key number" @tap="appendNumber('9')">9</button>
        <button class="key operator" @tap="setOperation('×')">×</button>
      </view>

      <!-- 第三行 -->
      <view class="key-row">
        <button class="key number" @tap="appendNumber('4')">4</button>
        <button class="key number" @tap="appendNumber('5')">5</button>
        <button class="key number" @tap="appendNumber('6')">6</button>
        <button class="key operator" @tap="setOperation('-')">-</button>
      </view>

      <!-- 第四行 -->
      <view class="key-row">
        <button class="key number" @tap="appendNumber('1')">1</button>
        <button class="key number" @tap="appendNumber('2')">2</button>
        <button class="key number" @tap="appendNumber('3')">3</button>
        <button class="key operator" @tap="setOperation('+')">+</button>
      </view>

      <!-- 第五行 -->
      <view class="key-row">
        <button class="key number double" @tap="appendNumber('0')">0</button>
        <button class="key number" @tap="appendDecimal">.</button>
        <button class="key operator" @tap="calculate">=</button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 状态
const current = ref('')
const previous = ref('')
const operation = ref<string | null>(null)
const operationClicked = ref(false)
const history = ref('')

// 添加数字
const appendNumber = (number: string) => {
  if (operationClicked.value) {
    current.value = ''
    operationClicked.value = false
  }
  if (current.value === '0' && number !== '0') {
    current.value = number
  } else {
    current.value += number
  }
}
// 添加滑动相关状态
const touchStart = ref<{ x: number; y: number } | null>(null)
const swipeThreshold = 50

// 滑动处理方法
const handleTouchStart = (event: TouchEvent) => {
  const touch = event.touches[0]
  touchStart.value = {
    x: touch.clientX,
    y: touch.clientY
  }
}

const handleTouchMove = (event: TouchEvent) => {
  if (!touchStart.value) return

  const touch = event.touches[0]
  const deltaX = touch.clientX - touchStart.value.x
  const deltaY = touch.clientY - touchStart.value.y

  // 如果水平滑动距离大于垂直滑动距离，阻止页面滚动
  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    event.preventDefault()
  }
}
const handleTouchEnd = (event: TouchEvent) => {
  if (!touchStart.value) return

  const touch = event.changedTouches[0]
  const deltaX = touch.clientX - touchStart.value.x

  // 检测左滑
  if (deltaX < -swipeThreshold) {
    uni.navigateTo({
      url: '/pages/scientific/scientific'
    })
  }

  touchStart.value = null
}
// 添加小数点
const appendDecimal = () => {
  if (operationClicked.value) {
    current.value = '0'
  }
  if (current.value.indexOf('.') === -1) {
    current.value = current.value + '.'
  }
  operationClicked.value = false
}

// 清除
const clear = () => {
  current.value = ''
  previous.value = ''
  operation.value = null
  history.value = ''
  operationClicked.value = false
}

// 切换正负号
const toggleSign = () => {
  current.value = current.value.charAt(0) === '-' ?
      current.value.slice(1) :
      '-' + current.value
}
const gotoClock = () => {
  uni.navigateTo({
    url: '/pages/clock/clock'
  })
}
const gotoPlay = () => {
  uni.navigateTo({
    url: '/pages/index/index'
  })
}
// 百分比
const percentage = () => {
  current.value = String(parseFloat(current.value) / 100)
}

// 设置运算符
const setOperation = (op: string) => {
  if (current.value === '') return
  if (previous.value !== '') {
    calculate()
  }
  operation.value = op
  previous.value = current.value
  operationClicked.value = true
  history.value = `${previous.value} ${operation.value}`
}

// 计算结果
const calculate = () => {
  if (operation.value === null || previous.value === '' || current.value === '') return

  let result = 0
  const prev = parseFloat(previous.value)
  const curr = parseFloat(current.value)

  switch (operation.value) {
    case '+':
      result = prev + curr
      break
    case '-':
      result = prev - curr
      break
    case '×':
      result = prev * curr
      break
    case '÷':
      if (curr === 0) {
        uni.showToast({
          title: '除数不能为零',
          icon: 'none'
        })
        return
      }
      result = prev / curr
      break
  }

  history.value = `${previous.value} ${operation.value} ${current.value} =`
  current.value = String(result)
  previous.value = ''
  operation.value = null
  operationClicked.value = false
}
</script>

<style>
.calculator {
  padding-top: calc(var(--status-bar-height) + 44px);
  background-color: #f5f5f5;
  height: 100vh;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.display {
  background-color: #fff;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  min-height: 120px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-end;
}

.history {
  font-size: 16px;
  color: #666;
  margin-bottom: 10px;
  min-height: 20px;
}

.current {
  font-size: 36px;
  font-weight: bold;
  color: #333;
  word-break: break-all;
}

.keypad {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.key-row {
  display: flex;
  gap: 10px;
  flex: 1;
}

.key {
  flex: 1;
  border: none;
  border-radius: 10px;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.key:active {
  opacity: 0.8;
  transform: scale(0.98);
}

.number {
  background-color: #fff;
  color: #333;
}

.operator {
  background-color: #007AFF;
  color: #fff;
}

.function {
  background-color: #e0e0e0;
  color: #333;
}

.double {
  flex: 2.1;
}

/* 适配暗黑模式 */
@media (prefers-color-scheme: dark) {
  .calculator {
    background-color: #1a1a1a;
  }

  .display {
    background-color: #2c2c2c;
  }

  .history {
    color: #999;
  }

  .current {
    color: #fff;
  }

  .number {
    background-color: #2c2c2c;
    color: #fff;
  }

  .function {
    background-color: #404040;
    color: #fff;
  }
}
.title {
  padding: 10px 0;
  text-align: center;
  font-size: 18px;
  color: #333;
  margin-bottom: 10px;
}
@media (prefers-color-scheme: dark) {
  .custom-nav{
    background-color: #1a1a1a;
  }
  .title {
    color: #fff;
  }
}
.custom-nav {
  padding-top: var(--status-bar-height);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 999;
  background-color: #f5f5f5;
  display: flex; /* 使用 Flexbox */
  justify-content: space-between; /* 子元素之间分配空间 */
  align-items: center; /* 垂直居中对齐 */
  height: 44px; /* 设置一个固定高度 */
  padding: 0 15px; /* 给左右两边留出一些空间 */
}

.nav-left, .nav-right {
  display: flex;
  align-items: center; /* 确保内部文本垂直居中 */
}

.back-icon {
  font-size: 16px; /* 调整字体大小 */
  color: #333;
}
.title {
  flex: 1;
  height: 44px;
  line-height: 44px;
  text-align: center;
  font-size: 18px;
  color: #333;
}
.back-icon {
  font-size: 20px;
  color: #333;
}
.title {
  height: 44px;
  line-height: 44px;
  text-align: center;
  font-size: 18px;
  color: #333;
  display: block;
}

</style>