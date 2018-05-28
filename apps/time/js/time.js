// JavaScript Document
var channelList = new Array(); 		
var totalcount = 0;						
var precount = 9;                   //当前页面节目最大
var totalPage = 0;                     //总页数
var lastPageCount = precount;      //最后一页节目个数
var pageIndex=1;					//当前频道页数 ，默认为第一页
var leftIndex=0;					//频道索引
var areaIndex=0;
var rightIndex = 0;
var tip_timer = 0;
var listArea = (function(){             
	var area =　{};
	var channelObj;		//获取页面中所有的节目div
	function loadChannel(retried){
		try{

		/*			for(var i=0; i<data.totalResults; i++){
						//alert("111:"+channelList)
						channelList[i] = data.channels[i]
					}
					totalcount = data.totalResults;//总节目数
					showChannel(0);//显示第一页频道数据
					myfocus(leftIndex);

					
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
						
					}*/
			
			
			//http://ip:port/GetChannels?startAt=1&maxItems=20
			var url = MY_PORTAL_ADDR+"/GetChannels?startAt=1";  
			Ajax.request(url,{
				success : function(data){
					if(data.result == "410"){ 
						login(false);
						return ;
					}
					if(data.result!="200"){
						showTip(data);
					}
					for(var i=0; i<data.totalResults; i++){
						//alert("111:"+channelList)
						channelList[i] = data.channels[i]
					}
					totalcount = data.totalResults;//总节目数
					showChannel(0);//显示第一页频道数据
					if(totalcount!=0){
						myfocus(leftIndex);
					}
					area.showright();
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
				},
				failure : function(data){
					if( retried ) {
						//window.history.go(-1);
						
					} else {
						setTimeout(function(){ loadChannel( true ) }, 300);
					}
				}
			});
		}catch(e){
			GF_WebPrint("节目列表："+e)
		}
	}
	function getname(obj){
	    return obj.name;
	}
	function showChannel(i){
		var html = "";
		for(var i=(precount*pageIndex-precount); i<precount*pageIndex; i++){
			obj = channelList[i];
			if(channelList[i] == undefined){
				//channelList[i] = {"name" : ""}
				break;
			}
			//var channelName = getStrChineseLen((channelList[i].channelName),13);
			//var channelName = channelList[i].channelName;
			var channelIndex = channelList[i].channelNumber;
			if(channelIndex.length<2){
				channelIndex = "00" +channelIndex;
			}else if(channelIndex.length<3){
				channelIndex = "0" +channelIndex;
			}else if(channelIndex.length<4){
				channelIndex = channelIndex;
			}			
			//alert(channelIndex)
			//alert(channelList[i].name)
			var channelName = getStrChineseLen(channelList[i].channelName,6);
			html +='<div class="content_id" id="list_pad'+ i + '">'+channelIndex+'<span class="name_content">'+channelName+'</span></div>';
		}
		$("content_list").innerHTML = html;
	}
	area.init = function(){
		
		channelObj = $("content_list").getElementsByTagName("div");
		loadChannel();
	}
	function pageup(){
		if(pageIndex == 1){
			//alert("aaaa")
			myblur();
			pageIndex = 1;
			showChannel(pageIndex);
			leftIndex = lastPageCount -1;
			myfocus(leftIndex);
		}else{
			//alert("bbb")
			myblur();
			pageIndex -= 1;
			showChannel(pageIndex);
			leftIndex = 8;
			myfocus(leftIndex);
		}
		addCookie("timepage_id",pageIndex);	
	}
	
	function pagedown(){
		if(pageIndex == totalPage){

		}else{
			myblur();
			pageIndex += 1;
			showChannel(pageIndex);
			leftIndex = 0;
			myfocus(leftIndex);
		}
		addCookie("timepage_id",pageIndex);
	}
	area.pageup = function(){
		pageup();
	}
	area.pagedown = function(){
		pagedown();
	}
	area.up = function(){
		if(areaIndex == 0){
			if(pageIndex == totalPage){
				if(leftIndex > 0){
					if(leftIndex < lastPageCount ){//最后一页 第二到最后一个节目
						//alert("1111")
						myblur();
						leftIndex --;
						myfocus(leftIndex);
					}else{
						//alert("2222")
						myblur();
						leftIndex = lastPageCount -1;
						myfocus(leftIndex);
					}
				}else{//最后一页第一个节目
					//alert("333")
					pageup();
				}
				
			}else{
				if(leftIndex > 0){//其它页第二到最后一个节目
					//alert("4444")
					myblur();
					leftIndex --;
					myfocus(leftIndex);
				}else{
					if(pageIndex == 1){//第一页第一个节目
						//alert("5555")
						myblur();
						pageIndex = totalPage;
						showChannel(pageIndex);
						leftIndex = lastPageCount - 1;
						myfocus(leftIndex);			
					}else{//其它页第一个节目
						//alert("6666")
						pageup();
					}
				}
			}
			area.showright();
			addCookie("timepage_id",pageIndex);
			addCookie("channel_id",leftIndex);
		}else{
			if(rightIndex == 0){
				
			}else if(rightIndex == 13){
				myblur();
				rightIndex --;
				myfocus(rightIndex);
			}else if(rightIndex == 1){
				begin_year01 ++;
				$("begin_year01").innerHTML = begin_year01;
			}else if(rightIndex == 2){
				if(begin_month01 == 12){
					
				}else{
					begin_month01 ++;
					begin_month01 = (begin_month01.toString().length == 1  ?  '0' : '') +begin_month01;
					$("begin_month01").innerHTML = begin_month01;
				}
			}else if(rightIndex == 3){
				if(begin_month01 == 2){
					if(begin_day01 == 28){
					
					}else{
						begin_day01 ++;
						begin_day01 = (begin_day01.toString().length == 1  ?  '0' : '') +begin_day01;
						$("begin_day01").innerHTML = begin_day01;
					}
				}else if(begin_month01 == 4||begin_month01 == 6||begin_month01 == 9||begin_month01 == 11){
					if(begin_day01 == 30){
						
					}else{
						begin_day01 ++;
						begin_day01 = (begin_day01.toString().length == 1  ?  '0' : '') +begin_day01;
						$("begin_day01").innerHTML = begin_day01;
					}
				}else{
					if(begin_day01 == 31){
						
					}else{
						begin_day01 ++;
						begin_day01 = (begin_day01.toString().length == 1  ?  '0' : '') +begin_day01;
						$("begin_day01").innerHTML = begin_day01;
					}
				}
			}else if(rightIndex == 4){
				if(begin_hour01 == 23){
					
				}else{
					begin_hour01 ++;
					begin_hour01 = (begin_hour01.toString().length == 1  ?  '0' : '') +begin_hour01;
					$("begin_hour01").innerHTML = begin_hour01;
				}
			}else if(rightIndex == 5){
				if(begin_minute01 == 59){
					
				}else{
					begin_minute01 ++;
					begin_minute01 = (begin_minute01.toString().length == 1  ?  '0' : '') +begin_minute01;
					$("begin_minute01").innerHTML = begin_minute01;
				}
			}else if(rightIndex == 6){
				if(begin_second01 == 59){
					
				}else{
					begin_second01 ++;
					begin_second01 = (begin_second01.toString().length == 1  ?  '0' : '') +begin_second01;
					$("begin_second01").innerHTML = begin_second01;
				}
			}else if(rightIndex == 7){
				end_year01 ++;
				$("end_year01").innerHTML = end_year01;
			}else if(rightIndex == 8){
				if(end_month01 == 12){
					
				}else{
					end_month01 ++;
					end_month01 = (end_month01.toString().length == 1  ?  '0' : '') +end_month01;
					$("end_month01").innerHTML = end_month01;
				}
			}else if(rightIndex == 9){
				if(end_month01 == 2){
					if(end_day01 == 28){
					
					}else{
						end_day01 ++;
						end_day01 = (end_day01.toString().length == 1  ?  '0' : '') +end_day01;
						$("end_day01").innerHTML = end_day01;
					}
				}else if(end_month01 == 4||end_month01 == 6||end_month01 == 9||end_month01 == 11){
					if(end_day01 == 30){
						
					}else{
						end_day01 ++;
						end_day01 = (end_day01.toString().length == 1  ?  '0' : '') +end_day01;
						$("end_day01").innerHTML = end_day01;
					}
				}else{
					if(end_day01 == 31){
						
					}else{
						end_day01 ++;
						end_day01 = (end_day01.toString().length == 1  ?  '0' : '') +end_day01;
						$("end_day01").innerHTML = end_day01;
					}
				}
			}else if(rightIndex == 10){
				if(end_hour01 == 23){
					
				}else{
					end_hour01 ++;
					end_hour01 = (end_hour01.toString().length == 1  ?  '0' : '') +end_hour01;
					$("end_hour01").innerHTML = end_hour01;
				}
			}else if(rightIndex == 11){
				if(end_minute01 == 59){
					
				}else{
					end_minute01 ++;
					end_minute01 = (end_minute01.toString().length == 1  ?  '0' : '') +end_minute01;
					$("end_minute01").innerHTML = end_minute01;
				}
			}else if(rightIndex == 12){
				if(end_second01 == 59){
					
				}else{
					end_second01 ++;
					end_second01 = (end_second01.toString().length == 1  ?  '0' : '') +end_second01;
					$("end_second01").innerHTML = end_second01;
				}
			}
		}
		
	}
	area.down = function(){
		if(areaIndex == 0){
			if(pageIndex == totalPage){
				if(leftIndex < lastPageCount - 1){//最后一页，第一到倒数第二个节目
					myblur();
					leftIndex ++;
					myfocus(leftIndex);
				}else{//最后一页，最后一个节目
					myblur();
					pageIndex = 1;
					showChannel(pageIndex);
					leftIndex = 0;
					myfocus(leftIndex);
				}
			}else{
				if(leftIndex < 8){//其它页，第一到倒数第二个节目
					myblur();
					leftIndex ++;
					myfocus(leftIndex);
				}else{//其它页，最后一个节目
					pagedown();
				}
			}
			area.showright();
			addCookie("timepage_id",pageIndex);
			addCookie("channel_id",leftIndex);
		}else{
			if(rightIndex == 13){
				
			}else if(rightIndex == 0){
				myblur();
				rightIndex = 3;
				myfocus(rightIndex);
			}else if(rightIndex == 1){
				if(begin_year01 == 0){
				
				}else{
					begin_year01 --;
					$("begin_year01").innerHTML = begin_year01;
				}
			}else if(rightIndex == 2){
				if(begin_month01 == 1){
					
				}else{
					begin_month01 --;
					begin_month01 = (begin_month01.toString().length == 1  ?  '0' : '') +begin_month01;
					$("begin_month01").innerHTML = begin_month01;
				}
			}else if(rightIndex == 3){
				if(begin_day01 == 1){
					
				}else{
					//alert(begin_day01)
					begin_day01 --;
					begin_day01 = (begin_day01.toString().length == 1  ?  '0' : '') +begin_day01;
					$("begin_day01").innerHTML = begin_day01;
				}
			}else if(rightIndex == 4){
				if(begin_hour01 == 0){
					
				}else{
					begin_hour01 --;
					begin_hour01 = (begin_hour01.toString().length == 1  ?  '0' : '') +begin_hour01;
					$("begin_hour01").innerHTML = begin_hour01;
				}
			}else if(rightIndex == 5){
				if(begin_minute01 == 0){
					
				}else{
					begin_minute01 --;
					begin_minute01 = (begin_minute01.toString().length == 1  ?  '0' : '') +begin_minute01;
					$("begin_minute01").innerHTML = begin_minute01;
				}
			}else if(rightIndex == 6){
				if(begin_second01 == 0){
					
				}else{
					begin_second01 --;
					begin_second01 = (begin_second01.toString().length == 1  ?  '0' : '') +begin_second01;
					$("begin_second01").innerHTML = begin_second01;
				}
			}else if(rightIndex == 7){
				end_year01 --;
				$("end_year01").innerHTML = end_year01;
			}else if(rightIndex == 8){
				if(end_month01 == 1){
					
				}else{
					end_month01 --;
					end_month01 = (end_month01.toString().length == 1  ?  '0' : '') +end_month01;
					$("end_month01").innerHTML = end_month01;
				}
			}else if(rightIndex == 9){
				if(end_day01 == 1){
					
				}else{
					end_day01 --;
					end_day01 = (end_day01.toString().length == 1  ?  '0' : '') +end_day01;
					$("end_day01").innerHTML = end_day01;
				}
			}else if(rightIndex == 10){
				if(end_hour01 == 0){
					
				}else{
					end_hour01 --;
					end_hour01 = (end_hour01.toString().length == 1  ?  '0' : '') +end_hour01;
					$("end_hour01").innerHTML = end_hour01;
				}
			}else if(rightIndex == 11){
				if(end_minute01 == 0){
					
				}else{
					end_minute01 --;
					end_minute01 = (end_minute01.toString().length == 1  ?  '0' : '') +end_minute01;
					$("end_minute01").innerHTML = end_minute01;
				}
			}else if(rightIndex == 12){
				if(end_second01 == 0){
					
				}else{
					end_second01 --;
					end_second01 = (end_second01.toString().length == 1  ?  '0' : '') +end_second01;
					$("end_second01").innerHTML = end_second01;
				}
			}
		}
	}
	area.right = function(){
		if(areaIndex == 0){
			myblur();
			channelObj[leftIndex].className = "red";
			areaIndex = 1;
			rightIndex = 0;
			myfocus(rightIndex);
		}else{
			if(rightIndex == 0){//名字
				
			}else if(rightIndex == 12){//确认
				myblur();
				rightIndex ++;
				myfocus(rightIndex);
			}else if(rightIndex == 2){
				if(begin_month01 == 4||begin_month01 == 6||begin_month01 == 9||begin_month01 == 11){
					if(begin_day01 > 30){
						begin_day01 = 30;
						$("begin_day01").innerHTML = begin_day01;
						myblur();
						rightIndex ++ ;
						myfocus(rightIndex);
					}else{
						myblur();
						rightIndex ++ ;
						myfocus(rightIndex);
					}
				}else if(begin_month01 == 2){
					if(begin_day01 > 28){
						begin_day01 = 28;
						$("begin_day01").innerHTML = begin_day01;
						myblur();
						rightIndex ++ ;
						myfocus(rightIndex);
					}else{
						myblur();
						rightIndex ++ ;
						myfocus(rightIndex);
					}
				}else{
					myblur();
					rightIndex ++ ;
					myfocus(rightIndex);
				}
			}else if(rightIndex == 8){
				if(end_month01 == 4||end_month01 == 6||end_month01 == 9||end_month01 == 11){
					if(end_day01 > 30){
						end_day01 = 30;
						$("end_day01").innerHTML = end_day01;
						myblur();
						rightIndex ++ ;
						myfocus(rightIndex);
					}else{
						myblur();
						rightIndex ++ ;
						myfocus(rightIndex);
					}
				}else if(end_month01 == 2){
					if(end_day01 > 28){
						end_day01 = 28;
						$("end_day01").innerHTML = end_day01;
						myblur();
						rightIndex ++ ;
						myfocus(rightIndex);
					}else{
						myblur();
						rightIndex ++ ;
						myfocus(rightIndex);
					}
				}else{
					myblur();
					rightIndex ++ ;
					myfocus(rightIndex);
				}
			}else if(rightIndex == 13){//确认
				
			}else{
				myblur();
				rightIndex ++ ;
				myfocus(rightIndex);
			}
		}
		
	}
	area.left = function(){
		if(areaIndex == 0){
			
		}else{
			if(rightIndex == 0){
				myblur();
				areaIndex = 0;
				myfocus(leftIndex);	
			}else if(rightIndex == 2){
				if(begin_month01 == 4||begin_month01 == 6||begin_month01 == 9||begin_month01 == 11){
					if(begin_day01 > 30){
						begin_day01 = 30;
						$("begin_day01").innerHTML = begin_day01;
						myblur();
						rightIndex -- ;
						myfocus(rightIndex);
					}else{
						myblur();
						rightIndex -- ;
						myfocus(rightIndex);
					}
				}else if(begin_month01 == 2){
					if(begin_day01 > 28){
						begin_day01 = 28;
						$("begin_day01").innerHTML = begin_day01;
						myblur();
						rightIndex -- ;
						myfocus(rightIndex);
					}else{
						myblur();
						rightIndex -- ;
						myfocus(rightIndex);
					}
				}else{
					myblur();
					rightIndex -- ;
					myfocus(rightIndex);
				}
			}else if(rightIndex == 8){
				if(end_month01 == 4||end_month01 == 6||end_month01 == 9||end_month01 == 11){
					if(end_day01 > 30){
						end_day01 = 30;
						$("end_day01").innerHTML = end_day01;
						myblur();
						rightIndex -- ;
						myfocus(rightIndex);
					}else{
						myblur();
						rightIndex -- ;
						myfocus(rightIndex);
					}
				}else if(end_month01 == 2){
					if(end_day01 > 28){
						end_day01 = 28;
						$("end_day01").innerHTML = end_day01;
						myblur();
						rightIndex -- ;
						myfocus(rightIndex);
					}else{
						myblur();
						rightIndex -- ;
						myfocus(rightIndex);
					}
				}else{
					myblur();
					rightIndex -- ;
					myfocus(rightIndex);
				}
			}else if(rightIndex == 13){
				myblur();
				areaIndex = 0;
				myfocus(leftIndex);	
			}else{
				myblur();
				rightIndex -- ;
				myfocus(rightIndex);
			}
		}
	}
	function marq(i){
		//alert(channelList[i])
	    //var channelName = getname(channelList[i]);
		//alert(channelList[i].channelName)
		 var channelName = channelList[i].channelName;
		//var cnb = util.str.addZero(parseInt(channelList[i].num), 3)
		if(channelName.length > 13){
			
			maq($("list_pad"+i),channelName,25,311);
		}
	}
	
	function unMarq(i){
		delemaq();
	   // var channelName = getname(channelList[i]);
		var channelName = channelList[i].channelName;
		//var cnb = util.str.addZero(parseInt(channelList[i].num), 3)
		if(channelName.length > 13){
			$("list_pad"+i).innerHTML = getStrChineseLen(channelName,13);	
		}
	}
	function myfocus(i){
		if(areaIndex == 0){		
			document.getElementById("time_focus").style.top =25 + i * 51 +"px";
			$("time_focus").style.visibility = "visible";
			channelObj[i].className = "red";
			//alert("channelObj[i]:"+channelObj[i].innerHTML)
			var temp = channelObj[i].getAttribute("id");
			temp = parseInt(temp.substring( temp.indexOf("d")+1 ),10);
			//marq(temp);
		}else{
			if(rightIndex == 0){
				$("input_name").focus();
			}else if(rightIndex == 1){
				$("date_focus1").style.visibility = "visible";
				$("date_focus1").style.left = 255 +"px";
				$("date_focus1").style.top = 110 +"px";
			}else if(rightIndex == 2){
				$("date_focus").style.visibility = "visible";
				$("date_focus").style.left = 346 +"px";
				$("date_focus").style.top = 110 +"px";
			}else if(rightIndex == 3){
				$("date_focus").style.visibility = "visible";
				$("date_focus").style.left = 404 +"px";
				$("date_focus").style.top = 110 +"px";
			}else if(rightIndex == 4){
				$("date_focus").style.visibility = "visible";
				$("date_focus").style.left = 475 +"px";
				$("date_focus").style.top = 110 +"px";
			}else if(rightIndex == 5){
				$("date_focus").style.visibility = "visible";
				$("date_focus").style.left =523 +"px";
				$("date_focus").style.top = 110 +"px";
			}else if(rightIndex == 6){
				$("date_focus").style.visibility = "visible";
				$("date_focus").style.left = 575 +"px";
				$("date_focus").style.top = 110 +"px";
			}else if(rightIndex == 7){
				$("date_focus1").style.visibility = "visible";
				$("date_focus1").style.left = 255 +"px";
				$("date_focus1").style.top = 182 +"px";
			}else if(rightIndex == 8){
				$("date_focus").style.visibility = "visible";
				$("date_focus").style.left = 346 +"px";
				$("date_focus").style.top = 182 +"px";
			}else if(rightIndex == 9){
				$("date_focus").style.visibility = "visible";
				$("date_focus").style.left = 404 +"px";
				$("date_focus").style.top = 182 +"px";
			}else if(rightIndex == 10){
				$("date_focus").style.visibility = "visible";
				$("date_focus").style.left = 475 +"px";
				$("date_focus").style.top = 182 +"px";
			}else if(rightIndex == 11){
				$("date_focus").style.visibility = "visible";
				$("date_focus").style.left =523 +"px";
				$("date_focus").style.top = 182 +"px";
			}else if(rightIndex == 12){
				$("date_focus").style.visibility = "visible";
				$("date_focus").style.left = 575 +"px";
				$("date_focus").style.top = 182 +"px";
			}else if(rightIndex == 13){
				document.getElementById("right_focus").style.background="url(images/time_focus.png) no-repeat";
			}
		}
	}
	function myblur(){
		if(areaIndex == 0){
			$("time_focus").style.visibility = "hidden";
			channelObj[leftIndex].className = "black";
			var temp  = channelObj[leftIndex].getAttribute("id");
			temp = parseInt(temp.substring( temp.indexOf("d")+1 ),10);
			//unMarq(temp);
		}else{
			if(rightIndex == 0){
				$("input_name").blur();
			}else if(rightIndex == 13){
				document.getElementById("right_focus").style.background="url(images/time_focus1.png) no-repeat";
			}else{
				$("date_focus1").style.visibility = "hidden";
				$("date_focus").style.visibility = "hidden";
			}
		}
	}
	area.showright = function(){
		$("input_name").value = channelList[precount*(pageIndex-1)+leftIndex].channelName;
	}
	area.showTime = function(){
		var  date = new Date();
		//var  beginstr = date.getFullYear() + "/" + ((date.getMonth() + 1).toString().length == 1  ?  '0' : '') +(date.getMonth() + 1) + "/" +(date.getDate().toString().length == 1  ?  '0' : '')+ date.getDate() + " "+(date.getHours().toString().length == 1  ?  '0' : '') + date.getHours() + ":" + (date.getMinutes().toString().length == 1  ?  '0' : '') + date.getMinutes()+ ":" + (date.getSeconds().toString().length == 1  ?  '0' : '') + date.getSeconds();
		var begin_year = date.getFullYear() +" ";
		begin_year01 = begin_year.substr(0, 4);
		$("begin_year01").innerHTML = begin_year01;
		var begin_month = ((date.getMonth() + 1).toString().length == 1  ?  '0' : '') +(date.getMonth() + 1) +" ";
		begin_month01 = begin_month.substr(0, 2);
		$("begin_month01").innerHTML = begin_month01;
		var begin_day = (date.getDate().toString().length == 1  ?  '0' : '')+ date.getDate()+" ";
		begin_day01 = begin_day.substr(0, 2);
		$("begin_day01").innerHTML = begin_day01;
		var begin_hour = (date.getHours().toString().length == 1  ?  '0' : '') + date.getHours()+" ";
		begin_hour01 = begin_hour.substr(0, 2);
		$("begin_hour01").innerHTML = begin_hour01;
		var begin_minute = (date.getMinutes().toString().length == 1  ?  '0' : '') + date.getMinutes()+" ";
		begin_minute01 = begin_minute.substr(0, 2);
		$("begin_minute01").innerHTML = begin_minute01;
		var begin_second = (date.getSeconds().toString().length == 1  ?  '0' : '') + date.getSeconds()+" ";
		begin_second01 = begin_second.substr(0, 2);
		$("begin_second01").innerHTML = begin_second01;
		var end_year = date.getFullYear() +" ";
		end_year01 = end_year.substr(0, 4);
		$("end_year01").innerHTML = end_year01;
		var end_month = ((date.getMonth() + 1).toString().length == 1  ?  '0' : '') +(date.getMonth() + 1) +" ";
		end_month01 = end_month.substr(0, 2);
		$("end_month01").innerHTML = end_month01;
		var end_day = (date.getDate().toString().length == 1  ?  '0' : '')+ date.getDate()+" ";
		end_day01 = end_day.substr(0, 2);
		$("end_day01").innerHTML = end_day01;
		var end_hour = (date.getHours().toString().length == 1  ?  '0' : '') + date.getHours()+" ";
		end_hour01 = end_hour.substr(0, 2);
		$("end_hour01").innerHTML = end_hour01;
		var end_minute = (date.getMinutes().toString().length == 1  ?  '0' : '') + date.getMinutes()+" ";
		end_minute01 = end_minute.substr(0, 2);
		$("end_minute01").innerHTML = end_minute01;
		var end_second = (date.getSeconds().toString().length == 1  ?  '0' : '') + date.getSeconds()+" ";
		end_second01 = end_second.substr(0, 2);
		$("end_second01").innerHTML = end_second01;
	}
	area.href = function(){
		if(areaIndex == 0){
			
		}else{
			if(rightIndex == 13){
				
				var  name = $("input_name").value;
				//var  beginstr = $("input_begin").value;//2014/03/27/10:00:00
				//alert("begin:"+beginstr)
				//var  begin = beginstr.substr(0, 4)+beginstr.substr(5, 2)+beginstr.substr(8, 2)+beginstr.substr(11, 2)+beginstr.substr(14, 2)+beginstr.substr(17, 2)+beginstr.substr(20, 2);
				//var  endstr = $("input_end").value;//2014/03/27/11:00:00
				//alert("endstr:"+endstr)
				//var  end = endstr.substr(0, 4)+endstr.substr(5, 2)+endstr.substr(8, 2)+endstr.substr(11, 2)+endstr.substr(14, 2)+endstr.substr(17, 2)+endstr.substr(20, 2);
				var begin = begin_year01 + begin_month01 + begin_day01 + begin_hour01 + begin_minute01 + begin_second01;
				var end = end_year01 + end_month01 + end_day01 + end_hour01 + end_minute01 + end_second01;
				if(name ==　""){
					$("tipTip").style.visibility = "visible";
					$("tipTip_content").innerHTML = "输入条件不能为空";
					clearTimeout(tip_timer);
					tip_timer = setTimeout(function (){hiddentip()},2000);
				}/*else if(begin.length>14||begin.length<14||end.length>14||end.length<14){
					$("tipTip").style.visibility = "visible";
					$("tipTip_content").innerHTML = "请输入正确的条件";
					clearTimeout(tip_timer);
					tip_timer = setTimeout(function (){hiddentip()},2000);
				}*/else{
					try{
						//http://ip:port/AddNpvrTask?userCode=123&channelId=1&startDateTime=20130219014251&endDateTime=20130219014251&programName=test
						//alert(channelList[precount*(pageIndex-1)+leftIndex].channelId)
						var url = MY_PORTAL_ADDR+"/AddNpvrTask?userCode="+OVT_CA.NO()+"&channelId="+channelList[precount*(pageIndex-1)+leftIndex].channelId+"&startDateTime="+begin+"&endDateTime="+end+"&programName="+name;
						/*dataResult = data.result;
						*/
						Ajax.request(url,{
							success : function(data){
								//var data = {"result":"200"} 
								dataResult = data.result;
								//area.DeleteNew(taskIndex);	
								showTip(data);
							},
							failure : function(data){
								if( retried ){
									ajaxFlag = false;
									$("tipTip").style.visibility = "visible";
									$("tipTip_content").innerHTML = "添加失败";
									clearTimeout(tip_timer);
									tip_timer = setTimeout(function (){hiddentip()},2000);
								}else{
									setTimeout( function(){  getData(true) },300 );		
								}
							}
						});
					}catch(e){
						GF_WebPrint("添加任务："+e)
						/*$("tipTip").style.visibility = "visible";
						$("tipTip_content").innerHTML = "添加失败";
						clearTimeout(tip_timer);
						tip_timer = setTimeout(function (){hiddentip()},2000);
						//setTimeout(function(){ 
	//						window.location = "../index/index.html"; }
	//					,3000)*/
					}
				}
			}else{
				
			}
		}
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
	return area; 
}());

function init(){
	Navigation.disableDefaultNavigation();//禁用超链接自动聚焦功
	//Navigation.disableHighlight();
	listArea.showTime();
	listArea.init();
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
					listArea.init();
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
var focustimeobj;
var focustimeobj2;
function maq(obj,name,font_size,blockwid){
	focustimeobj2 = setTimeout(function(){
	var textwid = 0;
	for (var i = 0,c,length = name.length; i < length; i++) {
	     c = name.charCodeAt(i);
		 if ((c >= 0x0001 && c <= 0x007e) || (0xff60<=c && c<=0xff9f)) {
			 textwid++;
		 }else{
		   textwid+=2;
		 }
	} 
	textwid = Math.ceil(font_size/2*textwid);
	obj.innerHTML = "<span id='divout'><span id='divin'>"+ name +"</span></span>";
	var divout = $('divout');
	var divin = $('divin');
	divout.style.display = 'block';
	divout.style.position = 'relative';
	divout.style.width = blockwid + 'px';
	divout.style.overflowX = 'hidden';
	divin.style.position = 'relative';
	divin.style.left = '0px';
	divin.style.whiteSpace = 'nowrap';
	var dire_flag = 0;
	var pace = 10;
	focustimeobj = setInterval(function(){
			if(dire_flag == 0){
			    divin.style.left = parseInt(divin.style.left) - pace + 'px';
				if(-parseInt(divin.style.left) >= textwid){
					dire_flag = 1;
				}
			}
			else{
			    divin.style.left = blockwid - pace + 'px';
				dire_flag = 0;
			}
		},150);	
	},800);
}
function delemaq(){
	clearTimeout(focustimeobj2);  
	clearInterval(focustimeobj); 
}

function  getPositionForInput(ctrl){ 
	var CaretPos = 0; 
	if (document.selection) { // IE Support 
		ctrl.focus(); 
		var Sel = document.selection.createRange(); 
		Sel.moveStart('character', -ctrl.value.length); 
		CaretPos = Sel.text.length; 
	}else if(ctrl.selectionStart || ctrl.selectionStart == '0'){// Firefox support 
		CaretPos = ctrl.selectionStart; 
	} 
	return (CaretPos); 
} 

//获取索引
var Navigation_Index = getCookie("channel_id");
if(typeof(Navigation_Index)=="undefined"||Navigation_Index==""||typeof(parseInt(Navigation_Index))!="number"){
	leftIndex=0; 
}else{
	//alert("11111---"+Navigation_Index)
	leftIndex = parseInt(Navigation_Index);
	//navigationArea.myfocus();
}
//获取页数索引
var Page_Index = getCookie("timepage_id");
if(typeof(Page_Index)=="undefined"||Page_Index==""||typeof(parseInt(Page_Index))!="number"){
	pageIndex=1; 
}else{
	//alert("11111---"+Navigation_Index)
	pageIndex = parseInt(Page_Index);
	//navigationArea.myfocus();
}