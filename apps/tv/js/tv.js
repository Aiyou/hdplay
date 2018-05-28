// JavaScript Document
var focusIndex=0;					//频道索引
var precount = 8;                   //当前页面节目最大
//var currentPage = 1;//当前页码


var channelList = new Array(); 		//获取到的频道
//var s=1;
//var n=8;							//每页显示10条数据
//var page = 0;						//频道页数
var totalcount = 0;						//频道总数
var totalPage = 0;                     //总页数
//var tempChannelList = new Array();	//存储通过A7接口获取到的频道	
var pageIndex=1;					//当前频道页数 ，默认为第一页
var lastPageCount = precount;      //最后一页节目个数

var channelArea = (function(){
	var area = {};
	var channelObj;		//获取页面中所有的节目div
	//加载频道信息
	area.loadChannelInfo =function() {
	//function loadChannelInfo(){
		try{
			var url=MY_PORTAL_ADDR+"/GetChannels?id="+allchannelId;
			Ajax.request(url, {
				success : function(data) {
					//获取所有频道
					for(var i=0; i<data.ItemsContents.length; i++){
						channelList[i] = data.ItemsContents[i];
						
					}
					totalcount = channelList.length;//总节目数
	
		/*			//获取所有频道
					for(var i = 0,len = data.ItemsContents.length;i < len;i++) {
						tempChannelList[i] = data.ItemsContents[i];
					}
					//过滤频道
					for(var i = 0,len = tempChannelList.length; i < len; i++) {
						channelList.push(tempChannelList[i])
					}*/
					showChannelList(0);//显示频道数据
					myfocus(focusIndex);
					
					
					try{
						var VODMediaStr = channelList[0].zt_url;//播放路径
						ovt_mp.seturl(VODMediaStr);
						ovt_mp.play();
						var val = VolumeControl.getValue(); 
						showVolumeValue(val);
					}catch(e){
					}
					if(totalcount>precount){
						if(totalcount%precount==0){
							totalPage = totalcount/precount;
						}else{
							totalPage = Math.ceil(totalcount/precount);
						}
						
						lastPageCount = totalcount%precount==0?precount:totalcount%precount;
					}else{
						totalPage = 1;
						lastPageCount = totalcount;
						
					}
					//document.getElementById("list_pad0").style.color = "#000";   //初始化焦点颜色
					//f=(s-1)*n+focusIndex;
					//handleProgramListsData(channelList[f].channelId);	//请求当前频道下的EPG
				},
				failure : function(data) {
					//window.history.go(-1);
					$("focus_a").style.visibility = 'hidden';
					$("channel").innerHTML="AJAX请求失败!"
					$("channel").className = "error";
				}
			});
		}catch(e){
			GF_WebPrint("获取频道列表信息："+e)
		}
	}
	
	//显示频道列表
	function showChannelList(i){
		/*s=s+i;
		if(s>page){
			s=1;
		}else if(s<1){
			s=page;
		}
	*/	
		var html="";
		//for(var i=(n*s-n);i<s*n;i++){
		for(var i=(precount*pageIndex-precount);i<precount*pageIndex;i++){
			if(channelList[i] == undefined) {
	
				channelList[i] = {"name" : "","num" : ""}
			}
			var cnb = util.str.addZero(parseInt(channelList[i].num), 3)
			if(cnb == "NaN"){
					cnb = ""
			}
			html+='<div class="list_a" id="list_pad'+i+'">'+cnb+'<span class="pad">'+channelList[i].name+'</span>'+'</div>';
		}
		$("channel").innerHTML=html;
	}
	
	area.initpage = function(){
		channelObj = $("channel").getElementsByTagName("div");
		//loadChannelInfo();
	}
	
	function pageup(){
		if(focusIndex == 8){
			
		}else{
			if(pageIndex == 1){
			
			}else{
				myblur();
				pageIndex -= 1;
				showChannelList(pageIndex);
				//document.getElementById("focus_a").style.top = 92   +"px";
				focusIndex = 7;
				myfocus(focusIndex);
				channelArea.delay_play();
			}
		}
		
	}
	
	function pagedown(){
		if(focusIndex == 8){
			
		}else{
			if(pageIndex == totalPage){
	
			}else{
				myblur();
				pageIndex += 1;
				showChannelList(pageIndex);
				//document.getElementById("focus_a").style.top = 92   +"px";
				focusIndex = 0;
				myfocus(focusIndex);
				channelArea.delay_play();
			}
		}
		
		
		
	}
	area.pageup = function(){
		pageup();
	}
	area.pagedown = function(){
		pagedown()
	}
	function play(){
		try{
			ovt_mp.stop();
			var id = focusIndex+(pageIndex-1)*precount;
			var VODMediaStr = channelList[id].zt_url;//播放路径
			ovt_mp.seturl(VODMediaStr);
			ovt_mp.play();
		}catch(e){
		}

	}
	area.up = function(){
		if(pageIndex == totalPage){//最后一页
			if(focusIndex > 0){
				if(focusIndex < lastPageCount ){//最后一页1-8
					myblur();
					focusIndex --;
					myfocus(focusIndex);
					/*ovt_mp.stop();
					var id = focusIndex+(pageIndex-1)*precount;
					var VODMediaStr = channelList[id].zt_url;//播放路径
					ovt_mp.seturl(VODMediaStr);
					ovt_mp.play();*/
					channelArea.delay_play();
				}else{//最后一页更多向上
					myblur();
					focusIndex = lastPageCount -1;
					myfocus(focusIndex);
					//channelArea.delay_play();
				}
			}else{//最后一页翻页
				pageup();
				channelArea.delay_play();
			}
			
		}else{
			if(focusIndex > 0){//其它页更多向上
				if(focusIndex == 8){
					myblur();
					focusIndex --;
					myfocus(focusIndex);
					//channelArea.delay_play();
				}else{//其它页1-8 
					myblur();
					focusIndex --;
					myfocus(focusIndex);
					/*ovt_mp.stop();
					var id = focusIndex+(pageIndex-1)*precount;
					var VODMediaStr = channelList[id].zt_url;//播放路径
					ovt_mp.seturl(VODMediaStr);
					ovt_mp.play();*/
					channelArea.delay_play();
				}
				
			}else{
				if(pageIndex == 1){//第一页第一个向上翻页
					myblur();
					pageIndex = totalPage;
					showChannelList(pageIndex);
					focusIndex = lastPageCount -1;
					myfocus(focusIndex);
					channelArea.delay_play();
				}else{//其它页第一个向上翻页
					pageup();
					channelArea.delay_play();
				}
			}
		}
		//channelArea.delay_play();
	}
	area.down = function(){
		if(pageIndex == totalPage){
			if(focusIndex < lastPageCount - 1){//最后一页1-8个节目
				myblur();
				focusIndex ++;
				myfocus(focusIndex);
				
				/*ovt_mp.stop();
				var id = focusIndex+(pageIndex-1)*precount;
				var VODMediaStr = channelList[id].zt_url;//播放路径
				ovt_mp.seturl(VODMediaStr);
				ovt_mp.play();*/
				channelArea.delay_play();
			}else{//最后一页倒数第二个，向更多
				myblur();
				focusIndex = 8;
				myfocus(focusIndex);
			}
		}else{
			if(focusIndex < 7){//中间页1-8
				myblur();
				focusIndex ++;
				myfocus(focusIndex);
				/*ovt_mp.stop();
				var id = focusIndex+(pageIndex-1)*precount ;
				//subId = (index + 1) + (currentPage-1)*precount;
				var VODMediaStr = channelList[id].zt_url;//播放路径
				ovt_mp.seturl(VODMediaStr);
				ovt_mp.play();*/
				channelArea.delay_play();
				//alert("focusIndex_down:"+focusIndex)
			}else if(focusIndex == 7){//中间页8到更多
				myblur();
				focusIndex ++;
				myfocus(focusIndex);
			}else{
				
			}
		}
	}	
	area.right = function(){
		if(focusIndex == 8){
			
		}else{
			pagedown();
		}
	}
	area.left = function(){
		if(focusIndex == 8){
			
		}else{
			pageup();
		}
	}
	function myfocus(i){
		
		/*if(focusIndex == 0){
			$("list_pad"+focusIndex).style.color = "#000";
			$("list_pad"+(focusIndex+1)).style.color = "#fff";
			document.getElementById("focus_a").style.top =92 + focusIndex * 53 +"px";
			$("focus_a").style.visibility = 'visible';
		}else if(focusIndex == 7){
			$("list_pad"+focusIndex).style.color = "#000";
			$("list_pad"+(focusIndex-1)).style.color = "#fff";
			$("all_channel").style.color = "#fff";
			document.getElementById("focus_a").style.top =92 + focusIndex * 53 +"px";
			$("focus_a").style.visibility = 'visible';
		}else if(focusIndex == 8){
			$("all_channel").style.color = "#000";
			$("list_pad"+(focusIndex-1)).style.color = "#fff";
			document.getElementById("focus_a").style.top = 540 +"px";
			$("focus_a").style.visibility = 'visible';
		}else{
			alert(focusIndex)
			$("list_pad"+focusIndex).style.color = "#000";
			$("list_pad"+(focusIndex+1)).style.color = "#fff";
			$("list_pad"+(focusIndex-1)).style.color = "#fff";
			document.getElementById("focus_a").style.top =92 + focusIndex * 53 +"px";
			$("focus_a").style.visibility = 'visible';
		}*/
		
		//alert("focusIndex:"+focusIndex)
		if(i < 8){
			document.getElementById("focus_a").style.top =92 + i * 53 +"px";
			$("focus_a").style.visibility = 'visible';
			channelObj[i].className = "black";
		}else if(i == 8){
			document.getElementById("focus_a").style.top = 536 +"px";
			$("focus_a").style.visibility = 'visible';
			document.getElementById("all_channel").style.color="black";
		}
		/*if(focusIndex == 0){
			$("list_pad"+focusIndex).style.color = "#000";
			$("list_pad"+(focusIndex+1)).style.color = "#fff";
		}else if(focusIndex == 7){
			$("list_pad"+focusIndex).style.color = "#000";
			$("list_pad"+(focusIndex-1)).style.color = "#fff";
			$("all_channel").style.color = "#fff";
		}else if(focusIndex == 8){
			$("all_channel").style.color = "#000";
			$("list_pad"+(focusIndex-1)).style.color = "#fff";
		}else{
			//alert(focusIndex)
			$("list_pad"+focusIndex).style.color = "#000";
			$("list_pad"+(focusIndex+1)).style.color = "#fff";
			$("list_pad"+(focusIndex-1)).style.color = "#fff";
		}
		*/

	}
	function myblur(){
		if(focusIndex < 8){
			$("focus_a").style.visibility = 'hidden';
			channelObj[focusIndex].className = "white";
		}else if(focusIndex == 8){
			$("focus_a").style.visibility = 'hidden';
			document.getElementById("all_channel").style.color="white";
		}	
	}
	
	//延迟300s获取频道
	var delay_channel = null;
	area.delay_play = function (){

		if(delay_channel){
			clearTimeout(delay_channel);	
		}

		//delay_channel = setTimeout(play(),300);
		delay_channel = setTimeout(function(){
			play()
		},300);
	}
	
	
	area.href = function(){
		if(focusIndex == 8){
			window.location.href="../channel/allchannel.html"
		}else{
			var id = focusIndex+(pageIndex-1)*precount ;
			addCookie("Channel_Index",id);   //与播放页cookie 20130603
			window.location.href="../channel/channelplay.html"
		}
	}
	
	//获取cookie
	var Item_Index = getCookie("Channel_Index");
	if(typeof(Item_Index)=="undefined"||Item_Index==""||typeof(parseInt(Item_Index))!="number"||Item_Index=="v"){
		focusIndex=0; 
	}else{
		cookieIndex = parseInt(Item_Index);
		if(cookieIndex == 0){
			focusIndex=0;
		}else{
			if( cookieIndex % precount == 0){
				focusIndex = 0;
				//focusIndex = precount-1;
				pageIndex = parseInt( (cookieIndex-1)/precount,10) + 2;
			}else{
				focusIndex = cookieIndex%precount ;
				pageIndex = parseInt( (cookieIndex-1)/precount,10) + 1;
			}
		}
		//pageIndex = parseInt( (cookieIndex-1)/precount,10) + 1;
	}
	
	return area;
}());


