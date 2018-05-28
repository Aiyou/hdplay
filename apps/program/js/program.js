// JavaScript Document
var tipIndex = 0;
var deleTip = false;
var playTip = false;
var channelList = new Array(); 		
var totalNum = 0;
var newbox = new Array();
var tip_timer = 0;
var focusIndex = 0;
var curPage = 0;
var pageSize = 7;
var lastPageCount = pageSize;      //最后一页节目个数
var smallfocusIndex = 0;

//var task = function(taskId,programName,channelId,channelName,startDateTime,endDateTime,addDateTime,storageLife,programSize,resumePoint,isFinish){
var task = function(assetId,taskId,programName,channelName,addDateTime,programSize){	
	this.assetId=assetId;
	this.taskId=taskId;
	if(programName.length>11){
		//this.programName=programName.substr(0,11)+"...";
		this.programName=getStrChineseLen(programName + "...",11);
	}else{
		this.programName=programName;
	}
	//this.programName=programName;
	
	//this.channelId=channelId;
	if(channelName.length>7){
		//this.channelName=channelName.substr(0,7)+"...";
		this.channelName=getStrChineseLen(channelName + "...",7);
	}else{
		this.channelName=channelName;
	}
	//this.channelName=channelName;
	//this.startDateTime=startDateTime;
	//this.endDateTime=endDateTime;
	this.addDateTime=addDateTime;
	//this.storageLife=storageLife;
	this.programSize=programSize;
	//this.resumePoint=resumePoint;
	//this.isFinish=isFinish;
		
	this.GetprogramName=function(){
		return this.programName;
	}
	this.GetprogramSize=function(){
		return this.programSize;
	}
	this.GetaddDateTime=function(){
		return this.addDateTime;
	}
	this.GetchannelName=function(){
		return this.channelName;
	}
	this.GettaskId=function(){
		return this.taskId;
	}
	this.GetassetId=function(){
		return this.assetId;
	}
}


var listArea = (function(){
	var area =　{};
	var ajaxFlag = false;	// 判断ajax是否成功
	var pageTotal = parseInt(totalNum%pageSize?(totalNum/pageSize)+1:(totalNum/pageSize)); 
	function loadContent(retried){
		try{			
			//http://ip:port/GetNpvrTask?userCode=123&startDateTime=20130219014251&endDateTime=20130219014251&isFinish=0&dateFlag=0&startAt=1&maxItems=20
			var url = MY_PORTAL_ADDR+"/GetNpvrTask?userCode="+OVT_CA.NO()+"&isFinish=1";
			Ajax.request(url,{
				success : function(data){
					//var data =  {"totalResults": "2","restartAtToken": "11","tasks": [{"taskId": "1","programName": "阿的漫阿的漫阿的漫画阿的漫画阿的漫画画","channelId": "1","channelName": "打开去控电少年我的","startDateTime": "20140220010000","endDateTime": "20140220020000","programSize": "24","addDateTime": "20140219010000"," storageLife ": "20140219"," resumePoint": "10000","isFinish": "1"},{"taskId": "2","programName": "达到-1","channelId": "1","channelName": "CCTV1","startDateTime": "20140220010000","endDateTime": "20140220020000","programSize": "55","addDateTime": "20140219010000"," storageLife ": "20140219"," resumePoint": "10000","isFinish": "0"}]}
					if(data.result!="200"){//如果发生错误
						showTip(data);
					}
					if(data.totalResults == 0){    //获取节目数量，判断是否有节目需要显示
						//noProgram(); //没有VOD节目
						/*setTimeout(function(){ 
							window.location = "../index/index.html"; }
							,3000)*/
					}else{
						for(var i=0; i<data.totalResults; i++){
							//channelList[i] = data.tasks[i];
							//alert("111:"+channelList)
							var program = data.tasks[i].programName;
							var size =  data.tasks[i].programSize+"M"; 
							var datestr = data.tasks[i].addDateTime;
							var date = datestr.substr(0,4) + "/" + datestr.substr(4,2) + "/" + datestr.substr(6,2);
							var channel = data.tasks[i].channelName;   //20140219010000
							var taskId = data.tasks[i].taskId;
							var assetId = data.tasks[i].assetId;
//							alert("size:"+size);
//							alert("time:"+time);
//							alert("date:"+date);
//							alert("channel:"+channel);
							
							newbox.push(new task(assetId,taskId,program,channel,date,size));
							//alert(newbox)
						}
						totalNum = data.totalResults;
						area.showContent();
						area.myfocus(focusIndex);
						showPage();
						//alert(totalNum)
					}
					
				},
				failure : function(data){
					if( retried ) {
						$("content_list").innerHTML = "";
					} else {
						setTimeout(function(){ loadContent( true ) }, 300);
					}
				}
			});
		}catch(e){
			GF_WebPrint("任务："+e)
		}
	}
	
	area.getContent = function(){
		for(var i=0;i<totalNum;i++){
			var program = "节目"+i;    //title
			var size =  "250M";   //status
			var time = "10:25";
			var date = "2014/03/01";
			var channel = "CCTV-"+i;
			newbox.push(new email(program,size,time,date,channel));
		}
	}
	area.showContent = function(){
		var html='';
		for(var i=curPage*pageSize;i<(curPage+1)*pageSize;i++){
			if(i>=totalNum){
				break;
			}
			//getStrChineseLen(getdata.info + "...",88);
			html+='<div class="content_program" id="list_pad'+i%pageSize+'">'+newbox[i].GetprogramName()+'<span class="channel_content">'+ newbox[i].GetchannelName()+'</span><span class="date_content">'+ newbox[i].GetaddDateTime()+'</span><span class="size_content">'+newbox[i].GetprogramSize()+'</span><span class="list_delete" id="delete'+i%pageSize+'"> </span></div>';
			
			
			//html+='<div class="content_program" id="list_pad'+i%pageSize+'">'+newbox[i].GetprogramName()+'<span class="size_content">'+newbox[i].GetprogramSize()+'</span><span class="date_content">'+ newbox[i].GetaddDateTime()+'</span><span class="channel_content">'+ newbox[i].GetchannelName()+'</span><span class="list_delete" id="delete'+i%pageSize+'"></span></div>';
		}
		
		$("content_list").innerHTML=html;
		//showTotal();
	}
	
	function showTip(strdata){
		$("tipTip").style.visibility = "visible";
		$("tipTip_content").innerHTML = strdata.infoText;
		clearTimeout(tip_timer);
		tip_timer = setTimeout(function (){hiddentip()},2000);
	}
	function hiddentip(){
		$("tipTip").style.visibility = "hidden";
	}
	
	area.DeleteTask=function(taskIndex){
		var url = MY_PORTAL_ADDR+"/DelNpvrTask?userCode=" + OVT_CA.NO()+"&taskId=" + newbox[taskIndex].GettaskId();	
		try{
		Ajax.request(url,{
				success : function(data){
					//var data = {"result":"200"} 
					dataResult = data.result;
					area.DeleteNew(taskIndex);	
					showTip(data);
					ajaxFlag = true;
					setTimeout("getSpace()",3000);
					//getSpace();
				},
				failure : function(data){
					if( retried ){
						ajaxFlag = false;
						$("tip").style.visibility = "visible";
						$("tip_content").innerHTML = "删除失败";
						clearTimeout(tip_timer);
						tip_timer = setTimeout(function (){hiddentip()},2000);
					}else{
						setTimeout( function(){  getData(true) },300 );		
					}
				}
			});
		}catch(e){
			GF_WebPrint("删除："+e)
			
		}
	}
	
	area.DeleteNew = function(taskIndex){
		
		//alert(url);
		//if(mExtend.exec("deleteCaEmail ",emailIndex)==0){
			if(taskIndex==totalNum-1){
				if(focusIndex==0){
					if(curPage==0){
						area.myblur(focusIndex);
					}else{
						area.myblur(focusIndex);
						curPage--;
						focusIndex=6;
						//area.myfocus(focusIndex);
					}
				}else{
					area.myblur(focusIndex);
					focusIndex--;
					//area.myfocus(focusIndex);
				}
			}
			newbox.splice(taskIndex,1);
			totalNum--;
			if(totalNum<0)
				totalNum=0;
			pageTotal = parseInt(totalNum%pageSize?(totalNum/pageSize)+1:(totalNum/pageSize)); 
			area.showContent();
			if(totalNum!=0){
				area.myfocus(focusIndex);
				showPage();
			}
			addCookie("program_id",focusIndex);
			addCookie("programpage_id",curPage);
		//}
	}
	
	area.up = function(){
		/*area.myblur();
		focusIndex --;
		area.myfocus(focusIndex);*/
		if(deleTip == true){
		
		}else{
			if(0==focusIndex){
				if(0!=curPage){
					curPage--;
					area.showContent();
					focusIndex=pageSize-1;
					area.myfocus(focusIndex);
					showPage();
					addCookie("programpage_id",curPage);
				}
			}else{
				area.myblur(focusIndex--);
				area.myfocus(focusIndex);
			}
			addCookie("program_id",focusIndex);
		}
	}
	area.down = function(){
		/*area.myblur();
		focusIndex ++;
		area.myfocus(focusIndex);*/
		if(deleTip == true){
		
		}else{
			if(1+focusIndex+pageSize*curPage>=totalNum){
				
			}else{
				if(pageSize-1==focusIndex){
					curPage++;
					area.showContent();
					focusIndex=0;
					area.myfocus(focusIndex);
					showPage();
					addCookie("programpage_id",curPage);
				}else{
					area.myblur(focusIndex++);
					area.myfocus(focusIndex);
				}
			}
			addCookie("program_id",focusIndex);
		}
	}
	area.left = function(){
		if(deleTip == true){
			//$("tip_affirm_bg").style.left = 130 +"px";
			//$("tip_cancel_bg").style.left = 280 +"px";
			area.tipblur();
			tipIndex = 0;
			area.tipfocus();
		}else{
			if(totalNum!=0){
				area.myblur(focusIndex);
				smallfocusIndex--;
				if(smallfocusIndex<0){
					smallfocusIndex=0;
				}
				area.myfocus(focusIndex);
			}
			addCookie("h_id",smallfocusIndex);	
		}
	}
	area.right = function(){
		if(deleTip == true){
			//$("tip_affirm_bg").style.left = 280 +"px";
			//$("tip_cancel_bg").style.left = 130 +"px";
			area.tipblur();
			tipIndex = 1;
			area.tipfocus();
		}else{
			if(totalNum!=0){
				area.myblur(focusIndex);
				smallfocusIndex++;
				if(smallfocusIndex>2){
					smallfocusIndex=2;
				}
				area.myfocus(focusIndex);
			}
			addCookie("h_id",smallfocusIndex);	
		}
	}
	area.tipfocus = function(){
		if(tipIndex == 0){
			$("tip_affirm_bg").style.left = 130 +"px";
			$("tip_cancel_bg").style.left = 280 +"px";
			$("tip_affirm").style.color = "#000";
		}else{
			$("tip_affirm_bg").style.left = 280 +"px";
			$("tip_cancel_bg").style.left = 130 +"px";
			$("tip_cancel").style.color = "#000";
			
		}
	}
	area.tipblur = function(){
		if(tipIndex == 0){
			$("tip_affirm").style.color = "#000";
		}else{
			$("tip_cancel").style.color = "#000";
			
		}
	}

	area.myfocus = function(i){
		if(totalNum == 0){
			
		}else{
			if(0==smallfocusIndex){
				$("list_focus").style.visibility = "visible";
				$("list_focus").style.top = 84 + i * 51 +"px";
			}else{
				$("small_focus").style.visibility = "visible";
				$("small_focus").style.top = 89 + i * 51 +"px";
			}
		}
	}
	area.myblur = function(){
		if(0==smallfocusIndex){
			$("list_focus").style.visibility = "hidden";
		}else{
			$("small_focus").style.visibility = "hidden";
		}
	}
	area.myhref = function(){
		if(deleTip == false){
			if(0==smallfocusIndex){//////////////////////////////////////////////////////播放
				window.location.href="../vod/vod_play.html?programId=" + escape(newbox[curPage*pageSize+focusIndex].GettaskId()) + "&playUrl=" + escape(newbox[curPage*pageSize+focusIndex].GetassetId()) + "&programName=" + escape(newbox[curPage*pageSize+focusIndex].GetprogramName()) + "&type=2";
				//taskId": "1","programName": "阿的漫画",
			}else{
				if(totalNum!=0){
					$("tip").style.visibility = "visible";
					$("tip_cancel").style.color = "#000";
					deleTip = true;
				}else{
					
				}
			}
		}else{
			if(tipIndex == 1){
				$("tip").style.visibility = "hidden";
				deleTip = false;
			}else{//////////////删 除
				area.DeleteTask(focusIndex+curPage*pageSize);
				$("tip").style.visibility = "hidden";
				deleTip = false;
				//setTimeout("getSpace()",5000);
				//setTimeout(function (){getSpace()},2000);
			}
		}
	}
	//显示页数与节目数
	function showPage(){
		//alert("curPage:"+curPage)
		//alert("pageTotal:"+pageTotal)
		pageTotal = parseInt(totalNum%pageSize?(totalNum/pageSize)+1:(totalNum/pageSize)); 
		$("total").innerHTML = "共"+ totalNum +"个节目";
		$("page").innerHTML = "页："+ (curPage+1) + "/" + pageTotal;
	}
	area.init = function(){
		loadContent();
		//alert(totalNum)
	}
	return area; 
}());

var ajaxFlag = false;	// 判断ajax是否成功
var totalSpace = 0;
var useSpace = 0;
var freeSpace = 0;
var expiredDate = 0;
function getSpace(retried){
//function getData(id,retried){
	try{		
		//var url =MY_PORTAL_ADDR+"/GetVodData?id=" + id;
		//http://ip:port/GetUserSpace?userCode=123
		var url =MY_PORTAL_ADDR+"/GetUserSpace?userCode="+OVT_CA.NO();
		Ajax.request(url,{
			success:function(data){
				if(data.result == "410"){ 
					login(false);
					return ;
				}
				//var data = {"userCode": "20", "userName": "张三", "totalSpace": "180", "useSpace": "50","freeSpace": "20","expiredDate": "20141230"}
				totalSpace = data.totalSpace;
				useSpace = data.useSpace;
				freeSpace = data.freeSpace;
				expiredDate = data.expiredDate;
				///////////////////
				if(totalSpace!=""){
					
					$("totole_content").innerHTML = (totalSpace/1000).toFixed(1) + "G";
				}else{
					$("totole_content").innerHTML = "";
				}
				if(useSpace!=""){
					$("used_content").innerHTML = (useSpace/1000).toFixed(1) + "G";
				}else{
					$("used_content").innerHTML = "";
				}
				if(freeSpace!=""){
					$("left_content").innerHTML = (freeSpace/1000).toFixed(1) + "G";
				}else{
					$("left_content").innerHTML = "";
				}
				if(expiredDate!=""){
					$("date_content").innerHTML = expiredDate.substr(0,4) + "/" + expiredDate.substr(4,2) + "/" + expiredDate.substr(6,2);
				}else{
					$("date_content").innerHTML = "";
				}
				
				ajaxFlag = true;
			},
			failure:function(data){
				if( retried ){
					ajaxFlag = false;
					$("totole_content").innerHTML = "";
					$("left_content").innerHTML = "";
					$("used_content").innerHTML = "";
					$("date_content").innerHTML = "";
				}else{
					setTimeout( function(){  getData(true) },300 );		
				}
			}
		});
	}catch(e){
		ajaxFlag = false;
		GF_WebPrint("空间："+e);
		/*setTimeout(function(){              ////////////////////////////////
			window.location = "../index/index.html"; } 
		,3000)*/
	}
}
function showSpace(){
	$("totole_content").innerHTML = totalSpace + "G";
	$("left_content").innerHTML = useSpace + "G";
	$("used_content").innerHTML = freeSpace + "G";
	$("date_content").innerHTML = expiredDate.substr(0,4) + "/" + expiredDate.substr(4,2) + "/" + expiredDate.substr(6,2);
}


function init(){
	getSpace();
	listArea.init();
	//listArea.getContent();
	//listArea.showContent();
//	listArea.myfocus(0);
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
					init();
				}else{							
					if( retried ){
						
					}else{
						setTimeout( function(){  login(true) },300 );		
					}
				}
				
			},
			failure:function(data){
				if( retried ){
					
				}else{
					setTimeout( function(){  login(true) },300 );		
				}
			}
		});
	}catch(e){
		GF_WebPrint("登陆："+e);
	}
}

//获取索引
var Navigation_Index = getCookie("program_id");
if(typeof(Navigation_Index)=="undefined"||Navigation_Index==""||typeof(parseInt(Navigation_Index))!="number"){
	focusIndex=0; 
}else{
	focusIndex = parseInt(Navigation_Index);
}
//获取页数索引
var Page_Index = getCookie("programpage_id");
if(typeof(Page_Index)=="undefined"||Page_Index==""||typeof(parseInt(Page_Index))!="number"){
	curPage=0; 
}else{
	curPage = parseInt(Page_Index);
}
//获取删除与播放索引
var H_Index = getCookie("h_id");
if(typeof(H_Index)=="undefined"||H_Index==""||typeof(parseInt(H_Index))!="number"){
	smallfocusIndex=0; 
}else{
	//alert("11111---"+Navigation_Index)
	smallfocusIndex = parseInt(H_Index);
	//navigationArea.myfocus();
}