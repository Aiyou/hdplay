// JavaScript Document
var mExtend = new QjyScript();
var pageSize = 7;  
//var videoLastCount = pageSize;      //最后一页节目个数
//var otherLastCount = pageSize;      //最后一页节目个数

var videoPageTotal = 0;
var audioPageTotal = 0;
var otherPageTotal = 0;

var videoTotal = 0;
var audioTotal = 0;
var otherTotal = 0; 
              
var pageIndex_v=1;	
var pageIndex_a=1;	
var pageIndex_o=1;					
var areaIndex = 0;
var menuIndex = 0;
var videoIndex = 0;
var audioIndex = 0;
var otherIndex = 0;
var pageIndex = 0;

//var lang_flag = 1;  //0中文，1英文
//(Turkish = tr),(English = eng),(French = fr),(German = gr)
var lang_value = mExtend.exec("OvtGetConfig","language");
//var lang_value  ="eng"
var lang_flag = 0;  //0中文，1英文
if(lang_value == "tr"){ //Turkish
	//lang_flag = 0;//Turkish
	lang_flag = 0;
}else if(lang_value == "eng"){ //English
	lang_flag = 0;
}else if(lang_value == "fr"){ //French
	//lang_flag = 2;  //French
	lang_flag = 0; //English
}else if(lang_value == "gr"){ //German
	//lang_flag = 3; //German
	lang_flag = 0; //English
}

var dataLang = {"totalCount":"5","langues":[{"title1":"本地播放","title2":"返回","menu1":"视&nbsp&nbsp&nbsp频","menu2":"音&nbsp&nbsp&nbsp频","menu3":"自定义","tiptext1":"上页","tiptext2":"下页","tiptext3":"请稍后，正在读取数据……"},{"title1":"Media Player","title2":"Back","menu1":"Video","menu2":"Audio","menu3":"Other","tiptext1":"prev","tiptext2":"next","tiptext3":"Reading data,please wait"}]}

var menuArea = (function(){
	var area = {};
	var videoFiles = [];   //视频
	var audioFiles = [];	//音频 
	var otherFiles = [];	//其它
	var vodFiles =[]; //视频+音频
	area.loadChannel = function(){
		try{
			var tempVodFiles = mExtend.exec("OvtGetUsbMediaFilePath","usb_media_path");
			//var tempVodFiles = '[{"file":"file:///mnt1/犬夜叉.mp4","name":"犬夜叉.mp4"},{"file":"file:///mnt1/来自星星的你.mp4","name":"来自星星的你.mp4"},{"file":"file:///mnt1/ovt/ipadstb/ipadstb/anweb/video/skb-1.ts","name":"skb-1.ts"},{"file":"file:///mnt1/ovt/ipadstb/ipadstb/anweb/video/skb-2.ts","name":"skb-2.ts"},{"file":"file:///mnt1/ovt/ipadstb/ipadstb/anweb/video/skb-3.ts","name":"skb-3.ts"},{"file":"file:///mnt1/ovt/ipadstb/ipadstb/anweb/video/video.mp4","name":"video.mp4"},{"file":"file:///mnt1/ovt/20140318/Bruno Mars-Marry You(来自星星的你剧情版).mp3","name":"Bruno Mars-Marry You(来自星星的你剧情版).mp3"},{"file":"file:///mnt1/ovt/20140318/Bruno Mars-Marry You.mp3","name":"Bruno Mars-Marry You.mp3"},{"file":"file:///mnt1/ovt/20140318/J-Min-Stand Up(致美丽的你OST).mp3","name":"J-Min-Stand Up(致美丽的你OST).mp3"},{"file":"file:///mnt1/ovt/20140318/【芒果捞】宝贝去哪儿 - 爸爸去哪儿大电影主题曲 - 妈咪宝贝.mp3","name":"【芒果捞】宝贝去哪儿 - 爸爸去哪儿大电影主题曲 - 妈咪宝贝.mp3"},{"file":"file:///mnt1/ovt/20140318/张亮&张悦轩-我不是男神.mp3","name":"张亮&张悦轩-我不是男神.mp3"},{"file":"file:///mnt1/ovt/20140318/杨宗纬 - 我们好像在哪见过 (feat. 叶蓓).mp3","name":"杨宗纬 - 我们好像在哪见过 (feat. 叶蓓).mp3"},{"file":"file:///mnt1/ovt/20140318/铃声-蜡笔小新(DJ版).mp3","name":"铃声-蜡笔小新(DJ版).mp3"},{"file":"file:///mnt1/犬夜叉.mp4","name":"犬夜叉.mp4"},{"file":"file:///mnt1/来自星星的你.mp4","name":"来自星星的你.mp4"},{"file":"file:///mnt1/ovt/ipadstb/ipadstb/anweb/video/skb-1.ts","name":"skb-1.ts"},{"file":"file:///mnt1/ovt/ipadstb/ipadstb/anweb/video/skb-2.ts","name":"skb-2.ts"},{"file":"file:///mnt1/ovt/ipadstb/ipadstb/anweb/video/skb-3.ts","name":"skb-3.ts"},{"file":"file:///mnt1/ovt/20140318/Bruno Mars-Marry You.mp3","name":"Bruno Mars-Marry You.mp3"},{"file":"file:///mnt1/ovt/20140318/J-Min-Stand Up(致美丽的你OST).mp3","name":"J-Min-Stand Up(致美丽的你OST).mp3"},{"file":"file:///mnt1/ovt/20140318/【芒果捞】宝贝去哪儿 - 爸爸去哪儿大电影主题曲 - 妈咪宝贝.mp3","name":"【芒果捞】宝贝去哪儿 - 爸爸去哪儿大电影主题曲 - 妈咪宝贝.mp3"},{"file":"file:///mnt1/ovt/20140318/张亮&张悦轩-我不是男神.mp3","name":"张亮&张悦轩-我不是男神.mp3"},{"file":"file:///mnt1/ovt/20140318/杨宗纬 - 我们好像在哪见过 (feat. 叶蓓).mp3","name":"杨宗纬 - 我们好像在哪见过 (feat. 叶蓓).mp3"},{"file":"file:///mnt1/ovt/20140318/铃声-蜡笔小新(DJ版).mp3","name":"铃声-蜡笔小新(DJ版).mp3"},{"file":"file:///mnt1/ovt/ipadstb/ipadstb/anweb/video/skb-1.ts","name":"skb-1.ts"},{"file":"file:///mnt1/ovt/ipadstb/ipadstb/anweb/video/skb-2.ts","name":"skb-2.ts"},{"file":"file:///mnt1/ovt/ipadstb/ipadstb/anweb/video/skb-3.ts","name":"skb-3.ts"},{"file":"file:///mnt1/ovt/ipadstb/ipadstb/anweb/video/skb-1.ts","name":"skb-1.ts"},{"file":"file:///mnt1/ovt/ipadstb/ipadstb/anweb/video/skb-2.ts","name":"skb-2.ts"},{"file":"file:///mnt1/ovt/ipadstb/ipadstb/anweb/video/skb-3.ts","name":"skb-3.ts"}]';   //3page
			//var tempVodFiles = '[{"file":"file:///mnt1/犬夜叉.mp4","name":"犬夜叉.mp4"},{"file":"file:///mnt1/来自星星的你.mp4","name":"来自星星的你.mp4"},{"file":"file:///mnt1/ovt/ipadstb/ipadstb/anweb/video/skb-1.ts","name":"skb-1.ts"},{"file":"file:///mnt1/ovt/ipadstb/ipadstb/anweb/video/skb-2.ts","name":"skb-2.ts"},{"file":"file:///mnt1/ovt/ipadstb/ipadstb/anweb/video/skb-3.ts","name":"skb-3.ts"},{"file":"file:///mnt1/ovt/ipadstb/ipadstb/anweb/video/video.mp4","name":"video.mp4"},{"file":"file:///mnt1/ovt/20140318/Bruno Mars-Marry You(来自星星的你剧情版).mp3","name":"Bruno Mars-Marry You(来自星星的你剧情版).mp3"},{"file":"file:///mnt1/ovt/20140318/Bruno Mars-Marry You.mp3","name":"Bruno Mars-Marry You.mp3"},{"file":"file:///mnt1/ovt/20140318/J-Min-Stand Up(致美丽的你OST).mp3","name":"J-Min-Stand Up(致美丽的你OST).mp3"},{"file":"file:///mnt1/ovt/20140318/【芒果捞】宝贝去哪儿 - 爸爸去哪儿大电影主题曲 - 妈咪宝贝.mp3","name":"【芒果捞】宝贝去哪儿 - 爸爸去哪儿大电影主题曲 - 妈咪宝贝.mp3"},{"file":"file:///mnt1/ovt/20140318/张亮&张悦轩-我不是男神.mp3","name":"张亮&张悦轩-我不是男神.mp3"},{"file":"file:///mnt1/ovt/20140318/杨宗纬 - 我们好像在哪见过 (feat. 叶蓓).mp3","name":"杨宗纬 - 我们好像在哪见过 (feat. 叶蓓).mp3"},{"file":"file:///mnt1/ovt/20140318/铃声-蜡笔小新(DJ版).mp3","name":"铃声-蜡笔小新(DJ版).mp3"},{"file":"file:///mnt1/犬夜叉.mp4","name":"犬夜叉.mp4"},{"file":"file:///mnt1/来自星星的你.mp4","name":"来自星星的你.mp4"},{"file":"file:///mnt1/ovt/ipadstb/ipadstb/anweb/video/skb-1.ts","name":"skb-1.ts"},{"file":"file:///mnt1/ovt/ipadstb/ipadstb/anweb/video/skb-2.ts","name":"skb-2.ts"},{"file":"file:///mnt1/ovt/ipadstb/ipadstb/anweb/video/skb-3.ts","name":"skb-3.ts"}]';   //2page
			//var tempVodFiles = '[{"file":"file:///mnt1/犬夜叉.mp4","name":"犬夜叉.mp4"},{"file":"file:///mnt1/来自星星的你.mp4","name":"来自星星的你.mp4"},{"file":"file:///mnt1/ovt/ipadstb/ipadstb/anweb/video/skb-1.ts","name":"skb-1.ts"},{"file":"file:///mnt1/ovt/ipadstb/ipadstb/anweb/video/skb-2.ts","name":"skb-2.ts"},{"file":"file:///mnt1/ovt/ipadstb/ipadstb/anweb/video/skb-3.ts","name":"skb-3.ts"},{"file":"file:///mnt1/ovt/ipadstb/ipadstb/anweb/video/video.mp4","name":"video.mp4"},{"file":"file:///mnt1/ovt/20140318/Bruno Mars-Marry You(来自星星的你剧情版).mp3","name":"Bruno Mars-Marry You(来自星星的你剧情版).mp3"},{"file":"file:///mnt1/ovt/20140318/Bruno Mars-Marry You.mp3","name":"Bruno Mars-Marry You.mp3"},{"file":"file:///mnt1/ovt/20140318/J-Min-Stand Up(致美丽的你OST).mp3","name":"J-Min-Stand Up(致美丽的你OST).mp3"},{"file":"file:///mnt1/ovt/20140318/【芒果捞】宝贝去哪儿 - 爸爸去哪儿大电影主题曲 - 妈咪宝贝.mp3","name":"【芒果捞】宝贝去哪儿 - 爸爸去哪儿大电影主题曲 - 妈咪宝贝.mp3"}]';   //1page
			tempVodFiles = tempVodFiles.substring(1,tempVodFiles.lastIndexOf("]"));
			var tempTvTxt = mExtend.exec("OvtGetUserParams","play_list");//获取tv.txt文件里的播放内容
			//$("aaa").innerHTML = tempVodFiles;
			//var tempTvTxt = 'name1,http://168.1.1.11/video/skb/skb.m3u8\r\nname2,http://168.1.1.11/video/skb/skb.m3u8\r\n名字3,http://168.1.1.11/video/skb/skb.m3u8'
			if(tempTvTxt == ""){
				tempTvTxt = "";
			}else{
				tempTvTxt = parseStrToJson( tempTvTxt );
			}
			vodFiles = tempVodFiles;
			vodFiles = "["+ vodFiles + "]";
			vodFiles = strToJson( vodFiles );
			otherFiles = tempTvTxt;   //其它数据
			otherFiles = "["+ otherFiles + "]";
			otherFiles = strToJson( otherFiles );
			for(var i = 0;i<vodFiles.length;i++){
				var splitStr = ( vodFiles[i].file ).lastIndexOf(".");
				//alert(splitStr)
				var formatStr = ( vodFiles[i].file ).substring(parseInt(splitStr,10)+1);
				//alert(formatStr)
				switch(formatStr)
				{
					case "ts":
					case "flv":
					case "mpeg4":
					case "mkv":
					case "mpg":
					case "avi":
						videoFiles.push(vodFiles[i]);
						break;
					case "mp3":
						audioFiles.push(vodFiles[i]);
						break;
					case "mp4":
						videoFiles.push(vodFiles[i]);
						audioFiles.push(vodFiles[i]);
						break;				
				}
			}
			videoTotal = videoFiles.length;
			audioTotal = audioFiles.length;
			otherTotal = otherFiles.length;
			//otherLastCount = otherTotal%pageSize==0?pageSize:otherTotal%pageSize;
			videoPageTotal = parseInt(videoTotal%pageSize?(videoTotal/pageSize)+1:(videoTotal/pageSize)); 
			audioPageTotal = parseInt(audioTotal%pageSize?(audioTotal/pageSize)+1:(audioTotal/pageSize)); 
			otherPageTotal = parseInt(otherTotal%pageSize?(otherTotal/pageSize)+1:(otherTotal/pageSize));
			area.myfocus();
			$("tip_area").style.visibility = "hidden";
			//showVideo(0);
		}catch(e){
			GF_WebPrint("本地播放列表:"+e);
		}
	}
	//新数据格式,把字符串转为json
	//第二版数据格式修改:名称,播放地址;名称,播放地址;
	function parseStrToJson(str){
		if( !str ) return false;
		var tempArr = str.split("\r\n")	
		var joinStr = [];
		for(var i = 0,len = tempArr.length; i < len; i++){
			var splitPositon = tempArr[i].indexOf(",");
			joinStr.push('{"name":"'+tempArr[i].substring(0,splitPositon)+'","file":"'+tempArr[i].substring(splitPositon+1,tempArr[i].length)+'"}');
		}
		return joinStr.toString();
	}
	function showVideo(i){
		//alert("ccc")
		var htmlVideo = "";
		for(var i=(pageSize*pageIndex_v-pageSize); i<pageSize*pageIndex_v; i++){
			//objVideo = videoFiles[i];
			if(videoFiles[i] == undefined){
				videoFiles[i] = {"name" : ""}
			}
			//html += '<div class="pro_list" id="list_name' + i + '">' + channelList[i].name + '</div>';
			var nameSplit_v = ( videoFiles[i].name ).lastIndexOf(".");
			if( nameSplit_v == -1 ){
				var videoName = videoFiles[i].name;		
			}else{
				var videoName = ( videoFiles[i].name ).substring(0,nameSplit_v);
			}
			var videoName = getStrChineseLen(videoName,22);
			//alert(channelList[i].name)
			//var channelName = getStrChineseLen(channelList[i].name,12);
			htmlVideo += '<div class="pro_list" id="list_name' + i + '">' + videoName + '</div>';
		}
		$("program_list").innerHTML = htmlVideo;
		
		showPage();
	}
	
	function showAudio(i){
		var htmlAudio = "";
		for(var i=(pageSize*pageIndex_a-pageSize); i<pageSize*pageIndex_a; i++){
			//obj = audioFiles[i];
			if(audioFiles[i] == undefined){
				audioFiles[i] = {"name" : ""}
			}
			//html += '<div class="pro_list" id="list_name' + i + '">' + channelList[i].name + '</div>';
			var nameSplit_a = ( audioFiles[i].name ).lastIndexOf(".");
			if( nameSplit_a == -1 ){
				var audioName = audioFiles[i].name;		
			}else{
				var audioName = ( audioFiles[i].name ).substring(0,nameSplit_a);
			}
			var audioName = getStrChineseLen(audioName,22);
			//alert(channelList[i].name)
			//var channelName = getStrChineseLen(channelList[i].name,12);
			htmlAudio += '<div class="pro_list" id="list_name' + i + '">' + audioName + '</div>';
		}
		$("program_list").innerHTML = htmlAudio;
		showPage();
		//showPageup();
		//showPagedown();
	}
	function showOther(i){
		var htmlOther = "";
		for(var i=(pageSize*pageIndex_o-pageSize); i<pageSize*pageIndex_o; i++){
			obj = audioFiles[i];
			if(otherFiles[i] == undefined){
				otherFiles[i] = {"name" : ""}
			}
			//html += '<div class="pro_list" id="list_name' + i + '">' + channelList[i].name + '</div>';
			var nameSplit_o = ( otherFiles[i].name ).lastIndexOf(".");
			if( nameSplit_o == -1 ){
				var otherName = otherFiles[i].name;		
			}else{
				var otherName = ( otherFiles[i].name ).substring(0,nameSplit_o);
			}
			var otherName = getStrChineseLen(otherName,22);
			//alert(channelList[i].name)
			//var channelName = getStrChineseLen(channelList[i].name,12);
			htmlOther += '<div class="pro_list" id="list_name' + i + '">' + otherName + '</div>';
		}
		$("program_list").innerHTML = htmlOther;
		showPage();
		//showPageup();
		//showPagedown();
	}
	area.up = function(){
		if(areaIndex == 0){//左侧类型
			if(menuIndex == 0){
				
			}else{
				area.myblur();
				menuIndex　--;
				pageIndex_v = 1;
				pageIndex_a = 1;
				pageIndex_o = 1;
				area.myfocus();
			}
		}else if(areaIndex == 1){//右侧列表
		
			if(menuIndex == 0){
				if(videoIndex == 0){
					
				}else{
					area.listblur();
					videoIndex --;
					area.listfocus(videoIndex);
				}
			}else if(menuIndex == 1){
				if(audioIndex == 0){
					
				}else{
					area.listblur();
					audioIndex --;
					area.listfocus(audioIndex);
				}
			}else if(menuIndex == 2){
				if(otherIndex == 0){
					
				}else{
					area.listblur();
					otherIndex --;
					area.listfocus(otherIndex);
				}
			}
		}else{//下侧翻页
			if(menuIndex == 0){
				if(pageIndex == 0||pageIndex == 1){
					if(videoPageTotal == pageIndex_v){
						area.pageblur();
						areaIndex = 1;
						videoIndex = videoTotal - pageSize*(pageIndex_v-1) -1;
						area.listfocus(videoIndex);
					}else{
						area.pageblur();
						areaIndex = 1;
						videoIndex = 6;
						area.listfocus(videoIndex);
					}
				}
			}else if(menuIndex == 1){
				if(pageIndex == 0||pageIndex == 1){
					if(audioPageTotal == pageIndex_a){
						area.pageblur();
						areaIndex = 1;
						audioIndex = audioTotal - pageSize*(pageIndex_a-1) -1;
						area.listfocus(audioIndex);
					}else{
						area.pageblur();
						areaIndex = 1;
						audioIndex = 6;
						area.listfocus(audioIndex);
					}
				}
			}else if(menuIndex == 2){
				if(pageIndex == 0||pageIndex == 1){
					if(otherPageTotal == pageIndex_o){
						area.pageblur();
						areaIndex = 1;
						otherIndex = otherTotal - pageSize*(pageIndex_o-1) -1;
						area.listfocus(otherIndex);
					}else{
						area.pageblur();
						areaIndex = 1;
						otherIndex = pageSize-1;
						area.listfocus(otherIndex);
					}
				}
			}
		}
	}	
	area.down = function(){
		if(areaIndex == 0){
			if(menuIndex == 2){
				
			}else{
				area.myblur();
				menuIndex　++;
				pageIndex_v = 1;
				pageIndex_a = 1;
				pageIndex_o = 1;
				area.myfocus();
				//alert(menuIndex)
			}
		}else if(areaIndex == 1){
			if(menuIndex == 0){
				if(1+videoIndex+pageSize*(pageIndex_v-1)>=videoTotal){
					if(videoPageTotal == 1){
						
					}else{
						area.listblur();
						areaIndex = 2;
						pageIndex = 0;
						area.pagefocus();
					}
				}else{
					if(videoIndex == pageSize-1){
						if(videoPageTotal == 1){
						
						}else{
							area.listblur();
							areaIndex = 2;
							pageIndex = 1;
							area.pagefocus();
						}
					}else{
						area.listblur();
						videoIndex ++;
						area.listfocus(videoIndex);
					}
				}
			}else if(menuIndex == 1){
				if(1+audioIndex+pageSize*(pageIndex_a-1)>=audioTotal){
					if(audioPageTotal == 1){
						
					}else{
						area.listblur();
						areaIndex = 2;
						pageIndex = 0;
						area.pagefocus();
					}
				}else{
					if(audioIndex == pageSize-1){
						if(audioPageTotal == 1){
						
						}else{
							area.listblur();
							areaIndex = 2;
							pageIndex = 1;
							area.pagefocus()
						}
					}else{
						area.listblur();
						audioIndex ++;
						area.listfocus(audioIndex);
					}
				}
			}else if(menuIndex == 2){
				if(1+otherIndex+pageSize*(pageIndex_o-1)>=otherTotal){
					if(otherPageTotal == 1){
						
					}else{
						area.listblur();
						areaIndex = 2;
						pageIndex = 0;
						area.pagefocus()
					}
					
				}else{
					if(otherIndex == pageSize-1){
						if(otherPageTotal == 1){
						
						}else{
							area.listblur();
							areaIndex = 2;
							pageIndex = 1;
							area.pagefocus();
						}
					}else{
						area.listblur();
						otherIndex ++;
						area.listfocus(otherIndex);
					}
				}
			}
		}else{
			
		}
	}
	area.right = function(){//左侧类型
		if(areaIndex == 0){
			if(menuIndex == 0){
				videoIndex = 0;
				area.listfocus(videoIndex);
				areaIndex = 1;
			}else if(menuIndex == 1){
				audioIndex = 0;
				area.listfocus(audioIndex);
				areaIndex = 1;
			}else if(menuIndex == 2){
				audioIndex = 0;
				area.listfocus(otherIndex);
				areaIndex = 1;
			}
		}else if(areaIndex == 1){//右侧列表
			
		}else if(areaIndex == 2){//下侧翻页
		 //$("aaa").innerHTML = "aa";
		 //alert("pageIndex_v---"+pageIndex_v +"videoPageTotal------"+videoPageTotal)
		 //$("aaa").innerHTML = "pageIndex_v---"+pageIndex_v +"videoPageTotal------"+videoPageTotal+"pageIndex_a---"+pageIndex_a +"audioPageTotal------"+audioPageTotal+"pageIndex_o---"+pageIndex_o +"otherPageTotal------"+otherPageTotal;
		    if(menuIndex == 0){
				if(pageIndex_v==videoPageTotal){
					
					 //$("aaa").innerHTML = "aa";
				}else{
					if(pageIndex == 0){
						 //$("aaa").innerHTML = "bb";
						area.pageblur();
						pageIndex ++;
						area.pagefocus(pageIndex);
					}else{
						//alert("ccc")
					}
				}
			}else if(menuIndex == 1){
				if(pageIndex_a==audioPageTotal){
				
				}else{
					if(pageIndex == 0){
						 //$("aaa").innerHTML = "bb";
						area.pageblur();
						pageIndex ++;
						area.pagefocus(pageIndex);
					}else{
						//alert("ccc")
					}
				}
			}else if(menuIndex == 2){
				if(pageIndex_o==otherPageTotal){
					
				}else{
					if(pageIndex == 0){
						 //$("aaa").innerHTML = "bb";
						area.pageblur();
						pageIndex ++;
						area.pagefocus(pageIndex);
					}else{
						//alert("ccc")
					}
				}
			}
			/*if(pageIndex_v==videoPageTotal){
					
					 //$("aaa").innerHTML = "aa";
			}else if(pageIndex_a==audioPageTotal){
				
			}else if(pageIndex_o==otherPageTotal){
				
			}else{
				if(pageIndex == 0){
					 //$("aaa").innerHTML = "bb";
					area.pageblur();
					pageIndex ++;
					area.pagefocus(pageIndex);
				}else{
					//alert("ccc")
				}
			}*/
			
		}else{
			
		}
	}
	area.left = function(){
		if(areaIndex == 0){
			
		}else if(areaIndex == 1){
			if(menuIndex == 0){
				area.listblur();
				areaIndex = 0;
				menuIndex = 0;
				area.myfocus(menuIndex);
			}else if(menuIndex == 1){
				area.listblur();
				areaIndex = 0;
				menuIndex = 1;
				area.myfocus(menuIndex);
			}else if(menuIndex == 2){
				area.listblur();
				areaIndex = 0;
				menuIndex = 2;
				area.myfocus(menuIndex);
			}
		}else if(areaIndex == 2){
			//alert("pageIndex_v----"+pageIndex_v)
			if(menuIndex == 0){
				if(pageIndex_v == 1){
					//alert("111")
				}else{
					if(pageIndex == 0){
						//alert("22")
					}else{
						//alert("333")
						area.pageblur();
						pageIndex --;
						area.pagefocus(pageIndex);
					}
				}
			}else if(menuIndex == 1){
				if(pageIndex_a == 1){
					//alert("111")
				}else{
					if(pageIndex == 0){
						//alert("22")
					}else{
						//alert("333")
						area.pageblur();
						pageIndex --;
						area.pagefocus(pageIndex);
					}
				}
			}else if(menuIndex == 2){
				if(pageIndex_o == 1){
					//alert("111")
				}else{
					if(pageIndex == 0){
						//alert("22")
					}else{
						//alert("333")
						area.pageblur();
						pageIndex --;
						area.pagefocus(pageIndex);
					}
				}
			}
		}
	}
	area.pageup = function(){
		if(menuIndex == 0){
			if(1 != pageIndex_v){
				area.pageblur();
				pageIndex_v--;
				showVideo(pageIndex_v);
				areaIndex = 1;
				videoIndex = pageSize-1;
				area.listfocus(videoIndex);
			}
		}else if(menuIndex == 1){
			if(1 != pageIndex_a){
				area.pageblur();
				pageIndex_a--;
				showAudio(pageIndex_a);
				areaIndex = 1;
				audioIndex = pageSize-1;
				area.listfocus(audioIndex);
			}
		}else if(menuIndex == 2){
			if(1 != pageIndex_o){
				area.pageblur();
				pageIndex_o--;
				showOther(pageIndex_o);
				areaIndex = 1;
				otherIndex = pageSize-1;
				area.listfocus(otherIndex);
			}
		}
		showPage();
	}
	area.pagedown = function(){
		if(menuIndex == 0){
			
			if(1+videoIndex+pageSize*(pageIndex_v-1)>=videoTotal){
				
			}else{
				area.pageblur();
				pageIndex_v++;
				//alert(pageIndex_v)
				showVideo(pageIndex_v);
				areaIndex = 1;
				videoIndex = 0;
				area.listfocus(videoIndex);
			}
		}else if(menuIndex == 1){
			if(1+audioIndex+pageSize*(pageIndex_a-1)>=audioTotal){
				
			}else{
				area.pageblur();
				pageIndex_a++;
				showAudio(pageIndex_a);
				areaIndex = 1;
				audioIndex = 0;
				area.listfocus(audioIndex);
			}
		}else if(menuIndex == 2){
			if(1+otherIndex+pageSize*(pageIndex_o-1)>=otherTotal){
				
			}else{
				area.pageblur();
				pageIndex_o++;
				showOther(pageIndex_o);
				areaIndex = 1;
				otherIndex = 0;
				area.listfocus(otherIndex);
			}
		}
		showPage();
	}
	area.pagefocus = function(i){
		if(pageIndex == 0){
			$("page_focus").style.visibility = "visible";
			$("page_focus").style.left = 555 +"px";
		}else if(pageIndex == 1){
			$("page_focus").style.visibility = "visible";
			$("page_focus").style.left = 813 +"px";
		}
	}
	area.pageblur = function(){
		$("page_focus").style.visibility = "hidden";
	}
	area.listfocus = function(i){
		$("focus").style.visibility = "visible";
		$("focus").style.top =125 + i * 65 +"px";
	}
	area.listblur = function(){
		$("focus").style.visibility = "hidden";
	}
	area.myfocus = function(i){
		if(menuIndex == 0){
			$("menu_video").className= "focus";
			$("menu_video").style.color = "#30FF00";
			$("video_pic").style.background="url(images/stb_video_focus1.png)";
			showVideo(pageIndex_v);
		}else if(menuIndex == 1){
			$("menu_audio").className= "focus";
			$("menu_audio").style.color = "#30FF00";
			$("audio_pic").style.background="url(images/stb_audio_focus1.png)"
			showAudio(pageIndex_a);
		}else if(menuIndex == 2){
			$("menu_other").className= "focus";
			$("menu_other").style.color = "#30FF00";
			$("other_pic").style.background="url(images/stb_other_focus1.png)"
			showOther(pageIndex_o);
		}
	}
	area.myblur = function(){
		if(menuIndex == 0){
			$("menu_video").style.color = "#fff";
			$("video_pic").style.background="url(images/stb_video_focus.png)"
		}else if(menuIndex == 1){
			$("menu_audio").style.color = "#fff";
			$("audio_pic").style.background="url(images/stb_audio_focus.png)"
		}else if(menuIndex == 2){
			$("menu_other").style.color = "#fff";
			$("other_pic").style.background="url(images/stb_other_focus.png)"
		}
	}
	area.href = function(){
		if(areaIndex == 0){
			
		}else if(areaIndex == 1){
			if(menuIndex == 0){
				var progarmName_v = videoFiles[parseInt(videoIndex,10)+parseInt((pageIndex_v-1)*pageSize,10)].name;
				var nameSplit_v = progarmName_v.lastIndexOf(".");
				if( nameSplit_v != -1 ){
					progarmName_v = progarmName_v.substring(0,nameSplit_v);;		
				}
				window.location.href = "vod_play.html?playUrl="+escape(videoFiles[parseInt(videoIndex,10)+parseInt((pageIndex_v-1)*pageSize,10)].file)+"&programName="+escape(progarmName_v)+"&index="+(parseInt(videoIndex,10)+parseInt((pageIndex_v-1)*pageSize,10))+"&type="+escape("video");
			}else if(menuIndex == 1){
				var progarmName_a = audioFiles[parseInt(audioIndex,10)+parseInt((pageIndex_a-1)*pageSize,10)].name;
				var nameSplit_a = progarmName_a.lastIndexOf(".");
				if( nameSplit_a != -1 ){
					progarmName_a = progarmName_a.substring(0,nameSplit_a);;		
				}
				window.location.href = "vod_play.html?playUrl="+escape(audioFiles[parseInt(audioIndex,10)+parseInt((pageIndex_a-1)*pageSize,10)].file)+"&programName="+escape(progarmName_a)+"&index="+(parseInt(audioIndex,10)+parseInt((pageIndex_a-1)*pageSize,10))+"&type="+escape("audio");
			}else if(menuIndex == 2){
				var progarmName_o = otherFiles[parseInt(otherIndex,10)+parseInt((pageIndex_o-1)*pageSize,10)].name;
				var nameSplit_o = progarmName_o.lastIndexOf(".");
				if( nameSplit_o != -1 ){
					progarmName_o = progarmName_o.substring(0,nameSplit_o);;		
				}
				window.location.href = "vod_play.html?playUrl="+escape(otherFiles[parseInt(otherIndex,10)+parseInt((pageIndex_o-1)*pageSize,10)].file)+"&programName="+escape(progarmName_o)+"&index="+(parseInt(otherIndex,10)+parseInt((pageIndex_o-1)*pageSize,10))+"&type="+escape("other");
			}
		}else if(areaIndex == 2){
			if(pageIndex == 0){
				 area.pageup();
			}else if(pageIndex == 1){
				 area.pagedown();
			}
		}
	}
	function showPageup(){
		//$("aaa").innerHTML = pageIndex_o;
		if(menuIndex == 0){
			if(pageIndex_v == 1){
				$("page_up").style.visibility = "hidden";
			}else{
				$("page_up").style.visibility = "visible";
			}
		}else if(menuIndex == 1){
			if(pageIndex_a == 1){
				$("page_up").style.visibility = "hidden";
			}else{
				$("page_up").style.visibility = "visible";
			}
		}else if(menuIndex == 2){
			if(pageIndex_o == 1){
				$("page_up").style.visibility = "hidden";
			}else{
				$("page_up").style.visibility = "visible";
			}
		}
	}
	function showPagedown(){
		//$("aaa").innerHTML = pageIndex_o + "----------"+otherPageTotal;
		if(menuIndex == 0){
			//if(1+videoIndex+pageSize*(pageIndex_v-1)>=videoTotal){
			if(pageIndex_v==videoPageTotal){				
				$("page_down").style.visibility = "hidden";
			}else{
				$("page_down").style.visibility = "visible";
			}
		}else if(menuIndex == 1){
			if(pageIndex_a==audioPageTotal){
				$("page_down").style.visibility = "hidden";
			}else{
				$("page_down").style.visibility = "visible";
			}
		}else if(menuIndex == 2){
			if(pageIndex_o==otherPageTotal){
				//alert("+++")
				$("page_down").style.visibility = "hidden";
			}else{
				//alert("*******")
				$("page_down").style.visibility = "visible";
			}
		}
	}
	function showPage(){
		//alert("1111----"+pageIndex_v)
		if(menuIndex == 0){
			if(videoTotal ==1){
				$("page_total").innerHTML = pageIndex_v +"/"+ videoPageTotal;
				
			}else if(videoTotal ==0){
				$("page_total").innerHTML = "";
				$("page_down").style.visibility = "hidden";
				$("page_up").style.visibility = "hidden";
			}else{
				$("page_total").innerHTML = pageIndex_v +"/"+ videoPageTotal;
				showPageup();
				showPagedown();
			}
		}else if(menuIndex == 1){
			if(audioTotal == 1){
				$("page_total").innerHTML = pageIndex_a +"/"+ audioPageTotal;
				
			}else if(audioTotal == 0){
				$("page_total").innerHTML = "";
				$("page_down").style.visibility = "hidden";
				$("page_up").style.visibility = "hidden";
			}else{
				$("page_total").innerHTML = pageIndex_a +"/"+ audioPageTotal;
				showPageup();
				showPagedown()
			}
		}else if(menuIndex == 2){
			if(otherTotal == 1){	
			//alert("ggg")
				$("page_total").innerHTML = pageIndex_o +"/"+ otherPageTotal;
				
			}else if(otherTotal == 0){
				//alert("hhh")
				$("page_total").innerHTML = "";
				$("page_down").style.visibility = "hidden";
				$("page_up").style.visibility = "hidden";
			}else{
				$("page_total").innerHTML = pageIndex_o +"/"+ otherPageTotal;
				showPageup();
				showPagedown();
			}
			/*if(otherTotal != 1){	
				//alert("ggg")
				$("page_total").innerHTML = pageIndex_o +"/"+ otherPageTotal;
				showPageup();
				showPagedown();
			}else{
				//alert("hhh")
				$("page_total").innerHTML = "";
			}*/
		}
		//alert("222----"+pageIndex_v)
	}
	area.initLang = function(){
		$("logo_text").innerHTML = dataLang.langues[lang_flag].title1;
		$("back_text").innerHTML = dataLang.langues[lang_flag].title2;
		$("menu_video").innerHTML = dataLang.langues[lang_flag].menu1;
		$("menu_audio").innerHTML = dataLang.langues[lang_flag].menu2;
		$("menu_other").innerHTML = dataLang.langues[lang_flag].menu3;
		$("page_up").innerHTML = dataLang.langues[lang_flag].tiptext1;
		$("page_down").innerHTML = dataLang.langues[lang_flag].tiptext2;
		$("tip_text").innerHTML = dataLang.langues[lang_flag].tiptext3;
		/*if(lang_flag == 0){
			$("logo_text").innerHTML = dataLang.langues[0].title1;
			$("back_text").innerHTML = dataLang.langues[0].title2;
			$("menu_video").innerHTML = dataLang.langues[0].menu1;
			$("menu_audio").innerHTML = dataLang.langues[0].menu2;
			$("menu_other").innerHTML = dataLang.langues[0].menu3;
			$("page_up").innerHTML = dataLang.langues[0].tiptext1;
			$("page_down").innerHTML = dataLang.langues[0].tiptext2;
			$("tip_text").innerHTML = dataLang.langues[0].tiptext3;
		}else if(lang_flag == 1){
			$("logo_text").innerHTML = dataLang.langues[1].title1;
			$("back_text").innerHTML = dataLang.langues[1].title2;
			$("menu_video").innerHTML = dataLang.langues[1].menu1;
			$("menu_audio").innerHTML = dataLang.langues[1].menu2;
			$("menu_other").innerHTML = dataLang.langues[1].menu3;
			$("page_up").innerHTML = dataLang.langues[1].tiptext1;
			$("page_down").innerHTML = dataLang.langues[1].tiptext2;
			$("tip_text").innerHTML = dataLang.langues[1].tiptext3;
		}*/
	}
	area.init = function(){
		area.initLang();
		$("tip_area").style.visibility = "visible";
		area.loadChannel();
	}
	return area;
}());
