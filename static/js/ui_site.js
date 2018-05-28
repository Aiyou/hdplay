/*
* 2013-10-10 
* website index script
* for stb
*/

var siteObj = {
	mask : {
		id : 'div_mask',
		show : function(msg){
			$('#'+this.id).html(msg).show();
		},
		init : function()
		{
			var tmpobj = $('#'+this.id);
			var w = tmpobj.width();
			var h = tmpobj.height();
			var l = parseInt((1280-w)/2);
			var t = parseInt((720-h)/2);
			$('#' + this.id).css({left:l,top:t}).html('&nbsp;');
			
		},
		hide : function(){
			$('#' + this.id).hide();
		}
	},
	data : {
		divId	 : '',
		index    : 0,		//该节目列表的索引ID 从0开始
		childIndex: 0,		//该节目的ID
		mouseFlag: 'tool',	//menu list  2个区 工具栏区 列表区 
		title	 : '网站首页',
		toolObjs : '',		//工具栏的所有项 对象
		listObjs : '',		//子菜单列表 对象
		menuObjs : '#channel_menu >ul >li',		//推荐列表 对象
		total	 : 0,		//总菜单数
		ajaxUrl  : '',		//获取天气的接口地址
		divImage : '#div_msg',
		
	},
	init : function(opts){
		if(opts != undefined)
		{
			this.data = $.extend(this.data,opts);
		}
		this.event();	//键盘监控
		this.initMenu(this.data.index);

	},
	initMenu : function(idx)
	{
		var menuIdArr = new Array('vod_content','sys_content');
		//$(this.data.menuObjs).css({'class':'','color':'#fff'});
		$(this.data.menuObjs).removeClass();
		
		$("#vod_content").hide();
		$("#sys_content").hide();
		/*
		for(var i=0;i<menuIdArr.length;i++)
		{
			if(i==idx)
			{
				//window.alert(i +','+idx);
			$('#' + menuIdArr[idx]).show();
			}
			else
			{
			//$('#' + menuIdArr[idx]).hide();
			}
		}
		*/
		$(this.data.menuObjs + ':eq(' + idx +')').addClass('focus');
		$('#' + menuIdArr[idx]).show();
		this.data.divId = menuIdArr[idx];
		this.setIndex(idx);		//初始化永远置为0
		this.data.mouseFlag = 'menu';
	},
	showBigImage : function(imgobj)
	{
		//将当前图片对象的图片放大显示 并定位合适
		var offset = imgobj.offset();
		var l,t,w,h;		//小图片的属性
		l = parseInt(offset.left);
		t = parseInt(offset.top);
		w = imgobj.width();
		h = imgobj.height();
		//$(this.data.divImage).css({width:0,height:0});
		$(this.data.divImage).html('<img src="' +  imgobj.attr('src') + '" surl="' + imgobj.attr('surl') +'" />').show();
		//得到大图片的属性
		var neww,newh,newl,newt;
		neww = $(this.data.divImage + ' img').width();
		newh = $(this.data.divImage + ' img').height();
		newl = l - parseInt((neww-w)/2);
		newt = t - parseInt((newh-h)/2);
		
		//定位放大层并显示
		$(this.data.divImage).css({left:newl,top:newt,width:neww,height:newh,border:'solid 3px #ffffff'});
		//window.alert('old left:' + l + '|new left:' + newl + '|old top:' + t + '|new top:' + newt + '|old width:' + w + '|new width:' + neww);
		if(neww==0)
		{
			//window.alert($(this.data.divImage).html());
		}
	},
	hideBigImage : function()
	{
		$(this.data.divImage).hide();
	},
	up : function(){
		if(this.data.mouseFlag=='menu')
		{
			return false;
		}
		else if(this.data.mouseFlag=='list')
		{
			var tmpIndex = this.getIndex();
			if(tmpIndex==0)
			{
				//第一个大菜单
				if(this.data.childIndex <4)
				{
					this.data.mouseFlag = 'menu';
					$(this.data.menuObjs + ':eq(' + tmpIndex +')').attr('class','focus');
					this.hideBigImage();
				}
				else 
				{
					this.data.childIndex -= 4;
					var tmpimgobj = $('#' + this.data.divId + ' div:eq(' + this.data.childIndex + ') img');
					this.showBigImage(tmpimgobj);
					this.data.mouseFlag = 'list';

				}
				
			}
			else if(tmpIndex==1)
			{
				//系统设置大菜单
				if(this.data.childIndex <3)
				{
					this.data.mouseFlag = 'menu';
					$(this.data.menuObjs + ':eq(' + tmpIndex +')').attr('class','focus');
					this.hideBigImage();
				}
				else 
				{
					var tmpchildindex = -1;
					if(this.data.childIndex == 4)
					{
						tmpchildindex = 2;
					}
					else if(this.data.childIndex == 3)
					{
						tmpchildindex = 1;
					}
					this.data.childIndex = tmpchildindex;
					var tmpimgobj = $('#' + this.data.divId + ' img:eq(' + this.data.childIndex + ')');
					this.showBigImage(tmpimgobj);
					this.data.mouseFlag = 'list';

				}
			}
		}
		
	},
	down : function(){
		if(this.data.mouseFlag=='menu')
		{
			//var tmpobj = $('#' + this.data.divId);
			var tmpchildindex = 0;
			this.data.childIndex = tmpchildindex;

			var tmpimgobj = $('#' + this.data.divId + ' img:eq(' + tmpchildindex + ')');
			
			this.showBigImage(tmpimgobj);
			this.data.mouseFlag = 'list';
			var tmpIndex = this.getIndex();
			$(this.data.menuObjs + ':eq(' + tmpIndex +')').attr('class','out');

		}
		else if(this.data.mouseFlag=='list')
		{
			var tmpIndex = this.getIndex();
			if(tmpIndex==0)
			{
				//第一个大菜单
				if(this.data.childIndex >3)
				{
					return false;
				}
				else 
				{
					this.data.childIndex += 4;
					var tmpimgobj = $('#' + this.data.divId + ' img:eq(' + this.data.childIndex + ')');
					this.showBigImage(tmpimgobj);
					this.data.mouseFlag = 'list';

				}
				
			}
			else if(tmpIndex==1)
			{
				//系统设置大菜单
				if(this.data.childIndex >2)
				{
					return false;
				}
				else 
				{
					var tmpchildindex = -1;
					if(this.data.childIndex == 2)
					{
						tmpchildindex = 4;
					}
					else if(this.data.childIndex == 1)
					{
						tmpchildindex = 3;
					}
					this.data.childIndex = tmpchildindex;
					var tmpimgobj = $('#' + this.data.divId + ' img:eq(' + this.data.childIndex + ')');
					this.showBigImage(tmpimgobj);
					this.data.mouseFlag = 'list';

				}
			}
		}
	},
	left : function()
	{
		
		if(this.data.mouseFlag=='list')
		{
			if((this.data.index==0 && this.data.childIndex %4==0)|| (this.data.index==3 && this.data.childIndex ==0))
			{
				return false;
			}
			else
			{
				if(this.data.index==3 && this.data.childIndex % 2==1)
				{
					this.data.childIndex = 0;
				}
				else
				{
					this.data.childIndex--;
				}
				var tmpimgobj = $('#' + this.data.divId + ' img:eq(' + this.data.childIndex + ')');
				this.showBigImage(tmpimgobj);
				this.data.mouseFlag = 'list';
			}
		}
		else if(this.data.mouseFlag=='menu')
		{
			if(this.getIndex()==0)
			{
				return false;
			}
			else
			{
				this.initMenu(0);
				//this.data.mouseFlag = 'list';
			}
		}
		
	},
	right : function(){
		if(this.data.mouseFlag=='list')	//节目列表中按右键
		{
			if((this.data.index==0 && this.data.childIndex %4==3)|| (this.data.index==3 && this.data.childIndex>0 && this.data.childIndex%2==0 ))
			//if(this.data.childIndex==$('#' + this.data.divId + ' img').size()-1)
			{
				return false;
			}
			else
			{
				this.data.childIndex++;
				var tmpimgobj = $('#' + this.data.divId + ' img:eq(' + this.data.childIndex + ')');
				this.showBigImage(tmpimgobj);
				this.data.mouseFlag = 'list';
			}
		}
		else if(this.data.mouseFlag=='menu')	//菜单栏按右键
		{
			if(this.getIndex()==$(this.data.menuObjs).size()-1)
			{
				return false;
			}
			else
			{
				this.initMenu(1);
			}
		}
		
		
	},
	select : function(){
		if(this.data.mouseFlag=='list')
		{
			var surl = $(this.data.divImage + ' img:first').attr('surl');
			//先得到节目地址
			if(surl == '' || surl=='#')
			{
				return false;
			}
			this.addCookie();
			//直接跳转
			window.location.href = surl;
		}
	},
	addCookie : function()
	{
		//该函数保存跳转之前的状态 写入COOKIE
		var tmphtml = this.data.index + '|' + this.data.childIndex;
		$.cookie('play_list',tmphtml);		//播放列表记录
	},
	setIndex : function(idx)
	{
		this.data.index = idx;
	},
	getIndex : function()
	{
		return this.data.index;
	},
	event : function(){
		var that = this;
		$("body").bind('keydown',function(e){
			var keycode = e.which || e.keyCode;
			if(keycode==ROC_IRKEY_LEFT)
			{
				that.left();
			}
			else if(keycode==ROC_IRKEY_RIGHT)
			{
				that.right();
			}
			else if(keycode==ROC_IRKEY_UP)
			{
				that.up();
			}
			else if(keycode==ROC_IRKEY_DOWN)
			{
				that.down();
			}
			else if(keycode==ROC_IRKEY_SELECT)
			{
				that.select();
			}
			
			else if(keycode==ROC_IRKEY_PAGE_UP)
			{
				that.prevPage();
			}
			else if(keycode==ROC_IRKEY_PAGE_DOWN)
			{
				that.nextPage();
			}
			else
			{
				//
			}
			
		});
	}
}
