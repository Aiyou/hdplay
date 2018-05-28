/*验证信息*/
String.prototype.trim = function (){
	return $.trim( this ) ;
}
String.prototype.json = function (){
	return $.parseJSON( this ) ;
}
String.prototype.isNum = function (){
	return $.isNumeric( this ) ;
}
String.prototype.isEmpty = function (){
	return $.isEmptyObject( this ) ;
}
String.prototype.isLen = function ( s , e ){
	if( this.length < s ){
		return false ;
	}
	if( e ){
		if( e > 0 && this.length > e){
			return false ;
		}
	}
	return true ;				
}
String.prototype.rExp = function ( re ){
	var res = new RegExp ( re ) ;	
	if( ! res.test( this ) ){
		return false ;
	}
	return true ;				
}

/*
url:必须参数 ajax URL 
success:可选参数 返回值 function(返回类型html,xml,json,text){} 
dataJson:可选参数 post提交json格式数据 
async:可选参数 设置同步异步 

demo
curl( "index.php" , function (html){
	alert(html)
});
curl( "index.php" , function (json){
	alert(json.msg)
});
*/

function curl( url , success ,  dataJson , async ){
		var dtype = function ( str ){
				return /function\s*\(\s*(\w+)[\s\,\w]*\)/igm.exec(str)[1] || 'html' ;
		}
		var ajax = {
			'type' : 'get' ,
			'url': url ,
			'cache' : "false" ,
			'error' : function ( XMLHttpRequest, textStatus, errorThrown ) {
				alert( url + '-' + XMLHttpRequest.status + '-' + XMLHttpRequest.readyState + '-' + textStatus );
			}
		} ;	
		ajax['dataType'] = dtype('' + success) ;
		if( async ){
			ajax['async'] = true 
		}else{
			ajax['async'] = false ; 
		}
		if( success ){
			ajax['success'] = success ;
		}
		if( dataJson ){
			ajax['type'] =	'post' ;
			ajax['data'] = dataJson ;
		}
		$.ajax( ajax );
}


/*
信息返回提示框，
参数1:提示内容 , 参数2【可选】 : 提示框标题 , 参数3【可选】 : 是否要遮罩
artDialog( '出错了' , '提示' , true );
*/
var artDialog = function ( msg , tmsg , islock ){
	var dialog = {
		width : '200' ,
		height: '105' ,
		theight:'32',
		tbgpic : "data:image/gif;base64,R0lGODlhAgAgAKIAAAAAAP////Pz8+Xl5f///wAAAAAAAAAAACH5BAEAAAQALAAAAAACACAAAAMJKLrc/jDKN0YCADs=",
		closepic : "data:image/gif;base64,R0lGODlhCQAJAJEAAAAAAP///3mFlv///yH5BAEAAAMALAAAAAAJAAkAAAITnIZ4wsnbnnsnmWZpvbDPZRlDAQA7",
		lockcolor : '#fff'
	}
	var shadow = null ;
	if (islock)
	{
		//shadow = $("<div/>").css({'position':'absolute','left':'0','top':'0','width':'100%', 'height':'100%','filter':'alpha(opacity=80)','background-color':dialog.lockcolor}).appendTo('body');
	   shadow = $('<div></div>').css('position', 'fixed').css('width', '100%').css('height', '100%').
	   css('background', '#000').css('z-index', 998).css('top', '0').
	   css('left', '0').css('opacity', 0.7).appendTo("body");
	}
	var box = $("<div/>").css({'position':'fixed', 'width': dialog.width+'px','height': dialog.height + 'px','border':'1px solid #cccccc', 'top': '50%','left':'50%','margin-top':'-'+(dialog.width/2)+'px','margin-left':'-'+(dialog.width/2)+'px','z-index':999});
	var tbox = $("<div/>").css({'height':dialog.theight+'px' , 'background': 'url('+dialog.tbgpic+')'});
	var title = $("<div/>").css({ 'float':'left','color':'#636363','font-weight':'bold','line-height':dialog.theight+'px','width':'90%','font-size':'12px','text-align':'left'});
	var close = $("<div/>").css({'float':'left','line-height':dialog.theight+'px','width':'10%'});
	var content = $("<div/>").css({ 'line-height':(dialog.height-dialog.theight)+'px','background-color':'#fff','font-size':'12px', 'color':'#f50042', 'text-align':'center'});
	tmsg = tmsg || '消息提示' ;
	title.html('&nbsp;&nbsp;' + tmsg );
	close.html('<img id="btn_close" src="'+dialog.closepic+'" width="9" height="9">&nbsp;');
	content.html(msg);
	tbox.append(title).append(close);
	box.append(tbox).append(content)
	box.appendTo('body').css('box-shadow', '0 1px 5px rgba(35,25,25,0.5)');
	$('#btn_close').css('cursor','pointer').click(function (){
		box.empty().remove();
		shadow && shadow.empty().remove();
	});
}

/*
弹出提示框带上箭头
content 必选: 提示框显示的内容 
width 必选: 弹出框的宽
left 可选: 控制向上箭头 距离left 多少像素 ，默认20;

demo :
listtip( '1111' , 300 , 50 ) ; 
*/
var listtips = function( content , width , left ) {
	var pic = "data:image/gif;base64,R0lGODlhRgAJAPcAAP38/P///v/+/f79/JPB4P79/f78/NPT0//9/P39/fz8/P7+/f+pCP39/Pv7+//+/P7+/v///evr6//+/vr6+vj4+P/9/f/8/JTB4Pf39/n5+fb29v7//zNmzP798mVlZfvvrDaOw/vxuP/99/331P799Pz0yfz10PzywP332LW1tfvup/31zPrto/rrlvvyvP/++f7oe/z0xf/jYt+1J/vwtMzMzP343/vwr/343ObESdbu+tvb2//zq//OCv/4v//ulOz0+MvUvWaZAP/dSf765f/+/+Tk5PH2/f/80PDXbd++V6p3APb6+/zzxf342/vwsCJmmQFPi/753nmxC0pKSv7//ez4/1KV+P7+/GG98ZmZmYLH8PzxtIjymcqoS3mXUOu5BcGOAWGv3v7769yqBP/WM/frqfL5/vz////9/3TijMPm+YuqXlis0khlGpitPOf266rd9mbbg3akGqzuuq3GeHLIDJtnBfzzwoKoWYLolkGk22m756WlpU+XzlWv4zCa1fHx8ZfrqfTkmOrAJfDCFtj03/7+/+/KOP/THvzyvMPszcmWAFdyLP//3bntxcqoUEipZSp4rvPgi2qNO/TNmOq9FobPmo6LilHbaT+eXFW/csrz01G5bZ+eoI2zQeDRtG7S80a2YoGmV7Xs/CrlQpDXEJuve+/vx4fDK+7u7n3GkpjU8lvKeNPu2/n9/jviVIOwkajjFTHXTF/Ve628scn4auT0/KfXDjxYDazauTPnSv/+95ncq3iqx/r9+xRhnEXlW+ckILnLn/z//WJ4PcHyK27MgdXV1cNSGd3avvzxucZzAlumc/743Nrw+/T09EWeYfdXNcjCdzmg2EroYGfmemHCeN7q4mKZdf///////93d3d7e3t/f3+Dg4OHh4eLi4uPj4+Tk5OXl5ebm5ufn5+jo6Onp6erq6uvr6+zs7O3t7e7u7u/v7/Dw8PHx8fLy8vPz8/T09PX19fb29vf39/j4+Pn5+fr6+vv7+/z8/P39/f7+/v///yH5BAEAANwALAAAAABGAAkAAAikAFWo4EaQoMCCCLl9+JBwYcKHEAvyiPhwi5+HAgcaPAhxIUOCHimK5MZj28SRfrZt24LxYEaRIUOOjFhS5cmIW1SqvJgwI0eYHj/OfFizgs2IKXWqZNnz50iZQxMWrWDUZEWlSnlufPk0aFSEU6lWvcktKVadTF9yjRjT4VduKsXKVVkw51msftaubehWYd+h2+QK3lbw7l2n3BAX/Ov3reORAQEAOw==";
	var box = $("<div/>").css({'position':'absolute','z-Index':'1002'}).appendTo('body');
	var htm = '<div style="padding:10px;border:1px solid #a0a0a0;position:relative;background:#fff" class="__box"><span style="position:absolute;background:url('+pic+') 14px 0px;width:14px;height:8px;top:-8px;" class="__tips"></span><a style="background:url('+pic+') 0px 0px;height:9px;width:9px;position:absolute;top:5px;right:5px;" class="__close" href="#@"></a>';
    htm += '<div style="color:#000;line-height:19px;" id="_menu">';
	htm += '	<div style="position:relative;overflow:hidden;clear:both;">'; 
	htm += '		<div class="__content" style="margin-top:10px;"><img src="/images/face/loading.gif" id="loading"  style="padding-top:15px"/></div>';
	htm += '	</div>';
    htm += '</div></div>';
	box.append(htm);
	left = left || 20 ;
	$('.__content' , box ).html( content );
	$('.__box' , box ).css({ 'width' : width + 'px'});
	$('.__tips' , box ).css( { 'left' : (left-5) + 'px'} ) ;
	$('.__close' , box ).hover(function (){
		$(this).css({ 'background-position' : '-17px 0px'});
	},function (){
		$(this).css({ 'background-position' : '0px 0px'});
	}).click(function(){
		box.empty().remove();
	})
};


function search_analysis()
{
	var keystr = $("#txtkey").val().trim();
	if(keystr=='' || keystr=='关键字')
	{
		window.alert('请输入搜索关键字');
		$("#txtkey").focus();
		return false;
	}
	else
	{
		var newkeystr = encodeURI(keystr);
		window.location.href='/index/search/' + newkeystr + '.html';
	}
}