//语言
function f_lang(){
	this.index=0;//频道索引
	this.pageid=0;//当前页ID
	this.pagesize=6;//每页大小
	this.pindex=0;//每页的位置
	this.init=function(list){//初始化函数，设置频道列表
		this.list=[];
		for(key in list){
			this.list.push(key);
		}
	}
	this.show=function(){//显示语言
		var html='<ul id="up_content">';
		for(var i=0;i<this.pagesize;i++){
		  var listid=this.pageid*this.pagesize+i;
		  if(listid>=this.list.length)break;//
			var listname= getStrChineseLen(this.list[listid],12);
			html +='<li id="lang_name'+listid+'" class="lang_list"><span class="lang_title">'+listid+"-"+listname+'</span></li>';
		}
		html+="</ul>";
		//alert(html)
		$("up_lists").innerHTML=html;
	}
	this.setIndex = function(index){
		//if(index==this.index){return false;}
		if(index<0){index=this.list.length-1};
		if(index>=this.list.length){index=0};
		this.index=index;
		this.pindex=this.index%this.pagesize;//每页的位置
		var newpageid=parseInt(this.index/this.pagesize,10)
		if(this.pageid!=newpageid){
			this.pageid=parseInt(this.index/this.pagesize,10);
			return true;//需要换页
		}
		return false;
	}
	this.indexchange=function(num){//index改变更新页数和当前位置
		var newindex=this.index+num;
		//if(this.index<0){this.index=0}//不循环
		//if(this.index>=this.list.length){this.index=this.list.length-1}//不循环置
		if(this.setIndex(newindex)){//页改变需要，更新显示
			this.show();//
			this.myfocus();//焦点选中
		}
	}
	this.myfocus=function(){//焦点选中
		$("lang_name"+this.index).className = "up_focus";
		var strname=this.list[this.index]
		if(getStrLength(strname)>12){
			$("lang_name"+this.index).innerHTML = '<span class="lang_title"><marquee>'+this.index+'-'+strname+'</marquee>';
		}
	}
	this.myblur=function(){//焦点离开
		//$("groupli"+this.index).className="";
		$("lang_name"+this.index).className = "lang_list";
		var strname=this.list[this.index];
		strname = getStrChineseLen(strname,12);
		$("lang_name"+this.index).innerHTML = '<span class="lang_title">'+this.index+'-'+strname+'</span>';
	}
	this.areafocus=function(){
		this.indexchange(0);
		this.myfocus();
	}
	this.areablur=function(){//区域离开
		$("lang_name"+this.index).className = "up_blur_0";
		var strname=this.list[this.index];
		strname = getStrChineseLen(strname,12);
		$("lang_name"+this.index).innerHTML = '<span class="lang_title">'+this.index+'-'+strname+'</span>';
	}
	//按键处理
	this.up=function(){//上
	}
	this.down=function(){//下
		this.areablur();
		GC_AREA.index=2;
		GC_AREA.areafocus();
	}
	this.left=function(){//左
		if(this.index==0){//移出区域
			this.areablur();
			GC_AREA.index=1
			GC_AREA.areafocus();
			return true;
		}
		this.myblur();
		this.indexchange(-1);
		this.myfocus();
		GC_cate.init(GC_data,this.list[this.index]);
		GC_move.init(GC_data,this.list[this.index],GC_cate.list[0]);
		if(GC_lang_id){clearTimeout(GC_lang_id);}
		GC_lang_id=setTimeout("GC_cate.show();GC_cate.areablur();GC_move.show();",300)
		
		//GC_cate.show();
		//GC_move.show();
	}

	this.right=function(){
		if(this.index>=this.list.length-1){return false;}
		this.myblur();
		this.indexchange(1);
		this.myfocus();
		GC_cate.init(GC_data,this.list[this.index]);
		GC_move.init(GC_data,this.list[this.index],GC_cate.list[0]);
		if(GC_lang_id){clearTimeout(GC_lang_id);}
		GC_lang_id=setTimeout("GC_cate.show();GC_cate.areablur();GC_move.show();",300)
		//GC_cate.show();
		//GC_move.show();
	}
	this.select=function(){//确定
	}
	this.back=function(){//返回
		window.location.href="../../apps/index/index.html"
	}
	this.pageup=function(){//上一页
	}
	this.pagedown=function(){//下一页
	}
	this.other = function(){
	}
	
}

//类别列表
function f_cate(){
	this.index=0;//频道索引
	this.pageid=0;//当前页ID
	this.pagesize=11;//每页大小
	this.pindex=0;//每页的位置
	this.init=function(list,lang){//初始化函数，设置频道列表
		this.list=[];
		for(key in list[lang]){
			this.list.push(key);
			//alert(key)
		}
		if(this.pindex>=this.list.length){
			this.pindex = this.list.length - 1;
		}
		this.setIndex(this.pindex);
	}
	this.show=function(){//显示频道列表
	  var html=""
	  for(var i=0;i<this.pagesize;i++){
		  var listid=this.pageid*this.pagesize+i;
		  if(listid>=this.list.length)break;//
		  	var listname= getStrChineseLen(this.list[listid],12);
			html +='<div id="cate_name'+i+'" class="cate_list">'+listname+'</div>';
	  }
	  html+=""
	  //alert(html)
	  $("left_list").innerHTML=html;
	}
	this.setIndex = function(index){
		//if(index==this.index){return false;}
		if(index<0){index=this.list.length-1};
		if(index>=this.list.length){index=0};
		this.index=index;
		this.pindex=this.index%this.pagesize;//每页的位置
		var newpageid=parseInt(this.index/this.pagesize,10)
		if(this.pageid!=newpageid){
			this.pageid=parseInt(this.index/this.pagesize,10);
			return true;//需要换页
		}
		return false;
	}
	this.indexchange=function(num){//index改变更新页数和当前位置
		var newindex=this.index+num;
		//if(this.index<0){this.index=0}//不循环
		//if(this.index>=this.list.length){this.index=this.list.length-1}//不循环置
		if(this.setIndex(newindex)){//页改变需要，更新显示
			this.show();//
			this.myfocus();//焦点选中
		}
	}
	this.myfocus=function(){//焦点选中
		var top = 72, pre = 46;
		$("left_focus").style.top = (top+pre*this.pindex)+"px";
		$("cate_name"+this.pindex).className = "cate_list";
		var strname=this.list[this.index];
		if(getStrLength(strname)>12){
			$("cate_name_"+this.pindex).innerHTML = "<marquee>"+name+"</marquee>";
		}
	}
	this.myblur=function(){//焦点离开
		$("cate_name"+this.pindex).className = "cate_list";
		var strname=this.list[this.index]
		strname = getStrChineseLen(strname,12);
		$("cate_name"+this.pindex).innerHTML = strname;
	}
	this.areafocus=function(){
		$("left_focus").style.visibility="visible"
		this.myfocus();
	}
	this.areablur=function(){//区域离开
		$("cate_name"+this.pindex).className = "cate_list_blur_0";
		//$("cate_name"+this.pindex).style.background = "url(images/vod_left_focus.png) no-repeat";
		$("left_focus").style.visibility="hidden";
	}
	//按键处理
	this.up=function(){//上
		this.myblur();
		this.indexchange(-1);
		this.myfocus();
		GC_move.init(GC_data,GC_lang.list[GC_lang.index],this.list[this.index]);
		GC_cate_id=setTimeout("GC_move.show();",100);
	}
	this.down=function(){//下
		this.myblur();
		this.indexchange(1);
		this.myfocus();
		GC_move.init(GC_data,GC_lang.list[GC_lang.index],this.list[this.index]);
		if(GC_cate_id){clearTimeout(GC_cate_id);}
		GC_cate_id=setTimeout("GC_move.show();",100);
	}
	this.left=function(){//左
	}
	this.right=function(){
		this.areablur();
		GC_AREA.index=0;
		GC_AREA.areafocus();
	}
	this.select=function(){//确定
	}
	this.play=function(){
	}
	this.back=function(){//返回
		window.location.href="../../apps/index/index.html"
	}
	this.pageup=function(){//上一页
	}
	this.pagedown=function(){//下一页
	}
	this.other = function(){
	}
	
}

//电影列表
function f_move(){
	this.index=0;//频道索引
	this.pageid=0;//当前页ID
	this.pagesize=10;//每页大小
	this.linesize=5;//
	this.pindex=0;//每页的位置
	this.list=[];
	this.init=function(list,lang,name){//初始化函数，设置频道列表
		//alert(lang+"--"+name)
		this.list = list[lang][name];
		this.setIndex(0);
		//alert(this.list.length)
	}
	this.show=function(){//显示频道列表
	  var html='<ul id="programcontent">'
	  for(var i=0;i<this.pagesize;i++){
		  var listid=this.pageid*this.pagesize+i;
		  if(listid>=this.list.length)break;//
		  	var listname= getStrChineseLen(this.list[listid][2],12);
			html +='<li class="program_list" id="program_'+i+'"><div id="tutu'+i+'" ><img src="'+this.list[listid][4]+'" /></div><h1  id="text'+i+'">'+listname+'</h1></li>';
	  }
	  html+="</ul>"
	  //alert(html)
		$("content2").innerHTML=html;
	}
	this.setIndex = function(index){
		//if(index==this.index){return false;}
		if(index<0){index=this.list.length-1};
		if(index>=this.list.length){index=0};
		this.index=index;
		this.pindex=this.index%this.pagesize;//每页的位置
		var newpageid=parseInt(this.index/this.pagesize,10)
		if(this.pageid!=newpageid){
			this.pageid=parseInt(this.index/this.pagesize,10);
			return true;//需要换页
		}
		return false;
	}
	this.indexchange=function(num){//index改变更新页数和当前位置
		var newindex=this.index+num;
		//if(this.index<0){this.index=0}//不循环
		//if(this.index>=this.list.length){this.index=this.list.length-1}//不循环置
		if(this.setIndex(newindex)){//页改变需要，更新显示
			this.show();//
			this.myfocus();//焦点选中
		}
	}
	this.myfocus=function(){//焦点选中
		$("program_"+this.pindex).className = "programFocus";
		var strname=this.list[this.index][2];
		if(getStrLength(strname)>12){
			$("text"+this.pindex).innerHTML = "<marquee>"+strname+"</marquee>";
		}
	}
	this.myblur=function(){//焦点离开
		$("program_"+this.pindex).className = "program_list";
		var strname=this.list[this.index][2]
		strname = getStrChineseLen(strname,12);
		$("text"+this.pindex).innerHTML = strname;
	}
	this.areafocus=function(){
		this.myfocus();
	}
	this.areablur=function(){//区域离开
		this.myblur();
	}
	//按键处理
	this.up=function(){//上
		var newindex=this.index-this.linesize;
		if(newindex<0){//切换区域
			this.areablur();
			GC_AREA.index=0;
			GC_AREA.areafocus();
		}else{
			this.myblur();
			this.indexchange(-5);
			this.myfocus();
		}
	}
	this.down=function(){//下
		this.myblur();
		this.indexchange(5);
		this.myfocus();
	}
	this.left=function(){//左
		if(this.pindex==0){
			this.areablur();
			GC_AREA.index=1;
			GC_AREA.areafocus();
		}else{
			this.myblur();
			this.indexchange(-1);
			this.myfocus();
		}
	}
	this.right=function(){
		this.myblur();
		this.indexchange(1);
		this.myfocus();
	}
	this.select=function(){//确定
		addCookie("langindex",GC_lang.index);
		addCookie("cateindex",GC_cate.index);
		addCookie("moveindex",GC_move.index);
		var name=this.list[this.index][2];
		var playurl=this.list[this.index][3];
		//playurl="http://10.160.35.126/video/8m/8m.m3u8"
		window.location.href="vod_play.html?programName="+escape(name)+"&playUrl="+escape(playurl)+"&type=3";
	}
	this.play=function(){
	}
	this.back=function(){//返回
		window.location.href="../../apps/index/index.html"
	}
	this.pageup=function(){//上一页
		this.myblur();
		this.indexchange(-10);
		this.myfocus();
	}
	this.pagedown=function(){//下一页
		this.myblur();
		this.indexchange(10);
		this.myfocus();
	}
	this.other = function(){
	}
	
}
//获取频道信息
function getdatalist(flag){
	var user_name=sysconfig.exec("OvtGetConfig","user_name");
	var lang=sysconfig.exec("OvtGetConfig","language");
	var check=crc32(user_name+"UGURMOVIES");
	//var url = MY_PORTAL_ADDR+"/movies.php?lang="+lang+"&username="+user_name.substring(0,8)+"&password="+user_name.substring(8,10)+"&check="+check;
	var url = MY_PORTAL_ADDR+"/movies.php?lang=eng&username=99725634&password=21&check=908595764";
	//alert(url)
	Ajax.request(url, {
		success : function(data) {
			//var starttime=new Date().getTime()
			if(data.length>0){
				GC_data=getjson(data);
				GC_lang.init(GC_data);
				//开机记忆焦点
				var langindex=parseInt(getCookie("langindex"),10);
				var cateindex=parseInt(getCookie("cateindex"),10);
				var moveindex=parseInt(getCookie("moveindex"),10);
				if(isNaN(langindex)){langindex=0;}
				if(isNaN(cateindex)){cateindex=0;}
				if(isNaN(moveindex)){moveindex=0;}
				//GF_WebPrint("portal--langindex="+langindex+",cateindex="+cateindex+",moveindex="+moveindex)
			}else{//用户登陆失败
				sysEventHandle.showSysError(data.infoText);
			}
			GC_cate.init(GC_data,GC_lang.list[0]);
			GC_move.init(GC_data,GC_lang.list[0],GC_cate.list[0]);
			
			//GC_lang.index=langindex;
			//GC_cate.setIndex(cateindex);
			//GC_move.setIndex(moveindex);
			
			GC_lang.show();
			GC_cate.show();
			GC_move.show();
			if(GC_move.index>=1000){
				GC_AREA.index=2;
				GC_cate.areablur();
				GC_move.areafocus();
			}else{
				GC_AREA.index=1;
				GC_cate.areafocus();	
			}
			GC_lang.areablur();
			//var endtime=new Date().getTime()
			//var dotime=endtime-starttime;
			//GC_channel.init(data.channels);
			//GF_WebPrint("------------"+dotime);
		},
		failure : function(data) {
			if(flag){
				GF_WebPrint("---error--")
			}else{
				GF_WebPrint("--more error--")
			}
		},
		type:"text"});
}
//转换
function getjson(str){
	//var starttime=new Date().getTime()
	//var strtime="<a href=''>"+starttime;
	var strarray=str.split('"\r\n"');//1049(17)
	var jsonarray={};
	var node;
	var nodearray;
	var key0;
	var key1
	for(var i=0;i<strarray.length;i++){
		node=strarray[i];
		nodearray=node.split('","');
		if(i==0){
			nodearray[0]=nodearray[0].substr(1,nodearray[0].length-1)//substr(1,nodearray[0].length-1);
		}
		key0=nodearray[0];
		key1=nodearray[1];
		if(jsonarray[key0]==undefined){
			jsonarray[key0]={};
		}
		if(jsonarray[key0][key1]==undefined){
			jsonarray[key0][key1]=[];
		}
		if(i==strarray.length-1){//最后一个
			var endi=nodearray[4].indexOf('"');
			nodearray[4]=nodearray[4].substring(0,endi)
		}
		jsonarray[key0][key1].push(nodearray)
	}
	//var endtime=new Date().getTime()
	//alert(endtime-starttime)
	return jsonarray;//返回数据
	
}
//区域焦点移动
function area(){
	try{
	this.index=0;
	this.area=[];
	this.up = function(){this.area[this.index].up()};
	this.down = function(){this.area[this.index].down()};
	this.left = function(){this.area[this.index].left()};
	this.right = function(){this.area[this.index].right()};
	this.back = function(){this.area[this.index].back()};
	this.select = function(){this.area[this.index].select()};
	this.pageup = function(){this.area[this.index].pageup()};;
	this.pagedown = function(){this.area[this.index].pagedown()};
	this.other=function(){this.area[this.index].other()};
	this.areafocus = function(){this.area[this.index].areafocus()};
	this.areablur = function(){this.area[this.index].areablur()};
	}catch(e){
		GF_WebPrint("area---------"+e);
	}
}
var GC_AREA=new area();

//按键处理
document.onkeypress=GF_getkey;
function GF_getkey(event){
	//try{
		var val = event.which | event.keyCode;
		if(val!=0x0300){//是按键信息的话
			//GF_WebPrint("portal:"+GC_AREA.index)
		}
		var NUM = 0;
		if((val <= 57)&&(val >= 48)){//48=0,57=9 判断数字键
			  NUM = val;
		}
		switch(val){
			case ROC_IRKEY_UP:
				GC_AREA.up();
			break;
			case ROC_IRKEY_DOWN:
				GC_AREA.down();
			break;
			case ROC_IRKEY_LEFT:
				GC_AREA.left();
			break;
			case ROC_IRKEY_RIGHT:
				GC_AREA.right();
			break;
			case ROC_IRKEY_SELECT:
				GC_AREA.select();
			break;
			case ROC_IRKEY_BACK:
				//GC_AREA.back();
				window.location.href="../index/index.html";
				return false;
			break;
			//case 112:
			case ROC_IRKEY_PAGE_UP:
				GC_AREA.pageup();
			break
			case 113:
			case ROC_IRKEY_PAGE_DOWN:
				GC_AREA.pagedown()
			break;
			case ROC_IRKEY_EXIT:
			case 1285:
				window.location.href="../index/index.html";
			break;
			case ROC_IRKEY_LOCATION:
				GC_AREA.other();
			break;
			default:
			break;
		}
	//}catch(e){
		//GF_WebPrint("event:"+e);
	//}
}

function getStrLength(str){
	var w = 0;
	var c;
	for (var i=0; i<str.length; i++) {
		 c = str.charCodeAt(i);
		 //单字节加1
		 if ((c >= 0x0001 && c <= 0x007e) || (0xff60<=c && c<=0xff9f)) {
		   w++;
		 }else {
		   w+=2;
		 }
    } 	
	return w; 
}