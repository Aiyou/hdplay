// VOD播放详细页
//按键移动区域类
var nextShow = true;

function area(){
	this.up = function(){};
	this.down = function(){};
	this.left = function(){};
	this.right = function(){};
	this.onSelect = function(){};
	this.myBack = function(){};
	this.exit = function(){};
	this.jump = function(){};
	this.input = function(){};
}

//把秒数转换为格式 00:00:00
function timeFormat(second){    
	if(isNaN(second))return "00:00:00";
	var hour = Math.floor(second/3600);
	second = second%3600;
	var minute = Math.floor(second/60);
	second = second%60;
	hour = hour < 10 ? '0' + hour : hour;
	minute = minute < 10 ? '0' + minute : minute;
	second = second < 10 ? '0' + second : second;
	return hour + ":" + minute + ":" + second;
}

//视频控制对象(图标变换)
var videoControl = function(){
	var status = ["play","pause","fastForward","fastRewind","jump","drag"]; //视频当前状态
	var curStatus = status[1];	//视频当前状态
	var panelTimer;				//面板显示/隐藏计时器
	var processTimer;			//进度条计时器
	var speed = 1;				//快进快退速度
	var timeIndex = 0;			//跳转时间框内6个数字的索引
	var curTime = 300;			//播放器当前时间变量-------------------默认为0，临时调试用
	var	PROGRESSWIDTH = 473; 	//进度条宽度
	var jumpTime;				//拖动后的时间
	var dirTimer;				//左右拖动计时器

	//对外接口
	var o = new area();
	o.up = up;
	o.down = down;
	o.left = left;
	o.right = right;
	o.onSelect = onSelect;

	o.init = init;
	o.myBack = myBack;
	o.refreshPanel = refreshPanel;
	o.getStatus = getStatus;
	o.input = input;
	o.isShow = true;			//播控面板是否显示
	o.hidePanel = hidePanel;
	
	function init(name,subid){
		showProgramInfo(0,parameter.progtime,name,subid);	//vod节目第一次播放，时间从0开始
		playPanel(curStatus);
	}

	function up(){
		return false; //屏蔽上键功能
		switch(curStatus){
			case status[4]: //跳转
				return false;
			break;
			case status[5]:	//拖动
				//showJumpTime( curTime );
//				showJumpTime(jumpTime);
//				
//				setBlur("dot");
//				curStatus = status[4];
//				numfocus();
			break;
			default:
				if(curStatus == status[2] || curStatus == status[3] ){
					hideSpeedFlag();
					speed = 1;
					mp.resume();
				}
				if(curStatus == status[0]){
					speed = 1;
					mp.resume();
					curStatus = status[1];
				}
				
				//showJumpTime( curTime );
				jumpTime = curTime;
				
				setBlur(curStatus);
				curStatus = status[5];
				setFocus("dot");
		}
		
		panelDisplay();
	}
	
	function down(){
		switch(curStatus){
			case status[4]: //跳转
				numblur();
				curStatus = status[5];
				setFocus("dot");
			break;
			case status[5]:	//拖动
			
				if( dirTimer ) { clearTimeout( dirTimer ); }
			
				setBlur("dot");
				if(speed == 1){
					curStatus = status[1];
				}else if(speed == 0){
					curStatus = status[0];
				}				
				setFocus(curStatus);
				
				hideJumpTime();
			break;
		}
		
		panelDisplay();
	}
	
	function left(){
		switch(curStatus){
//			case status[3]: //快退
//				changeSpeed(-1);
//			break;
//			case status[4]: //跳转
//				numblur();
//				timeIndex = timeIndex > 0 ? timeIndex-1 : 2;
//				numfocus();
//			break;
			case status[5]:	//拖动
				if( dirTimer ){
					clearTimeout( dirTimer );
				}else{
					jumpTime = curTime;
				}
			
				showJumpTime(jumpTime);
				setJumpTime(-1);
				setDotPos( jumpTime / parameter.progtime);
				showtime( jumpTime );
				
				dirTimer = setTimeout( function(){ 
									hideJumpTime();
									focusChange("dot",status[1]);
									hidePanel();
							},5000 );
			break;
			default:
				jumpTime = curTime;
				
				setBlur(curStatus);
				curStatus = status[5];
				setFocus("dot");
				
				showJumpTime(jumpTime);
//				if(curStatus == status[0]){
//					curStatus = status[1];				
//				}
//				
//				focusChange( curStatus , status[3] );
//				
//				changeSpeed(-1);
		}
		panelDisplay();
	}
	
	function right(){
		switch(curStatus){
//			case status[2]: //快进
//				changeSpeed(1);
//			break;
//			case status[4]: //跳转
//				numblur();
//				timeIndex = timeIndex < 2 ? timeIndex+1 : 0;
//				numfocus();
//			break;	
			case status[5]:	//拖动
				if( dirTimer ){
					clearTimeout( dirTimer );
				}else{
					jumpTime = curTime;
				}
								
				showJumpTime(jumpTime);
				setJumpTime(1)
				setDotPos( jumpTime / parameter.progtime );
				showtime( jumpTime );
				
				dirTimer = setTimeout( function(){ 
									hideJumpTime();
									focusChange("dot",status[1]);
									hidePanel();
							},5000 );
			break;
			default:
				jumpTime = curTime;
				
				setBlur(curStatus);
				curStatus = status[5];
				setFocus("dot");
				
				showJumpTime(jumpTime);

			
//				if(curStatus == status[0]){
//					curStatus = status[1];				
//				}
//				
//				focusChange(curStatus,status[2]);
//				
//				changeSpeed(1);
		}
		panelDisplay();
	}	
	
	function onSelect(){
		switch(curStatus){
			case status[0]:
				focusChange(curStatus,status[1]);
				
				speed = 1;
				mp.resume();
			break;
			case status[1]:
				
				focusChange(curStatus,status[0]);
				speed = 0;
				media.pause();
			break;		
			case status[4]:
				var tempTime = getJumpTime();
				if(tempTime > parameter.progtime){
					showSysError("您输入的时间超过节目时长！");
					setTimeout("sysErrorHandle()",1000);
					return false;
				}else if( tempTime == parameter.progtime ){
					showSysError("不能输入结束时间！");
					setTimeout("sysErrorHandle()",1000);
					return false;
				}

				mp.seek(tempTime);	
				
				hideJumpTime();
				numblur();
				curStatus = status[1];
				setFocus(curStatus);
				
				if(processTimer){
					clearTimeout( processTimer );
				}
				processTimer = setTimeout(function(){ refreshPanel(); },1000);
			break;			
			case status[5]:
//			 	if( jumpTime == parameter.progtime ){
//					showSysError("不能跳转到结束时间！");
//					setTimeout("sysErrorHandle()",1000);
//					return false;
//				}
//				mp.seek(jumpTime);
//				
//				hideJumpTime();
//				focusChange("dot",status[1]);
//				
//				if(processTimer){
//					clearTimeout( processTimer );
//				}
//				refreshProcess1(jumpTime);
//				processTimer = setTimeout(function(){ refreshPanel(); },3000);
				if( dirTimer ) { clearTimeout( dirTimer ); }
				goPlay();
			break;
			default:
				focusChange(curStatus,status[1]);
				
				hideSpeedFlag();
				mp.resume();
		}	
		
		panelDisplay();
	}
	
	function myBack(){
//		if(this.isShow){
//			if( panelTimer ){
//					clearTimeout( panelTimer );
//			}
//			hidePanel();
//			if( curStatus == status[2] || curStatus == status[3]){
//				focusChange(curStatus,status[1]);
//				
//				hideSpeedFlag();
//				mp.resume();
//			}else if( curStatus == status[4] ){
//				numblur();
//				curStatus = status[1];
//				setFocus(curStatus);
//				hideJumpTime();
//				return false;
//			}else if( curStatus == status[5] ){
//				setBlur("dot");
//				curStatus = status[1];
//				setFocus(curStatus);
//				hideJumpTime();
//			}else if(  curStatus == status[0] ){
//				
//				focusChange(curStatus,status[1]);
//				
//				mp.resume();
//			}
		//}else{
			//退出视频
			//media.pause();
			//smallwin.showBookmark();
			GF_WebPrint("--------------------------")
			goBack();
			//window.location = "vod_detail.html?id="+parameter.programId;
//		}
	}	
	
	/*临时添加：左右移动停止后，2S执行跳转*/
	function goPlay(){
		if( jumpTime == parameter.progtime ){
			showSysError("不能跳转到结束时间！");
			setTimeout("sysErrorHandle()",1000);
			return false;
		}   

		mp.seek(jumpTime);
				
		hideJumpTime();
		focusChange("dot",status[1]);
		
		if(processTimer){
			clearTimeout( processTimer );
		}
		refreshProcess1(jumpTime);
		processTimer = setTimeout(function(){ refreshPanel(); },1500);	
	}
	
	function input(){
		
		val = val - 48;
		if(timeIndex == 0 || timeIndex == 2 || timeIndex == 4){
			if(timeIndex == 0 && val > 2){
				showSysError("时分秒的输入范围在0-59！");
				setTimeout("sysErrorHandle()",1500);
				return;
			}else if(val >= 6){
				showSysError("时分秒的输入范围在0-59！");
				setTimeout("sysErrorHandle()",1500);
				return;
			}
		}
		$("jt"+timeIndex).textContent = val;	
		numblur();
		timeIndex = (timeIndex + 1 + 6)%6;
		numfocus();
	}
	
	//刷新进度条
	function refreshPanel(){
		getCurTime();
		getProgramLen();
		refreshProcess();
		
		processTimer = setTimeout(function(){ refreshPanel(); },1000);
	}
	
	//获取播放器返回的当前时间
	function getCurTime(){
		curTime = parseInt(mp.getplaytime(),10); 
		//GF_WebPrint("*****getCurrentPlayTime*******"+curTime)
		if( isNaN(curTime) || curTime < 0 || curTime > parameter.progtime){
			curTime = 0;
			//processTimer = setTimeout(function (){ getCurTime(); },1000);
		
			return false;
		}
	}
	function getProgramLen(){
		if(parameter.progtime == 0){
			parameter.progtime = mp.getProgramLen();
			$("endtime").textContent = timeFormat(parameter.progtime);
			//GF_WebPrint("####222222222#####"+parameter.progtime)
		}
	}	

	
	//显示进度条上的时间和圆点的位置
	function refreshProcess(){
		$("curtime").textContent = timeFormat(curTime);//显示当前时间
		var percent =  curTime / parameter.progtime;
		if(percent < 0 || percent > 1)	return;
		$("progress").style.width = Math.floor(percent*PROGRESSWIDTH) + "px"; 
		
		if(curStatus == status[5] || curStatus == status[4] )	return;  //拖动状态时圆点不动
		setDotPos(percent);
	}
	
	//显示进度条上的时间和圆点的位置--临时处理用，机顶盒跳转后获取时间不对
	function refreshProcess1(time){
		$("curtime").textContent = timeFormat(time);//显示当前时间
		var percent =  time / parameter.progtime;
		if(percent < 0 || percent > 1)	return;
		$("progress").style.width = Math.floor(percent*PROGRESSWIDTH) + "px"; 
		
		setDotPos(percent);
	}
	
	//设置进度条上圆点的位置	
	function setDotPos(percent){
		if(percent < 0 || percent > 1)	return;
		$("jumpdiv").style.left = 90+ Math.floor(percent*PROGRESSWIDTH) + "px";	
	}
	
	//快进快退速度切换
	//type:1是快进,-1快退
	function changeSpeed(type){
		if(type < 0){
			if(speed == 1 || speed == 0){
				speed = -8;
			}else if(speed < -1){
				speed = speed == -32 ? -8 : speed*2;
			}else if(speed > 1){
				speed = -8;
			}
			showSpeedFlag(speed);	
			mp.backward(speed);	//调用播放器快退接口
		}else{
			if(speed == 1 || speed == 0){
				speed = 8;
			}else if(speed > 1){
				speed = speed == 32 ? 8 : speed * 2;
			}else if(speed < 0){
				speed = 8;
			}
			showSpeedFlag(speed);	
			mp.forward(speed);	//调用播放器快进接口
		}
	}
	
	//显示速度标示
	function showSpeedFlag(speed){
		$("speed").className = "speed"+Math.abs(speed);
	}
	//隐藏速度标示
	function hideSpeedFlag(){
		speed = 1;
		$("speed").className = "speednone";
	}
	
	//控制面板
	function playPanel(statusValue){
		setFocus(statusValue);
		panelDisplay();
	}
	
	//隐藏跳转时间框
	function hideJumpTime(){
		$("jumptime").style.visibility = "hidden";
		$("jumpdiv").style.background = 'url(images/vodplay.png) no-repeat scroll -600px -23px transparent';
		//$("ch_bom").style.background = "url(images/ch_focus.png) no-repeat center center";


	}

	//显示跳转时间框
	function showJumpTime(time){
		showtime(time);			
		$("jumpdiv").style.background = 'url(images/play_icon.png) no-repeat scroll -17px -76px transparent';
		$("jumptime").style.visibility = "visible";
	}
	
	//显示时间
	function showtime(time){
		time = timeFormat(time);
	   	$("jt0").value = time.charAt(0)+ time.charAt(1);
		$("jt1").value = time.charAt(3)+ time.charAt(4);	
		$("jt2").value = time.charAt(6)+ time.charAt(7);
/*		$("jt3").textContent = time.charAt(4); 
		$("jt4").textContent = time.charAt(6);
		$("jt5").textContent = time.charAt(7);
*/	}
	
	//获取输入的时间
	function getJumpTime(){
		var hour =	$('jt0').value*3600;
		var minute = $('jt1').value*60;
		var second = $('jt2').value;
		return parseInt(hour,10) + parseInt(minute,10) + parseInt(second,10);
	}
	
	//时间获取焦点和失去焦点
	function numfocus(){
	    $("jt"+timeIndex).className = "jump_f";		
		$("jt"+timeIndex).focus();
	}
	function numblur(){
	    $("jt"+timeIndex).className = "jump_b";
		$("jt"+timeIndex).blur();		
	}
	
	function numChange(){
		GF_WebPrint("++++++++++++++++++++"+$("jt"+timeIndex).value);
		if( $("jt"+timeIndex).length == 2 ){
			numblur();
			timeIndex++;
			numfocus();
		}
	}
	
	//显示隐藏控制面板
	function showPanel(){
		o.isShow = true;
		$("playpanel").style.display = "block";	
	}
	
	function hidePanel(){
		o.isShow = false;
		$("playpanel").style.display = "none";	
	}
	
	//根据当前视频状态来控制面板的显示和隐藏
	function panelDisplay(){
		if(o.isShow){
			if( curStatus != status[1] ){
				if( panelTimer ){
					clearTimeout( panelTimer );
				}
				showPanel();
			}else{
				if( panelTimer ){
					clearTimeout(panelTimer);
				}
				panelTimer = setTimeout( function (){ hidePanel(); }, 5000 );
			}
		}else{
			showPanel();
			panelTimer = setTimeout( function(){ hidePanel(); }, 5000 );
		}
	}
	
	//设置拖动的时间(jumpTime)
	//type:1表示向右拖动，-1表示向左拖动
	//jumppace设置拖动速度
	function setJumpTime(type){
		var jumppace = Math.floor(parameter.progtime/20);	
		GF_WebPrint("----------jumppace-----------"+jumppace);
		if(jumpTime	== ""){
			jumpTime = 0;
		}
		if(type == 1){
			jumpTime = parseInt(jumpTime,10) + parseInt(jumppace,10) >parseInt( parameter.progtime,10) ? parameter.progtime : parseInt(jumpTime,10) + parseInt(jumppace,10);
		}else{
			jumpTime = jumpTime - jumppace < 0 ? 0 : jumpTime - jumppace;
		}
		GF_WebPrint("----------jumpTime-----------"+jumpTime);
	}
	
	//设置焦点
	//这里把状态值，对象的id，样式名称都设为一个名称，简化程序
	function setFocus(statusValue){	
		if( $(statusValue) == null){
			$("state").className = statusValue+"_on";
		}else{
			$(statusValue).className = statusValue+"_on";
		}
	};
	
	//失去焦点
	function setBlur(statusValue){	
		if( $(statusValue) == null){
			$("state").className = statusValue+"_off";
		}else{
			$(statusValue).className = statusValue+"_off";
		}
	}
	
	//焦点切换
	function focusChange(oldStatus,newStatus){
		setBlur(oldStatus);
		curStatus = newStatus;
		setFocus(curStatus);
	}
	
	//返回视频当前状态
	function getStatus(){
		return curStatus;	
	}
	
	//设置当前视频状态
	function setStatus(statusValue){
		curStatus = statusValue;
	}
	
	//显示节目信息
	function showProgramInfo(curtime,endtime,name,subid){
		$("curtime").textContent = timeFormat(curtime);
		$("endtime").textContent = timeFormat(endtime);
		$('progname').textContent = name;
		if(subid!=""){
			$('prognameTip').textContent="第"+subid+"集"
		}
	}
	
	return o;
}();

//播放器对象
var media = function(){
	var o = {};
	
	o.play = function(MediaStr){

		mp.seturl(MediaStr);

		mp.play();
	};
	
	o.pause = function(){
		mp.pause(1);
	};
	
	//播放到头的处理
	o.playToStart = function(){
		this.pause();
		//videoControl.myBack();	
		
		smallwin.show("播放到头是否退出");
	};
	
	//播放到尾的处理
	o.playToEnd = function(){
		try{
			this.pause();
			//videoControl.myBack();	
			
			//判断电视剧时，是否提示播放下一集
			//电影就直接提示是否退出
			
			if( parameter.subId == "" ){
				//smallwin.show("播放到尾是否退出");
				showSysError("播放结束");	
				setTimeout(function(){
					goBack();
					//window.location = "vod_detail.html?id="+parameter.programId;					
				},1000);
			}else{
				var tempUrl = subListObj.getUrl();
				if( parameter.subId < tempUrl.length ){
					//smallwin.show("是否观看下一集");
					mp.stop();
					parameter.subId = parseInt(parameter.subId,10)+1;
					var nextName = parameter.programName 
					GF_WebPrint("**************play next************************");
					GF_WebPrint(nextName+"-"+tempUrl[ parameter.subId-1 ].assetId+"-"+ parameter.subId );
					//setPlay( nextName, tempUrl[ parameter.subId - 1 ].assetId , parameter.subId );
					ReGetStart(false,tempUrl[ parameter.subId - 1 ].assetId);
				}else{
					//smallwin.show("播放到尾是否退出");
					showSysError("播放结束");	
					setTimeout(function(){
						goBack();
						//window.location = "vod_detail.html?id="+parameter.programId;					
					},1000);
				}
			}
		}catch(e){
			GF_WebPrint("playToEnd:"+e)
		}
	};
	// 获取节目信息
	return o;
}();

//小窗口对象

var smallwin = function(){
	var o = new area();
	var index = 0;
	var curWin; //当前小窗口有退出窗口smallwin，书签窗口wid_exitc，两个值分别是对应窗口的id
	
	o.isShow = false;
	o.show = function(content){
		if(this.isShow)return;
				
		$('content').innerHTML = content;
		$('button0').className = "button0_on";
		$('button1').className = "button1_off";
		index = 0;
	    $('smallwin').style.visibility = "visible";	
		this.isShow = true;	

		curWin = 'smallwin';
	}
	
	//显示书签
	o.showBookmark = function(){
		if(this.isShow)return;
		
		$("wid_exitc").style.visibility = 'visible';
		$("bookmark_name").innerHTML = parameter.programName;
		$("bookmark0").className = 'focus';
		$("bookmark1").className = '';
		$("bookmark2").className = '';
		
		index = 0
		this.isShow = true;
		
		curWin = 'wid_exitc';
	};
	
	o.hide = function(){
	    $(curWin).style.visibility = "hidden";
		this.isShow = false;
	}
	
	o.onSelect = function(){
		if(index == 0){
			if( curWin == 'smallwin' ){
				var tempUrl =  subListObj.getUrl();
				if( parameter.subId < tempUrl.length ){
					mp.stop();
					this.myBack();
					parameter.subId = parseInt(parameter.subId,10)+1;
					var nextName = parameter.programName + '第' + parameter.subId +'集';
					GF_WebPrint("**************play next************************");
					GF_WebPrint(nextName+"-"+tempUrl[ parameter.subId-1 ].assetId+"-"+ parameter.subId );
					//setPlay( nextName, tempUrl[ parameter.subId - 1 ].assetId , parameter.subId );
					ReGetStart(false,tempUrl[ parameter.subId - 1 ].assetId);
				}else{
					goBack();
					//window.location = "vod_detail.html?id="+parameter.programId;	
				}
			}else{
				goBack();
			}
		}else if(index == 1){
			//this.myBack();
			saveCookie();
			goBack();
		}else if(index == 2){
			savePoint(goBack);	//先执行书签功能，然后再退出点播页面
		}
	}
	
	o.right = function(){
		switch(curWin){
			case "smallwin":
				if(index == 0){
					$('button0').className = 'button0_off';
					$('button1').className = 'button1_on';
					index = 1;	
				}
			break;
			case "wid_exitc":
				$("bookmark" + index).className = '';
				index = index < 2 ? index+1 : 0;
				$("bookmark" + index).className = 'focus';
			break;
		}
	}
	
	o.left = function(){
		switch(curWin){
			case "smallwin":
				if(index == 1){
					$('button0').className = 'button0_on';
					$('button1').className = 'button1_off';
					index = 0;	
				}
			break;
			case "wid_exitc":
				$("bookmark" + index).className = '';
				index = index > 0 ? index-1 : 2;
				$("bookmark" + index).className = 'focus';
			break;
		}
	}
	o.myBack = function(){
		this.hide();
		
		//快进快退到头时，弹出的提示框中选择取消
		var tempStatus = videoControl.getStatus();
		if( tempStatus == "fastForward" || tempStatus == "fastRewind" ){
			videoControl.onSelect();
			if( tempStatus == "fastForward"){
				mp.seek(1);
			}
		}else if(tempStatus == "pause"){
			mp.resume();
		}else{
			mp.resume();
		}
	}
	o.exit = function(){
	    goBack();		
	}
	
	return o;
}();

//音量控制对象
var VolumeControl = function(){
	var o = {};
	var min = 0;
	var max = 32;
	var g_volume;
	var MuteFlag=false;
	var	timer_volume_bar = 0;
	
//	o.initValue = function(value){ 
//		g_volume = value;	
//	};
	
	o.getValue = function(){
		g_volume=mp.getVolume();
		if(typeof(g_volume)=="undefined"||g_volume==""||typeof(parseInt(g_volume))!="number"){
			g_volume = "0"; 
		}
		return  g_volume;
	};
	
	o.setValue = function(value){
		g_volume = value + "";
		mp.setVolume(parseInt(value));
	};
	
	o.volumeUp = function(){
		var val = o.getValue();
		if(val+1<=max){
			val++;
		}
		o.setValue(val);
		return val;
	};
	
	o.volumeDown = function(){
		var val = o.getValue();	 
		if(val-1>=min){
			val--;
		}
		o.setValue(val);
		return val;
	};
	
	//设置静音
	o.setMute = function(){
		 if(MuteFlag==false){
			 MuteFlag=true;
			 mp.setMuteFlag(1);
			 $("volume_mute").style.visibility="visible";
			 var val = this.getValue();
			 showVolumeValue(val);
			 showVolumeBar();
		 }else{
			 MuteFlag=false;
			 mp.setMuteFlag(0);
			 $("volume_mute").style.visibility="hidden";
			 var val = this.getValue();
			 showVolumeValue(val);
			 showVolumeBar();
	   }
	}
	
	//减小音量
	o.setVolumeDown = function(){
		MuteFlag=false;
		mp.setMuteFlag(0);
		$("volume_mute").style.visibility="hidden";
		var val = this.volumeDown();
		showVolumeValue(val);
		showVolumeBar();
	}
	
	//增大音量
	o.setVolumeUp = function(){
		MuteFlag=false;
		mp.setMuteFlag(0);
		$("volume_mute").style.visibility="hidden";
		var val = this.volumeUp(); 
		showVolumeValue(val);
		showVolumeBar();
	}
	
	//显示音量条
	function showVolumeBar(){
		
		$("Volume_Div").style.visibility = "visible";
		if(timer_volume_bar!=0){
			clearTimeout(timer_volume_bar);
		}
		timer_volume_bar = setTimeout(function(){ hideVolumeBar(); }, 3000); //5s后隐藏
	}

	//隐藏音量条
	function hideVolumeBar(){
		$("volume_mute").style.visibility="hidden";
		$("Volume_Div").style.visibility = "hidden"; 	
	}
	
	//显示音量值
	function showVolumeValue(value){ 
		$("volume_value").textContent = value;
		if(value==0){
			$("volume").style.width ="1px";
		}else{
			$("volume").style.width = parseInt(13*value)+"px";
			
		}
	}
	
	return o;
}();

var subListObj = function(){	
	//zt_url:高清，zt_url1:标清 zt_url2:流畅）
	var playUrl = {"zt_url":"","zt_url1":"","zt_url2":""};
	var curPlayUrl = playUrl.zt_url;			//默认的视频类型
	var col = 10;			//定义显示的列数
	var row = 2;			//定义显示的行数
	var programCount = 0;	//节目总数
	var curProLen;			//当前页显示的节目数
	var allSubList;			//当前页所有li	
	var pageTotal=0;		//总页数
	var	pageNo = 1;			//当前页码
	var o = new area();
	o.index = 0;
	o.isShow = false;
	o.getUrl = getUrl;		//获取节目当前URL

	o.init = function(){
		getData();
		if( parameter.subId ){
			this.index = (parameter.subId-1) % (col*row);
			pageNo = Math.ceil( parameter.subId / (col*row));
		}		
	};
	o.left = function(){
		try{
			if(this.index == 0) {
				//向上翻页
				_setPageUp();
			}else{
				onBlur(this.index);
				this.index = this.index-1;
				onFocus(this.index);
				setProgramIndex(this.index);
			}
		}catch(e){
			GF_WebPrint(e);
		}
	};
	
	o.right = function(){
		try{
			if( this.index < curProLen - 1){
				onBlur(this.index);
				this.index = parseInt(this.index,10)+1;
				setProgramIndex(this.index);
				onFocus(this.index);
			}else{
				//向下翻页
				_setPageDown();
			}			
		}catch(e){
			GF_WebPrint(e);
		}
	};
	
	o.up = function(){
		if(this.index - col >= 0){
			onBlur(this.index);
			this.index = this.index-col;
			onFocus(this.index);
			
			setProgramIndex(this.index);
		}else{
			_setPageUp();
		}
	};
	
	o.down = function(){
		if(this.index + col <= curProLen - 1){
			onBlur(this.index);
			this.index = this.index+col;
			onFocus(this.index);
			
			setProgramIndex(this.index);
		}else{
			_setPageDown();
		}
	};
	
	o.show = function(){
			this.isShow = true;
			$("subList").style.visibility = "visible";
			//this.index = parameter.subId;
			onFocus(this.index);
	}
	
	o.hide = function(){ 
		this.isShow = false;
		$("subList").style.visibility = "hidden";
	}
	
	o.onSelect = function(){
		try{
			this.hide();
			mp.stop();
			parameter.subId = parseInt(allSubList[this.index].innerHTML,10);
			var Name = parameter.programName + '第' + parameter.subId +'集';
			//GF_WebPrint(Name+"-"+curPlayUrl[ parameter.subId-1 ].assetId+"-"+ parameter.subId );
			//setPlay( Name, playUrl[ parameter.subId - 1 ].assetId, parameter.subId );	
			ReGetStart(false,curPlayUrl[ parameter.subId - 1 ].assetId);
		}catch(e){
			GF_WebPrint("**************choose subList************************"+e);
		}
	};
	
	o.myBack = function(){
		this.hide();
	};
	
	o.setVideoType = function(type){
		switch(type){
			case "zt_url":
				curPlayUrl = playUrl.zt_url;
			break;
			case "zt_url1":
				curPlayUrl = playUrl.zt_url1;
			break;
			case "zt_url2":
				curPlayUrl = playUrl.zt_url2;
			break;
		}
		//GF_WebPrint( "setVideoType-----------------------------------------"+ curPlayUrl[this.index]);
		if( curPlayUrl[this.index] ){
			addCookie( "videoType",type );
			mp.stop();
			if( "" == parameter.subId  ){
				var Name = parameter.programName ; 
			}else{
				var Name = parameter.programName + '第' + parameter.subId +'集';
			}
			
			GF_WebPrint(Name+"-"+curPlayUrl[this.index]+"-"+ parameter.subId );
			//setPlay( Name,curPlayUrl[this.index],parameter.subId );
			ReGetStart(false,curPlayUrl[this.index].assetId);
		}else{
			showSysError("暂无相关视频");
			setTimeout(function(){ sysErrorHandle(); },2000);
		}		
	};
	
	function setProgramIndex(){
	
	}
	
	function onFocus(index){
		allSubList[index].className = "curLi";
	};
	function onBlur(index){
		allSubList[index].className = "";
	};
	
	function _setPageUp(){
		if( pageNo > 1){//多于1页数据
			pageNo--;
			onBlur(o.index);
			o.index = col*row - 1;
			showSubList();
			onFocus(o.index);			
		}
	}
	
	function _setPageDown(){
		 if( pageNo < pageTotal ){
			pageNo++;
			onBlur(o.index);
			o.index = 0;
			showSubList();
			onFocus(o.index);	
		}
	}
	
	function getData( retried ){
		try{
			//var url =MY_PORTAL_ADDR+"/GetVodData?id=" + parameter.programId;
			var url =MY_PORTAL_ADDR+"/GetProgramInfo?programId="+parameter.programId;
			GF_WebPrint(url);
			Ajax.request(url,{
				success:function(data){
					if( data.result == "200" ){
						var programInfo = data;
						playUrl.zt_url=  programInfo.programSub;
						playUrl.zt_url1 = "";
						playUrl.zt_url2 = "";;
						
						//从cookie中获取视频类型
						var cookieType = getCookie("videoType");
						GF_WebPrint("cookieType:----------------"+cookieType);
						if( !cookieType ){
							curPlayUrl = playUrl.zt_url;	
						}else{
							curPlayUrl = playUrl[cookieType];
						}
											
						programCount = playUrl.zt_url.length;
						pageTotal = Math.ceil( programCount / (col*row) );
						showSubList( );//显示节目信息
						//buttonHandle.setNavObj();
					}
				},
				failure:function(data){
					if( retried ){
						GF_WebPrint("ajax:get programs failed");
					}else{
						setTimeout( function(){  getData(true) },300 );		
					}
				}
			});
		}catch(e){
			GF_WebPrint("获取VOD节目列表："+e);	
		}
	}
	

	
	function showSubList(){
		try{
			var html = "";		
			var startNum = (pageNo-1)*col*row+1;
			var endNum = pageNo*col*row > programCount ? programCount : pageNo*col*row;
			curProLen = endNum - startNum + 1;
			for(var i = startNum;i <= endNum; i++){
				html += '<li>'+i+'</li>'
			}
			$("subList").innerHTML = "<ul>"+html+"</ul>";
			
			allSubList = $("subList").getElementsByTagName("li");
		}catch(e){
			GF_WebPrint("showSubList:"+e);
		}
	}
	
	//返回当前视频类型的url
	function getUrl(){
		return curPlayUrl;
	}
	
	return o;
}();
function transferUrl( url ){
		var tempUrl;
		if( url == "" ){
			tempUrl = [];
			return tempUrl;
		}else{
			var flag = url.indexOf('\r\n');
			if( flag == -1 ){
				tempUrl = [];
				tempUrl.push( url );
			}else{
				tempUrl = url.split('\r\n'); 
			}
			
			return tempUrl;
		}		
	}
var videoType = function(){	
	//zt_url:高清，zt_url1:标清 zt_url2:流畅）
	var urlType = ["zt_url","zt_url1","zt_url2"];
	var liObj;
	var o = new area();
	o.index = 0;
	o.isShow = false;
	//var cookieType = 0;


	o.init = function(){
		liObj = $("videoType").getElementsByTagName("li");
		//onFocus(0);
	};
	
	o.up = function(){
		//this.index = cookieType;
		if(this.index > 0){
			onBlur(this.index);
			this.index = this.index-1;
			onFocus(this.index);
		}
	};
	
	o.down = function(){
		try{
			//this.index = cookieTypeIndex;
			if(this.index < liObj.length - 1){
			onBlur(this.index);
			this.index = this.index+1;
			onFocus(this.index);
			}
		}catch(e){
			GF_WebPrint("##################################"+e)
		}
		
	};
	
	o.show = function(){
		var cookieTypeshow = getCookie("videoType");
		this.isShow = true;
		$("curLi").style.visibility ="visible";
		$("videoType").style.visibility = "visible";
		//GF_WebPrint("urlType[this.index]:-------------------------------+++++++++++++++++++++++++++++"+cookieTypeshow)
		if(cookieTypeshow=="zt_url"){
			//GF_WebPrint("0000000000000000000000000000000000000")
			this.index = 0;
			onFocus(this.index);
		}else if(cookieTypeshow=="zt_url1"){
			//GF_WebPrint("111111111111111111111111111111111111111111111")
			this.index = 1;
			onFocus(this.index);
		}else if(cookieTypeshow=="zt_url2"){
			//GF_WebPrint("22222222222222222222222222")
			this.index = 2;
			onFocus(this.index);
		}else{ 
			this.index = 0;
			onFocus(this.index);
		}
		//this.index = cookieTypeIndex;
		//GF_WebPrint("222222222222222222222222225555555555555555555555555"+cookieTypeIndex)
		//onFocus(cookieTypeIndex);
	}
	
	/*o.show = function(){
		this.isShow = true;
		$("videoType").style.visibility = "visible";
		onFocus(this.index);
	}*/
	
	o.hide = function(){ 
		this.isShow = false;
		$("videoType").style.visibility = "hidden";
		$("curLi").style.visibility ="hidden";
	}
	
	o.onSelect = function(){
		try{
			//subListObj.setVideoType( urlType[this.index] );
			this.hide();
		}catch(e){
			GF_WebPrint("**************choose subList************************"+e);
		}
	};
	
	o.myBack = function(){
		this.hide();
	};
	
	function onFocus(i){
		$("curLi").style.visibility ="visible";
		$("curLi").style.top = 539 + 42*i + "px";
	};
	function onBlur(index){
		//liObj[index].className = "";
	};
	
	return o;
}();


//实现全局中定义的播放到头
sysEventHandle.playStart = function(){
	media.playToStart();
};
//实现全局中定义的播放到尾
sysEventHandle.playEnd = function(){
	media.playToEnd();
};
