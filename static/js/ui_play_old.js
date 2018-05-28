/**
 * 播放页只传 节目id M3U8_id和影片名以及索引  mmsid name index
 */
var cronVolume;
var cronTime;
var cronStatus;
var cronFast;	//快进的计时器
var currentPlayTime = 0;		//用于快进用
var tvListArr = new Array();
function hideVolumeBox()
{
	hideDiv('Volume_Div');
}
function showTimeInfo()
{
	playObj.showTimeInfo();
}
function resetTimeInfo()
{
	playObj.data.status='play';
	currentPlayTime = 0;
	cronTime = setInterval("showTimeInfo()",1000);
}
function hideTimeBox()
{
	hideDiv('playpanel');
}

var playObj = {
	mp : null,
	data : {
		instanceID:-1,		//实例ID
		status	 : 'stop',	//播放器当前的状态
		index	 : 0,
		page	 : '',
		playIndex: 0,		//清晰度的索引
		listIndex: 0,		//播放列表的索引
		mmsid	 : 0,		//mmsid 只对乐视有效
		id		 : 0,		//该节目在数据库中的自增量ID
		mouseFlag: 'play',	//play time list page swap 五个区 正常播放区 时间栏显示区 播放列表区 跳转区(分集) 清晰度切换区（上页 下页）
		title	 : 'stb js',//节目名称
		backUrl	 : 'video_info.html',	//返回上一页的地址定义
		ajaxUrl  : '',		//动态获取视频地址信息的页面地址
		m3u8UrlStr: '',		//包含所有M3U8地址的组合串 （作为解析参数用）
		listObj  : '#playlist2',		//播放列表层 对象
		listObjs : '#itemList2 li',
		cacheObj : '',		//缓存当前分类当前页JSON数据的容器
		swapObj  : '#select_panel',
		swapObjs : '#div_swap ul >li',
		volumnObj: '#Volume_Div',
		statusObj: '#playpanel',
		volume	 : 20,		//音量参数 最大 33
		type	 : 0,		//视频类型 比方说 流畅 标清 高清 超清 1 2 3 4
		screen	 : 0,		//播放器尺寸状态  自定义/全屏
		top		 : 0,
		left	 : 0,
		height	 : 1280,
		width	 : 720,
		urlArr	 : null,		//全局的所有清晰度的地址数组
		buttonArr: null,	//全局的所有清晰度的标题数组
		playUrl  : '',
		total	 : 0,		//总共的清晰度选项值
		playPosition : 0,	//切换清晰度 暂停时的 位置
		maxPosition : 0,	//最大的播放 位置
		totalPage: 0,
		pageCount: 20,
		totalTV	 : 0,
		pageID	 : 1,
		baseLeft : 120,
		fastPosition:0
	},
	init : function(opts){
		if(opts != undefined)
		{
			this.data = $.extend(this.data,opts);
		}
		var that = this;
		this.initPlayList();
		this.initPlayer(this.data.left,this.data.top,this.data.width,this.data.height);
		this.event();	//键盘监控
		
		var tmpurl = that.data.ajaxUrl + '?tvid=' + this.data.mmsid +'&' + new Date().getTime();
		//$('#div_test').html('请求开始：'+ tmpurl);
		var tmpopt = {success:function(json){that.parseUrl(json.m3u8UrlStr);that.playFromStart();}};
		Ajax.request(tmpurl,tmpopt);
	},
	loadVod : function(mmsid)
	{
		var that = this;
		var tmpurl = that.data.ajaxUrl + '?tvid=' + mmsid +'&' + new Date().getTime();
		$('#div_test').html('请求开始：'+ tmpurl);
		var tmpopt = {success:function(json){$('#div_test').html('请求成功');that.parseUrl(text);that.playFromStart();}};
		Ajax.request(tmpurl,tmpopt);
		//var tmpinfo = '高清|http://pl.youku.com/playlist/m3u8?ts=1401788315&keyframe=1&type=flv&vid=XNTc3OTU5NzI4#标清|http://pl.youku.com/playlist/m3u8?ts=1401788315&keyframe=1&type=mp4&vid=XNTc3OTU5NzI4#流畅|http://pl.youku.com/playlist/m3u8?ts=1401788315&keyframe=1&type=hd2&vid=XNTc3OTU5NzI4';
		//that.parseUrl(tmpinfo);
		//that.playFromStart();
		/*
		var tmpjsonstr = '';
		var base_url = 'http://pl.youku.com/playlist/m3u8?ts=1401788315&keyframe=1&vid=';
		tmpjsonstr = '高清|'+ base_url + mmsid + '&type=hd2';
		tmpjsonstr += '#' + '标清|'+ base_url + mmsid + '&type=mp4';
		tmpjsonstr += '#' + '流畅|'+ base_url + mmsid + '&type=flv';
		that.parseUrl(tmpjsonstr);
		that.playFromStart();
		*/
	},
	initPlayList : function()
	{
		//直接从COOKIE中取播放列表
		var tmphtml = $.cookie('play_list');
		//if(typeof(tmphtml)=='undefined')
		if(tmphtml==null)
		{
			return false;
		}
		//tmphtml = '1216024,1|1224553,2|1234693,3|1243591,4|1251871,5|1258817,6|1268310,7|1277426,8|1287617,9|1296547,10|1305274,11|1314270,12|1322778,13|1333305,14|1345451,15|1354908,16|1378303,17|1389532,18|1411703,19|1411307,20|1421336,21|1432906,22|1446477,23|1455897,24|1469118,25|1480852,26|1488041,27|1498143,28|1508942,29|1520235,30|1530401,31|1544223,32|1554809,33|1566206,34|1577039,35|1587857,36|1599954,37|1611461,38|1633699,39|1643388,40|1656505,41|1660648,42|1669669,43|1678295,44|1686325,45|1695094,46|1704199,47|1724619,48|1735368,49|1745593,50|1753894,51|1762938,52|1770903,53|1779103,54|1785248,55|1791531,56|1798038,57|1804250,58|1810849,59|1817496,60|1823761,61|1829872,62|1837077,63|1843197,64|1849999,65|1864315,66|1872495,67|1880924,68|1886895,69|1892841,70|1900710,71|1908741,72|1916338,73|1923496,74|1931913,75|1936632,76|1943673,77|1950221,78|1956878,79|1963603,80|1971340,81|1977568,82|1984558,83|2012350,84|2080653,85|2123594,86|2169466,87|2194383,88|2201040,89|2207856,90|2215281,91|2222519,92|2228711,93|2232344,94|2247895,95|2266972,96|2312587,97|2338789,98|2346067,99|2354523,100|2363547,101|2381076,102|2451659,103|2502350,104|2546295,105|2596306,106|2630053,107|2668758,108|2704800,109|2758121,110|2797707,111|2828918,112|2851771,113|2905760,114|2943419,115|2999095,116|3033211,117|3060648,118|3079838,119|3109271,120|3126424,121|3136424,122|3154521,123|3161885,124';
		var tmparr = tmphtml.split('|');
		var tmphtmlstr = '';
		var tmpinfoarr;
		this.data.totalTV = tmparr.length;
		this.data.totalPage = Math.ceil(this.data.totalTV/this.data.pageCount);
		for(var i=0;i<this.data.totalTV;i++)
		{
			tmpinfoarr = tmparr[i].split(',');
			tmphtmlstr += '<li sid="' + tmpinfoarr[0] + '">' + tmpinfoarr[1] + '</span>';
			//初始化的时候将该视频的所有剧集列表保存为全局变量
			tvListArr[i] = {sid:tmpinfoarr[0],text:tmpinfoarr[1]};
		}
		o("itemList2").innerHTML = tmphtmlstr;
		
		//把包含该集数的那一页显示出来
		var tmppageid = Math.ceil((this.data.index+1)/this.data.pageCount);
		$(this.data.listObjs).hide();
		var idx_from = (tmppageid-1)* this.data.pageCount;
		var idx_to = tmppageid* this.data.pageCount;
		if(idx_to>this.data.totalTV)
		{
			idx_to = this.data.totalTV;
		}
		$(this.data.listObjs + '.o').removeClass('o');
		$(this.data.listObjs).each(function(i){
			if(i>=idx_from && i<idx_to)
			{
				$(this).show();
			}
		});
		this.data.pageID = tmppageid;
		//设置选中状态
		//$(this.data.listObjs + ":eq(" + this.data.index + ")").addClass('o');
		this.moveBox(this.data.index);
		//然后清空COOKIE  测试时先保留
		//$.cookie('play_list',null);
	},
	initPlayer : function(l,t,w,h)
	{
		//初始化播放器
		if(this.mp==null)
		{
			this.mp = new MediaPlayer();			//初始化播放器对象
			//this.mp.setVolume(this.data.volume);		//初始化音量
			this.mp.setVideoDisplayArea(l,t,w,h);
		}
		//获取音量的设置
		var vo = OVT_script.exec("OvtGetInforFromFile","stbvolumn");
		if(vo == '')
		{
			vo = 10;
		}
		else
		{
			vo = parseInt(vo);
		}
		this.mp.setVolume(vo);
	},
	back : function()
	{
		if(this.data.mouseFlag=='swap')
		{
			this.exitSwapBox();
		}
		else if(this.data.mouseFlag=='playlist')
		{
			this.exitPlayListBox();
		}
		else if(this.data.mouseFlag=='play')
		{
			this.finalize();
			//返回到上一页
			var backstr = $.cookie('letv_info');
			var tmparr = backstr.split('|');
			//增加 page 参数
			window.location.href = this.data.backUrl + '?page=' + this.data.page + '&id=' + tmparr[0] + '&index='+this.getIndex();
			
		}
	},
	
	select : function()
	{
		if(this.data.mouseFlag=='swap'){
			$(this.data.statusObj).hide();
			this.selectSwapBox();
		}
		else if(this.data.mouseFlag=='play')
		{
			//根据播放状态判断是否需要暂停
			if(this.data.status == 'play')
			{
				this.mp.pause();
				$("#state").attr('class','pause_on');
				this.data.status = 'pause';
				clearInterval(cronTime);
				clearInterval(cronStatus);
				$(".prognameTip").html('已暂停');
				this.showStatusDiv();
				return false;
			}
			else if(this.data.status == 'pause')
			{
				this.mp.resume();
				$("#state").attr('class','play_on');	//设为
				cronTime = setInterval("showTimeInfo()",1000);
				this.data.status = 'play';
				$(".prognameTip").html('播放中');
				this.showStatusDiv();
				cronStatus = setTimeout("hideTimeBox()",5000);
			}
			else if(this.data.status == 'fast')
			{
				//快进生效
				clearTimeout(cronFast);
				this.mp.playByTime(1,currentPlayTime,1);
				currentPlayTime = 0;
				this.data.status = 'play';
				cronTime = setInterval("showTimeInfo()",1000);
				cronStatus = setTimeout("hideTimeBox()",5000);
			}
		}
		else if(this.data.mouseFlag=='playlist')
		{
			clearInterval(cronTime);
			this.mp.stop();
			
			//跳转页面试试看
			$(this.data.listObj).hide();
			hideDiv('div_box');
			$(this.data.statusObj).hide();
			this.data.mouseFlag = 'play';
			this.loadNextTV();	
		}
	},
	resetTimeBox : function()
	{
		//用户按了N次快进键之后没有按确定键 那么 回复快进之前的播放进度条和时间计时器
		//cronStatus = ;
	},
	moveBox : function(selectIndex)
	{
		//把选中框的层移动到指定索引的坐标 512+53
		var realIndex = selectIndex % this.data.pageCount;
		var lineIndex = realIndex%10;
		var left = lineIndex * 104 + this.data.baseLeft;
		var top = 512;
		if(realIndex>9)
		{
			top = 565;	//焦点在下一行
		}
		o("div_box").style.left = left + 'px';
		o("div_box").style.top = top + 'px';
	},
	loadNextTV : function()
	{
		//先获取选择的剧集的 mmsid
		var that = this;
		
		var index = that.getIndex();
		if(index>that.data.totalTV-1)
		{
			$(this.data.statusObj).show();
			$(".prognameTip").html('列表播放结束');
			return false;
		}
		//var sid = $('#itemList li:eq(' + index + ')').attr('sid');
		var sid = tvListArr[index].sid;
		/*var tmpurl = 'http://app.m.letv.com/android/mindex.php?mod=minfo&ctl=videofile&act=index&mmsid=' + sid + '&videoformat=ios&pcode=010510000&version=3.4&&mProvider=letv';
		this.data.playUrl = tmpurl;
		this.playFromStart();
		
		var tmphtml = '';
		$("#itemList li").each(function(i){
			if(tmphtml == '')
			{
				tmphtml += $(this).attr('sid')+','+$(this).html();
			}
			else
			{
				tmphtml += '|' + $(this).attr('sid')+','+$(this).html();
			}
		});
		$.cookie('play_list',tmphtml);		//播放列表记录
		*/
		window.location.href = 'play_video.html?page='+ this.data.page +'&id=' + this.data.id + '&tvid=' + sid + '&index=' + index + '&name=' + encodeURI(that.data.title);
		return false;
		/*
		var tmpurl = that.data.ajaxUrl + '?mmsid=' + sid +'&' + new Date().getTime();
		var tmpopt = {success:function(json){that.parseUrl(json.msg);}};
		Ajax.request(tmpurl,tmpopt);
		that.playFromStart();
		*/
	},
	fastRewind : function(i)
	{
		if(this.data.mouseFlag=='playlist')
		{
			var tmpindex = this.getIndex();
			if(tmpindex==0)
			{
				return false;
			}
			else
			{
				if(tmpindex == (this.data.pageID-1)*this.data.pageCount && this.data.pageID>1)
				{
					this.prevPage();
					return false;
				}
				
				//$(this.data.listObjs + '.o').removeClass('o');
				tmpindex--;
				//$(this.data.listObjs + ":eq("+ tmpindex +")").addClass('o');
				//直接用移动框代替
				this.moveBox(tmpindex);
				this.setIndex(tmpindex);
			}
		}
		else if(this.data.mouseFlag=='play')
		{
			if(this.data.status=='pause')
			{
				return false;
			}
			else if(this.data.status=='play')
			{
				$(this.data.volumnObj).hide();
				//正常播放时按左右键进入快进状态 清除时间自动计时器
				clearInterval(cronTime);
				clearTimeout(cronFast);
				this.data.status = 'fast';
				//暂时不调整 只做标记
				currentPlayTime = this.mp.getCurrentPlayTime();
				currentPlayTime = parseInt(currentPlayTime) -i;
				if(currentPlayTime<0)
				{
					currentPlayTime = 0;
				}
				this.showStatusDiv();
				cronFast = setTimeout("resetTimeInfo()",3000);
				this.showProgressInfo();
			}
			else if(this.data.status=='fast')
			{
				clearTimeout(cronFast);
				clearTimeout(cronStatus);
				currentPlayTime = parseInt(currentPlayTime) - i;
				if(currentPlayTime<0)
				{
					currentPlayTime = 0;
				}
				this.showStatusDiv();
				cronFast = setTimeout("resetTimeInfo()",3000);
				cronStatus = setTimeout("hideTimeBox()",5000);
				this.showProgressInfo();
			}
		}
		
	},
	fastForward : function(i)		//快进
	{
		if(this.data.mouseFlag=='playlist')
		{
			var tmpindex = this.getIndex();
			if(tmpindex==this.data.totalTV-1)
			{
				return false;
			}
			else
			{
				if((tmpindex == (this.data.pageID*this.data.pageCount-1)) && this.data.totalPage>this.data.pageID)
				{
					this.nextPage();
					return false;
				}
				
				//$(this.data.listObjs + '.o').removeClass('o');
				tmpindex++;
				//$(this.data.listObjs + ":eq("+ tmpindex +")").addClass('o');
				//直接用移动框代替
				this.moveBox(tmpindex);
				this.setIndex(tmpindex);
			}
		}
		else if(this.data.mouseFlag=='play')
		{
			if(this.data.status=='pause')
			{
				//暂停时按左右键没反应
				return false;
			}
			else if(this.data.status=='play')
			{
				$(this.data.volumnObj).hide();
				//正常播放时按左右键进入快进状态 清除时间自动计时器
				clearInterval(cronTime);
				clearTimeout(cronFast);
				this.data.status = 'fast';
				//暂时不调整 只做标记
				currentPlayTime = this.mp.getCurrentPlayTime();
				currentPlayTime = parseInt(currentPlayTime) +i;
				this.showStatusDiv();
				cronFast = setTimeout("resetTimeInfo()",3000);
				this.showProgressInfo();
			}
			else if(this.data.status=='fast')
			{
				clearTimeout(cronFast);
				clearTimeout(cronStatus);
				currentPlayTime = parseInt(currentPlayTime) + i;
				this.showStatusDiv();
				cronFast = setTimeout("resetTimeInfo()",3000);
				cronStatus = setTimeout("hideTimeBox()",5000);
				this.showProgressInfo();
			}

		}
		
	},
	volumnUp : function(){
		$(this.data.statusObj).hide();
		var vo = this.mp.getVolume();
		vo = parseInt(vo);
		if(vo==33)
			return false;
		vo++;
		this.mp.setVolume(vo);

		
		//设置状态条
		OVT_script.exec("OvtSetInfor2File","stbvolumn",vo+'');
		clearTimeout(cronVolume);
		var realv = parseInt(vo*500/33);
		$(this.data.volumnObj).show();
		$("#volume").css('width',realv);
		$("#volume_value").html(vo);
		//3秒钟之后隐藏
		cronVolume = setTimeout("hideVolumeBox()",3000);
	},
	volumnDown : function(){
		$(this.data.statusObj).hide();
		var vo = this.mp.getVolume();
		vo = parseInt(vo);
		if(vo==0)
			return false;
		vo--;
		
		this.mp.setVolume(vo);
		//设置状态条
		OVT_script.exec("OvtSetInfor2File","stbvolumn",vo+'');
		clearTimeout(cronVolume);
		var realv = parseInt(vo*500/33);
		$(this.data.volumnObj).show();
		$("#volume").css('width',realv);
		$("#volume_value").html(vo);
		//3秒钟之后隐藏
		cronVolume = setTimeout("hideVolumeBox()",3000);
	},
	goByTime : function(p)
	{
		this.mp.playByTime(1,p,1);
	},
	go : function(s)
	{
		this.mp.playByTime(1,s,1);
		cronTime = setInterval("showTimeInfo()",1000);
	},
	play : function()
	{
		//暂时用不到
		this.mp.seturl(this.data.url);
		this.mp.playFromStart();	//自动播放
	},
	playFromStart : function()
	{
		if(this.data.playUrl=='')
		{
			$('#div_test').html('播放地址未找到，请重试');
			return false;
		}
		//$('#div_test').html(this.data.playUrl);
		var mediaStr = this.toJson(this.data.playUrl);
		this.mp.setSingleMedia(mediaStr);
		this.mp.playFromStart();
		this.data.status = 'play';
		cronTime = setInterval("showTimeInfo()",1000);
	},
	pause : function()
	{
		this.mp.pause();
		
	},
	stop : function()
	{
		this.mp.stop();
	},
	finalize : function()
	{
		this.mp.stop();
		this.mp.releaseMediaPlayer(-1);
	},
	showStatusDiv : function()
	{
		$(this.data.statusObj).show();
	},
	showTimeInfo : function()
	{
		this.data.playPosition = this.mp.getCurrentPlayTime();
		this.data.maxPosition = this.mp.getMediaDuration();
		var curtime = this.formatTimeStr(this.data.playPosition)
		var endtime = this.formatTimeStr(this.data.maxPosition)
		$("#curtime").html(curtime);
		$("#endtime").html(endtime);
		$("#progname").html(this.data.title + ' (第 ' + (this.data.index+1) + ' 集)');
		var tips = '播放中';
		if(this.data.status == 'pause')
		{
			tips = '已暂停';
		}
		//$(".prognameTip").html(tips);
		var caption = $('#div_swap ul li.o').text();
		$("#clearness").html(caption);
		//设置进度条的 left属性 42~~702  总共 宽660 公式 ： 42+p%*660
		var pos = parseInt(660*this.data.playPosition/this.data.maxPosition);
		if(pos>660)
		{
			pos = 660;
		}
		pos += 42;
		$("#dot").css('left',pos + 'px');
	},
	showProgressInfo : function()
	{
		var curtime = this.formatTimeStr(currentPlayTime)
		$("#curtime").html(curtime);
		var totalPlayTime = this.mp.getMediaDuration();
		var pos = parseInt(660*currentPlayTime/totalPlayTime);
		if(pos>660)
		{
			pos = 660;
		}
		pos += 42;
		$("#dot").css('left',pos + 'px');
	},
	showPlayInfo : function()
	{
		//该函数只显示播放的节目名
		$("#progname").html(title);
	},
	toJson : function(url)
	{
		return '[{mediaUrl:"' + url + '",mediaCode: "media0"}]';
	},
	up : function()
	{
		if(this.data.mouseFlag=='play')
		{
			this.showSwapBox();
			return true;
		}
		else if(this.data.mouseFlag=='swap')
		{
			var currentPlayIndex = $("#div_swap li.o").attr('sid');
			if(currentPlayIndex == 0)
			{
				return false;
			}
			else
			{
				currentPlayIndex--;
				this.liSelect(currentPlayIndex);		//临时将某一个清晰度置为选中状态 但没提交
			}
		}
		else if(this.data.mouseFlag=='playlist')
		{
			//分两种情况：1.焦点在第一页的第一行 则什么也不做 2.否则上移一行(需判断是否要跳到上一页)
			var tmpIndex = this.getIndex();
			if(tmpIndex<10)
			{
				return false;
			}
			else
			{
				tmpIndex -=10;
				var idx_from = (this.data.pageID-1) * this.data.pageCount;
				
				//判断是否低于最小索引  是：同时判断要不要向上翻页(是否是首页) 然后定位新位置，否则直接定位到新位置 
				if(tmpIndex<idx_from)
				{
					if(this.data.pageID>1)
					{
						//翻页
						this.prevPage();
						//$(this.data.listObjs + '.o').removeClass('o');
					}
					//开始定位到新位置
					this.setIndex(tmpIndex);
					//$(this.data.listObjs + ':eq(' + tmpIndex + ')').addClass('o');
					this.moveBox(tmpIndex);
				}
				else
				{
					//开始定位到新位置
					//$(this.data.listObjs + '.o').removeClass('o');
					this.setIndex(tmpIndex);
					//$(this.data.listObjs + ':eq(' + tmpIndex + ')').addClass('o');
					this.moveBox(tmpIndex);
				}
			}
		}
	},
	down : function()
	{
		if(this.data.mouseFlag=='play')
		{
			showDiv('div_box');
			this.showPlayListBox();
		}
		else if(this.data.mouseFlag == 'swap')
		{
			var currentPlayIndex = $(this.data.swapObjs + ".o").attr('sid');
			if(currentPlayIndex == $(this.data.swapObjs).size()-1)
			{
				return false;
			}
			else
			{
				currentPlayIndex++;
				this.liSelect(currentPlayIndex);
			}
		}
		else if(this.data.mouseFlag=='playlist')
		{
			//向下时要可以切换集数
			var tmpIndex = this.getIndex();
			tmpIndex +=10;
			var idx_to = this.data.pageID * this.data.pageCount;
			if(idx_to>this.data.totalTV)
			{
				idx_to = this.data.totalTV;
			}
			//判断是否超过最大索引 超过：则什么也不做，否则重新定位到新位置 同时判断要不要翻页
			if(tmpIndex>=idx_to)
			{
				if(this.data.totalPage>this.data.pageID)
				{
					//翻页
					this.nextPage();
					$(this.data.listObjs + '.o').removeClass('o');
				}
				else
				{
					return false;
				}
				//如果翻到下一页的索引大于最大所以 则定位到当前页第一个
				if(tmpIndex>this.data.totalTV-1)
				{
					tmpIndex = (this.data.pageID-1) * this.data.pageCount;
				}
				//开始定位到新位置
				this.setIndex(tmpIndex);
				//$(this.data.listObjs + ':eq(' + tmpIndex + ')').addClass('o');
				this.moveBox(tmpIndex);
			}
			else
			{
				//开始定位到新位置
				//$(this.data.listObjs + '.o').removeClass('o');
				this.setIndex(tmpIndex);
				//$(this.data.listObjs + ':eq(' + tmpIndex + ')').addClass('o');
				this.moveBox(tmpIndex);
			}
		}
		
	},
	formatTimeStr : function(second)
	{
		if (!second) {
			return '0:00';
		}
		var time = '';
		if (second >= 60) {
			time += parseInt(second / 60) + ':';
			second %= 60;
		}
		else
		{
			time += '00:';
		}
		if (second > 9) {
			time += second;
		}
		else
		{
			time += '0' + second;
		}
		
		return time;
	},
	
	showSwapBox : function()
	{
		$(this.data.swapObj).show();
		this.data.mouseFlag = 'swap';
	},
	showPlayListBox : function()
	{
		$(this.data.listObj).show();
		this.data.mouseFlag = 'playlist';
	},
	selectSwapBox : function()
	{
		this.data.playIndex = $(this.data.swapObjs + ".o").attr('sid');		//保存全局清晰度索引变量
		this.exitSwapBox();
		//var tmpplayPosition = this.data.playPosition;
		this.data.fastPosition = this.data.playPosition;
		//重新加载视频
		clearInterval(cronTime);
		this.mp.stop();
		this.data.playUrl = this.data.urlArr[this.data.playIndex];
		//var mediaStr = this.toJson(this.data.playUrl);
		//this.mp.setSingleMedia(mediaStr);
		//this.mp.playFromStart();
		//this.go(tmpplayPosition);
		//6秒之后重新定位到上次播放的位置
		//setTimeout("go()",2000);
		this.playFromStart();
		//if(tmpplayPosition>5){
			//this.goByTime(tmpplayPosition-1);
		//}
	},
	exitPlayListBox : function()
	{
		$(this.data.listObj).hide();
		this.data.mouseFlag = 'play';
		hideDiv('div_box');
	},
	exitSwapBox : function()
	{
		this.liSelect(this.data.playIndex);
		$(this.data.swapObj).hide();
		this.data.mouseFlag = 'play';
	},
	liSelect : function(tmpPlayIndex)
	{
		var currentPlayIndex = $(this.data.swapObjs + ".o").attr('sid');
		if(tmpPlayIndex == currentPlayIndex)
		{
			return false;
		}
		$(this.data.swapObjs + ".o").removeClass('o');
		var tmpobj = $(this.data.swapObjs + "[sid='" + tmpPlayIndex + "']");
		tmpobj.addClass('o');
		//this.data.playIndex = tmpPlayIndex;
	},
	
	parseUrl : function(tmpUrlStr)
	{
		//$('#div_test').html(this.data.mmsid + ',请求内容：'+ tmpUrlStr);
		var urlArr = new Array();
		var buttonArr = new Array();
		
		var tmpArr = tmpUrlStr.split('#');
		this.data.total = tmpArr.length;
		var tmpUrlArr,key,url;
		for(var i=0;i<this.data.total;i++)
		{
			tmpUrlArr = tmpArr[i].split('|');
			key = tmpUrlArr[0]; 
			url = tmpUrlArr[1]; 
			urlArr[i] = url;
			buttonArr[i] = key;
			if(i==0)
			{
				this.data.playIndex = i;
				this.data.playUrl = url;
			}
		}
		this.data.urlArr = urlArr;
		this.data.buttonArr = buttonArr;

		this.initSwapButton(urlArr,buttonArr);  
	},
	initSwapButton : function(urlArr,buttonArr)
	{
		$(this.data.swapObj + ' ul').html('');
		for(var j=0;j<urlArr.length;j++)
		{
			if(urlArr[j] != '')
			{
			$(this.data.swapObj + ' ul').append('<li sid="' + j +'" url="' + urlArr[j] + '">' + buttonArr[j] + '</li>');
			}
		}
		//初始化状态
		$(this.data.swapObjs + "[sid='" + this.data.playIndex + "']").addClass('o');
	},
	prevPage : function()
	{
		if(this.data.pageID<=1)
		{
			return false;
		}
		else
		{
			var tmppageid = this.data.pageID-1;
			this.data.pageID = tmppageid;
			$(this.data.listObjs).hide();
			var idx_from = (tmppageid-1)* this.data.pageCount;
			var idx_to = tmppageid* this.data.pageCount;
			//$(this.data.listObjs + '.o').removeClass('o');
			$(this.data.listObjs).each(function(i){
				if(i>=idx_from && i<idx_to)
				{
					$(this).show();
				}
			});
			//默认选中最后一个
			this.setIndex(idx_to-1);
			//$(this.data.listObjs + ':eq(' + (idx_to-1) + ')').addClass('o');
			this.moveBox(idx_to-1);
		}
	},
	nextPage : function()
	{
		if(this.data.pageID>=this.data.totalPage)
		{
			return false;
		}
		else
		{
			var tmppageid = this.data.pageID+1;
			this.data.pageID = tmppageid;
			$(this.data.listObjs).hide();
			var idx_from = (tmppageid-1)* this.data.pageCount;
			var idx_to = tmppageid* this.data.pageCount;
			if(idx_to>this.data.totalTV)
			{
				idx_to = this.data.totalTV;
			}
			//$(this.data.listObjs + '.o').removeClass('o');
			$(this.data.listObjs).each(function(i){
				if(i>=idx_from && i<idx_to)
				{
					$(this).show();
				}
			});
			//默认选中第一个
			this.setIndex(idx_from);
			//$(this.data.listObjs + ':eq(' + idx_from + ')').addClass('o');
			this.moveBox(idx_from);
		}
	},
	setIndex : function(i)
	{
		this.data.index = i;
	},
	getIndex : function()
	{
		return this.data.index;
	},
	alert : function()
	{
		window.alert('total:'+this.data.totalTV + ' , totalpage:'+this.data.totalPage + ' , index:'+ this.data.index + ' , pageid:'+ this.data.pageID);
	},
	sysEvent : function()
	{
		eval('MediaEventStr = ' + Utility.getEvent());
		var tmptype = MediaEventStr.type;
		if(tmptype == 'EVENT_MEDIA_END')
		{
			$('#div_test').html(tmptype);
			$(".prognameTip").html('加载下一集');
			this.loadNextTV();
		}
		else if(tmptype == 'EVENT_PLAYMODE_CHANGE')
		{
			var tmpstatus = parseInt(MediaEventStr.new_play_mode,10);
			tmptype += ' , ' + tmpstatus;
			//$('#div_test').html(tmptype);
			if(tmpstatus==6)
			{
				//播放结束 跳转
				this.data.index++;
				clearInterval(cronStatus);
				this.showStatusDiv();
				$(".prognameTip").html('播放结束');
				this.loadNextTV();
			}
			else if(tmpstatus==5)
			{
				//播放结束 跳转
				clearInterval(cronStatus);
				this.showStatusDiv();
				$(".prognameTip").html('播放失败');
			}
			else if(tmpstatus==4)
			{
				//播放结束 跳转
				clearInterval(cronStatus);
				this.showStatusDiv();
				$(".prognameTip").html('缓冲中');
			}
			else if(tmpstatus==2)
			{
				//播放开始
				$(".prognameTip").html('播放中');
				if(this.data.fastPosition>5)
				{
					this.goByTime(this.data.fastPosition-1);
					this.data.fastPosition = 0;
				}
				//3秒后隐藏
				cronStatus = setTimeout("hideTimeBox()",5000);
			}
		}
		//4 2 6 5 => 缓冲 播放 结束 失败
		
	},
	event : function()
	{
		var that = this;
		$(document).bind('keydown',function(e){
			var keycode = e.keyCode || e.which;
			switch (keycode)
			{
			case ROC_IRKEY_BACK:
				that.back();
				break;
			case 48:
				that.back();
				break;
			case ROC_IRKEY_UP:
				that.up();
				break;
			case ROC_IRKEY_DOWN:
				that.down();
				break;
			
			case ROC_IRKEY_LEFT:
				//退后8秒
				that.fastRewind(15);
				break;
			case ROC_IRKEY_RIGHT:
				//前进8秒
				that.fastForward(15);
				break;
			case ROC_IRKEY_SELECT:
				that.select();
				break;
			case ROC_IRKEY_EXIT:
				exitSwapBox();
				break;
			case ROC_IRKEY_VOLUME_UP:
				that.volumnUp();
				break;
			case ROC_IRKEY_VOLUME_DOWN:
				that.volumnDown();
				break;
			case ROC_IRKEY_PAGE_UP:
				that.prevPage();
				break;
			case ROC_IRKEY_PAGE_DOWN:
				that.nextPage();
				break;
			case 49 :
				that.showStatusDiv();
				break;
			case 0x0300:
				that.sysEvent();
				break;
			default :
					
					return;
			}
			
		});
	}
	
}

