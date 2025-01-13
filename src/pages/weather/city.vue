<template>
  <view>
    <button style="margin-top: 30px" @tap="open">打开</button>
    <city-picker
        v-model:visible="visible"
        :mask-close-able="maskCloseAble"
        :default-value="defaultValue"
        :column="column"
        @confirm="confirm"
        @cancel="cancel"
    />
    <view>{{cityName}}</view>
  </view>
</template>
<script setup lang="ts">
import { ref } from 'vue';
// 定义响应式数据
const inputValue = ref<string>('');
import cityPicker from '@/uni_modules/piaoyi-cityPicker/components/piaoyi-cityPicker/piaoyi-cityPicker.vue';

// 定义响应式数据
const visible = ref(false);
const maskCloseAble = ref(true);
const str = ref('');
const defaultValue = ref('420103'); // 或者使用 ['河北省','唐山市','丰南区']
const column = ref(3);
const cityName = ref('');
// 方法
const open = () => {
  visible.value = true;
};

const confirm = (val: any) => {
  console.log(val);
  str.value = JSON.stringify(val);
  console.log(str.value);
  cityName.value = val.cityName;
  visible.value = false;
  gocity()
};

const cancel = () => {
  visible.value = false;
};
// 分享功能
const onShareAppMessage = (res: any) => {
  if (res.from === 'button') { // 来自页面内分享按钮
    console.log(res.target);
  }
  return {
    title: 'data-cityPicker省市区地址选择器！',
    path: '/pages/cityPicker/cityPicker'
  };
};

const onShareTimeline = (res: any) => {
  if (res.from === 'button') { // 来自页面内分享按钮
    console.log(res.target);
  }
  return {
    title: 'data-cityPicker省市区地址选择器！'
  };
};

// 如果需要在组件初始化时调用某些方法或设置一些属性，可以在这里添加相应的逻辑
// 注意：由于 script setup 是组合式 API 的一种形式，不再支持 export default 语句
// 方法
const goBack = () => {
  uni.navigateBack();
};

const onKeyInput = (event: any) => {
  inputValue.value = event.detail.value;
  console.log(inputValue.value);
};

const gocity = () => {
  console.log(cityName.value);
  const city = cityName.value.replace('市', '');
  //uni.setStorageSync('city', 'hello');
  uni.reLaunch({
    url: `/pages/weather/index?city=${encodeURIComponent(city)}`
  });
};

</script>
<style>
.custom-nav {
  padding-top: var(--status-bar-height);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 999;
  background-color: #f5f5f5;
}
.nav-left {
  padding: 0 15px;
  height: 24px;
  display: flex;
  align-items: center;
}
.title {
  flex: 1;
  height: 24px;
  line-height: 44px;
  text-align: center;
  font-size: 18px;
  color: #333;
}
.back-icon {
  font-size: 20px;
  color: #333;
}

</style>