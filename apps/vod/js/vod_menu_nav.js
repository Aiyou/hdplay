var move = function(element, position, speed, callback){//移动到指定位置，position:移动到指定left及top 格式{left:120, top:340}或{left:120}或{top:340}；speed:速度 1-100，默认为10
	if(typeof(element)=='string')element=document.getElementById(element);
	if(!element.effect){
		element.effect = {};
		element.effect.move=0;
	}
	clearInterval(element.effect.move);
	var speed=speed||10;
	var start=(function(elem){
		var	posi = {left:elem.offsetLeft, top:elem.offsetTop};
		while(elem = elem.offsetParent){
			posi.left += elem.offsetLeft;
			posi.top += elem.offsetTop;
		};
		return posi;
	})(element);
	element.style.position = 'absolute';
	var	style = element.style;
	var styleArr=[];
	if(typeof(position.left)=='number')styleArr.push('left');
	if(typeof(position.top)=='number')styleArr.push('top');
	element.effect.move = setInterval(function(){
		for(var i=0;i<styleArr.length;i++){
			start[styleArr[i]] += (position[styleArr[i]] - start[styleArr[i]]) * speed/100;
			style[styleArr[i]] = start[styleArr[i]] + 'px';
		}
		for(var i=0;i<styleArr.length;i++){
			if(Math.round(start[styleArr[i]]) == position[styleArr[i]]){
				if(i!=styleArr.length-1)continue;
			}else{
				break;
			}
			for(var i=0;i<styleArr.length;i++)style[styleArr[i]] = position[styleArr[i]] + 'px';
			clearInterval(element.effect.move);
			//if(callback)callback.call(element);
		}
	}, 20);
};

var getUrlPara = {"name":unescape($G.getParameter("name")),
				  "id":$G.getParameter("id")
				  };

/*页面控制区域*/
var pageArea = {"navArea":0,"programArea":1,"small_button":2};

/*导航控制*/
var navHandle = function(){
	var navObj;		//导航对象--改为焦点对象
	var navAll;		//所以栏目的li对象
	var navTimer; 	//快速切换栏目时，在停止按键后再获取数据
	var navData;	//保存前端返回的数据
	var navLen;
	var item;
	var timeid=0;
	var col = 3;		//定义显示的列数
	var	categoryId;
	var menuIndex = 0; //保存的cookie索引

	var o = new Control();
	o.timeid=0;
	
	o.setNavObj = function(){
		navAll = $("nav").getElementsByTagName("li");

		if( !isNaN(cookieObj.findCookie( "menuIndex" ) ) ){
			  this.index = cookieObj.findCookie( "menuIndex" );
			  //navAll[this.index].className = "curfocus";
			  menuIndex = this.index;
			  curMenu();
		}else{
			navAll[this.index].className = "curfocus";
		}
		
		getNavData();
		//categoryId = navData.FolderContents[this.index].id; 
		categoryId = getUrlPara.id;
		$("menuTitle").textContent = getUrlPara.name;
	}
	
	o.right = function(){
		if( (this.index+1)%col == 0 ){
			if( !programHandle.getAjaxFlag() ) return false;//如果ajax获取数据失败，就不执行向右操作
			//切换区域
			this.onBlur();
			curMenu();
			globalObj.setArea( pageArea.programArea ); 
			programHandle.onFocus( programHandle.getProgramIndex() );
		}else{
			this.onBlur();
			this.index++;		
			this.onFocus();	
		}	
	};
	
	o.left = function(){
		//if( !programHandle.getAjaxFlag() ) return false;//如果ajax获取数据失败，就不执行向右操作
		if( this.index > 0 ){
			this.onBlur();
			this.index--;		
			this.onFocus();	
		}	
	};
	
	o.up = function(){
		if( this.index - col < 0 ){//!navAll[this.index - col]
			return false;
		}else{
			this.onBlur();
			this.index -= col;
			this.onFocus();
		}
	};
	
	o.down = function(){
		if( !navAll[this.index + col] ){
			return false;
		}else{
			this.onBlur();
			this.index += col;
			this.onFocus();
		}
	};
	
/*	o.onFocus = function(dir){
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
*/	
//	var vtop = 0;
//	o.onFocus = function(dir){
//		if( dir == 1){
//			vtop += 75;
//			move(navObj, {top:vtop},40);	
//		}else if( dir == -1 ){
//			vtop -= 75;
//			move(navObj, {top:vtop},40);	
//		}
//		
//		navAll[this.index].className = "fontFocus";
//		changeProgram();
//	}
	
	o.onFocus = function(dir){
		//var focusObj = $("nav_focus");
		//focusObj.style.top = this.index*75 + "px";
		navAll[this.index].className = "curfocus";
	}
	
	o.onBlur = function(){
		navAll[this.index].className = "";
		//navObj[this.index].src = 'images/nav_'+this.index+'.png';
	};
	
	o.onSelect = function(){
		showSysError("加载中...");
		//categoryId = navData.FolderContents[this.index].id;
		loseCurMenu();
		menuIndex = this.index;	
		var tempPara = {"className":navAll[this.index].title,"name":navAll[this.index].innerHTML}
		//alert(tempPara.class + "___"+tempPara.name);
		changeProgram( tempPara );

	};
	
	function curMenu(){
		navAll[menuIndex].style.color = "rgb(0, 51, 255)";
	};
	
	function loseCurMenu(){
		navAll[menuIndex].style.color = "";
	}
	
	//查找目录ID
	o.getCategoryId = function(){
		return categoryId;
	}
	
	o.getMenuIndex = function(){
		if( !menuIndex ){
			menuIndex = 0;
		}
		return menuIndex;
	};
	
	function changeProgram(title){
		try{
			cookieObj.delCookie();
			
			if( navTimer ){
				clearTimeout( navTimer );
				navTimer=null;
			}
			navTimer = setTimeout(function(){
				programHandle.init(getUrlPara.id,1,'',title);	
			},1000)
		}catch(e){
			GF_WebPrint("changeProgram:"+e);
		}		
	}
	
	//获取根目录
	function getNavData(){
		navData = {
			"totalCount": "27",
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
				},
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
				},
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
				},{
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
				},
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
				}

			],
			"type": "Folder"
		};
		
		//navLen = navData.totalCount > 10 ? 10 : navData.totalCount;
		navLen = 27;//临时采用，待数据接口提供后，修改
		if( isNaN( cookieObj.findCookie( "vod_menuid") ) ){
			GF_WebPrint("**********************no cookie*******o.index:"+o.index);
			//programHandle.init(navData.FolderContents[o.index].id,1);
			programHandle.init(getUrlPara.id,1);
		}else{
			programHandle.init(cookieObj.findCookie( "vod_menuid" ),cookieObj.findCookie( "pageNo" ),programHandle.onFocus);
		}
		
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
	var programObj;		//获取页面中所有的节目li
	var col = 5;		//定义显示的列数
	var row = 2;		//定义显示的行数
	var type = 0;		//节目类型，0为单集，1为多集。在跳转到详细页时会根据不同类型节目传递不同参数
	var ajaxFlag = false;	// 判断ajax是否成功
	
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
	
	function init(id,page,func,title){
		programObj = $("programList").getElementsByTagName("li");
		getData(id,page,func,'',title);
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
		if( pageButton ){
			if( (pageInfoObj.pageNo == 1) || (pageInfoObj.pageNo == pageInfoObj.pageCount) ) return false;
			
				buttonOff();
				buttonIndex = buttonIndex < 1? parseInt(buttonIndex,10) + 1:0;
				buttonOn();
			
		}else{
			try{
				//旧版本是在左侧就切换到导航区域，现在改为在第一个节目时切换
				//programIndex%col == 0
				if(programIndex == 0) {
					//切换到导航区域区域
					onBlur(programIndex);
					globalObj.setArea( pageArea.navArea ); 
					navHandle.onFocus();
				}else{
					//if(programIndex == 0){	return false; }
					onBlur(programIndex);
					programIndex = programIndex-1;
					onFocus(programIndex);
					setProgramIndex(programIndex);
				}
			}catch(e){
				GF_WebPrint(e);
			}
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
		if( pageButton ){
			if( (pageInfoObj.pageNo == 1) || (pageInfoObj.pageNo == pageInfoObj.pageCount) ) return false;
				buttonOff();
				buttonIndex = buttonIndex > 0? buttonIndex - 1:1;
				buttonOn();
			
		}else{
//			if(	_isLast(programIndex) &&  (parseInt(pageInfoObj.pageNo,10) < parseInt(pageInfoObj.pageCount,10) )){
//				//向下翻页
//				//_setPageDown();
//			}else{
				if( programIndex  < programCount-1){
					onBlur(programIndex);
					programIndex = parseInt(programIndex,10)+1;
					setProgramIndex(programIndex);
					onFocus(programIndex);
				}
//			}
		}
	}
	
	function up(){
		if( pageButton ){
			buttonOff();
			pageButton = false;
			onFocus(programIndex);
		}else{
			if(programIndex - col >= 0){
				onBlur(programIndex);
				programIndex = programIndex-col;
				onFocus(programIndex);
				
				setProgramIndex(programIndex);
			}else{
				_setPageUp();
				//切换到导航区域区域
				//onBlur(programIndex);
				//globalObj.setArea( pageArea.small_button );
				//smallButton.onFocus();
			}
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
			
//			if(	 parseInt(pageInfoObj.totalCount,10) <= row*col ) return false;
//			onBlur(programIndex);	
//			buttonOn();			
//			pageButton = true;
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
			cookieObj.setCookie(); //增加cookie
			GF_WebPrint("***************");
			window.location.href = "vod_detail.html?id="+ escape(programArray[programIndex].id);
}
	
	function onFocus(i){
		try{
			//programObj[i].className = "curProgram";
			$("programFocus").style.left = (35+(i%col)*180)+"px ";
			$("programFocus").style.top = (-4+Math.floor(i/col)*267)+"px";
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
	
	function getData(id,page,func,retried,para){
		try{
			var area = '';
			var category = '';
			var year = '';
			if(para){
				switch(para.className){
					case "area":
						area = para.name;
					break;
					case "category":
						category = para.name;
					break;
					case "year":
						year = para.name;
					break;
				}
			}
			
			//var url =MY_PORTAL_ADDR+"/GetFolderContents?id=" + id + "&startAt="+ page +"&maxItems="+row*col;
			var url = MY_PORTAL_ADDR+'/getVodList.php?p_id='+ id +'&page_id='+ page +'&area_id='+area+'&c_id='+category+'&year_id='+year;			
			//alert(url);
			GF_WebPrint( "getProgramData:"+url );
			Ajax.request(url,{
				success:function(json){
					initProgramIndex();//初始化节目索引
					pageInfoObj = json.data;
					//pageInfoObj = strToJson(data[0].restartAtToken);//data[0].restartAtToken返回的是字符串格式，需要转换
					setProgramCount(json.total)//设置对外接口的节目数量
					//setPage(data.pageCount,data.pageNo);
					
					if(data.total == 0){    //获取节目数量，判断是否有节目需要显示
						noProgram(); //没有VOD节目
						ajaxFlag = false;
					}else{
						var programLen = json.data.length; 	//单集数量
						if(programLen>0){
							//单集的处理
							type = 0;
							programCount = programLen;
							for(var i = 0;i < programCount;i++){
								programArray[i] = data.ItemsContents[i];
							}
							
							showProgram(); //显示VOD节目
							if(func)func(programIndex);	//用来设置焦点
							sysErrorHandle();
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
						ajaxFlag = true;
					}
					
				},
				failure:function(data){
					if( retried ){
						ajaxFlag = false;
						noProgram(); //没有VOD节目--临时添加
						GF_WebPrint("ajax:get programs failed");
						globalObj.setArea( pageArea.navArea );
					}else{
						setTimeout( function(){  getData(id,page,onFocus,true,para) },300 );		
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
	
	function showProgram(){
		try{
			for(var i = 0;i < programCount;i++){
				$("tutu"+i).innerHTML = "<img src='" + encodeURI( checkStr(i) ) + "'/>";
				//$("tutu"+i).setAttribute("class","mepg");
				$("text"+i).textContent = subStr(getName(programArray[i]),5);	
			}
			
			//如果获取的节目数小于10个，就把没有的设置为空（在翻页的时候用）
			if(programCount < row*col){
				
				for(var i=programCount; i<row*col;i++){
					$("tutu"+i).textContent = "";
					$("text"+i).textContent = ""
					$("tutu"+i).setAttribute("class","");
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
				picURL = "http://web.mmbtv.com" + pic;
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
		var page = pageInfoObj.pageNo;
		var pageCount = pageInfoObj.totalPages;
		var prePage = pageInfoObj.prePage;
/*		if(pageCount < 1){
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
//		$("page").textContent = pageNo + "/" + pageCount;
//		buttonOff();
//		buttonInit();		
//		
//		if( pageNo == 1 ){
//			$("page1").style.visibility = "hidden";		
//			buttonIndex = 0;
//		}else if( pageNo ==  pageCount){
//			$("page0").style.visibility = "hidden";			
//			buttonIndex = 1;
//		}else if(pageNo == pageCount){
//			$("page0").style.visibility = "hidden";			
//			$("page1").style.visibility = "hidden";	
//		}else{
//			$("page0").style.visibility = "visible";			
//			$("page1").style.visibility = "visible";	
//			buttonIndex = 1;
//		}
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

//cookie对象
var cookieObj = function(){
	var o = {};
	var cookieValue = {"vod_menuid":"","menuIndex":"","pageNo":"","vod_movieIndex":""};
	
	o.findCookie = findCookie;
	o.setCookie = setCookie;
	o.getAllCookie = getAllCookie;
	o.delCookie = delCookie;
	
	function setCookie(){
//		GF_WebPrint("***************setAllCookie****************");
//		GF_WebPrint("vod_menuid***************"+navHandle.getCategoryId());
//		GF_WebPrint("menuIndex***************"+navHandle.getMenuIndex());
//		GF_WebPrint("pageNo***************"+programHandle.getPageNo() );
//		GF_WebPrint("vod_movieIndex***************"+programHandle.getProgramIndex());
		
		addCookie( "vod_menuid",navHandle.getCategoryId() );
		addCookie( "menuIndex",navHandle.getMenuIndex() );
		addCookie( "pageNo",programHandle.getPageNo() );
		addCookie( "vod_movieIndex",programHandle.getProgramIndex() ); // 为了返回时能准确定位页面焦点，记录节目索引
	}
	
	function getAllCookie(){
		cookieValue.vod_menuid = getCookie("vod_menuid");
		cookieValue.menuIndex = getCookie("menuIndex");
		cookieValue.pageNo = getCookie("pageNo");
		cookieValue.vod_movieIndex = getCookie("vod_movieIndex");
//		GF_WebPrint("***************getAllCookie****************");
//		GF_WebPrint("vod_menuid***************"+cookieValue.vod_menuid);
//		GF_WebPrint("menuIndex***************"+cookieValue.menuIndex);
//		GF_WebPrint("pageNo***************"+cookieValue.pageNo);
//		GF_WebPrint("vod_movieIndex***************"+cookieValue.vod_movieIndex);
	}
	
	function delCookie(){
		GF_WebPrint("***************delCookie****************");
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
//			navHandle.onFocus();	
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

//全局控制对象
var globalObj = function(){
	try{
		var localArea;
		//var control = [navHandle,programHandle,smallButton];
		var control = [navHandle,programHandle];
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
		case 1285:
			//goBack();
			cookieObj.delCookie();
			window.location = "../index/index.html";
		break;
		}
	}catch(e){
		GF_WebPrint("keyPress--"+e);
	}
}

function initPage(){
	try{
		showMenu( getUrlPara.id );
		
		cookieObj.getAllCookie();
		if( isNaN(cookieObj.findCookie( "vod_menuid" ) ) ){
			globalObj.setArea( pageArea.navArea );
		}else{
			globalObj.setArea( pageArea.programArea );
		}
		
		navHandle.setNavObj();
	}catch(e){ 
		GF_WebPrint("page loading--"+e);
	}
}

window.onload = initPage;
