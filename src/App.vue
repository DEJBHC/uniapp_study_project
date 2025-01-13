<script setup lang="ts">
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app";
// 定义全局数据
uni.$u = uni.$u || {}
uni.$u.globalData = {
  appid : '06369426',
  appsecret : 'VVM7jMR0'
}

// 可以添加一个获取全局数据的辅助函数
const getGlobalData = (key: string) => {
  return uni.$u.globalData[key]
}

// 可以添加一个设置全局数据的辅助函数
const setGlobalData = (key: string, value: any) => {
  uni.$u.globalData[key] = value
}
onLaunch(() => {
  console.log("App Launch");
});
onShow(() => {
  console.log("App Show");
});
onHide(() => {
  console.log("App Hide");
});
</script>
<style></style>
