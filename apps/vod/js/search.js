// JavaScript Document
var AreaIndex=1;        //1为搜索框，2为搜索结果
var proList = new Array(); 		//获取到的节目
var totalcount = 0;						//节目总数
var precount = 8;                   //当前页面节目最大
var pageIndex=1;					//当前节目页数 ，默认为第一页
var focusIndex=0;					//节目索引
var totalPage = 0;                     //总页数
var lastPageCount = precount;      //最后一页节目个
var subId = 0;  //节目ID

//area.getProgdata = function (retried){
function getProgdata(retried){
	var inputText = $("input_area");
	//var name =  escape( inputText.value );
	var name =  inputText.value ;
	proList = [];
	try{
		var url = MY_PORTAL_ADDR+"/search?name="+name+"&startAt=1&maxItems=1000";
		Ajax.request(url,{
			success : function(data){
				for(var i=0; i<data.ItemsContents.length; i++){
					proList[i] = data.ItemsContents[i];
				}
				totalcount = proList.length;//总节目数
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
					//alert("proList.length:"+proList.length)
				/*if(name == "" || proList.length==0 ){
					alert("空")
				}else{
					alert("有")
					showProList(0);//显示搜索结果
					//myfocus(0);		
					$("result_focus").style.visibility = 'visible';			
					document.getElementById("result_focus").style.top =177 +"px";
					index =1;
					buttonArea.myblur();
					AreaIndex = 2;
				}*/
				showProList(0);
				
			},
			failure : function(data){
				if( retried ) { 

				} else {
					setTimeout(function(){ getProgdata( true ) }, 300);
				}
			}
		});
	}catch(e){
		GF_WebPrint("获取搜索列表信息："+e)
	}
}


function showProList(i){
	var inputText = $("input_area");
	var name =  escape( inputText.value );
	if(name == "" || proList.length==0 ){
		noProgram();
		
	}else{
		var html="";
		for(var i=(precount*pageIndex-precount);i<precount*pageIndex;i++){
			if(proList[i] == undefined) {
				proList[i] = {"name" : ""}
			}
			html+='<div class="list_result" id="list_pad'+i+'">'+proList[i].name+'</div>';
		}
		$("result_show").innerHTML=html;
		proListArea.showPage();
		proListArea.initpage();
		$("result_focus").style.visibility = 'visible';	
		//document.getElementById("list_pad"+focusIndex).className = "black";//??????????????????
		//alert("myfocus_focusIndex:"+focusIndex)
		proListArea.myfocus(focusIndex);
		//GF_WebPrint("focusIndex:"+focusIndex);
		//document.getElementById("result_focus").style.top =177 +"px";
		index =1;
		buttonArea.myblur();
		AreaIndex = 2;
	}
}
function noProgram(){
	$("result_show").innerHTML = "";
	showSysError("暂无节目,请选其他栏目");
	setTimeout(function(){sysErrorHandle();},1500);
	document.getElementById("page").innerHTML = null;
}
/*function showProList(i){
	var html="";
	for(var i=(precount*pageIndex-precount);i<precount*pageIndex;i++){
		if(proList[i] == undefined) {

			proList[i] = {"name" : ""}
		}
		html+='<div class="list_result" id="list_pad'+i+'">'+proList[i].name+'</div>';
		
		
	}
	$("result_show").innerHTML=html;
	proListArea.showPage();
}*/

var proListArea = (function(){
	var area = {};
	var channelObj;		//获取页面中所有的节目div
	area.initpage = function (){
		channelObj = $("result_show").getElementsByTagName("div");
	}
	function pageup(){
		if(pageIndex == 1){
		
		}else{
			myblur();
			pageIndex -= 1;
			focusIndex = 7;
			showProList(pageIndex);
			
			myfocus(focusIndex)
		}
	}
	function pagedown(){
		if(pageIndex == totalPage){

		}else{
			focusIndex = 0;
			myblur();
			pageIndex += 1;
			showProList(pageIndex);
			
			myfocus(focusIndex);
		}
	}
	area.pageup = function(){
		pageup();
	}
	area.pagedown = function(){
		pagedown();
	}
	area.down = function(){
		//alert("down-------------focusIndex:"+focusIndex)
		if(pageIndex == totalPage){
			if(focusIndex < lastPageCount - 1){//最后一页，第一到倒数第二个节目
				myblur();
				focusIndex ++;
				myfocus(focusIndex);
			}else{//最后一页，最后一个节目
				myblur();
				pageIndex = 1;
				focusIndex = 0;
				showProList(pageIndex);
			    myfocus(focusIndex);
			}
		}else{
			if(focusIndex < 7){//其它页，第一到倒数第二个节目
				myblur();
				focusIndex ++;
				myfocus(focusIndex);
			}else{//其它页，最后一个节目
				pagedown();
			}
		}
	}
	area.up = function(){
		//alert("up-------------focusIndex:"+focusIndex)
		if(pageIndex == totalPage){
			if(focusIndex > 0){
				if(focusIndex < lastPageCount ){//最后一页 第二到最后一个节目
					myblur();
					focusIndex --;
					myfocus(focusIndex);
				}else{
					myblur();
					focusIndex = lastPageCount -1;
					myfocus(focusIndex);
				}
			}else{//最后一页第一个节目
				if(pageIndex == 1){
					myblur();
					AreaIndex = 1;
					buttonArea.initpage();
				}else{
					pageup();
				}
			}
			
		}else{
			if(focusIndex > 0){//其它页第二到最后一个节目
				myblur();
				focusIndex --;
				myfocus(focusIndex);
			}else{
				if(pageIndex == 1){//第一页第一个节目
					myblur();
					AreaIndex = 1;
					buttonArea.initpage();
				}else{//其它页第一个节目
					pageup();
				}
			}
		}
	}
	
	function myfocus(i){
		//alert(i)
		try{
			document.getElementById("result_focus").style.top =177 + i * 49 +"px";
			$("result_focus").style.visibility = 'visible';
			//GF_WebPrint(channelObj[0].innerHTML)
			channelObj[i].className = "black";
		}catch(e){
			GF_WebPrint(e);
		}
	}
	function myblur(){
		//alert("11111:"+focusIndex)
			$("result_focus").style.visibility = 'hidden';
			//GF_WebPrint("myblur+focusIndex"+focusIndex);
			channelObj[focusIndex].className = "white";
	}	
	area.showPage = function(){
		document.getElementById("page").innerHTML = pageIndex + "/" +totalPage;
	}
	area.href = function(){
		subId = (focusIndex) + (pageIndex-1)*precount;
		window.location.href = "vod_detail.html?id="+ escape(proList[subId].id)
	}
	area.myfocus  = myfocus;
	return area;
}());

var buttonArea = (function(){
	var area = {};
	//var index = 0;
	area.index = 0;
	area.up = function(){
		
	}
	area.down = function(){
		if($("input_area").value == "" || proList.length==0 ){

		}else{
			AreaIndex = 2;
			document.getElementById("result_focus").style.top =177+"px";
			$("result_focus").style.visibility = 'visible';
			proListArea.myfocus(focusIndex);
			area.index = 1;
			area.myblur();
		}
	}
	area.right = function(){
		if(area.index == 1){
			
		}else if(area.index == 0){
			area.myblur();
			area.index = 1;
			this.myfocus();
		}
	}
	area.left = function(){
		if(area.index == 0){
			
		}else if(area.index == 1){
			area.myblur();
			area.index = 0;
			this.myfocus();
		}
	}
	area.myfocus = function(){
		if(area.index == 0){
			var inputText = $("input_area");
			inputText.focus();
		}else{
			document.getElementById("search").style.background="url(images/search_btn.png) -94px 0px no-repeat";
		}
	}
	area.myblur = function(){
		if(area.index == 0){
			var inputText = $("input_area");
			inputText.blur();
		}else{
			document.getElementById("search").style.background="url(images/search_btn.png) -0px 0px no-repeat";
		}
	}
	area.href = function(){
		if(area.index == 0){
			
		}else{
			getProgdata();
		}
	}
	area.initpage = function(){
		area.index = 0;
		var inputText = $("input_area");
		inputText.focus();
	}
	return area;
}());

function init(){
	Navigation.disableDefaultNavigation();//禁用超链接自动聚焦功
	//Navigation.disableHighlight();
	buttonArea.initpage();
	//proListArea.getProgdata(false);
}