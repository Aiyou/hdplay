// JavaScript Document
var idname="id,name";
var ovtset = new QjyScript();
var historyarray = [];
var totalcount = 0;						//节目总数
var maxcount = 8;
var focusIndex=0;					//节目索引


function addhistory(){
	var historystr=ovtset.exec("OvtGetInforFromFile","history");
	//var historystr = "1,画片1|2,喽|3,顺";
	historyarray=historystr.split("|",9);//
	showLists();
	document.getElementById("list_pad0").className = "black"
	//porListArea.myfocus(0);
	//document.getElementById("list_pad0").style.color = "#000" ;
}	

//显示频道列表
function showLists(){
	var html="";
	//totalcount = historyarray.length;
	if(historyarray.length == 9){
		totalcount = historyarray.length;
	}else{
		totalcount = historyarray.length - 1;
	}
	for(var i=0;i<totalcount;i++){		
		var tmpstr = historyarray[i].indexOf(",");
		var datetimestr = historyarray[i].lastIndexOf(",");
		var namestr = unescape(historyarray[i].substring(tmpstr+1,datetimestr));
		var idarray = historyarray[i].substring(0,tmpstr);
		var datetime =  historyarray[i].substring(datetimestr+1);
		if(historyarray[i] == undefined){
			historyarray[i] = {"namestr" : ""}
			historyarray[i] = {"datetime" : ""}
		}
		//html+='<div class="list_result" id="list_pad'+i+'">'+namestr+'</div>';//???  
		html+= '<div class="list_result" id="list_pad'+i+'" >'+namestr+'<span class="date_list" id="date_box_'+i+'">'+ datetime +'</span></div>';
	}
	document.getElementById("result_show").innerHTML=html;
}


var porListArea = (function(){
	var area = {};
	var proObj;		//获取页面中所有的节目div
	area.init = function(){
		if(historyarray.length > 0){
			document.getElementById("result_focus").style.visibility = 'visible';
		}
	}
	area.initpage = function (){
		proObj = $("result_show").getElementsByTagName("div");
	}
	area.up = function(){
		if(focusIndex == 0){
			myblur();
			focusIndex = totalcount -1;
			area.myfocus(focusIndex);
		}else{
			myblur();
			focusIndex --;
			area.myfocus(focusIndex);
		}
	}
	area.down = function(){
		if(focusIndex == totalcount -1){
			myblur();
			focusIndex = 0;
			area.myfocus(focusIndex);
		}else{
			myblur();
			focusIndex ++;
			area.myfocus(focusIndex);
		}
	}
	area.myfocus = function(i){
			document.getElementById("result_focus").style.top =172 + i * 46 +"px";
			proObj[i].className = "black";

	}
	
	function myblur(){
			proObj[focusIndex].className = "white";
	}	
	area.href = function(){
		//alert("-historyarray-------------"+historyarray);
		var tmpstr = historyarray[focusIndex].indexOf(",");
		//alert("--tmpstr--------"+tmpstr);
		var idarray = historyarray[focusIndex].substring(0,tmpstr);
		//alert("--idarray--------"+idarray);
		window.location.href = "vod_detail.html?id="+ escape(idarray)
		
	}
	return area;
}());




