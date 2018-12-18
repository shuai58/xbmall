// pages/store/store.js
Page({
  data: {
		isshow:0
  },
  onLoad(options) {

  },
  showclick (e) {
  	console.log(e.currentTarget.dataset.type)
  	this.setData({
  		isshow:e.currentTarget.dataset.type
  	})
  },
  onShareAppMessage () {

  }
})