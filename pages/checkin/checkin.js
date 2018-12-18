// pages/checkin/checkin.js
Page({
  data: {

  },
  onLoad: function (options) {

  },
	moveToLocation() {
		console.log("res");    
    var that = this;
    wx.chooseLocation({
      success: function (res) {    
        console.log(res);    
				that.setData({
					mark: {
						lat:res.latitude,
						lon:res.longitude
					}
				})
      } 
    });
	}
})