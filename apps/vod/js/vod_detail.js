var programId = unescape($G.getParameter("id"));//通过url传递节目id

function showTime(){	
    var date = new Date();
	var time_box = $("timer");
	var timeStr = (date.getHours().toString().length == 1  ?  '0' : '') + date.getHours() + ":" + (date.getMinutes().toString().length == 1  ?  '0' : '') + date.getMinutes();
	time_box.innerHTML = timeStr;
	setTimeout('showTime()',60000);	 
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
/*		if( !isNaN(cookieObj.findCookie( "menuIndex" ) ) ){
			  navObj.style.top = cookieObj.findCookie( "menuIndex" )*75 + "px";
			  vtop = cookieObj.findCookie( "menuIndex" )*75; //滑动初始位置
			  this.index = cookieObj.findCookie( "menuIndex" );
			  navAll[this.index].className = "curMenu";
			  //alert(this.index);
		}else{
			navAll[this.index].className = "curfocus";
		}*/		
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
		this.onBlur();
		if( listVisible ){
			//切换操作区域到节目列表上
			globalObj.setArea( pageArea.programArea ); 
			programHandle.onFocus($("itemList").getElementsByTagName("li"), programHandle.getProgramIndex() );
		}else{
			//切换到推荐节目上
			globalObj.setArea( pageArea.recommend ); 
			recommendHandle.onFocus();
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
		var tempUrl = tempInfo.url;
		if( tempUrl.indexOf( '\r\n' ) == -1 ){
			window.location.href="../vod/vod_play.html?programName=" + escape(tempInfo.name) +  "&playUrl=" + escape(tempUrl) +"&programId=" + escape(tempInfo.id);	
		}else{		
			window.location.href="../vod/vod_play.html?programName=" + escape(tempInfo.name)  + "&subId=1&playUrl=" + escape(tempUrl) +"&programId=" + escape(tempInfo.id);
		}
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
	var programCount = 0;
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
		//programObj = $("programList").getElementsByTagName("li");
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
		_setPageUp();
	}
	
	function pageDown(){
		_setPageDown();
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
				window.location.href="../vod/vod_play.html?programName=" + escape(programInfo.name)  + "&subId=" + escape(subId) +  "&playUrl=" + escape(programInfo.url) +"&programId=" + escape(programInfo.id);
			}
	}
	function onFocus(obj,i){
		try{
			$("itemFocus").style.left = obj[i].offsetLeft+"px ";
			if( allLi == obj ){				
				$("itemFocus").style.top = 97 + obj[i].offsetTop+"px";	
			}else{
				$("itemFocus").style.top = 167 + obj[i].offsetTop+"px";	
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
//注释掉的是节目列表的逻辑	
//	function getData(id,page,func,retried){
//		try{
//			var url =MY_PORTAL_ADDR+"/GetFolderContents?id=" + id + "&startAt="+ page +"&maxItems="+row*col;
//			Ajax.request(url,{
//				success:function(data){
//					initProgramIndex();//初始化节目索引
//					pageInfoObj = data;
//					//pageInfoObj = strToJson(data[0].restartAtToken);//data[0].restartAtToken返回的是字符串格式，需要转换
//					setProgramCount(data.totalCount)//设置对外接口的节目数量
//					setPage(data.pageCount,data.pageNo);
//					
//					if(data.totalCount == 0){    //获取节目数量，判断是否有节目需要显示
//						noProgram(); //没有VOD节目
//					}else{
//						var programLen = data.ItemsContents.length; 	//单集数量
//						if(programLen>0){
//							//单集的处理
//							type = 0;
//							programCount = programLen;
//							for(var i = 0;i < programCount;i++){
//								programArray[i] = data.ItemsContents[i];
//							}
//							
//							showProgram(); //显示VOD节目
//							if(func)func(programIndex);	//用来设置焦点
//						}else{
//							//多集的处理
//							type = 1;
//							programCount = data[0].categorys.length;	//多集数量
//							for(var i = 0;i < programCount;i++){
//								programArray[i] = data[0].categorys[i];
//							}
//							
//							showProgram(); 
//							
//							if(func)func(programIndex);
//						}
//					}
//					ajaxFlag = true;
//				},
//				failure:function(data){
//					if( retried ){
//						ajaxFlag = false;
//						noProgram(); //没有VOD节目--临时添加
//						GF_WebPrint("ajax:get programs failed");
//						globalObj.setArea( pageArea.navArea );
//					}else{
//						setTimeout( function(){  getData(id,page,onFocus,true) },300 );		
//					}
//				}
//			});
//		}catch(e){
//			ajaxFlag = false;
//			GF_WebPrint("获取VOD节目列表："+e);
//			globalObj.setArea( pageArea.navArea );
//			noProgram(); //没有VOD节目--临时添加
//		}
//	}
	function getData(id,retried){
		try{
			var url =MY_PORTAL_ADDR+"/GetVodData?id=" + id;
			Ajax.request(url,{
				success:function(data){
					//initProgramIndex();//初始化节目索引
					//pageInfoObj = data;
					//pageInfoObj = strToJson(data[0].restartAtToken);//data[0].restartAtToken返回的是字符串格式，需要转换
					//setProgramCount(data.totalCount)//设置对外接口的节目数量
					//setPage(data.pageCount,data.pageNo);
					if(data.totalCount == 0){    //获取节目数量，判断是否有节目需要显示
						noProgram(); //没有VOD节目
						setTimeout(function(){ 
							window.location = "vod_program_list.html"; }
							,3000)
					}else{
						programInfo = data.ItemsContents[0];
						var tempUrl = programInfo.url;
						
						if( tempUrl.indexOf('\r\n') != -1){
							programUrl = tempUrl.split('\r\n'); //多集节目
							programCount = programUrl.length;
							pageTotal = Math.ceil(programCount / col);
						}else{						
							programUrl = tempUrl;
							programCount = 1; //单集节目
						}
						
						showProgram( programInfo );//显示节目信息
						buttonHandle.setNavObj();
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
				window.location = "vod_program_list.html"; }
			,3000)
		}
	}
	
	function showProgram( obj ){
		try{
			$("programPic").src = encodeURI( checkStr(obj.pic) );
			$("programName").textContent = obj.name;
			$("actors").textContent = obj.actors;	
			$("info").textContent = subStr(obj.info,208);	
			
			if(programCount == 1){
				//一集的时候，隐藏选集按钮
				$("allItem").style.display = "none";
				$("playButton").textContent = "播放";
			}else{
				$("playButton").textContent = "第1集";
				//显示页面下方选集信息
				$("bottomName").textContent = obj.name;
				showItemList( obj );
			}			
		}catch(e){
			GF_WebPrint("显示VOD节目列表："+e);
		}
		
		//检测图片地址中是否含有http字符
		function checkStr(str){
			var picURL;
			
			if( !str ) {
				return nopic;
			}else if(str.indexOf( "http" ) == -1){
				picURL = "http://web.mmbtv.com" + str;
			}else{
				picURL = str;
			}
			
			return picURL;
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
/*		for(var i = 0;i < row*col;i++){
			$("tutu"+i).innerHTML = "";
			$("text"+i).textContent = "";
		}*/
		showSysError("暂无节目,请选其他栏目");
		setTimeout(function(){sysErrorHandle();},1500);
	}
	
	//返回节目名称,单击：name,多集:displayName
	function getName(obj){
		//if(type == 0){
			return obj.name;
		//}else if(type == 1){
		//	return obj.displayName;
		//}
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
		//GF_WebPrint( "vod_movieIndex-------"+cookieObj.findCookie( "vod_movieIndex" ) );
		if( isNaN( cookieObj.findCookie( "vod_movieIndex" ) )){
			programIndex = 0;
		}else{
			programIndex =cookieObj.findCookie( "vod_movieIndex" );
			cookieObj.delCookie();
		}
		//GF_WebPrint( "programIndex------------"+programIndex );		
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
/*		var page = pageInfoObj.pageNo;
		var pageCount = pageInfoObj.totalPages;
		var prePage = pageInfoObj.prePage;
		
		if(pageCount < 1){
			page = pageCount = 0;
			$("arrowup").className = "";
			$("arrowdown").className = "";
		}else if(page == pageCount){
			$("arrowup").className = "";
			$("arrowdown").className = "";
		}else if(page < pageCount){
			$("arrowup").className = "";
			$("arrowdown").className = "on";
		}else if(prePage < page && page == pageCount){
			$("arrowup").className = "on";
			$("arrowdown").className = "";
		}else if(prePage <page && page < pageCount){
			$("arrowup").className = "on";
			$("arrowdown").className = "on";
		}
*/		
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
			str = '{programId:'+programInfo.id+',programName:"'+programInfo.name+'",pic:"'+programInfo.pic+'"}'
			ovtset.exec("OvtSetInfor2File","favorite",str);
			showSysError("收藏成功");
			setTimeout( function(){ sysErrorHandle(); },2000 )
		}else{
			listarray=liststr.split("|",10);//把一个字符串分割成字符串数组
			var flag = false;
			for(var j=0;j<listarray.length;j++){
				var curId = strToJson(listarray[j]).programId;
				if( curId == programInfo.id ){
					flag = true;
				}
			}
			
			if( !flag ){
				str = '{programId:'+programInfo.id+',programName:"'+programInfo.name+'",pic:"'+programInfo.pic+'"}'
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
			var id = programInfo.id;
			var name = escape(programInfo.name);
			var timearea = DateAndTime();
			var nameStr = id + "," + name + "," + timearea;
			
			var historystr=ovtset.exec("OvtGetInforFromFile","history");
			historyarray=historystr.split("|",9);//把一个字符串分割成字符串数组
			
			var tmparray = historyarray[0].indexOf(",");
			var idarray = historyarray[0].substring(0,tmparray);
//			var strtmp = idname.indexOf(",");
//			var idtmp = idname.substring(0,strtmp);
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
	var programArray = [];		
	var programCount;	//最多10个节目
	var	navAll;
	var o = new Control();
	
	o.init = function(){
		getData();
	}
	
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
		window.location.href = "vod_detail.html?id="+ escape(programArray[this.index].id);
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
			http://127.0.0.1/GetVodContents?id=1&startAt=1&maxItems=10&area=&category=&year=
			//var url =MY_PORTAL_ADDR+"/GetFolderContents?id=28&startAt=1&maxItems=9";
			var url = MY_PORTAL_ADDR+"/GetVodContents?id=1&startAt=1&maxItems=9&area=&category=&year=";
			Ajax.request(url,{
				success:function(data){
					if(data.totalCount == 0){    //获取节目数量，判断是否有节目需要显示
						//noProgram(); //没有VOD节目
					}else{
						var programLen = data.ItemsContents.length; 	
							programCount = programLen;
							for(var i = 0;i < programCount;i++){
								programArray[i] = data.ItemsContents[i];
							}
							showProgram(); //显示VOD节目
							navAll = $("recommend_list").getElementsByTagName("li");
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
		
			for(var i = 0;i < programCount;i++){
				html += '<li><h2>'+subStr(programArray[i].name,5)+'</h2><img src="'+encodeURI( checkStr(i) )+'"/></li>';			
			}
			
			$("recommend_list").innerHTML = html;
		}catch(e){
			GF_WebPrint("显示VOD节目列表："+e);
		}
		
		//检测图片地址中是否含有http字符
		function checkStr(index){
			var pic = programArray[index].pic;
			var picURL;
			
			if( !pic ) {
				return nopic;
			}else if(pic.indexOf( "http" ) == -1){
				picURL = "http://web.mmbtv.com" + pic;
			}else{
				picURL = pic;
			}
			
			return picURL;
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
			//window.location = "vod_program_list.html";
			goBack();
		break;
		case 1285:
			//goBack();
			//cookieObj.delCookie();
			window.location = "../index/index.html";
		break;
		}
	}catch(e){
		GF_WebPrint("keyPress--"+e);
	}
}

function initPage(){
	try{
		showTime()
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

window.onload = initPage;
