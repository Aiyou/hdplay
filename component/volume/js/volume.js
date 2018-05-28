// JavaScript Document
	//显示音量件控件对象定义
	var timer_volume_bar = 0;
	var volumeShowFlag = false;
	//显示音量条
	function showVolumeBar(){
		volumeShowFlag=true;
		$("Volume_Div").style.visibility = "visible";
		if(timer_volume_bar!=0){
			clearTimeout(timer_volume_bar);
		}
		timer_volume_bar = setTimeout("hideVolumeBar()", 10000); //5s后隐藏
	}
	//显示音量条当前的值
	function showVolumeValue(value){ 
		$("volume_value").innerHTML = value;
		if(value==0){
			$("volume").style.width ="1px";
		}else{
			$("volume").style.width = parseInt(13*value)+"px";
		}
	}
	// 隐藏音量条
	function hideVolumeBar(){
		volumeShowFlag=false;
		$("volume_mute").style.visibility="hidden";
		$("Volume_Div").style.visibility = "hidden"; 
	}
	//音量条变量
	//音量条对象定义
	var VolumeControl = (function(){
		var o = {};
		var step = 13;
		var min = 0;
		var max = 32;
		
		var g_volume;
		o.initValue = function(value){ 
			g_volume = value;	
		};
		
		o.getValue = function(){
			g_volume=ovt_mp.getVolume();
			if(typeof(g_volume)=="undefined"||g_volume==""||typeof(parseInt(g_volume))!="number") g_volume = "0"; 
			var value = g_volume;
			return value;
		};
		
		o.setValue = function(value){
			g_volume = value + "";
			ovt_mp.setVolume(value);
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
		
		return o;
	}());
	var MuteFlag=false;
	//设置静音
	function  setMute(){
		 if(MuteFlag==false){
		   MuteFlag=true;
			ovt_mp.setMuteFlag(1);
			$("volume_mute").style.visibility="visible";
			showVolumeBar();
	     }else{
			 MuteFlag=false;
		   ovt_mp.setMuteFlag(0);
		   $("volume_mute").style.visibility="hidden";
		   showVolumeBar();
	   }
	}
	//减小音量
	function setVolumeDown(){
		 MuteFlag=false;
	    ovt_mp.setMuteFlag(0);
	    $("volume_mute").style.visibility="hidden";
		var val = VolumeControl.volumeDown();
		showVolumeValue(val);
		showVolumeBar();
	}
	//增大音量
	function setVolumeUp(){
		  MuteFlag=false;
	    ovt_mp.setMuteFlag(0);
	    $("volume_mute").style.visibility="hidden";
		var val = VolumeControl.volumeUp(); 
		showVolumeValue(val);
		showVolumeBar();
	}
	//获取音量值
	function getVolumeValue(){
		var volume = 20;
	    volume=ovt_mp.getVolume();
	    if(typeof(volume)=="undefined"||volume==""||typeof(parseInt(volume))!="number"){
			volume=20;
	    }
		 return volume;
	}