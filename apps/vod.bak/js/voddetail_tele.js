// JavaScript Document
var AreaIndex=1;        //1为集数，2为返回键钮
var itemIndex = 0;   //集数索引
var buttonIndex = 0; //按键索引
var totalPage = 0;//总页数
var precount = 10; //当前页面节目最大数
var lastPageCount = precount;//最后一页节目个数
var currentPage = 1;//当前页码
var lastIndex = 0; //当前页最后一个焦点
var subId = 0;  //子集ID
var ispro = false;
var cookieIndex = 0;//
var vod_subid_flag = false;
var getdata = [];
var iscollect = false;
var ovtset = new QjyScript();
//var idname = "id,name";
var idname = "id,name,time";
var sameflag = false;


var itemArea = (function(){
	var area = {};
	//var getdata = [];
	var totalcount = 0;
	var loadfinish = false;
	var p = null;
	var elearray = [];
	var proArray = [];

	var col = 10;
	var row = 1;
	function getProgdata(retried){//获取节目信息
		try{
			var url = MY_PORTAL_ADDR+"/GetItemData?id=" + unescape($G.getParameter("id"));
			   Ajax.request(url,{
				success:function(data){
					if(data.ItemsContents.length != 0){
						getdata = data.ItemsContents[0];
						parseProg();	
						showInfo();	
						if(totalcount>1){
							//setFocus(0);
							setFocus(index);
							//showProg();
							showProg(currentPage);		//cookie
							ispro = true;
							document.getElementById("button_1").style.visibility = "visible";
						}else{
							document.getElementById("button_1").style.visibility = "visible";
							document.getElementById("button_0").style.visibility = 'visible';
							AreaIndex=2;
						}
						//showProg(currentPage);		//cookie
						//showProg(1);
					}
					loadfinish = true;
				},
				failure:function(data){
					if( retried ) {
						document.getElementById("item_region").style.visibility = "visible";
						document.getElementById("item_region").textContent = "无节目";
						document.getElementById("item_region").style.left =800+"px";
						document.getElementById("item_region").style.top =230+"px";
						document.getElementById("item_region").style.fontSize = 32+"px";
						//document.getElementById("button_0").style.visibility = 'visible';
						//document.getElementById("button_1").style.background="url(images/back1.png) no-repeat";
						AreaIndex=2;
						buttonIndex = 1;
						button_flag = 0;
						GF_WebPrint("获取节目详细信息AJAX请求失败：");
					} else {
						setTimeout(function(){ getProgdata( true ) }, 300);
					}
				}
			});
		}catch(e){
			GF_WebPrint("获取VOD节目信息："+e)
		}
	};
	//显示当前节目信息
	function showInfo(){
		document.getElementById('prog_img').innerHTML = "<img src=" + encodeURI(checkStr()) +">";
		document.getElementById('movie_name').textContent = getdata.name;
		document.getElementById('introduce').textContent = getStrChineseLen(getdata.info + "...",88);
		document.getElementById('director').textContent = getdata.directors;
		document.getElementById('actor').textContent = getdata.actors;
		//检测图片地址中是否含有http字符
		function checkStr(){
			var pic = getdata.pic;
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
	
	function parseProg(){//解析集数
		var progUrl=getdata.url;
		elearray = progUrl.split("\r\n");
		totalcount = elearray.length;//总节目数
		if(totalcount>precount){
			//totalPage = (totalcount%precount)==0?(totalcount/precount):(totalcount%precount+1);
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
		
	}
	
	function showProg(pp){//显示集数
		document.getElementById("item_region").style.visibility = "visible";
		if(totalcount==2){
			proArray[0].innerHTML = "<span>上集</span>";
			proArray[1].innerHTML = "<span>下集</span>";
		}else if(totalcount==3){
			proArray[0].innerHTML = "<span>上集</span>";
			proArray[1].innerHTML = "<span>中集</span>";
			proArray[2].innerHTML = "<span>下集</span>";
		}else{
			for(var i=0; i<precount;i++){
				proArray[i].innerHTML = "<span>第" + ((i+1)+(pp-1)*precount) + "集</span>";
			}
		}
		if(currentPage == totalPage){
			if(lastPageCount < 10){
				for(var i=lastPageCount;i<10;i++){
					proArray[i].innerHTML = "";	
				}
			}
		}
		//showPage();
	}	
	var listarray = [];
	area.collect = function(id){//收藏
		//GF_WebPrint( "*************id:"+id );
		var liststr=ovtset.exec("OvtGetInforFromFile","favorite");
		if(!liststr){
			listarray = [];
			str = '{programId:'+id+',programName:"'+getdata.name+'",pic:"'+getdata.pic+'"}'
			ovtset.exec("OvtSetInfor2File","favorite",str);
			$("collect_succeed").innerHTML = "收藏成功";

		}else{
			listarray=liststr.split("|",10);//把一个字符串分割成字符串数组
			//GF_WebPrint("=====newlistarray======"+listarray);
			//GF_WebPrint("=====length======"+listarray.length);
			var flag = false;
			for(var j=0;j<listarray.length;j++){
				var curId = strToJson(listarray[j]).programId;
				if( curId == id ){
					flag = true;
				}
			}
			//GF_WebPrint("flag888888:"+flag);
			
			if( !flag ){
				str = '{programId:'+id+',programName:"'+getdata.name+'",pic:"'+getdata.pic+'"}'
				listarray.unshift(str);//添加到数组开始   //可向数组的开头添加一个或更多元素，并返回新的长度。
				//if(listarray.length>10) listarray.length=10;//长度大于10取10
				var setstr=listarray.join("|");//把数组中的所有元素放入一个字符串
				ovtset.exec("OvtSetInfor2File","favorite",setstr);
				$("collect_succeed").innerHTML = "收藏成功";						
			}else{
				$("collect_succeed").innerHTML = "已经收藏";	
			}
		}
	
	
		/*var liststr=ovtset.exec("OvtGetInforFromFile","favorite20");
		if(!liststr){
			listarray = [];
			str = '{programId:'+id+',programName:"'+getdata.name+'",pic:"'+getdata.pic+'"}'
			//listarray.unshift(str);//添加到数组开始   //可向数组的开头添加一个或更多元素，并返回新的长度。
			//if(listarray.length>10) listarray.length=10;//长度大于10取10
			//var setstr=listarray.join("|");//把数组中的所有元素放入一个字符串
			ovtset.exec("OvtSetInfor2File","favorite20",str);
		}else{
			listarray=liststr.split("|",10);//把一个字符串分割成字符串数组
			var html="";
				for(var i=0;i<listarray.length;i++){
						var favoriteid = parseInt(strToJson(listarray[i]).programId,10);
						var favoritepic = strToJson(listarray[i]).pic;
						var favoritename = strToJson(listarray[i]).programName;
						//var idtmp = str.id;
					if(favoriteid == id){
						//sameflag = true;
						break;
					}
					//if(sameflag == true) {
					//ovtset.exec("OvtSetInfor2File","favorite",liststr);
					//}else{
					if( favoriteid != parseInt(id,10) ){
						str = '{programId:'+id+',programName:"'+getdata.name+'",pic:"'+getdata.pic+'"}'
						listarray.unshift(str);//添加到数组开始   //可向数组的开头添加一个或更多元素，并返回新的长度。
						//if(listarray.length>10) listarray.length=10;//长度大于10取10
						var setstr=listarray.join("|");//把数组中的所有元素放入一个字符串
						ovtset.exec("OvtSetInfor2File","favorite20",setstr);
						break;
					}
				}
				
		}*/
		
		
		/*for(var i=0;i<listarray.length;i++){
			var tmparray = listarray[i].indexOf(",");
			//$("collect_succeed").innerHTML = listarray;
			var idarray = listarray[i].substring(0,tmparray);
			//$("collect_succeed").innerHTML = idarray;
			var strtmp = str.indexOf(",");
			var idtmp = str.substring(0,strtmp);
			//$("collect_succeed").innerHTML = idtmp;			

			if(idarray == idtmp){
				//$("collect_succeed").innerHTML = "111111";
				sameflag = true;
				break;
			}
		listarray.unshift(str);//添加到数组开始   //可向数组的开头添加一个或更多元素，并返回新的长度。
		if(listarray.length>10) listarray.length=10;//长度大于10取10
		var setstr=listarray.join("|");//把数组中的所有元素放入一个字符串
		ovtset.exec("OvtSetInfor2File","file1",setstr);
		$("collect_succeed").innerHTML = "收藏成功";*/
	}

	area.init = function(){
	    getProgdata();
		//setFocus(0);	
		//alert("index:"+index);
		//setFocus(index);//cookie
	}

	area.initpos = function(){
	    var html = "";
		for(var i=0; i<10;i++){
			html += "<div></div>";
		}
		
	    document.getElementById('item_show').innerHTML = html;	
		var nodelist = $('item_show').childNodes;
		for(var i=0; i<10;i++){
			proArray[i] = nodelist[i];
			
		}
	}
	function setFocus(i){
		$("item_focus").style.left = (15+(i%col)*73)+"px ";
		$("item_focus").style.top = (10+Math.floor(i/col)*50)+"px";
		//$("item_"+i).style.color = "#000";
		$("item_focus").style.visibility = 'visible';
		index = i;
		proArray[index].className = 'black';	
	}
	function changeFocus(i){
		$("item_focus").style.left = (15+(i%col)*73)+"px ";
		$("item_focus").style.top = (10+Math.floor(i/col)*50)+"px";
		//$("item_"+i).style.color = "#000";
		$("item_focus").style.visibility = 'visible';
		setFocus(i);
		if(i == 0){
			proArray[i].className = 'black';
			proArray[i+1].className = 'commen';
		}else if(i == 9){
			proArray[i].className = 'black';
			proArray[i-1].className = 'commen';
		}else{
			proArray[i].className = 'black';
			proArray[i-1].className = 'commen';
			proArray[i+1].className = 'commen';
		}
		
	}
	function releaseFocus(){
		$("item_focus").style.visibility = 'hidden';
		//$("item_"+i).style.color = "#FFF";
		proArray[index].className = 'commen';
		index = -1;
	}
	area.right = function(){		
		if(currentPage == totalPage){     //最后一页
			var curcount = totalcount > 10 ? totalcount%10 : totalcount;//共一页最后一页，多页最后一页
			
			if(index == curcount - 1 || index%precount == precount - 1){//最后一个节目但不是第8集和第16集||是第8集和第16集
				pagedown();
			}
			else{
				changeFocus(index+1);
			}
		}
		else{                             //不是最后一页
			if(index%col == col - 1){//是第8集和第16集
				pagedown();
			}
		    else{   
			    changeFocus(index+1);
			}
		}

	}

	area.left = function(){
		if(index == 0){
			if(currentPage == 1){
			}else{
				pageup();
				changeFocus(precount-1);
			}
		}else{ 
		    changeFocus(index-1);
		}
	}
	
	area.up = function(){
		if(index == -1){
			var curcount = totalcount > 10 ? totalcount%10-1 : totalcount-1; //从返回按钮上来，焦点位置
			setFocus(curcount);
		}else{
			if(index > col-1){//第二行       //OK
				changeFocus(index-col);
				//releaseFocus();
			}else{
				
			}
		}
	}
	
	area.down = function(){
		releaseFocus();
			AreaIndex=2;
			buttonArea.myfocus();
		/*if(index > col-1){//第二行
			releaseFocus();
			AreaIndex=2;
			buttonArea.myfocus();
		}else{//第一行
			if(currentPage == totalPage){//当前页是否最后一页       //OK
				//var curcount = count%16;
				//var curcount = totalcount > 16 ? totalcount%16 : totalcount;
				if(totalcount > 10){
					if(totalcount % col == 0){
						curcount = totalcount - (currentPage-1)*precount;
					}else{
						curcount =totalcount%16;
					}
				}else{
					curcount = totalcount;
				}
				if(index + col >= curcount){//当前列下没有集数
					if(curcount <= col){
						releaseFocus();
						AreaIndex=2;
						buttonArea.myfocus();
						
					}else{
						if(currentPage == totalPage){
							lastIndex = totalcount%10 -1;
						}else{
							lastIndex = precount -1;
						}
						changeFocus(lastIndex);
					}
			
					
				}else{
					changeFocus(index+col);
				}
			}else{
			//当前列下有集数;
				changeFocus(index+col);
			}
		}*/

	}
	
	function pageup(){
		releaseFocus();
		currentPage -= 1;
		showProg(currentPage);
		setFocus(9);		
	}
	
	function pagedown(){
		if(currentPage == totalPage){//最后一页
			
		}else{//
			releaseFocus();
			currentPage += 1;
			showProg(currentPage);
			setFocus(0);
			
		}
	}
	area.item_pageup = function(){
		if(currentPage == 1){
			
		}else{
			pageup();		
		}
	}
	area.item_pagedown = function(){
		pagedown();
	}

	
	area.myfocus = function(){
		if(currentPage == totalPage){
			if(totalcount > 10){
				if(totalcount % col == 0){
						lastIndex = totalcount - (currentPage-1)*precount -1;
					}else{
						lastIndex = totalcount%10 -1;
					}
			}else{
				lastIndex = totalcount -1 ;
			}
			//lastIndex = totalcount%16 -1;
		}else{
			lastIndex = precount -1;
		}
		setFocus(lastIndex);
	}
	
	function showPage(){
		document.getElementById("cur_page").innerHTML = currentPage;
		document.getElementById("total_page").innerHTML = totalPage;
	}
	
	area.myhref = function(){
		var id = getdata.id.toString();
		var name = escape(getdata.name.toString());
		var timearea = DateAndTime();
		//idname = id + "," + name;
		idname = id + "," + name + "," + timearea;
		buttonArea.history(idname);
		
		subId = (index + 1) + (currentPage-1)*precount;
		addCookie("vod_subid",subId);   //与播放页cookie 20130603
		window.location.href="../vod/vod_play.html?programId=" + escape(getdata.id) + "&subId=" + escape(subId) + "&programName=" + escape(getdata.name) + "&type=" + escape(getdata.type) + "&playUrl=" + escape(getdata.url);
		
		//var url=navigationlist[navigationIndex].href;
		//window.location.href=url;
		//var prog = getdata[index];
	    //location = "fw_vod_play.html?" + "&id=" + escape(prog.id) + "&providerId=" + escape(prog.providerId) +"&assetId="+ prog.assetId + "&name=" + escape(prog.name) + "&summarvShort=" + escape(prog.summarvShort) + "&progtime=" + escape(prog.progtime) + "&folderAssetId=" + escape(prog.folderAssetId);	
	}
	
	//获取cookie 播放子集ID
	var Item_Index = getCookie("vod_subid");
	if(typeof(Item_Index)=="undefined"||Item_Index==""||typeof(parseInt(Item_Index))!="number"||Item_Index=="v"){
		index=0; 
	}else{
		cookieIndex = parseInt(Item_Index);
		if(cookieIndex == 0){
			index=0;
		}else{
			if( cookieIndex % precount == 0){
				index = precount -1;
			}else{
				index = cookieIndex%precount - 1;
			}
		}
		currentPage = parseInt( (cookieIndex-1)/precount,10) + 1;
		//currentPage = Math.ceil(cookieIndex/precount);
	}
	
	return area;
}());


var buttonArea = (function(){
	var area = {};
	var collect_timer = 0;	
	function  showcollect(){
		$("collect_tip").style.visibility = "visible";
		//str+=","+newdate.toString();
		var id = getdata.id;
		//str = id + "," + name + "," +pic;
		itemArea.collect(id);
		iscollect = true;
		clearTimeout(collect_timer);
		collect_timer = setTimeout(function (){hiddencollect()},1000);
	}
	function hiddencollect(){
		$("collect_tip").style.visibility = "hidden";
		iscollect = false;
	}
	area.up = function(){
		if(ispro == true){
			area.myblur();
			AreaIndex=1;
			//itemArea.myfocus();
			itemArea.myfocus();
		}else{
			
		}
		/*area.myblur();
		AreaIndex=1;
		//itemArea.myfocus();
		itemArea.myfocus();*/
	}
	area.down = function(){
		/*buttonIndex = 0;
		area.myfocus();*/
	}
	area.right = function(){
		if(buttonIndex == 1){
			area.myblur();
			buttonIndex = 1;
			this.myfocus();	
		}else{
			area.myblur();
			buttonIndex++;	
			this.myfocus();
		}	
		/*buttonIndex = 0;
		area.myfocus();*/
		
	}
	area.left = function(){
		if(buttonIndex == 0){
			area.myblur();
			buttonIndex = 0;
			this.myfocus();
		}else{
			area.myblur();
			buttonIndex--;
			this.myfocus();
		}	

		/*buttonIndex = 0;
		area.myfocus();*/
		
	}
	area.myfocus = function(){
		if(ispro == true){
			menuGetFocusPic(1);
		}else{
			menuGetFocusPic(buttonIndex);
		}
		//document.getElementById("button_0").style.background="url(images/back1.png) no-repeat"; 
		
	}
	area.myblur = function(){
		if(ispro == true){
			menuBlurFocusPic(1);
		}else{
			menuBlurFocusPic(buttonIndex);
		}
		//document.getElementById("button_0").style.background="url(images/back.png) no-repeat"; 
	}
	function history() {
		var liststr=ovtset.exec("OvtGetInforFromFile","history");
		listarray=liststr.split("|",10);//把一个字符串分割成字符串数组
		ovtset.debug("数组长度"+listarray.length+"-"+listarray[0]);
		
		/*var html="";
		for(var i=0;i<listarray.length;i++){
			var tmparray = listarray[i].indexOf(",");
			//$("collect_succeed").innerHTML = listarray;
			var idarray = listarray[i].substring(0,tmparray);
			//$("collect_succeed").innerHTML = idarray;
			var strtmp = str.indexOf(",");
			var idtmp = str.substring(0,strtmp);
			//$("collect_succeed").innerHTML = idtmp;			

			if(idarray == idtmp){
				//$("collect_succeed").innerHTML = "111111";
				sameflag = true;
				break;
			}
		}*/
		
		/*if(sameflag == true) {
			//$("collect_succeed").innerHTML = "2222";
			ovtset.exec("OvtSetInfor2File","favorite",liststr);
		}else{*/
			//$("collect_succeed").innerHTML = "333";
			listarray.unshift(str);//添加到数组开始   //可向数组的开头添加一个或更多元素，并返回新的长度。
			if(listarray.length>10) listarray.length=10;//长度大于10取10
			var setstr=listarray.join("|");//把数组中的所有元素放入一个字符串
			ovtset.exec("OvtSetInfor2File","history",setstr);
			$("movie_text1").innerHTML = listarray;
			
		/*}*/
		
	}
	var historyarray = [];
	area.history = function(idname){
		try{
			var historystr=ovtset.exec("OvtGetInforFromFile","history");
			historyarray=historystr.split("|",9);//把一个字符串分割成字符串数组
			historyarray.unshift(idname);//添加到数组开始   //可向数组的开头添加一个或更多元素，并返回新的长度。
			if(historyarray.length>9) historyarray.length=9;//长度大于9取9
			var addstr=historyarray.join("|");//把数组中的所有元素放入一个字符串
			ovtset.exec("OvtSetInfor2File","history",addstr);
	}
	catch(e){
		GF_WebPrint("---history--------"+e)
		}
			
				
			
	}
	area.myhref = function(){
		if(ispro == true){
			if(buttonIndex == 0){
				//删除cookie   子集播放
				showcollect();
				//deleteCookie("vod_subid");//20130627改收藏
				//window.location.href="../vod/vod_index.html"//20130627改收藏
			}
		}else{
			if(buttonIndex == 0){
				var id = getdata.id.toString();
				var name = escape(getdata.name.toString());
				var timearea = DateAndTime();
				//idname = id + "," + name;
				idname = id + "," + name + "," + timearea;
				buttonArea.history(idname);
				window.location.href="../vod/vod_play.html?programId=" + escape(getdata.id) + "&programName=" + escape(getdata.name) + "&type=" + escape(getdata.type) + "&playUrl=" + escape(getdata.url);
			}else if(buttonIndex == 1){
				//showcollect();
				//删除cookie   子集播放
				//deleteCookie("vod_subid");
				showcollect();
				//window.location.href="../vod/vod_index.html"//20130627改收藏
			}else{
				//window.location.href="../vod/vod_index.html"
			}
		}
		//删除cookie   子集播放
		/*deleteCookie("vod_subid");
		window.location.href="../vod/vod_index.html"*/
	}
	return area;
}());

function menuGetFocusPic(buttonIndex){
	switch(buttonIndex){
		case 0:
			document.getElementById("button_"+buttonIndex).style.background="url(images/play1.png) no-repeat";
		break;
		case 1:
			document.getElementById("button_"+buttonIndex).style.background="url(images/collect1.png) no-repeat";
		break;
	}
	
}
function menuBlurFocusPic(buttonIndex){
		switch(buttonIndex){
		case 0:
			document.getElementById("button_"+buttonIndex).style.background="url(images/play.png) no-repeat";
		break;
		case 1:
			document.getElementById("button_"+buttonIndex).style.background="url(images/collect.png) no-repeat";
		break;
		
	}
}

function DateAndTime(){	
    var date = new Date();
	var dateStr = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
	var timeStr = (date.getHours().toString().length == 1  ?  '0' : '') + date.getHours() + ":" + (date.getMinutes().toString().length == 1  ?  '0' : '') + date.getMinutes();
	//setTimeout('showDateAndTime()',60000);	
	return dateStr+ " " +timeStr; 
}

