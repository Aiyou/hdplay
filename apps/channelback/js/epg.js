// JavaScript Document
var channelIndex =  getCookie("Epg_Channel_Index");
if( ( channelIndex == "") ||( channelIndex == "undefined" ) ){
	channelIndex = 0;
}else{
	channelIndex = parseInt(channelIndex,10);
}
var area_Index =  getCookie("Area_Index");
if( ( area_Index == "") ||( area_Index == "undefined" ) ){
	area_Index = 0;
}else{
	area_Index = parseInt(area_Index,10);
	
}

var areaIndex = area_Index;
var contentArea = function(){
	var o = {};
	o.index =  0;//频道索引
	o.channelLists = [];
	o.handleChannelListsData = function (){
		//var carNo =  OVT_CA.NO();
		//var carNo =  '8002002601291633';
		//var url = MY_PORTAL_ADDR+"/GetChannels?client="+carNo+"&jsonType=1";
		//var url = MY_PORTAL_ADDR+"/GetChannels?startAt=1&maxItems=10000";
		var url = "http://84.200.224.100"+"/GetChannels?startAt=1&maxItems=10000";
		
		o.channelLists = [];
		var k = 0;
		for(var i =0; i<menuArr.length; i++)
		{
			for(var j=0; j < menuContent[i].length; j++)
			{
				o.channelLists[k++] = {channelId:(menuContent[i][j].chid-1),channelNumber:menuContent[i][j].chid,channelName:menuContent[i][j].name,url:menuContent[i][j].url};
			}	
		}
		if( o.channelLists.length - 1 >= channelIndex ){
					o.index =  channelIndex;//频道索引
		}else{
					o.index =  0;//频道索引
		}
		o.showData();
		o.initfocus();
		addCookie("Epg_Channel_Index", o.index);
		epgArea.handleEpgData( o.channelLists[o.index].channelId );
		/*Ajax.request(url,{
		success:function(data){
			if(data.result == "410"){ 
				login(false);
				return ;
			}
			if(data.result!="200"){
				tipRecordArea.show(data.infoText);//判断用户是否登录
				return ;
			}
			o.channelLists = [];
		    if(isnull(data)==false){ 
				if (data.channels.length != 0){
					 o.channelLists = data.channels;
					
				}
			}
			if( o.channelLists.length!=0){
				if( o.channelLists.length - 1 >= channelIndex ){
					o.index =  channelIndex;//频道索引
				}else{
					o.index =  0;//频道索引
				}
				 o.showData();
				 o.initfocus();
				 epgArea.handleEpgData( o.channelLists[o.index].channelId );
			}else {
				$("ch_content").innerHTML="";
			}
			  addCookie("Epg_Channel_Index", o.index);	
		},
		failure:function(data){
			
		}
	  });*/
	}
	
	o.n = 10;
	o.onFocus = function(){
		$("ch_focus").style.visibility= "visible";
		$("ch_focus").style.background = "url(images/ch_focus2.png) no-repeat";
	}
	o.getblur = function(){
		
		if ( o.channelLists.length != 0 ){
			$("ch_focus").style.background = "url(images/ch_focus.png) no-repeat";
		}
		o.delFontRoll();
	}
		//获得焦点getChannelList
	o.initfocus = function(){
		if( areaIndex == 0 ){
			
			$("ch_focus").style.background = "url(images/ch_focus2.png) no-repeat";
			$("ch_focus").style.visibility= "visible";
		}else{
			
			$("ch_focus").style.background = "url(images/ch_focus.png) no-repeat";
			$("ch_focus").style.visibility= "visible";
		}
		var p = o.index % o.n;
		var top = 138 + p * 51;
		$("ch_focus").style.top = top + "px";
		o.addFontRoll();
	}
	//获得焦点getChannelList
	o.getfocus = function(){
		$("ch_focus").style.visibility= "visible";
		var p = o.index % o.n;
		var top = 138 + p * 51;
		if ( o.channelLists.length != 0 ){
			$("ch_focus").style.background = "url(images/ch_focus2.png) no-repeat";
		}
		$("ch_focus").style.top = top + "px";
		addCookie("Epg_Channel_Index", o.index);	
		o.addFontRoll();
		clearTimeout(epgTimper);
		epgArea.index = 0;
		addCookie("Epg_Index", 0);	
		epgTimper = setTimeout(function(){epgArea.handleEpgData( o.channelLists[o.index].channelId );}, 300);
	}
	o.showData = function(){
		var offset = o.index - o.index % o.n;
		var isLastPage = (offset+o.n)>(o.channelLists.length-1);
		var html = "<ul>";
		for(var i = 0; i < o.n; i++ ){
			var idx = offset + i;
			if(isLastPage){
				if(idx > o.channelLists.length-1){
					html += '<li></li>';	
				}
				else{	
					html += '<li id="line_'+idx+'"><div class= "info_0">'+util.str.addZero(o.channelLists[idx].channelNumber,3)+'</div><div id="ch_name_'+idx+'"  class="info_1">'+o.channelLists[idx].channelName+'</div></li>';	 
					}
			}
			else{	
					html += '<li id="line_'+idx+'"><div class= "info_0">'+util.str.addZero(o.channelLists[idx].channelNumber,3)+'</div><div id="ch_name_'+idx+'" class="info_1">'+o.channelLists[idx].channelName+'</div></li>';	 
		    }
	   }
		html += "</ul>"
		$("ch_content").innerHTML = html;
		//o.getfocus();
	}
	//向上移动焦点
	o.up = function(){	
    if ( o.channelLists.length != 0 ){
			if(o.index==0 || o.channelLists.length ==1 ) 
			{   /*o.getblur();
				o.index=o.channelLists.length-1;
				if(o.channelLists.length <= o.n){
					o.getfocus(o.index);
				}else{
					o.showData();
					o.getfocus(o.index%o.n);
				}
				//o.move(0,o.channelLists.length-1);*/
			return 0;
			}
	
			
			var p = o.index%o.n;
			if(p == 0){
				o.getblur();
				o.index --;
				o.showData();
				o.getfocus(o.n-1);
			}else{
				o.getblur();
				o.index --;
				o.getfocus(p-1);
			}
		 }
	}

	//向下移动焦点
	o.down = function(){
		 if ( o.channelLists.length != 0 ){
			if(o.index ==o.channelLists.length-1) {
	/*			o.getblur();
				o.index=0;
				if(o.channelLists.length<=o.n){
					o.getfocus(0);
					//o.move(o.channelLists.length-1,0);
				}else{
					o.showData();
					o.getfocus(0);
					//o.move(o.channelLists.length-1,0);
				}*/
			return 0;
			}
	
			
			var p = o.index%o.n;
			if(p == o.n-1){
				o.getblur();
				o.index ++;
				o.showData();
				o.getfocus(0);
			}
			else{
				o.getblur();
				o.index ++;
				o.getfocus(p+1);
			}
		 }
	}
	o.addFontRoll=function (){	
		var name = o.channelLists[o.index].channelName
		var i=o.index%o.n;
			if(getStrChineseLength(name) > 6){
				maq(document.getElementById("ch_name_"+i),name,o.epgFontSize,o.epgWapWidth,"ch_name_"+i);
			}

	}
	 o.delFontRoll=function (){	
		 try{
			var name = o.channelLists[o.index].channelName
			var i=o.index%o.n;
			if( document.getElementById("ch_name_"+i) != null ){
				
				document.getElementById("ch_name_"+i).innerHTML=name;
				delemaq();
				document.getElementById("ch_name_"+i).style.overflow="hidden";
			}
		 }catch(e){
		 }
	}
	o.pageUp = function(){
		 if ( o.channelLists.length != 0 ){
			var index = o.index;
			if(index >= o.n){
				o.getblur();
				index = (index - index % o.n) - o.n;
				o.index = index;
				o.showData();
				var p = o.index % o.n;
				o.getfocus(p);
				//contentArea.deplay();
			}
		 }
	}
	o.pageDown = function(){
		 if ( o.channelLists.length != 0 ){
			var index = o.index;
			if( parseInt(index /o.n+1)*o.n < o.channelLists.length){
				o.getblur();
				index=(index - index % o.n) + o.n;
				o.index = index;
				o.showData();
				var p = o.index%o.n;
				o.getfocus(p);
				//contentArea.deplay();
			}
		 }
	}
	o.right = function(){
		//$("ch_focus").style.visibility= "hidden";
		o.getblur();
		areaIndex = 1;
		dateArea.onFocusIco();
		dateArea.getfocus();
		addCookie("Area_Index", 1);	
	}
	o.left = function(){
		//areaIndex == 0;
		//dateArea.getfocus();
	}
		//切换频道
	o.chanListSelect = function (){
		try{
			if( o.channelLists.length != 0 ){ 
				channelIndex = o.index;
				addCookie("Epg_Channel_Index", channelIndex);	
			}
		}catch(e){
			GF_WebPrint(e);
		}
	}
	///延迟频道
	var deplay_play = null;
	o.deplay = function (){
		if(deplay_play){
			clearTimeout(deplay_play);	
		}
		deplay_play = setTimeout(o.chanListSelect(),100);
	}
	return o;	
}();
//判断为空的函数
function isnull(jsonstr)
{
  for(var key in jsonstr)
  {
	  return false;
  }
  return true;
}	

var epgIndex =  getCookie("Epg_Index");
if( ( epgIndex == "") ||( epgIndex == "undefined" ) ){
	epgIndex = 0;
}else{
	epgIndex = parseInt(epgIndex,10);
}
var epgTimper = 0;
var epgArea = function(){
	var o = {};
	o.index = 0;//频道索引
	o.epgLists = new Array(7);
	o.epgLists[0] = [],	o.epgLists[1] = [],	o.epgLists[2] = [],	o.epgLists[3] = [],	o.epgLists[4] = [],	o.epgLists[5] = [],	o.epgLists[6] = [];	//获取节目列表数组
	o.epgLists[7] = [],	o.epgLists[8] = [],	o.epgLists[9] = [],	o.epgLists[10] = [],o.epgLists[11] = [],o.epgLists[12] = [],o.epgLists[13] = [];//获取节目列表数组
	o.epgLists[14] = []//获取节目列表数组
	o.handleEpgData = function (channelId){
		for( var i = 0 ;i < 14; i++){
			o.epgLists[i] = [];
		}
		try{
			//var url = MY_PORTAL_ADDR+"/GetPrograms?client=8002002601291633&channelIds=2&jsonType=1&startDateTime=20140118000000&endDateTime=20140124000000";
			//var url = MY_PORTAL_ADDR+"/GetPrograms?channelIds="+channelId+"&maxItems=5000&startAt=1&profile=1&days=14&jsonType=1";
			var startDate = o.getDataStr(13)
			var endDate = o.getDataStr(-1);
			//var url = MY_PORTAL_ADDR+"/GetEpgs?channelIds="+channelId+"&startAt=1&maxItems=5000&startDate="+startDate+"&endDate="+endDate+"&epgType=1";
			var url = "http://84.200.224.100"+"/GetEpgs?channelIds="+channelId+"&startAt=1&maxItems=5000&startDate="+startDate+"&endDate="+endDate+"&epgType=1";
			
			for( var i = 0; i < 14; i++ ){
				var dateSt = o.getDataStr(i);
				var dateStEnd = o.getDataStr(i+1);
				var pname = dateSt.substring(0, 4)+"-"+dateSt.substring(4,6)+"-"+dateSt.substring(6,8); 
				  var eio = new EPG_ITEM_OBJ();
					var EpgItem = eio.Get();
					for(var j =0; j < EpgItem.length; j++)
					{
						EpgItem[j].programName = pname + EpgItem[j].programName;
						EpgItem[j].startDateTime = dateSt + EpgItem[j].startDateTime;
						if(j == EpgItem.length-1)
							EpgItem[j].endDateTime = dateStEnd + EpgItem[j].endDateTime;
						else EpgItem[j].endDateTime = dateSt + EpgItem[j].endDateTime;
					}
					o.epgLists[i]=EpgItem;

			}
			if( o.epgLists[dateArea.index].length - 1 >= epgIndex ){
							o.index = epgIndex;//epg索引
			}else {
							o.index = 0;//epg索引
			}
			o.showData();
			/*
			Ajax.request(url,{
			success:function(data){
				programLists=data[0].programs;
				 dayProgramLists=[];
				if(isnull(programLists)==false){
					for( var i = 0; i < 14; i++ ){
						if( isnull( programLists[o.getDataStr(i)])==false ){
							o.epgLists[i]=programLists[o.getDataStr(i)]; 
						}
					}
					if( ( o.epgLists[dateArea.index].length != 0 )&&(typeof(o.epgLists[dateArea.index])!="undefined")){
						if( o.epgLists[dateArea.index].length - 1 >= epgIndex ){
							o.index = epgIndex;//epg索引
						}else {
							o.index = 0;//epg索引
						}
						o.showData();
					}else{
						if( areaIndex == 2 ){
							areaIndex = 0;
							o.hideFocus();
							$("ch_focus").style.visibility= "visible";
						}
						$("epg_lists").innerHTML="";
					}	
				}else{
					if( areaIndex == 2 ){
						areaIndex = 0;
						o.hideFocus();
						$("ch_focus").style.visibility= "visible";
					}
					$("epg_lists").innerHTML="";
				}
				return programLists;
			},
			failure:function(data){
			//window.history.go(-1);	
			}
			});*/
		}catch(e){
			GF_WebPrint("getProgramList:"+e);
		}
	}
	//得到一周内某天的字符串值 如：20120215 －－－－－
	o.getDataStr = function  (i){
		var i = parseInt(i);
			var LSTR_ndate = new Date();
			var LSTR_Year = LSTR_ndate.getFullYear();
			var LSTR_Month = LSTR_ndate.getMonth();
			var LSTR_Date = LSTR_ndate.getDate();
			var uom = new Date(LSTR_Year, LSTR_Month, LSTR_Date);
			uom.setDate(uom.getDate() - i);
			//取得系统时间的前一天,重点在这里,负数是前几天,正数是后几天
			var LINT_YY = uom.getFullYear();
			var LINT_MM = uom.getMonth();
			LINT_MM++;
			
			var LSTR_MM = LINT_MM >=10 ? LINT_MM : ("0" +LINT_MM);
			var LINT_DD = uom.getDate();
			var LSTR_DD = LINT_DD >=10 ? LINT_DD : ("0" + LINT_DD);
			return LINT_YY+""+LSTR_MM+""+LSTR_DD;
	}
	
	o.n = 9;
	o.showFocus = function(){
		if( areaIndex == 2 ){
			$("epg_focus").style.visibility = "visible";
		}
	}
	o.hideFocus = function(){
		$("epg_focus").style.visibility = "hidden";
	}
	o.getblur = function(){
		var egpIndex = dateArea.index;
		if ( o.epgLists[egpIndex].length != 0 ){
			$("pro_"+o.index).style.color = "#fff";
		}
	}
	//获得焦点getChannelList
	o.getfocus = function(){
			var p = o.index % o.n;
			var top = 163 + p * 51;
			var egpIndex = dateArea.index;
			if ( o.epgLists[egpIndex].length != 0 ){
				$("pro_"+o.index).style.color = "#fff";
			}
			$("epg_focus").style.top = top + "px";
	 		 addCookie("Epg_Index", o.index);	
	}
	o.showData = function(){
		   $("epg_lists").innerHTML = "";
				var egpIndex = dateArea.index;
				if(o.epgLists[egpIndex].length != 0 ){
					var offset = o.index - o.index % o.n;
					var isLastPage = (offset+o.n)>(o.epgLists[egpIndex].length-1);
					var html = "<ul>";
					for(var i = 0; i < o.n; i++ ){
						var idx = offset + i;
						if(isLastPage){
							if(idx > o.epgLists[egpIndex].length-1){
								html += '<li></li>';	
							}
							else{	
							
								var playTime = o.toTimeShow(o.epgLists[egpIndex][idx].startDateTime);						
								html += '<li id="pro_'+idx+'"><span class= "epg_time">'+playTime+'</span><span  class="epg_name">'+o.epgLists[egpIndex][idx].programName+'</span></li>';	 
							}
						}
						else{	
								var playTime = o.toTimeShow(o.epgLists[egpIndex][idx].startDateTime);						
								html += '<li id="pro_'+idx+'"><span class= "epg_time">'+playTime+'</span><span  class="epg_name">'+o.epgLists[egpIndex][idx].programName+'</span></li>';	 
						}
				   }
					html += "</ul>"
					$("epg_lists").innerHTML = html;
					if( areaIndex == 2 ){
						o.getfocus();
						o.showFocus();
					}
				}
	}
	//数字字符串转换成时间表达形式字符串
	o.toTimeShow = function (time){
		var tShow=time.substring(8,14);
		var hour=tShow.substring(0,2);
		var minute=tShow.substring(2,4);
		//var second=tShow.substring(4,6);
		var time=hour+":"+minute;
	return time;
}
	//向上移动焦点
	o.up = function(){	
		var egpIndex = dateArea.index;
	  if ( o.epgLists[egpIndex].length == 0 ) return ;
		if(o.index==0 || o.epgLists[egpIndex].length ==1 ) 
		{   o.getblur();
		    areaIndex = 1;
			o.hideFocus();
			dateArea.onFocusIco();
			dateArea.getfocus();
			addCookie("Area_Index", 1);	
			/*o.index=o.channelLists.length-1;
			if(o.channelLists.length <= o.n){
				o.getfocus(o.index);
			}else{
				o.showData();
				o.getfocus(o.index%o.n);
			}
			//o.move(0,o.channelLists.length-1);*/
		return "";
		}

		var p = o.index%o.n;
		var lastIndex = o.index;
		if(p == 0){
			o.getblur();
			o.index --;
			o.showData();
			o.getfocus(o.n-1);
		}else{
			o.getblur();
			o.index --;
			o.getfocus(p-1);
		}
		//o.move(lastIndex,o.index);
	}

	//向下移动焦点
	o.down = function(){
		var egpIndex = dateArea.index;
		if ( o.epgLists[egpIndex].length == 0 ) return ;
		if(o.index ==o.epgLists[egpIndex].length-1) {
/*			o.getblur();
			o.index=0;
			if(o.channelLists.length<=o.n){
				o.getfocus(0);
				//o.move(o.channelLists.length-1,0);
			}else{
				o.showData();
				o.getfocus(0);
				//o.move(o.channelLists.length-1,0);
			}*/
		return 0;
		}

		
		var p = o.index%o.n;
		var lastIndex = o.index;
		if(p == o.n-1){
			o.getblur();
			o.index ++;
			o.showData();
			o.getfocus(0);
		}
		else{
			o.getblur();
			o.index ++;
			o.getfocus(p+1);
		}
		//o.move(lastIndex,o.index);
	}

	o.pageUp = function(){
		var egpIndex = dateArea.index;
		if ( o.epgLists[egpIndex].length == 0 ) return ;
		
			var index = o.index;
			if(index >= o.n){
				o.getblur();
				index = (index - index % o.n) - o.n;
				o.index = index;
				o.showData();
				var p = o.index % o.n;
				o.getfocus(p);
			}
	}
	o.pageDown = function(){
		var egpIndex = dateArea.index;
		if ( o.epgLists[egpIndex].length == 0 ) return ;
			var index = o.index;
			if( parseInt(index /o.n+1)*o.n < o.epgLists[egpIndex].length){
				o.getblur();
				index=(index - index % o.n) + o.n;
				o.index = index;
				o.showData();
				var p = o.index%o.n;
				o.getfocus(p);
			}
	}
	o.right = function(){
		o.getblur();
		o.hideFocus();
		areaIndex = 1 ;
		dateArea.onFocusIco();
		dateArea.getfocus();
		//o.index = 0;
		//addCookie("Epg_Index", o.index);
		addCookie("Area_Index", 1);	
	}
	o.left = function(){
		o.getblur();
		o.hideFocus();
		areaIndex = 0 ;
		contentArea.onFocus();
		addCookie("Area_Index", 0);	
		//o.index = 0;
		
	}
	
	o.selects = function(){
			var egpIndex = dateArea.index;
			//var programId = epgArea.epgLists[egpIndex][epgArea.index].programId;
			//var channelId = contentArea.channelLists[contentArea.index].channelId;
			var name = epgArea.epgLists[egpIndex][epgArea.index].programName;
			//var providerId = epgArea.epgLists[egpIndex][epgArea.index].providerId;
			var startTime = epgArea.epgLists[egpIndex][epgArea.index].startDateTime;
			var endTime = epgArea.epgLists[egpIndex][epgArea.index].endDateTime;	
			var url = contentArea.channelLists[contentArea.index].url;
			//var assetId = epgArea.epgLists[egpIndex][epgArea.index].assetId;
		  // window.location.href= "../backplay/vod_play.html?&channelIndex="+contentArea.index+"&programId=" + escape(assetId) + "&channelId=" + escape(channelId)+"&programName="+escape(name)+"&providerId=" + escape(assetId) + "&startDateTime="+escape(startTime)+"&endDateTime="+escape(endTime)+"&type=1";
		   window.location.href= "../backplay/vod_play.html?playUrl="+escape(url)+"&programName="+escape(name)+ "&startDateTime="+escape(startTime)+"&endDateTime="+escape(endTime)+"&type=1";
		  // window.location.href= "../vod/vod_play.html?&channelIndex="+contentArea.index+"&programId=" + escape(programId) + "&channelId=" + escape(channelId)+"&name="+escape(name)+"&assetId=" + escape(assetId) + "&startDateTime="+escape(startTime)+"&endDateTime="+escape(endTime)+"&type=epg";
	}
	return o;	
}();

///日期区域代码
var dateIndex =  getCookie("Date_Index");
if( ( dateIndex == "") ||( dateIndex == "undefined" ) ){
	dateIndex = 0;
}else{
	dateIndex = parseInt(dateIndex,10);
}

var initTimer=0;
var dateArea  = function(){
	var o = {};
	o.index = dateIndex;
	o.dateLists = [];
	o.init = function (){
		$("date_"+o.index).style.color="#fff"; 
		if( areaIndex == 1 ){
			$("date_"+o.index).style.background = "url(images/data_focus2.png) no-repeat";
		}else{
			$("date_"+o.index).style.background = "url(images/data_focus1.png) no-repeat";
		}
		if( ( o.index <= 10 ) && ( o.index >= 3) ){
			$("date_lists").style.left = ( -106 * o.index + 318)+"px";
		}else if( o.index > 10 ){
			$("date_lists").style.left = -742 +"px";
		}else if( o.index < 3 ){
			$("date_lists").style.left = 0 +"px";
		}
		
	}
	o.left = function (){
		if( o.index == 0 ){
			o.onBlurIco();
			areaIndex = 0;
			contentArea.onFocus();
			addCookie("Area_Index", 0);	
			return "";
		}
		if( o.index > 0 ){
			o.getblur();
			o.index = o.index - 1;		
			o.getfocus();
			if ( ( o.index  <= 14 - 5 ) && ( o.index > 2 ) ){
				var left = parseInt($("date_lists").style.left,10);
				$("date_lists").style.left = (left + 106) + "px";
			}
			clearTimeout(initTimer);
			epgArea.index = 0;
			addCookie("Epg_Index", 0);	
			initTimer = setTimeout(function(){epgArea.showData();}, 300);
		}
	}
	o.right = function (){
		if( o.index < 13 ) {			
			o.getblur();
			o.index = o.index + 1;
			o.getfocus();
			if ( ( o.index > 3 ) && ( o.index  <= 14 - 4 ) ){
				var left = parseInt($("date_lists").style.left,10);
				$("date_lists").style.left = (left  -106 ) + "px";
			}
			clearTimeout(initTimer);
			epgArea.index = 0;
			addCookie("Epg_Index", 0);
			initTimer = setTimeout(function(){epgArea.showData();}, 300);
		}
	}
	o.show = function (){
		var html="<ul>";
				//时间处理开始

				for(var i = 0; i < 14; i++) {				
					var LSTR_ndate = new Date();
					var LSTR_Year = LSTR_ndate.getYear();
					var LSTR_Month = LSTR_ndate.getMonth();
					var LSTR_Date = LSTR_ndate.getDate();
					var uom = new Date(LSTR_Year, LSTR_Month, LSTR_Date);
					uom.setDate(uom.getDate() - i );
					//取得系统时间的前一天,重点在这里,负数是前几天,正数是后几天
					var LINT_MM = uom.getMonth();
					LINT_MM++;
					var LSTR_MM = LINT_MM >=10 ? LINT_MM : ("0" +LINT_MM)
					var LINT_DD = uom.getDate();
					var LSTR_DD = LINT_DD >=10 ? LINT_DD : ("0" + LINT_DD)
					uom = LSTR_MM + "." + LSTR_DD;
					html +='<li id="date_'+i+'">'+uom+'</li>';	
				}
			html+="</ul>"
		   $("date_lists").innerHTML=html;
	   o.init();
/*	   if( contentArea.channelLists.length != 0 ){
	  		epgArea.handleEpgData( contentArea.channelLists[contentArea.index].channelId );
	   }*/
	}
	o.getfocus = function (){
		//$("date_"+o.index).style.color="#fff"; 
		if( areaIndex == 1 ){
			$("date_"+o.index).style.background = "url(images/data_focus2.png) no-repeat";
		}
		 addCookie("Date_Index", o.index);	
	}

	o.getblur = function (index){
		//$("date_"+o.index).style.color="#000"; 
		$("date_"+o.index).style.background = "url(images/data_focus.png) no-repeat";
	}
	o.onBlurIco = function(){
		//$("date_"+o.index).style.color="#cc8632"; 
		$("date_"+o.index).style.background = "url(images/data_focus1.png) no-repeat";
	}
	o.onFocusIco = function(){
		$("date_"+o.index).style.background = "url(images/data_focus2.png) no-repeat";
	}
	o.up = function(){
/*		o.getblur(o.index);
		areaIndex = 0;
		contentArea.getfocus();*/
	}
	o.down = function(){
		var egpIndex = o.index;
		if ( epgArea.epgLists[egpIndex].length != 0 ){
			o.onBlurIco();
			areaIndex = 2;
			epgArea.showFocus();
			epgArea.getfocus();
			addCookie("Area_Index", 2);	
		}
	}
	return o;
	
}();
	
var dayFlag;
function initpage(){
	dateArea.show();
	contentArea.handleChannelListsData();
	dayFlag = epgArea.getDataStr(0);
	//checkDay();
	setTimeout(function(){checkDay();}, 10000);
}
function login(retried){
	try{
		var userName = "100";//OVT_CA.NO();
		var userPwd = "123456";//OVT_CA.PASSWORD();
		//var userName = "123456789";
		//var userPwd = "123456789";
		var checkKey='{"userCode":"'+userName+'","password":"'+hex_md5(userPwd)+'","loginDate":"'+getdatestr(0)+'"}';
		//var url =MY_PORTAL_ADDR+"/UserLogin?userCode="+userName+"&password="+hex_md5(userPwd)+"&checkKey="+hex_md5(checkKey);
		var url ="http://84.200.224.100"+"/UserLogin?userCode="+userName+"&password="+hex_md5(userPwd)+"&checkKey="+hex_md5(checkKey);
		GF_WebPrint(url);
		Ajax.request(url,{
			success:function(data){
				//var data = {"result":"200"} ////////////////////
				var dataResult = data.result;
				if(dataResult == "200"){
					contentArea.handleChannelListsData();
					GF_WebPrint("-----------------------------------------------------------200");
				}else{							
					if( retried ){
						$("ch_content").innerHTML="";	
					}else{
						setTimeout( function(){  login(true) },300 );		
					}
				}
				
			},
			failure:function(data){
				if( retried ){
					$("ch_content").innerHTML="";
				}else{
					setTimeout( function(){  login(true) },300 );		
				}
			}
		});
	}catch(e){
		GF_WebPrint("登陆："+e);
	}
}

var dayTimer;
function checkDay(){
	var day  = epgArea.getDataStr(0);	
	if( day != dayFlag ){
		dayFlag = day;
		dateArea.index = 0;
		addCookie("Date_Index", 0);	
		dateArea.show();
		epgArea.index = 0;
		addCookie("Epg_Index", 0);	
		setTimeout(function(){epgArea.handleEpgData( contentArea.channelLists[contentArea.index].channelId );}, 300);
	}
	
	clearTimeout(dayTimer);
	dayTimer = setTimeout("checkDay();", 60000);
}
function unload(){
	clearTimeout(dayTimer);
	window.location.href="../index/index.html";
}

document.onkeypress = grabEvent;
function grabEvent(event){
	var val = event.which | event.keyCode;

	var NUM = 0;
	if((val <= 57)&&(val >= 48)){
	  NUM = val;
	}
	switch(val){

		case ROC_IRKEY_UP: //
			if( areaIndex == 0){
				contentArea.up();
				//contentArea.deplay();
			}
			else if( areaIndex == 1){
				dateArea.up();
			}else if (areaIndex == 2 ){
				
				epgArea.up();
			}
			break;
		case ROC_IRKEY_DOWN: //down
			if( areaIndex == 0){
				contentArea.down();
				//contentArea.deplay();
			}
			else if( areaIndex == 1){
				dateArea.down();
			}else if (areaIndex == 2 ){
				epgArea.down();
			}
			break;
		case ROC_IRKEY_LEFT: //left
			if( areaIndex == 0){
				contentArea.left();
			}else if(areaIndex == 1){
				dateArea.left();
			}
			else if(areaIndex == 2){
				epgArea.left();
			}
			break;
		case ROC_IRKEY_RIGHT: //right
			if( areaIndex == 0){
					contentArea.right();
			}else if(areaIndex == 1){
				dateArea.right();
			}
			else if(areaIndex == 2){
				epgArea.right();
			}
			break;
		case ROC_IRKEY_SELECT:
		    if ( areaIndex == 0 ){
				//contentArea.chanListSelect();
			}else if(areaIndex == 2){
				epgArea.selects();
			}
			break
		case ROC_IRKEY_PAGE_UP:
			if( areaIndex == 0){
				contentArea.pageUp();
				//contentArea.deplay();
			}else if( areaIndex == 2){
				epgArea.pageUp();
			}
			break;
		case ROC_IRKEY_PAGE_DOWN:
			if( areaIndex == 0){
				contentArea.pageDown();
				//contentArea.deplay();
			}else if( areaIndex == 2){
				epgArea.pageDown();
			}
			break;
		case ROC_IRKEY_NUM1:
             //window.location = "../order/order.html";
			break;
		case ROC_IRKEY_NUM2:
			break;
		case ROC_IRKEY_NUM3:

			break;
		case ROC_IRKEY_NUM4:

			break;
		case ROC_IRKEY_NUM6:

			break;
		case ROC_IRKEY_BACK:
		case ROC_IRKEY_EXIT:
			window.location.href="../index/index.html";

		  break;
	 }
}

var tipRecordArea  = function(){
	var o = {};
	o.index = 0;
	o.show = function(value){
		areaIndex = 4;
		$("record_info").innerHTML = value;
		$("tipRecord").style.visibility = "visible";
	}
	o.hide = function(){
		areaIndex = 2;
		$("record_info").innerHTML = "";
		$("tipRecord").style.visibility = "hidden";
	}
	o.selects = function (){
		o.hide();
	}
	return o;
	
}();

var focustimeobj;
var focustimeobj2;
function maq(obj,name,font_size,wapWidth,id){
	focustimeobj2 = setTimeout(function(){
	var textwid = 0;
	for (var i = 0,c,length = name.length; i < length; i++) {
	     c = name.charCodeAt(i);
		 if ((c >= 0x0001 && c <= 0x007e) || (0xff60<=c && c<=0xff9f)) {
			 textwid++;
		 }else{
		   textwid+=2;
		 }
	} 
	textwid = Math.ceil(font_size/2*textwid);
	obj.innerHTML = "<span id='divin'>"+ name +"</span>";
	var divout = $(id);
	var divin = $('divin');
	divout.style.display = 'inline-block';
	divout.style.position = 'relative';
	divout.style.width = wapWidth + 'px';
	divout.style.overflowX = 'hidden';

	divin.style.position = 'relative';
	divin.style.left = '0px';
	divin.style.whiteSpace = 'nowrap';
	var dire_flag = 0;
	var pace = 10;
		focustimeobj = setInterval(function(){
			if(dire_flag == 0){
			    divin.style.left = parseInt(divin.style.left) - pace + 'px';
				if(-parseInt(divin.style.left) >= textwid){
					dire_flag = 1;
				}
			}
			else{
			    divin.style.left = wapWidth - pace + 'px';
				dire_flag = 0;
			}
		},150);	
	},800);
}
function delemaq(){
	clearTimeout(focustimeobj2);  
	clearInterval(focustimeobj); 
}