<template>
	<view style="background-color: rgb(0, 97, 204); height: 100%;">
		<view style="padding:10px;">
			<view style="padding: 15px; border-radius:5px; background-color: #fff; ">
				<view v-for="(item,index) in weather.data" :key="item.id">
					<view style="padding:8px 0; display: flex; border-bottom: 1px solid #f1f1f1; font-size: 14px;">
						<view style="width: 30%;font-size:13px;">{{item.date}}<br>{{item.week}}</view>
						<view style="width: 40%; text-align: left;font-size: 14px;">
							<image :src="item.wea_img" mode="widthFix" style="width: 42rpx; vertical-align: middle;">
							</image> {{item.wea}}
						</view>
						<view style="width: 30%; text-align: center;">
							<text>{{item.tem2}}° ~ {{item.tem1}}°</text>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { onLoad } from '@dcloudio/uni-app';

// 定义接口来描述天气数据结构
interface WeatherItem {
  date: string;
  wea_img: string;
  [key: string]: any; // 其他未明确的键值对
}

interface WeatherData {
  errcode: string;
  data: WeatherItem[];
}

// 响应式状态
const city = ref<string>('');
const weather = ref<WeatherData | null>(null);
const title = ref('易客API');
const phrase_img = ref<string>('');
const bg = ref<string>('');

// 生命周期钩子
onLoad(() => {
  getWeather();
});

// 方法
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return `${date.getMonth() + 1}-${date.getDate()}`;
};

const goBack = () => {
  uni.navigateBack();
};

const getWeather = async () => {
  try {
    // 尝试从缓存获取城市名称
    let scity = uni.getStorageSync('storage_city') as string;
    if (scity) {
      city.value = scity;
    }

    // 获取全局配置中的 appid 和 appsecret
    const appid = uni.$u.globalData.appid;
    const appsecret = uni.$u.globalData.appsecret;

    // 构建请求URL
    const url = `http://v1.yiketianqi.com/api?unescape=1&version=v3&appid=${appid}&appsecret=${appsecret}&city=${city.value}`;

    // 发起网络请求
    const res = await uni.request({ url });

    // 检查请求结果
    if (res.data.errcode === "100") {
      throw new Error('获取天气信息失败');
    }

    // 解析并处理返回的数据
    const mydata = res.data as WeatherData;

    // 更新日期格式和图片路径
    for (const item of mydata.data) {
      item.date = formatDate(item.date);
      item.wea_img = `/static/skins/${item.wea_img}.png`;
    }

    // 更新组件的状态
    weather.value = mydata;
    console.log(weather.value);

  } catch (error) {
    console.error('请求失败', error);
  }
};
</script>

<!--<template>-->
<!--  &lt;!&ndash; 模板部分 &ndash;&gt;-->
<!--</template>-->
<!--<script>-->
<!--	export default {-->
<!--		data() {-->
<!--			return {-->
<!--				city: '',-->
<!--				weather: [],-->
<!--				title: '易客API',-->
<!--				phrase_img: '',-->
<!--				bg: ''-->
<!--			}-->
<!--		},-->
<!--		onLoad() {-->
<!--			this.getWeather();-->
<!--		},-->
<!--		methods: {-->
<!--			formatDate(date) {-->
<!--				var date = new Date(date);-->
<!--				return (date.getMonth() + 1) + '-' + (date.getDate());-->
<!--			},-->
<!--      goBack(){-->
<!--        uni.navigateBack();-->
<!--      },-->
<!--			getWeather() {-->
<!--				var scity = uni.getStorageSync('storage_city');-->
<!--				if (scity != '') {-->
<!--					this.city = scity;-->
<!--				}-->
<!--        const appid = uni.$u.globalData.appid-->
<!--        const appsecret = uni.$u.globalData.appsecret-->
<!--				const url = 'http://v1.yiketianqi.com/api?unescape=1&version=v3&appid=' + appid + '&appsecret=' +-->
<!--					appsecret + '&city=' + this.city;-->

<!--				uni.request({-->
<!--					url: url,-->
<!--					success: (res) => {-->

<!--						if (res.data.errcode == "100") {-->
<!--							// 错误处理-->
<!--							console.error('获取天气信息失败', res.data);-->
<!--						} else {-->
<!--							var mydata = res.data;-->
<!--							for (var i = 0; i < mydata.data.length; i++) {-->
<!--								mydata.data[i]['date'] = this.formatDate(mydata.data[i]['date']);-->
<!--								mydata.data[i]['wea_img'] = '/static/skins/' + mydata.data[i]['wea_img'] +-->
<!--									'.png';-->
<!--							}-->
<!--							console.log(mydata);-->

<!--							this.weather = mydata;-->
<!--						}-->
<!--					},-->
<!--					fail: (error) => {-->
<!--						// 请求失败处理-->
<!--						console.error('请求失败', error);-->
<!--					}-->
<!--				});-->
<!--			}-->
<!--		}-->
<!--	}-->
<!--</script>-->

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