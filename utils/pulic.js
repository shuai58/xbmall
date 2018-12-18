module.exports = {
    drawCircle: drawCircle,
    getDates: getDates,
    format:format,
    trim:trim,
    timedata:timedata
}

function drawCircle(ops) {
	/*
	cxt_arc.arc(x, y, r, sAngle, eAngle, counterclockwise);
	x	                    Number	  圆的x坐标
	y	                    Number	  圆的y坐标
	r	                    Number	  圆的半径
	sAngle	            Number	  起始弧度，单位弧度（在3点钟方向）
	eAngle	            Number	  终止弧度
	counterclockwise	    Boolean	  可选。指定弧度的方向是逆时针还是顺时针。默认是false，即顺时针。
	*/
	var copyRightItems = 0;
	if (ops.total!=0) {
		ops.value = parseInt((ops.value/ops.total)*100) 
	} else{
		ops.value = 0
	}
	if (ops.value<2) {
		ops.value=2
	} 
	var rightItems = ops.value;
	var totalItems = 100;
	var timername = ops.canvasid + 'timer';
	var R = ops.height/2;
	timername = setInterval(function() {
		copyRightItems++;
		if(copyRightItems == rightItems) {
			clearInterval(timername)
		} else {
			// 页面渲染完成
			// 这部分是透明底层
			let cxt_arc = wx.createCanvasContext(ops.canvasid); //创建并返回绘图上下文context对象。
			cxt_arc.setGlobalAlpha(0.5); //设置画笔透明度
			cxt_arc.setLineWidth(6); //绘线的宽度
			cxt_arc.setStrokeStyle('#fff'); //绘线的颜色
			cxt_arc.setLineCap('round'); //线条端点样式
			cxt_arc.beginPath(); //开始一个新的路径
			cxt_arc.arc(R, R, R-3, 0, 2 * Math.PI, false); //设置一个原点(53,53)，半径为50的圆的路径到当前路径
			cxt_arc.stroke(); //对当前路径进行描边
			//这部分是占比部分
			if(rightItems>2){
				cxt_arc.setGlobalAlpha(1);
				cxt_arc.setLineWidth(6);
				cxt_arc.setStrokeStyle('#fff');
				cxt_arc.setLineCap('round')
				cxt_arc.beginPath(); //开始一个新的路径
				cxt_arc.arc(R, R, R-3, Math.PI * 1 / 2, 2 * Math.PI * (copyRightItems / totalItems) + Math.PI * 1 / 2, false);
				cxt_arc.stroke(); //对当前路径进行描边
			}	
			cxt_arc.draw();
		}
	}, 10)
}
 
//获取d当前时间多少天后的日期和对应星期
function getDates(days,todate=getCurrentMonthFirst()) {//todate默认参数是当前日期，可以传入对应时间
  var dateArry = [];
  for (var i = 0; i < days; i++) {
    var dateObj = dateLater(todate, i);
    dateArry.push(dateObj)
  }
  return dateArry;
}
/**
   * 传入时间后几天
   * param：传入时间：dates:"2018-04-02",later:往后多少天
   */
function dateLater(dates, later) {
  let dateObj = {};
  let show_day = new Array('星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六');
  let date = new Date(dates);
  date.setDate(date.getDate() + later);
  let day = date.getDay();
  dateObj.year = date.getFullYear();
  dateObj.month = ((date.getMonth() + 1) < 10 ? ("0" + (date.getMonth() + 1)) : date.getMonth()+1);
  dateObj.day = (date.getDate() < 10 ? ("0" + date.getDate()) : date.getDate());
  dateObj.week = show_day[day];
  return dateObj;
}
//获取当前时间
function getCurrentMonthFirst() {
  var date = new Date();
  var todate = date.getFullYear() + "-" + ((date.getMonth() + 1) < 10 ? ("0" + (date.getMonth() + 1)) : date.getMonth()+1) + "-" + (date.getDate() < 10 ? ("0" + date.getDate()) : date.getDate());
  return todate;
}

function trim(str){ //删除左右两端的空格
  return str.replace(/(^\s*)|(\s*$)/g, "");
} 

function format(timestamp) {
	var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
	var Y = date.getFullYear() + '-';
	var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '/';
	var D = date.getDate();
	return M+D 
}

function timedata(timestamp,type=1) {
	var date = new Date(timestamp*1000); 
	var Y = date.getFullYear() + '/';
	var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '/';
	var D = date.getDate();
	var H = (date.getHours() < 10 ? '0'+date.getHours() : date.getHours()) + ':';
	var MI = (date.getMinutes()< 10 ? '0'+date.getMinutes() : date.getMinutes()) + ':';
	var S = date.getSeconds()< 10 ? '0'+date.getSeconds() : date.getSeconds()
	if (type==1) {
		return Y+M+D 
	}else if(type==2){
		return {
			data1:Y+M+D,
			data2:H+MI+S
		}
	}
}
