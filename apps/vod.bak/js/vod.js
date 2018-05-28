function $(id){
	return document.getElementById(id);
}

function Control(index){
	this.index = 0;
	this.left =	function(){};
	this.right = function(){};
	this.up = function(){};
	this.down = function(){};
	this.onFocus = function(){};
	this.onBlur = function(){};
	this.onSelect = function(){};
	this.pageUp = function(){};
	this.pageDown = function(){}; 
}

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
			return str.substring(0,i)+"...";
			break;
		　}
	} 	
	return str;
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
//判断为空的函数
function isnull(jsonstr)
{
  for(var key in jsonstr)
  {
	  return false;
  }
  return true;
}	