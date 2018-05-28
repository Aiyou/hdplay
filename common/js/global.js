// JavaScript Document
//////////////////共用变量　///////////////////////
MY_VSS_IP=["175.10.1.102:6554","175.10.1.102:6554"];//点播，时移,回看
MY_CHANNEL_IP=["175.10.1.103:6554","175.10.1.103:6554"]//直播
//allchannelId = 0;//allchannel.html查所有频道ID的值
//different_channelId = [0,1,2,3,4,5,6];//查allchannel.html页不同频道ID的值
rootcategoryId = 4;  //点播的根目录ID
vodhotcategoryId = 7;  //点播热播节目目录ID
moviehotcategoryId = 1;  //电影详细页的相关节目目录ID
teleplaycategoryId = 60;   //电视剧场相关节目目录ID
vodcategoryId=[3,3,3,3];　　//直播回看菜单的相关目录ID
ntp_server_url = "172.168.2.120";//NTP服务
nopic = "/portal/images/nopic.jpg";  //缺省图片
var	 mainMenuUrl = [{"name":"首页","url":"index/index.html"},{"name":"频道","url":"channel/channelplay.html?type=tv"},{"name":"回看","url":"channel/channelplay.html?type=epg"},{"name":"点播","url":"vod/vod.html"},{"name":"资讯","url":"../webapp/news/newfirst.html"},{"name":"设置","url":"sys/sysset_passwd.html"}];
var INDEXARRAY=["iptv.com","OVTA0000000000000556","60000"];//首页视频循环播放媒资,时间
MY_PORTAL_ADDR = '';
try{
MY_PORTAL_ADDR = new QjyScript().exec("OvtGetConfig", "auth_server_url");
}
catch(e){
	//http://120.197.87.166:9190
}
var g_cacheid={};//变量缓存
var MediaEventStr;
//获取页面的ID元素
function $(id){
	return document.getElementById(id);
	/*
	if(!g_cacheid[id]){
		g_cacheid[id]=document.getElementById(id);
		}
	return g_cacheid[id]?g_cacheid[id]:null;
	*/
}
//获取URL"?"后面的字符串 &&  //类型简单判断
var $G = {
	"getParameter" : function(param){
					var query = window.location.search; //获取URL"?"后面的字符串
					if(query.length	== 0){
						return "";
					}else{
						var iLen = param.length;
						var iStart = query.indexOf(param);
						
						if (iStart == -1) //判断是否有那个需要查询值的传递参数
							return ""; //没有就返回一个空值
						iStart += iLen + 1;
						
						var iEnd = query.indexOf("&", iStart); //判断是不是带有多个参数   &为多个参数的连接符号
						if (iEnd == -1) {
							return query.substring(iStart);
						}
						return query.substring(iStart, iEnd);
					}
				}	
}
//返回字符串汉字长度 英文或特殊字符两个相当于一个汉字
/*
 *str:传入的字符串
 *len:字符串的最大长度
 *返回截取的字符串
 */
function getStrChineseLen(str,len){
	var w = 0;
	for (var i = 0; i < str.length; i++) {
		var c = str.charCodeAt(i);
		 //单字节加1
		 if ((c >= 0x0001 && c <= 0x007e) || (0xff60<=c && c<=0xff9f)) {
			 w++;
		 }else{
		   w+=2;
		 }
		 if(parseInt((w+1)/2)>len){
			return str.substring(0,i-1)+"...";
			break;
		　} 
	} 	
	return str;
}
//返回中文字符串的长度
function getStrChineseLength(str){
	var w = 0;
	var c;
	for (var i=0; i<str.length; i++) {
		 c = str.charCodeAt(i);
		 //单字节加1
		 if ((c >= 0x0001 && c <= 0x007e) || (0xff60<=c && c<=0xff9f)) {
		   w++;
		 }else {
		   w+=2;
		 }
    } 	
	var length = w % 2 == 0 ? (w/2) : (parseInt(w/2)+1) ;
	return length; 
}
//显示当前日前和时间
function showDateAndTime()    
{	
    var date = new Date();
	var timeobj = $("sys_time");
	var time_box = $("time_box");
	var dateStr = date.getFullYear() + "年" + (date.getMonth() + 1) + "月" + date.getDate() + "日  ";
	var timeStr = (date.getHours().toString().length == 1  ?  '0' : '') + date.getHours() + ":" + (date.getMinutes().toString().length == 1  ?  '0' : '') + date.getMinutes();
	timeobj.innerHTML = dateStr;
	time_box.innerHTML = timeStr;
	setTimeout('showDateAndTime()',60000);	 
}
//将字符串转成json
function strToJson(str){
	var json = eval('(' + str + ')');  
	return json;  
}
//频道号格式
var util = {
	/**
	 * util.date对象，用来放置与Date有关的工具
	 */
	str: {
		addZero: function(__str, __num){
			__str = __str.toString();
			for(var i = __str.length; i < __num; i++){
				__str = "0"+__str;
			}
			return __str;
		},
		
		getDuration: function(__t1, __t2){
			var t1 = __t1.split(":");
			var t2 = __t2.split(":");
			var duration = 0;
			duration = (Math.floor(t2[0])*60+Math.floor(t2[1])) - (Math.floor(t1[0])*60+Math.floor(t1[1]));
			if(t1[0] > t2[0]) duration = duration + 1440;
			return duration;
		},
		
		millisecondToMinute: function(__mili){			
			return parseInt((__mili/1000)/60);		
		},

		secondToStringTime: function(__sec){
			var hour = Math.floor(__sec/3600);
			var minute = Math.floor((__sec - hour*3600)/60);
			var second = __sec - hour*3600 - minute*60;
			hour = hour>9?hour:"0"+hour;
			minute = minute>9?minute:"0"+minute;
			second = second>9?second:"0"+second;
			return hour+":"+minute+":"+second;
		},
		
		/**
		 * 根据传入的字符串日期和时间格式转换为毫秒的整数格式时间
		 * @param string __str : 格式为“2008-09-01 14:00:00”的日期和时间字符串
		 * @return long int : 毫秒的时间格式
		 */
		stringDateTimeToMiliTime: function(__str){
			var y = Math.floor(__str.substring(0,4));
			var m = Math.floor(__str.substring(5,7))-1;
			var d = Math.floor(__str.substring(8,10));
			var t_h = Math.floor(__str.substring(11,13));
			var t_m = Math.floor(__str.substring(14,16));
			var t_s = Math.floor(__str.substring(17,19));
			var my_date = new Date();
			my_date.setYear(y);
			my_date.setMonth(m);
			my_date.setDate(d);
			my_date.setHours(t_h);
			my_date.setMinutes(t_m);
			my_date.setSeconds(t_s);
			my_date.setMilliseconds(0);
			return my_date.getTime();
		},
		/* ---------------------------
		 功能 - 将输入字串前补add_string至设定宽度
		 参数 -
			arg1: 输入, 可以是字符串或数字
			arg2: 欲补到多宽的字串
			arg3: 欲补的字串，一般为一个字符
		---------------------------*/
		toPaddedString: function(input,width,add_string){
			var str = input.toString();
			while(str.length<width){
				str = add_string + str;
			}
			return str;
		},
        
        undefinedReplacer: function(input, replace){
            return (typeof(input)=="undefined")  ? replace : input;
        }
	}
};
/**
 * JavaScript Ajax Library v1.0
 * 
 * 1,执行基本ajax请求,返回XMLHttpRequest
 * Ajax.request(url,{
 * 		async 	是否异步 true(默认)
 * 		method 	请求方式 POST or GET(默认)
 * 		type 	数据格式 text(默认) or xml or json
 * 		encode 	请求的编码 UTF-8(默认)
 * 		timeout 请求超时时间 0(默认)
 * 		data 	请求参数 (字符串或json)
 * 		success 请求成功后响应函数 参数为text,json,xml数据
 * 		failure 请求失败后响应函数 参数为xmlHttp, msg, exp
 * });
 * 
 * 2,执行ajax请求,返回纯文本
 * Ajax.text(url,{
 * 		...
 * });
 * 
 * 3,执行ajax请求,返回JSON
 * Ajax.json(url,{
 * 		...
 * });
 * 
 * 4,执行ajax请求,返回XML
 * Ajax.xml(url,{
 * 		...
 * });
 */
var Ajax =
function(){
	function request(url,opt){
		function fn(){}
		opt = opt || {};
		var async   = opt.async !== false,
			method  = opt.method 	|| 'GET',
			type    = opt.type 		|| 'json',
			encode  = opt.encode 	|| 'UTF-8',
			timeout = opt.timeout 	|| 30000,
			data    = opt.data 		|| null,
			success = opt.success 	|| fn,
			failure = opt.failure 	|| fn;
			method  = method.toUpperCase();
		if(data && typeof data == 'object'){//对象转换成字符串键值对
			data = _serialize(data);
		}
		if(method == 'GET' && data){
            url += (url.indexOf('?') == -1 ? '?' : '&') + data;
			data = null;
        }	
		var xhr = function(){
			try{
				return new XMLHttpRequest();
			}catch(e){
				try{
					return new ActiveXObject('Msxml2.XMLHTTP');
				}catch(e){
					try{
						return new ActiveXObject('Microsoft.XMLHTTP');
					}catch(e){
						failure(null,'create xhr failed',e);
					}
				}
			}
		}();
		if(!xhr){return;}
		var isTimeout = false, timer;
		if(async && timeout>0){
			timer = setTimeout(function(){
				xhr.abort();
				isTimeout = true;
			},timeout);
		}
		xhr.onreadystatechange = function(){
			if (xhr.readyState == 4 && !isTimeout){
				_onStateChange(xhr, type, success, failure);
				clearTimeout(timer);
				xhr = null;
			}else{}
		};
		xhr.open(method,url,async);
		if(method == 'POST'){
			xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded;charset=' + encode);
		}
		
		xhr.send(data);
		return xhr;	
	}
	function _serialize(obj){
		var a = [];
		for(var k in obj){
			var val = obj[k];
			if(val.constructor == Array){
				for(var i=0,len=val.length;i<len;i++){
					a.push(k + '=' + encodeURIComponent(val[i]));
				}				
			}else{
				a.push(k + '=' + encodeURIComponent(val));
			}				
		}
		return a.join('&');
	}
	function strToJson(str){
	      var json = eval('(' + str + ')');  
    return json;  
   }
	function _onStateChange(xhr,type,success,failure){
   
		var s = xhr.status, result;

		if(s>= 200 && s < 300){
            switch(type){
                case 'text':
                    result = xhr.responseText;
                    break;
                case 'json':
                    result = function(str){
						try{
							//return JSON.parse(str);
							return strToJson(str);
						}catch(e){
							try{
								return (new Function('return ' + str))();
							}catch(e){
								failure(xhr,'parse json error',e);
							}
						}
                    }(xhr.responseText);
                    break;
                case 'xml':
                    result = xhr.responseXML;
                    break;
            }
           
			// text, 返回空字符时执行success
			// json, 返回空对象{}时执行suceess，但解析json失败，函数没有返回值时默认返回undefined
			
			typeof result !== 'undefined' && success(result);
			
			//请求超时，调用abort后xhr.status为0，但不知为0时是否还有其它的情况	
		}else if(s===0){
			failure(xhr,'request timeout');
		}else{
			failure(xhr,xhr.status);
		}
		xhr = null;
	}
	return (function(){
		var Ajax = {request:request}, types = ['text','json','xml'];
		for(var i=0,len=types.length;i<len;i++){
			Ajax[types[i]] = function(i){
				return function(url,opt){
					opt = opt || {};
					opt.type = types[i];
					return request(url,opt);
				}
			}(i);
		}
		return Ajax;
	})();
}();
//添加cookie
function addCookie(name,value,expireHours){ 
	var cookieString=name+"="+escape(value)+";path=/"; 
	//判断是否设置过期时间 
	if(expireHours>0){ 
	var date=new Date(); 
	date.setTime(date.getTime+expireHours*3600*1000); 
	cookieString=cookieString+"; expire="+date.toGMTString(); 
	}
	document.cookie=cookieString; 
} 
//获得cookie
function getCookie(name){ 
	var strCookie=document.cookie; 
	var arrCookie=strCookie.split("; "); 
	for(var i=0;i<arrCookie.length;i++){ 
	var arr=arrCookie[i].split("="); 
	if(arr[0]==name)return arr[1]; 
	}
	return ""; 
} 
//删除cookie
function deleteCookie(name){ 
	var date=new Date(); 
	date.setTime(date.getTime()-10000); 
	document.cookie=name+"=v;path=/; expire="+date.toGMTString(); 
}
//返回上一页
function goBack(){
	window.history.go(-1);
}

//系统消息处理
var redirectFlag = false;//灾备中播放重定向标志，0未重定向，1重定向
function sysinfohandle(){
	this.playEnd = function(){};
	this.playStart = function(){};
	this.playRedirect = function(){};
	this.broadcastPlay = function(){};
	this.playtochannel=function(){};// 回看到直播
	this.showSysError = function(content){
		var objdiv=$("syswin");
		if(objdiv == null){//层不存在
			var divObj = document.createElement("div");
			divObj.innerHTML = "<div id='syswin' class='sysTip'><div id='errortip'>"+content+"</div></div>";
			document.body.appendChild(divObj);
		}else{
			objdiv.style.visibility = "visible";
			objdiv.innerHTML ="<div id='errortip'>"+content+"</div>";
		}
	}
}
var sysEventHandle = new sysinfohandle(); //实例化消息处理对象

//声道处理
var trackChannelValue = new Array("L","R","S"); //保存声道样式，用图片的方式展示声道
var trackChannelIndex = 0;
var trackTimer = null;
var trackTimerFlag = false;

function trackChannelChange(mediaObj){
	var curTrackChannel;
	if(trackTimerFlag){
		mediaObj.switchAudioChannel();
	}
	curTrackChannel = mediaObj.getCurrentAudioChannel();
	checkTrack(curTrackChannel); 

	showTrackChannelFlag(trackChannelIndex);	//显示声道
}
function checkTrack(trackObj){
	var checkTrack = trackObj.substring(0,1)
	if(checkTrack == "L"){
		trackChannelIndex = 0;
	}else if(checkTrack == "R"){
		trackChannelIndex = 1;
	}else{
		trackChannelIndex = 2;
	}
}

function showTrackChannelFlag(trackMode){
	if(!trackTimerFlag){
		var divObj = document.createElement("div");
		divObj.innerHTML = "<div id='trackTip' class ='"+trackChannelValue[trackMode]+"'></div>";
		document.body.appendChild(divObj);
		trackTimerFlag = true;
	}else{
		$('trackTip').className = trackChannelValue[trackMode];
	}
	
	if(trackTimer){
		clearTimeout(trackTimer);
	}	
	trackTimer = setTimeout("hideTrackTip()",4000);
}

function hideTrackTip(){
	trackTimerFlag = false;
	var trackTipObj = $('trackTip');
	trackTipObj.parentNode.removeChild(trackTipObj);
}

//电源键处理（待机）
//按键移动区域类
function tipArea(){
	this.left = function(){};
	this.right = function(){};
	this.sele = function(){};
	this.show = function(){};
	this.hide = function(){};
}

function doPower(){
	var Extend = new QjyScript();
	Extend.exec("OVT_Entern_Standby");
}

var powerTipObj = function(){
	var language = new QjyScript().exec("OvtGetConfig","language");
	var config = [{"type":"cn","power":[{"item_0":"是否待机","item_1":"确定","item_2":"取消"}]},{"type":"eng","power":[{"item_0":"Enter Standby Mode?","item_1":"OK","item_2":"Cancel"}]},{},{},{}];
	var powerLanguageArr = [];
	for ( var i = 0; i< 5 ;i++){
		if( language == config[i].type){
			powerLanguageArr = config[i].power;
		}
	}
	
	var o = new tipArea();
	var index = 0;
	o.show = function(){
		var divObj = document.createElement("div");
		divObj.innerHTML = "<div id='powerwin'><div id='powertip'>"+powerLanguageArr[0].item_0+"</div><div id='powerbutton0' class='powerbutton0_on' >"+powerLanguageArr[0].item_1+"</div><div id='powerbutton1' class='powerbutton1_off'>"+powerLanguageArr[0].item_2+"</div></div>"
		document.body.appendChild(divObj);
	};
	o.right = function(){
		if(index == 0){
			$('powerbutton0').className = 'powerbutton0_off';
			$('powerbutton1').className = 'powerbutton1_on';
			index = 1;	
		}
	};
	o.left = function(){
		if(index == 1){
			$('powerbutton0').className = 'powerbutton0_on';
			$('powerbutton1').className = 'powerbutton1_off';
			index = 0;	
		}
	};
	o.hide = function(){
		index = 0;
		var powerDiv = $("powerwin");
		document.body.removeChild(powerDiv.parentNode);
		document.onkeypress = grabEvent;
		powerListener = false;
	};
	o.sele = function(){
		if(index == 0){
			return true;
		}
		else{
		   return false;
		}
	};

	return o;
}();

var powerListener = false;

document.addEventListener("keypress",powerGrabEvent,false);
function powerGrabEvent(event){
	//处理系统消息框
	var val = event.which | event.keyCode;
	if(val!=0x0300){sysErrorHandle();}
	switch(val){
		case ROC_IRKEY_LEFT:
			if(powerListener){
				powerTipObj.left();			
			}
		break;
		case ROC_IRKEY_RIGHT:
			if(powerListener){
				powerTipObj.right();					
			}
		break;
		case ROC_IRKEY_SELECT:
			if(powerListener){
				var powerFlag = powerTipObj.sele();		
				if(powerFlag){
					doPower();
				}else{
					powerTipObj.hide();
				}
			}
		break;
		case ROC_IRKEY_POWER:
			if(!powerListener){
				document.onkeypress = null;
				powerTipObj.show();
				powerListener = true;
			}else{
				doPower();	
			}
			return false;
		break;
		case ROC_IRKEY_BACK:
		case ROC_IRKEY_EXIT:
			if(powerListener){
				powerTipObj.hide();
			}
		break;
		case 0xEEF0:
		
		break;
		case 0x0300:
			 eval('MediaEventStr = ' + Utility.getEvent());
			if(MediaEventStr.type == 'EVENT_MEDIA_BEGINING')
			 {	
				sysEventHandle.playStart();
			 }
			 else if(MediaEventStr.type == 'EVENT_MEDIA_END')
			 {
				sysEventHandle.playEnd();
				
			 }
			 else if(MediaEventStr.type == 'EVENT_PLAYMODE_CHANGE'){//缓冲消息
			 	var play_mode = parseInt(MediaEventStr.new_play_mode,10); 	
				if( play_mode == 4 ){
					//showSysError("缓 冲 中 , 请 稍 等 ...");
					//sysErrorHandle();	
					bufferObj.showBuffer();
				}else if( play_mode == 2 ){
					sysErrorHandle();
					bufferObj.hideBuffer();
					sysErrorHandle();
					return;
				}else if( play_mode == 6 ){
					//判断播放结束的处理
					sysEventHandle.playEnd();
				}else if( play_mode == 5 ){
					//判断播放失败的处理
					bufferObj.hideBuffer();
					sysEventHandle.showSysError("播放失败，请选其他节目");	
				}					
			 }
			 else if(MediaEventStr.type == 'EVENT_MEDIA_ERROR')
			 {	
			 	//播放异常切换备机
//				if(!redirectFlag){
//					redirectFlag = true;
//					sysEventHandle.playRedirect();
//					return;
//				}
			 	//播放重定向后如果还是错误，提示错误消息
			 	var content = "";
				var mark = MediaEventStr.error_mark;
				if(typeof(mark) == 'undefined') mark = '';
				if(MediaEventStr.error_message == 'RTSP_STATUS_PLAYING'){
					sysErrorHandle();
					return;
				}else if(MediaEventStr.error_message == 'RTSP_STATUS_REDIRECTED_FAILED'){
					content = "服务重定向失效，请联系服务商";
				}else if(MediaEventStr.error_message == 'RTSP_STATUS_FORBIDDEN_REQUEST'){
					content = "请求内容被禁止，请联系服务商";
				}else if(MediaEventStr.error_message == 'RTSP_STATUS_SETUP_SESSION_NOT_FOUND' || MediaEventStr.error_message =='RTSP_STATUS_SESSION_NOT_FOUND'){
					content = "前端服务异常，请联系服务商";
				}else if(MediaEventStr.error_message == 'RTSP_STATUS_SERVER_INTERNAL_ERROR'){
					if(mark="10500"){
						content = "前端服务异常，请联系服务商";
						//sysEventHandle.playtochannel();
					}else{content = "前端服务异常，请联系服务商";}
				}else if(MediaEventStr.error_message == 'RTSP_STATUS_SERVICE_UNAVAILABLE'){
					content = "前端服务异常，请联系服务商";
				}else if(MediaEventStr.error_message == 'RTSP_CONNECT_STOPPED'){
					content = "播放器已断开，请联系服务商";
				}else if(MediaEventStr.error_message == 'RTSP_STATUS_PUSH_TS_NOT_SUPPORT'){
					content = "视频推流方式不支持";
				}else if(MediaEventStr.error_message == 'RTSP_STATUS_VERSION_ERROR'){
					content = "播放器版本错误";
				}else if(MediaEventStr.error_message == 'RTSP_STATUS_BAD_REQUEST'){
					content = "播放器异常，请重试";
				}else if(MediaEventStr.error_message == 'RTSP_STATUS_NOT_ACCEPTABLE_REQUEST'){
					content = "播放器异常，请重试";
				}else if(MediaEventStr.error_message == 'RTSP_STATUS_INVALID_PARAM'){
					content = "播放器异常，请重试";
				}else if(MediaEventStr.error_message == 'RTSP_STATUS_INVALID_RANGE'){
					content = "播放器异常，请重试";
				}else if(MediaEventStr.error_message == 'RTSP_STATUS_INVALID_OPTION'){
					content = "播放器异常，请重试";
				}else if(MediaEventStr.error_message == 'RTSP_STATUS_NOT_FOUND'){
					content = "节目暂停服务";
				}else if(MediaEventStr.error_message == 'RTSP_STATUS_NO_BANDWIDTH'){
					content = "服务带宽不足，请联系服务商";
				}else if(MediaEventStr.error_message == 'RTSP_CONNECT_FAILED'){
					content = "连接服务器失败，请重试";
				}else if(MediaEventStr.error_message == 'RTSP_SEND_FAILED'){
					content = "发送数据失败，请重试";
				}else if(MediaEventStr.error_message == 'RTSP_READ_FAILED'){
					content = "获取数据失败，请重试";
				}else if(MediaEventStr.error_message == 'RTSP_STATUS_NO_TS'){
					content = "播放器已断开，请重试";
					//sysEventHandle.broadcastPlay();
				}else if(MediaEventStr.error_message == 'RTSP_CONNECTION_DIED'){
					//content = "网线断掉,请检查网络";
				}else{
					content = "系统异常，请联系服务商";
				}
				bufferObj.hideBuffer();
				showSysError(content + "<br/><br/>提示码：" + mark);	
				//setTimeout("sysErrorHandle()",10000);
			 }
		break;
	}
}

//显示系统消息框
function showSysError(content){
	var objdiv=$("syswin");
	if(objdiv == null){//层不存在
		var divObj = document.createElement("div");
		divObj.innerHTML = "<div id='syswin' class='sysTip'><div id='errortip'>"+content+"</div></div>";
		document.body.appendChild(divObj);
	}else{
		objdiv.style.visibility = "visible";
		objdiv.innerHTML ="<div id='errortip'>"+content+"</div>";
	}
}
//任意键处理系统消息框
function sysErrorHandle(){
		var objdiv=$("syswin")
		if(objdiv!=null){
			if(objdiv.style.visibility!="hidden") objdiv.style.visibility = "hidden";
		}
}

//静态缓冲提示
function showBuffer(){
	/*if( $("bufDiv") ){
		$("bufDiv").style.visibility = "visible";
	}else{
		var bufferDiv = document.createElement("div");
		bufferDiv.id = "bufDiv";
		bufferDiv.style.position = "absolute";
		bufferDiv.style.top = "280px";
		bufferDiv.style.left = "560px";	
		bufferDiv.innerHTML = '<img src = "../../common/images/buffer.gif" width="160" height="160" />';
		
		document.body.appendChild(bufferDiv);
	}*/
}

function hideBuffer(){
	//$("bufDiv").style.visibility = "hidden";
}

//动态缓冲提示
/*var bufferObj = function(){
	var o = {};
	o.i=0;
	o.bufferTimer=0;
	o.showBuffer = function(){
		
		if($("bufDiv") ){
			$("bufDiv").style.visibility = "visible";
			bufferDiv.style.position = "absolute";
			bufferDiv.style.top = "300px";
			bufferDiv.style.left = "580px";	
			o.autoBuffer();
		}else{
			var bufferDiv = document.createElement("div");
			bufferDiv.id = "bufDiv";
			bufferDiv.style.position = "absolute";
			bufferDiv.style.top = "300px";
			bufferDiv.style.left = "580px";	
			bufferDiv.style.height = "150px";	
			bufferDiv.style.width = "125px";
			document.body.appendChild(bufferDiv);
			o.autoBuffer();
		}
	}
	o.autoBuffer = function(){
		if( o.i < 10){
			var left = -( 4 + o.i * 135);
			$("bufDiv").style.background = "url(../../common/images/buffer/buffer.png) no-repeat "+left+"px 0px";
				
			o.i++;
		}
		else{
			o.i = 0;
			$("bufDiv").style.background = "url(../../common/images/buffer/buffer.png) no-repeat -4px 0px";
			o.i++;
		 }
		 clearTimeout( o.bufferTimer );
		 o.bufferTimer = setTimeout(function (){o.autoBuffer()},120);
	}
	o.hideBuffer = function(){
		o.i = 0;
		
		$("bufDiv").style.visibility = "hidden";
		clearTimeout(o.bufferTimer);
	}
	return o;
}();*/
//动态缓冲提示
var bufferObj = function(){
	var o = {};
	o.i=0;
	o.bufferTimer=0;
	o.showBuffer = function(){
		
		if($("bufDiv") ){
			$("bufDiv").style.visibility = "visible";
			bufferDiv.style.position = "absolute";
			bufferDiv.style.top = "327px";
			bufferDiv.style.left = "605px";	
			o.autoBuffer();
		}else{
			var bufferDiv = document.createElement("div");
			bufferDiv.id = "bufDiv";
			bufferDiv.style.position = "absolute";
			bufferDiv.style.top = "327px";
			bufferDiv.style.left = "605px";	
			bufferDiv.style.height = "67px";	
			bufferDiv.style.width = "69px";
			document.body.appendChild(bufferDiv);
			o.autoBuffer();
		}
	}
	o.autoBuffer = function(){
		if( o.i < 10){
			var left = -( 0 + o.i * 69);
			$("bufDiv").style.background = "url(../../common/images/buffer/buffer.png) no-repeat "+left+"px 0px";
				
			o.i++;
		}
		else{
			o.i = 0;
			$("bufDiv").style.background = "url(../../common/images/buffer/buffer.png) no-repeat 0px 0px";
			o.i++;
		 }
		 clearTimeout( o.bufferTimer );
		 o.bufferTimer = setTimeout(function (){o.autoBuffer()},120);
	}
	o.hideBuffer = function(){
		o.i = 0;
		
		$("bufDiv").style.visibility = "hidden";
		clearTimeout(o.bufferTimer);
	}
	return o;
}();
//登陆

//密码加密
var hexcase = 0;
var chrsz   = 8;
function hex_md5(s){
	return binl2hex(core_md5(str2binl(s), s.length * chrsz));
}
function core_md5(x, len) {
	x[len >> 5] |= 0x80 << ((len) % 32);
	x[(((len + 64) >>> 9) << 4) + 14] = len;

	var a = 1732584193;
	var b = -271733879;
	var c = -1732584194;
	var d = 271733878;

	for(var i = 0; i < x.length; i += 16) {
		var olda = a;
		var oldb = b;
		var oldc = c;
		var oldd = d;
	
		a = md5_ff(a, b, c, d, x[i+ 0], 7 , -680876936);
		d = md5_ff(d, a, b, c, x[i+ 1], 12, -389564586);
		c = md5_ff(c, d, a, b, x[i+ 2], 17, 606105819);
		b = md5_ff(b, c, d, a, x[i+ 3], 22, -1044525330);
		a = md5_ff(a, b, c, d, x[i+ 4], 7 , -176418897);
		d = md5_ff(d, a, b, c, x[i+ 5], 12, 1200080426);
		c = md5_ff(c, d, a, b, x[i+ 6], 17, -1473231341);
		b = md5_ff(b, c, d, a, x[i+ 7], 22, -45705983);
		a = md5_ff(a, b, c, d, x[i+ 8], 7 , 1770035416);
		d = md5_ff(d, a, b, c, x[i+ 9], 12, -1958414417);
		c = md5_ff(c, d, a, b, x[i+10], 17, -42063);
		b = md5_ff(b, c, d, a, x[i+11], 22, -1990404162);
		a = md5_ff(a, b, c, d, x[i+12], 7 , 1804603682);
		d = md5_ff(d, a, b, c, x[i+13], 12, -40341101);
		c = md5_ff(c, d, a, b, x[i+14], 17, -1502002290);
		b = md5_ff(b, c, d, a, x[i+15], 22, 1236535329);
		
		a = md5_gg(a, b, c, d, x[i+ 1], 5 , -165796510);
		d = md5_gg(d, a, b, c, x[i+ 6], 9 , -1069501632);
		c = md5_gg(c, d, a, b, x[i+11], 14, 643717713);
		b = md5_gg(b, c, d, a, x[i+ 0], 20, -373897302);
		a = md5_gg(a, b, c, d, x[i+ 5], 5 , -701558691);
		d = md5_gg(d, a, b, c, x[i+10], 9 , 38016083);
		c = md5_gg(c, d, a, b, x[i+15], 14, -660478335);
		b = md5_gg(b, c, d, a, x[i+ 4], 20, -405537848);
		a = md5_gg(a, b, c, d, x[i+ 9], 5 , 568446438);
		d = md5_gg(d, a, b, c, x[i+14], 9 , -1019803690);
		c = md5_gg(c, d, a, b, x[i+ 3], 14, -187363961);
		b = md5_gg(b, c, d, a, x[i+ 8], 20, 1163531501);
		a = md5_gg(a, b, c, d, x[i+13], 5 , -1444681467);
		d = md5_gg(d, a, b, c, x[i+ 2], 9 , -51403784);
		c = md5_gg(c, d, a, b, x[i+ 7], 14, 1735328473);
		b = md5_gg(b, c, d, a, x[i+12], 20, -1926607734);
		
		a = md5_hh(a, b, c, d, x[i+ 5], 4 , -378558);
		d = md5_hh(d, a, b, c, x[i+ 8], 11, -2022574463);
		c = md5_hh(c, d, a, b, x[i+11], 16, 1839030562);
		b = md5_hh(b, c, d, a, x[i+14], 23, -35309556);
		a = md5_hh(a, b, c, d, x[i+ 1], 4 , -1530992060);
		d = md5_hh(d, a, b, c, x[i+ 4], 11, 1272893353);
		c = md5_hh(c, d, a, b, x[i+ 7], 16, -155497632);
		b = md5_hh(b, c, d, a, x[i+10], 23, -1094730640);
		a = md5_hh(a, b, c, d, x[i+13], 4 , 681279174);
		d = md5_hh(d, a, b, c, x[i+ 0], 11, -358537222);
		c = md5_hh(c, d, a, b, x[i+ 3], 16, -722521979);
		b = md5_hh(b, c, d, a, x[i+ 6], 23, 76029189);
		a = md5_hh(a, b, c, d, x[i+ 9], 4 , -640364487);
		d = md5_hh(d, a, b, c, x[i+12], 11, -421815835);
		c = md5_hh(c, d, a, b, x[i+15], 16, 530742520);
		b = md5_hh(b, c, d, a, x[i+ 2], 23, -995338651);
		
		a = md5_ii(a, b, c, d, x[i+ 0], 6 , -198630844);
		d = md5_ii(d, a, b, c, x[i+ 7], 10, 1126891415);
		c = md5_ii(c, d, a, b, x[i+14], 15, -1416354905);
		b = md5_ii(b, c, d, a, x[i+ 5], 21, -57434055);
		a = md5_ii(a, b, c, d, x[i+12], 6 , 1700485571);
		d = md5_ii(d, a, b, c, x[i+ 3], 10, -1894986606);
		c = md5_ii(c, d, a, b, x[i+10], 15, -1051523);
		b = md5_ii(b, c, d, a, x[i+ 1], 21, -2054922799);
		a = md5_ii(a, b, c, d, x[i+ 8], 6 , 1873313359);
		d = md5_ii(d, a, b, c, x[i+15], 10, -30611744);
		c = md5_ii(c, d, a, b, x[i+ 6], 15, -1560198380);
		b = md5_ii(b, c, d, a, x[i+13], 21, 1309151649);
		a = md5_ii(a, b, c, d, x[i+ 4], 6 , -145523070);
		d = md5_ii(d, a, b, c, x[i+11], 10, -1120210379);
		c = md5_ii(c, d, a, b, x[i+ 2], 15, 718787259);
		b = md5_ii(b, c, d, a, x[i+ 9], 21, -343485551);
		
		a = safe_add(a, olda);
		b = safe_add(b, oldb);
		c = safe_add(c, oldc);
		d = safe_add(d, oldd);
	}
	return Array(a, b, c, d);
}
function md5_cmn(q, a, b, x, s, t) {
	return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s),b);
}
function md5_ff(a, b, c, d, x, s, t) {
	return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
}
function md5_gg(a, b, c, d, x, s, t) {
	return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
}
function md5_hh(a, b, c, d, x, s, t) {
	return md5_cmn(b ^ c ^ d, a, b, x, s, t);
}
function md5_ii(a, b, c, d, x, s, t) {
	return md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
}
function safe_add(x, y) {
	var lsw = (x & 0xFFFF) + (y & 0xFFFF);
	var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
	return (msw << 16) | (lsw & 0xFFFF);
}
function bit_rol(num, cnt) {
	return (num << cnt) | (num >>> (32 - cnt));
}
function str2binl(str) {
	var bin = Array();
	var mask = (1 << chrsz) - 1;
	for(var i = 0; i < str.length * chrsz; i += chrsz) {
		bin[i>>5] |= (str.charCodeAt(i / chrsz) & mask) << (i%32);
	}
	return bin;
}
function binl2hex(binarray) {
	var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
	var str = "";
	for(var i = 0; i < binarray.length * 4; i++) {
		str += hex_tab.charAt((binarray[i>>2] >> ((i%4)*8+4)) & 0xF) + hex_tab.charAt((binarray[i>>2] >> ((i%4)*8 )) & 0xF);
	}
	return str;
}
/*
i=0代表今天 正数代表未来,负数代表过去。
返回20120904;
*/
function getdatestr(i)
{
	var nowdate=new Date();
	var weekdate=new Date();
	weekdate.setDate(nowdate.getDate()+i);
	var weekyear=weekdate.getFullYear();
	var weekmonth=weekdate.getMonth()+1;
	weekmonth=weekmonth>9?weekmonth:("0"+weekmonth)
	var weekdate=weekdate.getDate();
	weekdate=weekdate>9?weekdate:("0"+weekdate)
	var str=weekyear+''+weekmonth+''+weekdate;
	return str;
}
