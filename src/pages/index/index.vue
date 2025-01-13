<template>
  <view class="container">
    <button style="margin-top: 15rpx; width: 260rpx; height: 50rpx; font-size: 30rpx; line-height: 50rpx; display: flex; align-items: center; justify-content: center;" class="start-btn" @click="startTetris">俄罗斯方块</button>
    <button style="margin-top: 15rpx; width: 260rpx; height: 50rpx; font-size: 30rpx; line-height: 50rpx; display: flex; align-items: center; justify-content: center;" class="start-btn" @click="startSnakes">贪吃蛇</button>
  </view>
</template>

<script setup lang="ts">
const startTetris = () => {
  uni.navigateTo({
    url: '/pages/tetris/tetris'
  })
}
const startSnakes = () => {
  uni.navigateTo({
    url: '/pages/snake/snake'
  })
}
</script>

<style>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

.start-btn {
  background-color: #007AFF;
  color: #FFFFFF;
  border-radius: 5px;
}
</style>