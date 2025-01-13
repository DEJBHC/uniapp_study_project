<template>
  <view style="background-color: #E7ECF4; height: 100%;">
    <view class="custom-nav">
      <view class="nav-left" @tap="goBack">
        <text class="back-icon">←</text>
      </view>
      <text class="title">AQI指数</text>
    </view>
		<view style="padding:10px 10px 200px;">
			<view style="font-size: 12px; color:#333; text-align: right;">{{weather.aqi.update_time}}更新</view>
			<view style="text-align: center; padding-top: 20px;">
				<view style="font-size: 46px; ">
					<text style="position: relative; padding:10px;">{{weather.aqi.air}}<text
							style="background-color: #FFEF01; border-radius: 50%; padding:5px 8px; font-size: 14px; position: absolute; top: 0px; right:-20px;">{{weather.aqi.air_level}}</text></text>

				</view>
				<view style="padding: 10px 0;"><text
						style="font-size: 16px; background-color: #fff; color: #14C355; border-radius:8px; padding:5px;">AQI指数</text>
				</view>
				<view style="font-size: 13px; padding:10px 30px 20px;">{{weather.aqi.air_tips}}</view>
			</view>

			<view
				style="font-size: 14px; padding: 10px; border-radius:5px; background-color: #fff; display: flex; text-align: center; ">
				<view style="width: 16.66%;">
					<view style="font-size: 16px;">{{weather.aqi.pm10}}</view>PM10
				</view>
				<view style="width: 16.66%;">
					<view style="font-size: 16px;">{{weather.aqi.pm25}}</view>PM2.5
				</view>
				<view style="width: 16.66%;">
					<view style="font-size: 16px;">{{weather.aqi.no2}}</view>NO2
				</view>
				<view style="width: 16.66%;">
					<view style="font-size: 16px;">{{weather.aqi.so2}}</view>SO2
				</view>
				<view style="width: 16.66%;">
					<view style="font-size: 16px;">{{weather.aqi.o3}}</view>O3
				</view>
				<view style="width: 16.66%;">
					<view style="font-size: 16px;">{{weather.aqi.co}}</view>CO
				</view>
			</view>

			<view
				style="margin-top:15px; font-size: 14px; padding: 10px; border-radius:5px; background-color: #fff;  text-align: center; ">
				<view style="text-align: left;">{{weather.city}}未来5日天气</view>
				<view style="display: flex; ">
					<view style="width: 20%;">
						<view class="itema">
							{{weather.data[1].date}}</view>
						<view class="itemb">{{weather.data[1].wea}}
						</view>
						<view class="itemc">
							{{weather.data[1].tem2}}~{{weather.data[1].tem1}}°</view>
						<view class="itemd">
							<text
								class="iteme">{{weather.data[1].air_level}}</text>
						</view>
					</view>
					<!--2-->
					<view style="width: 20%;">
						<view class="itema">
							{{weather.data[2].date}}</view>
						<view class="itemb">{{weather.data[2].wea}}
						</view>
						<view class="itemc">
							{{weather.data[2].tem2}}~{{weather.data[2].tem1}}°</view>
						<view class="itemd">
							<text
								class="iteme">{{weather.data[2].air_level}}</text>
						</view>
					</view>
					<!--./2-->
					<!--3-->
					<view style="width: 20%;">
						<view class="itema">
							{{weather.data[3].date}}</view>
						<view class="itemb">{{weather.data[3].wea}}
						</view>
						<view class="itemc">
							{{weather.data[3].tem2}}~{{weather.data[3].tem1}}°</view>
						<view class="itemd">
							<text
								class="iteme">{{weather.data[3].air_level}}</text>
						</view>
					</view><!--./3--><!--4-->
					<view style="width: 20%;">
						<view class="itema">
							{{weather.data[4].date}}</view>
						<view class="itemb">{{weather.data[4].wea}}
						</view>
						<view class="itemc">
							{{weather.data[4].tem2}}~{{weather.data[4].tem1}}°</view>
						<view class="itemd">
							<text
								class="iteme">{{weather.data[4].air_level}}</text>
						</view>
					</view><!--./4--><!--5-->
					<view style="width: 20%;">
						<view class="itema">
							{{weather.data[5].date}}</view>
						<view class="itemb">{{weather.data[5].wea}}
						</view>
						<view class="itemc">
							{{weather.data[5].tem2}}~{{weather.data[5].tem1}}°</view>
						<view class="itemd">
							<text
								class="iteme">{{weather.data[5].air_level}}</text>
						</view>
					</view><!--./5-->
				</view>
			</view>


		</view>
	</view>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { onLoad } from '@dcloudio/uni-app';

interface WeatherData {
  date: string;
  wea_img: string;
  [key: string]: any; // 其他未明确的键值对
}

// 定义响应式数据
const city = ref<string>('');
const weather = ref<Array<WeatherData>>([]);
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
    let scity = uni.getStorageSync('storage_city') || '';
    if (scity) {
      city.value = scity;
    }

    const appid = uni.$u.globalData.appid;
    const appsecret = uni.$u.globalData.appsecret;
    const url = `http://v1.yiketianqi.com/api?unescape=1&version=v91&appid=${appid}&appsecret=${appsecret}&city=${city.value}`;

    const res = await uni.request({ url });

    if (res.data.errcode === "100") {
      throw new Error('获取天气信息失败');
    }

    const mydata = res.data;
    mydata.data.forEach((item: WeatherData) => {
      item.date = formatDate(item.date);
      item.wea_img = `/static/skins/${item.wea_img}.png`;
    });

    weather.value = mydata;
    await uni.setNavigationBarTitle({
      title: `${weather.value.city}空气质量`
    });
  } catch (error) {
    console.error('请求失败', error);
  }
};
</script>
<!--<script>-->
<!--	export default {-->
<!--		data() {-->
<!--			return {-->
<!--				city:'',-->
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
<!--				const url = 'http://v1.yiketianqi.com/api?unescape=1&version=v91&appid=' + appid + '&appsecret=' +-->
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
<!--							// update title-->
<!--							uni.setNavigationBarTitle({-->
<!--								title: this.weather.city + '空气质量'-->
<!--							});-->
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
.itema{font-size: 16px;padding-top: 10px; padding-bottom: 5px;font-size: 13px;}
.itemb{font-size: 16px;padding-bottom: 5px;font-size: 12px; white-space: nowrap;}
.itemc{font-size: 16px;padding-bottom: 10px;font-size: 14px;}
.itemd{font-size: 16px;font-size: 12px;padding-bottom: 10px;}
.iteme{background-color: #FFEF01; border-radius: 10px; padding:2px 5px;}
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