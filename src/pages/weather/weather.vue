<template>
  <view class="custom-nav">
    <view class="nav-left" @tap="goBack">
      <text class="back-icon">←</text>
    </view>
    <text class="title">天气首页</text>
  </view>
</template>
<script setup lang="ts">
import { ref, onMounted,getCurrentInstance } from 'vue';
// import { onLoad, getCurrentInstance } from '@dcloudio/uni-app';
import { navigateBack } from "@dcloudio/uni-h5";

// 获取全局实例
const { proxy } = getCurrentInstance();

// 响应式状态
const city = ref<string>('');
const locationData = ref<{ longitude: number; latitude: number } | null>(null);

// 生命周期钩子
// 父页面的 onMounted 钩子中
onMounted(async () => {
  try {
    // 获取地理坐标（wgs84）并反向地理编码以获取城市信息
    await getLocationAndReverseGeocode('wgs84').then(() => {
      // 假设我们已经有了 city 变量，其中包含城市名
      if (city.value) {
        uni.navigateTo({
          url: `/pages/weather/index?city=${encodeURIComponent(city.value)}`
        });
      }
      console.log('city',city)
    });
  } catch (error) {
    console.error('获取位置或天气信息失败', error);
  }
});
// 方法
const goBack = () => {
  navigateBack();
};

const getWeather = async () => {
  try {
    console.log('天气界面-');

    // 获取地理坐标（gcj02）
    await getLocationAndFetchWeather('gcj02', (res) => {
      const { longitude, latitude } = res;
      locationData.value = { longitude, latitude };

      // 发送请求获取天气信息
      uni.request({
        url: `https://devapi.qweather.com/v7/weather/now?location=${longitude},${latitude}&key=02e53097fd0e4cf7a2d602221f5f2f4d`,
        method: 'GET',
        dataType: "json",
        success(response) {
          console.log(response);
        }
      });
    });

    // 获取地理坐标（wgs84）并反向地理编码
    await getLocationAndReverseGeocode('wgs84');
  } catch (error) {
    console.error('获取位置或天气信息失败', error);
  }
};

const getLocationAndFetchWeather = (type: 'gcj02' | 'wgs84', callback: (res: any) => void) => {
  return new Promise<void>((resolve, reject) => {
    uni.getLocation({
      type,
      success(res) {
        callback(res);
        resolve();
      },
      fail(error) {
        reject(error);
      }
    });
  });
};
const getLocationAndReverseGeocode = (type: 'gcj02' | 'wgs84') => {
  return new Promise<void>((resolve, reject) => {
    uni.getLocation({
      type,
      success: function (res) {
        let { longitude, latitude } = res;

        // 创建地图坐标对象并进行反向地理编码
        const point = new plus.maps.Point(longitude, latitude);
        plus.maps.Map.reverseGeocode(point, {}, (event) => {
          console.log(event);
          const address = event.address;
          const reg = /.+?(省|市|自治区|自治州|县|区)/g;
          const addressList = address.match(reg)?.toString().split(",") || [];
          console.log(addressList[1]+" "+addressList[2]+" "+addressList[0])
          console.log(addressList.length)

          city.value = addressList.length === 4 ? addressList[1] : addressList[0];
          city.value = city.value.replace(/市$/, "");
          console.log('addressList',addressList);
          resolve();
        }, (e) => {
          console.log("失败回调", e);
          reject(e);
        });
      },
      fail(error) {
        reject(error);
      }
    });
  });
};
</script>

<!--<template>-->
<!--  &lt;!&ndash; 模板部分 &ndash;&gt;-->
<!--</template>-->
<!--<script>-->
<!--	import {navigateBack} from "@dcloudio/uni-h5";-->

<!--  export default {-->
<!--		data() {-->
<!--			return {-->
<!--				-->
<!--			}-->
<!--		},-->
<!--		created() {-->
<!--			uni.navigateTo({-->
<!--				  url: '/pages/weather/index'-->
<!--				});-->
<!--		},-->
<!--		methods: {-->
<!--      goBack() {-->
<!--        navigateBack();-->
<!--      },-->
<!--			getWeather(){-->
<!--				console.log('天气界面-')-->
<!--				uni.getLocation({-->
<!--								type: 'gcj02',-->
<!--								success(res) {-->
<!--									let longitude = res.longitude;-->
<!--									let latitude = res.latitude;-->
<!--									uni.request({-->
<!--										url: `https://devapi.qweather.com/v7/weather/now?location=${longitude},${latitude}&key=02e53097fd0e4cf7a2d602221f5f2f4d`,-->
<!--										method: 'GET',-->
<!--										dataType: "json",-->
<!--										success(res) {-->
<!--											console.log(res)-->
<!--										}-->
<!--									})-->
<!--								}-->
<!--							})-->
<!--				uni.getLocation({-->
<!--								type: 'wgs84',-->
<!--								success: function(res) {-->
<!--									let longitude = res.longitude;-->
<!--									let latitude = res.latitude;-->
<!--									// 创建地图坐标对象-->
<!--									var point = new plus.maps.Point(res.longitude, res.latitude);-->
<!--									//静态方法，反向地理编码-->
<!--									plus.maps.Map.reverseGeocode(point, {}, (event) => {-->
<!--											console.log(event)-->
<!--											var address = event.address; // 转换后的地理位置-->
<!--											var point = event.coord; // 转换后的坐标信息-->
<!--											var coordType = event.coordType; // 转换后的坐标系类型-->
<!--											var reg = /.+?(省|市|自治区|自治州|县|区)/g;-->
<!--											var addressList = address.match(reg).toString().split(",");-->
<!--											//注意 因为存在直辖市， 当所在地区为普通省市时，addressList.length == 3，city = addressList[1];当所在地区为直辖市时addressList.length == 2，city = addressList[0];-->
<!--											let city = addressList.length == 3 ? addressList[1] : addressList[0];-->
<!--											console.log(addressList);-->
<!--										},-->
<!--										function(e) {-->
<!--											console.log("失败回调", e);-->
<!--										}-->
<!--									);-->
<!--								}-->
<!--							});-->
<!--			}-->
<!--		}-->
<!--	}-->
<!--</script>-->

<style>
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
.title {
  height: 44px;
  line-height: 44px;
  text-align: center;
  font-size: 18px;
  color: #333;
  display: block;
}
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
