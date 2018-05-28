// JavaScript Document
var mExtend = new QjyScript();
var leftIndex = 0;
var rightIndex = 0;
var areaIndex = 0;
var tip_flag = false;
var tipIndex = 0;
var tip_timer = 0;
var upTimes = 0;
var userIndex = 0;
var videoIndex = 0;
var timeIndex = 0;
var timeList = new Array(); 		//时区列表
//var pwdUserCode = 0;
var ovtset = new QjyScript();
//(Turkish = tr),(English = eng),(French = fr),(German = gr)
//var lang_value = mExtend.exec("OvtGetConfig","language");
var lang_value = "cn";
//var lang_value  ="eng"
var lang_flag = 0;  //0中文，1英文
if(lang_value == "tr"){ //Turkish
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
var countryTimezone = ["Greenwich Mean Time : Belfast, Dublin, Lisbon, London, Monrovia","Amsterdam, Berlin, Rome, Stockholm, Vienna, Belgrade, Budapest, Copenhagen, Madrid, Paris","Beirut, Cairo, Gaza, Istanbul, Jerusalem, Syria","Moscow, St. Petersburg, Volgograd, Nairobi","Abu Dhabi, Muscat","Ekaterinburg, Tashkent","Astana, Dhaka","Bangkok, Hanoi, Jakarta","Beijing, Chongqing, Hong Kong, Irkutsk, Ulaan Bataar","Osaka, Sapporo, Tokyo, Seoul, Yakutsk","Brisbane, Hobart, Sidney","Solomon Is., New Caledonia","Auckland, Wellington, Fiji, Kamchatka","Midway Island, Samoa","Hawaii","Alaska","Tijuana, Pacific Time (US & Canada)","Mountain Time (US & Canada), Chihuahua","Saskatchewan, Central America, Central Time (US & Canada)","Eastern Time (US & Canada), Cuba, Bogota","Brazil, Atlantic Time (Canada)","Montevideo, Greenland, Buenos Aires, Brasilia","Mid-Atlantic","Cape Verde Is., Azores"]
var dataTimezone = ["GMT + 0.00","GMT + 1.00","GMT + 2.00","GMT + 3.00","GMT + 4.00","GMT + 5.00","GMT + 6.00","GMT + 7.00","GMT + 8.00","GMT + 9.00","GMT + 10.00","GMT + 11.00","GMT + 12.00","GMT - 11.00","GMT - 10.00","GMT - 9.00","GMT - 8.00","GMT - 7.00","GMT - 6.00","GMT - 5.00","GMT - 4.00","GMT - 3.00","GMT - 2.00","GMT - 1.00"]
//var dataZone = {"totalCount":"24","ItemsContents":[{"zoneId":"GMT + 0.00","countryName":"Greenwich Mean Time : Belfast, Dublin, Lisbon, London, Monrovia"},{"zoneId":"GMT + 1.00","countryName":"Amsterdam, Berlin, Rome, Stockholm, Vienna, Belgrade, Budapest, Copenhagen, Madrid, Paris"},{"zoneId":"GMT + 2.00","countryName":"Beirut, Cairo, Gaza, Istanbul, Jerusalem, Syria"},{"zoneId":"GMT + 3.00","countryName":"Moscow, St. Petersburg, Volgograd, Nairobi"},{"zoneId":"GMT + 4.00","countryName":"Abu Dhabi, Muscat"},{"zoneId":"GMT + 5.00","countryName":"Ekaterinburg, Tashkent"},{"zoneId":"GMT + 6.00","countryName":"Astana, Dhaka"},{"zoneId":"GMT + 7.00","countryName":"Bangkok, Hanoi, Jakarta"},{"zoneId":"GMT + 8.00","countryName":"Beijing, Chongqing, Hong Kong, Irkutsk, Ulaan Bataar"},{"zoneId":"GMT + 9.00","countryName":"Osaka, Sapporo, Tokyo, Seoul, Yakutsk"},{"zoneId":"GMT + 10.00","countryName":"Brisbane, Hobart, Sidney"},{"zoneId":"GMT + 11.00","countryName":"Solomon Is., New Caledonia"},{"zoneId":"GMT + 12.00","countryName":"Auckland, Wellington, Fiji, Kamchatka"},{"zoneId":"GMT - 11.00","countryName":"Midway Island, Samoa"},{"zoneId":"GMT - 10.00","countryName":"Hawaii"},{"zoneId":"GMT - 9.00","countryName":"Alaska"},{"zoneId":"GMT - 8.00","countryName":"Tijuana, Pacific Time (US & Canada)"},{"zoneId":"GMT - 7.00","countryName":"Mountain Time (US & Canada), Chihuahua"},{"zoneId":"GMT - 6.00","countryName":"Saskatchewan, Central America, Central Time (US & Canada)"},{"zoneId":"GMT - 5.00","countryName":"Eastern Time (US & Canada), Cuba, Bogota"},{"zoneId":"GMT - 4.00","countryName":"Brazil, Atlantic Time (Canada)"},,{"zoneId":"GMT - 3.00","countryName":"Montevideo, Greenland, Buenos Aires, Brasilia"},{"zoneId":"GMT - 2.00","countryName":"Mid-Atlantic"},{"zoneId":"GMT - 1.00","countryName":"Cape Verde Is., Azores"}]};
//var dataZone = {"GMT + 0.00":"Greenwich Mean Time : Belfast, Dublin, Lisbon, London, Monrovia","GMT + 1.00":"Amsterdam, Berlin, Rome, Stockholm, Vienna, Belgrade, Budapest, Copenhagen, Madrid, Paris","GMT + 2.00":"Beirut, Cairo, Gaza, Istanbul, Jerusalem, Syria","GMT + 3.00":"Moscow, St. Petersburg, Volgograd, Nairobi","GMT + 4.00":"Abu Dhabi, Muscat","GMT + 5.00":"Ekaterinburg, Tashkent","GMT + 6.00":"Astana, Dhaka","GMT + 7.00":"Bangkok, Hanoi, Jakarta","GMT + 8.00":"Beijing, Chongqing, Hong Kong, Irkutsk, Ulaan Bataar","GMT + 9.00":"Osaka, Sapporo, Tokyo, Seoul, Yakutsk","GMT + 10.00":"Brisbane, Hobart, Sidney","GMT + 11.00":"Solomon Is., New Caledonia","GMT + 12.00":"Auckland, Wellington, Fiji, Kamchatka","GMT - 11.00":"Midway Island, Samoa","GMT - 10.00":"Hawaii","GMT - 9.00":"Alaska","GMT - 8.00":"Tijuana, Pacific Time (US & Canada)","GMT - 7.00":"Mountain Time (US & Canada), Chihuahua","GMT - 6.00":"Saskatchewan, Central America, Central Time (US & Canada)","GMT - 5.00":"Eastern Time (US & Canada), Cuba, Bogota","GMT - 4.00":"Brazil, Atlantic Time (Canada)","GMT - 3.00":"Montevideo, Greenland, Buenos Aires, Brasilia","GMT - 2.00":"Mid-Atlantic","GMT - 1.00":"Cape Verde Is., Azores"}
//var dataTimezone = ["GMT + 0.00","GMT + 1.00","GMT + 2.00","GMT + 3.00","GMT + 4.00","GMT + 5.00","GMT + 6.00","GMT + 7.00","GMT + 8.00","GMT + 9.00","GMT + 10.00","GMT + 11.00","GMT + 12.00","GMT + 13.00","GMT - 12.00","GMT - 11.00","GMT - 10.00","GMT - 9.00","GMT - 8.00","GMT - 7.00","GMT - 6.00","GMT - 5.00","GMT - 4.00","GMT - 3.00","GMT - 2.00","GMT - 1.00"]
var dataLang = {"totalCount":"5","langues":[{"title1":"系统设置","title2":"返回","menu1":"软件升级","menu2":"恢复设置","menu3":"用户管理","menu4":"视频设置","menu1text1":"在线升级","menu1text2":"无线模式下不支持升级，请换为有线","menu1text3":"正在检测……","menu1text4":"升级失败","menu1text5":"检测到新程序","menu1text6":"没有检测到新程序","menu1text7":"正在尝试升级，请稍后……","menu2text1":"恢复出厂设置","menu2text2":"10秒后机器将重启并进入恢复状态","menu3text1":"认证地址","menu3text2":"用户密码","menu3text3":"保存","menu3text4":"用户名","menu3text5":"开始日期","menu3text6":"结束日期","menu3text7":"有效期","menu3text8":"用户级别","menu3text9":"用户状态","menu3text10":"输入条件不能为空","menu3text11":"您的修改已经成功!","menu3text12":"连接失败!","menu3text13":"输入IP不合法","menu3text14":"输入不合法","menu4text1":"视频输出","menu4text2":"高清","menu4text3":"标清","menu4text4":"视频制式","menu4text5":"显示比例","menu4text6":"静帧切换","menu4text7":"否","menu4text8":"是","menu4text9":"语言选择","menu4text10":"中文","menu4text11":"英语","menu4text12":"德语","menu4text13":"法语","menu4text14":"土耳其语","menu4text15":"保存重启","menu4text16":"取消设置","menu4text17":"修改已经保存,即将重启!","menu4text18":"时区","tiptext1":"确定要恢复出厂设置","tiptext2":"确认","tiptext3":"取消"},{"title1":"System Settings","title2":"Back","menu1":"SW Upgrade","menu2":"Reset Default","menu3":"User Settings","menu4":"Display Settings","menu1text1":"Online Upgrade","menu1text2":"Please switch to ethernet","menu1text3":"Searching, please wait……","menu1text4":"Upgrade fails","menu1text5":"New version found","menu1text6":"New version not found","menu1text7":"Upgrading, please wait……","menu2text1":"Reset Default","menu2text2":"STB will restore to factory default settings and reboot in 10 seconds","menu3text1":"Server Code","menu3text2":"User Code","menu3text3":"Connect","menu3text4":"User Name","menu3text5":"Start Date","menu3text6":"Expire Date","menu3text7":"Months","menu3text8":"Level","menu3text9":"Status","menu3text10":"Input cannot be empty","menu3text11":"Connect success!","menu3text12":"Connect failure!","menu3text13":"Invalid IP address","menu3text14":"Invalid input!","menu4text1":"Video Output","menu4text2":"hd","menu4text3":"sd","menu4text4":"Video Format","menu4text5":"Display Scale","menu4text6":"Static Frame","menu4text7":"NO","menu4text8":"YES","menu4text9":"Language","menu4text10":"Chinese","menu4text11":"English","menu4text12":"German","menu4text13":"French","menu4text14":"Turkish","menu4text15":"Save Reboot","menu4text16":"Cancel","menu4text17":"Saved,about to reboot!","menu4text18":"Time Zone","tiptext1":"Continue to factory reset?","tiptext2":"Confirm","tiptext3":"Cancel"}]}

//alert(dataLang.langues[1].logo)
var menuArea = (function(){
	var area = {};
	area.reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
	area.up = function(){
		if(areaIndex == 1){
			if(leftIndex == 2){
				if(userIndex == 0){
					
				}else{
					//keyboard.hideKeyboard();
					area.userblur();
					userIndex --;
					area.userfocus();
					//area.showKeyBoard();
				}
			}else if(leftIndex == 3){
				if(videoIndex == 0){
					
				}else if(videoIndex == 6){
					area.videoblur();
					videoIndex = 4;
					area.videofocus()
				}else{
					area.videoblur();
					videoIndex --;
					area.videofocus();
				}
			}else{
				
			}
		}else{
			if(leftIndex == 0){
				
			}else{
				area.myblur();
				leftIndex --;
				area.myfocus();
				area.showArea();
			}
		}
	}
	area.down = function(){
		if(areaIndex == 1){
			if(leftIndex == 2){
				if(userIndex == 3){
					
				}else if(userIndex == 2){
					//keyboard.hideKeyboard();
					area.userblur();
					userIndex ++;
					area.userfocus();
					//area.showKeyBoard();
				}else{
					//keyboard.hideKeyboard();
					area.userblur();
					userIndex ++;
					area.userfocus();
					//area.showKeyBoard();
				}
			}else if(leftIndex == 3){
				if(videoIndex == 5||videoIndex == 6){
					
				}else{
					area.videoblur();
					videoIndex ++;
					area.videofocus();
				}
			}else{
				
			}
		}else{
			if(leftIndex == 3){
				
			}else{
				area.myblur();
				leftIndex ++;
				area.myfocus();
				area.showArea();
			}
			
		}
	}
	area.right = function(){
		if(tip_flag == true){
			if(tipIndex == 1){

			}else{
				area.tipblur();
				tipIndex ++;
				area.tipfocus();
			}
		}else{
			if(areaIndex == 1){
				 if(leftIndex == 3){
					 if(videoIndex == 5){
						area.videoblur();
						videoIndex ++;
						area.videofocus();
					 }else{
						 
					 }
				 }else if(leftIndex == 2){
					if( userIndex == 0 ){
						if( keyboard.keyBoardAreaShow == true ){
							keyboard.inputBoxID = "input_IP";
							keyboard.inputValue = $("input_IP").innerHTML;
							keyboard.backFocus();
						}else{
							o.showKeyBoard();
						}
		
					}else if( userIndex == 0 ){
						if( keyboard.keyBoardAreaShow == true ){
							keyboard.inputBoxID = "input_Name";
							keyboard.inputValue = $("input_Name").innerHTML;
							keyboard.backFocus();
						}else{
							o.showKeyBoard();
						}
		
					}else if( userIndex == 2 ){
						if( keyboard.keyBoardAreaShow == true ){
							keyboard.inputBoxID = "input_code";
							keyboard.inputValue = $("pwdUserCode").innerHTML;
							keyboard.backFocus();
						}else{
							o.showKeyBoard();
						}
		
					}
				 }else{
					 
				 }
			}else{
				if(leftIndex == 2){	
					area.leftToright();				
					area.userfocus();
					area.leftToright();
					//area.iputright();
					areaIndex = 1;
				}else{
					area.leftToright();
					area.rightfocus();
					areaIndex = 1;
				}
			}
		}
	}
	area.left = function(){
		if(tip_flag == true){
			if(tipIndex == 0){

			}else{
				area.tipblur();
				tipIndex --;
				area.tipfocus();
			}
		}else{
			if(areaIndex == 0){
				
			}else{
				if(leftIndex == 3){
					 if(videoIndex == 6){
						//area.myfocus();
						area.videoblur();
						videoIndex --;
						area.videofocus();
					 }else{
						area.myfocus();
						area.rightblur();
						areaIndex = 0; 
					 }
				 }else{
					area.myfocus();
					area.rightblur();
					areaIndex = 0; 
				 }
			}
		}
	}
	area.showKeyBoard = function(){
		if( userIndex == 0 ){
			keyboard.showKeyboard("whole", "input_IP", area.userfocus,"text","pwdUserCode",$("input_IP").innerHTML) ;
			////////////////----------------------------------------------------------------------------------------------------------------------
		}else if ( userIndex == 1 ){
			keyboard.showKeyboard("whole", "input_Name", area.userfocus,"text","pwdUserCode",$("input_Name").innerHTML) ;/////////////----------------------------------------------------------------------------------------------------------------------
		}
		else if ( userIndex == 2 ){
			keyboard.showKeyboard("whole", "input_code", area.userfocus,"password","pwdUserCode",$("pwdUserCode").innerHTML) ;/////////////----------------------------------------------------------------------------------------------------------------------
		}
		keyboard.keyBoardAreaFocus = true;
	}
	area.iputright = function(){
		if( userIndex == 0 ){
			if( keyboard.keyBoardAreaShow == true ){
				area.userblur();
				keyboard.inputBoxID = "input_IP";
				keyboard.inputValue = $("input_IP").innerHTML;
				keyboard.backFocus();
			}else{
				area.showKeyBoard();
			}

		}else if( userIndex == 1 ){
			if( keyboard.keyBoardAreaShow == true ){
				area.userblur();
				
				keyboard.inputBoxID = "input_Name";
				keyboard.inputValue = $("input_Name").innerHTML;
				keyboard.backFocus();
			}else{
				area.showKeyBoard();
			}
		}
		else if( userIndex == 2 ){
			if( keyboard.keyBoardAreaShow == true ){
				area.userblur();
				
				keyboard.inputBoxID = "input_code";
				keyboard.inputValue = $("pwdUserCode").innerHTML;
				keyboard.backFocus();
			}else{
				area.showKeyBoard();
			}

		}
	}
	area.tipfocus = function(){
		if(tipIndex == 0){
			$("tip_sure").style.background = "url(images/sys_setting/tip_focus1.png) no-repeat";
		}else{
			$("tip_cancel").style.background = "url(images/sys_setting/tip_focus1.png) no-repeat";
		}
	}
	area.tipblur = function(){
		if(tipIndex == 0){
			$("tip_sure").style.background = "url(images/sys_setting/tip_focus.png) no-repeat";
		}else{
			$("tip_cancel").style.background = "url(images/sys_setting/tip_focus.png) no-repeat";
		}
	}
	area.rightfocus = function(){
		if(leftIndex == 0){
			$("up_button").style.background = "url(images/sys_setting/user_focus1.png) no-repeat";
		}else if(leftIndex == 1){
			$("recover_button").style.background = "url(images/sys_setting/user_focus1.png) no-repeat";
		}else if(leftIndex == 2){
			area.userfocus();
		}else{
			area.videofocus();
		}
	}
	
	area.rightblur = function(){
		if(leftIndex == 0){
			$("up_button").style.background = "url(images/sys_setting/user_focus.png) no-repeat";
		}else if(leftIndex == 1){
			$("recover_button").style.background = "url(images/sys_setting/user_focus.png) no-repeat";
		}else if(leftIndex == 2){
			area.userblur();
		}else{
			area.videoblur();
		}
	}
	area.inputfocus = function(){
		
	}
	area.userfocus = function(){
		if(userIndex == 0){
			//var inputText = $("input_IP");
			//inputText.focus();
			$("input_IP").className = "InputFocus";
		}else if(userIndex == 1){
			//var inputText = $("input_code");
			//inputText.focus();
			$("input_Name").className = "InputFocus";
		}else if(userIndex == 2){
			//var inputText = $("input_code");
			//inputText.focus();
			$("input_code").className = "InputFocus";
		}else if(userIndex == 3){
			$("btn_content").style.background = "url(images/sys_setting/btn_focus1.png) no-repeat";
		}
	}
	area.userblur = function(){
		if(userIndex == 0){
			//var inputText = $("input_IP");
			//inputText.blur();
			$("input_IP").className = "InputBlur";
		}else if(userIndex == 1){
			//var inputText = $("input_code");
			//inputText.blur();
			$("input_Name").className = "InputBlur";
		}
		else if(userIndex == 2){
			//var inputText = $("input_code");
			//inputText.blur();
			$("input_code").className = "InputBlur";
		}else if(userIndex == 3){
			$("btn_content").style.background = "url(images/sys_setting/btn_focus.png) no-repeat";
		}
	}
	area.videofocus = function(){
		if(videoIndex == 0){
			$("type_area").focus();
		}else if(videoIndex == 1){
			$("format_area").focus();
		}else if(videoIndex == 2){
			$("scale_area").focus();
		}else if(videoIndex == 3){
			$("lang_area").focus();
		}else if(videoIndex == 4){
			$("time_zone_0").className = "time_focus";
		}else if(videoIndex == 5){
			$("video_save").style.background = "url(images/sys_setting/btn_focus1.png) no-repeat";
		}else if(videoIndex == 6){
			$("video_cancel").style.background = "url(images/sys_setting/btn_focus1.png) no-repeat";
		}
	}
	area.videoblur =function(){
		if(videoIndex == 0){
			$("type_area").blur();
		}else if(videoIndex == 1){
			$("format_area").blur();
		}else if(videoIndex == 2){
			$("scale_area").blur();
		}else if(videoIndex == 3){
			$("lang_area").blur();
		}else if(videoIndex == 4){
			$("time_zone_0").className = "time_blur";
		}else if(videoIndex == 5){
			$("video_save").style.background = "url(images/sys_setting/btn_focus.png) no-repeat";
		}else if(videoIndex == 6){
			$("video_cancel").style.background = "url(images/sys_setting/btn_focus.png) no-repeat";
		}
	}
	area.showArea = function(){
		if(leftIndex == 0){
			$("up_area").style.visibility = "visible";
		}else if(leftIndex == 1){
			$("recover_area").style.visibility = "visible";
		}else if(leftIndex == 2){
			$("user_area").style.visibility = "visible";
		}else if(leftIndex == 3){
			$("video_area").style.visibility = "visible";
		}
	}
	area.leftToright = function(){
		if(leftIndex == 0){
			$("menu_up").style.color = "#30FF00";
		}else if(leftIndex == 1){
			$("menu_recover").style.color = "#30FF00";
		}else if(leftIndex == 2){
			$("menu_user").style.color = "#30FF00";
		}else{
			$("menu_video").style.color = "#30FF00";//30FF00
		}
	}
	//$("net_"+o.index).style.color = "#30FF00";
	area.myfocus = function(){
		if(leftIndex == 0){
			$("menu_up").className= "focus";
			$("menu_up").style.color = "#ffe400";
		}else if(leftIndex == 1){
			$("menu_recover").className= "focus";
			$("menu_recover").style.color = "#ffe400";
		}else if(leftIndex == 2){
			$("menu_user").className= "focus";
			$("menu_user").style.color = "#ffe400";
		}else{
			$("menu_video").className= "focus";
			$("menu_video").style.color = "#ffe400";//30FF00
		}
		if( keyboard.keyBoardAreaShow == true ){///////////////////////////
			keyboard.hideKeyboard();
		}
	}
	area.myblur = function(){
		if(leftIndex == 0){
			$("menu_up").style.color = "#fff";
			$("up_area").style.visibility = "hidden";
		}else if(leftIndex == 1){
			$("menu_recover").style.color = "#fff";
			$("recover_area").style.visibility = "hidden";
		}else if(leftIndex == 2){
			$("menu_user").style.color = "#fff";
			$("user_area").style.visibility = "hidden";
		}else{
			$("menu_video").style.color = "#fff";
			$("video_area").style.visibility = "hidden";
		}
	}
	area.upSetting = function(){
		var upValue = mExtend.exec("OvtGetConfig","GetLoaderCheckStatus");        //------------------------
		//var upValue = " ";
		if( upValue == "201" || upValue == "202" || upValue == "203" || upValue == "204" || upValue == "205" || upValue == "206" ){
			//clearTimeout(tip_timer);
			if(upValue == "201"){
				$("up_text").innerHTML = dataLang.langues[lang_flag].menu1text2;
				clearTimeout(tip_timer);
				
			}else if(upValue == "202"){
				$("up_text").innerHTML = dataLang.langues[lang_flag].menu1text3;
				clearTimeout(tip_timer);
				upTimes = upTimes + 1;
				tip_timer = setTimeout(function(){area.upSetting()},3000);
				
			}else if( (upValue == "203") || (upValue == "204") ){
				$("up_text").innerHTML = dataLang.langues[lang_flag].menu1text4;
				clearTimeout(tip_timer);
				
			}else if(upValue == "205"){
				$("up_text").innerHTML = dataLang.langues[lang_flag].menu1text5;
				clearTimeout(tip_timer);
				
			}else if(upValue == "206"){
				$("up_text").innerHTML = dataLang.langues[lang_flag].menu1text6;
				clearTimeout(tip_timer);
			}
			
			
		}else if( upValue != "201" && upValue != "202" && upValue != "203" && upValue != "204" && upValue != "205" && upValue != "206" ) {
			if(upTimes == 10){
				//alert("000")
				//清除定时器
				clearTimeout(tip_timer);
				////
				$("up_text").innerHTML = dataLang.langues[lang_flag].menu1text4;
				/*if(lang_flag == 0){
					$("up_text").innerHTML = dataLang.langues[0].menu1text4;
				}else if(lang_flag == 1){
					$("up_text").innerHTML = dataLang.langues[1].menu1text4;
				}*/
				//$("up_text").innerHTML = "升级失败";
			}else{
				//alert("upTimes"+upTimes)
				upTimes = upTimes + 1;
				//alert("upTimes11"+upTimes)
				tip_timer = setTimeout(function(){area.upSetting()},3000);
				$("up_text").innerHTML = dataLang.langues[lang_flag].menu1text7;
				/*if(lang_flag == 0){
					$("up_text").innerHTML = dataLang.langues[0].menu1text7;
				}else if(lang_flag == 1){
					$("up_text").innerHTML = dataLang.langues[1].menu1text7;
				}*/
				//$("up_text").innerHTML = "正在尝试升级，请稍后……";
			}
		}
	}
	
	area.timeZone = function(i){
		for(var i = 0; i<24; i++){
			$("time_zone_0").innerHTML = dataZone[i];
			$("time_zone_show").innerHTML = dataZone[i];
			
		}
	}
	area.href = function(){
		if(areaIndex == 1){
			if(leftIndex == 0){//软件升级
				//alert("软件升级");
				Authentication.CTCStartUpdate();                   //------------------------------------
				area.upSetting();
			}else if(leftIndex == 1){//恢复设置
				if(tip_flag == true){
					if(tipIndex == 0){
						$("tip_area").style.visibility = "hidden";
						tip_flag = false;
						//alert("恢复设置");
						ovtset.exec("OvtSetInfor2File","userAll","");
						mExtend.exec("OvtSetConfig","factory_reset","yes");      //恢复设置     -------------------
						mExtend.exec("OvtSetConfig","reboot","entern");     //重启            ----------------------------
					}else{
						$("tip_area").style.visibility = "hidden";
						tip_flag = false;
					}
				}else{
					$("tip_area").style.visibility = "visible";
					tip_flag = true;
				}
			}else if(leftIndex == 2){//用户
				if(userIndex == 3){
					var  userIP =  $("input_IP").innerHTML;
					var  userName =  $("input_Name").innerHTML;
					var  userCode =  $("input_code").innerHTML;
					if( (userIP ==　"")||( userName ==　"")||( userCode ==　"") ){
						$("tipTip").style.visibility = "visible";
						$("tipTip_content").innerHTML = dataLang.langues[lang_flag].menu3text10;
						/*if(lang_flag == 0){
							$("tipTip_content").innerHTML = dataLang.langues[0].menu3text10;
						}else if(lang_flag == 1){
							$("tipTip_content").innerHTML = dataLang.langues[1].menu3text10;
						}*/
						//$("tipTip_content").innerHTML = "输入条件不能为空";
						clearTimeout(tip_timer);
						tip_timer = setTimeout(function (){hiddentip()},2000);
					}else{
						//mExtend.exec("OvtSetConfig","auth_server_url",$("auth_address").value);
						//mExtend.exec("OvtSetConfig","epg_server_url",$("EPG_address").value);
						//$("tipTip_content").innerHTML="您的修改已经成功!";
						//$("tipTip_content").innerHTML = dataLang.langues[lang_flag].menu3text11;-----------------
						/*if(lang_flag == 0){
							$("tipTip_content").innerHTML = dataLang.langues[0].menu3text11;
						}else if(lang_flag == 1){
							$("tipTip_content").innerHTML = dataLang.langues[1].menu3text11;
						}*/
						//$("tipTip").style.visibility = "visible";-----
						clearTimeout(tip_timer);
						tip_timer = setTimeout(function (){hiddentip()},2000);
						getUser();
					}
				}else if(userIndex == 0){
					area.showKeyBoard();
				}else if(userIndex == 1){
					area.showKeyBoard();
				}else if(userIndex == 2){
					area.showKeyBoard();
				}
			}else if(leftIndex == 3){//视频
				if(videoIndex == 4){
					if(timeIndex == 23 ){
						timeIndex = 0;
						
					}else{
						timeIndex ++;
					}
					$("time_zone_0").innerHTML = dataTimezone[timeIndex];
					$("time_zone_show").innerHTML = countryTimezone[timeIndex];
					/*$("time_zone_0").innerHTML = dataZone.ItemsContents[timeIndex].zoneId;
					GF_WebPrint("gggggggggggggggggggggggggggg---------------"+dataZone.ItemsContents[timeIndex].zoneId)
					//dataLang.langues[lang_flag].menu4text2;
					$("time_zone_show").innerHTML = dataZone.ItemsContents[timeIndex].countryName;*/
					
				}else if(videoIndex == 5){
					var display_quality_value = $("type_area").value;
					mExtend.exec("OvtSetConfig","display_quality",display_quality_value);
					var tv_mode_value = $("format_area").value;
					mExtend.exec("OvtSetConfig","tv_mode",tv_mode_value);
					var scale_value = $("scale_area").value;
					mExtend.exec("OvtSetConfig","display_scale",scale_value);
					//var ovt_change_value = $("iframe_area").value;
					//mExtend.exec("OvtSetConfig","ovt_change_iframe_mode",ovt_change_value);
					//var lang_value = $("lang_area").value; //只一种语言-------------
					var lang_value = "eng";
					mExtend.exec("OvtSetConfig","language",lang_value);    //语言-----------------------------
					var time_value_tmp = $("time_zone_0").innerHTML;
					var time_value_In = time_value_tmp.indexOf(".");
					var time_value = time_value_tmp.substring(4,5)+time_value_tmp.substring(6,time_value_In);
					//$("aaa").innerHTML = time_value;
					mExtend.exec("OvtSetConfig","time_zone",time_value);
					mExtend.exec("OvtSetConfig","ntp_server_url",ntp_server_url);
					$("tipTip_content").innerHTML = dataLang.langues[lang_flag].menu4text17;
					/*if(lang_flag == 0){
						$("tipTip_content").innerHTML = dataLang.langues[0].menu4text17;
					}else if(lang_flag == 1){
						$("tipTip_content").innerHTML = dataLang.langues[1].menu4text17;
					}*/
					//$("tipTip_content").innerHTML="修改已经保存,即将重启!";
					$("tipTip").style.visibility = "visible";
					mExtend.exec("OvtSetConfig","reboot","entern");//-------------
				}else if(videoIndex == 6){
					area.rightblur();
					areaIndex = 0; 
					leftIndex = 3;
					area.myfocus();
				}else{
					
				}
			}
		}else{
			
		}
	}
	function hiddentip(){
		$("tipTip").style.visibility = "hidden";
	}

	//
	function initPwd(value){
		var tempPwd  = "";
		if( value.length != 0 ){
			for( var i = 0; i < value.length; i++){
				tempPwd = tempPwd + * ;
			}
		}
		return tempPwd;
	}
	
	function initUser(){
		//机顶盒获取IP ，用户名密码
		var connentionstr = mExtend.exec("OvtGetConfig","auth_server_url"); //机顶盒获取IP 
		var name =  mExtend.exec("OvtGetConfig","user_name");//用户名密码
		var code =  mExtend.exec("OvtGetConfig","password");//用户名密码
		var connentionIP = connentionstr.substring(7,connentionstr.length);
		//$("input_IP").value = connentionIP;
		$("input_IP").innerHTML = connentionIP;
	    //$("input_code").innerHTML = code;//---------------------------------------------------------
		//$("aaa").innerHTML =code;
		$("pwdUserCode").innerHTML = code;
		$("input_code").innerHTML = initPwd(code);
		$("input_Name").innerHTML = name;
	}
	function getUser(){
		var  name_area = $("input_Name").innerHTML;
		var  password_area = $("input_code").innerHTML;
		var  ip_area = $("input_IP").innerHTML;
		if(name_area ==　""||password_area ==　"" || ip_area == ""){
			$("tipTip_content").innerHTML="请填写完整的信息!";
			$("tipTip").style.visibility = "visible";
			clearTimeout(tip_timer);
			tip_timer = setTimeout(function (){hiddentip()},2000);
		}else{
			
			//mExtend.exec("OvtSetConfig",$("input_name").value);
			//mExtend.exec("OvtSetConfig",$("input_password").value);
			mExtend.exec("OvtSetConfig","user_name",$("input_Name").innerHTML);
			mExtend.exec("OvtSetConfig","password",$("pwdUserCode").innerHTML);
			mExtend.exec("OvtSetConfig","auth_server_url","http://"+$("input_IP").innerHTML);
			//mExtend.exec("OvtSetConfig","auth_server_url","172.168.2.120:8082");//
			mExtend.exec("saveConfig");
			MY_PORTAL_ADDR = mExtend.exec("OvtGetConfig", "auth_server_url");
			//mExtend.exec("OvtSetInfor2File",$("input_password").value);
			getData();//重新登录
		}
}

//重新登录
function getData(retried){
	try{
		var checkKey='{"userCode":"'+OVT_CA.NO()+'","password":"'+hex_md5(OVT_CA.PASSWORD())+'","loginDate":"'+getdatestr(0)+'"}';
		var url =MY_PORTAL_ADDR+"/UserLogin?userCode="+OVT_CA.NO()+"&password="+hex_md5(OVT_CA.PASSWORD())+"&checkKey="+hex_md5(checkKey);
		Ajax.request(url,{
			success:function(data){
				if(data.result=="200"){
					$("tipTip_content").innerHTML = dataLang.langues[lang_flag].menu3text11;
					$("tipTip").style.visibility = "visible";
					clearTimeout(tip_timer);
					tip_timer = setTimeout(function (){hiddentip()},2000);
				}else{
				   if(data.infoText.length>0){
						$("tipTip").style.visibility = "visible";
						$("tipTip_content").innerHTML = data.infoText;
						clearTimeout(tip_timer);
						tip_timer = setTimeout(function (){hiddentip()},2000);
				   }
				}
			},
			failure:function(data){
				if( retried ){
					$("tipTip").style.visibility = "visible";
					$("tipTip_content").innerHTML = "登陆失败";
					clearTimeout(tip_timer);
					tip_timer = setTimeout(function (){hiddentip()},2000);
				}else{
					setTimeout( function(){  getData(true) },300 );		
				}
			}
		});
	}catch(e){
		GF_WebPrint("登陆："+e);
	}
}
//密码加密
var hexcase = 0;
var chrsz   = 8;
function hex_md5(s){
	return binl2hex(core_md5(str2binl(s), s.length * chrsz));
}
function core_md5(x, len) {
	x[len >> 5] |= 0x80 << ((len) % 32);
	x[(((len + 64) >>> 9) << 4) + 14] = len;

	var a = 1732584193;
	var b = -271733879;
	var c = -1732584194;
	var d = 271733878;

	for(var i = 0; i < x.length; i += 16) {
		var olda = a;
		var oldb = b;
		var oldc = c;
		var oldd = d;
	
		a = md5_ff(a, b, c, d, x[i+ 0], 7 , -680876936);
		d = md5_ff(d, a, b, c, x[i+ 1], 12, -389564586);
		c = md5_ff(c, d, a, b, x[i+ 2], 17, 606105819);
		b = md5_ff(b, c, d, a, x[i+ 3], 22, -1044525330);
		a = md5_ff(a, b, c, d, x[i+ 4], 7 , -176418897);
		d = md5_ff(d, a, b, c, x[i+ 5], 12, 1200080426);
		c = md5_ff(c, d, a, b, x[i+ 6], 17, -1473231341);
		b = md5_ff(b, c, d, a, x[i+ 7], 22, -45705983);
		a = md5_ff(a, b, c, d, x[i+ 8], 7 , 1770035416);
		d = md5_ff(d, a, b, c, x[i+ 9], 12, -1958414417);
		c = md5_ff(c, d, a, b, x[i+10], 17, -42063);
		b = md5_ff(b, c, d, a, x[i+11], 22, -1990404162);
		a = md5_ff(a, b, c, d, x[i+12], 7 , 1804603682);
		d = md5_ff(d, a, b, c, x[i+13], 12, -40341101);
		c = md5_ff(c, d, a, b, x[i+14], 17, -1502002290);
		b = md5_ff(b, c, d, a, x[i+15], 22, 1236535329);
		
		a = md5_gg(a, b, c, d, x[i+ 1], 5 , -165796510);
		d = md5_gg(d, a, b, c, x[i+ 6], 9 , -1069501632);
		c = md5_gg(c, d, a, b, x[i+11], 14, 643717713);
		b = md5_gg(b, c, d, a, x[i+ 0], 20, -373897302);
		a = md5_gg(a, b, c, d, x[i+ 5], 5 , -701558691);
		d = md5_gg(d, a, b, c, x[i+10], 9 , 38016083);
		c = md5_gg(c, d, a, b, x[i+15], 14, -660478335);
		b = md5_gg(b, c, d, a, x[i+ 4], 20, -405537848);
		a = md5_gg(a, b, c, d, x[i+ 9], 5 , 568446438);
		d = md5_gg(d, a, b, c, x[i+14], 9 , -1019803690);
		c = md5_gg(c, d, a, b, x[i+ 3], 14, -187363961);
		b = md5_gg(b, c, d, a, x[i+ 8], 20, 1163531501);
		a = md5_gg(a, b, c, d, x[i+13], 5 , -1444681467);
		d = md5_gg(d, a, b, c, x[i+ 2], 9 , -51403784);
		c = md5_gg(c, d, a, b, x[i+ 7], 14, 1735328473);
		b = md5_gg(b, c, d, a, x[i+12], 20, -1926607734);
		
		a = md5_hh(a, b, c, d, x[i+ 5], 4 , -378558);
		d = md5_hh(d, a, b, c, x[i+ 8], 11, -2022574463);
		c = md5_hh(c, d, a, b, x[i+11], 16, 1839030562);
		b = md5_hh(b, c, d, a, x[i+14], 23, -35309556);
		a = md5_hh(a, b, c, d, x[i+ 1], 4 , -1530992060);
		d = md5_hh(d, a, b, c, x[i+ 4], 11, 1272893353);
		c = md5_hh(c, d, a, b, x[i+ 7], 16, -155497632);
		b = md5_hh(b, c, d, a, x[i+10], 23, -1094730640);
		a = md5_hh(a, b, c, d, x[i+13], 4 , 681279174);
		d = md5_hh(d, a, b, c, x[i+ 0], 11, -358537222);
		c = md5_hh(c, d, a, b, x[i+ 3], 16, -722521979);
		b = md5_hh(b, c, d, a, x[i+ 6], 23, 76029189);
		a = md5_hh(a, b, c, d, x[i+ 9], 4 , -640364487);
		d = md5_hh(d, a, b, c, x[i+12], 11, -421815835);
		c = md5_hh(c, d, a, b, x[i+15], 16, 530742520);
		b = md5_hh(b, c, d, a, x[i+ 2], 23, -995338651);
		
		a = md5_ii(a, b, c, d, x[i+ 0], 6 , -198630844);
		d = md5_ii(d, a, b, c, x[i+ 7], 10, 1126891415);
		c = md5_ii(c, d, a, b, x[i+14], 15, -1416354905);
		b = md5_ii(b, c, d, a, x[i+ 5], 21, -57434055);
		a = md5_ii(a, b, c, d, x[i+12], 6 , 1700485571);
		d = md5_ii(d, a, b, c, x[i+ 3], 10, -1894986606);
		c = md5_ii(c, d, a, b, x[i+10], 15, -1051523);
		b = md5_ii(b, c, d, a, x[i+ 1], 21, -2054922799);
		a = md5_ii(a, b, c, d, x[i+ 8], 6 , 1873313359);
		d = md5_ii(d, a, b, c, x[i+15], 10, -30611744);
		c = md5_ii(c, d, a, b, x[i+ 6], 15, -1560198380);
		b = md5_ii(b, c, d, a, x[i+13], 21, 1309151649);
		a = md5_ii(a, b, c, d, x[i+ 4], 6 , -145523070);
		d = md5_ii(d, a, b, c, x[i+11], 10, -1120210379);
		c = md5_ii(c, d, a, b, x[i+ 2], 15, 718787259);
		b = md5_ii(b, c, d, a, x[i+ 9], 21, -343485551);
		
		a = safe_add(a, olda);
		b = safe_add(b, oldb);
		c = safe_add(c, oldc);
		d = safe_add(d, oldd);
	}
	return Array(a, b, c, d);
}
function md5_cmn(q, a, b, x, s, t) {
	return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s),b);
}
function md5_ff(a, b, c, d, x, s, t) {
	return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
}
function md5_gg(a, b, c, d, x, s, t) {
	return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
}
function md5_hh(a, b, c, d, x, s, t) {
	return md5_cmn(b ^ c ^ d, a, b, x, s, t);
}
function md5_ii(a, b, c, d, x, s, t) {
	return md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
}
function safe_add(x, y) {
	var lsw = (x & 0xFFFF) + (y & 0xFFFF);
	var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
	return (msw << 16) | (lsw & 0xFFFF);
}
function bit_rol(num, cnt) {
	return (num << cnt) | (num >>> (32 - cnt));
}
function str2binl(str) {
	var bin = Array();
	var mask = (1 << chrsz) - 1;
	for(var i = 0; i < str.length * chrsz; i += chrsz) {
		bin[i>>5] |= (str.charCodeAt(i / chrsz) & mask) << (i%32);
	}
	return bin;
}
function binl2hex(binarray) {
	var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
	var str = "";
	for(var i = 0; i < binarray.length * 4; i++) {
		str += hex_tab.charAt((binarray[i>>2] >> ((i%4)*8+4)) & 0xF) + hex_tab.charAt((binarray[i>>2] >> ((i%4)*8 )) & 0xF);
	}
	return str;
}

/*
i=0代表今天 正数代表未来,负数代表过去。
返回20120904;
*/
function getdatestr(i)
{
	var nowdate=new Date();
	var weekdate=new Date();
	weekdate.setDate(nowdate.getDate()+i);
	var weekyear=weekdate.getFullYear();
	var weekmonth=weekdate.getMonth()+1;
	weekmonth=weekmonth>9?weekmonth:("0"+weekmonth)
	var weekdate=weekdate.getDate();
	weekdate=weekdate>9?weekdate:("0"+weekdate)
	var str=weekyear+''+weekmonth+''+weekdate;
	return str;
}
	
	function initVideo(){
		//视频输出
		var time_zone_value = mExtend.exec("OvtGetConfig","time_zone");
		$("time_zone_0").innerHTML = time_zone_value;
		for(var i= 0; i<dataTimezone.length; i++){
			if(dataTimezone[i] == time_zone_value){
				timeIndex = i;
			}
		}
		$("time_zone_show").innerHTML = countryTimezone[timeIndex];
		//$("time_zone_show").innerHTML = dataZone.ItemsContents[timeIndex].zoneId;
		var videoInputState = false;
		var display_quality_value = mExtend.exec("OvtGetConfig","display_quality");
		//var display_quality_value = "hd";
		//alert(display_quality_value)
		if( display_quality_value != "" ){
				for(var i =0 ;i < 2; i++ ){
					if( $("type_area").options[parseInt(i)].value == display_quality_value ){
						$("type_area").selectedIndex = i;
						videoInputState = true;
						break ;
					}
				}
				
				if ( videoInputState == false ){
					$("type_area").selectedIndex = 0;
				}
		}else{
			$("type_area").selectedIndex = 0;
		}
		var videoState = false;
		//视频制式
		var tv_mode_value = mExtend.exec("OvtGetConfig","tv_mode");
		if( tv_mode_value != "" ){
				for(var i =0 ;i < 8 ; i++ ){
					if( $("format_area").options[parseInt(i)].value == tv_mode_value ){
						$("format_area").selectedIndex = i;
						videoState = true;
						break ;
					}
				}
				
				if ( videoState == false ){
					$("format_area").selectedIndex = 0;
				}
		}else{
			$("format_area").selectedIndex = 0;
		}
		var videoState = false;
		//显示比例
		var scaleState = false;
		var scale_value = mExtend.exec("OvtGetConfig","display_scale");
		if( scale_value != "" ){
				for(var i =0 ;i < 2 ; i++ ){
					if( $("scale_area").options[parseInt(i)].value == scale_value ){
						$("scale_area").selectedIndex = i;
						scaleState = true;
						break ;
					}
				}
				
				if ( scaleState == false ){
					$("scale_area").selectedIndex = 0;
				}
		}else{
			$("scale_area").selectedIndex = 0;
		}
		//语言
		var languageState = false;
		var lang_value = mExtend.exec("OvtGetConfig","language");
		//GF_WebPrint("---"+lang_value)
		if( lang_value != "" ){
				for(var i =0 ;i < 4 ; i++ ){
					if( $("lang_area").options[parseInt(i)].value == lang_value ){
						$("lang_area").selectedIndex = i;
						languageState = true;
						break ;
					}
				}
				if ( languageState == false ){
					$("lang_area").selectedIndex = 0;
				}
		}else{
			$("lang_area").selectedIndex = 0;
		}
	}
	area.initLang = function(){
		$("logo_text").innerHTML = dataLang.langues[lang_flag].title1;
		$("back_text").innerHTML = dataLang.langues[lang_flag].title2;
		$("menu_up").innerHTML = dataLang.langues[lang_flag].menu1;
		$("menu_recover").innerHTML = dataLang.langues[lang_flag].menu2;
		$("menu_user").innerHTML = dataLang.langues[lang_flag].menu3;
		$("menu_video").innerHTML = dataLang.langues[lang_flag].menu4;
		$("up_button_text").innerHTML = dataLang.langues[lang_flag].menu1text1;
		$("recover_button_text").innerHTML = dataLang.langues[lang_flag].menu2text1;
		$("recover_text").innerHTML = dataLang.langues[lang_flag].menu2text2;
		$("user_IP").innerHTML = dataLang.langues[lang_flag].menu3text1;
		$("user_code").innerHTML = dataLang.langues[lang_flag].menu3text2;
		$("user_Name").innerHTML = dataLang.langues[lang_flag].menu3text4;
		$("content_text").innerHTML = dataLang.langues[lang_flag].menu3text3;
		
		$("video_type").innerHTML = dataLang.langues[lang_flag].menu4text1;
		$("hd").innerHTML = dataLang.langues[lang_flag].menu4text2;
		$("sd").innerHTML = dataLang.langues[lang_flag].menu4text3;
		$("video_format").innerHTML = dataLang.langues[lang_flag].menu4text4;
		$("video_scale").innerHTML = dataLang.langues[lang_flag].menu4text5;
		//$("video_iframe").innerHTML = dataLang.langues[lang_flag].menu4text6;
		//$("no").innerHTML = dataLang.langues[lang_flag].menu4text7;
		//$("yes").innerHTML = dataLang.langues[lang_flag].menu4text8;
		$("video_lang").innerHTML = dataLang.langues[lang_flag].menu4text9;
		$("eng").innerHTML = dataLang.langues[lang_flag].menu4text11;
		$("gr").innerHTML = dataLang.langues[lang_flag].menu4text12;
		$("fr").innerHTML = dataLang.langues[lang_flag].menu4text13;
		$("tr").innerHTML = dataLang.langues[lang_flag].menu4text14;
		//$("cn").innerHTML = dataLang.langues[lang_flag].menu4text10;
		$("video_save_text").innerHTML = dataLang.langues[lang_flag].menu4text15;
		$("video_cancel_text").innerHTML = dataLang.langues[lang_flag].menu4text16;
		$("tip_text").innerHTML = dataLang.langues[lang_flag].tiptext1;
		$("tip_sure_text").innerHTML = dataLang.langues[lang_flag].tiptext2;
		$("tip_cancel_text").innerHTML = dataLang.langues[lang_flag].tiptext3;
		$("time_zone").innerHTML = dataLang.langues[lang_flag].menu4text18;
	}

	area.init = function(){
		area.initLang();
		area.myfocus(leftIndex);
		$("up_area").style.visibility = "visible";
		initUser();
		initVideo();
	}
	return area;
}());

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

