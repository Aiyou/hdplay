

/*页面控制区域*/
var pageArea = {"navArea":0,"programArea":1};

/*导航控制*/
var navHandle = function(){
	var navObj;		//导航对象--改为焦点对象
	var navTimer; 	//快速切换栏目时，在停止按键后再获取数据
	var navData;	//保存前端返回的数据
	var navLen;
	var item;
	var timeid=0;
	var o = new Control();
	o.timeid=0;
	
	o.setNavObj = function(){
		
		//navObj = $("nav").getElementsByTagName("li");
		navObj = $("nav_focus");
		getNavData();
	}
	
	o.left = function(){
		//this.onBlur();
		if(this.index == 0) return false;
		this.index = this.index > 0 ? this.index-1 : 0;
		
		this.onFocus(-1);
		//changeProgram();
	};
	
	o.right = function(){
		//this.onBlur();
		if(this.index == navLen - 1) return false;
		this.index = this.index < navLen - 1 ? this.index+1 : navLen - 1;
		
		this.onFocus(1);	
		//changeProgram();
	};
	
	o.down = function(){
		//切换区域
		globalObj.setArea( pageArea.programArea ); 
		programHandle.onFocus( programHandle.getProgramIndex() );
	};
	
	o.onFocus = function(dir){
		var navObjLeft = navObj.style.left;
		var index=this.index;
		if( navObjLeft == '' ){//第一次取不到left值
			 navObjLeft = 0;
		}else{
			navObjLeft = parseInt(navObj.style.left,10);
		}
		//navObj.style.left = this.index*165 + "px";
		//var distance = this.index*165;
		if(timeid!=0){
			//$("debug").innerHTML+="关"+"++<br>";
			clearInterval(timeid);
		}
		//$("debug").innerHTML+=index+"++<br>";
		timeid=setInterval(function(){
		//$("debug").innerHTML+=index+"++<br>";	
		  if(dir == 1){
			  navObjLeft+=16.6;
			  	if( parseInt(navObjLeft,10)>(index)*166){
						//$("debug").innerHTML+=navObj.style.left+"++<br>";
			  			clearInterval(timeid);
						timeid=0;
						changeProgram();
						return false;
		  			}
					if(parseInt(navObjLeft,10)>810){
							//navObjLeft=830;
					}
				  navObj.style.left = parseInt(navObjLeft,10)+ "px";
			  }
			  else if(dir == -1){
				  navObjLeft-=18;
				  if( parseInt(navObjLeft,10)<index*166){
						//$("debug").innerHTML+=navObj.style.left+"--<br>";
			  			clearInterval(timeid);
						changeProgram();
						timeid=0;
						return false;
		  			}
					if(parseInt(navObjLeft,10)<16){
							navObjLeft=0;
					}
				  navObj.style.left = parseInt(navObjLeft,10) + "px";
				  //$("debug").innerHTML=navObj.style.left+"--<br>";
		  }
	  //$("debug").innerHTML+=navObj.style.left+"--<br>";
	},20);
		//navObj[this.index].src = 'images/nav_'+this.index+'_1.png';
	};
	

	o.onBlur = function(){
		navObj[this.index].src = 'images/nav_'+this.index+'.png';
	};
	
		//查找目录ID
	o.getCategoryId = function(){
		return navData.FolderContents[this.index].id;
	}

	
	function changeProgram(){
		programHandle.init(navData.FolderContents[o.index].id,1);
		
		if( navTimer ){
			clearTimeout( navTimer );
			navTimer=null;
		}
		navTimer = setTimeout(function(){
			programHandle.init(navData.FolderContents[o.index].id,1);	
		},10)
		
	}
	
	//获取根目录
	function getNavData(){
		navData = {
    "totalCount": "8",
    "FolderContents": [
        {
            "id": "28",
            "name_en": "dyjc",
            "name": "电影剧场"
        },
        {
            "id": "29",
            "name_en": "dsjc",
            "name": "电视剧场"
        },
        {
            "id": "32",
            "name_en": "sedy",
            "name": "少儿动漫"
        },
        {
            "id": "36",
            "name_en": "zybk",
            "name": "综艺百科"
        },
        {
            "id": "34",
            "name_en": "yyzq",
            "name": "粤语专区"
        },
		{
            "id": "31",
            "name_en": "omjc",
            "name": "欧美剧场"
        }
    ],
    "type": "Folder"
};
		navLen = navData.totalCount > 6 ? 6 : navData.totalCount;
		programHandle.init(navData.FolderContents[o.index].id,1);
		/*
		var url = MY_PORTAL_ADDR+'/GetRootContents';
		Ajax.request(url,{
			success:function(data){
				navData = data;
				navLen = navData.totalCount > 6 ? 6 : navData.totalCount;
					
			},
			failure:function(data){
				
			}
		});
		*/
	}
	
	return o;
	
}();

/*右侧节目对象*/
var programHandle = function(){
	var programIndex = 0;
	var programCount = 0;
	var programArray = [];
	var pageInfoObj;
	var col = 6;		//定义显示的列数
	var row = 2;		//定义显示的行数
	var type = 0;		//节目类型，0为单集，1为多集。在跳转到详细页时会根据不同类型节目传递不同参数
	
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
	
	function init(id,page){
		getData(id,page);
	}
	
	function left(){
//		onBlur(programIndex);
//		if(programIndex%col != 0){//判断是否到达节目区域的左边界
//			programIndex--;
//			onFocus(programIndex);
//			
//			setProgramIndex(programIndex);
//		}else{
//			// 向上翻页
//			_setPageUp();
//		}
		if( _isFirst(programIndex)  && (parseInt(pageInfoObj.pageNo,10) > 1) ) {
			// 向上翻页
			_setPageUp();
		}else{
			
			if(programIndex == 0){	return false; }
			onBlur(programIndex);
			programIndex--;
			onFocus(programIndex);
			
			setProgramIndex(programIndex);
		}
	}
	
	function right(){
//		onBlur(programIndex);
//		
//		if(programIndex < programCount-1){
//			programIndex++;
//			
//			setProgramIndex(programIndex);
//		}
//		onFocus(programIndex);

		if(	_isLast(programIndex) &&  (parseInt(pageInfoObj.pageNo,10) < parseInt(pageInfoObj.pageCount,10) )){
			//向下翻页
			_setPageDown();
		}else{
			if( programIndex  < programCount-1){
				onBlur(programIndex);
				programIndex++;
				setProgramIndex(programIndex);
				onFocus(programIndex);
			}
		}
	}
	
	function up(){
		if(programIndex - col >= 0){
			onBlur(programIndex);
			programIndex = programIndex-col;
			onFocus(programIndex);
			
			setProgramIndex(programIndex);
		}else{
			//_setPageUp();
			//切换到导航区域区域
			onBlur(programIndex);
			globalObj.setArea( pageArea.navArea ); 
		}
	}
	
	function down(){
		if(programIndex + col <= programCount - 1){
			onBlur(programIndex);
			programIndex = programIndex+col;
			onFocus(programIndex);
			
			setProgramIndex(programIndex);
		}else{
			_setPageDown();
			
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
			getData(navHandle.getCategoryId(),parseInt(pageInfoObj.pageNo,10)-1,onFocus);
		}
	}
	
	function _setPageDown(){
		 if(parseInt(pageInfoObj.pageNo,10) < parseInt(pageInfoObj.pageCount,10)){
			onBlur(programIndex);
			getData(navHandle.getCategoryId(),parseInt(pageInfoObj.pageNo,10)+1,onFocus);
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
		//setCookie();//保存栏目和节目索引，页面号，焦点区域
		
		//电视剧暂时采用id为29来区分
		if( programArray[programIndex].type == 29 ){
			window.location.href = "vod_tele_detail.html?id="+ escape(programArray[programIndex].id);
		} else{
			window.location.href = "vod_detail.html?id="+ escape(programArray[programIndex].id);
		}
		
		
/*		if(type == 0){//单集
			window.location.href = "vod_detail.html?id="+ escape(programArray[programIndex].id);
		}else if(type == 1){//多集
			window.location.href = "vod_tele_detail.html?categoryId="+ escape(programArray[programIndex].categoryId)
									+ "&name=" + escape(programArray[programIndex].displayName) +"&profile=2";
		}
*/	}
	
	function onFocus(i){
		//$("tutu"+i).childNodes[0].setAttribute("width","138");
		//$("tutu"+i).childNodes[0].setAttribute("height","192");
		$("programFocus").style.left = (37+(i%col)*159)+"px ";
		$("programFocus").style.top = (10+Math.floor(i/col)*195)+"px";
		$("programFocus").style.visibility = 'visible';
		marq(i);		
	}
	
	function onBlur(i){
		//$("tutu"+i).childNodes[0].setAttribute("width","110");
		//$("tutu"+i).childNodes[0].setAttribute("height","160");
		//$("programFocus").style.top = "1280px ";
		//$("programFocus").style.left = "720px";
		$("programFocus").style.visibility = 'hidden'
		
		unMarq(i);	
	}
	
	function getData(id,page,func){
		try{
			var url =MY_PORTAL_ADDR+"/GetFolderContents?id=" + id + "&startAt="+ page +"&maxItems="+row*col;
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
							
							showProgram(); //显示VOD节目
							if(func)func(programIndex);	//用来设置焦点
						}else{
							//多集的处理
							type = 1;
							programCount = data[0].categorys.length;	//多集数量
							for(var i = 0;i < programCount;i++){
								programArray[i] = data[0].categorys[i];
							}
							
							showProgram(); 
							
							if(func)func(programIndex);
						}
					}
				},
				failure:function(data){
					GF_WebPrint("获取VOD节目列表AJAX请求失败：");
				}
			});
		}catch(e){
			GF_WebPrint("获取VOD节目列表："+e)
		}
	}
	
	function showProgram(){
		try{
			for(var i = 0;i < programCount;i++){
				$("tutu"+i).innerHTML = "<img src='" + encodeURI( checkStr(i) ) + "' width='112'  height='152'/>";
				$("text"+i).textContent = subStr(getName(programArray[i]),5);	
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
			var pic = programArray[index].pic;
			var picURL;
			
			if( !pic ) {
				return nopic;
			}else if(pic.indexOf( "http" ) == -1){
				picURL = "http://www.hdipbox.cn" + pic;
			}else{
				picURL = pic;
			}
			
			return picURL;
		}
	}
	
	function noProgram(){
		for(var i = 0;i < row*col;i++){
			$("tutu"+i).innerHTML = "";
			$("text"+i).textContent = "";
		}
		showSysError("暂无节目,请选其他栏目");
		setTimeout(function(){sysErrorHandle();},1000);
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
	}
	
	function setCookie(){
		addCookie("focusArea",area);
		addCookie("menuIndex",menuObj.parameter.index);
		addCookie("programPage",pageInfoObj.pageNo);
		addCookie("programIndex",programIndex);
	}

	return o;
}();

//全局控制对象
var globalObj = function(){
	var localArea;
	var control = [navHandle,programHandle];
	var o = {};
	o.setArea = function(area){
		localArea = area;
	};
	o.handle = function(){
		return control[localArea];
	};

	return o;
}();

document.onkeypress = grabEvent;
function grabEvent(event){
	var val = event.keyCode | event.which;
	switch(val){
		case 37: //left
			globalObj.handle().left();
		break;
		case 39: //right
			globalObj.handle().right();
		break;
		case 38: //up
			globalObj.handle().up();
		break;
		case 40: //down
			globalObj.handle().down();
		break;
		case 13:
			globalObj.handle().onSelect();
		break;
//		case ROC_IRKEY_PAGE_UP:
//		break;
//		case ROC_IRKEY_PAGE_DOWN:
//		break;
		case 8:
		case 1285:
			//goBack();
			window.location = "../index/index.html";
		break;
	}
}

function initPage(){
	try{
		globalObj.setArea( pageArea.navArea );
		navHandle.setNavObj();
		//programHandle.init(8,1);
	}catch(e){
		alert(e);
	}
}
window.onload = initPage;
