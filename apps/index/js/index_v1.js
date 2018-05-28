// JavaScript Document
var menu_index =  getCookie("menu_index");
if( ( menu_index == "") ||( menu_index == "undefined" ) ){
	menu_index = 0;
}else{
	menu_index = parseInt(menu_index,10);
}
var time = function Time(){
	var o = {};
	var timeIntervalID = 0;		// 时间计时器
	o.init = function(){
		o.timeStart();
	}
	o.unload = function(){
		o.timeStop();
	}

	o.timeStart = function(){
		var timeEl = document.getElementById("index_time");
		var date = new Date();
		timeEl.textContent = ( "0" + date.getHours() ).slice(-2) +":"+ ( "0" + date.getMinutes() ).slice(-2);
			
		timeIntervallID = setTimeout(function(){
			var date = new Date();
			timeEl.textContent = ( "0" + date.getHours() ).slice(-2) +":"+ ( "0" + date.getMinutes() ).slice(-2)
			timeIntervallID = setTimeout( arguments.callee, 60 * 1000 );
			}, ( 60 - date.getSeconds() ) * 1000 );
		}
	o.timeStop = function(){
		clearTimeout(timeIntervallID );
	}
		return o;
}();

var areaIndex = 0;
var menuArea = function MenuArea(){
	var o = {};
	
	o.menuLists = [];
	o.index = menu_index;
	o.left = function (){
		if (o.index > 0 ){
			o.myblur();
			o.index = o.index - 1 ;
			if ( areaIndex == 0 ){
				o.myfocus();
			}else{
				o.change();
			}
		   for( i = 1; i >= o.index && i >= 0 ;i-- ){
			  $(o.leftArray[i][0]).style.left = 1280 + "px";
			  $(o.leftArray[i][1]).style.left = 1280 + "px";
		   }
			o.deplay(1);
		}	
	}
	o.right = function (){
		if ( o.index < 2 ) {
			o.myblur();
			o.index =  o.index + 1;
			if ( areaIndex == 0 ){
				o.myfocus();
			}else{
				o.change();
			}
			 for( i = 1;i <= o.index ;i++ ){
				  $(o.rightArray[i][0]).style.left= -1280 + "px";
				  $(o.rightArray[i][1]).style.left= -1280 + "px";
			  }
			o.deplay(2);
		}
	}

	o.myfocus =function (){
		$("item_"+o.index).style.color="#fff";
		if( o.index == 0 ){
			$("item_"+o.index).className = "focus";
		}else if( ( o.index == 1 ) || ( o.index == 2 ) ){
			$("item_"+o.index).className = "focus_03";
		}else{
			$("item_"+o.index).className = "focus_02";
		}		
	}
	o.initFocus = function(){
		o.index = menu_index;
		if (o.index == 0){
			$("item_0").className ="focus";
			$("channel_content").style.left= 0 + "px";
			$("ch_shadow").style.left= 0 + "px";
		}else if(o.index != 0 ){
			$("item_"+o.index).style.color="#fff";
			o.myfocus();
			$(o.rightArray[o.index][2]).style.left= 0 + "px";
			$(o.rightArray[o.index][3]).style.left= 0 + "px";
		}		
	}
	o.rightArray = new Array(3);
	o.rightArray[0] = [];
	o.rightArray[1] = ["channel_content","ch_shadow","user_content","user_shadow"];
	o.rightArray[2] = ["user_content","user_shadow","sys_content","sys_shadow"];
/*	o.rightArray = new Array(5);
	o.rightArray[0] = [];
	o.rightArray[1] = ["channel_content","ch_shadow","vod_content","vod_shadow"];
	o.rightArray[2] = ["vod_content","vod_shadow","sort_content","sort_shadow"];
	o.rightArray[3] = ["sort_content","sort_shadow","user_content","user_shadow"];
	o.rightArray[4] = ["user_content","user_shadow","sys_content","sys_shadow"];*/
    o.moveRight = function(hideContent,hideShadow,showContent,showShadow){
		$(hideContent).style.left= -1280 + "px";
		$(hideShadow).style.left= -1280 + "px";
		var distance = 1280;
		var timePiter =  setInterval( function(){
		if ( distance != 0 ){
				distance = distance - 256;
				$(showContent).style.left = distance + "px";
				$(showShadow).style.left= distance + "px";
		}else {
			  clearInterval(timePiter);
			  for( i = 1;i <= o.index ;i++ ){
				  $(o.rightArray[i][0]).style.left= -1280 + "px";
				  $(o.rightArray[i][1]).style.left= -1280 + "px";
			  }
		}
	  },50);
	}
	o.leftArray = new Array(3);
	o.leftArray[0] = ["user_content","user_shadow","channel_content","ch_shadow"];
	o.leftArray[1] = ["sys_content","sys_shadow","user_content","user_shadow"];
	o.leftArray[2] = ["sys_content","sys_shadow","user_content","user_shadow"];
/*	o.leftArray = new Array(5);
	o.leftArray[0] = ["vod_content","vod_shadow","channel_content","ch_shadow"];
	o.leftArray[1] = ["sort_content","sort_shadow","vod_content","vod_shadow"];
	o.leftArray[2] = ["user_content","user_shadow","sort_content","sort_shadow"];
	o.leftArray[3] = ["sys_content","sys_shadow","user_content","user_shadow"];
	o.leftArray[4] = ["sys_content","sys_shadow","user_content","user_shadow"];*/
	o.moveLeft = function(hideContent,hideShadow,showContent,showShadow){
		$(hideContent).style.left= 1280 + "px";
		$(hideShadow).style.left= 1280 + "px";
		var distance = -1280;
		var timePiter =  setInterval( function(){
		if ( distance != 0 ){
				distance = distance + 256;
				$(showContent).style.left = distance + "px";
				$(showShadow).style.left= distance + "px";
		}else {
			  clearInterval(timePiter);
			   for( i = 1; i >= o.index && i >= 0 ;i-- ){
				  $(o.leftArray[i][0]).style.left = 1280 + "px";
				  $(o.leftArray[i][1]).style.left = 1280 + "px";
			  }
		}
	  },50);
	}
	o.myblur = function (){
		$("item_"+o.index).className ="";
		$("item_"+o.index).style.color="#8c8c8c";
	}
	o.down = function(){
		if( areaIndex == 0 ){
			o.myblur();
		}
		areaIndex = o.index + 1;
		$("item_"+o.index).style.color="#fff";
		if( areaIndex == 1 ){
			imgArea.myfocus();
		}/*else if (areaIndex == 2 ){
			vodImgArea.myfocus();
		}else if (areaIndex == 3 ){
			sortImgArea.myfocus();
		}*/
		else if (areaIndex == 2 ){
			userImgArea.myfocus();
		}else if (areaIndex == 3 ){
			sysImgArea.myfocus();
		}
	}	
	o.getdown = function(){
		areaIndex = o.index + 1;
		$("item_"+o.index).style.color="#fff";
		if( areaIndex == 1 ){
			//imgArea.index = 2;
			imgArea.myfocus();
		}/*else if (areaIndex == 2 ){
			//vodImgArea.index = 6;
			vodImgArea.myfocus();
		}else if (areaIndex == 3 ){
			//sortImgArea.index = 3;
			sortImgArea.myfocus();
		}*/
		else if (areaIndex == 2 ){
			//userImgArea.index = 2;
			userImgArea.myfocus();
		}else if (areaIndex == 3 ){
			sysImgArea.myfocus();
		}
	}
	o.change = function (){
		$("item_"+o.index).style.color="#fff";
	}
	var downdeplay_play = 0;
	o.menuright = function (){
		o.right();
		clearTimeout(downdeplay_play);	
		//o.down();
		downdeplay_play = setTimeout(function(){o.down();},300);
	}
	var getdowndeplay_play = 0;
	o.menuleft = function (){
		o.left();
		//o.getdown();
		clearTimeout(getdowndeplay_play);	
		getdowndeplay_play = setTimeout(function(){o.getdown();},300);
	}
	o.up = function(){
		return ;
	}
	o.selectfocus = function(){
	}
	var leftdeplay_play = 0;
	var rightdeplay_play = 0;
	o.deplay = function (direction){		 
		if(direction == 1){
			clearTimeout(leftdeplay_play);	
		leftdeplay_play = setTimeout(function(){o.moveLeft(o.leftArray[o.index][0],o.leftArray[o.index][1],o.leftArray[o.index][2],o.leftArray[o.index][3])},300);
		}else{
			clearTimeout(rightdeplay_play);	
		rightdeplay_play = setTimeout(function(){o.moveRight(o.rightArray[o.index][0],o.rightArray[o.index][1],o.rightArray[o.index][2],o.rightArray[o.index][3])},300);
		}
	}
	return o;
}();

var commonFuns = function CommonFuns(){
	var o = {};
		
	o.getPixValue = function( border,value ){
		var pix ;
		if ( value == "top"){
			 pix = $(border).style.top;
		}else if ( value == "left"){
			 pix = $(border).style.left;
		}
		else if ( value == "width"){
			 pix = $(border).style.width;
		}
		else if ( value == "height"){
			 pix = $(border).style.height;
		}
		return  pixValue = parseInt(pix.substring(0,pix.indexOf("px") ) );
	}
	o.setPixValue = function( border,top,left,width,height,flag){
	   $(border).style.left = left + "px";
	   $(border).style.width = width + "px";
	   $(border).style.height = height + "px";
	   $(border).style.top = top + "px";
	   if ( flag == 1 ){
		    $(border).style.visibility = "hidden";
	   }
	}
	o.setBoxFocusPixValue = function( imgbox,imgid,top,left,width,height,padding,zindex,imgwidth,imgheight,flag){
				$(imgbox).style.top = top + "px";
				$(imgbox).style.left = left + "px";
				$(imgbox).style.padding = padding + "px";
				$(imgbox).style.width = width + "px";
				$(imgbox).style.height = height + "px";
				$(imgbox).style.zIndex = zindex;
				
				$(imgid).style.width = imgwidth + "px";
				$(imgid).style.height = imgheight + "px";
				if ( flag == 1 ){
					$(imgid).style.borderRadius=5+"px";
					$(imgid).style.border = "solid 2px #fff";
				}else{
					$(imgbox).style.background = "url(images/space.png) no-repeat";
					$(imgid).style.borderRadius=0+"px";
					$(imgid).style.border = "solid 0px #fff";
				}

	}

	o.setIdFocusPixValue = function( imgid,width,height){

	}	
		return o;
}();
/*---------直播电视---------*/	
var imgArea = function ImgArea(){
	var o = {};
	
	o.index = 0;
	o.beforeIndex = 0;
	o.left = function (){
		if( ( o.index != 0 ) && (o.index != 3 ) ){
			o.myblur();
			if( o.index == 1 ){
				o.beforeIndex = o.index;
				o.index =  o.index - 1 ;	
			}else if ( o.index == 2 ){
				o.index = o.beforeIndex ;
			}
			else  if ((o.index <= 5 ) && (o.index > 3 ) ){
				o.beforeIndex = o.index;
				o.index =  o.index - 1 ;
			}
			o.imgBorderLeft();
		}
	}
	o.right = function (){
		o.myblur();
		if( ( o.index < 2 ) || ( ( o.index >= 3 )&& ( o.index < 5 )) ){
			o.beforeIndex = o.index;
			o.index = o.index + 1 ;
			o.imgBorderRight();
		}
		else if( o.index == 5 ){
			o.beforeIndex = o.index ;
			o.index = 2;
			o.imgBorderRight();
		}
		else if ( o.index == 2 ){
			menuArea.menuright();
		}
	}
	o.imgBorderRight = function (){
        var targetTop = 0,targetLeft = 0; targetWidth = 0,targetHeight = 0;
		var topValue = commonFuns.getPixValue("img_border","top");
		var leftValue = commonFuns.getPixValue("img_border","left")
		var widthValue = commonFuns.getPixValue("img_border","width");
		var heightValue = commonFuns.getPixValue("img_border","height");
		
		var val= o.index; 
		switch(val){
	
			case 0: 
				break;
			case 1:
			   targetLeft = 626; targetWidth = 306;targetHeight = 254;  targetTop = -20;   //渐变
			    $("img_border").style.visibility = "visible"; 				  
				var timePiter =  setInterval( function(){
			
					if( ( leftValue >= targetLeft ) || ( widthValue <= targetWidth ) ){
					   commonFuns.setPixValue ( "img_border",targetTop,targetLeft,targetWidth,targetHeight,1);
					   o.myfocus();
					   clearInterval(timePiter);
					
					}else{
					   heightValue = 210 ;
					   topValue = 0 ;
					   leftValue = leftValue + 60 ;
					   widthValue = widthValue - 30 ;
					   commonFuns.setPixValue ( "img_border",topValue,leftValue,widthValue,heightValue,0 );
					}
					
			  },5);
				break;
			case 2:
			 	targetLeft = 890; 
			    targetWidth = 324;
				targetHeight = 466;
				targetTop = -20;
			    $("img_border").style.visibility = "visible"; 				  
				var timePiter =  setInterval( function(){
			
					if( ( leftValue >= targetLeft ) || ( widthValue >= targetWidth ) ||(heightValue >= targetHeight) ){
					   commonFuns.setPixValue ( "img_border",targetTop,targetLeft,targetWidth,targetHeight,1 );
					   o.myfocus();
					   clearInterval(timePiter);
					
					}else{
					   leftValue = leftValue + 20 ;
					   widthValue = widthValue + 2 ;
					   heightValue = heightValue + 20 ;
					   if( o.beforeIndex == 5 ){
						    topValue = topValue - 15 ;
					   }
					   if( o.beforeIndex == 1 ){
						    topValue = 0 ;
					   }
					   commonFuns.setPixValue ("img_border",topValue,leftValue,widthValue,heightValue,0);						
					}
					
			  },2);
				break;
			case 3:
			
				break;
			case 4:
			   targetLeft = 362; 
			   
 			   targetTop = 192; //渐变
			   targetWidth = 306;//渐变
			   targetHeight = 254;//渐变
			    $("img_border").style.visibility = "visible"; 				  
				var timePiter =  setInterval( function(){
			
					if( leftValue >= targetLeft ) {
					  commonFuns.setPixValue ( "img_border",targetTop,targetLeft,targetWidth,targetHeight,1);
					   o.myfocus();
					   clearInterval(timePiter);
					
					}else{
					    leftValue = leftValue + 20 
					    widthValue = 262;
					    heightValue = 210 ;
					    topValue = 212 ;
					    commonFuns.setPixValue ("img_border",topValue,leftValue,widthValue,heightValue,0);
					}
					
			  },2);
				break;
			case 5:
				targetLeft = 662; 
				targetTop = 192; //渐变
			    targetWidth = 306;//渐变
			    targetHeight = 254;//渐变

			    $("img_border").style.visibility = "visible"; 				  
				var timePiter =  setInterval( function(){
			
					if( leftValue >= targetLeft ) {
					    commonFuns.setPixValue ( "img_border",targetTop,targetLeft,targetWidth,targetHeight,1 );
					   o.myfocus();
					   clearInterval(timePiter);
					
					}else{
					   leftValue = leftValue + 20 ;
						widthValue = 262;
					    heightValue = 210 ;
					    topValue = 212 ;
					    commonFuns.setPixValue ("img_border",topValue,leftValue,widthValue,heightValue,0);
					}
					
			  },2);
				break;
		}
	}
	o.imgBorderLeft = function (){
        var targetTop = 0,targetLeft = 0; targetWidth = 0,targetHeight = 0;
		var topValue = commonFuns.getPixValue("img_border","top");
		var leftValue = commonFuns.getPixValue("img_border","left")
		var widthValue = commonFuns.getPixValue("img_border","width");
		var heightValue = commonFuns.getPixValue("img_border","height");
		
		var val= o.index; 
		switch(val){
	
			case 0: 
			   targetLeft = 98; 
			   targetWidth = 570;
			   targetHeight = 254;//渐变
			   targetTop = -20;   //渐变
			    $("img_border").style.visibility = "visible"; 				  
				var timePiter =  setInterval( function(){
			
					if( ( leftValue <= targetLeft ) || ( widthValue >= targetWidth ) ){
					   commonFuns.setPixValue ( "img_border",targetTop,targetLeft,targetWidth,targetHeight,1 );
					   o.myfocus();
					   clearInterval(timePiter);
					
					}else{
					   leftValue = leftValue - 60 ;
					   widthValue = widthValue + 30 ;
					   heightValue = 210;
					   topValue = 0 ;
					   commonFuns.setPixValue ("img_border",topValue,leftValue,widthValue,heightValue,0);
					}
					
			  },2);
			
				break;
			case 1:
			   targetLeft = 626; 
			   targetWidth = 306;
			   targetHeight = 254;
			   targetTop = -20;
			    $("img_border").style.visibility = "visible"; 				  
				var timePiter =  setInterval( function(){
			
					if( ( leftValue <= targetLeft ) || ( widthValue <= targetWidth )|| ( heightValue <= targetHeight ) ){
					   commonFuns.setPixValue ( "img_border",targetTop,targetLeft,targetWidth,targetHeight,1 );
					   o.myfocus();
					   clearInterval(timePiter);
					
					}else{
					   leftValue = leftValue - 20 ;
					   widthValue = widthValue - 2 ;
					   heightValue = heightValue - 20 ;
					   topValue = 0 ;
					   commonFuns.setPixValue ("img_border",topValue,leftValue,widthValue,heightValue,0);
					}
					
			  },2);
				break;
			case 2:

				break;
			case 3:
				targetLeft = 98; 				
				targetTop = 192; //渐变
			    targetWidth = 306;//渐变
 				targetHeight = 254;//渐变
			    $("img_border").style.visibility = "visible"; 				  
				var timePiter =  setInterval( function(){
			
					if( leftValue <= targetLeft ) {
					  commonFuns.setPixValue ( "img_border",targetTop,targetLeft,targetWidth,targetHeight,1 );
					   o.myfocus();
					   clearInterval(timePiter);					
					}else{
					   leftValue = leftValue - 30 ;
					   widthValue = 262 ;
					   heightValue = 210 ;
					   topValue = 212 ;
					    commonFuns.setPixValue ("img_border",topValue,leftValue,widthValue,heightValue,0);
					}
					
			  },2);
				break;
			case 4:
			    targetLeft = 362; 
				targetTop = 192; //渐变
			    targetWidth = 306;//渐变
 				targetHeight = 254;//渐变
			    $("img_border").style.visibility = "visible"; 				  
				var timePiter =  setInterval( function(){
			
					if( leftValue <= targetLeft ) {
					    commonFuns.setPixValue ( "img_border",targetTop,targetLeft,targetWidth,targetHeight,1 );
					   o.myfocus();
					   clearInterval(timePiter);
					
					}else{
					   leftValue = leftValue - 30 ;
					   widthValue = 262;
					   heightValue = 210 ;
					   topValue = 212 ;
					  commonFuns.setPixValue ("img_border",topValue,leftValue,widthValue,heightValue,0);	
					}
					
			  },2);
				break;
			case 5:
			   targetLeft = 626; 
			   targetWidth = 306;
			   targetHeight = 254;
			   targetTop = 192;
			    $("img_border").style.visibility = "visible"; 				  
				var timePiter =  setInterval( function(){
			
					if( leftValue <= targetLeft  ){
					   commonFuns.setPixValue ( "img_border",targetTop,targetLeft,targetWidth,targetHeight,1 );
					   o.myfocus();
					   clearInterval(timePiter);
					
					}else{
					   leftValue = leftValue - 20 ;
					   widthValue = 262 ;
					   heightValue = 210;
					   topValue = 212 ;
					   commonFuns.setPixValue ("img_border",topValue,leftValue,widthValue,heightValue,0);
					}
					
			  },2);
				break;
		}
	}
	o.imgBorderDown = function (){
        var targetTop = 0,targetLeft = 0; targetWidth = 0,targetHeight = 0;
		var topValue = commonFuns.getPixValue("img_border","top");
		var leftValue = commonFuns.getPixValue("img_border","left")
		var widthValue = commonFuns.getPixValue("img_border","width");
		var heightValue = commonFuns.getPixValue("img_border","height");
		
		var val= o.index; 
		switch(val){
	
			case 0: 
				break;
			case 1:
				break;
			case 2:
				break;
			case 3:
				targetTop = 192; 
				targetWidth = 306;
				
				targetLeft = 98; //渐变		
				targetHeight = 254;//渐变
			    $("img_border").style.visibility = "visible"; 				  
				var timePiter =  setInterval( function(){
			
					if( ( topValue >= targetTop ) || ( widthValue <= targetWidth ) ){
					   commonFuns.setPixValue ( "img_border",targetTop,targetLeft,targetWidth,targetHeight,1 );
					   o.myfocus();
					   clearInterval(timePiter);
					
					}else{
					   topValue = topValue + 30 ;
					   widthValue = widthValue - 30 ;
					   heightValue = 210 ;
					   leftValue = 118 ;
					   commonFuns.setPixValue ("img_border",topValue,leftValue,widthValue,heightValue,0);	
					}
					
			  },2);
				break;
			case 4:
				targetTop = 192; 
				targetWidth = 306;
				
				targetLeft = 362; //渐变		
				targetHeight = 254;//渐变
			    $("img_border").style.visibility = "visible"; 				  
				var timePiter =  setInterval( function(){
			
					if( ( topValue >= targetTop ) || ( widthValue <= targetWidth ) ){
					  commonFuns.setPixValue ( "img_border",targetTop,targetLeft,targetWidth,targetHeight,1 );
					   o.myfocus();
					   clearInterval(timePiter);
					
					}else{
					   topValue = topValue + 30 ;
					   widthValue = widthValue - 33 ;
					   heightValue = 210 ;
					   leftValue = leftValue + 30;
					   commonFuns.setPixValue ("img_border",topValue,leftValue,widthValue,heightValue,0);	
					}
					
			  },2);
				break;
			case 5:

			    targetTop = 192; 
				
				targetWidth = 306;//渐变	
				targetLeft = 662; //渐变		
				targetHeight = 254;//渐变
			    $("img_border").style.visibility = "visible"; 				  
				var timePiter =  setInterval( function(){
			
					if( topValue >= targetTop ) {
					   commonFuns.setPixValue ( "img_border",targetTop,targetLeft,targetWidth,targetHeight,1 );
					   o.myfocus();
					   clearInterval(timePiter);
					
					}else{
					   topValue = topValue + 15 ;
					   widthValue = 262 ;
					   heightValue = 210;
					   leftValue = 646 ;
					  commonFuns.setPixValue ("img_border",topValue,leftValue,widthValue,heightValue,0);	
					}
					
			  },2);
				break;
		}
	}
	o.imgBorderUp = function (){
        var targetTop = 0,targetLeft = 0; targetWidth = 0,targetHeight = 0;
		var topValue = commonFuns.getPixValue("img_border","top");
		var leftValue = commonFuns.getPixValue("img_border","left")
		var widthValue = commonFuns.getPixValue("img_border","width");
		var heightValue = commonFuns.getPixValue("img_border","height");
		
		var val= o.index; 
		switch(val){
	
			case 0: 
				targetTop = -20; 
				targetWidth = 570;
				targetLeft = 98;
				
				targetHeight = 254;//渐变
			    $("img_border").style.visibility = "visible"; 				  
				var timePiter =  setInterval( function(){
			
					if( ( topValue <= targetTop ) || ( widthValue >= targetWidth ) ){
					   commonFuns.setPixValue ( "img_border",targetTop,targetLeft,targetWidth,targetHeight,1 );
					   o.myfocus();
					   clearInterval(timePiter);
					
					}else{
					   topValue = topValue - 15 ;
					   widthValue = widthValue + 30 ;
					   heightValue = 210 ;
					  if( o.beforeIndex == 3 ){
						   leftValue = 118 ;
					  }else if( o.beforeIndex == 4 ){
						  leftValue = leftValue - 32 ;
					  }
					   commonFuns.setPixValue ("img_border",topValue,leftValue,widthValue,heightValue,0);	
					}
					
			  },2);
				break;
			case 1:
				targetTop = -20; 
				
				targetWidth = 306;//渐变	
				targetLeft = 662; //渐变		
				targetHeight = 254;//渐变
			    $("img_border").style.visibility = "visible"; 				  
				var timePiter =  setInterval( function(){
			
					if( topValue <= targetTop ) {
					   commonFuns.setPixValue ( "img_border",targetTop,targetLeft,targetWidth,targetHeight,1 );
					   o.myfocus();
					   clearInterval(timePiter);
					
					}else{
					   topValue = topValue - 15 ;
					   widthValue = 262;
					   heightValue = 210 ;
					   leftValue = 646 ;
					  commonFuns.setPixValue ("img_border",topValue,leftValue,widthValue,heightValue,0);	
					}
					
			  },2);
				break;
			case 2:

				break;
			case 3:
			  
				break;
			case 4:

				break;
			case 5:
			   
				break;
		}
	}
	o.myfocus =function (){
		var val= o.index; 
		switch(val){
	
			case 0: 
			    commonFuns.setBoxFocusPixValue ( "imgBox_1","img_1",-120,-2,570,254,100,2,566,250,1 );
				$("imgBox_1").style.background = "url(images/img1_bg.png) no-repeat";
				break;
			case 1: 
			    commonFuns.setBoxFocusPixValue ( "imgBox_2","img_2",-120,526,306,254,100,2,302,250,1);
				$("imgBox_2").style.background = "url(images/img2_bg.png) no-repeat";
				break;
			case 2: 
			    commonFuns.setBoxFocusPixValue ( "imgBox_3","img_3",-120,790,324,466,100,2,320,462,1 );
				$("imgBox_3").style.background = "url(images/img3_bg.png) no-repeat";			
				break;
			case 3: 
			    commonFuns.setBoxFocusPixValue ( "imgBox_4","img_4",92,-2,306,254,100,2,302,250,1 );
				$("imgBox_4").style.background = "url(images/img2_bg.png) no-repeat";
				break;

			case 4:
			    commonFuns.setBoxFocusPixValue ( "imgBox_5","img_5",92,262,306,254,100,2,302,250,1 );
				$("imgBox_5").style.background = "url(images/img2_bg.png) no-repeat";
				break;

			case 5:
			    commonFuns.setBoxFocusPixValue ( "imgBox_6","img_6",92,526,306,254,100,2,302,250,1 );
				$("imgBox_6").style.background = "url(images/img2_bg.png) no-repeat";
			  break;
		 }
	}

	o.myblur = function (){
 		var val= o.index; 
		switch(val){
	
			case 0: 
				commonFuns.setBoxFocusPixValue ( "imgBox_1","img_1",0,118,526,210,0,1,526,210,0);
				break;
			case 1: 
				commonFuns.setBoxFocusPixValue ( "imgBox_2","img_2",0,646,262,210,0,1,262,210,0);
				break;
			case 2: 
			   commonFuns.setBoxFocusPixValue ( "imgBox_3","img_3",0,910,280,422,0,1,280,422,0);
				break;
			case 3: 
			    commonFuns.setBoxFocusPixValue ( "imgBox_4","img_4",212,118,262,210,0,1,262,210,0);
				break;

			case 4:
			    commonFuns.setBoxFocusPixValue ( "imgBox_5","img_5",212,382,262,210,0,1,262,210,0);
				break;

			case 5:
				commonFuns.setBoxFocusPixValue ( "imgBox_6","img_6",212,646,262,210,0,1,262,210,0);
			  break;
		 }
	}
	o.down = function(){
		if( areaIndex == 1 ){
			
			if( o.index < 2 ){
				
				var val= o.index; 
				switch(val){
			
					case 0: 
						o.myblur();
					    if( ( o.beforeIndex == 0 )||(o.beforeIndex == 1 ) ){
							o.index = 3;
						
						}else {	
							o.index = o.beforeIndex;
							o.beforeIndex = 0 ;
						}
						o.imgBorderDown();
						break;
					case 1: 
						o.myblur();
						o.beforeIndex = o.index ;
						o.index = 5;
						o.imgBorderDown();
						break;
				 }
			}
		}
	}
	o.up = function(){
		if(areaIndex == 1 ){
			if( o.index <= 2 ){
				o.beforeIndex = 0;
				areaIndex = 0;
				o.myblur();
				o.index = 0;
				menuArea.myfocus();
			}else{
				var val= o.index; 
				switch(val){
			
					case 3: 
						o.myblur();
						o.beforeIndex = 3 ;
						o.index = 0;
						o.imgBorderUp();
						break;
					case 4: 
						o.myblur();
						o.beforeIndex = 4 ;
						o.index = 0;
						o.imgBorderUp();
						break;
					case 5: 
						o.myblur();
						o.beforeIndex = 5;
						o.index = 1;
						o.imgBorderUp();
						break;	
				 }
			}
		}
	}
	o.selectfocus = function(){
		var val= o.index; 
		addCookie("menu_index", menuArea.index);
		var classId = parseInt(getCookie("class_Index"),10);
		switch(val){
			case 0: 
				if( classId != 1 ){
					addCookie("Channel_Index", 0);
				}
				addCookie("class_Index", 1);
				window.location = "../channel/channelplay.html";
				break;
			case 1: 
				if( classId != 5 ){
					addCookie("Channel_Index", 0);
				}
				addCookie("class_Index", 5);
				window.location = "../channel/channelplay.html";
				break;
			case 2: 
				if( classId != 6 ){
					addCookie("Channel_Index", 0);
				}
				addCookie("class_Index", 6);
				window.location = "../channel/channelplay.html";
				break;	
			case 3: 
				if( classId != 2 ){
					addCookie("Channel_Index", 0);
				}
				addCookie("class_Index", 2);
				window.location = "../channel/channelplay.html";
			  break;
			case 4: 
				if( classId != 10 ){
					addCookie("Channel_Index", 0);
				}
				addCookie("class_Index", 10);
			    window.location = "../channel/channelplay.html";
			  break;
			case 5: 
				if( classId != 4 ){
					addCookie("Channel_Index", 0);
				}
				addCookie("class_Index", 4);
			    window.location = "../channel/channelplay.html";
			  break;
		 }
	}
	return o;
}();
/*---------点播---------*/
var vodImgArea = function VodImgArea(){
	var o = {};
	
	o.index = 0;
	o.beforeIndex = 0;
	o.left = function (){
		o.myblur();
		if( ( o.index == 1 ) || (  o.index == 4 ) ){
			o.beforeIndex = o.index;
			o.index =  0 ;	
			o.imgBorderLeft();
		}
		else if( (  o.index > 1 ) && (  o.index <= 3 ) ){
			o.beforeIndex = o.index ;
			o.index = o.index - 1 ;
			o.imgBorderLeft();
		}else if( (  o.index > 4 ) && (  o.index <= 6 ) ){
			o.beforeIndex = o.index ;
			o.index = o.index - 1 ;
			o.imgBorderLeft();
		}
		else if ( o.index == 0 ){
			menuArea.menuleft();
		}	
	}
	o.right = function (){
		o.myblur();
		if( o.index ==  0 ){

			if ( o.beforeIndex == 0 ){
				o.index = o.index + 1;
			}else {
				o.index = o.beforeIndex ;
			}
			o.beforeIndex  = 0 ;
			o.imgBorderRight();
		}
		else if( (  o.index >= 1 ) && (  o.index < 3 ) ){
			o.beforeIndex = o.index ;
			o.index = o.index + 1 ;
			o.imgBorderRight();
		}
		else if((  o.index >= 4 ) && (  o.index < 6 )){
			o.beforeIndex = o.index ;
			o.index = o.index + 1 ;
			o.imgBorderRight();
		}else if( ( o.index == 3 ) || ( o.index == 6 ) ){
			menuArea.menuright();
		}
	}
	o.imgBorderRight = function (){
        var targetTop = 0,targetLeft = 0; targetWidth = 0,targetHeight = 0;
		var topValue = commonFuns.getPixValue("vod_border","top");
		var leftValue = commonFuns.getPixValue("vod_border","left")
		var widthValue = commonFuns.getPixValue("vod_border","width");
		var heightValue = commonFuns.getPixValue("vod_border","height");
		
		var val= o.index; 
		switch(val){
			case 0: 
				break;
			case 1:
			   targetLeft = 379; //渐变
			   targetWidth = 264;//渐变
			   
			   targetHeight = 254;//渐变
			   targetTop = -20;   
			    $("vod_border").style.visibility = "visible"; 				  
				var timePiter =  setInterval( function(){
			
					if( ( leftValue >= targetLeft ) || ( widthValue <= targetWidth ) || ( heightValue <= targetHeight ) ){
 					   commonFuns.setPixValue ( "vod_border",targetTop,targetLeft,targetWidth,targetHeight,1);
					   o.myfocus();
					   clearInterval(timePiter);
					
					}else{
					   heightValue = heightValue - 20 ;
					   topValue = 0 ;
					   leftValue = leftValue + 20 ;
					   widthValue = widthValue - 5 ;
					   commonFuns.setPixValue ( "vod_border",topValue,leftValue,widthValue,heightValue,0 );
					}
					
			  },5);
				break;
			case 2:
			 	targetLeft = 601; //渐变
			    targetWidth = 323;//渐变
				targetHeight = 254;
				targetTop = -20;
			    $("vod_border").style.visibility = "visible"; 				  
				var timePiter =  setInterval( function(){
			
					if( ( leftValue >= targetLeft ) || ( widthValue >= targetWidth ) ){
					   commonFuns.setPixValue ( "vod_border",targetTop,targetLeft,targetWidth,targetHeight,1);
					   o.myfocus();
					   clearInterval(timePiter);
					
					}else{
					   leftValue = leftValue + 20 ;
					   widthValue = widthValue + 5 ;
					   heightValue = 210 ;
 					   topValue = 0 ;
					   commonFuns.setPixValue ( "vod_border",topValue,leftValue,widthValue,heightValue,0 );
					}
					
			  },2);
				break;
			case 3:
			   targetLeft = 882;   //渐变
			   targetWidth = 323; 
			   targetHeight = 254;
			   targetTop = -20; 
			    $("vod_border").style.visibility = "visible"; 				  
				var timePiter =  setInterval( function(){
			
					if(  leftValue >= targetLeft ) {
					   commonFuns.setPixValue ( "vod_border",targetTop,targetLeft,targetWidth,targetHeight,1);
					   o.myfocus();
					   clearInterval(timePiter);
					
					}else{
					   heightValue = 210 ;
					   topValue = 0 ;
					   leftValue = leftValue + 20 ;
					   widthValue = 279;
					   commonFuns.setPixValue ( "vod_border",topValue,leftValue,widthValue,heightValue,0 );
					}
					
			  },5);
				break;
			case 4:
			   targetLeft = 379; //渐变
			   targetWidth = 264;//渐变  
			   targetHeight = 254;//渐变
			   targetTop = 192;   
			    $("vod_border").style.visibility = "visible"; 				  
				var timePiter =  setInterval( function(){
			
					if( ( leftValue >= targetLeft ) || ( widthValue <= targetWidth ) || ( heightValue <= targetHeight ) ){
					    commonFuns.setPixValue ( "vod_border",targetTop,targetLeft,targetWidth,targetHeight,1);
					   o.myfocus();
					   clearInterval(timePiter);
					
					}else{
					   heightValue = heightValue - 20 ;
					   topValue = 212 ;
					   leftValue = leftValue + 20 ;
					   widthValue = widthValue - 5 ;
					  commonFuns.setPixValue ( "vod_border",topValue,leftValue,widthValue,heightValue,0 );
					}
					
			  },5);
				break;
				
			case 5:
			 	targetLeft = 601; //渐变
			    targetWidth = 323;//渐变
				targetHeight = 254;
				targetTop = 192;
			    $("vod_border").style.visibility = "visible"; 				  
				var timePiter =  setInterval( function(){
			
					if( ( leftValue >= targetLeft ) || ( widthValue >= targetWidth ) ){
					   commonFuns.setPixValue ( "vod_border",targetTop,targetLeft,targetWidth,targetHeight,1);
					   o.myfocus();
					   clearInterval(timePiter);
					
					}else{
					   leftValue = leftValue + 20 ;
					   widthValue = widthValue + 5 ;
					   heightValue = 210 ;
 					   topValue = 212 ;
					   commonFuns.setPixValue ( "vod_border",topValue,leftValue,widthValue,heightValue,0 );
					}
					
			  },2);
				break;
			case 6:
			   targetLeft = 882;   //渐变
			   targetWidth = 323; 
			   
			   targetHeight = 254;
			   targetTop = 192; 
			    $("vod_border").style.visibility = "visible"; 				  
				var timePiter =  setInterval( function(){
			
					if(  leftValue >= targetLeft ) {
					   commonFuns.setPixValue ( "vod_border",targetTop,targetLeft,targetWidth,targetHeight,1);
					   o.myfocus();
					   clearInterval(timePiter);
					}else{
					   heightValue = 210 ;
					   topValue = 212 ;
					   leftValue = leftValue + 20 ;
					   widthValue = 279;
					   commonFuns.setPixValue ( "vod_border",topValue,leftValue,widthValue,heightValue,0 );
					}
					
			  },5);
				break;
		}
	}
	o.imgBorderLeft = function (){
        var targetTop = 0,targetLeft = 0; targetWidth = 0,targetHeight = 0;
		var topValue = commonFuns.getPixValue("vod_border","top");
		var leftValue = commonFuns.getPixValue("vod_border","left")
		var widthValue = commonFuns.getPixValue("vod_border","width");
		var heightValue = commonFuns.getPixValue("vod_border","height");
		
		var val= o.index; 
		switch(val){
			case 0: 
			   targetLeft = 98; 
			   targetWidth = 323;
			   targetHeight = 466;
			   targetTop = -20;   //渐变
			    $("vod_border").style.visibility = "visible"; 				  
				var timePiter =  setInterval( function(){
			
					if( ( leftValue <= targetLeft ) || ( widthValue >= targetWidth ) || ( heightValue >= targetHeight ) ){
					   commonFuns.setPixValue ( "vod_border",targetTop,targetLeft,targetWidth,targetHeight,1);
					   o.myfocus();
					   clearInterval(timePiter);					
					}else{
					   leftValue = leftValue - 20 ;
					   widthValue = widthValue + 2 ;
					   heightValue = heightValue + 20 ;
					   if( o.beforeIndex  == 4 ){
						    topValue = topValue - 15 ;	
					   }
					   if( o.beforeIndex  == 1  ){
						    topValue = 0  ;
					   }
					   commonFuns.setPixValue ( "vod_border",topValue,leftValue,widthValue,heightValue,0 );
					}
					
			  },2);
			
				break;
			case 1:
			   targetLeft = 379; //渐变
			   targetWidth = 264;//渐变			   
			   targetHeight = 254;//渐变
			   targetTop = -20;   
			    $("vod_border").style.visibility = "visible"; 				  
				var timePiter =  setInterval( function(){
			
					if( ( leftValue <= targetLeft ) || ( widthValue <= targetWidth ) ){
					   commonFuns.setPixValue ( "vod_border",targetTop,targetLeft,targetWidth,targetHeight,1);
					   o.myfocus();
					   clearInterval(timePiter);
					
					}else{
					   leftValue = leftValue - 30 ;
					   widthValue = widthValue - 5 ;
					   heightValue = 210 ;
					   topValue = 0  ;
					   commonFuns.setPixValue ( "vod_border",topValue,leftValue,widthValue,heightValue,0 );
					}
					
			  },2);
				break;
			case 2:
			 	targetLeft = 601; //渐变
			    targetWidth = 323;
				targetHeight = 254;
				targetTop = -20;
				$("vod_border").style.visibility = "visible"; 				  
				var timePiter =  setInterval( function(){
			
					if( leftValue <= targetLeft  ){
					   commonFuns.setPixValue ( "vod_border",targetTop,targetLeft,targetWidth,targetHeight,1);
					   o.myfocus();
					   clearInterval(timePiter);
					
					}else{
					   leftValue = leftValue - 30 ;
					   widthValue = 279 ;
					   heightValue = 210 ;
					   topValue = 0 ;
					   commonFuns.setPixValue ( "vod_border",topValue,leftValue,widthValue,heightValue,0 );
					}
					
			  },2);

				break;
			case 3:
				break;
			case 4:
			   targetLeft = 379; //渐变
			   targetWidth = 264;//渐变 
			   targetHeight = 254;//渐变
			   targetTop = 192;   
			    $("vod_border").style.visibility = "visible"; 				  
				var timePiter =  setInterval( function(){
			
					if( ( leftValue <= targetLeft ) || ( widthValue <= targetWidth ) ){
					   commonFuns.setPixValue ( "vod_border",targetTop,targetLeft,targetWidth,targetHeight,1);
					   o.myfocus();
					   clearInterval(timePiter);
					
					}else{
					   leftValue = leftValue - 30 ;
					   widthValue = widthValue - 5 ;
					   heightValue = 210 ;
					   topValue = 212  ;
					   commonFuns.setPixValue ( "vod_border",topValue,leftValue,widthValue,heightValue,0 );	
					}
					
			  },2);
				break;
			case 5:
			 	targetLeft = 601; //渐变
			    targetWidth = 323;
				targetHeight = 254;
				targetTop = 192;
				$("vod_border").style.visibility = "visible"; 				  
				var timePiter =  setInterval( function(){
			
					if( leftValue <= targetLeft  ){
					   commonFuns.setPixValue ( "vod_border",targetTop,targetLeft,targetWidth,targetHeight,1);
					   o.myfocus();
					   clearInterval(timePiter);
					
					}else{
					   leftValue = leftValue - 30 ;
					   widthValue = 279 ;
					   heightValue = 210 ;
					   topValue = 212 ;
					   commonFuns.setPixValue ( "vod_border",topValue,leftValue,widthValue,heightValue,0 );	
					}
					
			  },2);

				break;
			case 6:
				break;
		}
	}
	o.imgBorderDown = function (){
        var targetTop = 0,targetLeft = 0; targetWidth = 0,targetHeight = 0;
		var topValue = commonFuns.getPixValue("vod_border","top");
		var leftValue = commonFuns.getPixValue("vod_border","left")
		var widthValue = commonFuns.getPixValue("vod_border","width");
		var heightValue = commonFuns.getPixValue("vod_border","height");
		var val= o.index; 
		switch(val){
			case 0: 
				break;
			case 1:
				break;
			case 2:
				break;
			case 4:
			   targetLeft = 379; //渐变
			   targetWidth = 264;//渐变
			   targetHeight = 254;//渐变
			   targetTop = 192;   
			    $("vod_border").style.visibility = "visible"; 				  
				var timePiter =  setInterval( function(){
			
					if(  topValue >= targetTop ){
					   commonFuns.setPixValue ( "vod_border",targetTop,targetLeft,targetWidth,targetHeight,1);
					   o.myfocus();
					   clearInterval(timePiter);
					
					}else{
					   topValue = topValue + 15 ;
					   widthValue = 220 ;
					   heightValue = 210  ;
					   leftValue = 399 ;
					   commonFuns.setPixValue ( "vod_border",topValue,leftValue,widthValue,heightValue,0 );	
					}
					
			  },2);
				break;
			case 5:
			 	targetLeft = 601; //渐变
			    targetWidth = 323;
				targetHeight = 254;
				targetTop = 192;
				$("vod_border").style.visibility = "visible"; 				  
				var timePiter =  setInterval( function(){
			
					if( leftValue >= targetLeft  ){
					   commonFuns.setPixValue ( "vod_border",targetTop,targetLeft,targetWidth,targetHeight,1);
					   o.myfocus();
					   clearInterval(timePiter);
					
					}else{
					   leftValue = 621;
					   widthValue = 279 ;
					   heightValue = 210 ;
					   topValue = topValue + 15 ;
					   commonFuns.setPixValue ( "vod_border",topValue,leftValue,widthValue,heightValue,0 );	
					}
					
			  },2);

				break;
			case 6:
			   targetLeft = 882;   //渐变
			   targetWidth = 323; 
			   
			   targetHeight = 254;
			   targetTop = 192; 
			    $("vod_border").style.visibility = "visible"; 				  
				var timePiter =  setInterval( function(){
			
					if(  leftValue >= targetLeft ) {
					   commonFuns.setPixValue ( "vod_border",targetTop,targetLeft,targetWidth,targetHeight,1);
					   o.myfocus();
					   clearInterval(timePiter);
					
					}else{
					   heightValue = 210 ;
					   topValue = topValue + 15 ;
					   leftValue = 902 ;
					   widthValue = 279;
					   commonFuns.setPixValue ( "vod_border",topValue,leftValue,widthValue,heightValue,0 );	
					}
					
			  },5);
				break;
		}
	}
	o.imgBorderUp = function (){
        var targetTop = 0,targetLeft = 0; targetWidth = 0,targetHeight = 0;
		var topValue = commonFuns.getPixValue("vod_border","top");
		var leftValue = commonFuns.getPixValue("vod_border","left")
		var widthValue = commonFuns.getPixValue("vod_border","width");
		var heightValue = commonFuns.getPixValue("vod_border","height");
		var val= o.index; 
		switch(val){
			case 0: 
				break;
			case 1:
			   targetLeft = 379; //渐变
			   targetWidth = 264;//渐变
			   
			   targetHeight = 254;//渐变
			   targetTop = -20;   
			    $("vod_border").style.visibility = "visible"; 				  
				var timePiter =  setInterval( function(){
			
					if(  topValue <= targetTop ){
					   commonFuns.setPixValue ( "vod_border",targetTop,targetLeft,targetWidth,targetHeight,1);
					   o.myfocus();
					   clearInterval(timePiter);
					
					}else{
					   topValue = topValue - 15 ;
					   widthValue = 220 ;
					   heightValue = 210  ;
					   leftValue = 399 ;
					   commonFuns.setPixValue ( "vod_border",topValue,leftValue,widthValue,heightValue,0 );	
					}
					
			  },2);
				break;
			case 2:
			 	targetLeft = 601; //渐变
			    targetWidth = 323;
				targetHeight = 254;
				targetTop = -20;
				$("vod_border").style.visibility = "visible"; 				  
				var timePiter =  setInterval( function(){
			
					if( leftValue <= targetLeft  ){
					   commonFuns.setPixValue ( "vod_border",targetTop,targetLeft,targetWidth,targetHeight,1);
					   o.myfocus();
					   clearInterval(timePiter);
					
					}else{
					   leftValue = 621;
					   widthValue = 279 ;
					   heightValue = 210 ;
					   topValue = topValue - 15 ;
					   commonFuns.setPixValue ( "vod_border",topValue,leftValue,widthValue,heightValue,0 );	
					}
					
			  },2);

				break;
			case 3:
			   targetLeft = 882;   //渐变
			   targetWidth = 323; 
			   
			   targetHeight = 254;
			   targetTop = -20; 
			    $("vod_border").style.visibility = "visible"; 				  
				var timePiter =  setInterval( function(){
			
					if(  leftValue <= targetLeft ) {
					   commonFuns.setPixValue ( "vod_border",targetTop,targetLeft,targetWidth,targetHeight,1);
					   o.myfocus();
					   clearInterval(timePiter);
					
					}else{
					   heightValue = 210 ;
					   topValue = topValue - 15 ;
					   leftValue = 902 ;
					   widthValue = 279;
					   commonFuns.setPixValue ( "vod_border",topValue,leftValue,widthValue,heightValue,0 );	
					}
					
			  },5);
				break;
			case 4:
				break;
			case 5:
				break;
			case 6:
				break;

		}
	}
	o.myfocus =function (){
		var val= o.index; 
		switch(val){
	
			case 0: 
			    commonFuns.setBoxFocusPixValue ( "vod_imgBox_1","vod_img_1",-120,-2,323,466,100,2,319,462,1 );
				$("vod_imgBox_1").style.background = "url(images/vod/img1_bg.png) no-repeat";			
				break;
			case 1: 
			    commonFuns.setBoxFocusPixValue ( "vod_imgBox_2","vod_img_2",-120,279,264,254,100,2,260,250,1 );
				$("vod_imgBox_2").style.background = "url(images/vod/img2_bg.png) no-repeat";
				break;
			case 2: 
			    commonFuns.setBoxFocusPixValue ( "vod_imgBox_3","vod_img_3",-120,501,323,254,100,2,319,250,1 );
				$("vod_imgBox_3").style.background = "url(images/vod/img3_bg.png) no-repeat";			
				break;
			case 3: 
			 	commonFuns.setBoxFocusPixValue ( "vod_imgBox_4","vod_img_4",-120,782,323,254,100,2,319,250,1 );
				$("vod_imgBox_4").style.background = "url(images/vod/img3_bg.png) no-repeat";
				break;
			case 4: 
			    commonFuns.setBoxFocusPixValue ( "vod_imgBox_5","vod_img_5",92,279,264,254,100,2,260,250,1 );
				$("vod_imgBox_5").style.background = "url(images/vod/img2_bg.png) no-repeat";
				break;
			case 5: 
			    commonFuns.setBoxFocusPixValue ( "vod_imgBox_6","vod_img_6",92,501,323,254,100,2,319,250,1 );
				$("vod_imgBox_6").style.background = "url(images/vod/img3_bg.png) no-repeat";
				break;
			case 6: 
			    commonFuns.setBoxFocusPixValue ( "vod_imgBox_7","vod_img_7",92,782,323,254,100,2,319,250,1 );
				$("vod_imgBox_7").style.background = "url(images/vod/img3_bg.png) no-repeat";
				break;
		 }
	}

	o.myblur = function (){
 		var val= o.index; 
		switch(val){
	
			case 0: 
			    commonFuns.setBoxFocusPixValue ( "vod_imgBox_1","vod_img_1",0,118,279,422,0,1,279,422,0);
				break;
			case 1:
			    commonFuns.setBoxFocusPixValue ( "vod_imgBox_2","vod_img_2",0,399,220,210,0,1,220,210,0);
				break;
			case 2: 
			    commonFuns.setBoxFocusPixValue ( "vod_imgBox_3","vod_img_3",0,621,279,210,0,1,279,210,0);
				break;
			case 3: 
			    commonFuns.setBoxFocusPixValue ( "vod_imgBox_4","vod_img_4",0,902,279,210,0,1,279,210,0);
				break;
			case 4: 
				commonFuns.setBoxFocusPixValue ( "vod_imgBox_5","vod_img_5",212,399,220,210,0,1,220,210,0);
				break;
			case 5: 
			    commonFuns.setBoxFocusPixValue ( "vod_imgBox_6","vod_img_6",212,621,279,210,0,1,279,210,0);
				break;
			case 6: 
			    commonFuns.setBoxFocusPixValue ( "vod_imgBox_7","vod_img_7",212,902,279,210,0,1,279,210,0);
				break;
			

		 }
	}
	
	o.down = function(){
		if( areaIndex == 2 ){
			if(  ( o.index < 4 ) && ( o.index > 0 ) ){
				o.myblur();
				if( o.index == 1 ){
					o.index = 4;
					o.beforeIndex = 1;
					
				}else if( o.index == 2 ){
					o.index = 5;
					o.beforeIndex = 2
				}
				else if( o.index == 3 ){
					o.index = 6;
					o.beforeIndex = 3;
				}
				o.imgBorderDown();
			}
		}

	}
	o.up = function(){
		if(areaIndex == 2 ){
			o.myblur();
			if( o.index == 4 ){
				o.index = 1;
				o.beforeIndex = 4;
				o.imgBorderUp();
			}else if( o.index == 5){
				o.index = 2;
				o.beforeIndex = 5;
				o.imgBorderUp();
			}
			else if( o.index ==6 ){
				o.index = 3;
				o.beforeIndex = 6;
				o.imgBorderUp();
			}
			else{
				o.index = 0;
				areaIndex = 0
				o.beforeIndex = 0;
				menuArea.myfocus();
			}
		}
	}
	o.selectfocus = function(){
		var val= o.index; 
		addCookie("menu_index", menuArea.index);
		switch(val){
			case 0: 
				window.location = "../vod/vod_index.html?id=7&name="+escape("游戏攻略");
				break;
			case 1: 
				window.location = "../vod/vod_index.html?id=1&name="+escape("电影");
				break;
			case 2: 
				window.location = "../vod/vod_index.html?id=3&name="+escape("综艺");
				break;	
			case 3: 
				window.location = "../vod/vod_index.html?id=5&name="+escape("体育");
			  break;
			case 4: 
			    window.location = "../vod/vod_index.html?id=2&name="+escape("连续剧");
			  break;
			case 5: 
			    window.location = "../vod/vod_index.html?id=4&name="+escape("动漫");
			  break;
			case 6: 
			    window.location = "../vod/vod_index.html?id=6&name="+escape("教育");
			  break;
		 }
	}
	return o;
}();

/*---------排行榜---------*/
var sortImgArea = function SortImgArea(){
	var o = {};
	
	o.index = 0;
	o.beforeIndex = 0;
	o.left = function (){
		o.myblur();
		if(  o.index == 1 ){
			o.beforeIndex = o.index;
			o.index =  o.index - 1 ;	
			o.imgBorderLeft();
		}
		else  if (o.index == 3 ) {
			o.beforeIndex = o.index;
		 	o.index =  1 ;
			o.imgBorderLeft();
		}else if ( o.index == 2 ){
			o.beforeIndex = o.index;
			o.index = 1 ;
			o.imgBorderLeft();
		}
		else if ( o.index == 0 ){
			menuArea.menuleft();
		}
	}
	o.right = function (){
		o.myblur();
		if( o.index ==  0 ){

			if ( o.beforeIndex == 0 ){
				o.index = o.index + 1;
			}else {
				o.index = o.beforeIndex ;
			}
				o.beforeIndex  = 0 ;
				o.imgBorderRight();
		}
		else if(  o.index == 1 ){
			
             if(  o.beforeIndex <= 1){
				 o.beforeIndex = o.index ;
				 o.index = o.index + 1;
			 }else{ 
				o.index = o.beforeIndex ;
				o.beforeIndex = 1 ;
			 }
			 o.imgBorderRight();
		}
		else if( ( o.index == 3 )||(o.index == 2)){
 			menuArea.menuright();
		}
		
	}
	o.imgBorderRight = function (){
        var targetTop = 0,targetLeft = 0; targetWidth = 0,targetHeight = 0;
		var topValue = commonFuns.getPixValue("sort_border","top");
		var leftValue = commonFuns.getPixValue("sort_border","left")
		var widthValue = commonFuns.getPixValue("sort_border","width");
		var heightValue = commonFuns.getPixValue("sort_border","height");
		var val= o.index; 
		switch(val){
			case 0: 
				break;
			case 1:
			   targetLeft = 379;  //渐变
			   targetWidth = 263;//渐变		   
			   targetHeight = 466;
			   targetTop = -20;  
			    $("sort_border").style.visibility = "visible"; 				  
				var timePiter =  setInterval( function(){
			
					if( ( leftValue >= targetLeft ) || ( widthValue <= targetWidth )  ){
					   commonFuns.setPixValue ( "sort_border",targetTop,targetLeft,targetWidth,targetHeight,1);
					   o.myfocus();
					   clearInterval(timePiter);
					
					}else{
					   heightValue = heightValue ;
					   topValue = 0 ;
					   leftValue = leftValue + 20 ;
					   widthValue = widthValue - 6 ;
					   commonFuns.setPixValue ( "sort_border",topValue,leftValue,widthValue,heightValue,0 );
					}
					
			  },5);
				break;
			case 2:
			 	targetLeft = 600;//渐变
			    targetWidth = 606;//渐变
				targetHeight = 254;//渐变
				targetTop = -20;
			    $("sort_border").style.visibility = "visible"; 				  
				var timePiter =  setInterval( function(){
			
					if( ( leftValue >= targetLeft ) || ( widthValue >= targetWidth ) ||(heightValue <= targetHeight) ){
					   commonFuns.setPixValue ( "sort_border",targetTop,targetLeft,targetWidth,targetHeight,1);
					   o.myfocus();
					   clearInterval(timePiter);
					
					}else{
					   leftValue = leftValue + 30 ;
					   widthValue = widthValue + 20 ;
					   heightValue = heightValue - 20 ;
					   topValue = 0  ;
					   commonFuns.setPixValue ( "sort_border",topValue,leftValue,widthValue,heightValue,0 );
					}
					
			  },2);
				break;
			case 3:
			   targetLeft = 600;  //渐变
			   targetWidth = 606; //渐变
			   
			   targetHeight = 254; //渐变
			   targetTop = 192;   //渐变
			    $("sort_border").style.visibility = "visible"; 				  
				var timePiter =  setInterval( function(){
			
					if( ( leftValue >= targetLeft ) || ( widthValue >= targetWidth ) || ( heightValue <= targetHeight ) ){
					   commonFuns.setPixValue ( "sort_border",targetTop,targetLeft,targetWidth,targetHeight,1);
					   o.myfocus();
					   clearInterval(timePiter);
					
					}else{
					   heightValue = heightValue - 20 ;
					   topValue = topValue + 15 ;
					   leftValue = leftValue + 30 ;
					   widthValue = widthValue + 20 ;
					   commonFuns.setPixValue ( "sort_border",topValue,leftValue,widthValue,heightValue,0 );
					}
					
			  },5);
				break;

		}
	}
	o.imgBorderLeft = function (){
        var targetTop = 0,targetLeft = 0; targetWidth = 0,targetHeight = 0;
		var topValue = commonFuns.getPixValue("sort_border","top");
		var leftValue = commonFuns.getPixValue("sort_border","left")
		var widthValue = commonFuns.getPixValue("sort_border","width");
		var heightValue = commonFuns.getPixValue("sort_border","height");
		var val= o.index; 
		switch(val){
	
			case 0: 
			   targetLeft = 98; //渐变
			   targetWidth = 323;//渐变
			   
			   targetHeight = 466;
			   targetTop = -20;   
			    $("sort_border").style.visibility = "visible"; 				  
				var timePiter =  setInterval( function(){
			
					if( ( leftValue <= targetLeft ) || ( widthValue >= targetWidth )  ){
					   commonFuns.setPixValue ( "sort_border",targetTop,targetLeft,targetWidth,targetHeight,1);
					   o.myfocus();
					   clearInterval(timePiter);
					
					}else{
					   leftValue = leftValue - 20 ;
					   widthValue = widthValue - 2 ;
					   heightValue = heightValue ;
					   topValue = 0 ;
					   commonFuns.setPixValue ( "sort_border",topValue,leftValue,widthValue,heightValue,0 );
					}
					
			  },2);
			
				break;
			case 1:
			   
			   targetLeft = 379; 
			   targetWidth = 263;
			   
			   targetHeight = 466;
			   targetTop = -20;   //渐变
			    $("sort_border").style.visibility = "visible"; 				  
				var timePiter =  setInterval( function(){
			
					if( ( leftValue <= targetLeft ) || ( widthValue <= targetWidth )|| ( heightValue >= targetHeight ) ){
					   commonFuns.setPixValue ( "sort_border",targetTop,targetLeft,targetWidth,targetHeight,1);
					   o.myfocus();
					   clearInterval(timePiter);
					
					}else{
					   leftValue = leftValue - 30 ;
					   widthValue = widthValue - 5 ;
					   heightValue = heightValue + 20 ;
					   if( o.beforeIndex == 3 ){
						    topValue = topValue - 15  ;
					   }else if (  o.beforeIndex == 2 ){
					   		topValue = 0  ;
					   }
					   commonFuns.setPixValue ( "sort_border",topValue,leftValue,widthValue,heightValue,0 );
					}
					
			  },2);
				break;
			case 2:

				break;
			case 3:

				break;

		}
	}
	o.imgBorderDown = function (){
        var targetTop = 0,targetLeft = 0; targetWidth = 0,targetHeight = 0;
		var topValue = commonFuns.getPixValue("sort_border","top");
		var leftValue = commonFuns.getPixValue("sort_border","left")
		var widthValue = commonFuns.getPixValue("sort_border","width");
		var heightValue = commonFuns.getPixValue("sort_border","height");
		var val= o.index; 
		switch(val){
			case 0: 
				break;
			case 1:
				break;
			case 2:
				break;
			case 3:
 			   targetLeft = 600; 
			   targetWidth = 606;
			   
			   targetHeight = 254;
			   targetTop = 192;   //渐变
			    $("sort_border").style.visibility = "visible"; 				  
				var timePiter =  setInterval( function(){
			
					if(  topValue >= targetTop ){
					    commonFuns.setPixValue ( "sort_border",targetTop,targetLeft,targetWidth,targetHeight,1);
					   o.myfocus();
					   clearInterval(timePiter);
					
					}else{
					   topValue = topValue + 15 ;
					   widthValue = 562 ;
					   heightValue = 210  ;
					   leftValue = 620 ;
					   commonFuns.setPixValue ( "sort_border",topValue,leftValue,widthValue,heightValue,0 );
					}
					
			  },2);
				break;
		}
	}
	o.imgBorderUp = function (){
        var targetTop = 0,targetLeft = 0; targetWidth = 0,targetHeight = 0;
		var topValue = commonFuns.getPixValue("sort_border","top");
		var leftValue = commonFuns.getPixValue("sort_border","left")
		var widthValue = commonFuns.getPixValue("sort_border","width");
		var heightValue = commonFuns.getPixValue("sort_border","height");
		var val= o.index; 
		switch(val){
	
			case 0: 
				break;
			case 1:
				break;
			case 2:
			 	targetLeft = 600; 
			    targetWidth = 606;
				targetHeight = 254;
				targetTop = -20;//渐变
 				$("sort_border").style.visibility = "visible"; 				  
				var timePiter =  setInterval( function(){
			
					if(  topValue <= targetTop ){
					   commonFuns.setPixValue ( "sort_border",targetTop,targetLeft,targetWidth,targetHeight,1);
					   o.myfocus();
					   clearInterval(timePiter);
					
					}else{
					   topValue = topValue - 15 ;
					   widthValue = 562 ;
					   heightValue = 210  ;
					   leftValue = 620 ;
					   commonFuns.setPixValue ( "sort_border",topValue,leftValue,widthValue,heightValue,0 );
					}
					
			  },2);
				break;
			case 3:
				break;

		}
	}
	o.myfocus =function (){
		var val= o.index; 
		switch(val){
	
			case 0: 
			    commonFuns.setBoxFocusPixValue ( "sort_imgBox_1","sort_img_1",-120,-2,323,466,100,2,318,462,1 );
				$("sort_imgBox_1").style.background = "url(images/sort/img1_bg.png) no-repeat";
				break;
			case 1:
			    commonFuns.setBoxFocusPixValue ( "sort_imgBox_2","sort_img_2",-120,279,263,466,100,2,259,462,1 ); 
				$("sort_imgBox_2").style.background = "url(images/sort/img2_bg.png) no-repeat";
				break;
			case 2: 
			    commonFuns.setBoxFocusPixValue ( "sort_imgBox_3","sort_img_3",-120,500,606,254,100,2,602,250,1 );
				$("sort_imgBox_3").style.background = "url(images/sort/img3_bg.png) no-repeat";
				break;
			case 3:  
			    commonFuns.setBoxFocusPixValue ( "sort_imgBox_4","sort_img_4",92,500,606,254,100,2,602,250,1 );
				$("sort_imgBox_4").style.background = "url(images/sort/img3_bg.png) no-repeat";
				break;
		 }
	}

	o.myblur = function (){
 		var val= o.index; 
		switch(val){
			case 0: 
			    commonFuns.setBoxFocusPixValue ( "sort_imgBox_1","sort_img_1",0,118,279,422,0,1,279,422,0);
				break;
			case 1: 
			    commonFuns.setBoxFocusPixValue ( "sort_imgBox_2","sort_img_2",0,399,219,422,0,1,219,422,0);
				break;
			case 2: 
			    commonFuns.setBoxFocusPixValue ( "sort_imgBox_3","sort_img_3",0,620,562,210,0,1,562,210,0);
				break;
			case 3: 
			    commonFuns.setBoxFocusPixValue ( "sort_imgBox_4","sort_img_4",212,620,562,210,0,1,562,210,0);
				break;
		 }
	}
	
	o.down = function(){
		if( areaIndex == 3 ){
			
			if( o.index == 2 ){
				o.myblur();
				o.index = 3;
				o.beforeIndex = 2;
				o.imgBorderDown();
			}
		}

	}
	o.up = function(){
		if(areaIndex == 3 ){
			if( o.index == 3 ){
				o.myblur();
				o.index = 2;
				o.beforeIndex = 3;
				o.imgBorderUp();
			}else{
				areaIndex = 0;
				o.beforeIndex  = 0;
				o.myblur();
				o.index = 0;
				menuArea.myfocus();
			}
		}
	}
	o.selectfocus = function(){
		var val= o.index; 
		addCookie("menu_index", menuArea.index);
		switch(val){
			case 0: 
				//window.location = "../vod/program_list.html?id=0&name="+escape("推荐收看");
				window.location = "../mod/mod_index.html";
				break;
			case 1: 
				//window.location = "../vod/program_list.html?id=0&name="+escape("最新发布");
				window.location = "../redline/channelplay.html";
				break;
			case 2: 
				window.location = "../vod/favorite.html";
				break;	
			case 3: 
				window.location = "../vod/history.html";
			  break;
		 }
	}
	return o;
}();
/*--------- 用户---------*/
var userImgArea = function UserImgArea(){
	var o = {};
	
	o.index = 0;
	o.beforeIndex = 0;
	o.left = function (){
		o.myblur();
		if(  o.index == 1 ){
			o.beforeIndex = o.index;
			o.index =  o.index - 1 ;
			o.imgBorderLeft();	
		}
		else  if (o.index == 2 ) {
			o.beforeIndex = o.index;
		 	o.index =  0 ;
			o.imgBorderLeft();
		}else if ( o.index == 0 ){
			menuArea.menuleft();
		}	
	}
	o.right = function (){
		o.myblur();
		if( o.index ==  0 ){

			if ( o.beforeIndex == 0 ){
				o.index = o.index + 1;
			}else {
				o.index = o.beforeIndex ;
			}
			o.beforeIndex  = 0 ;
			o.imgBorderRight();
		}
		else if(  o.index == 1 ){
			menuArea.menuright();
		}
		else if( o.index == 2 ){
			menuArea.menuright();
		}	
	}
	o.imgBorderRight = function (){
        var targetTop = 0,targetLeft = 0; targetWidth = 0,targetHeight = 0;
		var topValue = commonFuns.getPixValue("user_border","top");
		var leftValue = commonFuns.getPixValue("user_border","left")
		var widthValue = commonFuns.getPixValue("user_border","width");
		var heightValue = commonFuns.getPixValue("user_border","height");
		var val= o.index; 
		switch(val){
			case 0: 
				break;
			case 1:
			   targetLeft = 602;  //渐变
			   targetWidth = 606; //渐变
			   targetHeight = 254; //渐变
			   targetTop = -20;  
			    $("user_border").style.visibility = "visible"; 				  
				var timePiter =  setInterval( function(){
			
					if( ( leftValue >= targetLeft ) || ( widthValue >= targetWidth ) || ( heightValue <= targetHeight ) ){
					   commonFuns.setPixValue ( "user_border",targetTop,targetLeft,targetWidth,targetHeight,1);
					   o.myfocus();
					   clearInterval(timePiter);
					}else{
					   heightValue = heightValue - 20 ;
					   topValue = 0 ;
					   leftValue = leftValue + 20 ;
					   widthValue = widthValue + 20 ;
					   commonFuns.setPixValue ( "user_border",topValue,leftValue,widthValue,heightValue,0 );
					}
					
			  },5);
				break;
			case 2:
			 	targetLeft = 602; //渐变
			    targetWidth = 606;//渐变
				targetHeight = 254;//渐变
				targetTop = 192;//渐变
			    $("user_border").style.visibility = "visible"; 				  
				var timePiter =  setInterval( function(){
			
					if( ( leftValue >= targetLeft ) || ( widthValue >= targetWidth ) ||(heightValue >= targetHeight) ){
					   commonFuns.setPixValue ( "user_border",targetTop,targetLeft,targetWidth,targetHeight,1);
					   o.myfocus();
					   clearInterval(timePiter);
					}else{
					   heightValue = heightValue - 20 ;
					   topValue = topValue + 15  ;
					   leftValue = leftValue + 20 ;
					   widthValue = widthValue + 20 ;
					   commonFuns.setPixValue ( "user_border",topValue,leftValue,widthValue,heightValue,0 );
					}
					
			  },2);
				break;


		}
	}
	o.imgBorderLeft = function (){
        var targetTop = 0,targetLeft = 0; targetWidth = 0,targetHeight = 0;
		var topValue = commonFuns.getPixValue("user_border","top");
		var leftValue = commonFuns.getPixValue("user_border","left")
		var widthValue = commonFuns.getPixValue("user_border","width");
		var heightValue = commonFuns.getPixValue("user_border","height");
		var val= o.index; 
		switch(val){
			case 0: 
			   targetLeft = 98; 
			   targetWidth = 322;
			   targetHeight = 466;
			   targetTop = -20;   //渐变
			    $("user_border").style.visibility = "visible"; 				  
				var timePiter =  setInterval( function(){
			
					if( ( leftValue <= targetLeft ) || ( widthValue <= targetWidth ) || ( heightValue >= targetHeight ) ){
					   commonFuns.setPixValue ( "user_border",targetTop,targetLeft,targetWidth,targetHeight,1);
					   o.myfocus();
					   clearInterval(timePiter);
					}else{
					   leftValue = leftValue - 20 ;
					   widthValue = widthValue - 20 ;
					   heightValue = heightValue + 20 ;
					   
					   if( o.beforeIndex  == 2 ){
						    topValue = topValue - 15 ;
					   }
					   if( o.beforeIndex  == 1  ){
						    topValue = 0  ;	
					   }
					   commonFuns.setPixValue ( "user_border",topValue,leftValue,widthValue,heightValue,0 );
					}
					
			  },2);
			
				break;
			case 1:
				break;
			case 2:
				break
		}
	}
	o.imgBorderDown = function (){
        var targetTop = 0,targetLeft = 0; targetWidth = 0,targetHeight = 0;
		var topValue = commonFuns.getPixValue("user_border","top");
		var leftValue = commonFuns.getPixValue("user_border","left")
		var widthValue = commonFuns.getPixValue("user_border","width");
		var heightValue = commonFuns.getPixValue("user_border","height");	
		var val= o.index; 
		switch(val){
			case 0: 
				break;
			case 1:
				break;
			case 2:
				targetLeft = 602; 
			    targetWidth = 606;
				targetHeight = 254;
				targetTop = 192;//渐变
			    $("user_border").style.visibility = "visible"; 				  
				var timePiter =  setInterval( function(){
			
					if(  topValue >= targetTop ){
					   commonFuns.setPixValue ( "user_border",targetTop,targetLeft,targetWidth,targetHeight,1);
					   o.myfocus();
					   clearInterval(timePiter);
					
					}else{
					   topValue = topValue + 15 ;
					   widthValue = 562 ;
					   heightValue = 210  ;
					   leftValue = 622 ;
					   commonFuns.setPixValue ( "user_border",topValue,leftValue,widthValue,heightValue,0 );
					}
					
			  },2);
				break;
		}
	}
	o.imgBorderUp = function (){
        var targetTop = 0,targetLeft = 0; targetWidth = 0,targetHeight = 0;
		var topValue = commonFuns.getPixValue("user_border","top");
		var leftValue = commonFuns.getPixValue("user_border","left")
		var widthValue = commonFuns.getPixValue("user_border","width");
		var heightValue = commonFuns.getPixValue("user_border","height");
		var val= o.index; 
		switch(val){
			case 0: 
				break;
			case 1:
			    targetTop = -20;   
				targetLeft = 602; 
			    targetWidth = 606;
				targetHeight = 254;
			    $("user_border").style.visibility = "visible"; 				  
				var timePiter =  setInterval( function(){
			
					if(  topValue <= targetTop ){
					   commonFuns.setPixValue ( "user_border",targetTop,targetLeft,targetWidth,targetHeight,1);
					   o.myfocus();
					   clearInterval(timePiter);
					}else{
					   topValue = topValue - 15 ;
					   widthValue = 562 ;
					   heightValue = 210  ;
					   leftValue = 622 ;
					   commonFuns.setPixValue ( "user_border",topValue,leftValue,widthValue,heightValue,0 );
					}
					
			  },2);
				break;

			case 2:
				break;
			case 3:	  
				break;
		}
	}
	o.myfocus =function (){
		var val= o.index; 
		switch(val){
			case 0: 
				commonFuns.setBoxFocusPixValue ( "user_imgBox_1","user_img_1",-120,-2,546,466,100,2,542,462,1 );
				$("user_imgBox_1").style.background = "url(images/user/img1_bg.png) no-repeat";
				break;
			case 1: 
			    commonFuns.setBoxFocusPixValue ( "user_imgBox_2","user_img_2",-120,502,606,254,100,2,602,250,1 );
				$("user_imgBox_2").style.background = "url(images/user/img2_bg.png) no-repeat";
				break;
			case 2: 
			    commonFuns.setBoxFocusPixValue ( "user_imgBox_3","user_img_3",92,502,606,254,100,2,602,250,1 );
				$("user_imgBox_3").style.background = "url(images/user/img3_bg.png) no-repeat";	
				break;
		 }
	}

	o.myblur = function (){
 		var val= o.index; 
		switch(val){
			case 0: 
			    commonFuns.setBoxFocusPixValue ( "user_imgBox_1","user_img_1",0,118,502,422,0,1,502,422,0);
				break;
			case 1: 
			    commonFuns.setBoxFocusPixValue ( "user_imgBox_2","user_img_2",0,622,562,210,0,1,562,210,0);
				break;
			case 2:
			    commonFuns.setBoxFocusPixValue ( "user_imgBox_3","user_img_3",212,622,562,210,0,1,562,210,0); 
				break;
		 }
	}
	
	o.down = function(){
		if( areaIndex == 2 ){	
			if( o.index == 1 ){
				o.myblur();
				o.index = 2;
				o.beforeIndex = 1;
				o.imgBorderDown();
			}
		}

	}
	o.up = function(){
		if(areaIndex == 2 ){
			if( o.index == 2 ){
				o.myblur();
				o.index = 1;
				o.beforeIndex = 2;
				o.imgBorderUp();
				
			}else{
				areaIndex = 0;
				o.myblur();
				o.index = 0;
				menuArea.myfocus();
			}
		}
	}
	o.selectfocus = function(){
		var val= o.index; 
		addCookie("menu_index", menuArea.index);
		switch(val){
			case 0: 
				window.location = "../stbplay/subList.html";
				break;
			case 1: 
				window.location = "../mp3/index.html";
				break;
			case 2: 
				window.location = "../broadcast/broadcast.html";
				break;	
		 }
	}
	return o;
}();
/*---------系统设置---------*/
var sysImgArea = function SysImgArea(){
	var o = {};
	
	o.index = 0;
	o.beforeIndex = 0;
	o.left = function (){
		o.myblur();
		if(  o.index == 1 ){
			o.beforeIndex = o.index;
			o.index =  o.index - 1 ;
			o.imgBorderLeft();	
		}
		else  if (o.index == 3 ) {
			o.beforeIndex = o.index;
		 	o.index =  0 ;
			o.imgBorderLeft();
		}else if ( o.index == 2 ){
			o.index = o.beforeIndex ;
			o.imgBorderLeft();
		}else if ( o.index == 0 ){
			menuArea.menuleft();
		}
	}
	o.right = function (){
		if( o.index != 2 ){
			o.myblur();
			if( o.index ==  0 ){
	
				if ( o.beforeIndex == 0 ){
					o.index = o.index + 1;
				}else {
					o.index = o.beforeIndex ;
				}
				o.beforeIndex  = 0 ;
			}
			else if(  o.index == 1 ){
				o.beforeIndex = o.index ;
				o.index = o.index + 1 ;
			}
			else if( o.index == 3 ){
				o.beforeIndex = 3;
				o.index = 2;
			}
			o.imgBorderRight();
		}
	}
	o.imgBorderRight = function (){
        var targetTop = 0,targetLeft = 0; targetWidth = 0,targetHeight = 0;
		var topValue = commonFuns.getPixValue("sys_border","top");
		var leftValue = commonFuns.getPixValue("sys_border","left")
		var widthValue = commonFuns.getPixValue("sys_border","width");
		var heightValue = commonFuns.getPixValue("sys_border","height");
		var val= o.index; 
		switch(val){
			case 0: 
				break;
			case 1:
			   targetLeft = 378; 
			   targetWidth = 380;
			   targetHeight = 254;
			   targetTop = -20;   //渐变
			    $("sys_border").style.visibility = "visible"; 				  
				var timePiter =  setInterval( function(){
			
					if( ( leftValue >= targetLeft ) || ( widthValue >= targetWidth ) || ( heightValue <= targetHeight ) ){
					  commonFuns.setPixValue ( "sys_border",targetTop,targetLeft,targetWidth,targetHeight,1 );
					   o.myfocus();
					   clearInterval(timePiter);
					
					}else{
					   heightValue = heightValue - 5 ;
					   topValue = 0 ;
					   leftValue = leftValue + 30 ;
					   widthValue = widthValue + 5 ;
					    commonFuns.setPixValue ("sys_border",topValue,leftValue,widthValue,heightValue,0);	
					}
					
			  },5);
				break;
			case 2:
			 	targetLeft = 718; 
			    targetWidth = 469;
				targetHeight = 466;
				targetTop = -20;//渐变
			    $("sys_border").style.visibility = "visible"; 				  
				var timePiter =  setInterval( function(){
			
					if( ( leftValue >= targetLeft ) || ( widthValue >= targetWidth ) ||(heightValue >= targetHeight) ){
					   commonFuns.setPixValue ( "sys_border",targetTop,targetLeft,targetWidth,targetHeight,1 );
					   o.myfocus();
					   clearInterval(timePiter);
					
					}else{
					   leftValue = leftValue + 30 ;
					   widthValue = widthValue + 5 ;
					   heightValue = heightValue + 10 ;
					   if( o.beforeIndex  == 3 ){
						    topValue = topValue - 15 ;
					   }
					   if( o.beforeIndex  == 1  ){
						    topValue = 0  ;
					   }
					   commonFuns.setPixValue ("sys_border",topValue,leftValue,widthValue,heightValue,0);	
					}
					
			  },2);
				break;
			case 3:
			   targetLeft = 378; 
			   targetWidth = 380;
			   targetHeight = 254;
			   targetTop = 192;   //渐变
			    $("sys_border").style.visibility = "visible"; 				  
				var timePiter =  setInterval( function(){
			
					if( ( leftValue >= targetLeft ) || ( widthValue >= targetWidth ) || ( heightValue <= targetHeight ) ){
					  commonFuns.setPixValue ( "sys_border",targetTop,targetLeft,targetWidth,targetHeight,1 );
					   o.myfocus();
					   clearInterval(timePiter);
					
					}else{
					   heightValue = heightValue - 5 ;
					   topValue = topValue + 15 ;
					   leftValue = leftValue + 30 ;
					   widthValue = widthValue + 5 ;
					    commonFuns.setPixValue ("sys_border",topValue,leftValue,widthValue,heightValue,0);	
					}
					
			  },5);
				break;
		}
	}
	o.imgBorderLeft = function (){
        var targetTop = 0,targetLeft = 0; targetWidth = 0,targetHeight = 0;
		var topValue = commonFuns.getPixValue("sys_border","top");
		var leftValue = commonFuns.getPixValue("sys_border","left")
		var widthValue = commonFuns.getPixValue("sys_border","width");
		var heightValue = commonFuns.getPixValue("sys_border","height");
		var val= o.index; 
		switch(val){
			case 0: 
			   targetLeft = 98; 
			   targetWidth = 322;
			   
			   targetHeight = 466;
			   targetTop = -20;   //渐变
			    $("sys_border").style.visibility = "visible"; 				  
				var timePiter =  setInterval( function(){
			
					if( ( leftValue <= targetLeft ) || ( widthValue <= targetWidth ) || ( heightValue >= targetHeight ) ){
					    commonFuns.setPixValue ( "sys_border",targetTop,targetLeft,targetWidth,targetHeight,1 );
					   o.myfocus();
					   clearInterval(timePiter);
					
					}else{
					   leftValue = leftValue - 60 ;
					   widthValue = widthValue - 2 ;
					   heightValue = heightValue + 30 ;
					   topValue = 0 ;
					   commonFuns.setPixValue ("sys_border",topValue,leftValue,widthValue,heightValue,0);	
					}
					
			  },2);
			
				break;
			case 1:
			   targetLeft = 378; 
			   targetWidth = 380;
			   targetHeight = 254;
			   targetTop = -20;   //渐变
			    $("sys_border").style.visibility = "visible"; 				  
				var timePiter =  setInterval( function(){
			
					if( ( leftValue <= targetLeft ) || ( widthValue <= targetWidth )|| ( heightValue <= targetHeight ) ){
					    commonFuns.setPixValue ( "sys_border",targetTop,targetLeft,targetWidth,targetHeight,1 );
					   o.myfocus();
					   clearInterval(timePiter);
					
					}else{
					   leftValue = leftValue - 30 ;
					   widthValue = widthValue - 5 ;
					   heightValue = heightValue - 20 ;
					   topValue = 0  ;
					    commonFuns.setPixValue ("sys_border",topValue,leftValue,widthValue,heightValue,0);	
					}
					
			  },2);
				break;
			case 2:
				break;
			case 3:
			   targetLeft = 378; 
			   targetWidth = 380;
			   targetHeight = 254;
			   targetTop = 192;   //渐变
			    $("sys_border").style.visibility = "visible"; 				  
				var timePiter =  setInterval( function(){
			
					if( ( leftValue <= targetLeft ) || ( widthValue <= targetWidth )|| ( heightValue <= targetHeight ) ){
					     commonFuns.setPixValue ( "sys_border",targetTop,targetLeft,targetWidth,targetHeight,1 );
					   o.myfocus();
					   clearInterval(timePiter);
					
					}else{
					   leftValue = leftValue - 30 ;
					   widthValue = widthValue - 5 ;
					   heightValue = heightValue - 20 ;
					   topValue = topValue + 20  ;
					   commonFuns.setPixValue ("sys_border",topValue,leftValue,widthValue,heightValue,0);	
					}
					
			  },2);
				break;
		}
	}
	o.imgBorderDown = function (){
        var targetTop = 0,targetLeft = 0; targetWidth = 0,targetHeight = 0;
		var topValue = commonFuns.getPixValue("sys_border","top");
		var leftValue = commonFuns.getPixValue("sys_border","left")
		var widthValue = commonFuns.getPixValue("sys_border","width");
		var heightValue = commonFuns.getPixValue("sys_border","height");
		var val= o.index; 
		switch(val){
			case 0: 
				break;
			case 1:
				break;
			case 2:
				break;
			case 3:
				targetTop = 192; 
				targetWidth = 380;//渐变
				targetLeft = 398; //渐变		
				targetHeight = 254;//渐变
			    $("sys_border").style.visibility = "visible"; 				  
				var timePiter =  setInterval( function(){
			
					if(  topValue >= targetTop ){
					     commonFuns.setPixValue ( "sys_border",targetTop,targetLeft,targetWidth,targetHeight,1 );
					   o.myfocus();
					   clearInterval(timePiter);
					
					}else{
					   topValue = topValue + 20 ;
					   widthValue = 340 ;
					   heightValue = 214  ;
					   leftValue = 398 ;
					   commonFuns.setPixValue ("sys_border",topValue,leftValue,widthValue,heightValue,0);	
					}
					
			  },2);
				break;
		}
	}
	o.imgBorderUp = function (){
        var targetTop = 0,targetLeft = 0; targetWidth = 0,targetHeight = 0;
		var topValue = commonFuns.getPixValue("sys_border","top");
		var leftValue = commonFuns.getPixValue("sys_border","left")
		var widthValue = commonFuns.getPixValue("sys_border","width");
		var heightValue = commonFuns.getPixValue("sys_border","height");
		
		var val= o.index; 
		switch(val){
	
			case 0: 
				break;
			case 1:
			   targetLeft = 398; //渐变
			   targetWidth = 380;//渐变
			   
			   targetHeight = 254;//渐变
			   targetTop = -20;   
			    $("sys_border").style.visibility = "visible"; 				  
				var timePiter =  setInterval( function(){
			
					if( topValue <= targetTop ) {
					   commonFuns.setPixValue ( "sys_border",targetTop,targetLeft,targetWidth,targetHeight,1 );
					   o.myfocus();
					   clearInterval(timePiter);
					
					}else{
					   topValue = topValue - 30 ;
					   widthValue = 340 ;
					   heightValue = 214 ;
					   leftValue = 398 ;
					   commonFuns.setPixValue ("sys_border",topValue,leftValue,widthValue,heightValue,0);	
					}
					
			  },2);
				break;
			case 2:

				break;
			case 3:
			  
				break;
		}
	}
	o.myfocus =function (){
		var val= o.index; 
		switch(val){
			case 0: 
				commonFuns.setBoxFocusPixValue ( "sys_imgBox_1","sys_img_1",-120,-2,322,466,100,2,318,462,1 );
				$("sys_imgBox_1").style.background = "url(images/sys/img1_bg.png) no-repeat";
				break;
			case 1: 
				commonFuns.setBoxFocusPixValue ( "sys_imgBox_2","sys_img_2",-120,278,380,254,100,2,376,250,1 );
				$("sys_imgBox_2").style.background = "url(images/sys/img2_bg.png) no-repeat";
				break;
			case 2: 
				commonFuns.setBoxFocusPixValue ( "sys_imgBox_3","sys_img_3",-120,618,469,466,100,2,465,462,1 );
				$("sys_imgBox_3").style.background = "url(images/sys/img3_bg.png) no-repeat";
				break;
			case 3: 
				commonFuns.setBoxFocusPixValue ( "sys_imgBox_4","sys_img_4",92,278,380,254,100,2,376,250,1 );
				$("sys_imgBox_4").style.background = "url(images/sys/img2_bg.png) no-repeat";
				break;
		 }
	}

	o.myblur = function (){
 		var val= o.index; 
		switch(val){
	
			case 0:
				commonFuns.setBoxFocusPixValue ( "sys_imgBox_1","sys_img_1",0,118,278,422,0,1,278,422,0 ); 
				break;
			case 1: 
				commonFuns.setBoxFocusPixValue ( "sys_imgBox_2","sys_img_2",0,398,336,210,0,1,336,210,0 ); 
				break;
			case 2: 
				commonFuns.setBoxFocusPixValue ( "sys_imgBox_3","sys_img_3",0,738,425,422,0,1,425,422,0 ); 
				break;
			case 3: 
				commonFuns.setBoxFocusPixValue ( "sys_imgBox_4","sys_img_4",212,398,336,210,0,1,336,210,0 ); 
				break;
		 }
	}
	
	o.down = function(){
		if( areaIndex == 3 ){
			
			if( o.index == 1 ){
				o.myblur();
				o.index = 3;
				o.imgBorderDown();
			}
		}
	}
	o.up = function(){
		if( areaIndex == 3 ){
			if( o.index == 3 ){
				o.myblur();
				o.index = 1;
				o.imgBorderUp();	
			}else{
				areaIndex = 0;
				o.myblur();
				o.index = 0;
				menuArea.myfocus();
			}
		}
	}
	o.selectfocus = function(){
		var val= o.index; 
		addCookie("menu_index", menuArea.index);
		switch(val){
			case 0: 
				window.location = "../sys/system.html";
				break;
			case 1: 
				window.location = "../sys/system.html";
				break;
			case 2: 
				window.location = "../sys/system.html";
			case 3: 
				window.location = "../sys/system.html";
				break;	
		 }
	}
	return o;
}();
function checkChannels(){
	try{
		var channel_Request =  getCookie("Channel_Request");
		if( ( channel_Request == "") ||( channel_Request == "undefined" ) ){
			getChData(false);
		}
	}catch(e){
		
	}
}
//检测Ajax 返回的值是否完整
function checkAjaxStr(str){	
	try{
		var obj = strToJson(str);
		var chechArray = obj.FolderContents;
		if(chechArray.length != 0 ){//判断变量具体的值
			return true
		}
			return false;

	}catch(e){
		return false;
		//alert(e)
	}
}
function getChData (retried){
	try{
		var url=MY_PORTAL_ADDR+"/GetChannelAll";
		Ajax.request(url,{
		success:function(data){
			if( ( data != "")||(data != "undefined" )){
				if( checkAjaxStr(data) ){
					var ovtset = new QjyScript();
					ovtset.exec("OvtSetInfor2File","channelAll",data);
					addCookie("Channel_Request", true);
				}
			}
		},
		failure:function(data){
			if( retried ) {
			}else{
				setTimeout(function(){ getChData(true ) }, 300);
			}
		},type:"text"
	  });	
	}catch(e){
		GF_WebPrint("获取频道列表结果:"+e);
	}
}
window.onunload = time.unload;
document.onkeypress = grabEvent;
function grabEvent(event){
		var val = event.which | event.keyCode;

		var NUM = 0;
		if((val <= 57)&&(val >= 48)){
		  NUM = val;
		}
		switch(val){
	
			case ROC_IRKEY_UP: //up 
				if( areaIndex == 1 ){
					imgArea.up();
				}/*else if ( areaIndex == 2 ){
					vodImgArea.up();
				}else if ( areaIndex == 3 ){
					sortImgArea.up();
				}*/
				else if ( areaIndex == 2 ){
					userImgArea.up();
				}else if ( areaIndex == 3 ){
					sysImgArea.up();
				}
				break;
			case ROC_IRKEY_DOWN: //down			
				if( areaIndex == 0 ){	
					menuArea.down();
				}else if (areaIndex == 1 ){
					imgArea.down();
				}/*else if ( areaIndex == 2 ){
					vodImgArea.down();
				}else if ( areaIndex == 3 ){
					sortImgArea.down();
				}*/
				else if ( areaIndex == 2 ){
					userImgArea.down();
				}else if ( areaIndex == 3 ){
					sysImgArea.down();
				}
				break;
			case ROC_IRKEY_LEFT: //left
			  if( areaIndex == 1 ){
					imgArea.left();
				}else if ( areaIndex == 0 ){
					menuArea.left();
				}/*else if ( areaIndex == 2 ){
					vodImgArea.left();
				}else if ( areaIndex == 3 ){
					sortImgArea.left();
				}*/
				else if ( areaIndex == 2 ){
					userImgArea.left();
				}else if ( areaIndex == 3 ){
					sysImgArea.left();
				}
				break;
			case ROC_IRKEY_RIGHT: //right
				if( areaIndex == 1 ){
					imgArea.right();
				}else if ( areaIndex == 0 ){
					menuArea.right();
				}/*else if ( areaIndex == 2 ){
					vodImgArea.right();
				}else if ( areaIndex == 3 ){
					sortImgArea.right();
				}*/
				else if ( areaIndex == 2 ){
					userImgArea.right();
				}else if ( areaIndex == 3 ){
					sysImgArea.right();
				}
				break;

			case ROC_IRKEY_SELECT:
				if( areaIndex == 1 ){
					imgArea.selectfocus();
				}/*else if ( areaIndex == 2 ){
					vodImgArea.selectfocus();
				}else if ( areaIndex == 3 ){
					sortImgArea.selectfocus();
				}*/
				else if ( areaIndex == 2 ){
					userImgArea.selectfocus();
				}else if ( areaIndex == 3 ){
					sysImgArea.selectfocus();
				}
				break;
			case ROC_IRKEY_LOCATION:
				window.location ="http://gdiptv.alexzhu.net/apps/index/";
				break;
			case ROC_IRKEY_BACK:
			case ROC_IRKEY_EXIT:

			  break;
		 }
}
try{
	var mExtend = new QjyScript();//正式用得代码
}catch(e){
	
}
function message(){
	try{
		//time.init();
		menuArea.initFocus();
		$("sys_value1").innerHTML = mExtend.exec("OvtGetConfig","software_ver");
		$("sys_value2").innerHTML = mExtend.exec("OvtGetConfig","ip_addr");
		$("sys_value3").innerHTML =mExtend.exec("OvtGetConfig","mac_addr");
		checkChannels();
	}catch(e){
	}
}