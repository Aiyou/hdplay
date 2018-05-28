/*验证信息*/
String.prototype.trim = function (){
	return $.trim( this ) ;
}
String.prototype.toJson = function (){
	return $.parseJSON( this ) ;
}
String.prototype.isNum = function (){
	return $.isNumeric( this ) ;
}
String.prototype.isEmpty = function (){
	return $.isEmptyObject( this ) ;
}
//正则检测 
String.prototype.re = function ( reStr ){
	var res = new RegExp ( reStr ) ;	
	if( ! res.test( this ) ){
		return false ;
	}
	return true ;				
}
//是否是日期格式
String.prototype.isDate = function (){
	var res = new RegExp ( "\\d{4}-\\d{1,2}-\\d{1,2}");
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
