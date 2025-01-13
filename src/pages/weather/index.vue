<template>

	<image class="background" :src="bg"></image>
	<view class="content"
		style="padding: 10px 5px 10px; color:#fff; text-align: center;">
		<view style="display: flex; width: 100%; padding-bottom: 35px;margin-top: 20px; font-size:16px;">
			<view style="width: 50%; text-align: left;">
			<navigator url="/pages/weather/city">{{weather.city}}[切换]</navigator>
			</view>
			<view style="width: 50%; text-align: right; color:#f1f1f1;font-size:13px;">{{weather.update_time}}更新</view>
		</view>
		<view style="font-size: 32.76px;">{{weather.data[0].wea}}</view>
		
		<view style="font-size: 65.52px;">{{weather.data[0].tem}}°</view>
		<view style="font-size: 14px;"><navigator url="/pages/weather/aqi">AQI {{weather.aqi.air_level}} [查看详情]</navigator></view>
		<view style="padding: 8px 0 20px 0;"><text
				decode>最低{{weather.data[0].tem2}}°&nbsp;&nbsp;&nbsp;最高{{weather.data[0].tem1}}°</text>
		</view>
		<!--hours-->
		<view
			style="width:100%; overflow:scroll; border-bottom: 1px solid rgba(190, 185, 185, 0.5);border-top: 1px solid rgba(190, 185, 185, 0.5);padding:23.4rpx 0; height: 105px; min-height: 105px; max-height: 105px;">
			<view class="hlist">

				<view v-for="(item,index) in weather.data[0].hours" :key="item.id" class="hitem">
					<view>{{item.hours}}</view>
					<view style="padding: 10px 0 0;">
						<image :src="item.wea_img" mode="widthFix" style="width: 46.8rpx;"></image>
					</view>
					<view style="font-weight: 500; font-size:13px;text-align: center;">{{item.wea}}</view>
					<view style="font-weight: 500; font-size:14px;text-align: center;">{{item.tem}}°</view>
				</view>
			</view>
			<view style="clear:both;width:100%;height:1px;"></view>
		</view>
		<!--hours-->
		<!--week-->
		<view style="width:100%; padding-top: 10px;padding-bottom: 15px;">

			<view v-for="(item,index) in weather.data" :key="item.id" class="week">
				<text class="weekday">{{item.day}}</text>
				<view style="text-align: left; padding-left:30%; font-size: 13px;">
					<image :src="item.wea_img" mode="widthFix" style="width: 42rpx; vertical-align: middle;">
					</image> {{item.wea}} <text v-if="item.rain > 10" style="font-size:12px; color: #96dafb; margin-left: 5px;"
						wx:if="{{item.rain > 35}}">{{item.rain}}%</text>
				</view>
				<text class="weekmax">{{item.tem2}}°</text>
				<text class="weekmin">{{item.tem1}}°</text>
			</view>


		</view>
		<!--week-->
		<view style="padding:15px;">
			<navigator url="/pages/weather/month"><button type="primary"
					style="font-size: 12px; border-radius: 30px; padding-left:30px;padding-right: 30px;">查看40日预报&gt;&gt;</button>
			</navigator>
		</view>
		<view class="smalltext">{{weather.data[0].narrative}}</view>

		<!--dayinfo-->
		<view style="width:100%;">
			<view style="padding:5px; text-align: left; ">
				<view style="display: flex; border-bottom: 1px solid rgba(190, 185, 185, 0.5); padding-bottom: 10px;">
					<view style="width: 50%;">
						<view style="color:#d8d6d6;">日出</view>
						<view style="font-size:16px;">上午 {{weather.data[0].sunrise}}</view>
					</view>
					<view style="width: 50%; ">
						<view style="color:#d8d6d6;">日落</view>
						<view style="font-size:16px;">下午 {{weather.data[0].sunset}}</view>
					</view>
					<view class="clearfix"></view>
				</view>
				<view
					style="display: flex; border-bottom: 1px solid rgba(190, 185, 185, 0.5); padding-top: 10px;padding-bottom: 10px;">
					<view style="width: 50%;">
						<view style="color:#d8d6d6;">湿度</view>
						<view style="">{{weather.data[0].humidity}}</view>
					</view>
					<view style="width: 50%;">
						<view style="color:#d8d6d6;">风</view>
						<view style="">{{weather.data[0].win[0]}}
							{{weather.data[0].win_speed}}
						</view>
					</view>
					<view class="clearfix"></view>
				</view>
				<view
					style="display: flex;border-bottom: 1px solid rgba(190, 185, 185, 0.5); padding-top: 10px;padding-bottom: 10px;">
					<view style="width: 50%;">
						<view style="color:#d8d6d6;">气压</view>
						<view style="">{{weather.data[0].pressure}}兆帕</view>
					</view>
					<view style="width: 50%;">
						<view style="color:#d8d6d6;">空气质量</view>
						<view style="">{{weather.data[0].air_level}}</view>
					</view>
					<view class="clearfix"></view>
				</view>
				<view
					style="display: flex; border-bottom: 1px solid rgba(190, 185, 185, 0.5); padding-top: 10px;padding-bottom: 10px;">
					<view style="width: 50%;">
						<view style="color:#d8d6d6;">降雨量</view>
						<view style="">{{weather.data[0].rain_pcpn}}mm</view>
					</view>
					<view style="width: 50%;">
						<view style="color:#d8d6d6;">紫外线</view>
						<view style="">{{weather.data[0].uvDescription}}</view>
					</view>
					<view class="clearfix"></view>
				</view>
				<view style="font-size: 23.4rpx; color:#d8d6d6; padding:10px 0">数据来源：TianqiAPI.com</view>
			</view>
		</view>
		<!--./dayinfo-->
	</view>
</template>

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
<!--		onLoad(e) {-->
<!--			console.log(getApp().globalData.appid)-->
<!--			console.log('参数如下:')-->
<!--			console.log(e.city);-->
<!--			this.city = e.city;-->
<!--			this.getWeather();-->
<!--		},-->
<!--		methods: {-->
<!--      goBack() {-->
<!--        uni.navigateBack();-->
<!--      },-->
<!--			formatDate(date){-->
<!--				var date = new Date(date);-->
<!--				return (date.getMonth()+1) + '-' + (date.getDate()) + ' ' + date.getHours() + ':' + date.getMinutes();-->
<!--			},-->
<!--			openmonth() {-->
<!--				uni.navigateTo({-->
<!--					url: '/pages/weather/month'-->
<!--				})-->
<!--			},-->
<!--			getWeather() {-->
<!--				if(this.city == undefined){-->
<!--					this.city = '';-->
<!--				}-->
<!--				if(this.city == ''){-->
<!--					var scity = uni.getStorageSync('storage_city');-->
<!--					if(scity != ''){-->
<!--						this.city = scity;-->
<!--					}-->
<!--				}-->
<!--				-->
<!--				const appid = '61253972';-->
<!--				const appsecret = '8OjdBlFA';-->
<!--				const url = 'http://v1.yiketianqi.com/api?version=v91&ext=hours,life&appid=' + appid + '&appsecret=' +-->
<!--					appsecret + '&city=' + this.city;-->

<!--				uni.request({-->
<!--					url: url,-->
<!--					success: (res) => {-->

<!--						if (res.data.errcode == "100") {-->
<!--							// 错误处理-->
<!--							console.error('获取天气信息失败', res.data);-->
<!--						} else {-->
<!--							uni.setStorageSync('storage_city', res.data.city);-->
<!--							var mydata = res.data;-->
<!--							console.log(mydata.data.length);-->

<!--							for (var i = 0; i < mydata.data[0].hours.length; i++) {-->
<!--								mydata.data[0].hours[i]['wea_img'] = '/static/skins/' + mydata.data[0].hours[i]-->
<!--									['wea_img'] +-->
<!--									'.png';-->
<!--							}-->
<!--							for (var i = 0; i < mydata.data.length; i++) {-->
<!--								mydata.data[i]['wea_img'] = '/static/skins/' + mydata.data[i]['wea_img'] +-->
<!--									'.png';-->
<!--							}-->
<!--							mydata.update_time = this.formatDate(mydata.update_time);-->
<!--							console.log(mydata);-->
<!--							-->
<!--							this.weather = mydata;-->
<!--							this.phrase_img = '/static/skins/' + mydata.data[0].wea_img + '.png';-->
<!--							// 计算背景图-->
<!--							if (mydata.data[0].wea.match(RegExp(/晴/))) {-->
<!--								this.bg = '/static/bg_sun.jpg';-->
<!--							} else {-->
<!--								this.bg = '/static/bg_yin.jpg';-->
<!--							}-->
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
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { onLoad } from '@dcloudio/uni-app';

// 定义接口来描述天气数据的结构
interface WeatherData {
  city: string;
  update_time: string;
  data: Array<{
    date: string;
    wea_img: string;
    hours?: Array<{
      wea_img: string;
    }>;
  }>;
}

// 响应式变量
const city = ref<string>('');
const weather = ref<WeatherData | null>(null);
const title = ref('易客API');
const phrase_img = ref<string>('');
const bg = ref<string>('');

// 生命周期钩子
onLoad((e) => {
  const appid = uni.$u.globalData.appid;
  const appsecret = uni.$u.globalData.appsecret;
  console.log(getApp().globalData.appid);
  console.log('参数如下:');
  console.log(e);
  console.log('e.city=',e.city);
  city.value = e.city || '';

  getWeather();
});

// 方法
const goBack = () => {
  uni.navigateBack();
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return `${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
};

const openmonth = () => {
  uni.navigateTo({
    url: '/pages/weather/month'
  });
};

const getWeather = async () => {
  try {
    if (!city.value) {
      const scity = uni.getStorageSync('storage_city') as string;
      if (scity) {
        city.value = scity;
      }
    }
    console.log('city=',city.value)
    city.value=decodeURIComponent(city.value)
    console.log('city=',city.value)
    const appid = '61253972';
    const appsecret = '8OjdBlFA';
    const url = `http://v1.yiketianqi.com/api?version=v91&ext=hours,life&appid=${appid}&appsecret=${appsecret}&city=${city.value}`;

    const res = await uni.request({ url });
    console.log('url=',url)
    console.log(res.data.data)
    if (res.data.errcode === "100") {
      throw new Error('获取天气信息失败');
    }

    const mydata = res.data as WeatherData;

    uni.setStorageSync('storage_city', mydata.city);

    // 更新图片路径
    if (mydata.data[0]?.hours) {
      for (const hour of mydata.data[0].hours) {
        hour.wea_img = `/static/skins/${hour.wea_img}.png`;
      }
    }
    for (const day of mydata.data) {
      day.wea_img = `/static/skins/${day.wea_img}.png`;
    }

    // 格式化更新时间
    mydata.update_time = formatDate(mydata.update_time);
    console.log('weather=',weather.value);
    // 更新响应式变量
    weather.value = mydata;
    phrase_img.value = `/static/skins/${weather.value?.data[0].wea_img}.png`;

    // 设置背景图
    bg.value = mydata.data[0].wea.match(/晴/) ? '/static/bg_sun.jpg' : '/static/bg_yin.jpg';

    console.log(weather.value);
  } catch (error) {
    console.error('请求失败', error);
  }
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

	.background {
		width: 100%;
		height: 100%;
		position: fixed;
		background-size: 100% 100%;
		z-index: -1;
	}

	.hlist {
		display: inline-flex;
	}

	.hitem {
		padding: 0 23.4rpx;
		width: 50px;
		text-align: center;
	}

	.week {
		font-size: 32.76rpx;
		position: relative;
		text-align: center;
		margin-top: 11.7rpx;
	}

	.weekday {
		position: absolute;
		left: 10px;
		top: 0px;
		font-size: 13px;
	}

	.weekmax {
		position: absolute;
		right: 70px;
		top: 0px;
	}

	.weekmin {
		color: #ebe7e7;
		position: absolute;
		right: 20px;
		top: 0px;
		text-align: left;
	}

	.smalltext {
		text-align: left;
		border-top: 1px solid rgba(190, 185, 185, 0.5);
		border-bottom: 1px solid rgba(190, 185, 185, 0.5);
		padding-top: 15px;
		padding-left: 15px;
		padding-bottom: 15px;
		font-size: 28.08rpx;
		width: 100%;
	}

	.content {
		/* padding-top:var(--status-bar-height); */
		/* display: flex; */
		/* flex-direction: column;
		align-items: center;
		justify-content: center; */
	}

	.logo {
		height: 200rpx;
		width: 200rpx;
		margin-top: 200rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50rpx;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}

	.wea_img {
		width: 25px;
		height: 25px;
	}
</style>