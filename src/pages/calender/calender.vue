<template>
  <view class="calendar-container">
    <!-- 自定义导航栏 -->
    <view class="custom-nav">
      <view class="nav-left" @tap="goBack">
        <text class="back-icon">←</text>
      </view>
      <text class="title" @click="gotoWeather">日历</text>
    </view>

    <!-- 日历头部 -->
    <view class="calendar-header">
      <view class="month-switcher">
        <text class="arrow" @tap="prevMonth">←</text>
        <text class="current-month">{{ currentYear }}年{{ currentMonth + 1 }}月</text>
        <text class="arrow" @tap="nextMonth">→</text>
      </view>
      <view class="weekdays">
        <text v-for="day in weekDays" :key="day">{{ day }}</text>
      </view>
    </view>

    <!-- 日历主体 -->
    <view class="calendar-body">
      <view class="calendar-grid">
        <view v-for="(day, index) in days"
              :key="index"
              class="day-cell"
              :class="{
                'empty': !day,
                'current': isCurrentDay(day),
                'selected': isSelectedDay(day)
              }"
              @tap="selectDay(day)">
          <template v-if="day">
            <text class="solar-day">{{ day.getDate() }}</text>
            <text class="lunar-day">{{ getLunarDay(day) }}</text>
          </template>
        </view>
      </view>
    </view>

    <!-- 选中日期详情 -->
    <view class="selected-date-info" v-if="selectedDate">
      <text class="solar-date">{{ formatSolarDate(selectedDate) }}</text>
      <text class="lunar-date">{{ formatLunarDate(selectedDate) }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import Lunar from 'lunar-javascript'

// 状态定义
const currentYear = ref(new Date().getFullYear())
const currentMonth = ref(new Date().getMonth())
const selectedDate = ref(new Date())
const today = new Date()

// 星期标题
const weekDays = ['日', '一', '二', '三', '四', '五', '六']
const gotoWeather=()=>{
  uni.navigateTo({
    url: '/pages/weather/weather'
  })
}
// 计算当月的所有日期
const days = computed(() => {
  const firstDay = new Date(currentYear.value, currentMonth.value, 1)
  const lastDay = new Date(currentYear.value, currentMonth.value + 1, 0)
  const daysArray: (Date | null)[] = []

  // 填充月初空白
  for (let i = 0; i < firstDay.getDay(); i++) {
    daysArray.push(null)
  }

  // 填充日期
  for (let i = 1; i <= lastDay.getDate(); i++) {
    daysArray.push(new Date(currentYear.value, currentMonth.value, i))
  }

  return daysArray
})

// 获取农历日期
const getLunarDay = (date: Date) => {
  const lunar = Lunar.Solar.fromDate(date).getLunar()
  // 如果是初一，显示月份
  if (lunar.getDay() === 1) {
    return lunar.getMonthInChinese() + '月'
  }
  // 返回农历日期
  return lunar.getDayInChinese()
}

// 格式化阳历日期
const formatSolarDate = (date: Date) => {
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  })
}

// 格式化农历日期
const formatLunarDate = (date: Date) => {
  const lunar = Lunar.Solar.fromDate(date).getLunar()
  return `农历${lunar.getYearInChinese()}年${lunar.getMonthInChinese()}月${lunar.getDayInChinese()}`
}

// 判断是否是当前日期
const isCurrentDay = (date: Date | null) => {
  if (!date) return false
  return date.toDateString() === today.toDateString()
}

// 判断是否是选中日期
const isSelectedDay = (date: Date | null) => {
  if (!date || !selectedDate.value) return false
  return date.toDateString() === selectedDate.value.toDateString()
}

// 选择日期
const selectDay = (date: Date | null) => {
  if (date) {
    selectedDate.value = date
  }
}

// 切换月份
const prevMonth = () => {
  if (currentMonth.value === 0) {
    currentYear.value--
    currentMonth.value = 11
  } else {
    currentMonth.value--
  }
}

const nextMonth = () => {
  if (currentMonth.value === 11) {
    currentYear.value++
    currentMonth.value = 0
  } else {
    currentMonth.value++
  }
}

// 返回上一页
const goBack = () => {
  uni.navigateBack()
}
</script>

<style>
.calendar-container {
  padding-top: calc(var(--status-bar-height) + 44px);
  min-height: 100vh;
  background-color: #f5f5f5;
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

.calendar-header {
  padding: 20px;
}

.month-switcher {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.current-month {
  font-size: 20px;
  font-weight: bold;
}

.arrow {
  font-size: 24px;
  padding: 10px;
  color: #666;
}

.weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  color: #666;
  font-size: 14px;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  background-color: #eee;
  padding: 1px;
}

.day-cell {
  aspect-ratio: 1;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 5px;
}

.empty {
  background-color: #f9f9f9;
}

.current {
  background-color: #e6f7ff;
}

.selected {
  background-color: #1890ff;
  color: #fff;
}

.solar-day {
  font-size: 16px;
  font-weight: bold;
}

.lunar-day {
  font-size: 12px;
  color: #999;
}

.selected .lunar-day {
  color: #fff;
}

.selected-date-info {
  padding: 20px;
  text-align: center;
}

.solar-date {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
  display: block;
}

.lunar-date {
  font-size: 16px;
  color: #666;
}

/* 暗黑模式 */
@media (prefers-color-scheme: dark) {
  .calendar-container,
  .custom-nav {
    background-color: #1a1a1a;
  }

  .title,
  .back-icon,
  .current-month {
    color: #fff;
  }

  .arrow {
    color: #999;
  }

  .weekdays {
    color: #999;
  }

  .day-cell {
    background-color: #2c2c2c;
  }

  .empty {
    background-color: #262626;
  }

  .current {
    background-color: #153450;
  }

  .lunar-day {
    color: #666;
  }

  .solar-date {
    color: #fff;
  }

  .lunar-date {
    color: #999;
  }
}
</style>