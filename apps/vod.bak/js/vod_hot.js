// JavaScript Document
var path_name = "热播节目";
var getUrlPara = {"folderId":$G.getParameter("id")};
var areaIndex = 0;

//判断为空的函数
function isnull(jsonstr)
{
  for(var key in jsonstr)
  {
	  return false;
  }
  return true;
}	

var epgIndex =  getCookie("vod_hot_Index");
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
				if(data.result == "410"){ 
					login(false);
					return ;
				}
				if(data.result == "200"){
					if( data.programList.length != 0 ){
						o.epgLists = data.programList;
					}
					if( o.epgLists.length != 0 ){
						o.showData();
						o.showPageArea();
					}else{
						o.hidePageArea();
						$("ch_content").innerHTML="";
					}	
				}else{
					o.hidePageArea();
					$("ch_content").innerHTML="";
				}
				
			},
			failure:function(data){
				o.hidePageArea();
				$("ch_content").innerHTML="";
			}
			});
		}catch(e){
			GF_WebPrint("getProgramList:"+e);
		}
	}
	
	o.n = 18;
	
	o.getblur = function(){
		if ( o.epgLists.length != 0 ){
			$("line_"+o.index).style.color = "#666";
			$("line_"+o.index).className = "";
			o.delFontRoll();
		}
	}
	//获得焦点getChannelList
	o.getfocus = function(){
		$("line_"+o.index).style.color = "#fff";
		$("line_"+o.index).className = "get_profocus";
		addCookie("vod_hot_Index", o.index);	
		o.addFontRoll();
		clearTimeout(epgTimper);
		epgTimper = setTimeout(function(){o.getImgSrc(o.index)},300);
	}
	o.showInfo = function(index){
		//$("pic_area").innerHTML = '<img src="'+this.list[index][4]+'" />';
		//$("play_name").innerHTML = this.list[index][2];
	}

	o.showData = function(){
		   $("ch_content").innerHTML = "";
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
								html += '<li id="line_'+idx+'"><div id="ch_name_'+idx+'"  class="info_1">'+o.epgLists[idx].programName+'</div></li>';	 	 
							}
						}
						else{						
								html += '<li id="line_'+idx+'"><div id="ch_name_'+idx+'"  class="info_1">'+o.epgLists[idx].programName+'</div></li>';	  
						}
				   }
					html += "</ul>"
					$("ch_content").innerHTML = html;
						o.getfocus();
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
				var strname = o.epgLists[i].summaryShor;
				//var a = "对中学生进行思想政治教育十分重要。随着国际国内形势的深刻变化,再加上高新技术特别是信息技术的迅猛发展, 当前青少年成长的外部环境和身心发展特点都发生了很大变化，新形势给中学生的思";
				strname = getStrChineseLen(strname,85);
			$("introduction_area").innerHTML =strname;
			$("pic_area").innerHTML = '<img src="'+url+'" />';
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
		if( ( o.index - 1 ) >= 0 ){
			var p = parseInt(o.index/o.n,10);
			var p1 = parseInt(( o.index - 1 ) / o.n,10);
			if(p != p1){
				o.getblur();
				o.index = o.index - 1;
				o.showData();
				o.getfocus();
			}else{
				o.getblur();
				o.index = o.index - 1;
				o.getfocus();
			}
		}
	}

	//向下移动焦点
	o.right = function(){
		if( ( o.index + 1 ) < o.epgLists.length ){
			var p = parseInt(o.index/o.n,10);
			var p1 =parseInt( ( o.index + 1 ) / o.n,10);
			if(p != p1){
				o.getblur();
				o.index = o.index + 1;
				o.showData();
				o.getfocus();
			}
			else{
				o.getblur();
				o.index = o.index + 1;
				o.getfocus();
			}
		}
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
		if( ( o.index + 2 ) < o.epgLists.length ){
			var p = parseInt(o.index/o.n,10);
			var p1 =parseInt( ( o.index + 2 ) / o.n,10);
			if(p != p1){
				o.getblur();
				o.index = o.index + 2;
				o.showData();
				o.getfocus();
			}
			else{
				o.getblur();
				o.index = o.index + 2;
				o.getfocus();
			}
		}
	}
	
	o.up = function(){
		if( ( o.index - 2 ) >= 0 ){
			var p = parseInt(o.index/o.n,10);
			var p1 = parseInt(( o.index - 2 ) / o.n,10);
			if(p != p1){
				o.getblur();
				o.index = o.index - 2;
				o.showData();
				o.getfocus();
			}else{
				o.getblur();
				o.index = o.index - 2;
				o.getfocus();
			}
		}

		//o.index = 0;
		
	}
	o.addFontRoll=function (){	
		var name = o.epgLists[o.index].programName
		var i=o.index%o.n;
			if(getStrChineseLength(name) > 6){
				maq(document.getElementById("ch_name_"+i),name,18,117,"epg_name"+i);
			}

	}
	 o.delFontRoll=function (){	
		 try{
			var name = o.epgLists[o.index].programName
			var i=o.index%o.n;
			if( document.getElementById("ch_name_"+i) != null ){
				
				document.getElementById("ch_name_"+i).innerHTML=name;
				delemaq();
				document.getElementById("ch_name_"+i).style.overflow="hidden";
			}
		 }catch(e){
		 }
	}
	o.selects = function(){
		if( o.epgLists.length != 0 ){
			//addCookie("request_child_column", 0);	
			window.location.href="../vod/vod_play.html?programId=" + escape(o.epgLists[o.index].programId)+"&programName=" + escape(o.epgLists[o.index].programName) +"&playUrl=" + escape(o.epgLists[o.index].assetId);
			//window.location.href = "vod_detail.html?id="+ escape(o.epgLists[o.index].programId);
		}
	}
	return o;	
}();



function initpage(){
	if(  !getUrlPara.folderId ){
			 getUrlPara.folderId = 32;
	 }
	epgArea.handleEpgData(getUrlPara.folderId );
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
			 if (areaIndex == 0 ){
				
				epgArea.up();
			}
			break;
		case ROC_IRKEY_DOWN: //down
			if (areaIndex == 0 ){
				epgArea.down();
			}
			break;
		case ROC_IRKEY_LEFT: //left
			if(areaIndex == 0 ){
				epgArea.left();
			}
			break;
		case ROC_IRKEY_RIGHT: //right
			if(areaIndex == 0 ){
				epgArea.right();
			}
			break;
		case ROC_IRKEY_SELECT:
			if(areaIndex == 0 ){
				epgArea.selects();
			}
			break
		case ROC_IRKEY_PAGE_UP:
			if( areaIndex == 0 ){
				epgArea.pageUp();
			}
			break;
		case ROC_IRKEY_PAGE_DOWN:
			if( areaIndex == 0 ){
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
		 	 break;
		case ROC_IRKEY_BACK:
		case ROC_IRKEY_EXIT:
			
				window.location.href="../index/index.html";

		  break;

	 }
}



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
					epgArea.handleEpgData(getUrlPara.folderId);
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