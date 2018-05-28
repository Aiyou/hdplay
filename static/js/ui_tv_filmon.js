var filmon_session_key = "";
var filmon_id_list = new Array();
var filmon_name_list;
var filmon_link_list;
var filmon_url = "http://www.filmon.com/tv/api/init?channelProvider=ipad&app_id=IGlsbSBuVCJ7UDwZBl0eBR4EHgcPFBtaXlBeX1wKGQ=="

var globalCallback;
function getFilmOnList(callback)
{
	globalCallback = callback;
	var opt = {timeout:30000,success:function(json){filmOnInit(json);},failure:function(xx, ss){alert(ss);}};
	document.getElementById("debug").innerText = "getFilmOnList";
		Ajax.request(filmon_url, opt);
}

function filmOnInit(jsonInit)
{
		filmon_session_key = jsonInit.session_key;
		document.getElementById("debug").innerText = filmon_session_key;
		keepAliveStart();
		var allChannel = "http://www.filmon.com/tv/api/channels?session_key="+filmon_session_key;
		var opt = {timeout:300000,type:'text',success:function(json){filmOnInitAllChannel(json);}};
		Ajax.request(allChannel, opt);

}
function filmOnInitAllChannel(jsonText)
{
	var json = eval(jsonText);
	filmon_id_list = new Array(json.length);
	filmon_name_list = new Array(json.length);
	document.getElementById("debug").innerText = "filmOnInitAllChannel";
	menuArr[7] = {id:7, name:'FilmON'};
	menuContent[7] = new Array();
	for(var i=0; i< json.length; i++)
	{
		tvObj.data.totalTV++
		filmon_id_list[i] = json[i].id;
	  filmon_name_list[i] = json[i].title;
		var cid = tvObj.data.totalTV;
		menuContent[7][i] = {id:filmon_id_list[i],name:filmon_name_list[i],chid:cid,url:''};
	}
	document.getElementById("debug").innerText = "filmOnInitAllChannel";
	//globalCallback();
	tvObj.init1();
  //var html = "";
  ///
	//for(var i=0; i< json.length; i++)
	//{
	//		filmon_id_list[i] = json[i].id;
	//		filmon_name_list[i] = json[i].title;
	//		html += "<li><a href=\'javascript:\' onclick=\'showLink("+i+")\'>"+filmon_name_list[i]+"</a></li>";
	//}
	//document.getElementById('videolist').innerHTML = html;
}



function getPlayLink(i)
{
	var channelInfoUrl = "http://www.filmon.com/tv/api/channel/"+filmon_id_list[i]+"?session_key="+filmon_session_key;
	document.getElementById("debug").innerText = "getPlayLink";
	var opt = {timeout:300000,success:function(json){tvObj.playFilmOn(json.streams[1].url);}};
	Ajax.request(channelInfoUrl, opt);
	
}
function getPlayLink2(i)
{
	var channelInfoUrl = "http://www.filmon.com/tv/api/channel/"+filmon_id_list[i]+"?session_key="+filmon_session_key;
	document.getElementById("debug").innerText = "getPlayLink2";
	var opt = {timeout:300000,success:function(json){tvObj.playTVFilmOn(json.streams[1].url);}};
	Ajax.request(channelInfoUrl, opt);
	
}
function getChannelInfo(cIndex, json)
{
	filmon_name_list[cIndex] = json.title;
	filmon_link_list[cIndex] = json.streams[1].url;
}

function keepAliveStart()
{
	var aliveLive = setInterval("keepAlive()",180000);
}
function keepAlive()
{
	Ajax.request("http://www.filmon.com/tv/api/keep-alive", {});
}
