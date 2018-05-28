// JavaScript Document
//var focusIndex = 0;
var tipIndex = 0;
var deleTip = false;
var channelList = new Array(); 		
var totalNum = 0;
var newbox = new Array();
var tip_timer = 0;
var focusIndex = 0;
var curPage = 0;
var pageSize = 7;
var lastPageCount = pageSize;      //最后一页节目个数
var pageTotal = 1; 
var email = function(taskId,program,size,channel,status){
	this.taskId=taskId;
	if(program.length>11){
		//this.programName=programName.substr(0,11)+"...";
		this.program=getStrChineseLen(program + "...",11);
	}else{
		this.program=program;
	}
	//this.program=program;
	
	this.size=size;
	if(channel.length>8){
		//this.programName=programName.substr(0,11)+"...";
		this.channel=getStrChineseLen(channel + "...",8);
	}else{
		this.channel=channel;
	}
	//this.channel=channel;
	this.status=status;	
	this.showProgram=function(){
		return this.program;
	}
	this.showSize=function(){
		return this.size;
	}
	this.showChannel=function(){
		return this.channel;
	}
	this.showStatus=function(){
		return this.status;
	}
	this.GettaskId=function(){
		return this.taskId;
	}
}


var listArea = (function(){
	var area =　{};
	
	var pageTotal = parseInt(totalNum%pageSize?(totalNum/pageSize)+1:(totalNum/pageSize)); 
	
	
	function loadContent(retried){
		try{
			//http://ip:port/GetNpvrTask?userCode="+123&startDateTime=20130219014251&endDateTime=20130219014251&isFinish=0&dateFlag=0&startAt=1&maxItems=20
			var url = MY_PORTAL_ADDR+"/GetNpvrTask?userCode="+OVT_CA.NO()+"&isFinish=0";
			
			Ajax.request(url,{
				success : function(data){
					//var data =  {"totalResults": "2","restartAtToken": "11","tasks": [{"taskId": "1","programName": "阿的漫画阿的漫画阿的漫画阿的漫画阿的漫画","channelId": "1","channelName": "阿的漫画阿的漫画阿的漫画","startDateTime": "20140220010000","endDateTime": "20140220020000","programSize": "24","addDateTime": "20140219010000"," storageLife ": "20140219"," resumePoint": "10000","isFinish": "1"},{"taskId": "2","programName": "达到-1","channelId": "1","channelName": "CCTV1","startDateTime": "20140220010000","endDateTime": "20140220020000","programSize": "55","addDateTime": "20140219010000"," storageLife ": "20140219"," resumePoint": "10000","isFinish": "0"}]}
					if(data.result!="200"){
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
							var channel = data.tasks[i].channelName;
							if(data.tasks[i].isFinish == 2){
								var status = "录制中";
							}else if(data.tasks[i].isFinish == 0){
								var status = "未录制";
							}else if(data.tasks[i].isFinish == 3){
								var status = "录制失败";
							}else{
								var status = "";
							}
							var taskId = data.tasks[i].taskId;
							//alert("program"+program);
//							alert("size"+size);
//							alert("channel"+channel);
//							alert("status"+status);
							//var status = channelList[i].isFinish;
							newbox.push(new email(taskId,program,size,channel,status));
							//alert(newbox)
						}
						totalNum = data.totalResults;
						//alert(totalNum)
						area.showContent();
						area.myfocus(focusIndex);
						showPage();
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
	
	/*area.getContent = function(){
		for(var i=0;i<totalNum;i++){
			var program = "节目"+i;    //title
			var size =  "250M";   //status
			var channel = "CCTV-"+i;
			var status = "已完成";
			//var content =  "这是第"+i+"封邮件";
			newbox.push(new email(program,size,channel,status));
		}
	}*/
	area.showContent = function(){
		var html='';
		//alert(totalNum)
		for(var i=curPage*pageSize;i<(curPage+1)*pageSize;i++){
			
			if(i>=totalNum){
				break;
			}
			
			//html+='<div class="list_content" id="list_name'+i%pageSize+'">'+mailbox[i].showTitle()+'<span class="list_state">'+mailbox[i].showStatus()+'</span><span class="list_delete" id="delete'+i%pageSize+'">删除</span></div>';
			 html+='<div class="content_program" id="list_pad'+i%pageSize+'">'+newbox[i].showProgram()+'<span class="channel_content">'+ newbox[i].showChannel()+'</span><span class="list_state">'+ newbox[i].showStatus()+'</span><span class="size_content">'+newbox[i].showSize()+'</span><span class="list_delete" id="delete1'+i%pageSize+'"> </span></div>';
			//html+='<div class="content_program" id="list_pad'+i%pageSize+'">'+newbox[i].showProgram()+'<span class="size_content">'+newbox[i].showSize()+'</span><span class="channel_content">'+ newbox[i].showChannel()+'</span><span class="list_state">'+ newbox[i].showStatus()+'</span><span class="list_delete" id="delete'+i%pageSize+'"></span></div>';
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
			/*$("tipTip").style.visibility = "visible";
			$("tipTip_content").innerHTML = "删除失败";
			clearTimeout(tip_timer);
			tip_timer = setTimeout(function (){hiddentip()},2000);
			setTimeout(function(){ 
				window.location = "../index/index.html"; }
			,3000)*/
		}
	}
	area.DeleteNew = function(emailIndex){
		//if(mExtend.exec("deleteCaEmail ",emailIndex)==0){
			if(emailIndex==totalNum-1){
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
			newbox.splice(emailIndex,1);
			totalNum--;
			if(totalNum<0)
				totalNum=0;
			pageTotal = parseInt(totalNum%pageSize?(totalNum/pageSize)+1:(totalNum/pageSize)); 
			area.showContent();
			if(totalNum!=0){
				area.myfocus(focusIndex);
				showPage();
			}
			addCookie("task_id",focusIndex);
			addCookie("page_id",curPage);
			//getSpace();
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
					addCookie("page_id",curPage);
				}
			}else{
				area.myblur(focusIndex--);
				area.myfocus(focusIndex);
			}
			addCookie("task_id",focusIndex);
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
					addCookie("page_id",curPage);
				}else{
					area.myblur(focusIndex++);
					area.myfocus(focusIndex);
				}
			}
			addCookie("task_id",focusIndex);
		}
		
	}
	area.left = function(){
		if(deleTip == true){
			//$("tip_affirm_bg").style.left = 130 +"px";
			//$("tip_cancel_bg").style.left = 280 +"px";
			area.tipblur();
			tipIndex = 0;
			area.tipfocus();
		}
	}
	area.right = function(){
		if(deleTip == true){
			//$("tip_affirm_bg").style.left = 280 +"px";
			//$("tip_cancel_bg").style.left = 130 +"px";
			area.tipblur();
			tipIndex = 1;
			area.tipfocus();
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
			$("small_focus").style.visibility = "visible";
			$("small_focus").style.top = 89 + i * 51 +"px";
		}
	}
	area.myblur = function(){
		$("small_focus").style.visibility = "hidden";
	}
	area.myhref = function(){
		if(deleTip == false){
			if(totalNum!=0){
				$("tip").style.visibility = "visible";
				$("tip_cancel").style.color = "#000";
				deleTip = true;
			}else{
				
			}
		}else{
			if(tipIndex == 1){
				$("tip").style.visibility = "hidden";
				deleTip = false;
			}else{//////////////删 除
				area.DeleteTask(focusIndex+curPage*pageSize);
				$("tip").style.visibility = "hidden";
				deleTip = false;
			}
		}
	}
	//显示页数与节目数
	function showPage(){
		//alert("curPage:"+curPage)
		//alert("pageTotal:"+pageTotal)
		pageTotal = parseInt(totalNum%pageSize?(totalNum/pageSize)+1:(totalNum/pageSize)); 
		$("total").innerHTML = "共"+ totalNum +"个任务";
		$("page").innerHTML = "页："+ (curPage+1) + "/" + pageTotal;
	}
	area.init = function(){
		loadContent();
		//alert(focusIndex);
//		area.myfocus(focusIndex);
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
	$("totole_content").innerHTML = totalSpace + "M";
	$("left_content").innerHTML = freeSpace + "M";
	$("used_content").innerHTML =   useSpace+ "M";
	$("date_content").innerHTML = expiredDate.substr(0,4) + "/" + expiredDate.substr(4,2) + "/" + expiredDate.substr(6,2);
}

function init(){
	getSpace();
	listArea.init();
	
	//listArea.getContent();
	//listArea.showContent();
	//listArea.myfocus(0);
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
var Navigation_Index = getCookie("task_id");
if(typeof(Navigation_Index)=="undefined"||Navigation_Index==""||typeof(parseInt(Navigation_Index))!="number"){
	focusIndex=0; 
}else{
	//alert("11111---"+Navigation_Index)
	focusIndex = parseInt(Navigation_Index);
	//navigationArea.myfocus();
}
//获取页数索引
var Page_Index = getCookie("page_id");
if(typeof(Page_Index)=="undefined"||Page_Index==""||typeof(parseInt(Page_Index))!="number"){
	curPage=0; 
}else{
	//alert("11111---"+Navigation_Index)
	curPage = parseInt(Page_Index);
	//navigationArea.myfocus();
}

