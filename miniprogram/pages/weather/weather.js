//weather.js
//获取应用实例
var app = getApp()
var day = ["今天", "明天", "后天"];
var timestamp = Date.parse(new Date());
timestamp = timestamp / 1000;
var n = timestamp * 1000;
var date = new Date(n);
var hour = date.getHours();
Page({
    data: {
        day: day,
        weather_url: null,
    },

    onLoad: function() {
        wx.startPullDownRefresh();
        var that = this
        if (hour >= 6 & hour <= 18)
            this.setData({
                weather_url: "../../images/day.jpg"
            })
        else
            this.setData({
                weather_url: "../../images/night.jpg"
            })

        that.getLocation();
    },
    onReady: function() {

    },
    onShow: function() {
        wx.getStorage({
            key: 'back',
            success: (res) => {
                if (res.data === 'addPage') {
                    wx.startPullDownRefresh();
                    wx.removeStorage({
                        key: 'back'
                    });
                }
            }
        });
    },
    onPullDownRefresh: function() {
        this.getLocation,
            this.getCity,
            this.getWeather,
            wx.stopPullDownRefresh();
    },

    //获取当前位置的经纬度
    getLocation: function() {
        var that = this
        wx.getLocation({
            type: 'wgs84',
            success: function(res) {
                wx.stopPullDownRefresh();
                var latitude = res.latitude
                var longitude = res.longitude

                that.getCity(latitude, longitude);
            },
            fail: function(res) {},
            complete: function(res) {},
        })
    },

    //获取城市信息
    getCity: function(latitude, longitude) {
        var that = this;
        var url = "https://api.map.baidu.com/geocoder/v2/";
        var params = {
            latest_admin: 1,
            radius: 200,
            ak: "hTgENV863L55qBEO9yTp8UAvv8A9kz4W",
            output: "json",
            location: latitude + "," + longitude
        };

        wx.request({
            url: url,
            data: params,
            success: function(res) {
                wx.stopPullDownRefresh();
                var city = res.data.result.addressComponent.city;
                var district = res.data.result.addressComponent.district;
                var street = res.data.result.addressComponent.street;
                that.setData({
                    city: city,
                    district: district,
                    street: street
                })
                var location = longitude + "," + latitude
                that.getWeather(location);
            },
            fail: function(res) {},
            complete: function(res) {},
        })
    },

    //获取天气预报
    getWeather: function(location) {
        var that = this;
        var url = "https://free-api.heweather.com/s6/weather";
        var params = {
            location: location,
            key: "83f56652ca9145b18227166998aafa5b"
        }

        wx.request({
            url: url,
            data: params,
            success: function(res) {
                wx.stopPullDownRefresh();
                var tmp = res.data.HeWeather6[0].now.tmp + "°";
                var txt = res.data.HeWeather6[0].now.cond_txt;
                var code = res.data.HeWeather6[0].now.cond_code;
                var time = res.data.HeWeather6[0].update.loc;
                var dir = res.data.HeWeather6[0].now.wind_dir;
                var sc = res.data.HeWeather6[0].now.wind_sc + "级";
                var hum = res.data.HeWeather6[0].now.hum + "%";
                var fl = res.data.HeWeather6[0].now.fl + "°";
                var daily_forecast = res.data.HeWeather6[0].daily_forecast;
                that.setData({
                    tmp: tmp,
                    txt: txt,
                    code: code,
                    time: time,
                    dir: dir,
                    sc: sc,
                    hum: hum,
                    fl: fl,
                    daily_forecast: daily_forecast
                })
            },
            fail: function(res) {},
            complete: function(res) {},
        })
    }

})