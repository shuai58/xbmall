var wxCharts = require('./../../utils/wxcharts.js');
var pulic = require('./../../utils/pulic.js');
var edit = require('./../../templet/edit/edit.js');
var config = require('./../../utils/config.js');
var app = getApp();
var lineChart = null;
var left = 0;
var windowWidth = 320;
var mywd = 320;
var inputvalue;
var isrequest = 0;
var lineData = null;
var eindex;
var keyname;
Page({
	data: {
		isedit: true,
		ishidden: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		deviceType: 0,
		type: 0,
		height: wx.getStorageSync('height'),
		agenum: wx.getStorageSync('age'),
		sex: wx.getStorageSync('sex')
	},
	onShow: function() {
		var that = this;
		that.getset();
		if (wx.getStorageSync('runtag') == 1) {
			that.getrun();
			wx.setStorageSync('runtag',0); 
		} 
	},
	onLoad: function() {
		var that = this;
		var daydata = pulic.getDates(1)[0];
		var day = daydata.year + "年" + daydata.month + "月" +
			daydata.day + "日" + " " + daydata.week;
		this.setData({
			day: day
		})
		try {
			var res = wx.getSystemInfoSync();  
			windowWidth = res.windowWidth;
		} catch(e) {
			console.error('getSystemInfoSync failed!');
		}
		wx.setStorageSync('ischange', 0);
	},
	getWeight: function() {
		var that = this;
		config.post(config.getWeight, {
			uniqid: app.globalData.uniqid,
			height: wx.getStorageSync('height'),
			age: wx.getStorageSync('age'),
			sex: wx.getStorageSync('sex')
		}, function(res) {
			console.log(res.data)
			if(res.data.code == 1) {
				console.log(res.data.data)
				that.setData({
					weightInfo: res.data.data
				})
				pulic.drawCircle({
					value: res.data.data.CMI,
					total: 100,
					canvasid: 'score',
					height: 96
				});
				if (res.data.data.Type == 5) {
					console.log("设备5")
					wx.setStorageSync('height', parseInt(res.data.data.Height));
					app.globalData.edhg = 1;
					that.setData({
						edhg:app.globalData.edhg,
						height: wx.getStorageSync('height') 
					})
				} 
				if(res.data.data.Type >= 2 && wx.getStorageSync('sex') == '') {
					that.editclick()
				}
				wx.setStorageSync('weightInfo', res.data.data);
				if(res.data.data.Height != undefined) {
					wx.setStorageSync('height', parseInt(res.data.data.Height));
				}
				wx.getSetting({
					success: res => {
						if(res.authSetting['scope.werun']) {
							that.getrun()
							that.setData({
								isshouquan: true
							})
						}
					}
				})
			}
		})
	},
	getset: function() {
		var that = this;
		if(app.globalData.userInfo == null) {
			that.gologin();
		} else {
			if(app.globalData.uniqid == null || wx.getStorageSync('sex') == '' || wx.getStorageSync('ischange') == 1) {
				console.log("进入登录2")
				if(wx.getStorageSync('ischange') == 1) {
					that.setData({
						height: wx.getStorageSync('height'),
						agenum: wx.getStorageSync('age'),
						sex: wx.getStorageSync('sex')
					})
					wx.setStorageSync('ischange', 0);
					that.getWeight();
				} else {
					that.gologin();
				}
			}else if(that.data.weightInfo==undefined){
				that.getWeight();
			}
		}
	},
	jibu: function(e) {
		var that = this;
		wx.getSetting({
			success: res => {
				if(!res.authSetting['scope.werun']) {
					wx.authorize({
						scope: 'scope.werun',
						success(res) {
							that.getrun()
						},
						fail() {
							wx.showModal({
								title: '友情提示',
								content: '必须授权微信运动才能使用小程序！',
								showCancel: false,
								success: function(res) {
									that.shouquanjibu();
								}
							});
						}
					})
				} else {
					wx.navigateTo({
						url: `/pages/movement/movement`
					})
				}
			}
		})
	},
	shouquanjibu: function() {
		var that = this;
		wx.openSetting({
			success: (res) => {
				if(res.authSetting['scope.werun']) {
					that.getrun()
				}
			}
		})
	},
	getrun: function() {
		var that = this;
		wx.getWeRunData({
			success(res) {
				console.log(res)
			    config.post(config.getHealthInfo, {
					uniqid: app.globalData.uniqid,
					weight: that.data.weightInfo.Weight,
					sessionid:app.globalData.sessionId,
					encryptedData:res.encryptedData,
					iv:res.iv
				}, function(res) {
					if(res.data.code == 1) {
						console.log(res.data.data)
						var movedata = res.data.data;
						wx.setStorageSync('moveinfo', res.data.data);
						var movebi=0
						if (movedata.TargetValue!=0) {
							movebi = parseInt((movedata.CurrentValue / movedata.TargetValue) * 100)
						} 
						that.setData({
							move: res.data.data,
							movebi:movebi,
							isshouquan: true
						})
						pulic.drawCircle({
							value: res.data.data.CurrentValue,
							total: res.data.data.TargetValue,
							canvasid: 'jibu',
							height: 60
						});
					}
				})
		  	} 
		})	
	},
	gologin: function() {
		var that = this;
		wx.login({
			success: res => {
				var code = res.code;
				config.post(config.onlogin, {
					code: code
				}, function(res) {
					if(res.data.code == 1) {
						app.globalData.sessionId = res.data.data.sessionId;
						wx.getUserInfo({
							success: res => {
								app.globalData.userInfo = res.userInfo;
								that.setData({
									userInfo: res.userInfo
								})
								config.post(config.getUserInfo, {
									type: "USERINFO",
									sessionid: app.globalData.sessionId,
									encryptedData:res.encryptedData,
									iv: res.iv
								}, function(res) {
									console.log(res.data)
									if(res.data.code == 1) {
										app.globalData.uniqid = res.data.data.unionid;
										config.get(config.getbaseinfo, {
											uniqid: res.data.data.unionid
										}, function(res) {
											console.log(res.data.data)
											if (res.data.data.type==5) {
												wx.setStorageSync('height', parseInt(res.data.data.height));
											} 
											that.getWeight();
										})
										that.getAdd();
										isrequest = 0;
									}
								})
							}
						})
					}
				})
			}
		})
	},
	editclick: function() {
		var that = this;
		edit.height(function(data) {
			var index = 100;
			if(wx.getStorageSync('height') != undefined) {
				for(var i = 0; i < data.length; i++) {
					if(data[i] == wx.getStorageSync('height')) {
						index = i;
					}
				}
			}
			that.setData({
				heightarr: data,
				hgindex: index
			})
		})
		edit.age(function(data) {
			var index = 18;
			if(wx.getStorageSync('age') != undefined) {
				for(var i = 0; i < data.length; i++) {
					if(data[i] == wx.getStorageSync('age')) {
						index = i;
					}
				}
			}
			that.setData({
				agearr: data,
				ageindex: index
			})
		})
		this.setData({
			isedit: false
		})
	},
	selectsex: function(e) {
		console.log(e.currentTarget.dataset.sex)
		var sex = e.currentTarget.dataset.sex == 0 ? "男" : "女"
		wx.showToast({
			title: '选择的性别为' + sex,
			icon: 'none',
			duration: 1000
		})
		this.setData({
			sex: e.currentTarget.dataset.sex
		})
	},
	heightChange: function(e) {
		console.log(e.detail.value)
		this.setData({
			hgindex: e.detail.value
		})
	},
	ageChange: function(e) {
		this.setData({
			ageindex: e.detail.value
		})
	},
	closeedit: function() {
		var that = this;
		if(that.data.sex == "") {
			wx.showToast({
				title: '请点击头像选择性别',
				icon: 'none',
				duration: 2000
			})
		} else {
			if (wx.getStorageSync('height')!=that.data.heightarr[that.data.hgindex]||
				wx.getStorageSync('age')!=that.data.agearr[that.data.ageindex] ||
				wx.getStorageSync('sex')!=that.data.sex
			) {
				wx.setStorageSync('height', that.data.heightarr[that.data.hgindex])
				wx.setStorageSync('age', that.data.agearr[that.data.ageindex])
				wx.setStorageSync('sex', that.data.sex)
				config.post(config.submitInfo, {
					uniqid: app.globalData.uniqid,
					height: wx.getStorageSync('height'),
					age: wx.getStorageSync('age'),
					sex: wx.getStorageSync('sex')
				}, function(res) {
					console.log(res.data)
					if(res.data.code == 1) {
						that.getWeight();
						that.getLineData(function() {
							that.iskey()
						})
					}
				})
				that.setData({
					height: wx.getStorageSync('height'),
					agenum: wx.getStorageSync('age'),
					sex: wx.getStorageSync('sex'),
					isedit: true
				})
			}else{
				that.setData({
					isedit: true
				})
			}
		}
	},
	showclick: function(e) {
		var that = this;
		var isline = 0;
		keyname = e.currentTarget.dataset.name;
		var hidden = that.data.ishidden;
		for(var i = 0; i < hidden.length; i++) {
			if(i == e.currentTarget.dataset.num) {
				if(hidden[i] == 0) {
					hidden[i] = 1;
					isline = 1;
				} else {
					hidden[i] = 0
				}
			} else {
				hidden[i] = 0;
			}
		}
		that.setData({
			ishidden: hidden
		})
		if(isline==1) {	
		 	if(lineData == null) {
				that.getLineData(function() {
					that.iskey()
				})
			}else{
				that.iskey()
			}
		}		
	},
	iskey:function() {
		var that = this;
		for (var i = 0; i < lineData.length; i++) {
			if(lineData[i].name==keyname){
				eindex = i
			}
		}
		if (lineData[eindex]==undefined) {
			return
		} 
		that.setData({
			drawData: lineData[eindex],
			type:0,
			left: 0,
			svalue: 0
		})
		that.drawline(lineData[eindex].name)
	},
	getLineData: function(callback) {
		var that = this;
		config.post(config.GetMeasure, {
			uniqid: app.globalData.uniqid,
			age: wx.getStorageSync('age'),
			sex: wx.getStorageSync('sex'),
			pagesize: 1,
			pagenum: 20
		}, function(res) {
			if(res.data.code == 1) {
				console.log(res.data.data)
				lineData = res.data.data;
				for(var i = 0; i < lineData.length; i++) {
					var clinevalue = [];
					var clinetime = [];
					var dlinevalue = [];
					var dlinetime = [];
					for(var j = 0; j < lineData[i].list.length; j++) {
						clinevalue.push(lineData[i].list[j].value)
						clinetime.push(pulic.format(lineData[i].list[j].time))
					}
					for(var k = 0; k < lineData[i].daylist.length; k++) {
						dlinevalue.push(lineData[i].daylist[k].value)
						dlinetime.push(pulic.format(lineData[i].daylist[k].time))
					}
					lineData[i].clinevalue = clinevalue;
					lineData[i].clinetime = clinetime;
					lineData[i].dlinevalue = dlinevalue;
					lineData[i].dlinetime = dlinetime;
					var leftval = 0;
					var namevalue = lineData[i].value;
					if (lineData[i].low!=null) {
						if(lineData[i].low.maxvalue > namevalue) {
							leftval = (namevalue * 100 - lineData[i].low.minvalue * 100) / (lineData[i].low.maxvalue * 100 - lineData[i].low.minvalue * 100) * 200 - 8;
						} else if(lineData[i].normal.minvalue <= namevalue && namevalue <= lineData[i].normal.maxvalue) {
							leftval = (namevalue * 100 - lineData[i].normal.minvalue * 100) / (lineData[i].normal.maxvalue * 100 - lineData[i].normal.minvalue * 100) * 200 - 8;
						} else if(lineData[i].normal.maxvalue < namevalue) {
							leftval = (namevalue * 100 - lineData[i].height.minvalue * 100) / (lineData[i].height.maxvalue * 100 - lineData[i].height.minvalue * 100) * 200 - 8;
						}
						lineData[i].leftval = parseInt(leftval);
					} 
					switch(lineData[i].name) {
						case "bmi":
							lineData[i].unit='';
							break;
						case "fat_r":
							lineData[i].unit='%';
							break;
						case "muscle":
							lineData[i].unit='%';
							break;
						case "fat_w":
							lineData[i].unit='kg';
							break;
						case "water":
							lineData[i].unit='%';
							break;
						case "bone":
							lineData[i].unit='kg';
							break;
						case "kcal":
							lineData[i].unit='kcal';
							break;
						case "visceral":
							lineData[i].unit='';
							break;
						case "protein":
							lineData[i].unit='%';
							break;
						case "bodyage":
							lineData[i].unit='岁';
							break;
						default:
							break;
					}
				}
				console.log(lineData)
				callback()
			}
		})
	},
	getAdd: function() {
		var that = this;
		config.get(config.getAdd, {
			uniqid: app.globalData.uniqid
		}, function(res) {
			if(res.data.code == 1) {
				console.log(res.data.data)
				var banner = res.data.data;
				for(var i = 0; i < banner.length; i++) {
					if(banner[i].ImgUrl.indexOf("http")>=0)
					{
						console.log("包含http");
					}else{
						banner[i].ImgUrl = config.baseUrl + banner[i].ImgUrl;
					}
				}
				that.setData({
					banner: banner
				})
			}
		})
	},
	drawline: function(canvasid) {
		var that = this;
		if(that.data.type == 0) {
			var categories = that.data.drawData.clinetime;
			var series = that.data.drawData.clinevalue;
		} else {
			var categories = that.data.drawData.dlinetime;
			var series = that.data.drawData.dlinevalue;
		}
		mywd = windowWidth / 5 * categories.length;
		console.log("canvasid" + canvasid)
		if(mywd < windowWidth) {
			mywd = windowWidth;
		}
		if (mywd>1200) {
        	mywd=1200;
        	console.log()
        	windowWidth=mywd/categories.length*5
        } 
		that.setData({
			canvasWidth: mywd
		})
		lineChart = new wxCharts({
			canvasId: canvasid,
			type: 'line',
			categories: categories,
			animation: true,
			background: '#fff',
			series: [{
				data: series,
				format: function(val) {
					return val + that.data.drawData.unit;//
				}
			}],
			xAxis: {
				disableGrid: false, //显示x分割线
				gridColor: '#000', //X轴网格颜色
				fontColor: '#000'
			},
			yAxis: {
				min: 0,
				disabled: true, //不绘制Y轴
				gridColor: '#fff' //y轴网格颜色
			},
			width: windowWidth,
			height: 100,
			dataLabel: true,
			dataPointShape: true, //是否在图表中显示数据点图形标识
			enableScroll: true,
			legend: false,
			extra: {
				lineStyle: 'curve'
			}
		});
	},
	changvalue: function(e) {
		var mystep = (mywd - windowWidth) / 100;
		var moveleft = -mystep * e.detail.value;
		this.setData({
			left: moveleft
		})
	},
	selecttype: function(e) {
		if(e.currentTarget.dataset.type != this.data.type) {
			this.setData({
				type: e.currentTarget.dataset.type,
				left: 0,
				svalue: 0
			})
			this.drawline(this.data.drawData.name)
		}
	},
	addclick:function (e) {
		console.log(e.currentTarget.dataset.info)
		var type = e.currentTarget.dataset.info.AdType;
		if(type==1||type==2){
			wx.setStorage({
			  key:"addinfo",
			  data:e.currentTarget.dataset.info
			})
			wx.navigateTo({
				url: `/pages/add/add`
			})
		}else if(type==3){
			wx.navigateToMiniProgram({
			  appId: e.currentTarget.dataset.info.ExtContent,
			  path: e.currentTarget.dataset.info.Content,
			  success(res) {
			    // 打开成功
			  }
			})
		} 
	}
})
