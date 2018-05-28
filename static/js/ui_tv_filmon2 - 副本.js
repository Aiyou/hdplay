var menuArr_FO = new Array()
var menuContent_FO = new Array();

var menuArr = new Array()
var menuContent = new Array();

var allchannel = new Array();
var session_key;
var url_init = "http://204.107.27.61/tv/api/init?channelProvider=ipad&app_id=IGlsbSBuVCJ7UDwZBl0eBR4EHgcPFBtaXlBeX1wKGQ==";
var url_allchannel = "http://204.107.27.61/tv/api/channels?";
var url_channelgroup = "http://204.107.27.61/tv/api/groups?";
var url_playlink = "http://204.107.27.61/tv/api/channel/";

var needRetry = false;
function FO_start()
{
	needRetry = false;
	var opt = {timeout:600000,success:function(json){FO_init(json);},failure:function(xx, ss){FO_error(xx,ss);}};
	document.getElementById("debug").innerText = "FO_start";
	Ajax.request(url_init, opt);
}
function FO_error(xx,ss)
{
	document.getElementById("debug").innerText = ss;
	needRetry = true;
	//tvObj.showProgramInfo(0,"Request error or timeout, Press OK to retry!");
}
function FO_init(jsonInit)
{
		session_key = jsonInit.session_key;
		
		document.getElementById("debug").innerText = session_key;
		
		keepAliveStart();
		
		var allChannel = url_allchannel+"session_key="+session_key;
		var opt = {timeout:300000,type:'text',success:function(json){FO_AllChannel(json);},failure:function(xx, ss){FO_error(xx,ss);}};
		Ajax.request(allChannel, opt);

}
function FO_AllChannel(jsonText)
{
	var json = eval(jsonText);
	//filmon_id_list = new Array(json.length);
	document.getElementById("debug").innerText = "FO_AllChannel";
	document.getElementById("debug").innerText = "FO_AllChannel json len="+json.length;
	tvObj.data.totalTV =0;
	for(var i=0; i< json.length; i++)
	{
		allchannel[json[i].id] = json[i].title;
	}
	document.getElementById("debug").innerText = "FO_AllChannel 111111111111111";
  var getChannelGroupUrl = url_channelgroup+"session_key="+session_key;
  var opt = {timeout:60000,type:'text',success:function(jsonText){FO_ALLGroup(jsonText),failure:function(xx, ss){FO_error(xx,ss);}};
	Ajax.request(getChannelGroupUrl, opt);
}

var ClassPageCount = 0;
var ClassPageNumber = 10;
var CurrentPageIndex = 0;
var LastPageNumber = 0;
function FO_ALLGroup(jsonText)
{
	var json = eval(jsonText);
	document.getElementById("debug").innerText = "FO_ALLGroup";
	for(var i=0; i< json.length; i++)
	{
		menuArr_FO[i] = {id:(i+1), name:json[i].group};
		menuContent_FO[i] = new Array();
		for(var j=0; j<json[i].channels.length;j++)
		{
			tvObj.data.totalTV++;
			var channelid = json[i].channels[j];
			var cid = tvObj.data.totalTV;
			menuContent_FO[i][j] = {id:channelid,name:allchannel[channelid],chid:cid,url:''};
		}
	}
	document.getElementById("debug").innerText = "FO_ALLGroup 11111111111";
	ClassPageCount = parseInt(json.length/ClassPageNumber);
	LastPageNumber = json.length % ClassPageNumber;
	if(LastPageNumber > 0)
	{
		ClassPageCount += 1;
	}
	CurrentPageIndex = 0;
	document.getElementById("debug").innerText = "FO_ALLGroup 22222222222";
	setPageIndex(CurrentPageIndex);
	document.getElementById("debug").innerText = "FO_ALLGroup 3333333333333";
	tvObj.init();
}
function setPageIndex(pindex)
{
	var count = ClassPageNumber;
	if(pindex == ClassPageCount-1)
	{
		if(LastPageNumber>0) count = LastPageNumber;
	}
	menuArr = new Array();
	menuContent = new Array();
	for(var i=0; i < count; i++)
	{
		menuArr[i] = menuArr_FO[pindex*ClassPageNumber+i];
		menuContent[i] = menuContent_FO[pindex*ClassPageNumber+i];
	}
}
function classPageUp()
{
		CurrentPageIndex--;
		if(CurrentPageIndex < 0) CurrentPageIndex = ClassPageCount-1;
		setPageIndex(CurrentPageIndex);
		tvObj.classPageInit();
}
function classPageDown()
{
		CurrentPageIndex++;
		if(CurrentPageIndex == ClassPageCount) CurrentPageIndex = 0;
		setPageIndex(CurrentPageIndex);
		tvObj.classPageInit();
}
function jumpToPage(pageIndex)
{
	CurrentPageIndex = pageIndex;
	setPageIndex(CurrentPageIndex);
	tvObj.classPageInit();
}

function Dot3(string, maxLen)
{
	if(string.length > maxLen)
	{
		return (string.substr(0,maxLen)+"..")	
	}
	else return string;
	
}
var lastPlayID = -1;
var currentID = -1;
function getPlayLink(cid)
{
	currentID = cid;
	showLoading();
	var channelInfoUrl = url_playlink+cid+"?session_key="+session_key;
	document.getElementById("debug").innerText = "getPlayLink";
	var opt = {timeout:300000,success:function(json){tvObj.playFilmOn(json.streams[1].url);hideLoading();}};
	Ajax.request(channelInfoUrl, opt);
	
}
function getPlayLink2(cid)
{
	currentID = cid;
	showLoading();
	var channelInfoUrl = url_playlink+cid+"?session_key="+session_key;
	document.getElementById("debug").innerText = "getPlayLink2";
	var opt = {timeout:300000,success:function(json){tvObj.playTVFilmOn(json.streams[1].url);hideLoading();}};
	Ajax.request(channelInfoUrl, opt);
	
}

function keepAliveStart()
{
	var aliveLive = setInterval("keepAlive()",180000);
}
function keepAlive()
{
	Ajax.request("http://204.107.27.61/tv/api/keep-alive", {});
}

function showLoading()
{
	document.getElementById("loading").style.display = "";
}
function hideLoading()
{
	document.getElementById("loading").style.display = "none";
}