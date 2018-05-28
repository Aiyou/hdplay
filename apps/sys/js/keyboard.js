// JavaScript Document
var keyboard = new function (){
	this.switchStatus = {//constant enum
		switchSmallLetter : 0, //stands for small letter keyboard status
		switchBigLetter : 1, //stands for big letter keyboard status
		switchNum : 2, //stands for number keyboard status
		switchSym : 3, //stands for symbol keyboard status
		switchIP : 4 //stands for ip keyboard
	}
	this.keyBoardAreaFocus = false;//键盘区域是否获取焦点
	this.keyBoardAreaShow = false;//键盘是否处于显示状态
	this.currentStatus = -1;
	//default empty status

	this.keyboardAreaHD = "keyboard_whole";
	//keyboard area handle
	this.nowFocusID = "";
	//id of current focus key

	this.inputBoxID = "";
	//id of input box
	this.bOutFocus = false;
	//whether focus on "Enter" button;
	this.keyboardOutFocusCB = null;
	//callback function when left outfocus
	this.keyboardReturnCB = null;
	//callback function when press "Esc;"
	this.keyboardEnterCB = null;
	//callback function when press "Enter"
	this.keyboardType = "whole";
	// whole/ipinput
	this.inputValue = "";
	//save current keyboard input box value; valid until showing keyboard next time.
	this.inputType = "text";
	//text or password
	this.userCode = "";
	//user code
	this.keyListArray = [//number of every line of one keyList has to be the same, if key in UI is not regular, put key_fake among them
	{
		"lineSize" : 5,
		"keyList" : [//letter keyboard
		"key_a", "key_b", "key_c", "key_d", "key_e", "key_f", "key_g", "key_h", "key_i", "key_j", "key_k", "key_l", "key_m", "key_n", "key_o", "key_p", "key_q", "key_r", "key_s", "key_t", "key_u", "key_v", "key_w", "key_x", "key_y", "fun_del_letter", "key_fake", "key_z", "key_fake", "fun_enter_letter", "switch_small", "key_fake", "switch_big", "switch_num", "switch_sym"]
	}, {
		"lineSize" : 4,
		"keyList" : [//number keyboard
		"key_1", "key_2", "key_fake", "key_3", "key_4", "key_5", "key_fake", "key_6", "key_7", "key_8", "key_fake", "key_9", "fun_del_num", "key_0", "key_fake", "fun_enter_num", "switch_small", "switch_big", "switch_num", "switch_sym"]
	}, {
		"lineSize" : 5,
		"keyList" : [//symbol keyboard
		"key_sym1", "key_sym2", "key_sym3", "key_sym4", "key_sym5", "key_sym6", "key_sym7", "key_sym8", "key_sym9", "key_sym10", "key_sym11", "key_sym12", "key_sym13", "key_sym14", "key_sym15","key_sym16", "key_sym17", "key_sym18", "key_sym19", "key_sym20", "fun_del_sym", "key_fake", "fun_space", "key_fake", "fun_enter_sym", "switch_small", "key_fake", "switch_big", "switch_num", "switch_sym"]
	}, {
		"lineSize" : 3,
		"keyList" : [//ip input keyboard
		"key_ip_1", "key_ip_2", "key_ip_3", "key_ip_4", "key_ip_5", "key_ip_6", "key_ip_7", "key_ip_8", "key_ip_9", "fun_ip_del_num", "key_ip_0", "key_ip_dot", "key_fake", "key_fake", "fun_enter_ip"]
	}];
	

	this.showKeyboard = function(which, inputBox_ID, outFocus_cb,inputType,userCode,default_value) {

		this.hide(this.keyboardAreaHD);
		this.keyboardType = which;
		if (inputBox_ID == "") {
			this.hide("keyboard");
		}
	     this.inputBoxID = inputBox_ID;
		 this.keyboardOutFocusCB = outFocus_cb;//退出键盘焦点的事件
		//this.bOutFocus = false;
		this.keyBoardAreaFocus = true;//键盘显示的变量值
		this.keyBoardAreaShow = true;
		//this.keyboardEnterCB = enter_cb;//完成键 响应的事件
		//this.keyboardReturnCB = esc_cb;//返回键 响应的事件
		this.inputType = inputType;
		this.userCode = userCode;
		if (this.keyboardType == "whole") {
			this.keyboardAreaHD = "keyboard_whole"
			this.nowFocusID = "key_m";
			//switch to small letter keyboard
			
			this.changeStatus(this.switchStatus.switchSmallLetter);
		} else if (this.keyboardType == "number" || this.keyboardType == "ipinput") {
			this.keyboardAreaHD = "keyboard_ipinput";
			this.nowFocusID = "key_ip_5";
			//switch to number letter keyboard
			this.changeStatus(this.switchStatus.switchIP);
		} else {
			//alert("error keyboard type!!!!!!!!!!");
			return;
		}
		if ('undefined' != default_value && null != default_value) {//initial input box real value
			this.inputValue = default_value;
		} else {
			this.inputValue = "";
		}
	
		//add keyfocus style  to current key
		this.addFocus(this.nowFocusID);
		
		//focus on input box
		/*$(this.inputBoxID).blur();*/
		$(this.inputBoxID).className = "InputBlur";
		$(this.inputBoxID).className = "keyInputFocus";
		this.enableBg(true);
		this.show(this.keyboardAreaHD);
	}
	//hide keyboard
	this.hideKeyboard = function() {
	
		if (!this.isVisible()) {
			return;
		}
		
		this.keyBoardAreaShow = false;
	    this.keyBoardAreaFocus = false;
		this.removeFocus(this.nowFocusID);
		
		
		if (this.currentStatus != this.switchStatus.switchSmallLetter) {
			this.changeStatus(this.switchStatus.switchSmallLetter);
			//还原符号状态
		}
		this.enableBg(false);
	    this.hide(this.keyboardAreaHD);
		//$(this.inputBoxID).className = "";
		//$(this.inputBoxID).blur();
		//remove focus of input box
	}

		this.isVisible = function() {
			if( $("keyboard").style.display = "block"){
				return true;
			}else{
				return false;
			}
		}
		this.hide = function(id){
			$(id).style.display = "none";
		}
		this.show = function(id){
			
			$(id).style.display = "block";
		}
		//out focus and lower keyboard
		//selected variable bCB&dir, set it within internal calling
		
		this.outFocus = function() {
			//this.bOutFocus = true;
			this.removeFocus(this.nowFocusID);
			this.keyBoardAreaFocus = false;
			//先清掉当前焦点的样式
			var _this = this;
			var cb = function() {
				if (_this.keyboardOutFocusCB != 'undefined' && _this.keyboardOutFocusCB != null) {
					_this.keyboardOutFocusCB();
				}
			}
			cb();
			this.hideKeyboard();
			//$(this.inputBoxID).className = "";
		}
		//back focus from external
		this.backFocus = function() {
			/*$(this.inputBoxID).blur();*/
			$(this.inputBoxID).className = "InputBlur";
			$(this.inputBoxID).className = "keyInputFocus";
			if( this.currentStatus == this.switchStatus.switchSmallLetter ){
				this.nowFocusID = "key_m";
				this.addFocus(this.nowFocusID);
			}else if( this.currentStatus == this.switchStatus.switchIP ){
				this.nowFocusID = "key_ip_5";
				this.addFocus(this.nowFocusID);
			}
			else{
				this.changeStatus(this.switchStatus.switchSmallLetter);
			}
			this.keyBoardAreaFocus = true;
		}
		
		this.enableBg = function(enable) {
			if (enable) {
				this.show("keyboard");
			} else {
				this.hide("keyboard");
			}
		}
		this.getCurrentIndex = function(nowFocusID,currentKeyList){
			var index;
			for( var i = 0; i < currentKeyList.length ; i++　){
				if( currentKeyList[i] == nowFocusID ){
					index = i;
					break;
				}
			}
			return index;
		}
		this.con_Up = function() {
		
			var currentKeyList = this.keyListArray[this.getCurrentKeylistIndex()].keyList;
			//current key Array
			var currentLineSize = this.keyListArray[this.getCurrentKeylistIndex()].lineSize;
			//current line size of keyboard
			var currentIndex = this.getCurrentIndex(this.nowFocusID, currentKeyList);
			//current Index in key array
			var newIndex = currentIndex - currentLineSize;
			//new index in array
			var newFocus = "";
			//new focus id
		
			if (newIndex < 0) {//in the first line
			
				return;
			} else {
				while (newIndex < currentKeyList.length) {//jump over fake key
					newFocus = currentKeyList[newIndex];
					if (newFocus == "key_fake") {
						newIndex++;
					} else {
						break;
					}
				}
			}
		
			this.removeFocus(this.nowFocusID);
			this.addFocus(newFocus);
			this.nowFocusID = newFocus;
		}
		this.con_Down = function() {
			var currentKeyList = this.keyListArray[this.getCurrentKeylistIndex()].keyList;
			//current key Array
			var currentLineSize = this.keyListArray[this.getCurrentKeylistIndex()].lineSize;
			//current line size of keyboard
			var currentIndex = this.getCurrentIndex(this.nowFocusID, currentKeyList);
			//current Index in key array
			var newIndex = currentIndex + currentLineSize;
			//new index in array
			var newFocus = "";
			//new focus id
			if (newIndex >= currentKeyList.length) {//the last line
				
				return;
			} else {
				while (newIndex < currentKeyList.length) {//jump over fake key
					newFocus = currentKeyList[newIndex];
					if (newFocus == "key_fake") {
						newIndex++;
					} else {
						break;
					}
				}
			}
		
			this.removeFocus(this.nowFocusID);
			this.addFocus(newFocus);
			this.nowFocusID = newFocus;
		}
		
		this.con_Left = function() {
		
			var currentKeyList = this.keyListArray[this.getCurrentKeylistIndex()].keyList;
			//current key Array
			var currentLineSize = this.keyListArray[this.getCurrentKeylistIndex()].lineSize;
			//current line size of keyboard
			var currentIndex = this.getCurrentIndex(this.nowFocusID, currentKeyList);
			//current Index in key array
			var newIndex = currentIndex - 1;
			//new index in array
			var newFocus = "";
			//new focus id
			if ( 0 == currentIndex ) {//it's leftend
				//this.outFocus();
				return;
			}

			while (true) {//jump over fake key
				newFocus = currentKeyList[newIndex];
				if (("key_fake" == newFocus) && ( 0 < newIndex ) ) {
					newIndex--;
				} else {
					break;
				}
			}
		
			if ("key_fake" == newFocus) {//all left key is "fake"
				//leftEndFunc();
				this.outFocus();
				return;
			}
		
			this.removeFocus(this.nowFocusID);
			this.addFocus(newFocus);
			this.nowFocusID = newFocus;
		}
		
		this.con_Right = function() {
		
			var currentKeyList = this.keyListArray[this.getCurrentKeylistIndex()].keyList;
			//current key Array
			var currentLineSize = this.keyListArray[this.getCurrentKeylistIndex()].lineSize;
			//current line size of keyboard
			var currentIndex = this.getCurrentIndex(this.nowFocusID, currentKeyList);
			//current Index in key array
			var newIndex = currentIndex + 1;
			//new index in array
			var newFocus = "";
			//new focus id
		
/*			if (0 == ((currentIndex + 1) % currentLineSize)) {//it's rightend
				this.outFocus();
				return;
			}*/
		    if( currentIndex == currentKeyList.length - 1 ){
			    newIndex = 0;
				newFocus = currentKeyList[newIndex];
			}
			while (true) {//jump over fake key
				newFocus = currentKeyList[newIndex];
				if (("key_fake" == newFocus) && (0 != ((newIndex + 1) % currentLineSize))) {
					newIndex++;
				} else {
					break;
				}
			}
		
			if ("key_fake" == newFocus) {//all right key is "fake"
				this.outFocus();
				return;
			}
		
			this.removeFocus(this.nowFocusID);
			this.addFocus(newFocus);
			this.nowFocusID = newFocus;
		}

		this.con_Enter = function() {
			
			if (this.nowFocusID.substr(0, 4) == "key_") {
				if( this.nowFocusID == "key_sym8" ){
					this.doPrintElseString('"');
				}else if ( this.nowFocusID == "key_sym16" ){
					this.doPrintElseString('<');
				}else if ( this.nowFocusID == "key_sym17" ){
					this.doPrintElseString('>');
				}
				else{
					this.doPrintElseString($(this.nowFocusID).innerHTML);
				}
				return;
			}
		
			if (this.nowFocusID.substr(0, 4) == "fun_") {
				switch(this.nowFocusID.substr(4)) {
					case "del_letter":
					case "del_num":
					case "del_sym":
					case "ip_del_num":
						this.doDel();
						break;
					case "space":
						this.doPrintElseString(" ");
						break;
					case "enter_letter":
					case "enter_num":
					case "enter_sym":
					case "enter_ip":
						this.outFocus();//改提交为关键盘
						//this.doSubmit();
						break;
				}
				return;
			} else {
				switch(this.nowFocusID) {
					case "switch_small":
						this.changeStatus(this.switchStatus.switchSmallLetter);
						break;
					case "switch_big":
						this.changeStatus(this.switchStatus.switchBigLetter);
						break;
					case "switch_num":
						this.changeStatus(this.switchStatus.switchNum);
						break;
					case "switch_sym":
						this.changeStatus(this.switchStatus.switchSym);
						break;
				}
			}
		}
		
		this.con_P = function() {
			this.doDel();
		}
		
		this.con_N = function() {
			this.doSubmit();
		}
		this.con_0 = function() {
			this.doPrintElseString("0");
		}
		
		this.con_1 = function() {
			this.doPrintElseString("1");
		}
		
		this.con_2 = function() {
			this.doPrintElseString("2");
		}
		
		this.con_3 = function() {
			this.doPrintElseString("3");
		}
		
		this.con_4 = function() {
			this.doPrintElseString("4");
		}
		
		this.con_5 = function() {
			this.doPrintElseString("5");
		}
		
		this.con_6 = function() {
			this.doPrintElseString("6");
		}
		
		this.con_7 = function() {
			this.doPrintElseString("7");
		}
		
		this.con_8 = function() {
			this.doPrintElseString("8");
		}
		
		this.con_9 = function() {
			this.doPrintElseString("9");
		}
		this.con_Esc = function() {
			this.removeFocus(this.nowFocusID);
			this.keyBoardAreaFocus = false;
			var _this = this;
			$(this.inputBoxID).className = "";
			var cb = function() {
				if (_this.keyboardReturnCB != 'undefined' && _this.keyboardReturnCB != null) {
					
					_this.keyboardReturnCB();
				}
			}
			cb();
			
		}
		
		this.con_Hot = function() {
			if ("whole" == this.keyboardType) {
				this.changeStatus((this.currentStatus + 1)%4);
				this.resetFocus();
			}
		}
		
		this.doDel = function() {
			
			this.inputValue = this.inputValue.substr(0, this.inputValue.length - 1);
			
			if ( this.inputType == "password"){
		
				$(this.inputBoxID).innerHTML = $(this.inputBoxID).innerHTML.substr(0,$(this.inputBoxID).innerHTML.length - 1);
				$(this.userCode).innerHTML = this.inputValue;
			}else{
				
				$(this.inputBoxID).innerHTML = this.inputValue;
				
			}			
		}
		this.doPrintElseString = function(str) {
		
			if (this.inputValue.length == 32) {	
				//this.showIipInfo("最多只能输入32个字符");
				this.showTipInfo(keyboardLanguageArr[0].tip_0);
				return;				
			}
		
			var cur_str = this.inputValue;
			var add_str = str;
		
			if ("ipinput" == this.keyboardType) {
				var str_list = cur_str.split(".");
				if (str_list.length >= 4 && str_list[str_list.length - 1].length >= 3) {
					return;
				} else if (str_list[str_list.length - 1].length < 3) {
					if ("." == cur_str[cur_str.length - 1] && "." == add_str) {
						return;
					}
					if ("." != add_str) {
						if (2 == str_list[str_list.length - 1].length) {
							var last_nums = parseInt(str_list[str_list.length - 1]) * 10 + parseInt(add_str);
							if (last_nums > 255) {
								return;
							}
						}
						if (2 == str_list[str_list.length - 1].length && str_list.length < 4) {
							add_str = add_str + ".";
						} else {
						}
					}
				} else {
					return;
				}
				
				var test_str = this.inputValue + add_str;
				var test_list = test_str.split(".");
				if (test_list.length > 4) {
					return;
				} else {
					for (var idx = 0; idx < test_list.length; idx++) {
						if (parseInt(test_list[idx]) > 255) {
							return;
						}
					}
				}
			}
		
			this.inputValue = this.inputValue + add_str;
			this.addInputValue(add_str);
		}
		
		this.doSubmit = function() {
			
			var _this = this;
			if ("ipinput" == this.keyboardType) {
				var test_str = this.inputValue;
				var test_list = test_str.split(".");
				if (test_list.length != 4) {
					this.showTipInfo("Invalid input!");
					//this.showTipInfo(keyboardLanguageArr[0].tip_1);
					return;
				}else {
					for (var idx = 0; idx < test_list.length; idx++) {
						if (parseInt(test_list[idx]) <= 255 && 0 <= parseInt(test_list[idx])) {
						} else {
							//this.showTipInfo(keyboardLanguageArr[0].tip_1);
							this.showTipInfo("Invalid input!");
							return;
						}
					}
				}
			}
		
		   this.hideKeyboard();
		   this.keyboardEnterCB();
/*			var cb = function() {
				
				//if (_this.keyboardEnterCB != 'undefined' && _this.keyboardEnterCB != null) {	
					//this.outFocus();
					
					
					//_
				//}
			}
			cb();*/
		}
		
		this.changeStatus = function(status) {
			
			if (status == this.currentStatus) {
				return;
			}
			 this.hide("switchLetter");
			 this.hide("switchNumber");
			 this.hide("switchSymbol");		
			if (status == this.switchStatus.switchSmallLetter) {
				$("key_q").innerHTML = "q";
				$("key_w").innerHTML = "w";
				$("key_e").innerHTML = "e";
				$("key_r").innerHTML = "r";
				$("key_t").innerHTML = "t";
				$("key_y").innerHTML = "y";
				$("key_u").innerHTML = "u";
				$("key_i").innerHTML = "i";
				$("key_o").innerHTML = "o";
				$("key_p").innerHTML = "p";
				$("key_a").innerHTML = "a";
				$("key_s").innerHTML = "s";
				$("key_d").innerHTML = "d";
				$("key_f").innerHTML = "f";
				$("key_g").innerHTML = "g";
				$("key_h").innerHTML = "h";
				$("key_j").innerHTML = "j";
				$("key_k").innerHTML = "k";
				$("key_l").innerHTML = "l";
				$("key_z").innerHTML = "z";
				$("key_x").innerHTML = "x";
				$("key_c").innerHTML = "c";
				$("key_v").innerHTML = "v";
				$("key_b").innerHTML = "b";
				$("key_n").innerHTML = "n";
				$("key_m").innerHTML = "m";
				this.removeClass();
				this.show("switchLetter");
				this.addClass("switch_small");
				
			} else if (status == this.switchStatus.switchBigLetter) {
				$("key_q").innerHTML = "Q";
				$("key_w").innerHTML = "W";
				$("key_e").innerHTML = "E";
				$("key_r").innerHTML = "R";
				$("key_t").innerHTML = "T";
				$("key_y").innerHTML = "Y";
				$("key_u").innerHTML = "U";
				$("key_i").innerHTML = "I";
				$("key_o").innerHTML = "O";
				$("key_p").innerHTML = "P";
				$("key_a").innerHTML = "A";
				$("key_s").innerHTML = "S";
				$("key_d").innerHTML = "D";
				$("key_f").innerHTML = "F";
				$("key_g").innerHTML = "G";
				$("key_h").innerHTML = "H";
				$("key_j").innerHTML = "J";
				$("key_k").innerHTML = "K";
				$("key_l").innerHTML = "L";
				$("key_z").innerHTML = "Z";
				$("key_x").innerHTML = "X";
				$("key_c").innerHTML = "C";
				$("key_v").innerHTML = "V";
				$("key_b").innerHTML = "B";
				$("key_n").innerHTML = "N";
				$("key_m").innerHTML = "M";
				this.removeClass();
		         this.show("switchLetter");
				 this.addClass("switch_big");
			} else if (status == this.switchStatus.switchNum) {
				this.removeClass();
				this.show("switchNumber");
				 this.addClass("switch_num");
			} else if (status == this.switchStatus.switchSym) {
				this.removeClass();
				this.show("switchSymbol");
				this.addClass("switch_sym");
			} else if (status == this.switchStatus.switchIP) {
			}
			this.currentStatus = status;
			this.resetFocus();
		}
		this.getCurrentKeylistIndex = function() {
			var index;
			switch	(this.currentStatus) {
				case this.switchStatus.switchSmallLetter:
					index = 0;
					break;
				case this.switchStatus.switchBigLetter:
					index = 0;
					break;
		
				case this.switchStatus.switchNum:
					index = 1;
					break;
		
				case this.switchStatus.switchSym:
					index = 2;
					break;
				case this.switchStatus.switchIP:
					index = 3;
					break;
				default:
					index = 0;
					break;
			}
			return index;
		}
		
		this.addInputValue = function(str) {//append new str at input box.
		
			var textInputHd = $(this.inputBoxID);
			
			if ( this.inputType == "password"){
				textInputHd.innerHTML = textInputHd.innerHTML + *;
				$(this.userCode).innerHTML = $(this.userCode).innerHTML + str;
			}else{
				textInputHd.innerHTML = textInputHd.innerHTML + str;
			}			
		}
		this.resetFocus = function() {//reset focus when switch status
			switch(this.currentStatus) {
				
				case this.switchStatus.switchSmallLetter:
					this.nowFocusID = "key_m";
					break;
				case this.switchStatus.switchBigLetter:
					this.nowFocusID = "key_m";
					break;
		
				case this.switchStatus.switchNum:
					this.nowFocusID = "key_5";
					break;
		
				case this.switchStatus.switchSym:
					this.nowFocusID = "key_sym8";
					break;
		
				case this.switchStatus.switchIP:
					this.nowFocusID = "key_ip_5";
					break;
		
				default:
					this.nowFocusID = "key_m"
					break;
			}
			
			this.addFocus(this.nowFocusID);
		}
		
		this.addFocus = function(keyid) {
			 var id = $(keyid);
			 var oldClass = id.getAttribute("class");
			 if( ( oldClass == "MiddleKey bigFontSize" ) || ( oldClass == "MiddleKey FunctionKey" ) ){
				  oldClass+=" ";
				  oldClass+= "KeyFocus";
				  id.className=oldClass;
			 }else if( oldClass.substr(0, 6) == "Switch" ){
				  id.className="SwitchKeyFocus";
			 }
		}
		
		this.removeFocus = function(keyid) {
			 var id = $(keyid);
			 var oldClass = id.getAttribute("class");
			 if( ( oldClass == "MiddleKey bigFontSize KeyFocus" ) || ( oldClass == "MiddleKey FunctionKey KeyFocus" ) ){
				  oldClass = "MiddleKey bigFontSize";
				  id.className=oldClass;
			 }else if( oldClass.substr(0, 6) == "Switch" ){
				 
				   if (keyid == "switch_small"){
					   if( this.currentStatus == 0 ){
						    id.className="SwitchKeyCur";
					   }else{
						   id.className="SwitchKey";
					   }
				   }else if (keyid == "switch_big"){
					   if( this.currentStatus == 1 ){
						    id.className="SwitchKeyCur";
					   }else{
						   id.className="SwitchKey";
					   }
				   }else if (keyid == "switch_num"){
					   if( this.currentStatus == 2 ){
						    id.className="SwitchKeyCur";
					   }else{
						   id.className="SwitchKey";
					   }
				   }else if (keyid == "switch_sym"){
					   if( this.currentStatus == 3 ){
						    id.className="SwitchKeyCur";
					   }else{
						   id.className="SwitchKey";
					   }
				   }
			 }
		}
		this.addClass = function(keyid) {	
			  var id = $(keyid);
			  id.className="SwitchKeyCur";
		}
		
		this.removeClass = function() {
			//移除以前键盘的焦点
			if( this.currentStatus == 0 ){			
 				$("switch_small").className="SwitchKey";
			}else if( this.currentStatus == 1 ){			
 				$("switch_big").className="SwitchKey";
			}else if( this.currentStatus == 2 ){			
 				$("switch_num").className="SwitchKey";
			}else if( this.currentStatus == 3 ){			
 				$("switch_sym").className="SwitchKey";
			}
		}
		this.showTipInfo = function(value){
			$("tipContent").innerHTML = value;
			$("keyboardTip").style.visibility = "visible";
			setTimeout(function(){
								$("keyboardTip").style.visibility = "hidden";
								$("tipContent").innerHTML = "";
								}, 2000);
		}
}


/*document.addEventListener("keypress",keyboardGrabEvent,false);
function keyboardGrabEvent(event){
	//处理系统消息框
	var val = event.which | event.keyCode;
	switch(val){
		case ROC_IRKEY_UP:
			 if( keyboard.keyBoardAreaFocus ){
				 keyboard.con_Up();
			 }
			break;
		case ROC_IRKEY_DOWN:
			 if( keyboard.keyBoardAreaFocus ){
				 
				 keyboard.con_Down();
			 }
			break;
		case ROC_IRKEY_RIGHT:
			 if( keyboard.keyBoardAreaFocus ){
				 keyboard.con_Right();
			 }
			break;
		case ROC_IRKEY_LEFT:
			 if( keyboard.keyBoardAreaFocus ){
				 keyboard.con_Left();
			 }
			break;
		case ROC_IRKEY_SELECT:
			 if( keyboard.keyBoardAreaFocus ){
				 keyboard.con_Enter();
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
		case ROC_IRKEY_EXIT:
			 if( keyboard.keyBoardAreaFocus ){
				 keyboard.con_Esc();
			 }
			break;
	}
}*/