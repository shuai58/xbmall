import api from 'api.js';
class Base {
    constructor() {
        "use strict";
        this.Url = api;
    }
    // GET 请求
    requstGet(url, param,callback) {
	    var joiningUrl = url+'?'
	    for (var key in param){
	     joiningUrl =  joiningUrl+key+'='+param[key]+'&'
	    }
	    console.log(joiningUrl)
	     var that = this
	    wx.request({
	        url: url,
	        data: param,
	        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
	        header: {
	            'content-type': 'application/json'
	        },
	        success: function (res) {
                callback(res)
	        },
	        fail: function (err) {
	        	console.log(err);
	        }
	    })
	}
	
	// POST 请求
	requstPost(url, param,callback) {
		console.log(url)
	    wx.request({
	        url: url,
	        data: param,
	        method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
	        header: {
	            'content-type': 'application/json'
	        },
	        success: function (res) {
	        	callback(res)
	        },
	        fail: function (err) {
	        	console.log(err);
	        }
	    })
	}

    /*获得元素上的绑定的值*/
    getDataSet(event, key) {
        return event.currentTarget.dataset[key];
    };
};

export {Base};
