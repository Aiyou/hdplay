var programId = unescape($G.getParameter("id"));//通过url传递节目id
var playUrl = {"zt_url":"","zt_url1":"","zt_url2":""};
var curPlayUrl = playUrl.zt_url			//默认的视频类型
var programCount = 0;

function showTime(){	
    var date = new Date();
	var time_box = $("timer");
	var timeStr = (date.getHours().toString().length == 1  ?  '0' : '') + date.getHours() + ":" + (date.getMinutes().toString().length == 1  ?  '0' : '') + date.getMinutes();
	time_box.innerHTML = timeStr;
	setTimeout('showTime()',60000);	 
}
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

/*3个按钮*/
var buttonHandle = function(){
	var navAll = [];		//3个按钮
	var navLen;
	var listVisible = false; //选集列表显示隐藏标志
	var o = new Control();
	
	o.setNavObj = function(){
		var tempButton = $("button").getElementsByTagName("div");
		for(var i=0,len = tempButton.length; i<len; i++){
			if(tempButton[i].style.display != "none"){
				navAll.push( tempButton[i] );
			}
		}
		navLen = navAll.length;
	}
	
	o.left = function(){
		if( this.index == 0 )  return false;
		
		this.onBlur();
		this.index--;
		this.onFocus();	
	};
	
	o.right = function(){
		if( this.index == navLen-1 )  return false;
		
		this.onBlur();
		this.index++;
		this.onFocus();	
	};
	
	o.onSelect = function(){
		if( navLen > 2 ){
			// 多集
			switch(this.index){
				case 0:	//播放按钮
					programHandle.history();
					gotoPlay();
				break;
				case 1:	//选集按钮
					openList();
				break;
				case 2:	//收藏按钮
					programHandle.collect();
				break;	
			}
		}else{
			// 单集--没有选集
			switch(this.index){
				case 0:	//播放按钮
					programHandle.history();
					gotoPlay();
				break;
				case 1:	//收藏按钮
					programHandle.collect();
				break;
			}
		}
	};
	
	o.down = function(){
		if( listVisible ){
			if( programCount > 1 ){
				this.onBlur();
				//切换操作区域到节目列表上
				globalObj.setArea( pageArea.programArea ); 
				programHandle.onFocus($("itemList").getElementsByTagName("li"), programHandle.getProgramIndex() );
			}
		}else{
			//切换到推荐节目上
			if( recommendHandle.programArray.length != 0 ){
				this.onBlur();
				globalObj.setArea( pageArea.recommend ); 
				recommendHandle.onFocus();
			}
		}
	};
	
	o.onFocus = function(){		
		navAll[this.index].style.background = 'url(images/mi_icon.png) -170px -85px';
	}
	
	o.onBlur = function(){
		navAll[this.index].style.background = "";
	};
	
	function gotoPlay(){
		var tempInfo = programHandle.getProgramInfo();
		var tempUrl = tempInfo.assetId;

			playUrl.zt_url = tempInfo.assetId ;
			//从cookie中获取视频类型
			var cookieType = getCookie("videoType");
			if( !cookieType ){
					//alert("1111")
				curPlayUrl = playUrl.zt_url;								
			}else{
				curPlayUrl = playUrl[cookieType];
				
			}				
			var vod_subid=parseInt(getCookie("vod_subid"),10)
			if(isNaN(vod_subid)||vod_subid==""){
				vod_subid=1;
			}else{}
			if(programCount == 1){
				var url = tempInfo.assetId;
				window.location.href="../vod/vod_play.html?programId=" + escape(tempInfo.programId)+"&programName=" + escape(tempInfo.programName) +"&playUrl=" + escape(url);
			}else{
				var url = tempInfo.programSub[vod_subid-1].assetId;
				window.location.href="../vod/vod_play.html?programId=" + escape(tempInfo.programId)+"&programName=" + escape(tempInfo.programName)  + "&subId="+vod_subid+"&playUrl=" + escape(url);
			}
		//}
	}
	

	function openList(){
		if( $("moreItem").style.visibility == "hidden" ){
			listVisible = true;
			$("moreItem").style.visibility = "visible";
		}else{
			listVisible = false;
			$("moreItem").style.visibility = "hidden";
		}
	}
	
	return o;
}();

/*获取节目对象*/
var programHandle = function(){
	var programIndex = 0;
	
	var programArray = [];
	var pageInfoObj;
	var programObj;		//获取页面中所有的节目li
	var col = 10;		//定义显示的列数
	var row = 2;		//定义显示的行数
	var type = 0;		//节目类型，0为单集，1为多集。在跳转到详细页时会根据不同类型节目传递不同参数
	var ajaxFlag = false;	// 判断ajax是否成功
	
	var pageButton = false;	//翻页按钮标志
	var buttonIndex = 0;
	var programUrl;
	var programInfo;
	var	pageTotal; 			//总的页数
	var pageNo = 1;			//当前页
	var allLi;				//所有选集li
	var itemAreaFlag = false;
	var itemAreaIndex = 0;	//节目段的索引,itemAreaIndex = pageNo-1
	var	allItemArea;		//选集分段列表
	var listarray = [];
	var historyarray = [];
	var ovtset = new QjyScript();

	var o = new Control(programIndex);
	o.parameter = {
		"index":programIndex,
		"count":programCount
	};
	
	o.left = left;
	o.right = right;
	o.up = up;
	o.down = down;
	o.onFocus = onFocus;
	o.onBlur = onBlur;
	o.pageUp = pageUp;
	o.pageDown = pageDown;
	o.onSelect = onSelect;

	o.init = init;
	o.getProgramIndex  = getProgramIndex;
	o.getProgramId = getProgramId;
	o.getPageNo = getPageNo;
	o.getAjaxFlag = getAjaxFlag;
	o.getProgramInfo = getProgramInfo;
	o.collect = collect;
	o.history = history;
	
	function init(id){
		getData( id );
		allLi = $("itemList").getElementsByTagName("li");
		allItemArea = $("itemArea").getElementsByTagName("li");
		
	}
	
	function left(){
		if(itemAreaFlag){
			if(itemAreaIndex == 0)return false;
			itemAreaIndex--;
			pageNo--;
			onFocus(allItemArea,itemAreaIndex);
			showItemList(programInfo);
			
			//选集列表索引重置为0
			programIndex = 0;
			
		}else{
			if(programIndex%col != 0){//判断是否到达节目区域的左边界
				//onBlur(programIndex);
				programIndex--;
				onFocus(allLi,programIndex);
				
				setProgramIndex(programIndex);
			}else{
				// 向上翻页
				//_setPageUp();
			}
		}
//			try{
//				//旧版本是在左侧就切换到导航区域，现在改为在第一个节目时切换
//				//programIndex%col == 0
//				if(programIndex == 0) {
//					//切换到导航区域区域
//					onBlur(programIndex);
//					globalObj.setArea( pageArea.navArea ); 
//					buttonHandle.onFocus();
//				}else{
//					//if(programIndex == 0){	return false; }
//					onBlur(programIndex);
//					programIndex = programIndex-1;
//					onFocus(programIndex);
//					setProgramIndex(programIndex);
//				}
//			}catch(e){
//				GF_WebPrint(e);
//			}
	}
	
	function right(){
		if( itemAreaFlag ){
			if( itemAreaIndex < pageTotal-1 ){
				itemAreaIndex++;
				pageNo++;
				onFocus(allItemArea,itemAreaIndex);
				showItemList(programInfo);
				
				//选集列表索引重置为0
				programIndex = 0;
			}
		}else{
			var endIndex;
			if(pageNo < pageTotal){
				endIndex = col;
			}else{
				endIndex = programCount - (pageNo-1)*col;	
			}
			
			if( programIndex < endIndex - 1){
				programIndex++;			
				setProgramIndex(programIndex);
				onFocus(allLi,programIndex);
			}
		}
		
//		if( pageButton ){
//			if( (pageInfoObj.pageNo == 1) || (pageInfoObj.pageNo == pageInfoObj.pageCount) ) return false;
//				buttonOff();
//				buttonIndex = buttonIndex > 0? buttonIndex - 1:1;
//				buttonOn();
//			
//		}else{
//			if(	_isLast(programIndex) &&  (parseInt(pageInfoObj.pageNo,10) < parseInt(pageInfoObj.pageCount,10) )){
//				//向下翻页
//				//_setPageDown();
//			}else{
//				if( programIndex  < programCount-1){
//					onBlur(programIndex);
//					programIndex = parseInt(programIndex,10)+1;
//					setProgramIndex(programIndex);
//					onFocus(programIndex);
//				}
//			}
//		}
	}
	
	function up(){
//		if( pageButton ){
//			buttonOff();
//			pageButton = false;
//			onFocus(programIndex);
//		}else{
//			if(programIndex - col >= 0){
//				onBlur(programIndex);
//				programIndex = programIndex-col;
//				onFocus(programIndex);
//				
//				setProgramIndex(programIndex);
//			}else{
				//_setPageUp();
				if( itemAreaFlag ){
					onFocus(allLi,programIndex);
					itemAreaFlag = false;
				}else{
					//切换到导航区域区域
					onBlur(programIndex);
					globalObj.setArea( pageArea.buttonArea );
					buttonHandle.onFocus();
				}
//			}
//		}
	}
	
	function down(){
		if( !itemAreaFlag ){
			itemAreaFlag = true;
			//onBlur(programIndex);
			onFocus(allItemArea,itemAreaIndex);
		}		
	}
	
	function pageUp(){
		//_setPageUp();
	}
	
	function pageDown(){
		//_setPageDown();
	}
	
	function _setPageUp(){
		
		if(parseInt(pageInfoObj.pageNo,10) > 1){//多于1页数据
			onBlur(programIndex);
			getData(buttonHandle.getCategoryId(),parseInt(pageInfoObj.pageNo,10)-1,onFocus);
		}
	}
	
	function _setPageDown(){
		 if(parseInt(pageInfoObj.pageNo,10) < parseInt(pageInfoObj.pageCount,10)){
			onBlur(programIndex);
			getData(buttonHandle.getCategoryId(),parseInt(pageInfoObj.pageNo,10)+1,onFocus);
		}
	}
	
	//判断是否是页面中第一个节目（翻页）
	function _isFirst(programIndex){
		//注释的是这个数据的索引，暂时不采用
		//return programIndex == (parseInt(pageInfoObj.pageNo,10)-1)*(row*col);
		//根据目前接口，采用当前页索引
		return programIndex == 0;
	}
	
	//判断是否是页面中最后一个节目（翻页）
	function _isLast(programIndex){
		//注释的是这个数据的索引，暂时不采用
		//return programIndex == parseInt(pageInfoObj.pageNo,10)*(row*col) -1;
		//根据目前接口，采用当前页索引
		return programIndex == (row*col) -1;
	}
	
	function onSelect(){
			//cookieObj.setCookie(); //增加cookie
			if( !itemAreaFlag ){
				var subId = (pageNo-1)*col+1+programIndex;
				//修改方案，集数太多传递有问题
				playUrl.zt_url = programInfo.programSub;
				//curPlayUrl = playUrl;
				//playUrl.zt_url = transferUrl( programInfo.url );
				//alert(playUrl.zt_url)
				playUrl.zt_url1 = "";
				playUrl.zt_url2 = ""
				//从cookie中获取视频类型
				var cookieType = getCookie("videoType");
				if( !cookieType ){
					curPlayUrl = playUrl.zt_url;								
				}else{
					curPlayUrl = playUrl[cookieType];
					
				}		
				window.location.href="../vod/vod_play.html?programId=" + escape(programInfo.programId)+"&programName=" + escape(programInfo.programName)  + "&subId=" + escape(subId) +  "&playUrl=" + escape(curPlayUrl[subId-1].assetId);
			}
	}
	function onFocus(obj,i){
		try{
			$("itemFocus").style.left = obj[i].offsetLeft+"px ";
			if( allLi == obj ){				
				$("itemFocus").style.top = 90 + obj[i].offsetTop+"px";	
			}else{
				$("itemFocus").style.top = 150 + obj[i].offsetTop+"px";	
			}
			$("itemFocus").style.visibility = 'visible';
		}catch(e){
			GF_WebPrint("onFocus:"+e);
		}
	}
	
	function onBlur(i){
		try{
			$("itemFocus").style.visibility = 'hidden';
		}catch(e){
			GF_WebPrint(e);
		}
	}

	function getData(id,retried){
		try{
			var url =MY_PORTAL_ADDR+"/GetProgramInfo?programId="+id;
			//var url = MY_PORTAL_ADDR+"/GetProgramContents?folderId=1";
			Ajax.request(url,{
				success:function(data){
					if(data.result == "410"){ 
						login(false);
						return ;
					}
					
					if(data.result == "200"){   //获取节目数量，判断是否有节目需要显示
						programInfo = data;
						var proType = programInfo.programType;
						
						if( proType == 1){
							//programUrl = programInfo.programSub; 
							programCount = programInfo.programSub.length;//多集节目
							pageTotal = Math.ceil(programCount / col);
						}else{						
							programUrl = programInfo.assetId;
							programCount = 1; //单集节目
						}
						
						showProgram( programInfo );//显示节目信息
						buttonHandle.setNavObj();
						
						
					}else{
						noProgram(); //没有VOD节目
/*						setTimeout(function(){ 
							window.location = "vod_index.html"; }
							,3000)*/
					}
					ajaxFlag = true;
				},
				failure:function(data){
					if( retried ){
						ajaxFlag = false;
						noProgram(); //没有VOD节目--临时添加
						GF_WebPrint("ajax:get programs failed");
					}else{
						setTimeout( function(){  getData(id,true) },300 );		
					}
				}
			});
		}catch(e){
			ajaxFlag = false;
			GF_WebPrint("获取VOD节目列表："+e);
			noProgram(); //没有VOD节目--临时添加
			setTimeout(function(){ 
				window.location = "vod_index.html"; }
			,3000)
		}
	}
				
	
	function showProgram( obj ){
		try{
			$("nav").innerHTML = '<img src="'+encodeURI( checkStr(obj.image[0].imageUrl) )+'"/>'
			$("programName").textContent = subStr(obj.programName,23);
			$("actors").textContent = subStr(obj.director,23);	
			$("info").textContent = subStr(obj.summaryShor,208);	
			
			if(programCount == 1){
				//一集的时候，隐藏选集按钮
				$("allItem").style.display = "none";
				$("playButton").textContent = "播放";
			}else{
				var vod_subid=parseInt(getCookie("vod_subid"),10);
				if(isNaN(vod_subid)||vod_subid==""){
					vod_subid=1;
				}
				$("playButton").textContent = "第"+vod_subid+"集";
				//显示页面下方选集信息
				$("bottomName").textContent = obj.programName;
				showItemList( obj );
			}			
		}catch(e){
			GF_WebPrint("显示VOD节目列表："+e);
		}
		
		//检测图片地址中是否含有http字符
		function checkStr(str){
			try{
				var picURL;
				
				if( !str ) {
					return nopic;
				}else{
					picURL = MY_PORTAL_ADDR+"/portal/images/"+str;
				}
				
				return picURL;
			}catch(e){
			}
		}
	}
	
	function showItemList(obj){
		var html1 = "";		
		var startNum = (pageNo-1)*col+1;
		var endNum = pageNo*col > programCount ? programCount : pageNo*col;
		
		for(var i = startNum;i <= endNum; i++){
			html1 += '<li>'+i+'</li>'
		}
		
		$("itemList").innerHTML = html1;
		
		var html2 = "";
		for(var j = 1;j<=pageTotal; j++){
			var startValue = (j-1)*col+1;
			var endValue = j*col > programCount ? programCount : j*col;
			html2 += '<li>'+startValue+'-'+endValue+'</li>'
		}		
		$("itemArea").innerHTML = html2;
	}
	
	function noProgram(){
		showSysError("暂无节目,请选其他栏目");
		setTimeout(function(){sysErrorHandle();},1500);
	}
	
	//返回节目名称,单击：name,多集:displayName
	function getName(obj){
			return obj.programName;
	}
	
	function marq(i){
	    name = getName(programArray[i]);
		if(name.length > 5){
			maq($("text"+i),name,15,101);	
		}
	}
	
	function unMarq(i){
		delemaq();
	    name = getName(programArray[i]);
		if(name.length > 5){
			$("text"+i).textContent = subStr(name,5);	
		}
	}
	
	//返回节目id
	function getProgramId(){
		return	programArray[programIndex].id;
	}
	
	//获取节目索引
	function getProgramIndex(){
		return programIndex;
	}
	
	// 获取节目信息
	function getProgramInfo(){
		return programInfo;
	}
	
	//初始化节目索引
	function initProgramIndex(){
		if( isNaN( cookieObj.findCookie( "vod_movieIndex" ) )){
			programIndex = 0;
		}else{
			programIndex =cookieObj.findCookie( "vod_movieIndex" );
			cookieObj.delCookie();
		}	
	}
	
	function setProgramIndex(value){
		o.parameter.index = value;
	}
	
	function setProgramCount(value){
		o.parameter.count = value;
	}
	
	function getPageNo(){
		return parseInt(pageInfoObj.pageNo,10);
	}
	//设置页面提示
	function setPage(pageCount,pageNo){		
		$("page").textContent = pageNo + "/" + pageCount;
		buttonOff();
		buttonInit();		
		
		if( pageNo == 1 ){
			$("page1").style.visibility = "hidden";		
			buttonIndex = 0;
		}else if( pageNo ==  pageCount){
			$("page0").style.visibility = "hidden";			
			buttonIndex = 1;
		}else if(pageNo == pageCount){
			$("page0").style.visibility = "hidden";			
			$("page1").style.visibility = "hidden";	
		}else{
			$("page0").style.visibility = "visible";			
			$("page1").style.visibility = "visible";	
			buttonIndex = 1;
		}
	}
	
	//翻页按钮
	function buttonInit(){
		pageButton = false;
		if( pageInfoObj.totalCount <= row*col ) {
			$("page0").style.visibility = "hidden";			
			$("page1").style.visibility = "hidden";	
			return false;
		}else{
			$("page0").style.visibility = "visible";			
			$("page1").style.visibility = "visible";
		}
	}
	
	function buttonOn(){
		$("page"+buttonIndex).className = "show";
	}
	
	function buttonOff(){
		$("page"+buttonIndex).className = "hide";
	}
	
	function getAjaxFlag(){
		return ajaxFlag;
	}
	
	//收藏
	function collect(){
		var liststr=ovtset.exec("OvtGetInforFromFile","favorite");
		if(!liststr){
			str = '{programId:'+programInfo.programId+',programName:"'+programInfo.programName+'",pic:"'+programInfo.image[0].imageUrl+'"}'
			ovtset.exec("OvtSetInfor2File","favorite",str);
			showSysError("收藏成功");
			setTimeout( function(){ sysErrorHandle(); },2000 )
		}else{
			listarray=liststr.split("|",10);//把一个字符串分割成字符串数组
			var flag = false;
			for(var j = 0;j < listarray.length;j++){
				var curId = strToJson(listarray[j]).programId;
				if( curId == programInfo.programId ){
					flag = true;
				}
			}
			
			if( !flag ){
				str = '{programId:'+programInfo.programId+',programName:"'+programInfo.programName+'",pic:"'+programInfo.image[0].imageUrl+'"}'
				listarray.unshift(str);//添加到数组开始   //可向数组的开头添加一个或更多元素，并返回新的长度。
				var setstr=listarray.join("|");//把数组中的所有元素放入一个字符串
				ovtset.exec("OvtSetInfor2File","favorite",setstr);
				showSysError("收藏成功");
				setTimeout( function(){ sysErrorHandle(); },2000 )
			}else{
				showSysError("已经收藏");
				setTimeout( function(){ sysErrorHandle(); },2000 )
			}
		}
	}

	//历史
	function history(){
		try{
			var sameflag = false;
			var id = programInfo.programId;
			var name = escape(programInfo.programName);
			var timearea = DateAndTime();
			var nameStr = id + "," + name + "," + timearea;
			
			var historystr=ovtset.exec("OvtGetInforFromFile","history");
			historyarray=historystr.split("|",9);//把一个字符串分割成字符串数组
			
			var tmparray = historyarray[0].indexOf(",");
			var idarray = historyarray[0].substring(0,tmparray);
			var firstarray = historyarray[0].indexOf(",");
			if(idarray == id){
				sameflag = true;
			}
			if(sameflag == true) {
				historyarray.splice(0,1)
				historyarray.unshift(nameStr);//添加到数组开始   //可向数组的开头添加一个或更多元素，并返回新的长度。
				if(historyarray.length>9) historyarray.length=9;//长度大于9取9
				var addstr=historyarray.join("|");//把数组中的所有元素放入一个字符串
				ovtset.exec("OvtSetInfor2File","history",addstr);
			}else{
				historyarray.unshift(nameStr);//添加到数组开始   //可向数组的开头添加一个或更多元素，并返回新的长度。
				if(historyarray.length>9) historyarray.length=9;//长度大于9取9
				var addstr=historyarray.join("|");//把数组中的所有元素放入一个字符串
				ovtset.exec("OvtSetInfor2File","history",addstr);
			}
		}catch(e){
			GF_WebPrint("---history--------"+e)
		}
	}
	
	function DateAndTime(){	
		var date = new Date();
		var dateStr = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
		var timeStr = (date.getHours().toString().length == 1  ?  '0' : '') + date.getHours() + ":" + (date.getMinutes().toString().length == 1  ?  '0' : '') + date.getMinutes()+ ":" + (date.getSeconds().toString().length == 1  ?  '0' : '') + date.getSeconds();
		return dateStr+ " " +timeStr; 
	}
	return o;
}();

//推荐节目
var recommendHandle = function(){
			
	var programCount;	//最多10个节目
	var	navAll;
	var o = new Control();
	
	o.init = function(){
		getData();
	}
	o.programArray = [];
	o.left = function(){
		if( this.index == 0 )  return false;
		this.onBlur();
		this.index--;
		this.onFocus();	
	};
	
	o.right = function(){
		if( this.index == programCount-1 )  return false;
		
		this.onBlur();
		this.index++;
		this.onFocus();	
	};
	
	o.up = function(){
		this.onBlur();
//		//切换区域
		globalObj.setArea( pageArea.buttonArea ); 
		buttonHandle.onFocus();
	};
	
	o.onSelect = function(){
		window.location.href = "vod_detail.html?id="+ escape(o.programArray[this.index].programId);
	};
	
	o.onFocus = function(){
		navAll[this.index].style.border = '2px solid #333';
		navAll[this.index].childNodes[0].style.visibility = "visible";
		navAll[this.index].style.width = "126px";
		navAll[this.index].style.height = "183px";
	};
	
	o.onBlur = function(){
		navAll[this.index].style.border = '0';
		navAll[this.index].childNodes[0].style.visibility = "hidden";
		navAll[this.index].style.width = "105px";
		navAll[this.index].style.height = "153px";
		
	};	
	
	function getData(retried){
		try{
			var url = MY_PORTAL_ADDR+"/GetProgramContents?folderId="+moviehotcategoryId;
			Ajax.request(url,{
				success:function(data){
					if(data.result == "200"){    //获取节目数量，判断是否有节目需要显示
						var programLen = data.programList.length; 	
						if( programLen != 0){
							programCount = programLen;
							for(var i = 0;i < programCount;i++){
								o.programArray[i] = data.programList[i];
							}
							showProgram(); //显示VOD节目
							navAll = $("recommend_list").getElementsByTagName("li");
						}
					}else{
						//noProgram(); //没有VOD节目
					}
				},
				failure:function(data){
					if( retried ){
						//noProgram(); //没有VOD节目--临时添加
						GF_WebPrint("ajax:get programs failed");
					}else{
						setTimeout( function(){  getData(true) },300 );		
					}
				}
			});
		}catch(e){
			GF_WebPrint("获取VOD节目列表："+e);
			//noProgram(); //没有VOD节目--临时添加
		}
	}
	
	function showProgram(){
		try{
			var html = "";
		    if( programCount > 9){
				programCount = 9;
			}
			for(var i = 0;i < programCount;i++){
				html += '<li><h2>'+subStr(o.programArray[i].programName,5)+'</h2><img src="'+encodeURI( checkStr(i) )+'"/></li>';			
			}
			
			$("recommend_list").innerHTML = html;
		}catch(e){
			GF_WebPrint("显示VOD节目列表："+e);
		}
		
		//检测图片地址中是否含有http字符
		function checkStr(index){
			try{
				var pic = o.programArray[index].image[0].imageUrl;
/*				if ( pic == "" ){
					 pic = o.programArray[index].image[1].imageUrl;
				}*/
				var picURL;
				
				if( pic == "" ) {
					picURL = MY_PORTAL_ADDR+"/portal/images/nopic.jpg";
				}else{
					picURL = MY_PORTAL_ADDR+"/portal/images/"+pic;
				}
				
				return picURL;
			}catch(e){
			}
		}
	}
	
	return o;
}();

//cookie对象
var cookieObj = function(){
	var o = {};
	var cookieValue = {"vod_menuid":"","menuIndex":"","pageNo":"","vod_movieIndex":""};
	
	o.findCookie = findCookie;
	o.setCookie = setCookie;
	o.getAllCookie = getAllCookie;
	o.delCookie = delCookie;
	
	function setCookie(){
		addCookie( "vod_menuid",buttonHandle.getCategoryId() );
		addCookie( "menuIndex",buttonHandle.index );
		addCookie( "pageNo",programHandle.getPageNo() );
		addCookie( "vod_movieIndex",programHandle.getProgramIndex() ); // 为了返回时能准确定位页面焦点，记录节目索引
		GF_WebPrint("----------------setCookie");
	}
	
	function getAllCookie(){
		cookieValue.vod_menuid = getCookie("vod_menuid");
		cookieValue.menuIndex = getCookie("menuIndex");
		cookieValue.pageNo = getCookie("pageNo");
		cookieValue.vod_movieIndex = getCookie("vod_movieIndex");
		GF_WebPrint("----------------getAllCookie");

	}
	
	function delCookie(){
		GF_WebPrint("----------------delCookie");
		deleteCookie("vod_menuid");
		deleteCookie("menuIndex");
		deleteCookie("pageNo");
		deleteCookie("vod_movieIndex");
		
		getAllCookie();
	}
	
	function findCookie(cookieName){
		return parseInt( cookieValue[cookieName],10);
	}
	
	return o;
}();

//功能下按钮（右上）
//var smallButton = function(){	
//	var liObj = [];	//所有小按钮的集合
//	var data = [{"name":"搜索","url":"search.html"},
//				{"name":"收藏","url":"favorite.html"},
//				{"name":"历史","url":"history.html"}
//				];
//	
//	var o = new Control();
//	
//	o.init= function(){
//		liObj = $("small_button").getElementsByTagName("li");	
//	};
//	
//	o.left = function(){
//		if( this.index == 0 ){
//			this.onBlur();
//			globalObj.setArea( pageArea.navArea ); 	
//			buttonHandle.onFocus();	
//		}else{		
//			changeClass("left");
//		}
//		
//
//	};
//	
//	o.right = function(){
//		if( this.index == liObj.length-1 ) return false;
//		changeClass("right");
//	};
//	
//	o.down = function(){
//		liObj[this.index].className = "";
//		globalObj.setArea( pageArea.programArea ); 
//		programHandle.onFocus( programHandle.getProgramIndex() );
//
//	};
//	
//	o.onSelect = function(){
//		var url = data[this.index].url;
//		window.location.href = data[this.index].url;
//	};
//	
//	o.onFocus = function(){
//		liObj[this.index].className = "onfocus";
//	};
//	
//	o.onBlur = function(){
//		liObj[this.index].className = "";
//	};
//	
//	function changeClass(key){
//		o.onBlur();
//		if( key == "left" ){
//			o.index--;
//		}else if( key == "right" ){
//			o.index++;
//		}
//		o.onFocus();
//	}
//	
//	return o;
//}();

/*页面控制区域*/
//programArea:选集列表
//recommend:推荐节目
var pageArea = {"buttonArea":0,"programArea":1,"recommend":2};

//全局控制对象
var globalObj = function(){
	try{
		var localArea;
		var control = [buttonHandle,programHandle,recommendHandle];
		var o = {};
		o.setArea = function(area){
			localArea = area;
		};
		o.handle = function(){
			return control[localArea];
		};
	
		return o;
	}catch(e){
		GF_WebPrint("globalObj:"+e);
	}
}();

document.onkeypress = grabEvent;
function grabEvent(event){
	try{
	var val = event.keyCode | event.which;
	switch(val){
		case ROC_IRKEY_LEFT:
		case 37: //left
			globalObj.handle().left();
		break;
		case ROC_IRKEY_RIGHT:
		case 39: //right
			globalObj.handle().right();
		break;
		case ROC_IRKEY_UP:	
		case 38: //up
			globalObj.handle().up();
		break;
		case ROC_IRKEY_DOWN:		
		case 40: //down
			globalObj.handle().down();
		break;
		case ROC_IRKEY_SELECT:		
		case 13:
			globalObj.handle().onSelect();
		break;
		case ROC_IRKEY_PAGE_UP:		
		case 33:
			globalObj.handle().pageUp();
		break;
		case ROC_IRKEY_PAGE_DOWN:		
		case 34:
			globalObj.handle().pageDown();
		break;
		case ROC_IRKEY_BACK:		
		case ROC_IRKEY_EXIT:
		case 8:
			//cookieObj.delCookie();
			deleteCookie("vod_subid");
			goBack();
		break;
		case POC_IRKEY_INDEX:
			deleteCookie("vod_subid");;
		 	 break;
		}
	}catch(e){
		GF_WebPrint("keyPress--"+e);
	}
}

function initPage(){
	try{
		//showTime()
		programHandle.init( programId );
//		cookieObj.getAllCookie();
//		if( isNaN(cookieObj.findCookie( "vod_menuid" ) ) ){
//			globalObj.setArea( pageArea.navArea );
//		}else{
//			globalObj.setArea( pageArea.programArea );
//		}
//		
	globalObj.setArea( pageArea.buttonArea );
	recommendHandle.init();
	}catch(e){ 
		GF_WebPrint("page loading--"+e);
	}
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
				var dataResult = data.result;
				if(dataResult == "200"){
					initPage();
				}else{							
					if( retried ){
						//$("ch_content").innerHTML="";	
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
window.onload = initPage;
