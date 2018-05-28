// JavaScript Document
function $(id){
	return document.getElementById(id);
}
var WEBVERSTIONS = "1.0";
try{
	var mExtend = new QjyScript();//正式用得代码
}catch(e){
	
}
//var keyboard = new KeyBoard();
function showMessage(){
	
	try{
		var state = mExtend.exec("SYS_GetLinkStat");
		var para_wifi_value = mExtend.exec("OvtGetConfig","para_wifi");
		if( para_wifi_value == 1 ){//有线模式下
			
			if( state == 0 ){
				
				wiredNetConfig();//有线已连接  ,读取有线的相关信息 
				
			}else if( state == -1 ){
					var state = mExtend.exec("OvtGetConfig","ovt_dev_wifi");
					
					if( state == 0 ){
						mExtend.exec("OvtSetConfig","para_wifi","2");//------设置无线模式
						wiredlessarea.searchs();//------无线未连接,自动搜索无线
					}else if( state == -1 ){
						//mExtend.exec("OvtSetConfig","para_wifi","2");//------设置无线模式
						//wiredlessarea.searchs();//------无线未连接 ,自动搜索无线
					}else if( state == -2 ){
						wiredNetConfig();//--------有线未连接 ,读取有线的相关信息  
					}
			}	
			
		}else if (para_wifi_value == 2 ){//无线模式下
			
			if( state == 0 ){
				
				wiredlessarea.searchs();//------无线已连接 ,自动搜索无线
				
			}else if( state == -1 ){
				
				var state = mExtend.exec("OvtGetConfig","ovt_dev_wire");
				
				if( state == 0 ){
					mExtend.exec("OvtSetConfig","para_wifi","1");//设置成有线模式
					mExtend.exec("SYS_StartLink");	
					wiredNetConfig();//------有线已连接,读取有线的相关信息  
				}else{
					wiredlessarea.searchs();//------无线未连接，自动搜索无线
				}
				
			}else if( state == -2 ){
				
				mExtend.exec("OvtSetConfig","para_wifi","1");//设置成有线模式
				mExtend.exec("SYS_StartLink");
				var state = mExtend.exec("SYS_GetLinkStat");
				
				if( state == 0 ){
					wiredNetConfig();//------有线已连接 ,读取有线的相关信息 
				}else{
					wiredNetConfig();//------有线未连接 ,读取有线的相关信息  
				}
				
			}
			
		}
		wiredAutoArea.contentShow();
	}catch(e){
		GF_WebPrint("页面的showMessage函数:"+e);
	}
}

function wiredNetConfig(){//读取有线网络下的一些信息
		var netlink_type_value = mExtend.exec("OvtGetConfig","netlink_type");
		if( netlink_type_value != "" ){
				if( netlink_type_value == "dhcp"){
					//wiredAutoArea.contentShow();
				}else if (netlink_type_value == "static"){
					wiredStaticArea.contentShow();
				}else if(netlink_type_value == "pppoe"){
					wiredPppoeArea.contentShow();
				}
		}else{
			//$("wire_show").innerHTML = "网络连接错误，请检查网络";
			$("wire_show").innerHTML = autoLanguageArr[0].tip_5;
		}
}
var areaIndex = 0;// 页面区域索引
var menuArea = function(){
	var o = {};
	o.index= 0;//索引
	o.init = function(){
		$("net_"+o.index).className= "focus";
		//$("net_"+o.index).style.color = "#30FF00";
		$("net_"+o.index).style.color = "#ffe400";
	}
	o.up = function(){
		o.getblur();
		o.index = o.index > 0 ? o.index - 1 : 3;		
		o.getfocus();
	}
	
	o.down = function(){
		o.getblur();
		o.index = o.index < 3 ? o.index + 1 : 0;
		o.getfocus();
	}
	
	o.getfocus = function(){
		$("net_"+o.index).style.color = "#ffe400";
		$("content_"+o.index).style.visibility = "visible";
		if( o.index == 0 ){
			wiredAutoArea.contentShow();
		}else if(o.index == 1){
			wiredlessarea.contentShow();
		}else if( o.index == 2 ){
			wiredPppoeArea.contentShow();
		}
		else if( o.index == 3 ){
			wiredStaticArea.contentShow();
		}
		
		
		if( keyboard.keyBoardAreaShow == true ){
			keyboard.hideKeyboard();
		}
		
	}
	o.getblur = function(){
		$("net_"+o.index).style.color = "#fff";
		$("content_"+o.index).style.visibility = "hidden";
		if(o.index == 1)
			wiredlessarea.contentShowNone();
		//wiredlessLinkArea.outShow();
		wiredlessLinkArea.hideShow();
	}
	o.right = function(){
		$("net_"+o.index).style.color = "#30FF00";
		if($("content_wiredless").style.visibility == "visible" ){
			areaIndex = 2;
			wiredlessLinkArea.getfocus();
			wiredlessLinkArea.right();
		}else{
			areaIndex = 1;
			if ( o.index == 0 ){
				wiredAutoArea.getfocus();
				
			}else if( o.index == 1 ){
				wiredlessarea.getfocus();
			}else if( o.index == 2 ){
				wiredPppoeArea.getfocus();
				//wiredPppoeArea.right();
			}else if( o.index == 3 ){
				wiredStaticArea.getfocus();
				//wiredStaticArea.right();
			}
		}
	
	}
	o.left = function(){
	}
	o.selects = function(){
	}
	o.backs = function(){
		window.location = "../index/index.html";
	}
	/* --- 键盘按返回键时，调用的函数--*/
	o.getFocusOn = function(){
		areaIndex = 0;
		$("net_"+o.index).style.color = "#ffe400";
		if( o.index == 1 ){
			wiredlessarea.outKeyHideFocus();
			wiredlessLinkArea.outShow();
		}else if ( o.index == 2 ){
			wiredPppoeArea.outShow();
		}else if ( o.index == 3 ){
			wiredStaticArea.outShow();
		}
	}
    return o;
}();
/****************有线自动搜索******************/
var wiredAutoArea = function(){
	var o = {};

	o.index = 0;      //纵向移动的索引
	
	o.init = function(){
		o.index = 0;
		o.getfocus();
	}
	
	o.getfocus = function(){
		$("auto_search_btn").style.background = "url(images/auto_focus_bg.png) no-repeat";	
	}
	
	o.getblur = function(){
		$("auto_search_btn").style.background = "url(images/auto_blur_bg.png) no-repeat";		
	}
	
	o.hidePage = function(){//隐藏无限连接显示页面
		areaIndex = 0;
		//menuArea.left();
	}
	o.left = function(){
		areaIndex = 0;
		$("net_"+menuArea.index).style.color = "#ffe400";
		o.getblur();
		o.hideNetTiperBox("wire_show");
	}
	
	o.right = function(){
		
	}
	
	o.contentShow = function(){
		var para_wifi_value = mExtend.exec("OvtGetConfig","para_wifi");
		if( para_wifi_value == 1 ){
			var netlink_type_value = mExtend.exec("OvtGetConfig","netlink_type");
			if( netlink_type_value != "" ){
				if( netlink_type_value == "dhcp"){
					$("type_ip").innerHTML = '<span class="auto_tip_name">Type:</span><span class="auto_tip_content">dhcp</span>';
				}else if (netlink_type_value == "static"){
					$("type_ip").innerHTML = '<span class="auto_tip_name">Type:</span><span class="auto_tip_content">static</span>';
				}else if(netlink_type_value == "pppoe"){
					$("type_ip").innerHTML = '<span class="auto_tip_name">Type:</span><span class="auto_tip_content">pppoe</span>';
				}else{
					$("type_ip").innerHTML = '<span class="auto_tip_name">Type:</span><span class="auto_tip_content"></span>';
				}
			}else{
				$("type_ip").innerHTML = '<span class="auto_tip_name">Type:</span><span class="auto_tip_content"></span>';
			}
		}else if( para_wifi_value == 2 ){
			$("type_ip").innerHTML = '<span class="auto_tip_name">Type:</span><span class="auto_tip_content">wifi</span>';
		}
		if( mExtend.exec("OvtGetConfig","ip_addr") != ""){
			$("wired_ip").innerHTML = '<span class="auto_tip_name">IP:</span><span class="auto_tip_content">'+mExtend.exec("OvtGetConfig","ip_addr")+'</span>';
		}
		if(  mExtend.exec("OvtGetConfig","net_mask") != ""){
			$("wired_mask").innerHTML = '<span class="auto_tip_name">Mask:</span><span class="auto_tip_content">'+mExtend.exec("OvtGetConfig","net_mask")+'</span>';
		}
		if(  mExtend.exec("OvtGetConfig","gateway") != ""){
			$("wired_gateway").innerHTML = '<span class="auto_tip_name">Gateway:</span><span class="auto_tip_content">'+mExtend.exec("OvtGetConfig","gateway")+'</span>';
		}
		if(  mExtend.exec("OvtGetConfig","dns") != ""){
			$("wired_dns").innerHTML = '<span class="auto_tip_name">DNS:</span><span class="auto_tip_content">'+mExtend.exec("OvtGetConfig","dns")+'</span>';
		}
		
	}
	
	
	var showNetTiperFlag = false;
	o.showNetTiperBox = function(id,value){
		showNetTiperFlag = true;
		$(id).innerHTML = value;
		$(id).style.visibility = "visible";
	}
	o.hideNetTiperBox = function(id){
		if( setLinkTimer != 0 ){
			clearTimeout(setLinkTimer);
			showNetTiperFlag = false;
			$(id).innerHTML = "";
			$(id).style.visibility = "hidden";
			setTimeout(function(){clearTimeout(setLinkTimer);$(id).innerHTML = "";},1000);
		}
		
	}
	/*int SYS_GetLinkStat(void);
	返回值为-1时，表示网线未连接
	返回值为0时，表示网线连接
	设置网络接口：
	int SYS_StartLink(void);
	返回值为-1时，表示网络设置成功
	返回值为0时，表示网络设置成功*/
	
	//获取网线接口状态
	 o.LinkStatFlag = function(){
		var flag=mExtend.exec("SYS_GetLinkStat");
		return flag;
		} 
		
	//获取网络设置状态	
	 o.StartLinkFlag = function(){
		var flag = mExtend.exec("SYS_StartLink");
		return flag;
	}
		
	//检测网线是否连接
	 var setLinkTimer = null;
	 o.checkState = function(id){
		var flagState = o.LinkStatFlag();
		if(flagState == -1){
			//o.showNetTiperBox(id,"请检查网线是否连接！");
			o.showNetTiperBox(id,autoLanguageArr[0].tip_0);
			clearTimeout(setLinkTimer);
			setLinkTimer = setTimeout(function(){o.checkState(id);},1000);
			o.contentShow();
			}
		else{
			o.checkSetLink(id);
			}	
		//o.checkSetLink(id);
		}
		
	//检测网络是否设置
	var setLinkNum = 0;
	o.checkSetLink = function(id){
		//o.showNetTiperBox(id,"有线网络连接中，请稍等 . . .");
		o.showNetTiperBox(id,autoLanguageArr[0].tip_1);
		
		var flagLink = o.StartLinkFlag();
		setLinkNum++;
		if(flagLink == -1){
			if(setLinkNum < 3){
				setLinkTimer = setTimeout(function(){o.checkSetLink(id)},1000);
			}else{
				//o.showNetTiperBox(id,"有线网络连接失败");
				o.showNetTiperBox(id,autoLanguageArr[0].tip_2);
				clearTimeout(setLinkTimer);
				o.contentShow();
			}	
		}else if(flagLink == -5){
	    	//o.showNetTiperBox(id,"用户名或密码错误，请重新进行设置");
			o.showNetTiperBox(id,autoLanguageArr[0].tip_3);
			clearTimeout(setLinkTimer);
			o.contentShow();
		}else if( flagLink == -2 ){
			o.showNetTiperBox(id,autoLanguageArr[0].tip_2);
			clearTimeout(o.setLinkTimer);
		}else if( flagLink == -3 ){
			o.showNetTiperBox(id,autoLanguageArr[0].tip_2);
			clearTimeout(o.setLinkTimer);
		}else if( flagLink == -4 ){
			o.showNetTiperBox(id,autoLanguageArr[0].tip_3);
			clearTimeout(o.setLinkTimer);
		}
		else{
			if( menuArea.index == 0 ){
				//o.showNetTiperBox(id,"有线网络连接成功");
				o.showNetTiperBox(id,autoLanguageArr[0].tip_4);
				o.contentShow();
				clearTimeout(setLinkTimer);
				return "";
			}else{
				var stbtype = mExtend.exec("OvtGetConfig","login_wwwstbtype");
				if(stbtype == "yes"){
					var epg_server_addr = mExtend.exec("OvtGetConfig","epg_server_url");
					window.location.href = epg_server_addr;
				}
				else{
					var auth_addr = mExtend.exec("OvtGetConfig","auth_server_url");
					var auth_user = mExtend.exec("OvtGetConfig","user_name");
					window.location.href = auth_addr+"?UserID="+auth_user+"&Action=Login";
				}
			}
		}
	}	
	o.selects = function(){
		try{
			//$("wire_show").innerHTML = "有线网络连接中，请稍等 . . .";
			$("wire_show").innerHTML = autoLanguageArr[0].tip_1;
			$("wire_show").style.visibility = "visible";
			setTimeout(function(){
				mExtend.exec("OvtSetConfig","para_wifi","1");//有线连接
				mExtend.exec("OvtSetConfig","netlink_type","dhcp");//有线网络设置
				o.checkState("wire_show");
								},300);
		}catch(e){
			GF_WebPrint("自动获取IP地址:"+e);
		}
	}
	o.backs = function(){
			window.location = "../index/index.html";
			return "";	
	}
	return o;
}();

/****************有线PPPoE区域******************/
var wiredPppoeArea = function(){
	var o = {};

	o.levelIndex = 0; //水平方向移动的索引
	o.index = 0;      //纵向移动的索引
	o.init = function(){
		o.index = 0;
		o.getfocus();
	}
	o.up = function(){

		o.getblur();
		if( o.levelIndex == 1 ){
		   o.levelIndex = 0;
		 }
		o.index = o.index > 0 ? o.index - 1 : 2;		
		o.getfocus();
	}
	
	o.down = function(){
		o.getblur();
		o.index = o.index < 2 ? o.index + 1 : 0;
		o.getfocus();
	}
	o.lastIndexBlur = function (){
		if(o.levelIndex == 0 ){
			$("pppoe_link").style.background ="url(images/btn_blur.png) no-repeat";
		}else{
			$("pppoe_cancel").style.background ="url(images/btn_blur.png) no-repeat";
		}
	}
	
	o.lastIndexFocus = function (){
		if(o.levelIndex == 0 ){
			$("pppoe_link").style.background ="url(images/btn_focus.png) no-repeat";
			$("pppoe_cancel").style.background ="url(images/btn_blur.png) no-repeat";
		}else{			
			$("pppoe_cancel").style.background ="url(images/btn_focus.png) no-repeat";
			$("pppoe_link").style.background ="url(images/btn_blur.png) no-repeat";
		}
	}
	o.getfocus = function(){
		areaIndex = 1;
		
		$("pppoe_save_tip").style.visibility = "hidden";
			if( o.index == 0 ){
			
				//$("login_name").focus();
				$("login_name").className = "InputFocus";
/*				setTimeout(function(){
					$("login_name").focus();
				}, 1);	
				setInputMouseFocus("login_name");*/
			}else if( o.index == 1 ){
				//setInputMouseFocus("login_pw");
				/*$("login_pw").focus();*/
				$("login_pw").className = "InputFocus";
				
			}else if ( o.index == 2 ) {
				
				o.lastIndexFocus ();
			}
				
	}
	
	o.getblur = function(){
		if( o.index == 0 ){
			
			/*$("login_name").blur();*/
			$("login_name").className = "InputBlur";
			
			
		}else if( o.index == 1 ){
			
		/*	$("login_pw").blur();*/
			$("login_pw").className = "InputBlur";
			
		}else if ( o.index == 2 ) {
			o.lastIndexBlur();
		}	
	}
	
	o.hideElements = function(){//隐藏无限连接显示页面
	}
	o.hidePage = function(){//隐藏无限连接显示页面
		areaIndex = 0;
		$("net_"+menuArea.index).style.color = "#ffe400";
		o.index = 0;
		o.levelIndex = 0; 
		$("pppoe_save_tip").style.visibility = "hidden";
		wiredAutoArea.hideNetTiperBox("pppoe_save_tip");
	}
	o.left = function(){
	   if ( o.index == 0 ){
			
/*			var input = $("login_name");
			var cursor_Index = getPositionForInput(input);
			if( cursor_Index != 0 ) return "";*/
		
			/*$("login_name").blur();*/
			$("login_name").className = "InputBlur";
			o.hidePage();
			return false;
			
		}else if ( o.index == 1 ){				
			/*$("login_pw").blur();*/
			$("login_pw").className = "InputBlur";
			o.hidePage();
		}else if ( o.index == 2 ){
			if( o.levelIndex == 1 ){
				o.levelIndex = 0;
				o.getfocus();
				return ;
			}else if( o.levelIndex == 0 ){
				o.getblur();
				o.hidePage();
			}
		}
	}
	
	
	o.right = function(){
	    if( o.index < 2 ){
/*			if( o.index == 0 ){
				if( keyboard.keyBoardAreaShow == true ){
					keyboard.inputBoxID = "login_name";
					keyboard.inputValue = $("login_name").innerHTML;
					keyboard.backFocus();
				}else{
					wiredPppoeArea.showKeyBoard();
				}
			}else if ( o.index == 1 ){
				if( keyboard.keyBoardAreaShow == true ){
					keyboard.inputBoxID = "login_pw";
					keyboard.inputValue = $("login_pw").innerHTML;
					keyboard.backFocus();
				}else{
					wiredPppoeArea.showKeyBoard();
				}
			}*/
		}
		else if ( o.index == 2 ){	
			if( o.levelIndex == 0 ){
				o.levelIndex = 1;
				o.getfocus();
			}
		}
	}
	
	o.contentShow = function(){
			$("login_name").innerHTML = mExtend.exec("OvtGetConfig","dialupuser");//有线IP地址
			$("login_pw").innerHTML = mExtend.exec("OvtGetConfig","dialuppwd");//有线MAC
	}
	o.save = function(){
		o.index = 2;
		o.levelIndex = 0;
		o.getfocus();
			var login_name_value = $("login_name").innerHTML;
		    var login_pw_value = $("login_pw").innerHTML;
			if( ( login_name_value == "" )|| ( login_pw_value == "" ) ){
				//$("pppoe_save_tip").innerHTML="请填写完整的资料信息!";
				$("pppoe_save_tip").innerHTML = pppoeLanguageArr[0].tip_0;
				$("pppoe_save_tip").style.visibility = "visible";
				return ;
			}else{
				try{
					//$("pppoe_save_tip").innerHTML = "有线网络连接中，请稍等 . . .";
					$("pppoe_save_tip").innerHTML = autoLanguageArr[0].tip_1;
					$("pppoe_save_tip").style.visibility = "visible";
					setTimeout(function(){
						mExtend.exec("OvtSetConfig","para_wifi","1");//有线连接
						mExtend.exec("OvtSetConfig","netlink_type","pppoe");//有线网络设置
						mExtend.exec("OvtSetConfig","dialupuser",$("login_name").innerHTML);//有线IP地址
						mExtend.exec("OvtSetConfig","dialuppwd",$("login_pw").innerHTML);//有线MAC					
						wiredAutoArea.checkState("pppoe_save_tip");
										},300);
				}catch(e){
					GF_WebPrint("密码保存:"+e);
				}
				
			}
	}
	o.showKeyBoard = function(){
		if( o.index == 0 ){
			keyboard.showKeyboard("whole", "login_name", wiredPppoeArea.getfocus,"text", "",$("login_name").innerHTML) ;
		}else if ( o.index == 1 ){
			keyboard.showKeyboard("whole", "login_pw", wiredPppoeArea.getfocus,"text", "",$("login_pw").innerHTML) ;
		}
			keyboard.keyBoardAreaFocus = true;
	}
	o.cancel = function(){
		o.getblur();
		o.contentShow();
		o.hidePage();
	}
	o.outShow = function(){
		o.index = 0;
		wiredAutoArea.hideNetTiperBox("pppoe_save_tip");
	}
	o.selects = function(){
		if( o.index == 2 ){
			if( o.levelIndex == 0 ){
				o.save();
				
			}else {
				o.cancel();
			}	
		}else{
			if( o.index == 0 ){
				if( keyboard.keyBoardAreaShow == true ){
					keyboard.inputBoxID = "login_name";
					keyboard.inputValue = $("login_name").innerHTML;
					keyboard.backFocus();
				}else{
					wiredPppoeArea.showKeyBoard();
				}
			}else if ( o.index == 1 ){
				if( keyboard.keyBoardAreaShow == true ){
					keyboard.inputBoxID = "login_pw";
					keyboard.inputValue = $("login_pw").innerHTML;
					keyboard.backFocus();
				}else{
					wiredPppoeArea.showKeyBoard();
				}
			}
		}
	}
	o.backs = function(){

		window.location = "../index/index.html";
	}
	return o;
}();

/****************有线static区域******************/
var wiredStaticArea = function(){
	var o = {};
	o.levelIndex = 0; //水平方向移动的索引
	o.index = 0;      //纵向移动的索引
	o.reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
	o.init = function(){
		o.index = 0;
		o.getfocus();
	}
	o.up = function(){

		o.getblur();
		o.index = o.index > 0 ? o.index - 1 : 4;	
		if ( o.index == 3 ){
			if ( o.levelIndex == 1 ){
				o.levelIndex = 0;
			}
		}
		o.getfocus();
	}
	
	o.down = function(){
		o.getblur();
		o.index = o.index < 4 ? o.index + 1 : 0;
		if ( o.index == 4 ){
			 o.levelIndex = 0;
		}
		o.getfocus();
	}
	
	o.getfocus = function(){
		areaIndex = 1;
		$("static_save_tip").style.visibility = "hidden";
		if( o.index == 0 ){
			/*$("ip_addr_c" ).focus();*/
			$("ip_addr_c").className = "InputFocus";
		}else if( o.index == 1 ){
			/*$("net_mask_c" ).focus();*/
			$("net_mask_c").className = "InputFocus";
		}else if ( o.index == 2 ) {
			/*$("gateway_c" ).focus();*/
			$("gateway_c").className = "InputFocus";
		}else if ( o.index == 3 ) {
			/*$("dns_c").focus();*/
			$("dns_c").className = "InputFocus";
		}else if ( o.index == 4 ) {
			
			o.lastIndexFocus ();
			
		}
	}
	
	o.getblur = function(){
		if( o.index == 0 ){
			
			/*$("ip_addr_c").blur();*/
			$("ip_addr_c").className = "InputBlur";
		}else if( o.index == 1 ){
			
			/*$("net_mask_c").blur();*/
			$("net_mask_c").className = "InputBlur";
		}else if ( o.index == 2 ) {
			
			/*$("gateway_c").blur();*/
			$("gateway_c").className = "InputBlur";
		}else if ( o.index == 3 ) {
			
			/*$("dns_c").blur();*/
			$("dns_c").className = "InputBlur";
		}else if ( o.index == 4 ) {
			o.lastIndexBlur();
		}
	}
	
	o.hidePage = function(){//隐藏无限连接显示页面
		areaIndex = 0;
		$("net_"+menuArea.index).style.color = "#ffe400";
		o.index = 0;
		o.levelIndex = 0;
		$("static_save_tip").style.visibility = "hidden";
		wiredAutoArea.hideNetTiperBox("static_save_tip");
	}
	o.left = function(){
		var nameArr = ["ip_addr_c","net_mask_c","gateway_c","dns_c"];
		if( o.index <= 3 ){
/*			var input = $(nameArr[o.index]);
			var cursor_Index = getPositionForInput(input);
			if( cursor_Index != 0 ) return "";*/

			/*$(nameArr[o.index]).blur();*/
			$(nameArr[o.index]).className = "InputBlur";
			o.hidePage();
		}
		else if ( o.index == 4 ){
			
			o.lastIndexLeft();
		}
        
	}
	
	o.right = function(){
		if( o.index <= 3 ){
/*			if( o.index == 0 ){
				if( keyboard.keyBoardAreaShow == true ){
					keyboard.inputBoxID = "ip_addr_c";
					keyboard.inputValue = $("ip_addr_c").innerHTML;
					keyboard.backFocus();
				}else{
					o.showKeyBoard();
				}

			}else if( o.index == 1 ){
				if( keyboard.keyBoardAreaShow == true ){
					keyboard.inputBoxID = "net_mask_c";
					keyboard.inputValue = $("net_mask_c").innerHTML;
					keyboard.backFocus();
				}else{
					o.showKeyBoard();
				}

			}else if( o.index == 2 ){
				if( keyboard.keyBoardAreaShow == true ){
					keyboard.inputBoxID = "gateway_c";
					keyboard.inputValue = $("gateway_c").innerHTML;
					keyboard.backFocus();
				}else{
					o.showKeyBoard();
				}

			}else if( o.index == 3 ){
				if( keyboard.keyBoardAreaShow == true ){
					keyboard.inputBoxID = "dns_c";
					keyboard.inputValue = $("dns_c").innerHTML;
					keyboard.backFocus();
				}else{
					o.showKeyBoard();
				}
			}*/
		}
		 
		else if ( o.index == 4 ){	
				o.lastIndexRight();
		 }
		
	}
	
	o.lastIndexBlur = function (){
		if(o.levelIndex == 0 ){
			$("static_link").style.background ="url(images/btn_blur.png) no-repeat";
		}else{
			$("static_cancel").style.background ="url(images/btn_blur.png) no-repeat";
		}
	}
	
	o.lastIndexFocus = function (){
		if(o.levelIndex == 0 ){
			$("static_link").style.background ="url(images/btn_focus.png) no-repeat";
		}else{			
			$("static_cancel").style.background ="url(images/btn_focus.png) no-repeat";
		}
	}
	o.lastIndexLeft = function (){
			if( o.levelIndex == 1 ){
				o.getblur();
				o.levelIndex = 0;
				o.getfocus();
				return ;
			}else if( o.levelIndex == 0 ){
				o.getblur();
				o.hidePage();
			}
	}
	o.lastIndexRight = function (){
		if( o.levelIndex == 0 ){
			o.getblur();
			o.levelIndex = 1;
			o.getfocus();
		}
	}

	o.contentShow = function(){
		try{
			var ip,mask,gateway,dns;
			ip = mExtend.exec("OvtGetConfig","ip_addr_static");//有线IP地址ip_addr
			$("ip_addr_c").innerHTML = ip;
			
			mask =  mExtend.exec("OvtGetConfig","net_mask_static");//有线MAC
			$("net_mask_c").innerHTML = mask;
			
			gateway = mExtend.exec("OvtGetConfig","gateway_static");//有线网关
			$("gateway_c").innerHTML = gateway;

			dns = mExtend.exec("OvtGetConfig","dns");//有线DNS
			$("dns_c").innerHTML = dns;
		}catch(e){
		}
	}
	
	o.save = function(){
		o.index = 4;
		o.levelIndex = 0;
		o.getfocus();
		var ip_addr_c_value = $("ip_addr_c").innerHTML;
		
		var net_mask_c_value = $("net_mask_c").innerHTML;

		var gateway_c_value = $("gateway_c").innerHTML
		
		var dns_c_value = $("dns_c").innerHTML;
		
		if( ip_addr_c_value == ""||  net_mask_c_value == "" || gateway_c_value == ""  || dns_c_value == "" ){
			//$("static_save_tip").innerHTML="请填写完整的资料信息!";
			$("static_save_tip").innerHTML=staticLanguageArr[0].tip_0;
			$("static_save_tip").style.visibility = "visible";
			return "";
		}else if( !ip_addr_c_value.match(o.reg) ) { 
			//$("static_save_tip").innerHTML="IP地址填写不合法!";
			$("static_save_tip").innerHTML=staticLanguageArr[0].tip_1;
			$("static_save_tip").style.visibility = "visible";
			return "";
		}else if( !net_mask_c_value.match(o.reg) ){
			//$("static_save_tip").innerHTML="子网掩码填写不合法!";
			$("static_save_tip").innerHTML=staticLanguageArr[0].tip_2;
			$("static_save_tip").style.visibility = "visible";
				return "";
		}else if( !gateway_c_value.match(o.reg) ){
			//$("static_save_tip").innerHTML="网关填写不合法!";
			$("static_save_tip").innerHTML=staticLanguageArr[0].tip_3;
			$("static_save_tip").style.visibility = "visible";
				return "";
		}else if( !dns_c_value.match(o.reg) ){
			//$("static_save_tip").innerHTML="DNS填写不合法!";
			$("static_save_tip").innerHTML=staticLanguageArr[0].tip_4;
			$("static_save_tip").style.visibility = "visible";
				return "";
		}
		else{
			try{
				//$("static_save_tip").innerHTML = "有线网络连接中，请稍等 . . .";
				$("static_save_tip").innerHTML = autoLanguageArr[0].tip_1;
				$("static_save_tip").style.visibility = "visible";
				setTimeout(function(){
					mExtend.exec("OvtSetConfig","para_wifi","1");//有线连接
					mExtend.exec("OvtSetConfig","netlink_type","static");//有线网络设置
					mExtend.exec("OvtSetConfig","ip_addr",ip_addr_c_value);//有线IP地址
					mExtend.exec("OvtSetConfig","net_mask",net_mask_c_value);//有线MAC
					mExtend.exec("OvtSetConfig","gateway",gateway_c_value);//有线网关
					mExtend.exec("OvtSetConfig","dns",dns_c_value);//有线DNS
					wiredAutoArea.checkState("static_save_tip");
						},300);
			}catch(e){
				GF_WebPrint("静态保存:"+e);
			}	
		}
	}
	o.outshow = function(){
		o.index = 0;
		wiredAutoArea.hideNetTiperBox("static_save_tip");
	}
	o.cancel = function(){
		o.getblur();
		o.contentShow();
		o.hidePage();
	}
	o.showKeyBoard = function(){
		if( o.index == 0 ){
			keyboard.showKeyboard("ipinput", "ip_addr_c", wiredStaticArea.getfocus,"text", "",$("ip_addr_c").innerHTML) ;
		}else if ( o.index == 1 ){
			keyboard.showKeyboard("ipinput", "net_mask_c", wiredStaticArea.getfocus,"text", "",$("net_mask_c").innerHTML) ;
		}else if ( o.index == 2 ){
			keyboard.showKeyboard("ipinput", "gateway_c", wiredStaticArea.getfocus,"text", "",$("gateway_c").innerHTML) ;
		}else if ( o.index == 3 ){
			keyboard.showKeyboard("ipinput", "dns_c", wiredStaticArea.getfocus,"text", "",$("dns_c").innerHTML) ;
		}
		keyboard.keyBoardAreaFocus = true;
	}
	o.selects = function(){
		if ( o.index == 4 ){
			if( o.levelIndex == 0 ){
				o.save();
				
			}else {
				o.cancel();
			}	
		}else{
			if( o.index == 0 ){
				if( keyboard.keyBoardAreaShow == true ){
					keyboard.inputBoxID = "ip_addr_c";
					keyboard.inputValue = $("ip_addr_c").innerHTML;
					keyboard.backFocus();
				}else{
					o.showKeyBoard();
				}
			}else if( o.index == 1 ){
				if( keyboard.keyBoardAreaShow == true ){
					keyboard.inputBoxID = "net_mask_c";
					keyboard.inputValue = $("net_mask_c").innerHTML;
					keyboard.backFocus();
				}else{
					o.showKeyBoard();
				}
			}else if( o.index == 2 ){
				if( keyboard.keyBoardAreaShow == true ){
					keyboard.inputBoxID = "gateway_c";
					keyboard.inputValue = $("gateway_c").innerHTML;
					keyboard.backFocus();
				}else{
					o.showKeyBoard();
				}
			}else if( o.index == 3 ){
				if( keyboard.keyBoardAreaShow == true ){
					keyboard.inputBoxID = "dns_c";
					keyboard.inputValue = $("dns_c").innerHTML;
					keyboard.backFocus();
				}else{
					o.showKeyBoard();
				}
			}
		}
	}
	o.backs = function(){

		window.location = "../index/index.html";
	}
	return o;
}();

/****************无线列表显示区域******************/
var wiredlessarea = function(){
	var o = {};
	o.index = 0;      //纵向移动的索引
	o.searchLength = 0;
	o.scanArray = [];//无线搜索结果数组
	o.selectIndex = 0;//选择的无线列表索引
	o.timer = null;
	o.isSearching = false;
	o.searchStatus = "searching";// searching, end
	o.init = function(){
		o.index = 0;
		o.getfocus();
	}
	o.up = function(){
		if( o.searchLength != 0 ){
			o.getblur();
			o.index = o.index > 0 ? o.index - 1 : o.searchLength;		
			o.getfocus();
		}
	}
	
	o.down = function(){
		if( o.searchLength != 0 ){
			o.getblur();
			o.index = o.index < o.searchLength ? o.index + 1 : 0;
			o.getfocus();
		}
	}
	
	o.getfocus = function(){
		$("wiredless_search_tip").style.visibility = "hidden";
		if( o.index == 0 ){	
			$("wiredLess_search_btn").style.background ="url(images/search_btn.png) no-repeat -5px -3px";
		}else {
			var lineNum = o.index - 1;
			$("line_"+lineNum).className = "wifi_focus";
		}
	}
	
	o.getblur = function(){
		
		if(o.index == 0 ){
			$("wiredLess_search_btn").style.background ="url(images/search_btn_blur.png) no-repeat";
		}else {
			var lineNum = o.index - 1;
			$("line_"+lineNum).className = "";
		}
	}
	
	o.hidePage = function(){//隐藏无限连接显示页面
		areaIndex = 0;
		$("net_"+menuArea.index).style.color = "#ffe400";
		o.index = 0;
		//$("wiredless_search_tip").style.visibility = "hidden";
	}
	o.left = function(){
		if ( o.index == 0 ){
			$("wiredLess_search_btn").style.background ="url(images/search_btn_blur.png) no-repeat";
		}else{
			var lineNum = o.index - 1;
			$("line_"+lineNum).className = "";
		}
		o.hidePage();
	}
	
	o.right = function(){
	}
	o.outKeyHideFocus = function(){ //从键盘上按返回键时，焦点定位到左侧，需要隐藏此焦点
		if( o.index != 0 ){
			var lineNum = o.index - 1;
			$("line_"+lineNum).className = "";
			o.index = 0;
		}
	}
	o.contentShow = function(){
		if(!o.isSearching) return;
		$("wiredless_search_tip").style.visibility = "visible";
		if(o.searchStatus == "searching")
		{
			$("buffer").style.visibility = "visible";
		}
	}
	o.contentShowNone = function(){
		$("buffer").style.visibility = "hidden";
		$("wiredless_search_tip").style.visibility = "hidden";
	}
	o.showWifilist = function(scan_value){
			
			if( scan_value != "" ){
					$("buffer").style.visibility = "hidden";
					o.searchStatus = "end";
					o.scanArray = strToJson( scan_value );
					//o.scanArray = strToJson ('[{"bssid":"6c:e8:73:fc:c0:aa","freq":"2462","level":"231","flags":"WrA-PSK","ssid":"Mercury_2.4GHz_FCC0AA"},{"bssid":"5c:63:bf:6a:4e:dc","freq":"2437","level":"203","flags":"WfA-PSK","ssid":"JSZC"},{"bssid":"ec:88:8f:b2:c0:14","freq":"2412","level":"189","flags":"WPA-PSK","ssid":"LGZ-PC"},{"bssid":"14:cf:92:3e:83:e4","freq":"2412","level":"193","flags":"WPA-PSK","ssid":"ttttttt"},{"bssid":"14:e6:e4:97:d8:6c","freq":"2437","level":"187","flags":"WPA-PSK","ssid":"xtb_5f"},{"bssid":"bc:d1:77:84:a3:d6","freq":"2437","level":"185","flags":"WPA-PSK","ssid":"office-2f"},{"bssid":"00:36:76:20:af:68","freq":"2412","level":"187","flags":"WPA-PSK","ssid":"360-ZSAF68"}]');

					var html = "<ul>";
					if( o.scanArray.length != 0 ){
						if( o.scanArray.length >= 5 ){
							o.searchLength = 5;
						}else{
							o.searchLength = o.scanArray.length;
						}
						
						//给无线数组按信号强度降顺排列
						for( var i = 0; i < o.scanArray.length - 1 ;i++){
							for ( var j = 0; j < o.scanArray.length - 1-i;j++ ){
								if(	parseInt(o.scanArray[j].level,10 ) < parseInt(o.scanArray[j+1].level,10 ) ){
									
									var obj = o.scanArray[j];
									o.scanArray.splice(j,1);
									o.scanArray.splice(j+1,0,obj);
								}
							}
						}
						
						//数组的前五项值显示在页面上
						for(var i = 0 ;i < o.searchLength ; i++ ){
							
							var level = parseInt(o.scanArray[i].level,10 ) % 50 != 0 ?  parseInt(o.scanArray[i].level,10 ) / 50   + 1 : parseInt(o.scanArray[i].level,10 ) / 50 ;
							if( level > 5 ){
								level = 5;
							}
							if( ( o.scanArray[i].flags.substr(0,3) == "WPA" ) || ( o.scanArray[i].flags.substr(0,3) == "WEP") ){
								html =html+ '<li id="line_'+i+'" ><div class = "wifi_name">'+o.scanArray[i].ssid+'</div><div class = "wifi_ico_'+parseInt(level,10)+'" ></div></li>';
							}else{
								html =html+ '<li id="line_'+i+'" ><div class = "wifi_name">'+o.scanArray[i].ssid+'</div><div class = "wifi_r_ico_'+parseInt(level,10)+'" ></div></li>';
							}
						}
						html =html+ "</ul>";
						$("wifi_lists").innerHTML = html;
					}
				}else {
					$("buffer").style.visibility = "hidden";
					o.searchStatus = "end";
					if(menuArea.index!=1) return;					
					$("wiredless_search_tip").style.visibility = "visible";
					$("wiredless_search_tip").innerHTML = "没有发现可用的无线网络";
					//$("wiredless_search_tip").innerHTML = "No wifi network found";
				}
	}
	o.searchs = function(){
		var hwversion = mExtend.exec("OvtGetConfig","software_ver");
		o.isSearching = true;
			var hw = 56;//parseInt(hwversion);
			if(hw >= 55) o.searchs_async();
			else o.searchs_sync();
		
	}
	o.searchs_sync = function(){
		try{
			if( menuArea.index == 1 ) {
				$("buffer").style.visibility = "visible";
				o.searchStatus = "searching";
			}
			setTimeout(function(){
				var scan_value = mExtend.exec("OvtGetUserParams","wifi_scan");//少个路由接口先不做
				//var scan_value = "wwww";//少个路由接口先不做
				if( scan_value != "" ){
					$("buffer").style.visibility = "hidden";
					o.searchStatus = "end";
					o.scanArray = strToJson( scan_value );
					//o.scanArray = strToJson ('[{"bssid":"6c:e8:73:fc:c0:aa","freq":"2462","level":"231","flags":"WrA-PSK","ssid":"Mercury_2.4GHz_FCC0AA"},{"bssid":"5c:63:bf:6a:4e:dc","freq":"2437","level":"203","flags":"WfA-PSK","ssid":"JSZC"},{"bssid":"ec:88:8f:b2:c0:14","freq":"2412","level":"189","flags":"WPA-PSK","ssid":"LGZ-PC"},{"bssid":"14:cf:92:3e:83:e4","freq":"2412","level":"193","flags":"WPA-PSK","ssid":"ttttttt"},{"bssid":"14:e6:e4:97:d8:6c","freq":"2437","level":"187","flags":"WPA-PSK","ssid":"xtb_5f"},{"bssid":"bc:d1:77:84:a3:d6","freq":"2437","level":"185","flags":"WPA-PSK","ssid":"office-2f"},{"bssid":"00:36:76:20:af:68","freq":"2412","level":"187","flags":"WPA-PSK","ssid":"360-ZSAF68"}]');

					var html = "<ul>";
					if( o.scanArray.length != 0 ){
						if( o.scanArray.length >= 5 ){
							o.searchLength = 5;
						}else{
							o.searchLength = o.scanArray.length;
						}
						
						//给无线数组按信号强度降顺排列
						for( var i = 0; i < o.scanArray.length - 1 ;i++){
							for ( var j = 0; j < o.scanArray.length - 1-i;j++ ){
								if(	parseInt(o.scanArray[j].level,10 ) < parseInt(o.scanArray[j+1].level,10 ) ){
									
									var obj = o.scanArray[j];
									o.scanArray.splice(j,1);
									o.scanArray.splice(j+1,0,obj);
								}
							}
						}
						
						//数组的前五项值显示在页面上
						for(var i = 0 ;i < o.searchLength ; i++ ){
							
							var level = parseInt(o.scanArray[i].level,10 ) % 50 != 0 ?  parseInt(o.scanArray[i].level,10 ) / 50   + 1 : parseInt(o.scanArray[i].level,10 ) / 50 ;
							if( level > 5 ){
								level = 5;
							}
							if( ( o.scanArray[i].flags.substr(0,3) == "WPA" ) || ( o.scanArray[i].flags.substr(0,3) == "WEP") ){
								html =html+ '<li id="line_'+i+'" ><div class = "wifi_name">'+o.scanArray[i].ssid+'</div><div class = "wifi_ico_'+parseInt(level,10)+'" ></div></li>';
							}else{
								html =html+ '<li id="line_'+i+'" ><div class = "wifi_name">'+o.scanArray[i].ssid+'</div><div class = "wifi_r_ico_'+parseInt(level,10)+'" ></div></li>';
							}
						}
						html =html+ "</ul>";
						$("wifi_lists").innerHTML = html;
					}
				}else {
					if( menuArea.index == 1 ) {
						$("buffer").style.visibility = "hidden";
						o.searchStatus = "end";
						$("wiredless_search_tip").style.visibility = "visible";
						$("wiredless_search_tip").innerHTML = "没有发现可用的无线网络";
						//$("wiredless_search_tip").innerHTML = "No wifi network found";
					}
				}
			},500);
		}catch(e){
			//GF_WebPrint("无线搜索:"+e);
			GF_WebPrint("Wifi search:"+e);
		}
	}
	o.searchs_async = function(){
		try{
			if( menuArea.index == 1 ) {
				$("buffer").style.visibility = "visible";
				o.searchStatus = "searching";
			}
			mExtend.exec("OvtGetUserParams","wifiscan_start");
			if(menuArea.index==1)				
			{		$("wiredless_search_tip").style.visibility = "visible";
					//$("wiredless_search_tip").innerHTML = "没有发现可用的无线网络";
					$("wiredless_search_tip").innerHTML = "正在搜索...";
			}
			if(o.timer != null) clearInterval(o.timer);
			o.timer = setInterval(function(){
					var val = mExtend.exec("OvtGetUserParams","wifiscan_result");
					/*if(menuArea.index==1)				
					{		
						$("wiredless_search_tip").style.visibility = "visible";
						//$("wiredless_search_tip").innerHTML = "Searching..."+val+"...";
					}*/
					if(val == "0")
					{		
							
					}
					else if(val == "-1")
					{
						clearInterval(o.timer);
						$("buffer").style.visibility = "hidden";
						o.searchStatus = "end";
						if(menuArea.index!=1) return;	
						//$("wiredless_search_tip").style.visibility = "visible";
						$("wiredless_search_tip").innerHTML = "没有发现可用的无线网络";
						//$("wiredless_search_tip").innerHTML = "Wifi device error!";
					}
					else
					{
						clearInterval(o.timer);
						if(menuArea.index == 1)
							$("wiredless_search_tip").innerHTML = "搜索完毕!";
						o.showWifilist(val);
					}
			},1500);
		}catch(e){
			//GF_WebPrint("无线搜索:"+e);
			GF_WebPrint("Wifi search:"+e);
		}
	}

	o.selects = function(){
		if( o.index == 0 ){
			$("wiredless_search_tip").style.visibility = "hidden";
			$("wiredless_search_tip").innerHTML = "";	
			o.searchs();
		}else{
			areaIndex = 2//无线连接区域
			$("content_"+menuArea.index).style.visibility = "hidden";
			wiredlessLinkArea.contentShow();
			$("content_wiredless").style.visibility = "visible";
			wiredlessLinkArea.getfocus();
			//wiredlessLinkArea.selects();
		}
	}
	
	o.backs = function(){
		window.location = "../index/index.html";
	}
	return o;
}();

/****************无线连接区域******************/
var wiredlessLinkArea = function(){
	var o = {};
	
	o.levelIndex = 0; //水平方向移动的索引
	o.index = 0;      //纵向移动的索引
	o.selectWiredlessName = "";
	o.init = function(){
		o.index = 0;
		o.getfocus();
	}
	o.up = function(){

		o.getblur();
		if( o.levelIndex == 1 ){
		   o.levelIndex = 0;
		 }
		o.index = o.index > 0 ? o.index - 1 : 1;		
		o.getfocus();
	}
	
	o.down = function(){
		o.getblur();
		o.index = o.index < 1 ? o.index + 1 : 0;
		o.getfocus();
	}
	
	o.getfocus = function(){
		areaIndex = 2;
		$("wiredless_save_tip").style.visibility = "hidden";
		if(o.index == 0 ){
			/*$("wiredless_login_pw").focus();*/
			$("wiredless_login_pw").className = "InputFocus";
		}else if(o.index == 1 ){
			if(o.levelIndex == 0 ){
				$("wiredless_link").style.background ="url(images/btn_focus.png) no-repeat";
				$("wiredless_cancel").style.background ="url(images/btn_blur.png) no-repeat";
			}else{			
				$("wiredless_cancel").style.background ="url(images/btn_focus.png) no-repeat";
				$("wiredless_link").style.background ="url(images/btn_blur.png) no-repeat";
			}
		}
	}
	o.lastIndexBlur = function (){

	}
	
	o.lastIndexFocus = function (){

	}
	o.getblur = function(){
		
		if(o.index == 0 ){
			/*$("wiredless_login_pw").blur();*/
			$("wiredless_login_pw").className = "InputBlur";
		}else if(o.index == 1 ){
			
			if(o.levelIndex == 0 ){
				$("wiredless_link").style.background ="url(images/btn_blur.png) no-repeat";
			}else{
				$("wiredless_cancel").style.background ="url(images/btn_blur.png) no-repeat";
			}
		}
		
	}
	
	o.hidePage = function(){//隐藏无限连接显示页面
		areaIndex = 0;
		$("net_"+menuArea.index).style.color = "#ffe400";
		o.index = 0;
		$("wiredless_save_tip").style.visibility = "hidden"
		clearTimeout(o.setLinkTimer);
		$("wiredless_save_tip").innerHTML = "";
		$("wiredless_save_tip").style.visibility = "hidden";
	}
	o.left = function(){
		
		 if( o.index == 0 ){
			
/*			var input = $("wiredless_login_pw");
			var cursor_Index = getPositionForInput(input);
			if( cursor_Index != 0 ) return "";*/

			/*$("wiredless_login_pw").blur();*/
			$("wiredless_login_pw").className = "InputBlur";
			o.hidePage();	
			//wiredlessarea.getblur();
		}
		else if (o.index == 1 ){
			if( o.levelIndex == 1 ){
				o.levelIndex = 0;
				o.getfocus();
				return ;
			}else if( o.levelIndex == 0 ){
				o.getblur();
				o.hidePage();
				//wiredlessarea.getblur();
			}
		}
		
	}
	
	o.right = function(){
		
		if ( o.index == 1 ){
			
			if( o.levelIndex == 0 ){
				o.levelIndex = 1;
				o.getfocus();
			}
		}else {
/*			if( keyboard.keyBoardAreaShow == true ){
				keyboard.backFocus();
			}else{
				o.showKeyBoard();
			}*/
		}
	}
	
	o.contentShow = function(){
		try{
				o.selectWiredlessName =  wiredlessarea.scanArray[wiredlessarea.index - 1].ssid;
				 var ssid_value = mExtend.exec("OvtGetConfig","wifi_ssid");
				 if( o.selectWiredlessName == ssid_value ){
						var psk_value = mExtend.exec("OvtGetConfig","wifi_psk");
						$("wiredless_login_pw").innerHTML = psk_value;
				 }else{
					 $("wiredless_login_pw").innerHTML = "";
				 }
				$("wiredless_name").innerHTML = o.selectWiredlessName;
		}catch(e){
			
		}
	}
	o.contentHide = function(){
		try{
			o.selectWiredlessName =  "";
			$("wiredless_login_pw").innerHTML  = "";
			$("wiredless_name").innerHTML = "";
		}catch(e){}
	}
	o.save = function(){
		o.index = 1;
		o.levelIndex = 0;
		o.getfocus();
		var password = $("wiredless_login_pw").innerHTML;
		
		if(password == "" ){
			//$("wiredless_save_tip").innerHTML="密码不能为空!";
			$("wiredless_save_tip").innerHTML=wifiLanguageArr[0].tip_2;
			$("wiredless_save_tip").style.visibility = "visible";
		}else if( password.length < 8 ){
			//$("wiredless_save_tip").innerHTML="密码长度应该至少大于8位!";
			$("wiredless_save_tip").innerHTML=wifiLanguageArr[0].tip_3;
			$("wiredless_save_tip").style.visibility = "visible";
		}
		else{
		
			try{
				//$("wiredless_save_tip").innerHTML = "无线网络连接中，请稍等 . . .";
				$("wiredless_save_tip").innerHTML = wifiLanguageArr[0].tip_5;
				$("wiredless_save_tip").style.visibility = "visible";
				setTimeout(function(){
					mExtend.exec("OvtSetConfig","para_wifi","2");//无线连接
					mExtend.exec("OvtSetConfig","wifi_ssid",o.selectWiredlessName);//无线连接
					mExtend.exec("OvtSetConfig","wifi_psk",$("wiredless_login_pw").innerHTML);//无线密码
					mExtend.exec("OvtSetConfig","wifi_key_mgmt","WPA-PSK");//无线加密模式
					mExtend.exec("OvtSetConfig","netlink_type","dhcp");//自动设置成dhcp
	
					o.checkState("wiredless_save_tip");
									},300);
				//o.checkSetLink("wiredless_save_tip");
			}catch(e){
				GF_WebPrint("无线保存:"+e);
			}
			
		}
	}
	
	var showNetTiperFlag = false;
	o.showNetTiperBox = function(id,value){
		showNetTiperFlag = true;
		$(id).innerHTML = value;
		$(id).style.visibility = "visible";
	}
	o.hideNetTiperBox = function(id){
		showNetTiperFlag = false;
		clearTimeout(o.setLinkTimer);
		$(id).innerHTML = "";
		$(id).style.visibility = "hidden";
		
	}
	/*int SYS_GetLinkStat(void);
	返回值为-1时，表示网线未连接
	返回值为0时，表示网线连接
	设置网络接口：
	int SYS_StartLink(void);
	返回值为-1时，表示网络设置成功
	返回值为0时，表示网络设置成功*/
	
	//获取网线接口状态
	 o.LinkStatFlag = function(){
		var flag=mExtend.exec("SYS_GetLinkStat");
		return flag;
		} 
		
	//获取网络设置状态	
	 o.StartLinkFlag = function(){
		var flag = mExtend.exec("SYS_StartLink");
		return flag;
	}
		
	//检测网线是否连接
	o.setLinkTimer = 0;
	var setCheckNum = 0;
	 o.checkState = function(id){
		var flagState = o.LinkStatFlag();
		setCheckNum ++;
		if(flagState == -2){
			if( setCheckNum < 5 ){
				//o.showNetTiperBox(id,"请检查无线连接设备！");
				o.showNetTiperBox(id,wifiLanguageArr[0].tip_4);
				o.setLinkTimer = setTimeout(function(){o.checkState(id);},1000);
			}else{
				clearTimeout(o.setLinkTimer);
				//o.showNetTiperBox(id,"请检查无线连接设备！");
				o.showNetTiperBox(id,wifiLanguageArr[0].tip_4);
			}
		}
		else{
			o.checkSetLink(id);
			}	
		//o.checkSetLink(id);
		}
		
	//检测网络是否设置
	var setLinkNum = 0;
	o.checkSetLink = function(id){
		//o.showNetTiperBox(id,"无线网络连接中，请稍等 . . .");
		o.showNetTiperBox(id,wifiLanguageArr[0].tip_5);
		var flagLink = o.StartLinkFlag();
		setLinkNum++;
		
		if(flagLink == -1){
			if(setLinkNum < 1){
				//o.showNetTiperBox("无线网络设置失败，重试中. . .");
				o.setLinkTimer = setTimeout(function(){o.checkSetLink(id)},1000);
			}else{
				//o.showNetTiperBox(id,"无线网络连接失败");
				o.showNetTiperBox(id,wifiLanguageArr[0].tip_6);
				clearTimeout(o.setLinkTimer);
			}	
		}else if( flagLink == -5 ){
	    	//o.showNetTiperBox(id,"用户名或密码错误，请重新进行设置");
			o.showNetTiperBox(id,autoLanguageArr[0].tip_3);
			clearTimeout(o.setLinkTimer);
		}else if( flagLink == -2 ){
			o.showNetTiperBox(id,wifiLanguageArr[0].tip_4);
			clearTimeout(o.setLinkTimer);
		}else if( flagLink == -3 ){
			o.showNetTiperBox(id,wifiLanguageArr[0].tip_7);
			clearTimeout(o.setLinkTimer);
		}else if( flagLink == -4 ){
			o.showNetTiperBox(id,wifiLanguageArr[0].tip_6);
			clearTimeout(o.setLinkTimer);
		}
		else{
			var stbtype = mExtend.exec("OvtGetConfig","login_wwwstbtype");
			if(stbtype == "yes"){
				var epg_server_addr = mExtend.exec("OvtGetConfig","epg_server_url");
				window.location.href = epg_server_addr;
			}
			else{
				var auth_addr = mExtend.exec("OvtGetConfig","auth_server_url");
				var auth_user = mExtend.exec("OvtGetConfig","user_name");
				window.location.href = auth_addr+"?UserID="+auth_user+"&Action=Login";
			}
		}
	}	
	o.cancel = function(){
		areaIndex = 1;
		o.getblur();
		o.levelIndex = 0; //水平方向移动的索引
		o.index = 0;
		if( $("wiredless_save_tip").innerHTML != "" ){
			$("wiredless_save_tip").innerHTML = "";
			$("wiredless_save_tip").style.visibility = "hidden";
		}
		$("content_wiredless").style.visibility = "hidden";
		wiredlessLinkArea.contentHide();
		$("content_"+menuArea.index).style.visibility = "visible";
		wiredlessarea.getfocus();
		if( keyboard.keyBoardAreaShow == true ){
				keyboard.hideKeyboard();
		}
		o.hideNetTiperBox("wiredless_save_tip");
	}
	o.hideShow = function(){//从键盘上焦点直接定位到左侧菜单，上下移动菜单焦点时，如果此部分显示，要隐藏掉
		if($("content_wiredless").style.visibility == "visible" ){
			o.levelIndex = 0; 
			o.index = 0;
			$("content_wiredless").style.visibility = "hidden";
			wiredlessLinkArea.contentHide();
			wiredlessarea.getblur();
			wiredlessarea.index = 0;
		}
		if ( o.setLinkTimer　!= 0 ){
			o.hideNetTiperBox("wiredless_save_tip");
		}
	}
	o.outShow = function(){//从键盘上焦点直接定位到左侧菜单，上下移动菜单焦点时，如果此部分显示，要隐藏掉
		if($("content_wiredless").style.visibility == "visible" ){
			o.levelIndex = 0; 
			o.index = 0;
			$("content_wiredless").style.visibility = "hidden";
			wiredlessLinkArea.contentHide();	
			$("content_"+menuArea.index).style.visibility = "visible";
		}
			if( keyboard.keyBoardAreaShow == true ){
				keyboard.hideKeyboard();
			}
		if ( setLinkTimer　!= 0 ){
			o.hideNetTiperBox("wiredless_save_tip");
		}
	}

	o.showKeyBoard = function(){
			keyboard.showKeyboard("whole", "wiredless_login_pw", wiredlessLinkArea.getfocus,"text","",$("wiredless_login_pw").innerHTML) ;
			keyboard.keyBoardAreaFocus = true;
	}
	o.selects = function(){
		if( o.index == 1 ){
			if( o.levelIndex == 0 ){
				o.save();
			}else {
				o.cancel();
			}	
		}else{
			
			if( keyboard.keyBoardAreaShow == true ){
				keyboard.backFocus();
			}else{
				o.showKeyBoard();
			}
		}
	}
	
	o.backs = function(){
		window.location = "../index/index.html";
	}
	return o;
}();

//设置所有文本框获得焦点后，光标的位置
function setInputMouseFocus(id){
	var input = $(id);
	var no = input.value.length; 
	input.index = no;
	setCursorPosition(input,no); 
}
//设置光标位置函数 
function setCursorPosition (ctrl, pos){ 
	if(ctrl.setSelectionRange){ 
	ctrl.focus(); 
	ctrl.setSelectionRange(pos,pos); 
	} 
	else if (ctrl.createTextRange) { 
		var range = ctrl.createTextRange(); 
		range.collapse(true); 
		range.moveEnd('character', pos); 
		range.moveStart('character', pos); 
		range.select(); 
	} 
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
function pageUp(){
	if( areaIndex == 0 ){
		
		menuArea.up();
		
	}else if( areaIndex == 1 ){
		if (  menuArea.index == 0 ){
			//aboutarea.up();
		}else if( menuArea.index == 1 ){
			wiredlessarea.up();	
		}else if( menuArea.index == 2 ){
			wiredPppoeArea.up();
		}else if( menuArea.index == 3 ){
			wiredStaticArea.up();	
		}
	}else if( areaIndex == 2 ){
		wiredlessLinkArea.up();
	}
	
}

function pageDown(){
	if( areaIndex == 0 ){	
		menuArea.down();
			
	}else if( areaIndex == 1 ){
		if (  menuArea.index == 0 ){
			//aboutarea.down();
		}else if( menuArea.index == 1 ){
			wiredlessarea.down();
		}else if( menuArea.index == 2 ){
			wiredPppoeArea.down();
		}else if( menuArea.index == 3 ){
			wiredStaticArea.down();
		}
	}else if( areaIndex == 2 ){
		wiredlessLinkArea.down();
	}
	
}
function pageRight(){
	if( areaIndex == 0 ){
		menuArea.right();
	}else if ( areaIndex == 1 ){
		if( menuArea.index == 0 ){
			wiredAutoArea.right();
		}else if( menuArea.index == 1 ){
			wiredlessarea.right();
		}else if( menuArea.index == 2 ){
			wiredPppoeArea.right();
		}else if( menuArea.index == 3 ){
			wiredStaticArea.right();
		}
	}else if( areaIndex == 2 ){
		wiredlessLinkArea.right();
	}
}

function pageLeft(){
	if( areaIndex == 1 ){
		if( menuArea.index == 0 ){
			wiredAutoArea.left();
		}else if( menuArea.index == 1 ){
			wiredlessarea.left();
		}else if( menuArea.index == 2 ){
			wiredPppoeArea.left();
		}else if( menuArea.index == 3 ){
			wiredStaticArea.left();
		}
	}else if( areaIndex == 2 ){
		wiredlessLinkArea.left();
	}
}

function pageSelect(){
	if(areaIndex == 1 ){
		if( menuArea.index == 0 ){
			wiredAutoArea.selects();
		}else if ( menuArea.index == 1 ){
			wiredlessarea.selects();
		}else if ( menuArea.index == 2 ){
			wiredPppoeArea.selects();
		}else if ( menuArea.index == 3 ){
			wiredStaticArea.selects();
		}
	}else if( areaIndex == 2 ){
		wiredlessLinkArea.selects();
	}
}
function pageBack(){
	if(areaIndex == 0 ){
		menuArea.backs();
		return false;
	 }
	 else  if(areaIndex == 1 ){
		 if( menuArea.index == 0 ){
			wiredAutoArea.backs();
		}else if( menuArea.index == 1 ){
			wiredlessarea.backs();
		}else if( menuArea.index == 2 ){
			wiredPppoeArea.backs();
			return false;
		}else if( menuArea.index == 3 ){
			wiredStaticArea.backs();
			return false;
		}
	} else  if(areaIndex == 2 ){
		wiredlessLinkArea.backs();
	}
}
document.onkeypress = grabEvent;
function grabEvent(event){
		var val = event.which | event.keyCode;
		var NUM = 0;
		if((val <= 57)&&(val >= 48)){
		  NUM = val;
		}
		switch(val){
	
			case ROC_IRKEY_UP: //up 
				if( keyboard.keyBoardAreaFocus ){
				 	keyboard.con_Up();
			    }else{
					pageUp();
				}
				break;
			case ROC_IRKEY_DOWN: //down
				 if( keyboard.keyBoardAreaFocus ){
					 keyboard.con_Down();
				 }else{
					pageDown();
				 }
				break;
			case ROC_IRKEY_LEFT: //left
				 if( keyboard.keyBoardAreaFocus ){
					 keyboard.con_Left();
				 }else{
					pageLeft();
				 }
				break;
			case ROC_IRKEY_RIGHT: //right
				 if( keyboard.keyBoardAreaFocus ){
					 keyboard.con_Right();
				 }else{			
					pageRight();
				 }
				break;
			case ROC_IRKEY_SELECT:
				 if( keyboard.keyBoardAreaFocus ){
					 keyboard.con_Enter();
				 }else{
					pageSelect();
				 }
				break;
			case  ROC_IRKEY_NUM0:
				 if( keyboard.keyBoardAreaFocus ){
					 keyboard.con_0();
				 }
				break;
			case  ROC_IRKEY_NUM1:
				 if( keyboard.keyBoardAreaFocus ){
					 keyboard.con_1();
				 }
				break;
			case  ROC_IRKEY_NUM2:
				 if( keyboard.keyBoardAreaFocus ){
					 keyboard.con_2();
				 }
				break;
			case  ROC_IRKEY_NUM3:
				 if( keyboard.keyBoardAreaFocus ){
					 keyboard.con_3();
				 }
				break;
			case  ROC_IRKEY_NUM4:
				 if( keyboard.keyBoardAreaFocus ){
					 keyboard.con_4();
				 }
				break;
			case  ROC_IRKEY_NUM5:
				 if( keyboard.keyBoardAreaFocus ){
					 keyboard.con_5();
				 }
				break;
			case  ROC_IRKEY_NUM6:
				 if( keyboard.keyBoardAreaFocus ){
					 keyboard.con_6();
				 }
				break;
			case  ROC_IRKEY_NUM7:
				 if( keyboard.keyBoardAreaFocus ){
					 keyboard.con_7();
				 }
				break;
			case  ROC_IRKEY_NUM8:
				 if( keyboard.keyBoardAreaFocus ){
					 keyboard.con_8();
				 }
				break;
			case  ROC_IRKEY_NUM9:
				 if( keyboard.keyBoardAreaFocus ){
					 keyboard.con_9();
				 }
				break;
			case ROC_IRKEY_BACK:
				 if( keyboard.keyBoardAreaFocus ){
					// keyboard.con_Esc();
					 keyboard.outFocus();//改返回到主菜单为到文本框上
					 return false;
				 }else{
					pageBack();
				 }
				return false;
			  break;
			case ROC_IRKEY_EXIT://退出键
					if( keyboard.keyBoardAreaFocus ){
					// keyboard.con_Esc();
					keyboard.outFocus();//改返回到主菜单为到文本框上
					 return false;
				 }else{
					pageBack();
				 }
		 		//window.location = "../index/index.html";
			  break;
		 }
}
