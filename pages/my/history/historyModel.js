var config = require('./../../../utils/config.js');
var pulic = require('./../../../utils/pulic.js');
class History {
    getHistoryData(app,pagenum,callback){
        var that=this;
        config.get(config.historylist, {
			uniqid: app.globalData.uniqid,
			pagesize:pagenum,
			pagenum:15 
		}, function(res) {
			if(res.data.code==1){
				for (var i = 0; i < res.data.data.Table.length; i++) {
					var datedata = pulic.timedata(res.data.data.Table[i].createtime,2)
					res.data.data.Table[i].createtime = datedata.data1;
					res.data.data.Table[i].mintime = datedata.data2;
				}
			}
			callback&&callback(res.data)
		})
    }
}
export {History};