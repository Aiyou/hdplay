var getUrlPara = {"name":unescape($G.getParameter("name")),
				  "id":$G.getParameter("id")
				  };
/*节目对象*/
var programHandle = function(){
	var programIndex = 0;
	var programCount = 0;
	var programArray = [];
	var pageInfoObj;
	var programObj;		//获取页面中所有的节目li
	var col = 5;		//定义显示的列数
	var row = 2;		//定义显示的行数
	var type = 0;		//节目类型，0为单集，1为多集。在跳转到详细页时会根据不同类型节目传递不同参数
	var ajaxFlag = false;	// 判断ajax是否成功
	var favoriteProgram = []	//收藏的节目
	
	var pageButton = false;	//翻页按钮标志
	var buttonIndex = 0;
	
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
	o.getFavorite = getFavorite;
	
	function init(id,page,func){
		programObj = $("programList").getElementsByTagName("li");
		getData(id,page,func);
	}
	
	function left(){
		if(programIndex == 0){	return false; }
		onBlur(programIndex);
		programIndex = programIndex-1;
		onFocus(programIndex);
		setProgramIndex(programIndex);
	}
	
	function right(){
		if( programIndex  < programCount-1){
			onBlur(programIndex);
			programIndex = parseInt(programIndex,10)+1;
			setProgramIndex(programIndex);
			onFocus(programIndex);
		}
	}
	
	function up(){
		if(programIndex - col >= 0){
			onBlur(programIndex);
			programIndex = programIndex-col;
			onFocus(programIndex);
			
			setProgramIndex(programIndex);
		}else{
			pageUp();
		}
	}
	
	function down(){
		if(programIndex + col <= programCount - 1){
			onBlur(programIndex);
			programIndex = programIndex+col;
			onFocus(programIndex);
			
			setProgramIndex(programIndex);
		}else{
			pageDown();
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
			getData(getUrlPara.id,parseInt(pageInfoObj.pageNo,10)-1,onFocus);
		}
	}
	
	function _setPageDown(){
		 if(parseInt(pageInfoObj.pageNo,10) < parseInt(pageInfoObj.pageCount,10)){
			onBlur(programIndex);
			getData(getUrlPara.id,parseInt(pageInfoObj.pageNo,10)+1,onFocus);
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
		if( getUrlPara.id ){
			window.location.href = "vod_detail.html?id="+ escape(programArray[programIndex].id);	
		}else{
			window.location.href = "vod_detail.html?id="+ escape(favoriteProgram[programIndex].programId);
		}	
	}
	
	function onFocus(i){
		try{
			programObj[i].className = "curProgram";
			$("programFocus").style.left = (13+(i%col)*180)+"px ";
			$("programFocus").style.top = (-6+Math.floor(i/col)*267)+"px";
			$("programFocus").style.visibility = 'visible';
			marq(i);		
		}catch(e){
			GF_WebPrint(e);
		}
	}
	
	function onBlur(i){
		try{
			programObj[i].className = "";
			$("programFocus").style.visibility = 'hidden'
			
			unMarq(i);	
		}catch(e){
			GF_WebPrint(e);
		}
	}
	
	function getFavorite(){
		var ovtset = new QjyScript();
		//返回的数据格式
		//programId=1,programName="画皮"，pic=""|programId=1,programName="画皮"，pic=""
		var tempStr = ovtset.exec("OvtGetInforFromFile","favorite");
		//var tempStr = '{programId:1212,programName:"画1皮",pic:""}|{programId:1,programName:"画2皮",pic:""}|{programId:1,programName:"画3皮",pic:""}|{programId:1,programName:"画4皮",pic:""}|{programId:1,programName:"画1皮",pic:""}|{programId:1,programName:"画2皮                                                                              ",pic:""}|{programId:1,programName:"画3皮",pic:""}|{programId:1,programName:"画4皮",pic:""}|{programId:1,programName:"画1皮",pic:""}|{programId:1,programName:"画2皮",pic:""}|{programId:1212,programName:"画1皮",pic:""}|{programId:1212,programName:"画1皮",pic:""}|{programId:1212,programName:"画1皮",pic:""}|';
		if( !tempStr ){
			noProgram();
			return false;
		}
		var tempArray = tempStr.split("|",10);
		for( var i = 0,len = tempArray.length;i < len ;i++ ){
			favoriteProgram.push( strToJson( tempArray[i] ) );
		}		        
		programCount = favoriteProgram.length;
		showProgram( favoriteProgram ,"programName")
		
		programObj = $("programList").getElementsByTagName("li");
		onFocus( programIndex );
	}

	
	function getData(id,page,func,retried){
		try{
			//var url =MY_PORTAL_ADDR+"/GetFolderContents?id=" + id + "&startAt="+ page +"&maxItems="+row*col;
			var url = MY_PORTAL_ADDR+"/GetVodContents?id=" + id + "&startAt="+ page +"&maxItems="+row*col+"&area=&category=&year=";
			
			Ajax.request(url,{
				success:function(data){
					initProgramIndex();//初始化节目索引
					pageInfoObj = data;
					//pageInfoObj = strToJson(data[0].restartAtToken);//data[0].restartAtToken返回的是字符串格式，需要转换
					setProgramCount(data.totalCount)//设置对外接口的节目数量
					setPage(data.pageCount,data.pageNo);
					
					if(data.totalCount == 0){    //获取节目数量，判断是否有节目需要显示
						noProgram(); //没有VOD节目
					}else{
						var programLen = data.ItemsContents.length; 	//单集数量
						if(programLen>0){
							//单集的处理
							type = 0;
							programCount = programLen;
							for(var i = 0;i < programCount;i++){
								programArray[i] = data.ItemsContents[i];
							}
							
							showProgram( programArray,"name" ); //显示VOD节目
							onFocus( programIndex );	//用来设置焦点
						}else{
							//多集的处理
							type = 1;
							programCount = data[0].categorys.length;	//多集数量
							for(var i = 0;i < programCount;i++){
								programArray[i] = data[0].categorys[i];
							}
							
							showProgram( programArray ,"name"); 							
							onFocus( programIndex );
						}
					}
					ajaxFlag = true;
				},
				failure:function(data){
					if( retried ){
						ajaxFlag = false;
						noProgram(); //没有VOD节目--临时添加
						GF_WebPrint("ajax:get programs failed");
						globalObj.setArea( pageArea.navArea );
					}else{
						setTimeout( function(){  getData(id,page,onFocus,true) },300 );		
					}
				}
			});
		}catch(e){
			ajaxFlag = false;
			GF_WebPrint("获取VOD节目列表："+e);
			globalObj.setArea( pageArea.navArea );
			noProgram(); //没有VOD节目--临时添加
		}
	}
	
	function showProgram(programObj,nameStr){
		try{
			for(var i = 0;i < programCount;i++){
				$("tutu"+i).innerHTML = "<img src='" + encodeURI( checkStr(i) ) + "'/>";
				$("tutu"+i).setAttribute("class","mepg");
				$("text"+i).textContent =subStr( programObj[i][nameStr] ,5);	
			}
			
			//如果获取的节目数小于10个，就把没有的设置为空（在翻页的时候用）
			if(programCount < row*col){
				
				for(var i=programCount; i<row*col;i++){
					$("tutu"+i).textContent = "";
					$("text"+i).textContent = ""
				}
			}
			
		}catch(e){
			GF_WebPrint("显示VOD节目列表："+e);
		}
		
		//检测图片地址中是否含有http字符
		function checkStr(index){
			var url = programObj[index].pic;
			if( url == ""){
				url = MY_PORTAL_ADDR+"/portal/images/nopic.jpg";
			}else{
				url = MY_PORTAL_ADDR+"/portal/images/"+url;
			}
			return url;
		}
	}
	
	function noProgram(){
		for(var i = 0;i < row*col;i++){
			$("tutu"+i).innerHTML = "";
			$("text"+i).textContent = "";
		}
		showSysError("暂无节目");
		setTimeout(function(){
			window.location = "../index/index.html";	
		},1500);
	}
	
	//返回节目名称,单击：name,多集:displayName
	function getName(obj){
			return obj.name;
	}
	
	function marq(i){
		var name;
		if( favoriteProgram[i] ){
			name = favoriteProgram[i].programName;
		}else{
			name = programArray[i].name;		
		}
		
		if(name.length > 6){
			maq($("text"+i),name,15,101);	
		}
	}
	
	function unMarq(i){
		delemaq();
		
		if( favoriteProgram[i] ){
			name = favoriteProgram[i].programName;
		}else{
			name = programArray[i].name;		
		}
		
		if(name.length > 6){
			$("text"+i).textContent = subStr(name,6);	
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
	
	//初始化节目索引
	function initProgramIndex(){
			programIndex = 0;	
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
	
	
	return o;
}();




document.onkeypress = grabEvent;
function grabEvent(event){
	try{
	var val = event.keyCode | event.which;
	switch(val){
		case ROC_IRKEY_LEFT:
		case 37: //left
			programHandle.left();
		break;
		case ROC_IRKEY_RIGHT:
		case 39: //right
			programHandle.right();
		break;
		case ROC_IRKEY_UP:	
		case 38: //up
			programHandle.up();
		break;
		case ROC_IRKEY_DOWN:		
		case 40: //down
			programHandle.down();
		break;
		case ROC_IRKEY_SELECT:		
		case 13:
			programHandle.onSelect();
		break;
/*		case ROC_IRKEY_PAGE_UP:		
		case 33:
			programHandle.pageUp();
		break;
		case ROC_IRKEY_PAGE_DOWN:		
		case 34:
			programHandle.pageDown();
		break;*/
		case ROC_IRKEY_BACK:		
		case 8:
			window.location = "../index/index.html";
		break;
		case ROC_IRKEY_EXIT:
		case 1285:
			window.location = "../index/index.html";
		break;
		}
	}catch(e){
		GF_WebPrint("keyPress--"+e);
	}
}


function initPage(){
	try{
		if( getUrlPara.id ){
			$("itemTitle").textContent = getUrlPara.name;			
			programHandle.init(getUrlPara.id,1);	
		}else{
			$("itemTitle").textContent = "我的收藏";
			programHandle.getFavorite();
		}
	}catch(e){ 
		GF_WebPrint("page loading--"+e);
	}
}

window.onload = initPage;
