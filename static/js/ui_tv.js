/**
 * 直播页 cookie中保存有上次播放记录信息 (last_play_info)
 */
var cronTime;
var cronStatus;
var cronMenu;
var cronVolume;
var menuIndex;		//节目分类索引
var tvIndex;		//节目列表索引
var hideContentTimer = null;
function hideVolumeBox()
{
	o('Volume_Div').style.display = 'none';
}
function showTimeInfo()
{
	cronTime = window.setInterval("tvObj.showTimeInfo()",1000);
}
function hideTimeBox()
{
	$('#playpanel').hide();
}
function autoShowTimeBox()
{
	setTimeout(function(){
		showDiv('content');
	},5000);
}

function showErrorDiv(msg)
{
	$('#div_msg').html(msg).show();
	setTimeout(function(){
		window.location.href = '../index/index.html';
	},3000);
}


var tvObj = {
	mp : null,
	date : null,
	data : {
		instanceID:-1,		//实例ID
		status	 : 0,		//播放器当前的状态
		index	 : 1,		//节目列表索引
		tvIndex  : -1,		//二级菜单 -- 节目列表 索引
		programID : 0,
		programName : '',
		id		 : 0,		//该节目在数据库中的自增量ID
		mouseFlag: 'play',	//play time class list 四个区 正常播放区 状态显示区 节目分类 列表区(分集) 清晰度切换区（上页 下页）
		title	 : 'stb js',//节目名称
		backUrl	 : '../index/index.html',	//返回上一页的地址定义
		tvUrl	 : '',		//包含所有M3U8地址的组合串 （作为解析参数用）
		listObj: '#ch_lists ul',		//节目列表层 对象
		listObjs: '#ch_lists ul > li',
		classObj : '#ch_menu ul',
		classObjs: null,
		volumnObj: '#Volume_Div',
		volume	 : 20,		//音量参数 最大 33
		screen	 : 0,		//播放器尺寸状态  自定义/全屏
		top		 : 0,
		left	 : 0,
		height	 : 1280,
		width	 : 720,
		playUrl  : '',
		total	 : 0,		//总共的清晰度选项值
		totalTV	 : 0,
		pageID	 : 1,
		pageCount: 10,
		code	 : '',		//顾客遥控器的节目号按键 足4位才跳转
		programListStr:'',
		timeStamp : 0,		//当前的时间对象 的毫秒值  用于初始化的时候 校正用 因为机顶盒时间不准
		indexArr : null,	//所有第二列 列表的对应的总节目数 防止以后重复计算
		baseTop  : 84,		//初始的 节目列表的顶部基准值
		stepMenu : 0,
		
	},
	init : function(opts){
		if(opts != undefined)
		{
			//this.data = $.extend(this.data,opts);
			this.data.totalTV = opts.totalTV;
			this.data.timeStamp = opts.timeStamp;
		}
		this.initMenu();
		this.initDate();
		this.initPlayer(this.data.left,this.data.top,this.data.width,this.data.height);
		this.initVars();
		this.event();	//键盘监控
		
		this.showTimeInfo();

	},
	initMenu : function()
	{
		//初始化电视分类主菜单
		var tmpmenuhtml = '';
		for(var i=0;i<menuArr.length;i++)
		{
			tmpmenuhtml += "<li sid='" + menuArr[i].id + "' idx='" + i + "'>" + Dot3(menuArr[i].name,15) + "</li>";
		}
		o('div_menu').innerHTML = tmpmenuhtml;
	},
	initDate : function()
	{
		/*if(this.date==null)
		{
			this.date = new Date();
			var tz = OVT_script.exec("OvtGetInforFromFile","timezone");
			var timez = 0;
			if(typeof(tz) != "undefined" && tz != "")
			{
				timez = parseFloat(tz);
				//document.getElementById("weather_img").innerText = timez*60;
			}
			this.date.setTime(this.data.timeStamp + timez*60*60*1000);
			//this.date.setHours(this.date.getHours() + 8);
		}*/
		this.date = new Date();
		showTimeInfo();
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
			vo = 20;
		}
		else
		{
			vo = parseInt(vo);
		}
		this.mp.setVolume(vo);
	},
	initVars : function()
	{
		//提前计算所有的变量
		this.data.total = menuArr.length;		//分类菜单的总数
		var tmparr = new Array();
		var tmptotal = 0;
		var tmpstr = '';
		for(var i=0;i<this.data.total;i++){
			tmparr[i] = menuContent[i].length-1;
			tmpstr += tmparr[i] + ',';
		}
		this.data.indexArr = tmparr;			//每个分类的节目列表的最大索引
		this.data.index = -1;
		this.data.tvIndex = -1;
		this.data.classObjs = o('div_menu').children;
		this.data.listObjs = o('div_lists').children;

		//从COOKIE中取上次播放记录(以 | 号分隔  格式： 分类索引|节目索引|节目ID|节目名|节目地址)，否则直接播放第一个节目
		var last_play_str = getCookie('last_play_info');
		if(last_play_str)
		{
			var last_play_arr = last_play_str.split('|');
			menuIndex = last_play_arr[0];
			tvIndex = last_play_arr[1];
			this.data.programID = menuContent[menuIndex][tvIndex].chid;
			this.data.programName = menuContent[menuIndex][tvIndex].name;
			this.data.tvUrl = menuContent[menuIndex][tvIndex].url;
		}
		else
		{
			menuIndex = 0;
			tvIndex = 0;
			this.data.programID = 1;
			this.data.programName = menuContent[0][0].name;
			this.data.tvUrl = menuContent[0][0].url;
		}
		//尽快显示节目信息面板
		this.showProgramInfo(this.data.programID,this.data.programName + ' 请稍等...');
		showDiv('content');
		this.data.mouseFlag = 'play';
		this.playFromStart();

		this.showMenu(menuIndex,tvIndex);
		this.data.index = menuIndex;
		this.data.tvIndex = tvIndex;
	},
	getCurrentPage : function(num)
	{
		return Math.ceil(num/this.data.pageCount);
	},
	getIndexScope : function(idx,selectIndex)
	{
		if(selectIndex==-1)
		{
			var max = 9;
			if(max>this.data.indexArr[idx])
			{
				max = this.data.indexArr[idx];
			}
			return {start:0,end:max};
		}
		var startIndex,endIndex,pageid;
		pageid = this.getCurrentPage(selectIndex+1);
		startIndex = (pageid-1)*this.data.pageCount;
		endIndex = pageid*this.data.pageCount-1;
		if(endIndex>this.data.indexArr[idx])
		{
			endIndex = this.data.indexArr[idx];
		}
		return {start:startIndex,end:endIndex};
	},
	moveBox : function(selectIndex)
	{
		//把选中框的层移动到指定索引的坐标
		var idx = (selectIndex % this.data.pageCount) * 56 + this.data.baseTop;
		o("div_msg").style.top = idx + 'px';
	},
	showBox : function()
	{
		showDiv('div_msg');
	},
	hideBox : function()
	{
		//直接在 单个分类菜单上下移动
		hideDiv('div_msg');
	},
	showMenu : function(idx,selectIndex)
	{
		/*显示索引为 idx 的菜单 并 同步第二列的内容 焦点  
		 * @param	selectIndex		第二列的焦点索引 -1表示不需要定位节目的焦点
		*/
		idx			 = parseInt(idx);
		selectIndex  = parseInt(selectIndex);
		//直接算出应该显示哪个区间的数据
		var indexObj = this.getIndexScope(idx,selectIndex);
		var htmlstr = '';
		for(var i=indexObj.start;i<=indexObj.end;i++)
		{
			htmlstr += "<li><span class='channel_id'>" + menuContent[idx][i].chid + "</span><span class='channel_name'>" + Dot3(menuContent[idx][i].name,34) + "</span></li>";
		}
		o('div_lists').innerHTML = htmlstr;

		if(this.data.index>-1)
		{
			this.data.classObjs[this.data.index].setAttribute('class','');
		}
		var tmpclass = 'curfocus';
		if(selectIndex!=-1)
		{
			tmpclass = 'o';
		}
		this.data.classObjs[idx].setAttribute('class',tmpclass);
		
		//最后保存变量
		if(selectIndex>-1)
		{
			this.moveBox(selectIndex);
		}
	},
	playNextTV : function()
	{
		if(this.data.programID >= this.data.totalTV)
		{
			return false;
		}
		
		//只要可以切换 立即停止节目 
		this.stop();
		//赶紧响应显示面板
		menuIndex = this.data.index;
		tvIndex = this.data.tvIndex;
		if(tvIndex<this.data.indexArr[menuIndex])
		{
			tvIndex++;
		}
		else
		{
			tvIndex= 0;
			menuIndex++;
			if(menuIndex>this.data.total-1)
			{
				menuIndex = 0;
			}
		}
		var program_id = menuContent[menuIndex][tvIndex].chid;
		this.data.programID = program_id;
		this.data.programName = menuContent[menuIndex][tvIndex].name;
		this.showProgramInfo(program_id,this.data.programName + ' 切换中...');
		showDiv('content');
		
		this.data.tvUrl = menuContent[menuIndex][tvIndex].url;

		this.playTV();
		//重新定位焦点、保存变量
		this.showMenu(menuIndex,tvIndex);
		this.data.index = menuIndex;
		this.data.tvIndex = tvIndex;
		this.addPlayHistory();
		
	},
	playPrevTV : function()
	{
		if(this.data.programID <=1)
		{
			return false;
		}
		
		//只要可以切换 立即停止节目 
		this.stop();
		menuIndex = this.data.index;
		tvIndex = this.data.tvIndex;
		//赶紧响应显示面板
		if(tvIndex>0)
		{
			tvIndex--;
		}
		else
		{
			menuIndex--;
			if(menuIndex<0)
			{
				menuIndex = this.data.total-1;
			}
			tvIndex = this.data.indexArr[menuIndex];
		}
		var program_id = menuContent[menuIndex][tvIndex].chid;
		this.data.programID = program_id;
		this.data.programName = menuContent[menuIndex][tvIndex].name;
		this.showProgramInfo(program_id,this.data.programName + ' 切换中...');
		showDiv('content');
		
		this.data.tvUrl = menuContent[menuIndex][tvIndex].url;

		this.playTV();
		//重新定位焦点、保存变量
		this.showMenu(menuIndex,tvIndex);
		this.data.index = menuIndex;
		this.data.tvIndex = tvIndex;
		this.addPlayHistory();
		
	},
	hideContentCallback : function()
	{
		hideDiv('content');
		hideContentTimer = null;
	},
	back : function()
	{
		if(this.data.mouseFlag=='list')
		{
			hideDiv('ch_bg');
			hideDiv('ch_detail');
			this.hideBox();
			showDiv('content');
			if(hideContentTimer != null)
				clearTimeout(hideContentTimer);
			hideContentTimer = setTimeout(this.hideContentCallback,3000);
			this.data.mouseFlag = "play";
			return;
		}
		this.finalize();
		//返回到上一页 : 首页
		window.location.href = this.data.backUrl;
	},
	up : function()
	{
		if(this.data.mouseFlag=='list')
		{
			if(tvIndex <= 0)
			{
				tvIndex = this.data.indexArr[menuIndex];
				var htmlstr = '';
				var tmpscode = this.getIndexScope(menuIndex,tvIndex);
				for(var i=tmpscode.start;i<=tmpscode.end;i++)
				{
					htmlstr += "<li><span class='channel_id'>" + menuContent[menuIndex][i].chid + "</span><span class='channel_name'>" + Dot3(menuContent[menuIndex][i].name,34) + "</span></li>";
				}
				o('div_lists').innerHTML = htmlstr;
				
			}
			else
			{
				tvIndex--;
				
				if(tvIndex %this.data.pageCount == 9)
				{
					//说明要向上翻页 不用计算 直接索引减10就好 
					var htmlstr = '';
					var sidx = tvIndex-9;
					var eidx = tvIndex;
					for(var i=sidx;i<=eidx;i++)
					{
						htmlstr += "<li><span class='channel_id'>" + menuContent[menuIndex][i].chid + "</span><span class='channel_name'>" + Dot3(menuContent[menuIndex][i].name,34) + "</span></li>";
					}
					o('div_lists').innerHTML = htmlstr;
				}
				
				
			}
			this.moveBox(tvIndex);
		}
		else if(this.data.mouseFlag == 'play')
		{
			//此时按上下键是换台 加台
			this.playNextTV();
		}
		else if(this.data.mouseFlag=='class')
		{
			if(menuIndex == 0)
			{
				return false;
			}
			else
			{
				removeClass(this.data.classObjs[menuIndex],'curfocus');
				menuIndex--;
				tvIndex = 0;
				addClass(this.data.classObjs[menuIndex],'curfocus');
			}
			this.data.mouseFlag = 'class';
			this.showMenu(menuIndex,-1);
			
		}
	},
	down : function()
	{
		if(this.data.mouseFlag == 'list')
		{
			if(tvIndex >= this.data.indexArr[menuIndex])
			{
				tvIndex = 0;
				var htmlstr = '';
				for(var i=0;i<=9;i++)
				{
					htmlstr += "<li><span class='channel_id'>" + menuContent[menuIndex][i].chid + "</span><span class='channel_name'>" + Dot3(menuContent[menuIndex][i].name,34) + "</span></li>";
				}
				o("div_lists").innerHTML = htmlstr;
				
			}
			else
			{
				tvIndex++;
				
				if(tvIndex %this.data.pageCount == 0)
				{
					//说明要向下翻页 不用计算 直接索引减10就好 
					var htmlstr = '';
					var sidx = tvIndex;
					var eidx = tvIndex+9;
					if(eidx>this.data.indexArr[menuIndex])
					{
						eidx = this.data.indexArr[menuIndex];
					}
					
					for(var i=sidx;i<=eidx;i++)
					{
						htmlstr += "<li><span class='channel_id'>" + menuContent[menuIndex][i].chid + "</span><span class='channel_name'>" + Dot3(menuContent[menuIndex][i].name,34) + "</span></li>";
					}
					o('div_lists').innerHTML = htmlstr;
				}
				
				
			}
			this.moveBox(tvIndex);
		}
		else if(this.data.mouseFlag == 'play')
		{
			//此时按上下键是换台 减台
			this.playPrevTV();
		}
		else if(this.data.mouseFlag == 'class')
		{
			if(menuIndex == this.data.total-1)
			{
				return false;
			}
			else
			{
				removeClass(this.data.classObjs[menuIndex],'curfocus');
				menuIndex++;
				tvIndex = 0;
				addClass(this.data.classObjs[menuIndex],'curfocus');
			}
			this.data.mouseFlag = 'class';
			this.showMenu(menuIndex,-1);
		}
		
	},
	left : function()
	{
		if(this.data.mouseFlag == 'list')
		{
			//不用切换显示隐藏 只把右边列的选中状态去掉就好
			var realidx = tvIndex % this.data.pageCount;
			this.data.listObjs[realidx].setAttribute('class','o');
			this.hideBox();
			this.data.mouseFlag = 'class';
			this.data.classObjs[menuIndex].setAttribute('class','curfocus');
			
		}
	},
	right : function()
	{
		if(this.data.mouseFlag == 'class')
		{
			//如果选中的是上次打开的菜单 则需要定位到当前节目的索引
			var startIndex = 0;
			
			if(tvIndex>0)
			{
				startIndex = tvIndex;
			}
			
			this.data.classObjs[menuIndex].setAttribute('class','o');
			tvIndex = startIndex;
			this.showBox();
			this.moveBox(startIndex);
			
			this.data.mouseFlag = 'list';
		}
	},
	select : function()
	{
		if(this.data.mouseFlag=='play')
		{
			showDiv('ch_bg');
			showDiv('ch_detail');
			hideDiv('content');
			this.showBox();
			this.data.mouseFlag = 'list';
		}
		else if(this.data.mouseFlag=='list')
		{
			//立即现实提示信息
			//this.showProgramInfo(this.data.programID,'即将换台,请稍等...');
			hideDiv('ch_bg');
			hideDiv('ch_detail');
			this.hideBox();
			showDiv('content');
			//得到当前应该直播的地址
			var tmpobj = menuContent[menuIndex][tvIndex];
			this.data.tvUrl = tmpobj.url;
			this.data.programID = tmpobj.chid;		//保存节目频道 方便 上下键直接换台
			this.data.programName = tmpobj.name;
			this.showProgramInfo(this.data.programID,this.data.programName + ' 切换中...');
			
			this.data.mouseFlag = 'play';	//改为播放状态
			this.playFromStart();
			this.addPlayHistory();
			this.data.index = menuIndex;
			this.data.tvIndex = tvIndex;
			
		}
	},
	addPlayHistory : function()
	{
		//将当前所看的节目 保存进COOKIE
		var history_str = menuIndex + '|' + tvIndex ;
		setCookie('last_play_info',history_str,12);
	},
	getEpgInfo : function(tvid,chid)
	{
		//此处加载当前时间段的节目信息
		var arr = new Array(2);
		arr[0] = {'time':'09:30','name':'西游记'};
		arr[1] = {'time':'10:45','name':'光头强电影版'};
		return arr;
	},
	showTimeInfo : function()
	{
		this.date.setTime(this.date.getTime()+1000);
		var today1 = this.date;
		var year = today1.getFullYear();
		var month = today1.getMonth()+1;
		var day = today1.getDate();
		var week = today1.getDay();
		var hours = today1.getHours();
		var minutes = today1.getMinutes();
		if(minutes<10)
		{
			minutes = '0' + minutes;
		}

		var weekArr = new Array("周日","周一","周二","周三","周四","周五","周六");
		//设置日期
		
		o("spanDate").innerHTML = year + '-' + month + '-' + day;
		o("spanTime").innerHTML = hours + ':' + minutes;
		o("spanWeek").innerHTML = weekArr[week];
		if(this.data.mouseFlag !='play')
		{
			this.data.stepMenu++;
			if(this.data.stepMenu >6)
			{
				o("ch_bg").style.display='none';
				o("ch_detail").style.display='none';
				this.hideBox();
				this.data.mouseFlag = 'play';
				this.data.stepMenu = 0;
				//恢复当前播放的索引变量
				if(menuIndex !=this.data.index || tvIndex !=this.data.tvIndex)
				{
					//window.alert('新：'+menuIndex +','+tvIndex +'|旧：'+this.data.index +','+this.data.tvIndex);
					this.data.classObjs[menuIndex].setAttribute('class','');
					this.showMenu(this.data.index,this.data.tvIndex);
					menuIndex = this.data.index;
					tvIndex = this.data.tvIndex;
					
				}
			}
		}
	},	
	
	volumnUp : function(){
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
		showDiv('Volume_Div');
		css(o("volume"),'width',realv);
		o("volume_value").innerHTML = vo;
		//3秒钟之后隐藏
		
		cronVolume = setTimeout("hideVolumeBox()",3000);
	},
	volumnDown : function(){
		var vo = this.mp.getVolume();
		vo = parseInt(vo);
		if(vo==0)
			return false;
		vo--;
		this.mp.setVolume(vo);
		OVT_script.exec("OvtSetInfor2File","stbvolumn",vo+'');
		//设置状态条
		clearTimeout(cronVolume);
		var realv = parseInt(vo*500/33);
		showDiv('Volume_Div');
		css(o("volume"),'width',realv);
		o("volume_value").innerHTML = vo;
		//3秒钟之后隐藏
		
		cronVolume = setTimeout("hideVolumeBox()",3000);
	},
	playFromStart : function()
	{
		//return true;
		var mediaStr = this.toJson(this.data.tvUrl);
		this.mp.stop();
		this.mp.setSingleMedia(mediaStr);
		this.mp.playFromStart();
	},
	playTV : function()
	{
		//return true;
		var mediaStr = this.toJson(this.data.tvUrl);
		this.mp.setSingleMedia(mediaStr);
		this.mp.playFromStart();
	},
	stop : function()
	{
		//return true;
		this.mp.stop();
	},
	finalize : function()
	{
		//return true;
		this.mp.stop();
		this.mp.releaseMediaPlayer(-1);
	},
	toJson : function(url)
	{
		return '[{mediaUrl:"' + url + '",mediaCode: "media0"}]';
	},
	
	showProgramInfo : function(pid,pname)
	{
		o("spanChannelID").innerHTML = pid;
		o("spanChannelName").innerHTML = Dot3(pname,32);
	},
	setIndex : function(i)
	{
		menuIndex = i;
	},
	getIndex : function()
	{
		return menuIndex;
	},
	goByCode : function(k)
	{	
		var that = this;
		var tmpcode = that.data.code + String(k-48);
		o("spanChannelID").innerHTML = String(k-48);
		
		that.data.code = tmpcode;
		o("spanChannelName").innerHTML = tmpcode+','+tmpcode.length;
		if(tmpcode.length==4)
		{
			//满足4位节目号  则查询改节目号是否存在 存在就跳转 最后清空节目号 接受下次按键
			if(that.data.programListStr=='')
			{
				$(".div_hidden li").each(function(){
					that.data.programListStr += $(this).attr('programid') + ',';
				});
			}
			var tmpProgramStr = that.data.programListStr;
			if(tmpProgramStr.indexOf(tmpcode + ',')!=-1)
			{
				
				//得到当前应该直播的地址等 相关属性  然后 跳转到指定台
				that.data.tvUrl = $(".div_hidden li[programid='" + tmpcode + "']").attr('surl');
				var newIndexValue = $(".div_hidden li[programid='" + tmpcode + "']").attr('idx');
				var programName = $(".div_hidden li[programid='" + tmpcode + "'] .channel_name").text();
				var newIndex = tmpcode.substr(0,1);		//可以直接这样获取
				this.setIndex(newIndex);
				//that.data.indexArr[newIndex] = newIndexValue;
				$("#ch_bg").hide();		//分类隐藏
				$("#ch_detail").hide(); //节目列表隐藏
				that.data.mouseFlag = 'play';	//改为播放状态
				this.playFromStart();			
				that.showProgramInfo(tmpcode,programName);
			}
			
			tmpcode = '';		//最后一定要清空数据 否则再按键没反应了
			that.data.code = '';
			$("#content #channel_focus .channel_name").html(tmpcode+','+tmpcode.length);
		}
		
		
	},
	sysEvent : function()
	{
		//return true;
		eval('MediaEventStr = ' + Utility.getEvent());
		var tmptype = MediaEventStr.type;
		if(tmptype == 'EVENT_PLAYMODE_CHANGE')
		{
			var tmpstatus = parseInt(MediaEventStr.new_play_mode,10);
			this.data.status = tmpstatus;
			if(tmpstatus == 4)
			{
				clearTimeout(cronStatus);
				showDiv('content');
				o("spanChannelName").innerHTML = this.data.programName + '  缓冲中...';
			}
			else if(tmpstatus ==6)
			{
				clearTimeout(cronStatus);
				showDiv('content');
				o("spanChannelName").innerHTML = this.data.programName + ' 结束';
			}
			else if(tmpstatus ==5)
			{
				clearTimeout(cronStatus);
				showDiv('content');
				o("spanChannelName").innerHTML = this.data.programName + ' 失败，请切换频道!';
			}
			else if(tmpstatus == 2)
			{
				//3秒之后隐藏信息面板
				o("spanChannelName").innerHTML = this.data.programName;
				cronStatus = setTimeout(function(){
					hideDiv('content');
				},5000);
			}
		}
		else
		{
			//o("div_msg").innerHTML = tmptype;
		}
		//4 2 6 5 => 缓冲 播放 结束 失败
		
	},
	event : function()
	{
		var that = this;
		 document.onkeypress = function(e){
			var keycode = e.which ||e.keyCode;
			that.data.stepMenu = 0;
			switch (keycode)
			{
			case ROC_IRKEY_BACK:
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
				that.left();
				break;
			case ROC_IRKEY_RIGHT:
				//前进8秒
				that.right();
				break;
			case ROC_IRKEY_SELECT:
				that.select();
				break;
			case 48:
				that.back();
				break;
			case ROC_IRKEY_VOLUME_UP:
				that.volumnUp();
				break;
			case ROC_IRKEY_VOLUME_DOWN:
				that.volumnDown();
				break;
			case 49 :
				that.select();
				break;
			case 0x0300:
				that.sysEvent();
				break;
			default :
					
					return;
			}
			
		};
	}
	
}

function Dot3(string, maxLen)
{
	if(string.length > maxLen)
	{
		return (string.substr(0,maxLen)+"..")	
	}
	else return string;
	
}
//function

//document.onkeypress = grabEvent;