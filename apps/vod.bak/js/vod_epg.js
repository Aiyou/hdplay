// JavaScript Document
var request_child_column =  getCookie("request_child_column");
if( ( request_child_column == "") ||( request_child_column == "undefined" ) ){
	request_child_column = 0;//0:表示父级栏目,1:表示子级栏目
}

var area_Index =  getCookie("Vod_List_Area_Index");
if( ( area_Index == "") ||( area_Index == "undefined" ) ){
	area_Index = 0;
}else{
	area_Index = parseInt(area_Index,10);
	
}

var channelIndex =  getCookie("vod_list_Index");
if( ( channelIndex == "") ||( channelIndex == "undefined" ) ){
	channelIndex = 0;
}else{
	if( request_child_column == 1 ){
		channelIndex = 0;
	}else{
		channelIndex = parseInt(channelIndex,10);
	}
}
/*folderId:本页的父folderId,parentId:父类页查询栏目时的父folderId，folderName本页的父folderName*/
//var getUrlPara = {"folderId":$G.getParameter("id"),"parentId":$G.getParameter("parentId"),"folderName":unescape($G.getParameter("folderName"))};
var getUrlPara = {"folderId":$G.getParameter("id"),"parentId":$G.getParameter("parentId")};


var path = getCookie("Vod_Path");//VOD栏目路径;
var path_name = unescape(getCookie("Vod_Path_Name"));//VOD栏目路径名
 if( ( path_name == "") ||( path_name == "undefined" ) ){
	path_name = "点播分类";//\u70B9\u64AD\u5206\u7C7B
}

var areaIndex = area_Index;
var contentArea = function(){
	var o = {};
	o.index =  channelIndex;//频道索引
	o.channelLists = [];
	o.handleChannelListsData = function (folderId){
		//var carNo =  OVT_CA.NO();
		//var carNo =  '8002002601291633';
		//var url = MY_PORTAL_ADDR+"/GetChannels?client="+carNo+"&jsonType=1";
		var url = MY_PORTAL_ADDR+"/GetFolderContents?folderId="+folderId;
		
		Ajax.request(url,{
		success:function(data){
			if(data.result == "410"){ 
				login(false);
				return ;
			}
            if(data.result != "200"){ 
				return ;
			}
			o.channelLists = [];
			if (data.category.length != 0){
				 o.channelLists = data.category;	
			}
			if( o.channelLists.length!=0){
				if( o.channelLists.length - 1 <  channelIndex ){
					o.index = 0;
				}
				 o.showData();
				 o.initfocus();
				epgArea.handleEpgData( o.channelLists[o.index].folderId );
			}else {
				$("ch_content").innerHTML="";
			}
			if( request_child_column == 0 ){
			  addCookie("vod_list_Index", o.index);	
			}
		},
		failure:function(data){
			
		}
	  });
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
		if( areaIndex == 0 ){
			o.addFontRoll();
		}
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
		if( request_child_column == 0 ){
			addCookie("vod_list_Index", o.index);	
		}
		o.addFontRoll();
		clearTimeout(epgTimper);
		epgArea.index = 0;
		addCookie("Program_Index", 0);	
		epgTimper = setTimeout(function(){epgArea.handleEpgData( o.channelLists[o.index].folderId );}, 300);
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
					html += '<li id="line_'+idx+'"><div id="ch_name_'+idx+'"  class="info_1">'+o.channelLists[idx].folderName+'</div></li>';	 
					}
			}
			else{	
					html += '<li id="line_'+idx+'"><div id="ch_name_'+idx+'" class="info_1">'+o.channelLists[idx].folderName+'</div></li>';	 
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
		var name = o.channelLists[o.index].folderName
		var i=o.index%o.n;
			if(getStrChineseLength(name) > 6){
				maq(document.getElementById("ch_name_"+i),name,24,235,"ch_name_"+i);
			}

	}
	 o.delFontRoll=function (){	
		 try{
			var name = o.channelLists[o.index].folderName
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
		if( epgArea.epgLists.length != 0 ){
			o.getblur();
			areaIndex = 1;
			epgArea.getfocus();
			if( request_child_column == 0 ){
				addCookie("Vod_List_Area_Index", 1);
			}
		}
	}
	o.left = function(){
		//areaIndex == 0;
		//dateArea.getfocus();
	}
		//切换频道
	o.chanListSelect = function (){
		try{
			if( o.channelLists.length != 0 ){ 
				//channelIndex = o.index;
				//addCookie("vod_list_Index", channelIndex);	
				if( o.channelLists[o.index].folderType == 0 ){//column
					addCookie("request_child_column", 1);
					var cookiePath =  path+"."+getUrlPara.folderId;
					var cookiePathName =  path_name+"."+o.channelLists[o.index].folderName;
					addCookie("Vod_Path",cookiePath);
					addCookie("Vod_Path_Name",cookiePathName);
					//window.location.href = "vod_index.html?id="+ escape(o.channelLists[o.index].folderId)+"&parentId="+escape(getUrlPara.folderId)+"&folderName="+escape(o.channelLists[o.index].folderName);
					window.location.href = "vod_index.html?id="+ escape(o.channelLists[o.index].folderId)+"&parentId="+escape(getUrlPara.folderId);
				}
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

var epgIndex =  getCookie("Program_Index");
if( ( epgIndex == "") ||( epgIndex == "undefined" ) ){
	epgIndex = 0;
}else{
	epgIndex = parseInt(epgIndex,10);
}
var epgTimper = 0;
var epgArea = function(){
	var o = {};
	o.index = epgIndex;//频道索引
	o.epgLists = [];
	o.handleEpgData = function (folderId){
		o.epgLists = [];
		try{

			var url = MY_PORTAL_ADDR+"/GetProgramContents?folderId="+folderId;
			Ajax.request(url,{
			success:function(data){
				if(data.result == "200"){
					if( data.programList.length != 0 ){
						o.epgLists = data.programList;
					}
					if( o.epgLists.length != 0 ){
						o.showData();
						o.showPageArea();
					}else{
						o.hidePageArea();
						if( areaIndex == 1 ){
							areaIndex = 0;
							o.hideFocus();
							contentArea.onFocus();
						}
						$("epg_lists").innerHTML="";
					}	
				}else{
					o.hidePageArea();
					if( areaIndex == 1 ){
						areaIndex = 0;
						o.hideFocus();
						contentArea.onFocus();
					}
					$("epg_lists").innerHTML="";
				}
				
			},
			failure:function(data){
				o.hidePageArea();
				if( areaIndex == 1 ){
						areaIndex = 0;
						o.hideFocus();
						contentArea.onFocus();
					}
					$("epg_lists").innerHTML="";
			}
			});
		}catch(e){
			GF_WebPrint("getProgramList:"+e);
		}
	}
	
	o.n = 10;
	o.showFocus = function(){
		if( areaIndex == 1 ){
			$("pro_"+o.index).className = "epg_focus";
			o.addFontRoll();
		}
	}
	o.hideFocus = function(){
		//$("pro_"+o.index).className = "epg_blur";
	}
	o.getblur = function(){
		if ( o.epgLists.length != 0 ){
			$("pro_"+o.index).className = "epg_blur";
			o.delFontRoll();
		}
	}
	//获得焦点getChannelList
	o.getfocus = function(){
			if ( o.epgLists.length != 0 ){
				$("pro_"+o.index).className = "epg_focus";
				o.addFontRoll();
			}
			if( request_child_column == 0 ){
	 			addCookie("Program_Index", o.index);	
			}
	}
	o.showData = function(){
		   $("epg_lists").innerHTML = "";
				if(o.epgLists.length != 0 ){
					var offset = o.index - o.index % o.n;
					var isLastPage = (offset+o.n)>(o.epgLists.length-1);
					var html = "<ul>";
					for(var i = 0; i < o.n; i++ ){
						var idx = offset + i;
						if(isLastPage){
							if(idx > o.epgLists.length-1){
								html += '';	
							}
							else{	
								
								html += '<li id="pro_'+idx+'"><div class= "epg_time"><img src="'+o.getImgSrc(idx)+'"  class = "picSize"/></div><div  class="epg_name" id="epg_name'+idx+'">'+o.epgLists[idx].programName+'</div></li>';	 
							}
						}
						else{						
								html += '<li id="pro_'+idx+'"><div class= "epg_time"><img src="'+o.getImgSrc(idx)+'"  class = "picSize"/></div><div  class="epg_name" id="epg_name'+idx+'">'+o.epgLists[idx].programName+'</div></li>';	 
						}
				   }
					html += "</ul>"
					$("epg_lists").innerHTML = html;
					if( areaIndex == 1 ){
						o.getfocus();
						o.showFocus();
					}
					$("page_num").innerHTML = o.getCurPage();
					$("page_total").innerHTML = o.getPageTotal();
				}
	}
	o.getImgSrc = function(i){
		try{
			var urlArr = o.epgLists[i].image;
			var url = urlArr[0].imageUrl;
			if( url == ""){
				url = MY_PORTAL_ADDR+"/portal/images/nopic.jpg";
			}else{
				url = MY_PORTAL_ADDR+"/portal/images/"+url;
			}
				//url = "images/nopic_b.jpg";
			return url;
		}catch(e){
		}
	}

   o.showPageArea = function(){
	   $("page_area").style.visibility = "visible";
   }
   o.hidePageArea = function(){
	   $("page_area").style.visibility = "hidden";
   }
   o.getPageTotal = function(){
	   var length = o.epgLists.length;
	   return length % o.n == 0 ? parseInt( length / o.n , 10 ) : parseInt( length / o.n ,10 ) + 1;
   }
    o.getCurPage = function(){
	   var index = o.index;
	   return ( index + 1 ) % o.n == 0 ? parseInt( ( index + 1 ) / o.n , 10 ) : parseInt( ( index + 1 ) / o.n ,10 ) + 1;
   }
	//向上移动焦点
	o.left = function(){	
	  if ( o.epgLists.length == 0 ) return ;
		if(o.index==0 || o.epgLists.length ==1 ) 
		{  o.getblur();
			areaIndex = 0;
			contentArea.onFocus();
			if( request_child_column == 0 ){
		   		addCookie("Vod_List_Area_Index", 0);	
			}
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
			o.getfocus();
		}else{
			o.getblur();
			o.index --;
			o.getfocus();
		}
		//o.move(lastIndex,o.index);
	}

	//向下移动焦点
	o.right = function(){
		if ( o.epgLists.length == 0 ) return ;
		if(o.index ==o.epgLists.length-1) {
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
			o.getfocus();
		}
		else{
			o.getblur();
			o.index ++;
			o.getfocus();
		}
		//o.move(lastIndex,o.index);
	}

	o.pageUp = function(){
		if ( o.epgLists.length == 0 ) return ;
		
			var index = o.index;
			if(index >= o.n){
				o.getblur();
				index = (index - index % o.n) - o.n;
				o.index = index;
				o.showData();
				var p = o.index % o.n;
				o.getfocus();
			}
	}
	o.pageDown = function(){
		if ( o.epgLists.length == 0 ) return ;
			var index = o.index;
			if( parseInt(index /o.n+1)*o.n < o.epgLists.length){
				o.getblur();
				index=(index - index % o.n) + o.n;
				o.index = index;
				o.showData();
				var p = o.index%o.n;
				o.getfocus();
			}
	}
	o.down = function(){
		if( ( o.index + 5 ) < o.epgLists.length ){
			var p = parseInt(o.index/o.n,10);
			var p1 =parseInt( ( o.index + 5 ) / o.n,10);
			if(p != p1){
				o.getblur();
				o.index = o.index + 5;
				o.showData();
				o.getfocus();
			}
			else{
				o.getblur();
				o.index = o.index + 5;
				o.getfocus();
			}
			if( request_child_column == 0 ){
				addCookie("Vod_List_Area_Index", 1);
			}
		}
	}
	o.up = function(){
		if( ( o.index - 5 ) >= 0 ){
			var p = parseInt(o.index/o.n,10);
			var p1 = parseInt(( o.index - 5 ) / o.n,10);
			if(p != p1){
				o.getblur();
				o.index = o.index - 5;
				o.showData();
				o.getfocus();
			}else{
				o.getblur();
				o.index = o.index - 5;
				o.getfocus();
			}
		}
		if( request_child_column == 0 ){
			addCookie("Vod_List_Area_Index", 1);
		}
		//o.index = 0;
		
	}
	o.addFontRoll=function (){	
		var name = o.epgLists[o.index].programName
		var i=o.index%o.n;
			if(getStrChineseLength(name) > 6){
				maq(document.getElementById("epg_name"+i),name,18,117,"epg_name"+i);
			}

	}
	 o.delFontRoll=function (){	
		 try{
			var name = o.epgLists[o.index].programName
			var i=o.index%o.n;
			if( document.getElementById("epg_name"+i) != null ){
				
				document.getElementById("epg_name"+i).innerHTML=name;
				delemaq();
				document.getElementById("epg_name"+i).style.overflow="hidden";
			}
		 }catch(e){
		 }
	}
	o.selects = function(){
		if( o.epgLists.length != 0 ){
			//addCookie("request_child_column", 0);	
			window.location.href = "vod_detail.html?id="+ escape(o.epgLists[o.index].programId);
		}
	}
	return o;	
}();



function initpage(){
	if(  !getUrlPara.folderId ){
			 getUrlPara.folderId = 0;
			 getUrlPara.parentId = 0;
			//getUrlPara.folderName = "点播分类";
	 }
	//$("ch_name").innerHTML = getUrlPara.folderName;
	var curCookieNameArr = getPathArr(path_name); 
	$("ch_name").innerHTML = unescape(curCookieNameArr[curCookieNameArr.length - 1]);
	contentArea.handleChannelListsData(getUrlPara.folderId);
	//dayFlag = epgArea.getDataStr(0);
	//checkDay();
	//setTimeout(function(){checkDay();}, 10000);
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
			else if (areaIndex == 1 ){
				
				epgArea.up();
			}
			break;
		case ROC_IRKEY_DOWN: //down
			if( areaIndex == 0){
				contentArea.down();
				//contentArea.deplay();
			}
			else if (areaIndex == 1 ){
				epgArea.down();
			}
			break;
		case ROC_IRKEY_LEFT: //left
			if( areaIndex == 0){
				contentArea.left();
			}
			else if(areaIndex == 1){
				epgArea.left();
			}
			break;
		case ROC_IRKEY_RIGHT: //right
			if( areaIndex == 0){
					contentArea.right();
			}
			else if(areaIndex == 1){
				epgArea.right();
			}
			break;
		case ROC_IRKEY_SELECT:
		    if ( areaIndex == 0 ){
				contentArea.chanListSelect();
			}else if(areaIndex == 1){
				epgArea.selects();
			}
			break
		case ROC_IRKEY_PAGE_UP:
			if( areaIndex == 0){
				contentArea.pageUp();
				//contentArea.deplay();
			}else if( areaIndex == 1){
				epgArea.pageUp();
			}
			break;
		case ROC_IRKEY_PAGE_DOWN:
			if( areaIndex == 0){
				contentArea.pageDown();
				//contentArea.deplay();
			}else if( areaIndex == 1){
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
		case POC_IRKEY_INDEX:
			 addCookie("request_child_column", 0);
		 	 break;
		case ROC_IRKEY_BACK:
		case ROC_IRKEY_EXIT:
			var pathArr = getPathArr(path);
			var pathNameArr = getPathArr(path_name);
			if( ( pathArr.length == 1 )&&(pathArr[0] == "")){				 
				addCookie("request_child_column", 0);	
				addCookie("Vod_Path",getPathStr(path));
				addCookie("Vod_Path_Name",getPathStr(path_name));
				window.location.href="../index/index.html";
			}else{
				if(  getUrlPara.parentId == 0 ){
					addCookie("request_child_column", 0);
				}
				addCookie("Vod_Path",getPathStr(path));
				addCookie("Vod_Path_Name",getPathStr(path_name));
				//var curCookieNameArr = getPathArr(getPathStr(path_name)); 
				var curCookieArr = getPathArr(getPathStr(path)); 				
				window.location.href = "vod_index.html?id="+ escape(getUrlPara.parentId)+"&parentId="+escape(curCookieArr[curCookieArr.length - 1]);
				//window.location.href = "vod_index.html?id="+ escape(getUrlPara.parentId)+"&parentId="+escape(curCookieArr[curCookieArr.length - 1])+"&folderName="+escape(curCookieNameArr[curCookieNameArr.length - 1]);
			}

		  break;

	 }
}
function getPathArr (str){
	return str.split(".")
}
function getPathStr (str){
	return str.substring(0,str.lastIndexOf("."));
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
function login(retried){
	try{
		var userName = OVT_CA.NO();
		var userPwd = OVT_CA.PASSWORD();
		//var userName = "123456789";
		//var userPwd = "123456789";
		var checkKey='{"userCode":"'+userName+'","password":"'+hex_md5(userPwd)+'","loginDate":"'+getdatestr(0)+'"}';
		var url =MY_PORTAL_ADDR+"/UserLogin?userCode="+userName+"&password="+hex_md5(userPwd)+"&checkKey="+hex_md5(checkKey);
		Ajax.request(url,{
			success:function(data){
				//var data = {"result":"200"} ////////////////////
				var dataResult = data.result;
				if(dataResult == "200"){
					contentArea.handleChannelListsData(getUrlPara.folderId);
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