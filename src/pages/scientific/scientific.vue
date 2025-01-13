<template>
  <view class="scientific-calculator">
    <view class="custom-nav">
      <view class="nav-left" @tap="goBack">
        <text class="back-icon">←</text>
      </view>
      <text class="title">科学计算器</text>
    </view>
    <!-- 显示区域 -->
    <view class="display">
      <text class="history">{{ history }}</text>
      <!-- 添加输入提示 -->
      <text class="input-hint" v-if="inputHint">{{ inputHint }}</text>
      <text class="current">{{ current || '0' }}</text>
    </view>

    <!-- 函数选择区域 -->
    <scroll-view class="function-tabs" scroll-x>
      <view class="tab-container">
        <view class="tab"
              v-for="(tab, index) in tabs"
              :key="index"
              :class="{ active: currentTab === index }"
              @tap="switchTab(index)">
          {{ tab }}
        </view>
      </view>
    </scroll-view>

    <!-- 函数按键区域 -->
    <view class="function-pad">
      <template v-if="currentTab === 0">
        <!-- 三角函数 -->
        <view class="function-row">
          <button class="function-key" @tap="calculate('sin')">sin</button>
          <button class="function-key" @tap="calculate('cos')">cos</button>
          <button class="function-key" @tap="calculate('tan')">tan</button>
        </view>
      </template>

      <template v-if="currentTab === 1">
        <!-- 指数函数 -->
        <view class="function-row">
          <button class="function-key" @tap="calculate('exp')">eˣ</button>
          <button class="function-key" @tap="calculate('pow2')">x²</button>
          <button class="function-key" @tap="calculate('pow3')">x³</button>
          <button class="function-key" @tap="calculate('powY')">xʸ</button>
        </view>
      </template>

      <template v-if="currentTab === 2">
        <!-- 反三角函数 -->
        <view class="function-row">
          <button class="function-key" @tap="calculate('asin')">sin⁻¹</button>
          <button class="function-key" @tap="calculate('acos')">cos⁻¹</button>
          <button class="function-key" @tap="calculate('atan')">tan⁻¹</button>
        </view>
      </template>

      <template v-if="currentTab === 3">
        <!-- 双曲函数 -->
        <view class="function-row">
          <button class="function-key" @tap="calculate('sinh')">sinh</button>
          <button class="function-key" @tap="calculate('cosh')">cosh</button>
          <button class="function-key" @tap="calculate('tanh')">tanh</button>
        </view>
      </template>

      <template v-if="currentTab === 4">
        <!-- 反双曲函数 -->
        <view class="function-row">
          <button class="function-key" @tap="calculate('asinh')">sinh⁻¹</button>
          <button class="function-key" @tap="calculate('acosh')">cosh⁻¹</button>
          <button class="function-key" @tap="calculate('atanh')">tanh⁻¹</button>
        </view>
      </template>

      <template v-if="currentTab === 5">
        <!-- 对数函数 -->
        <view class="function-row">
          <button class="function-key" @tap="calculate('ln')">ln</button>
          <button class="function-key" @tap="calculate('log10')">log₁₀</button>
          <button class="function-key" @tap="calculate('log2')">log₂</button>
          <button class="function-key" @tap="calculate('logx')">logₓ</button>
        </view>
      </template>
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
        <button class="key operator" @tap="calculate()">=</button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
// 添加输入状态提示
const inputHint = ref('')
// 状态定义
const current = ref('')
const previous = ref('')
const operation = ref<string | null>(null)
const operationClicked = ref(false)
const history = ref('')
const currentTab = ref(0)
const waitingForSecondNumber = ref(false)
const pendingFunction = ref<string>('')
const baseNumber = ref<number>(0)

// 标签页定义
const tabs = [
  '三角函数',
  '指数函数',
  '反三角函数',
  '双曲函数',
  '反双曲函数',
  '对数函数'
]
const goBack = () => {
  uni.navigateBack()
}
// 切换标签页
const switchTab = (index: number) => {
  currentTab.value = index
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
  if (current.value === '') return
  current.value = current.value.charAt(0) === '-' ?
      current.value.slice(1) :
      '-' + current.value
}

// 百分比
const percentage = () => {
  if (current.value === '') return
  current.value = String(parseFloat(current.value) / 100)
}

// 设置运算符
const setOperation = (op: string) => {
  if (current.value === '') return
  if (previous.value !== '') {
    calculateBasic()
  }
  operation.value = op
  previous.value = current.value
  operationClicked.value = true
  history.value = `${previous.value} ${operation.value}`
}

// 添加滑动相关状态和处理方法
const touchStart = ref<{ x: number; y: number } | null>(null)
const swipeThreshold = 50

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

  // 检测右滑返回
  if (deltaX > swipeThreshold) {
    uni.navigateBack()
  }

  touchStart.value = null
}

// 处理键盘事件
const handleKeyboard = (event: KeyboardEvent) => {
  const key = event.key

  // 数字键
  if (/^[0-9]$/.test(key)) {
    appendNumber(key)
    return
  }

  // 运算符
  switch (key) {
    case '+':
    case '-':
      setOperation(key)
      break
    case '*':
      setOperation('×')
      break
    case '/':
      setOperation('÷')
      break
    case 'Enter':
    case '=':
      calculate()
      break
    case '.':
      appendDecimal()
      break
    case 'Escape':
      clear()
      break
    case 'Backspace':
      if (current.value.length > 0) {
        current.value = current.value.slice(0, -1)
      }
      break
  }
}

// 在组件挂载时添加键盘事件监听
onMounted(() => {
  window.addEventListener('keydown', handleKeyboard)
})

// 在组件卸载时移除键盘事件监听
onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyboard)
})

// 修改 calculate 函数
const calculate = (func?: string) => {
  // 如果没有传入函数名，说明是按了等号
  if (!func) {
    // 首先检查是否在等待第二个数字（用于指数和对数计算）
    if (waitingForSecondNumber.value) {
      const secondNumber = parseFloat(current.value || '0')
      const firstNumber = baseNumber.value
      let result: number

      try {
        switch (pendingFunction.value) {
          case 'logx':
            if (secondNumber <= 0) {
              throw new Error('参数必须大于0')
            }
            // 使用换底公式：logₐb = ln(b) / ln(a)
            result = Math.log(secondNumber) / Math.log(firstNumber)
            history.value = `log${firstNumber}(${secondNumber})`
            break
          case 'powerY':
            result = Math.pow(firstNumber, secondNumber)
            history.value = `${firstNumber}^${secondNumber}`
            break
          default:
            return
        }
        current.value = result.toString()
      } catch (error) {
        uni.showToast({
          title: error instanceof Error ? error.message : '计算错误',
          icon: 'none'
        })
      }

      // 重置状态
      waitingForSecondNumber.value = false
      pendingFunction.value = ''
      baseNumber.value = 0
      inputHint.value = '' // 清除输入提示
      return
    }

    // 如果不是在等待第二个数字，则执行基础计算
    calculateBasic()
    return
  }

  // 如果传入了函数名，执行对应的科学计算
  const value = parseFloat(current.value || '0')
  let result: number

  try {
    switch (func) {
        // 三角函数
      case 'sin':
        result = Math.sin(value)
        break
      case 'cos':
        result = Math.cos(value)
        break
      case 'tan':
        result = Math.tan(value)
        break
      case 'cot':
        result = 1 / Math.tan(value)
        break

        // 指数函数
      case 'exp':
        result = Math.exp(value)
        break
      case 'pow2':
        result = Math.pow(value, 2)
        break
      case 'pow3':
        result = Math.pow(value, 3)
        break
      case 'powY':
        inputPowerY()
        return

        // 反三角函数
      case 'asin':
        result = Math.asin(value)
        break
      case 'acos':
        result = Math.acos(value)
        break
      case 'atan':
        result = Math.atan(value)
        break
      case 'acot':
        result = Math.PI / 2 - Math.atan(value)
        break

        // 双曲函数
      case 'sinh':
        result = Math.sinh(value)
        break
      case 'cosh':
        result = Math.cosh(value)
        break
      case 'tanh':
        result = Math.tanh(value)
        break
      case 'coth':
        result = 1 / Math.tanh(value)
        break

        // 反双曲函数
      case 'asinh':
        result = Math.asinh(value)
        break
      case 'acosh':
        result = Math.acosh(value)
        break
      case 'atanh':
        result = Math.atanh(value)
        break
      case 'acoth':
        result = Math.atanh(1 / value)
        break

        // 对数函数
      case 'ln':
        if (value <= 0) throw new Error('参数必须大于0')
        result = Math.log(value)
        break
      case 'log10':
        if (value <= 0) throw new Error('参数必须大于0')
        result = Math.log10(value)
        break
      case 'log2':
        if (value <= 0) throw new Error('参数必须大于0')
        result = Math.log2(value)
        break
      case 'logx':
        inputLogBase()
        return

      default:
        return
    }

    history.value = `${func}(${value})`
    current.value = result.toString()
  } catch (error) {
    uni.showToast({
      title: error instanceof Error ? error.message : '计算错误',
      icon: 'none'
    })
  }
}

// 基础计算
const calculateBasic = () => {
  if (operation.value === null || previous.value === '' || current.value === '') return

  let result = 0
  const prev = parseFloat(previous.value)
  const curr = parseFloat(current.value)

  try {
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
          throw new Error('除数不能为零')
        }
        result = prev / curr
        break
      default:
        return
    }

    history.value = `${previous.value} ${operation.value} ${current.value} =`
    current.value = result.toString()
    previous.value = ''
    operation.value = null
    operationClicked.value = false

  } catch (error) {
    uni.showToast({
      title: error instanceof Error ? error.message : '计算错误',
      icon: 'none'
    })
  }
}

// 添加数字
const appendNumber = (number: string) => {
  // 如果刚点击过运算符，清空当前值并开始新的输入
  if (operationClicked.value) {
    current.value = ''
    operationClicked.value = false
  }

  // 处理数字最大长度限制（防止溢出）
  if (current.value.length >= 16) {
    uni.showToast({
      title: '数字长度超出限制',
      icon: 'none'
    })
    return
  }

  // 处理首位数字为0的情况
  if (current.value === '0' && number !== '.') {
    current.value = number
    return
  }

  // 处理负数0的情况
  if (current.value === '-0' && number !== '.') {
    current.value = '-' + number
    return
  }

  // 正常追加数字
  current.value += number
}

// 处理自定义底数的对数
const inputLogBase = () => {
  const value = parseFloat(current.value || '0')
  if (value <= 0) {
    uni.showToast({
      title: '底数必须大于0',
      icon: 'none'
    })
    return
  }

  baseNumber.value = value
  waitingForSecondNumber.value = true
  pendingFunction.value = 'logx'
  history.value = `log${value}(`
  current.value = ''
  // 添加输入提示
  inputHint.value = '请输入真数'

  // 显示提示信息
  uni.showToast({
    title: '请输入真数',
    icon: 'none',
    duration: 2000
  })
}

// 处理y次幂
const inputPowerY = () => {
  const value = parseFloat(current.value || '0')
  baseNumber.value = value
  waitingForSecondNumber.value = true
  pendingFunction.value = 'powerY'
  history.value = `${value}^(`
  current.value = ''
  // 添加输入提示
  inputHint.value = '请输入指数'

  // 显示提示信息
  uni.showToast({
    title: '请输入指数',
    icon: 'none',
    duration: 2000
  })
}
</script>

<style>
.scientific-calculator {
  padding-top: calc(var(--status-bar-height) + 44px);
  background-color: #f5f5f5;
  height: 100vh;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.function-tabs {
  white-space: nowrap;
  margin-bottom: 10px;
}

.tab-container {
  display: inline-flex;
  padding: 5px;
}

.tab {
  padding: 8px 15px;
  margin: 0 5px;
  background-color: #fff;
  border-radius: 15px;
  font-size: 14px;
  color: #333;
}

.tab.active {
  background-color: #007AFF;
  color: #fff;
}
.custom-nav {
  padding-top: var(--status-bar-height);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 999;
  background-color: #f5f5f5;
  display: flex;
  align-items: center;
}

.nav-left {
  padding: 0 15px;
  height: 44px;
  display: flex;
  align-items: center;
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
.function-pad {
  margin-bottom: 10px;
}

.function-row {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.function-key {
  flex: 1;
  height: 40px;
  border: none;
  border-radius: 8px;
  background-color: #4CAF50;
  color: #fff;
  font-size: 14px;
}

/* 继承基础计算器的其他样式 */
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
.key-row {
  display: flex;
  gap: 10px;
  flex: 1;
}
.keypad {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* 暗黑模式支持 */
@media (prefers-color-scheme: dark) {
  .scientific-calculator {
    background-color: #1a1a1a;
  }

  .tab {
    background-color: #2c2c2c;
    color: #fff;
  }

  .function-key {
    background-color: #2c2c2c;
  }
}
.calculator {
  padding: 20px;
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

.input-hint {
  font-size: 14px;
  color: #666;
  margin-bottom: 5px;
}

/* 暗黑模式 */
@media (prefers-color-scheme: dark) {
  .input-hint {
    color: #999;
  }
  .custom-nav {
    background-color: #1a1a1a;
  }

  .title {
    color: #fff;
  }

  .back-icon {
    color: #fff;
  }
}
</style>