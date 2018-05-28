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
var ROC_IRKEY_CHANNEL_DOWN  = 257   /*0x01AC,  遥控器上的频道减少键*/
var ROC_IRKEY_CHANNEL_UP    = 258   /*0x01AB,  遥控器上的频道增加键*/
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

//中间件播放器封装
var OVT_TYPE = "OVTiptv";//中间件类型,OVTiptv,OVTngod,Ipanel,Tianbai,tongzhou
var OVT_media;//播放器接口
var OVT_CA;//CA卡号接口
/*兼容浏览器好调试*/
if(OVT_TYPE == "OVTiptv"&&typeof(MediaPlayer) == 'undefined') {	
	//播放器
	function MediaPlayer(){
		this.getNativePlayerInstanceID = function(){return 1;}
		this.setSingleOrPlaylistMode = function(id){}
		this.setVideoDisplayMode = function(id){}
		this.setVideoDisplayArea = function(id1,id2,id3,id4){}
		this.refreshVideoDisplay = function(){}
		this.joinChannel = function(userChannelID){}
		this.gotoStart = function(){}
		this.leaveChannel = function(){}
		this.releaseMediaPlayer = function(InstanceID){}
		this.setVolume = function(value){}
		this.getVolume = function(){return 1;}
		this.setSingleMedia = function(str){}
		this.playFromStart = function(){}
		this.pause=function(){}
		this.resume=function(){}
		this.stop = function (){}
		this.getCurrentPlayTime = function(){return 0;}
		this.setCycleFlag = function(id){return 0;}
		this.setAllowTrickmodeFlag = function(id){return 0;}
		this.playByTime = function(id,id,id){}
		this.setMuteFlag=function(str){}
		this.getMuteFlag=function(str){}
		this.getMediaDuration=function(){return 0;}
	}
	//频道列表
	function authentication(){
	  this.CTCGetConfig = function(id){return 1;}
	}
	Authentication = new authentication();
	//串口输出
	function QjyScript(){
		this.debug = function(str){		
		}
		this.exec = function (name,msg){
			if(name == "SYS_DbgPrint"){
				this.objdiv = $("debugdiv");
				if(this.objdiv == null){//层不存在
					var divObj = document.createElement("div");
					divObj.innerHTML ='<div id="debugdiv" style="background:#CCC;position:absolute;width:200px;z-index:100;left:10px;top:10px;"></div>';
					document.body.appendChild(divObj);
					this.objdiv = $("debugdiv");
				}
				this.objdiv.innerHTML += msg+"<br>"
			}else if(name == "OvtGetConfig"){
					if(msg=="language"){
						return "eng";
					}				
			}
			return "";
		}
		this.debug=function(msg){
				this.objdiv = $("debugdiv");
				if(this.objdiv == null){//层不存在
					var divObj = document.createElement("div");
					divObj.innerHTML ='<div id="debugdiv" style="background:#CCC;position:absolute;width:200px;z-index:100;left:10px;top:10px;"></div>';
					document.body.appendChild(divObj);
					this.objdiv = $("debugdiv");
				}
				this.objdiv.innerHTML += msg+"<br>"
		}
	}
}
else if((OVT_TYPE == "Ipanel"||OVT_TYPE == "Tianbai")&&typeof(media) == 'undefined'){//兼容浏览器
///*
	media = {};
	media.AV = media.AV || {
		open: function(){},
		close: function(){},
		play: function(){},
		stop: function(){},
		pause: function(){},
		forward: function(){},
		backward: function(){},
		seek: function(){},
		status:""
	};
	media.video = {
		setPosition: function(){},
		fullScreen: function(){}
	};
	media.sound = {
		up: function(){},
		down: function(){},
		mute: function(){},
		value:10
	};
	VODControl = function(){
		this.Get = function(value){
			var returnstr = 100;
			return returnstr;
		}
	}
	CA = {};
	 CA.card = {cardId:100
	}
//*/
}

//OVT_IPTV相关
if(OVT_TYPE == "OVTiptv"){//OVT_IPTV相关
	OVT_media = function(){
		this.id = 0;
		this.myplay = "";
		this.joinChannelFlg = -1;
		this.init = function(screentype,x,y,w,h){
			this.myplay = new MediaPlayer();
			this.id = this.myplay.getNativePlayerInstanceID();	
			this.myplay.setSingleOrPlaylistMode(0);//0:单媒体(默认值)，1:播放列表
			if (screentype == 1){//全屏
				this.myplay.setVideoDisplayMode(1);//1代表全屏显示
			}else{
				this.myplay.setVideoDisplayMode(0);//
				this.myplay.setVideoDisplayArea(x,y,w,h);
			}
			this.myplay.refreshVideoDisplay();//设置生效
		}
		this.getInstanceID = function(){//获取实例--殷腾飞
			this.id = this.myplay.getNativePlayerInstanceID();	
		}
		this.seturl = function(url){//设计URL
			//点播-"rtsp://10.160.34.70:6554/;purchaseToken=ovt.com-6210-VOD";
			var mediaStr = this.toJson(url);
			this.myplay.setSingleMedia(mediaStr);
		}
		this.setchannel = function(channelid){//直播地址
			if ( this.joinChannelFlg == -1 ){ 
				this.myplay.joinChannel(channelid);
				this.joinChannelFlg = 0;
			}else {
				this.myplay.leaveChannel();
				this.myplay.joinChannel(channelid);
			}
		}
		this.leaveChannel = function(){//停止直播 －－田彦荣
			this.myplay.leaveChannel();
		}
		this.leave = function (){//停止直播并释放资源 －－田彦荣
			this.myplay.leaveChannel();
			this.myplay.releaseMediaPlayer(this.id);
		}
		this.play = function(){//播放页面
			this.myplay.playFromStart();
		}
		this.forward = function(pace){//快进 8,16,32
			this.myplay.fastForward( pace );
		}
		this.backward = function(pace){//快退 -8,-16,-32
			this.myplay.fastRewind( pace );
		}
		this.seek = function(time){//跳转时间 秒
			this.myplay.playByTime(1,time,1);
		}
		this.pause = function(flag){//flag=1:最后一帧，0：黑场
			this.myplay.pause();
		}
		this.resume = function(){
			this.myplay.resume();
		}
		this.getplaytime = function(){
			return this.myplay.getCurrentPlayTime()
		}
		this.stop = function(){//停止播放
			this.myplay.stop();
		}
		this.close = function(){//关闭播放器
			this.myplay.stop();
			this.myplay.releaseMediaPlayer(this.id);
		}
		this.toJson = function(url){//返回点播url
			return '[{mediaUrl:"'+url
			+'",mediaCode: "media1",'
			+'mediaType:2,'
			+'audioType:1,'
			+'videoType:1,'
			+'streamType:2,'
			+'drmType:1,'
			+'fingerPrint:0,'
			+'copyProtection:1,'
			+'allowTrickmode:1,'
			+'startTime:0,'
			+'endTime:5000,'
			+'entryID:"entry1"}]';
		}
		this.getVolume = function(){
			return this.myplay.getVolume();
		}
		this.setVolume = function(value){//设置音量 －－田彦荣
			this.myplay.setVolume(parseInt(value));
		}
		this.getMuteFlag = function(){//得到静音的值 －－田彦荣
			return this.myplay.getMuteFlag();
		}
		this.setMuteFlag = function(value){//设置静音的值 －－田彦荣
			this.myplay.setMuteFlag(parseInt(value));
		}
		this.getProgramLen = function(){
			return this.myplay.getMediaDuration();
		}
	}
	//CA卡号统一
	var sys_set = new QjyScript();//获取系统变量
	var ovt_ca = function(){
		this.NO = function (){
		//  var no = sys_set.exec("OvtGetConfig", "stbid");
		 var no = sys_set.exec("OvtGetConfig", "user_name");
		  return no;
	  }
	  this.PASSWORD = function(){
		  var no = sys_set.exec("OvtGetConfig", "password");
		  return no;
		  //return "123456"
	 }
  }
  OVT_CA = new ovt_ca();//获取CA卡号
}else if(OVT_TYPE == "OVTngod"){//OVTngod相关
	OVT_media = function(){
		this.id = 0;
		this.myplay = "";
		this.init = function(screentype,x,y,w,h){//type=1:全屏, x=x轴,y=轴坐标，w=宽，h=高
			this.myplay = new MediaPlayer();
  			this.id = this.myplay.createPlayerInstance("Video",2);//创建播放器实
			this.myplay.bindPlayerInstance(this.id);
			if(screentype == 1){//全屏
				this.myplay.position = "1,0,0,0,0";
			}else{
				this.myplay.position = "0,"+x+","+y+","+w+","+h;
			}
		}
		this.seturl = function(url,mediatype){//url播放地址，mediatype=vod：点播
			//url="rtsp://ip:port;purchaseToken=;serverId=;"
			//直播地址"delivery://259000.6875.64QAM.301.2048.2049";
  			this.myplay.source = url;
		}
		this.play = function(){//播放
			this.myplay.pace = 1;
  			var finish = myplay.play();
		}
		this.forward = function(pace){//快进 -8,-16,-32
			this.myplay.pace = pace;
			this.myplay.refresh();
		}
		this.backward = function(pace){//快退 -8,-16,-32
			this.myplay.pace = pace;
			this.myplay.refresh();
		}
		this.seek = function(time){
			this.myplay.point = parseInt(time);//秒,值
			this.myplay.refresh();
		}
		this.pause = function(flag){//flag=1:最后一帧，0：黑场
			this.myplay.pause(flag);
		}
		this.close = function(){//关闭播放器
			this.myplay.pause(0);
			this.myplay.refresh();
			this.myplay.releasePlayerInstance();
		}
		this.getplaytime = function(){
			return 0;
		}
	}
	//CA卡号沟通
  var ovt_ca = function(){
	  this.NO = function (){
		  var no = CA.icNo;
		  return no;
	  }
  }
  OVT_CA = new ovt_ca();//获取CA卡号
  
}else if(OVT_TYPE == "Ipanel"){//江阴茁壮
  OVT_media = function(){
	  this.id = 0;
	  this.init = function(screentype,x,y,w,h){//type=1:全屏, x=x轴,y=轴坐标，w=宽，h=高
		  if (screentype == 1){
			 media.video.fullScreen();//全屏幕显示
		  }else {
			  media.video.setPosition(x,y,w,h);
		  }
	  }
	  this.seturl = function(url,mediatype){//url播放地址，mediatype=vod：点播
		//url="rtsp://ip:port;purchaseToken=;qam_name=;serverId=;client=;"
		url += ";qam_name=224;serverId=1.1.1.1;client=AA00BBCCDDEE"
		media.AV.open(url ,mediatype);
		}
	  this.play = function(){//播放
		  media.AV.play();
	  }
	  this.forward = function(pace){//快进
		  media.AV.forward(pace);
	  }
	  this.backward = function(pace){//快退
		  media.AV.backward(pace)	
	  }
	  this.seek = function(time){
		  var seektime = timetohour(time);
		 // alert("跳转时间="+seektime);
		  media.AV.seek(seektime);//time  hh:mm:ss
	  }
	  this.pause = function(flag){
		  media.AV.pause();	
	  }
	  this.resume = function(){
			 media.AV.play();
	  }
	  this.close = function(){
		  //alert(1);
		  media.AV.close();//----关闭音视频
	  }
	  this.getplaytime = function(){
			var time = media.AV.elapsed;
			return time;
	}
	this.getVolume = function(){
		var volume = 20
		return volume;
	}
	this.setVolume = function(value){
	}
	this.setMuteFlag = function(flag){
	}
  }
  //CA卡号统一
  var ovt_ca = function(){
	  this.NO = function (){
		  var no = CA.card.cardId;
		  return no;
	  }
  }
  OVT_CA = new ovt_ca();//获取CA卡号
}else if(OVT_TYPE == "Tianbai"){
	OVT_media = function(){
	  this.id = 0;
	  this.init = function(screentype,x,y,w,h){//type=1:全屏, x=x轴,y=轴坐标，w=宽，h=高
		  if(screentype == 1){
			 media.video.fullScreen(1);//全屏幕显示
		  }else{
			  media.video.setPosition(x,y,w,h);
		  }
	  }
	  this.seturl = function(url,mediatype){//url播放地址，mediatype=vod：点播
		//url="rtsp://ip:port;purchaseToken=;qam_name=;serverId=;client=;"
		url += ";serverId=172.16.30.1;|v=orientview;qamname=224";
		mediatype = 15;
		media.AV.open(url ,mediatype);
		}
	  this.play = function(){//播放
		  media.AV.play();
	  }
	  this.forward = function(pace){//快进
		  media.AV.forward(pace);
	  }
	  this.backward = function(pace){//快退
	  	  pace = Math.abs(pace)
		  media.AV.backward(pace)	
	  }
	  this.seek = function(time){
		  var seektime = timetohour(time);
		  //alert(seektime);
		  media.AV.seek(seektime);//time  hh:mm:ss
	  }
	  this.pause = function(flag){
		  media.AV.pause();	
	  }
	  this.resume = function(){
			media.AV.play();
	  }
	  this.status = function(){
		  var status = media.AV.status;
		  return status;
		}
	  this.close = function(){
		  //alert(1);
		  //media.AV.stop();
		  media.AV.close();//----关闭音视频
	  }
	  this.getplaytime = function(){
			var time = media.AV.elapsed;
			return time;
	}
	this.getVolume = function(){
		var volume = media.sound.value;//0-31
		//alert(volume);
		return volume;
	}
	this.setVolume = function(value){
		var soundvalue = media.sound.value;
		if (value > soundvalue){
			media.sound.up();
		}else if (value < soundvalue){
			media.sound.down();
		}
	}
	this.soundmode = function(){
		var mode = media.sound.mode;//stereo：立体音，mix:混音 left,right
		return mode;
	}
	this.setMuteFlag = function(val){
		media.sound.mute(val);//静音
	}
	/*media.sound.up()
	media.AV.status,media.AV.speed
	media.sound.down()
	media.AV.stop()
	*/
  }
  //CA卡号沟通
  var ovt_ca = function(){
	  this.NO = function (){
		  	var vodtb = new VODControl();
			var cardNo  = vodtb.Get("cardId");
		  return cardNo;
	  }
  }
  OVT_CA = new ovt_ca();//获取CA卡号
} else if(OVT_TYPE == "tongzhou"){//OVTngod相关
	OVT_media = function(){
		this.id = 0;
		this.myplay = "";
		this.init = function(screentype,x,y,w,h){//type=1:全屏, x=x轴,y=轴坐标，w=宽，h=高
			this.myplay = new MediaPlayer();
  			this.id = this.myplay.createPlayerInstance("Video",2);//创建播放器实
			//this.myplay.bindPlayerInstance(this.id);
			if(screentype == 1){//全屏
				this.myplay.position = "1,0,0,0,0";
			}else{
				this.myplay.position = "0,"+x+","+y+","+w+","+h;
			}
			this.myplay.refreshVideoDisplay()
		}
		this.seturl = function(url,mediatype){//url播放地址，mediatype=vod：点播
			//url="rtsp://ip:port;purchaseToken=;serverId=;"
			//直播地址"delivery://259000.6875.64QAM.301.2048.2049";
  			this.myplay.source = url;
		}
		this.play = function(){//播放
			this.myplay.pace = 1;
  			var finish = myplay.play();
		}
		this.forward = function(pace){//快进 -8,-16,-32
			this.myplay.pace = pace;
			this.myplay.refresh();
		}
		this.backward = function(pace){//快退 -8,-16,-32
			this.myplay.pace = pace;
			this.myplay.refresh();
		}
		this.seek = function(time){
			this.myplay.point = parseInt(time);//秒,值
			this.myplay.refresh();
		}
		this.pause = function(flag){//flag=1:最后一帧，0：黑场
			this.myplay.pause(flag);
		}
		this.close = function(){//关闭播放器
			this.myplay.pause(0);
			this.myplay.refresh();
			this.myplay.releasePlayerInstance();
		}
		this.getplaytime = function(){
			return 0;
		}
	}
}
/**按键封装*/
/*
var OVT_Event = function(_event){
    var keycode = _event.which | _event.keyCode;
    var code = "";
	if(48 <= keycode&&keycode <= 57){//返回数字键
		code = keycode-48;
		return code;
	}
    switch (keycode) {
        case 38: 
		case 1:
        code = "KEY_UP";//上
            break;
        case 40: //下
		case 2:
            code = "KEY_DOWN";
            break;
        case 37: //左
		case 3:
            code = "KEY_LEFT";
            break;
        case 39: //右
		case 4:
            code = "KEY_RIGHT";
            break;
        case 13:
            code = "KEY_SELECT";//确定
            break;
		case 8:
		case 340:
			code = "KEY_BACK";//返回
			break;
		case 339:
		case 1285:
		 	code = "KEY_EXIT";//退出
			break;
		case 61:
		case 259:
		case 596://茁壮
		case 601:
			code = "VOLUME_UP";//音量加
		break;
		case 45:
		case 260:
		case 595://茁壮
		case 602:
			code = "VOLUME_DOWN";//音量减
		break;
		case 92://键盘\
		case 261:
			code = "VOLUME_MUTE";//静音
		break;
		case 116://键盘T
		case 1286://声道
			code = "VOLUME_TRACK";
		break;
		case 258://频道增加
			code = "KEY_CHANNEL_UP";
		break;
		case 257://频道减少
			code = "KEY_CHANNEL_DOWN";
		break;
		case 33://上页
			code = "KEY_PAGE_UP";
		break;
		case 34://下页
			code = "KEY_PAGE_DOWN";
		break;
		case 1282://快退
			code = "KEY_REWIND";
		break;
		case 1283://快进
			code = "KEY_FAST";
		break;
		case 1284://停止
			code = "KEY_STOP";
		break;
		case 263://播放
			code = "KEY_PLAY";
		break;
		case 271://定位键
		   code = "KEY_LOCATION";
		 break;
		case 1279://电源键
			code = "KEY_POWER";
		break;
		case 285://设置键
			code = "KEY_SET";
		break;
		case 280://循环键
			code = "KEY_CIRCULATE";
		break;
		case 275://直播
			code = "KEY_TV";
		break;
		case 276://回看
			code = "KEY_CHANNELBACK";
		break;
		case 277://点播
			code = "KEY_VOD";
		break;
		case 278://首页
			code = "KEY_INDEX";
		break;
		case 284://帮助键
			code = "KEY_HELP";
		break;
		case 1280://应用键
			code = "KEY_APPS";
		break;
		case 0://红-直播
			code = "KEY_RED";
		break;
		case 0://绿-回看
			code = "KEY_GREEN";
		break;
		case 0://黄-点播
			code = "KEY_YELLOW";
		break;
		case 0://蓝-首页
			code = "KEY_BLUE";
		break;
		case 5202://茁壮
			code = "KEY_PLAYSUCCESS";//播放成功
		 break;
		case 5203://茁壮
			code = "KEY_PLAYFAILEN";//播放失败
		 break;
		 case 5209://茁壮
			code = "KEY_PLAYSTART";//播放到头
		 break;
		 case 5210://茁壮
			code = "KEY_PLAYEND";//播放到尾
		 break;
		 case 0x0300://iptv系统信息
		 	eval('MediaEventStr = ' + Utility.getEvent());
			if(MediaEventStr.type == 'EVENT_MEDIA_BEGINING'){	
				code = "KEY_PLAYSTART";//播放到头;
			 }
			 else if(MediaEventStr.type == 'EVENT_MEDIA_END'){
				code = "KEY_PLAYEND";//播放到尾
			 }
			break;
		 default:
			code = keycode;
		 break;
	}
	return code;
}
*/

function timetohour(second){ //把秒数转换为格式 00:00:00
    if(isNaN(second))return "";
	var hour = Math.floor(second/3600);
	hour = hour%24;
	second = second%3600;
	var minute = Math.floor(second/60);
	second = second%60;
	hour = hour < 10 ? '0' + hour : hour;
	minute = minute < 10 ? '0' + minute : minute;
	second = second < 10 ? '0' + second : second;
	return "" + hour +":"+ minute +":"+ second;
}
//全局打印信息
function GF_WebPrint(msg){
	var Extend = new QjyScript();
	//Extend.exec("SYS_DbgPrint","ovtportal:"+msg);	
	Extend.debug("ovtportal:"+msg);
}

