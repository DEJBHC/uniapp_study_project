<template>
  <view class="clock-container">
    <view class="custom-nav">
      <view class="nav-left" @tap="goBack">
        <text class="back-icon">←</text>
      </view>
      <text class="title" @click="gotoCalender">时钟</text>
    </view>
    <!-- 翻页时钟部分 -->
    <!-- ... 其他代码保持不变 ... -->
    <view class="flip-container">
      <view class="flip-items" v-for="(unit,unitIndex) of timeArr" :key="unitIndex">
        <view class="item" v-for="(item,index) of unit.max + 1" :key="index"
              :class="{current: unit.current == index, past: unit.current - 1 == index || index==unit.max&&unit.current==0}">
          <view class="up">
            <view class="inner">{{index}}</view>
            <view class="shadow"></view>
          </view>
          <view class="down">
            <view class="inner">{{index}}</view>
            <view class="shadow"></view>
          </view>
        </view>
      </view>
    </view>
    <!-- 数字时钟部分 -->
    <view class="digital-clock">
      <text class="date">{{ currentDate }}</text>
      <text class="time">{{ currentTime }}</text>
    </view>

    <!-- 圆盘时钟部分 -->
    <view class="analog-clock">
      <!-- 时钟刻度 -->
      <view class="hour-marks">
        <view class="mark" v-for="n in 12" :key="n"
              :style="getMarkStyle(n)">
          {{ n }}
        </view>
      </view>

      <!-- 时钟指针 -->
      <view class="hand hour" :style="hourHandStyle"></view>
      <view class="hand minute" :style="minuteHandStyle"></view>
      <view class="hand second" :style="secondHandStyle"></view>

      <!-- 时钟中心点 -->
      <view class="center-point"></view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

// 状态定义
const currentDate = ref('')
const currentTime = ref('')
const hourHandStyle = ref('')
const minuteHandStyle = ref('')
const secondHandStyle = ref('')
// 添加翻页时钟状态
const hours2 = ref(0)
const minutes2 = ref(0)
const seconds2 = ref(0)
const hoursFlip = ref(false)
const minutesFlip = ref(false)
const secondsFlip = ref(false)
// 格式化数字为两位数
const formatNumber = (num: number): string => {
  return num.toString().padStart(2, '0')
}
const timeStr = ref('')
const getTimeStr = () => {
    let time = new Date();
    let hour = ('00' + time.getHours()).slice(-2)
    let minute = ('00' + time.getMinutes()).slice(-2)
    let second = ('00' + time.getSeconds()).slice(-2)
    timeStr.value = hour + minute + second
}
// 更新时钟
const updateClock = () => {
  const now = new Date()
// 更新翻页时钟
  hours2.value = now.getHours()
  minutes2.value = now.getMinutes()
  seconds2.value = now.getSeconds()
// 更新翻页时钟，并触发动画
  const newHours = now.getHours()
  const newMinutes = now.getMinutes()
  const newSeconds = now.getSeconds()

  // 检查秒数变化并触发动画
  if (newSeconds !== seconds2.value) {
    secondsFlip.value = true
    setTimeout(() => {
      secondsFlip.value = false
    }, 600) // 动画持续时间
  }

  // 检查分钟变化并触发动画
  if (newMinutes !== minutes2.value) {
    minutesFlip.value = true
    setTimeout(() => {
      minutesFlip.value = false
    }, 600)
  }
// 检查小时变化并触发动画
  if (newHours !== hours2.value) {
    hoursFlip.value = true
    setTimeout(() => {
      hoursFlip.value = false
    }, 600)
  }

  // 更新时间值
  hours2.value = newHours
  minutes2.value = newMinutes
  seconds2.value = newSeconds
  // 原有的数字时钟和圆盘时钟更新代码
  currentDate.value = now.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  })
  currentTime.value = now.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })

  // 计算指针角度
  const hours = now.getHours() % 12
  const minutes = now.getMinutes()
  const seconds = now.getSeconds()

  // 时针角度：每小时转30度（360/12），每分钟额外转0.5度（30/60）
  const hourDegrees = (hours * 30) + (minutes * 0.5)
  // 分针角度：每分钟转6度（360/60）
  const minuteDegrees = minutes * 6
  // 秒针角度：每秒转6度（360/60）
  const secondDegrees = seconds * 6

  // 更新指针样式
  hourHandStyle.value = `transform: rotate(${hourDegrees}deg)`
  minuteHandStyle.value = `transform: rotate(${minuteDegrees}deg)`
  secondHandStyle.value = `transform: rotate(${secondDegrees}deg)`
}
const gotoCalender = () => {
  uni.navigateTo({
    url: '/pages/calender/calender'
  })
}
// 获取刻度位置样式
const getMarkStyle = (hour: number) => {
  const degrees = hour * 30 // 每个数字间隔30度（360/12）
  const radius = 120 // 刻度距离中心的半径
  const radian = (degrees - 90) * (Math.PI / 180) // 转换为弧度，减90度使12点位于正上方

  // 计算刻度的位置
  const x = Math.cos(radian) * radius
  const y = Math.sin(radian) * radius

  return {
    transform: `translate(${x}px, ${y}px)`
  }
}

let timer: number
let timer1:number
const timeArr=()=>{
  return [timeStr].map((unit,index)=>{
    let max;
    if(index&1==1){     //时分秒的个位
      max = 9
    }else if(index==0){ //时十位
      max = 2
    }else if(index==2){ //分十位
      max = 5
    }else if(index==4){ //秒十位
      max = 5
    }
    return {
      max,
      current:Number(unit),
    }
  })
}
// 组件挂载时启动时钟
onMounted(() => {
  updateClock() // 立即更新一次
  timer = setInterval(updateClock, 1000) // 每秒更新一次
  timeArr()
  timer1 = setInterval(()=>{
    timeArr()
  },1000)
})

// 组件卸载时清除定时器
onUnmounted(() => {
  clearInterval(timer)
  clearInterval(timer1)
})
</script>

<style>
.clock-container {
  padding-top: calc(var(--status-bar-height) + 44px);
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
}

.digital-clock {
  text-align: center;
  margin-bottom: 30px;
}

.date {
  display: block;
  font-size: 16px;
  color: #666;
  margin-bottom: 5px;
}

.time {
  display: block;
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.analog-clock {
  position: relative;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background-color: #fff;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
}
/* 添加翻页时钟样式 */
.flip-clock {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px 0;
  gap: 10px;
}

.flip-unit {
  width: 60px;
  height: 80px;
  position: relative;
  perspective: 400px;
}
.card {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.6s;
}

.flip-unit.flip .card {
  transform: rotateX(-180deg);
}

.top, .bottom {
  width: 100%;
  height: 50%;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 36px;
  font-weight: bold;
  color: #fff;
  background: #333;
  border-radius: 8px;
  overflow: hidden;
  backface-visibility: hidden;
}

.bottom {
  background: linear-gradient(to bottom, #333, #222);
  transform-origin: top;
  transform: rotateX(180deg);
}
.separator {
  font-size: 36px;
  font-weight: bold;
  color: #333;
  margin: 0 5px;
}

/* 添加翻页动画 */
@keyframes flipTop {
  0% { transform: rotateX(0deg); }
  100% { transform: rotateX(-180deg); }
}

@keyframes flipBottom {
  0% { transform: rotateX(180deg); }
  100% { transform: rotateX(0deg); }
}

.flip-unit.flip .top {
  animation: flipTop 0.6s ease-in;
  transform-origin: bottom;
}
/* 修改翻页动画 */
@keyframes flipTop {
  0% { transform: rotateX(0deg); }
  100% { transform: rotateX(-180deg); }
}

@keyframes flipBottom {
  0% { transform: rotateX(180deg); }
  100% { transform: rotateX(0deg); }
}

/* 添加翻页前后的卡片 */
.top::before,
.bottom::before {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  height: 100%;
  background: inherit;
  backface-visibility: hidden;
  border-radius: inherit;
}

.top::before {
  bottom: 100%;
  transform-origin: bottom;
}
/* 暗黑模式适配 */
@media (prefers-color-scheme: dark) {
  .flip-unit {
    background-color: #222;
  }

  .top {
    background: linear-gradient(to bottom, #333, #222);
  }

  .bottom {
    background: linear-gradient(to bottom, #222, #111);
  }

  .separator {
    color: #fff;
  }
}
.bottom::before {
  top: 100%;
  transform-origin: top;
}
.flip-unit.flip .bottom {
  animation: flipBottom 0.6s ease-out;
}

.top {
  background: linear-gradient(to bottom, #444, #333);
  border-bottom: 1px solid #000;
  transform-origin: bottom;
}

/* 暗黑模式适配 */
@media (prefers-color-scheme: dark) {
  .flip-unit {
    background-color: #222;
  }

  .top {
    background: linear-gradient(to bottom, #333, #222);
  }

  .bottom {
    background: linear-gradient(to bottom, #222, #111);
  }

  .separator {
    color: #fff;
  }
}

/* 调整原有布局 */
.clock-container {
  padding-top: calc(var(--status-bar-height) + 44px);
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.digital-clock {
  margin: 20px 0;
}
.hour-marks {
  position: absolute;
  width: 100%;
  height: 100%;
}

.mark {
  position: absolute;
  left: 50%;
  top: 50%;
  font-size: 18px;
  color: #333;
  transform-origin: 0 0;
}

.hand {
  position: absolute;
  bottom: 50%;
  left: 50%;
  transform-origin: 50% 100%;
  background-color: #333;
  border-radius: 4px;
}

.hour {
  width: 4px;
  height: 60px;
  margin-left: -2px;
}

.minute {
  width: 3px;
  height: 80px;
  margin-left: -1.5px;
  background-color: #666;
}

.second {
  width: 2px;
  height: 90px;
  margin-left: -1px;
  background-color: #f00;
}

.center-point {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: #f00;
  transform: translate(-50%, -50%);
}

/* 暗黑模式 */
@media (prefers-color-scheme: dark) {
  .clock-container {
    background-color: #1a1a1a;
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
  .analog-clock {
    background-color: #2c2c2c;
  }

  .date {
    color: #999;
  }

  .time {
    color: #fff;
  }

  .mark {
    color: #fff;
  }

  .hand {
    background-color: #fff;
  }

  .minute {
    background-color: #ccc;
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
  display: flex;
  align-items: center;
}

.nav-left {
  padding: 0 15px;
  height: 44px;
  display: flex;
  align-items: center;
}

.back-icon {
  font-size: 20px;
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
/* 定义样式时直接使用具体的值而不是变量 */
.flip-container {
  display: flex;
  justify-content: center;
  padding: 0 20rpx;
  position: relative;
}

.flip-container .flip-items {
  position: relative;
  width: 60rpx;
  height: calc(60rpx * 1.5);
  font-size: calc(60rpx * 1.3);
  font-weight: bold;
  border-radius: calc(60rpx / 10);
  box-shadow: 0 2rpx 18rpx rgba(0, 0, 0, 0.7);
}

.flip-container .flip-items:nth-of-type(2n+1) {
  margin-right: calc(60rpx * 0.2);
}

.flip-container .flip-items:nth-of-type(2),
.flip-container .flip-items:nth-of-type(4) {
  margin-right: calc((60rpx * 0.2) * 3);
}

.flip-container .flip-items:nth-of-type(2)::after,
.flip-container .flip-items:nth-of-type(4)::after,
.flip-container .flip-items:nth-of-type(2)::before,
.flip-container .flip-items:nth-of-type(4)::before {
  position: absolute;
  right: calc(-1 * (60rpx * 0.2) / 2);
  content: '';
  transform: translateX(50%);
  width: calc((60rpx * 0.2) / 1.5);
  height: 60rpx;
  border-radius: 50%;
  background-color: #333;
}

.flip-container .flip-items:nth-of-type(2)::before,
.flip-container .flip-items:nth-of-type(4)::before {
  top: 25%;
}

.flip-container .flip-items:nth-of-type(2)::after,
.flip-container .flip-items:nth-of-type(4)::after {
  bottom: 25%;
}

.flip-container .flip-items .item {
  z-index: 1;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  perspective: calc(60rpx * 5);
}

.flip-container .flip-items .item:before {
  content: '';
  position: absolute;
  top: calc(((60rpx * 1.5) - (60rpx / 60)) / 2);
  left: 0;
  z-index: 9;
  width: 100%;
  height: calc(60rpx / 60);
  min-height: 2px;
  background-color: rgba(0, 0, 0, 0.6);
}

.flip-container .flip-items .item .up,
.flip-container .flip-items .item .down {
  position: absolute;
  left: 0;
  right: 0;
  height: 50%;
  overflow: hidden;
}

.flip-container .flip-items .item .up {
  transform-origin: 50% 100%;
  top: 0;
}

.flip-container .flip-items .item .down {
  transform-origin: 50% 0%;
  bottom: 0;
}

.flip-container .flip-items .item .inner {
  position: absolute;
  left: 0;
  width: 100%;
  height: calc(60rpx * 1.5);
  line-height: calc(60rpx * 1.5);
  color: #ccc;
  text-shadow: 0 2rpx 4rpx #000;
  text-align: center;
  background-color: #333;
  border-radius: calc(60rpx / 10);
}

.flip-container .flip-items .item .up .inner {
  top: 0;
}

.flip-container .flip-items .item .down .inner {
  bottom: 0;
}

.flip-container .flip-items .item .up .shadow {
  border-top-left-radius: calc(60rpx / 10);
  border-top-right-radius: calc(60rpx / 10);
}

.flip-container .flip-items .item .down .shadow {
  border-bottom-left-radius: calc(60rpx / 10);
  border-bottom-right-radius: calc(60rpx / 10);
}

.flip-container .flip-items .item.past {
  z-index: 3;
}

.flip-container .flip-items .item.current {
  animation: highter-level 0.5s 0.5s linear forwards;
  z-index: 2;
}

.flip-container .flip-items .item.past .up {
  animation: flip-past-up 0.5s linear both;
}

.flip-container .flip-items .item.current .down {
  animation: flip-current-down 0.5s 0.5s linear both;
}

@keyframes flip-current-down {
  from {
    transform: rotateX(90deg);
  }
  to {
    transform: rotateX(0deg);
  }
}

@keyframes flip-past-up {
  from {
    transform: rotateX(0deg);
  }
  to {
    transform: rotateX(-90deg);
  }
}

@keyframes highter-level {
  from {
    z-index: 4;
  }
  to {
    z-index: 4;
  }
}

/* 控制阴影 */
.flip-container .flip-items .item.past .up .shadow {
  background: linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 1));
  animation: show 0.5s linear both;
}

.flip-container .flip-items .item.past .down .shadow {
  background: linear-gradient(rgba(0, 0, 0, 1), rgba(0, 0, 0, 0.1));
  animation: show 0.5s linear both;
}

.flip-container .flip-items .item.current .up .shadow {
  background: linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 1));
  animation: hide 0.5s 0.3s linear both;
}

.flip-container .flip-items .item.current .down .shadow {
  background: linear-gradient(rgba(0, 0, 0, 1), rgba(0, 0, 0, 0.1));
  animation: hide 0.5s 0.3s linear both;
}

@keyframes show {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes hide {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

.other {
  position: absolute;
  font-size: 26px;
  left: 50%;
  transform: translateX(-50%);
  bottom: 50rpx;
}
</style>