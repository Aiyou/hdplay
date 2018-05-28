// 本文件定义常见的键值
//***************************** 键值定义 *****************************
var ROC_IRKEY_NUM0          = 48    /*0x0030,  数字键0*/
var ROC_IRKEY_NUM1          = 49    /*0x0031,  数字键1*/
var ROC_IRKEY_NUM2          = 50    /*0x0032,  数字键2*/
var ROC_IRKEY_NUM3          = 51    /*0x0033,  数字键3*/
var ROC_IRKEY_NUM4          = 52    /*0x0034,  数字键4*/
var ROC_IRKEY_NUM5          = 53    /*0x0035,  数字键5*/
var ROC_IRKEY_NUM6          = 54    /*0x0036,  数字键6*/
var ROC_IRKEY_NUM7          = 55    /*0x0037,  数字键7*/
var ROC_IRKEY_NUM8          = 56    /*0x0038,  数字键8*/
var ROC_IRKEY_NUM9          = 57    /*0x0039,  数字键9*/
var ROC_IRKEY_UP            = 38    /*0x0026,  遥控器上的向上键*/
var ROC_IRKEY_DOWN          = 40    /*0x0028,  遥控器上的向下键*/
var ROC_IRKEY_LEFT          = 37    /*0x0025,  遥控器上的向左键*/
var ROC_IRKEY_RIGHT         = 39    /*0x0027,  遥控器上的向右键*/
var ROC_IRKEY_SELECT        = 13    /*0x000D,  遥控器上的确定键,即OK*/
var ROC_IRKEY_BACK          = 8		/*0x0280,  遥控器上的返回键,即TOGGLE*/
var ROC_IRKEY_EXIT          = 1285	/*0x0119,  取消/退出键,即CANCEL*/
var ROC_IRKEY_CHANNEL_UP  = 257   /*0x01AC,  遥控器上的频道减少键*/
var ROC_IRKEY_CHANNEL_DOWN    = 258   /*0x01AB,  遥控器上的频道增加键*/
var ROC_IRKEY_PAGE_UP       = 33    /*0x0021,  遥控器上的向上翻页键*/
var ROC_IRKEY_PAGE_DOWN     = 34    /*0x0022,  遥控器上的向下翻页键*/
var ROC_IRKEY_VOLUME_UP     = 259   /*0x01BF,  遥控器上的音量增大键*/
var ROC_IRKEY_VOLUME_DOWN   = 260   /*0x01C0,  遥控器上音量减小键*/
var ROC_IRKEY_VOLUME_MUTE   = 261   /*0x01C1,  遥控器上的静音键*/
//var ROC_IRKEY_TRACK         = 262   /*0x0197,  遥控器上的声道键,即AUDIO*/
var ROC_IRKEY_TRACK         = 0x0506   /*0x0506,  遥控器上的支付键提到声道键*/
var ROC_IRKEY_RED           = 275   /*0x0193,  代表红色按键 直播*/
var ROC_IRKEY_GREEN         = 276   /*0x0196,  代表绿色按键 回看*/
var ROC_IRKEY_YELLOW        = 277   /*0x0194,  代表黄色按键 点播*/
var ROC_IRKEY_BLUE          = 278   /*0x0195,  代表蓝色按键 信息*/
var ROC_IRKEY_REWIND		=1282	/* 快退*/
var ROC_IRKEY_FAST			=1283	/* 快进*/
var ROC_IRKEY_STOP          =1284	/*遥控器上的停止键*/
var ROC_IRKEY_PLAY          =263	/*0x0107,  遥控器上的播放暂停键*/
var POC_IRKEY_INDEX			=272	/*首页*/
//var ROC_IRKEY_POWER         =256    /*0xFFFF,  遥控器上的指示关机与开机键----旧盒子程序20120612*/
var ROC_IRKEY_POWER         =1279    /*0x04FF,  遥控器上的指示关机与开机键-----新盒子程序20120612*/
var ROC_IRKEY_CIRCULATE     =280    /*遥控器上的循环键*/
var ROC_IRKEY_LOCATION      =271    /*遥控器定位键*/
var ROC_IRKEY_SET           =285    /*遥控器设置键*/

//暂无
var ROC_IRKEY_MENU          = 72   /*0x01D4,  遥控器上的菜单键*/
var ROC_IRKEY_INFO          = 291   /*0x01C9,  遥控器上的信息键*/
var ROC_IRKEY_EPG           = 69  /*0x01CA,  遥控器上的节目指南键,预告键,即GUIDE*/
var ROC_IRKEY_LIKE          = 76   /*0x01CB,  遥控器上的字幕键/频道喜爱键,即TELETEXT*/
var ROC_IRKEY_NVOD          = 315   /*0x0283,  遥控器上的卡信息或点播键,交互键, 即CARD_INFO*/ 
var ROC_IRKEY_MAIL          = 77   /*0x0284,  遥控器上的邮件键*/
var ROC_IRKEY_PROGRAM_LIST  = 0x0281   /*0x0281,  遥控器上的频道列表键或咨询键,即PROG_LIST*/
var ROC_IRKEY_TV_RADIO      = 0x0282   /*0x0282,  遥控器上的指示"电视/音频广播"键*/
var ROC_IRKEY_GRAY_VOLUME_UP       =245    /*遥控器上的灰色音量加键*/
var ROC_IRKEY_GRAY_VOLUME_DOWN     =244    /*遥控器上的灰色音量减键*/

//var MY_API_ADDR = 'http://192.168.1.107/api/';	//该机顶盒数据请求的接口地址
//var MY_API_ADDR = 'http://iptv.mmbtv.com/api/';	//该机顶盒数据请求的接口地址
//var MY_API_ADDR_ROOT = 'http://iptv.mmbtv.com/';

//中间件播放器封装
var OVT_TYPE = "OVTiptv";	//中间件类型,OVTiptv,OVTngod,Ipanel,Tianbai,tongzhou
var OVT_media;				//播放器接口
var OVT_script = new QjyScript();	//机顶盒访问对象接口
Navigation.disableDefaultNavigation();		//禁止浏览器的默认聚焦行为
var OVT_CA;			//CA卡号接口
//网站首页获取
var MY_PORTAL_ADDR = '';
try{
	MY_PORTAL_ADDR = OVT_script.exec("OvtGetConfig", "auth_server_url");
}
catch(e){
	MY_PORTAL_ADDR = 'file:///mnt1/apps/index/';
}
MY_PORTAL_ADDR = "http://iptv.mmbtv.com/";
var MY_API_ADDR = MY_PORTAL_ADDR+"/api/"
//遥控器上的系统按键
var	 mainMenuUrl = [{"name":"首页","url":"../index/index.html"},{"name":"频道","url":"channel/channelplay.html?type=tv"},{"name":"回看","url":"channel/channelplay.html?type=epg"},{"name":"点播","url":"vod/vod.html"},{"name":"资讯","url":"../webapp/news/newfirst.html"},{"name":"设置","url":"../sys/sysset_passwd.html"}];
var INDEXARRAY=["iptv.com","OVTA0000000000000556","60000"];//首页视频循环播放媒资,时间
var MediaEventStr;
//频道列表
function authentication(){
  this.CTCGetConfig = function(id){return 1;}
}
Authentication = new authentication();
//串口输出
function QjyScript8(){

	this.debug = function(str){	
		//
	}
	this.exec = function (name,msg){
		if(name == "SYS_DbgPrint"){
			this.objdiv = $("#debugdiv");
			if(this.objdiv == null){//层不存在
				var divObj = document.createElement("div");
				divObj.innerHTML ='<div id="debugdiv" style="background:#CCC;position:absolute;width:200px;z-index:100;left:10px;top:10px;"></div>';
				document.body.appendChild(divObj);
				this.objdiv = $("debugdiv");
			}
			this.objdiv.innerHTML += msg+"<br>"
		}
		return "";
	}
	this.debug = function(msg){
			this.objdiv = $("#debugdiv");
			if(this.objdiv == null){//层不存在
				var divObj = document.createElement("div");
				divObj.innerHTML ='<div id="debugdiv" style="background:#CCC;position:absolute;width:200px;z-index:100;left:10px;top:10px;"></div>';
				document.body.appendChild(divObj);
				this.objdiv = $("debugdiv");
			}
			this.objdiv.innerHTML += msg+"<br>"
	}

	

}

function getAuthMac()
{
	var hwversion = OVT_script.exec("OvtGetConfig","software_ver");
	if(hwversion.indexOf('.') >= 0)
	{  
			var temVersion = hwversion.split('.');
			var temMain = parseInt(temVersion[0]);
			if(temMain > 3)
			{
				return OVT_script.exec("OvtGetConfig","eth0_mac_addr");
			}
			else if(temMain == 3)
			{
				if(parseInt(temVersion[1]) > 0)	
					return OVT_script.exec("OvtGetConfig","eth0_mac_addr");
				else 
					return OVT_script.exec("OvtGetConfig","mac_addr");
			}
			else 
				return OVT_script.exec("OvtGetConfig","mac_addr");
	}
	else
	{
			var hw = parseInt(hwversion);
			if(hw > 3) 
				return OVT_script.exec("OvtGetConfig","eth0_mac_addr");
			else 
				return OVT_script.exec("OvtGetConfig","mac_addr");
	}
}

function showSysError(s)
{
	$("#div_msg").css({left:500,top:300}).html(s).show();
}

function hideSysError()
{
	$("#div_msg").hide();
}
function show_history()
{
	window.location.href = 'history.html';
}
function show_favorite()
{
	window.location.href = 'favorite.html';
}

function show_find_page()
{
	window.location.href = 'search.html';
}
//收藏
 function ifavorite(tvid,name,pic){
	//return false;
	//OVT_script.exec("OvtSetInfor2File","favorite",'');
	var liststr=OVT_script.exec("OvtGetInforFromFile","favorite");
	if(!liststr){
		str = '{id:'+ tvid +',name:"'+ name +'",pic:"'+ pic +'"}';
		OVT_script.exec("OvtSetInfor2File","favorite",str);
		//$("#div_recommend").html(str);
		showSysError("收藏成功");
		setTimeout( function(){ hideSysError(); },2000 )
	}else{
		listarray=liststr.split("|",12);//把一个字符串分割成字符串数组
		var flag = false;
		for(var j=0;j<listarray.length;j++){
			//只要不是对象 说明格式不匹配
			if(typeof(listarray[j])!='object')
			{
				continue;
			}
			var curId = str2json(listarray[j]).id;
			if( curId == tvid ){
				flag = true;
			}
		}
		
		if( !flag ){
			str = '{id:'+ tvid +',name:"'+ name +'",pic:"'+ pic +'"}';
			listarray.unshift(str);//添加到数组开始   //可向数组的开头添加一个或更多元素，并返回新的长度。
			var setstr=listarray.join("|");//把数组中的所有元素放入一个字符串
			OVT_script.exec("OvtSetInfor2File","favorite",setstr);
			showSysError("收藏成功");
			setTimeout( function(){ hideSysError(); },2000 )
		}else{
			showSysError("已经收藏");
			setTimeout( function(){ hideSysError(); },2000 )
		}
	}
}
//收藏
function ihistory(tvid,name,pic){
	//return false;
	//OVT_script.exec("OvtSetInfor2File","history",'');
	var liststr=OVT_script.exec("OvtGetInforFromFile","history");
	if(!liststr){
		str = '{id:'+ tvid +',name:"'+ name +'",pic:"'+ pic +'"}';
		OVT_script.exec("OvtSetInfor2File","history",str);
	}else{
		listarray=liststr.split("|",12);//把一个字符串分割成字符串数组
		var flag = false;
		for(var j=0;j<listarray.length;j++){
			//只要不是对象 说明格式不匹配
			if(typeof(listarray[j])!='object')
			{
				continue;
			}
			var curId = str2json(listarray[j]).id;
			if( curId == tvid ){
				flag = true;
			}
		}
		
		if( !flag ){
			str = '{id:'+ tvid +',name:"'+ name +'",pic:"'+ pic +'"}';
			listarray.unshift(str);//添加到数组开始   //可向数组的开头添加一个或更多元素，并返回新的长度。
			var setstr=listarray.join("|");//把数组中的所有元素放入一个字符串
			OVT_script.exec("OvtSetInfor2File","history",setstr);
		}
		
	}
	

}
//将字符串转成json
function str2json(str){
	var json = eval('(' + str + ')');  
	return json;  
}

function showDiv(divid)
{
	o(divid).style.display = '';
}

function hideDiv(divid)
{
	o(divid).style.display = 'none';
}

function o(id)
{
	return document.getElementById(id);
}
//jquery 操作CSS方法 的JS实现
function css(obj, attr, value) {
	switch (arguments.length) {
		case 2:
			if (typeof arguments[1] == "object") {    //批量设置属性
				for (var i in attr) obj.style[i] = attr[i]
			}
			else {    // 读取属性值
				return obj.currentStyle ? obj.currentStyle[attr] : getComputedStyle(obj, null)[attr]
			}
			break;
		case 3:
			//设置属性
			obj.style[attr] = value;
			break;
		default:
			return "";
	}
}
function hasClass(obj, cls) {
	return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
}

function addClass(obj, cls) {
	if (!this.hasClass(obj, cls)) obj.className += " " + cls;
}

function removeClass(obj, cls) {
	if (hasClass(obj, cls)) {
		var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
		obj.className = obj.className.replace(reg, ' ');
	}
}

//添加cookie
function setCookie(name,value,expireHours){ 
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
	var strCookie=unescape(document.cookie); 
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

//属性扩展函数
/*
function extend(parentObj,obj)
{
	if(typeof(obj)!='object' || typeof(parentObj)!='object')
	{
		return false;
	}
	else
	{
		var tmpvalue;
		
		for(var i in obj)
		{
			tmpvalue = obj[i];
			if(typeof(tmpvalue) == 'string'){
				eval('parentObj.' + i + '= "' + tmpvalue + '"'　);
			}else{
				eval('parentObj.' + i + '= ' + tmpvalue + ''　);
			}
		}
	}
}*/
//获取地址栏参数函数
function g(param)
{
	var l = arguments.length;
	var default_v = '';
	if(l==2)
	{
		default_v = arguments[1];
	}
	var s = window.location.href;
	var pos = s.indexOf('?');
	if(pos==-1)
	{
		return default_v;
	}
	s = s.substr(pos+1,s.length-pos-1);
	if(s.indexOf('&')==-1)
	{
		if(s.indexOf(param+'=')>-1){
			return s.replace(param+'=','');
		}
		return default_v;
	}
	var sarr = s.split('&');
	var tmplen = param.length;
	for(var i=0;i<sarr.length;i++)
	{
		if(sarr[i].substr(0,tmplen)==param)
		{
			return sarr[i].replace(param+'=','');
		}
	}
	return default_v;
}
function loadJS(url)
{
	document.write('<script type="text/javascript" src="'+ url +'"></'+'script>');
}
function GF_WebPrint(msg){
	var Extend = new QjyScript();
	//Extend.exec("SYS_DbgPrint","ovtportal:"+msg);	
	Extend.debug("ovtportal:"+msg);
}