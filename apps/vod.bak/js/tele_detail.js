// JavaScript Document
MY_PORTAL_ADDR = '';
//var g_cacheid={};//变量缓存
nopic = "images/nopic.jpg";  //缺省图片

function $(id){
	return document.getElementById(id);
}
//获取URL"?"后面的字符串 &&  //类型简单判断
var $G = {
	"getParameter" : function(param){
		var query = window.location.search; //获取URL"?"后面的字符串
		if(query.length	== 0){
			return "";
		}else{
			var iLen = param.length;
			var iStart = query.indexOf(param);
			
			if (iStart == -1) //判断是否有那个需要查询值的传递参数
				return ""; //没有就返回一个空值
			iStart += iLen + 1;
			
			var iEnd = query.indexOf("&", iStart); //判断是不是带有多个参数   &为多个参数的连接符号
			if (iEnd == -1) {
				return query.substring(iStart);
			}
			return query.substring(iStart, iEnd);
		}
	}	
}

function getStrChineseLen(str,len){
	var w = 0;
	for (var i = 0; i < str.length; i++) {
		var c = str.charCodeAt(i);
		 //单字节加1
		 if ((c >= 0x0001 && c <= 0x007e) || (0xff60<=c && c<=0xff9f)) {
			 w++;
		 }else{
		   w+=2;
		 }
		 if(parseInt((w+1)/2)>len){
			return str.substring(0,i-1)+"...";
			break;
		　} 
	} 	
	return str;
}

//将字符串转成json
function strToJson(str){
	var json = eval('(' + str + ')');  
	return json;  
}

var Ajax =
function(){
	function request(url,opt){
		function fn(){}
		opt = opt || {};
		var async   = opt.async !== false,
			method  = opt.method 	|| 'GET',
			type    = opt.type 		|| 'json',
			encode  = opt.encode 	|| 'UTF-8',
			timeout = opt.timeout 	|| 10000,
			data    = opt.data 		|| null,
			success = opt.success 	|| fn,
			failure = opt.failure 	|| fn;
			method  = method.toUpperCase();
		if(data && typeof data == 'object'){//对象转换成字符串键值对
			data = _serialize(data);
		}
		if(method == 'GET' && data){
            url += (url.indexOf('?') == -1 ? '?' : '&') + data;
			data = null;
        }	
		var xhr = function(){
			try{
				return new XMLHttpRequest();
			}catch(e){
				try{
					return new ActiveXObject('Msxml2.XMLHTTP');
				}catch(e){
					try{
						return new ActiveXObject('Microsoft.XMLHTTP');
					}catch(e){
						failure(null,'create xhr failed',e);
					}
				}
			}
		}();
		if(!xhr){return;}
		var isTimeout = false, timer;
		if(async && timeout>0){
			timer = setTimeout(function(){
				xhr.abort();
				isTimeout = true;
			},timeout);
		}
		xhr.onreadystatechange = function(){
			if (xhr.readyState == 4 && !isTimeout){
				_onStateChange(xhr, type, success, failure);
				clearTimeout(timer);
				xhr = null;
			}else{}
		};
		xhr.open(method,url,async);
		if(method == 'POST'){
			xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded;charset=' + encode);
		}
		//alert(data)
		xhr.send(data);
		return xhr;	
	}
	function _serialize(obj){
		var a = [];
		for(var k in obj){
			var val = obj[k];
			if(val.constructor == Array){
				for(var i=0,len=val.length;i<len;i++){
					a.push(k + '=' + encodeURIComponent(val[i]));
				}				
			}else{
				a.push(k + '=' + encodeURIComponent(val));
			}				
		}
		return a.join('&');
	}
	function strToJson(str){
	      var json = eval('(' + str + ')');  
    return json;  
   }
	function _onStateChange(xhr,type,success,failure){
   
		var s = xhr.status, result;

		if(s>= 200 && s < 300){
            switch(type){
                case 'text':
                    result = xhr.responseText;
                    break;
                case 'json':
                    result = function(str){
						try{
							//return JSON.parse(str);
							return strToJson(str);
						}catch(e){
							try{
								return (new Function('return ' + str))();
							}catch(e){
								failure(xhr,'parse json error',e);
							}
						}
                    }(xhr.responseText);
                    break;
                case 'xml':
                    result = xhr.responseXML;
                    break;
            }
           
			// text, 返回空字符时执行success
			// json, 返回空对象{}时执行suceess，但解析json失败，函数没有返回值时默认返回undefined
			
			typeof result !== 'undefined' && success(result);
			
			//请求超时，调用abort后xhr.status为0，但不知为0时是否还有其它的情况	
		}else if(s===0){
			failure(xhr,'request timeout');
		}else{
			failure(xhr,xhr.status);
		}
		xhr = null;
	}
	return (function(){
		var Ajax = {request:request}, types = ['text','json','xml'];
		for(var i=0,len=types.length;i<len;i++){
			Ajax[types[i]] = function(i){
				return function(url,opt){
					opt = opt || {};
					opt.type = types[i];
					return request(url,opt);
				}
			}(i);
		}
		return Ajax;
	})();
}();


function subStr(str,len){
	var w = 0;
	for (var i = 0,c,length = str.length; i < length; i++) {
	     c = str.charCodeAt(i);
		 //单字节加1
		 if ((c >= 0x0001 && c <= 0x007e) || (0xff60<=c && c<=0xff9f)) {
			 w++;
		 }else{
		   w+=2;
		 }
		 if(parseInt((w+1)/2)>len){
			return str.substring(0,i);
			break;
		　}
	} 	
	return str;
}

//添加cookie
function addCookie(name,value,expireHours){ 
	var cookieString=name+"="+escape(value)+";path=/"; 
	//判断是否设置过期时间 
	if(expireHours>0){ 
	var date=new Date(); 
	date.setTime(date.getTime+expireHours*3600*1000); 
	cookieString=cookieString+"; expire="+date.toGMTString(); 
	}
	document.cookie=cookieString; 
} 
//获得cookie
function getCookie(name){ 
	var strCookie=document.cookie; 
	var arrCookie=strCookie.split("; "); 
	for(var i=0;i<arrCookie.length;i++){ 
	var arr=arrCookie[i].split("="); 
	if(arr[0]==name)return arr[1]; 
	}
	return ""; 
} 
//删除cookie
function deleteCookie(name){ 
	var date=new Date(); 
	date.setTime(date.getTime()-10000); 
	document.cookie=name+"=v;path=/;expire="+date.toGMTString(); 
}


/*function pageobj(arrowup,arrowdown){
	this.page = 0;
	this.pagetotal = 0;
	this.prepage = 0;
	this.nextpage = 0;
	//this.arrowup = arrowup;
	//this.arrowdown = arrowdown;
}

pageobj.prototype.setpage = function(page,pagetotal,prepage,nextpage){
	this.page = page;
	this.pagetotal = pagetotal;
	this.prepage = prepage;
	this.nextpage = nextpage;
}
pageobj.prototype.clear = function(){
	this.page = 0;
	this.pagetotal = 0;
	this.prepage = 0;
	this.nextpage = 0;
}
pageobj.prototype.refrpage = function(){
//    if(this.page != 1){
//		this.arrowup.myfocus();
//	}
//	else{
//		this.arrowup.myblur();
//	}
//	if(this.page != this.pagetotal){
//		this.arrowdown.myfocus();
//	}
//	else{
//		this.arrowdown.myblur();
//	}
	//alert("this.page:"+this.page);
	//alert("this.pagetotal:"+this.pagetotal);
	$('page').innerHTML = this.page + "/" + this.pagetotal;
}
pageobj.prototype.setZero = function(){
//    this.arrowup.myblur();
//	this.arrowdown.myblur();
	$('page').innerHTML = "0/0";
}*/



/*function arrow(id,css_f,css_b){
	this.arrowobj = $(id);
	this.css_f = css_f;
	this.css_b = css_b;
}
arrow.prototype.myfocus = function(){
	this.arrowobj.className = this.css_f;
}
arrow.prototype.myblur = function(){
	this.arrowobj.className = this.css_b;
}*/
