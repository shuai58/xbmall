var baseUrl = 'https://i.ybhdmob.com';

module.exports = {
	baseUrl:baseUrl,
    get: requstGetData,
    post: requstPostData,
    getDataSet:getDataSet,
    onlogin: baseUrl + '/api/wxopen/onlogin', //1.登录接口
    getUserInfo: baseUrl + '/api/wxopen/DecodeEncryptedData',//2.获取用户身份信息
    getWeight: baseUrl + '/api/health/GetCalc',//3.获取用户基本称重信息
    getPhone: baseUrl + '/api/wxopen/DecryptPhoneNumber',//4.获取手机号码
    getWxMove: baseUrl + '/api/wxopen/DecryptWxRun',//5.获取微信运动
    isLogin: baseUrl + '/api/wxopen/CheckWxUserStatus',//6.检查用户是否已授权登录
    getAdd: baseUrl + '/api/Health/WX_Ad',//7.底部广告列表
    getRank: baseUrl + '/api/Health/Rank',//8.排行榜
    setTarget: baseUrl + '/api/Health/SetTarget',//9.设置目标体重/目标步数
    getReultList: baseUrl + '/api/Health/GetReultList',//10.获取历史称重数
    getHealthInfo: baseUrl + '/api/Health/GetHealthInfo',//11.获取步数相关信息
    submitInfo: baseUrl + '/api/Health/Submit',//12.提交用户信息
    submitSuggest: baseUrl + '/api/Member/SubmitSuggest',//13.意见反馈
    gettaglist: baseUrl + '/api/news/gettaglist',//14.获取资讯标签列表
    getnewslist: baseUrl + '/api/news/getnewslist',//15.获取指定标签资讯列表
    getNewsContent: baseUrl + '/api/news/GetNewsContent',//16.获取资讯内容
    GetMeasure: baseUrl + '/api/Health/GetMeasure',//17.获取每项测量值历史记录
    historylist: baseUrl + '/api/health/GetHisResultList',//18.获取历史测量记录
    getbaseinfo: baseUrl + '/api/health/getbaseinfo',//19.获取称重类型
}
// GET 请求
function requstGetData(url, param,callback) {
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
        fail: function (res) {
            callback(res) 
        }
    })
}

// POST 请求
function requstPostData(url, param,callback) {
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
        fail: function (res) {
            callback(res) 
        }
    })
}
/*获得元素上的绑定的值*/
function getDataSet(event, key) {
    return event.currentTarget.dataset[key];
}

 