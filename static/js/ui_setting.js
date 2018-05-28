/**
 * 设置页 OVT_script 
 */
var cronTime;
var cronStatus;
function hideVolumeBox()
{
	$('#Volume_Div').hide();
}
function showTimeInfo()
{
	cronTime = window.setInterval("tvObj.showTimeInfo()",3000);
}
function hideTimeBox()
{
	$('#playpanel').hide();
}

var settingObj = {
	mp : null,
	data : {
		classID	 : 0,		//当前节目分类
		index	 : 0,		//节目菜单索引
		indexArr : null,
		id		 : 0,		//该节目在数据库中的自增量ID
		mouseFlag: 'play',	//play time class list 四个区 正常播放区 状态显示区 节目分类 列表区(分集) 清晰度切换区（上页 下页）
		title	 : 'stb js',//节目名称
		backUrl	 : '../index/index.html',	//返回上一页的地址定义
		tvUrl	 : '',		//包含所有M3U8地址的组合串 （作为解析参数用）
		listObj: '#ch_lists ul',		//节目列表层 对象
		listObjs: '#ch_lists ul > li',
		menuObj : '#ch_menu ul',
		menuObjs: '#ch_menu ul > li',
		statusObj: '#playpanel',
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
		code	 : '',		//顾客遥控器的节目号按键 足4位才跳转
		programListStr:'',
	},
	init : function(opts){
		if(opts != undefined)
		{
			this.data = $.extend(this.data,opts);
		}
		var total = $(this.data.classObjs).size();
		var indexArr = new Array();
		for(var i=0;i<total;i++)
		{
			indexArr[i] = 0;
		}
		this.data.indexArr = indexArr;
		this.initPlayer(this.data.left,this.data.top,this.data.width,this.data.height);
		this.event();	//键盘监控
		//临时打开调试
		$("#content").show();
		this.showTimeInfo();
		showTimeInfo();

	},
	initPlayList : function()
	{
		//直接从COOKIE中取播放列表
		var tmphtml = $.cookie('play_list');
		var tmparr = tmphtml.split('|');
		var tmphtmlstr = '';
		var tmpinfoarr;
		this.data.totalTV = tmparr.length;
		this.data.totalPage = Math.ceil(this.data.totalTV/this.data.pageCount);
		for(var i=0;i<this.data.totalTV;i++)
		{
			tmpinfoarr = tmparr[i].split(',');
			tmphtmlstr += '<li sid="' + tmpinfoarr[0] + '">' + tmpinfoarr[1] + '</span>';
		}
		$("#itemList").html(tmphtmlstr);
		
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
		$("#itemArea li:first").html('总共 ' + this.data.totalTV + ' 集(翻页键浏览)');
		//设置选中状态
		$(this.data.listObjs + ":eq(" + this.data.index + ")").addClass('o');
		//然后清空COOKIE  测试时先保留
		//$.cookie('play_list',null);
	},
	initPlayer : function(l,t,w,h)
	{
		//初始化播放器
		if(this.mp==null)
		{
			this.mp = new MediaPlayer();			//初始化播放器对象
			this.mp.setVolume(this.data.volume);		//初始化音量
			this.mp.setVideoDisplayArea(l,t,w,h);
		}
	},
	back : function()
	{
		
		//if(this.data.mouseFlag=='play')
		//{
			this.finalize();
			//返回到上一页 : 首页
			window.location.href = this.data.backUrl;
		//}
	},
	up : function()
	{
		if(this.data.mouseFlag=='play')
		{
			this.showSwapBox();
			return true;
		}
		else if(this.data.mouseFlag=='class')
		{
			var currentPlayIndex = $(this.data.classObjs + ".curfocus").attr('idx');
			if(currentPlayIndex == 0)
			{
				return false;
			}
			else
			{
				currentPlayIndex--;
				this.liSelect(currentPlayIndex);		//临时将节目分类置为选中状态 但没提交
			}
		}
		else if(this.data.mouseFlag=='list')
		{
			var currentPlayIndex = $(this.data.listObjs + ".curfocus").attr('idx');
			if(currentPlayIndex == 0)
			{
				return false;
			}
			else
			{
				currentPlayIndex--;
				this.liSelect(currentPlayIndex);		//临时将节目分类置为选中状态 但没提交
			}
		}
	},
	down : function()
	{
		if(this.data.mouseFlag=='play')
		{
			$("#ch_bg").show();
			this.data.mouseFlag = 'class';
			$(this.data.classObjs + '.o').attr('class','curfocus');
		}
		else if(this.data.mouseFlag == 'class')
		{
			var currentPlayIndex = $(this.data.classObjs + ".curfocus").attr('idx');
			if(currentPlayIndex == $(this.data.classObjs).size()-1)
			{
				return false;
			}
			else
			{
				currentPlayIndex++;
				this.liSelect(currentPlayIndex);
			}
		}
		else if(this.data.mouseFlag == 'list')
		{
			var currentPlayIndex = $(this.data.listObjs + ".curfocus").attr('idx');
			if(currentPlayIndex == $(this.data.listObjs).size()-1)
			{
				return false;
			}
			else
			{
				currentPlayIndex++;
				this.liSelect(currentPlayIndex);
			}
		}
		
	},
	left : function()
	{
		$("#ch_detail").hide();
		this.data.mouseFlag = 'class';
		$(this.data.classObjs + '.o').attr('class','curfocus');
		$(this.data.listObjs).remove();
	},
	right : function()
	{
		var tmpindex = $(this.data.classObjs + '.curfocus').attr('idx');
		if(tmpindex == 0)
		{
			return false;		//如果选中的是第一个 什么也不做
		}
		this.setIndex(tmpindex);
		this.data.classID = $(this.data.classObjs + '.curfocus').attr('sid');
		$(this.data.classObjs + '.curfocus').attr('class','o');
		this.data.mouseFlag = 'list';
		this.openChannelList(tmpindex,this.data.classID);
	},
	liSelect : function(tmpPlayIndex)
	{
		if(this.data.mouseFlag == 'class')
		{
			$(this.data.classObjs + ".curfocus").removeClass('curfocus');
			var tmpobj = $(this.data.classObjs + ":eq("+ tmpPlayIndex +")");
			tmpobj.addClass('curfocus');
		}
		else if(this.data.mouseFlag == 'list')
		{
			$(this.data.listObjs + ".curfocus").removeClass('curfocus');
			var tmpobj = $(this.data.listObjs + ":eq("+ tmpPlayIndex +")");
			tmpobj.addClass('curfocus');
		}
		//this.data.playIndex = tmpPlayIndex;
	},
	openChannelList : function(index,class_id)
	{
		//通过选择分类 动态调出所有的节目列表
		var div_id = '#div_list_' + class_id;
		var li_htmls = $(div_id).html();
		$(this.data.listObj).html();
		$(this.data.listObj).append(li_htmls);
		$(this.data.listObjs).removeClass();
		$(this.data.listObjs + ':eq('+ this.data.indexArr[index] + ')').addClass('curfocus');
		$("#ch_detail").show();
	},
	getEpgInfo : function(tvid)
	{
		var arr = new Array(2);
		arr[0] = {'time':'09:30','name':'西游记'};
		arr[1] = {'time':'10:45','name':'光头强电影版'};
		return arr;
	},
	showTimeInfo : function()
	{
		var today1 = new Date()
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
		$("#content #date span.date").html(year + '-' + month + '-' + day);
		$("#content #date span.time").html(hours + ':' + minutes);
		$("#content #date span.week").html(weekArr[week]);
		//获取节目信息
		var tmparr = this.getEpgInfo(1);
		$("#content #channel_lists li:first span.time_up").html(tmparr[0].time);
		$("#content #channel_lists li:last span.time_down").html(tmparr[1].time);
		$("#content #channel_lists li:first span.list_name1").html(tmparr[0].name);
		$("#content #channel_lists li:last span.list_name2").html(tmparr[1].name);
	},	
	select : function()
	{
		if(this.data.mouseFlag=='class')
		{
			//
		}
		else if(this.data.mouseFlag=='list')
		{
			//clearInterval(cronTime);
			
			//得到当前应该直播的地址
			this.data.tvUrl = $(this.data.listObjs + '.curfocus').attr('surl');
			var newIndexValue = $(this.data.listObjs + '.curfocus').attr('idx');
			var newIndex = $(this.data.classObjs + '.o').attr('idx');
			this.data.indexArr[newIndex] = newIndexValue;
			$("#ch_bg").hide();		//分类隐藏
			$("#ch_detail").hide(); //节目列表隐藏
			this.data.mouseFlag = 'play';	//改为播放状态
			this.playFromStart();			//?
		}
		else if(this.data.mouseFlag == 'play')
		{
			//状态面板
			//this.data.mouseFlag == 'status'
			$("#content").show();
			showTimeInfo();
		}
	},
	volumnUp : function(){
		var vo = this.mp.getVolume();
		vo = parseInt(vo);
		vo++;
		
		this.mp.setVolume(vo);
		/*
		var realv = parseInt(vo*500/33);
		$(this.data.volumnObj).show();
		$("#volumn").css('width',realv);
		$("#volume_value").html(vo);
		//3秒钟之后隐藏
		setTimeout("hideVolumeBox()",3000);
		*/
	},
	volumnDown : function(){
		var vo = this.mp.getVolume();
		vo = parseInt(vo);
		vo--;
		
		this.mp.setVolume(vo);
		/*
		var realv = parseInt(vo*500/33);
		$(this.data.volumnObj).show();
		$("#volumn").css('width',realv);
		$("#volume_value").html(vo);
		//3秒钟之后隐藏
		setTimeout("hideVolumeBox()",3000);
		*/
	},
	playFromStart : function()
	{
		var mediaStr = this.toJson(this.data.tvUrl);
		this.mp.stop();
		this.mp.setSingleMedia(mediaStr);
		this.mp.playFromStart();
		//cronTime = setInterval("showTimeInfo()",1000);
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
	toJson : function(url)
	{
		return '[{mediaUrl:"' + url + '",mediaCode: "media0"}]';
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
	
	showPlayListBox : function()
	{
		$(this.data.listObj).show();
		this.data.mouseFlag = 'playlist';
	},
	
	exitPlayListBox : function()
	{
		$(this.data.listObj).hide();
		this.data.mouseFlag = 'play';
	},
	parseUrl : function(tmpUrlStr)
	{
		
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
	showProgramInfo : function(pid,pname)
	{
		$("#content #channel_focus .channel_id").html(pid);
		$("#content #channel_focus .channel_name").html(pname);
	},
	setIndex : function(i)
	{
		this.data.index = i;
	},
	getIndex : function()
	{
		return this.data.index;
	},
	setting : function()
	{
		$("#content").html('setting click').show();
		return false;
	},
	goByCode : function(k)
	{	
		var that = this;
		var tmpcode = that.data.code + String(k-48);
		$("#content #channel_focus .channel_id").html(String(k-48));
		
		that.data.code = tmpcode;
		$("#content #channel_focus .channel_name").html(tmpcode+','+tmpcode.length);
		if(tmpcode.length==4)
		/*{
			$("#content #channel_focus .channel_name").html(tmpcode+','+tmpcode.length);
			return false;
		}
		else*/
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
				var newIndex =  $(that.data.classObjs + ".o").attr('idx');
				//var newIndex = tmpcode.substr(0,1);		//可以直接这样获取
				that.data.indexArr[newIndex] = newIndexValue;
				$("#ch_bg").hide();		//分类隐藏
				$("#ch_detail").hide(); //节目列表隐藏
				that.data.mouseFlag = 'play';	//改为播放状态
				this.playFromStart();			
				that.showProgramInfo(tmpcode,programName);
			}
			else
			{
				//window.alert('error program code:'+tmpcode);
			}
			tmpcode = '';		//最后一定要清空数据 否则再按键没反应了
			that.data.code = '';
			$("#content #channel_focus .channel_name").html(tmpcode+','+tmpcode.length);
		}
		
		
	},
	event : function()
	{
		var that = this;
		$(document).bind('keydown',function(e){
			var keycode = e.keyCode || e.which;
			if(keycode<58 && keycode>47)
			{
				that.goByCode(keycode);
				return true;
			}
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
			case ROC_IRKEY_EXIT:
				//exitSwapBox();
				window.location.href = 'list.php';
				break;
			case ROC_IRKEY_VOLUME_UP:
				that.volumnUp();
				break;
			case ROC_IRKEY_VOLUME_DOWN:
				that.volumnDown();
				break;
			case 49 :
				that.showStatusDiv();
			break;
			case ROC_IRKEY_SET:
				that.setting();
				break;
			default :
					
					return;
			}
			
		});
	}
	
}

