/*
* 2013-10-10 
* test script
* for stb
*/
//1秒后自动隐藏消息层
function autoHide()
{
	setTimeout("recommendObj.mask.hide();",500);
}
var recommendObj = {
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
			$('#' + this.id).css({left:l,top:t}).html('&nbsp;').hide();
			
		},
		hide : function(){
			$('#' + this.id).hide();
		}
	},
	data : {
		index    : 0,		//当前区域选中的索引
		indexArea : 0,		//当前地区的索引
		indexClass: 0,		//当前子分类的索引
		indexYear : 0,		//当前年份的索引
		idxStr   : '0,0,0',	//分类索引组合串  格式： 地区,子分类,年代
		classID  : 4,		//当前的大分类 默认为电影 4
		classArr : null,	//地区分类数组
		pageID   : 0,		//当前显示的第几页
		totalPage: 0,
		mouseFlag: 'list',	//tool list page find 7个区 菜单区(地区 分类 年代) 导航区 列表区 跳转区 搜索区（上页 下页）
		title	 : 'stb js',
		url		 : '',		//获取视频列表的接口地址 参数 分类ID:cid 页码ID:pid
		gourl	 : '',		//选定一个节目后按选择键之后的跳转地址 参数：id
		menuObjs : '',		//菜单的所有项 对象 比方： ul#obj_menu li 那么 表示为 '#obj_menu > li'
		areaObjs : '',		//地区对象
		classObjs: '',		//小分类对象
		yearObjs : '',		//年份对象
		toolObjs : '',		//工具栏的所有项 对象
		listObjs : '',		//视频数据列表的所有项 对象
		pageObjs : '',		//换页栏的所有项 对象
		cacheObj : '',		//缓存当前分类当前页JSON数据的容器
		lastIndex: 0,
		lastMouseFlag: 'area',
	},
	init : function(opts){
		if(opts != undefined)
		{
			this.data = $.extend(this.data,opts);
		}
		this.mask.init();
		this.initMenu();
		this.event();	//键盘监控
	},
	initMenu : function(){
		this.getList(this.data.pageID);
	},
	menuFocus : function(idxstr)
	{
		var idx_arr = idxstr.split(',');
		$(this.data.menuObjs + ".curfocus").removeClass();
		$(this.data.areaObjs + ":eq(" + idx_arr[0] + ")").addClass('curfocus');
		$(this.data.classObjs + ":eq(" + idx_arr[1] + ")").addClass('curfocus');
		$(this.data.yearObjs + ":eq(" + idx_arr[2] + ")").addClass('curfocus');
		//$(this.data.areaObjs + ":first").addClass('focus');
		//如果默认选择第一个 则 用上一行
		$(this.data.areaObjs + ":eq(" + idx_arr[0] + ")").addClass('curfocus');
		this.setIndex(idx_arr[0]);
	},
	setPage : function(total,cur)
	{
		$("#page").html(cur + '/' +total + ' 页');
		this.data.totalPage = total;
	},
	setCurrentVars : function(flag,idx)
	{
		this.data.mouseFlag = flag;
		this.setIndex(idx);
	},
	setLastVars : function(flag,idx)
	{
		//保存离开左边时的区域和索引值
		this.data.lastMouseFlag = flag;
		this.data.lastIndex = idx;
	},
	setNewDownIndex : function(flag,idx)
	{
		var total = 0;
		var nextIdx = idx%3;
		idx +=3;
		$("#nav li.focus").removeClass('focus');
		if(flag=='area')
		{
			total = $(this.data.areaObjs).size();
			if(idx >total-1)
			{
				//那么直接移动到下一组
				$(this.data.classObjs + ':eq(' + nextIdx + ')').addClass('focus');
			}
			else
			{
				$(this.data.areaObjs + ':eq(' + idx + ')').addClass('focus');
			}
		}
		else if(flag=='class')
		{
			total = $(this.data.classObjs).size();
			if(idx >total-1)
			{
				//那么直接移动到下一组
				$(this.data.yearObjs + ':eq(' + nextIdx + ')').addClass('focus');
			}
			else
			{
				$(this.data.classObjs + ':eq(' + idx + ')').addClass('focus');
			}
		}
		else if(flag=='year')
		{
			total = $(this.data.yearObjs).size();
			if(idx >total-1)
			{
				//那么直接移动到下一组
				$(this.data.listObjs + ':eq(' + this.data.lastIndex + ')').attr('class','mi_focus');
			}
			else
			{
				$(this.data.yearObjs + ':eq(' + idx + ')').addClass('focus');
			}
		}
	},
	moveBox : function()
	{
		//加亮显示选中的节目：仅对右边的节目列表有效
		//$(this.data.listObjs).attr('class','mi_border');
		//$(this.data.listObjs + ':eq(' + this.data.index + ')').attr('class','mi_focus');
		//先注销上两行 如果用移动框达不到效果 则放开注销 310,100
		var l,t;
		l = (this.data.index %5) * 184+310;
		t = 100;
		if(this.data.index>4)
		{
			t += 270;
		}
		var url = $(this.data.listObjs + ':eq(' + this.data.index + ') img').attr('src');
		$('#div_box').css({left:l,top:t}).show().html('<img width="162px" height="216px" style="margin-top:12px;margin-left:12px" src="' + url + '">');
	},
	getList : function(pageid)
	{
		var that = this;
		this.data.pageID = pageid;

		this.mask.show('数据加载中...');
		//判断是否有缓存
		/*
		var cacheListData = that.getCacheData(key);
		if(cacheListData)
		{
			that.showData(cacheListData);
			return true;
		}
		*/
		//无缓存开始请求数据		
		var tmpurl = that.data.url + '?p_id=' + that.data.classID + '&page_id=' + pageid +'&' + new Date().getTime();
		var tmpopt = {success:function(json){that.showData(json);that.setPage(json.totalpage,pageid);}};
		Ajax.request(tmpurl,tmpopt);
		return true;
		
	},
	setCacheData : function(k,v){
		$(this.data.cacheObj).data('list_' + k,v);
	},
	getCacheData : function(k){
		var cache_data = $(this.data.cacheObj).data('list_' + k);
		if(cache_data==undefined)
		{
			return '';
		}
		return cache_data;
	},
	showData : function(json)
	{
		if(json.code==0)
		{
			//解析得到的JSON字串 并显示
			if(json.total >0)
			{
				$(this.data.listObjs).html('');		//先清空
				var data_arr = json.data;
				var tmptotal = data_arr.length;
				var tmphtml = '';
				for(var j=0;j<tmptotal;j++)
				{
					tmphtml = '<img src="' + data_arr[j].v_pic + '" sid="' + data_arr[j].id + '"><br /><span id="text1">' + data_arr[j].v_name + '</span>';
					//tmphtml = '<img width="120px" src="common/images/' + (j+1) + '.jpg" sid="' + data_arr[j].id + '"><br /><span>' + data_arr[j].v_name + '</span>';
					$(this.data.listObjs + ":eq(" + j + ")").html(tmphtml);
				}
				this.mask.show('数据加载完毕...');
				//自动保持焦点层的图片
				if(this.data.mouseFlag=='list')
				{
					//var url = $(this.data.listObjs + ':eq(' + this.data.index + ') img').attr('src');
					//$('#div_box').html('<img width="162px" height="216px" style="margin-top:12px;margin-left:12px" src="' + url + '">');
					this.moveBox();
				}
			}
			else
			{
				//表示无数据返回 说明在最后一页
				this.mask.show('无数据...');
				$(this.data.listObjs).html('<img src="images/nopic_index.jpg"><br /><span>&nbsp;</span>');
			}
		}
		else
		{
			this.mask.show('节目列表获取失败，请稍候再试');
		}
		autoHide();
		//this.data.mouseFlag = 'list';		//初始化光标类型
		//this.moveBox();
	},
	addCookie : function()
	{
		//该函数保存跳转之前的状态 写入COOKIE
		var str = this.data.classID + '|' + this.data.idxStr + '|' + this.data.pageID + '|' + this.getIndex();
		$.cookie('letv_list',str);
	},
	up : function(){
		if(this.data.mouseFlag=='tool')
		{
			return false;	//焦点在菜单栏上 按上键什么都不做
		}
		else if(this.data.mouseFlag=='list')
		{
			if(this.getIndex()>4)
			{
				var tmpindex = this.getIndex();
				tmpindex = tmpindex -5;
				this.setIndex(tmpindex);	//更新索引
				this.moveBox();
				
			}
			else
			{
				$('#div_box').hide();
				//$(this.data.listObjs + ".mi_focus").attr('class','mi_border');
				var tmpindex = 0;
				var tmpobj = $(this.data.toolObjs + ":first");
				tmpobj.attr('class','mi_search_on');
				this.setIndex(tmpindex);	//更新索引
				this.data.mouseFlag = 'tool';
				
			}
		}
	},
	down : function(){
		if(this.data.mouseFlag=='list')
		{
			
			if(this.getIndex()<5)
			{
				var tmpindex = this.getIndex();
				tmpindex = tmpindex +5;
				this.setIndex(tmpindex);	//更新索引
				this.moveBox();
				
			}
			else
			{
				//$(this.data.listObjs + ".mi_focus").attr('class','mi_border');
				return false;
				
			}
		}
		else if(this.data.mouseFlag=='tool')
		{
			var oldobj = $(this.data.toolObjs + ":eq(" + this.getIndex() + ")");
			var oldclass = oldobj.attr('class');
			oldobj.attr('class',oldclass.replace('_on',''));
			var tmpindex = 0;
			var tmpobj = $(this.data.listObjs + ":first");
			tmpobj.attr('class','mi_focus');
			this.setIndex(tmpindex);	//更新索引
			this.data.mouseFlag = 'list';
			//this.moveBox();
			
		}
		return true;
	},
	left : function()
	{
		
		if(this.data.mouseFlag=='list')
		{	//在播放列表光标处在第一列 再向左移动的时候 要回到 从左边去到右边时候的状态
			if(this.getIndex() % 5==0)
			{
				return false;
				/*直接返回不执行
				$('#div_box').hide();
				//$(this.data.listObjs + ".mi_focus").attr('class','mi_border');
				var oldobj = this.getLastVars();		//将光标恢复到原来的情况 选中状态
				//以下两行一定要执行
				this.setIndex(this.data.lastIndex);
				this.data.mouseFlag = this.data.lastMouseFlag;
				
				this.setLastVars('list',this.getIndex());		//保存新的旧值 方便返回到右边
				oldobj.addClass('focus');
				*/
			}
			else
			{
				//$(this.data.listObjs + ".o").removeClass().css('background','');
				var tmpindex = this.getIndex();
				tmpindex--;
				var tmpobj = $(this.data.listObjs + ":eq("+ tmpindex +")");
				tmpobj.addClass('o');
				this.setIndex(tmpindex);	//更新索引
				this.moveBox();
				
			}
		}
		else if(this.data.mouseFlag=='tool')
		{
			if(this.getIndex()==0)
			{
				return false;
				//啥也不执行
			}
			else
			{
				var tmpindex = this.getIndex() - 1;
				var tmpobj = $(this.data.toolObjs + ":eq(" + tmpindex + ")");
				$(this.data.toolObjs + ".mi_playlist_on").attr('class','mi_playlist');
				tmpobj.attr('class','mi_search_on');
				this.setIndex(tmpindex);
				
			}
		}
		else if(this.data.mouseFlag=='page')
		{
			if(this.getIndex()==0)
			{
				return false;
			}
			else
			{
				var tmpindex = 0;
				var tmpobj = $(this.data.pageObjs + ":eq(" + tmpindex + ")");
				$(this.data.pageObjs + ":last").attr('class','page0');
				tmpobj.attr('class','page1_on');
				this.setIndex(tmpindex);
			}
		}
		return true;
	},
	right : function(){

		if(this.data.mouseFlag=='tool')
		{
			if(this.getIndex()==$(this.data.toolObjs).size()-1)
			{
				return false;
			}
			else
			{
				var tmpindex = this.getIndex() + 1;
				var tmpobj = $(this.data.toolObjs + ":eq(" + tmpindex + ")");
				$(this.data.toolObjs + ".mi_search_on").attr('class','mi_search');
				tmpobj.attr('class','mi_playlist_on');
				this.setIndex(tmpindex);
				
			}
		}
		else if(this.data.mouseFlag=='list')	//节目列表中按右键
		{
			if(this.getIndex()==9)
			{
				return false;
			}
			else
			{
				var tmpindex = this.getIndex();
				tmpindex++;
				this.setIndex(tmpindex);	//更新索引
				this.data.mouseFlag = 'list';
				this.moveBox();
				
			}
		}
		else if(this.data.mouseFlag=='page')
		{
			if(this.getIndex()==$(this.data.pageObjs).size()-1)
			{
				return false;
			}
			else
			{
				var tmpindex = 2;
				var tmpobj = $(this.data.pageObjs + ":eq(" + tmpindex + ")");
				$(this.data.pageObjs + ":first").attr('class','page1');
				tmpobj.attr('class','page0_on');
				this.setIndex(tmpindex);
				
			}
		}
		
	},
	select : function(){
		if(this.data.mouseFlag=='page')
		{
			var tmpobj = $(this.data.pageObjs + ":eq(" + this.data.index + ")");
			var flag = tmpobj.attr('sid');
			var pageid = this.data.pageID;
			if(pageid==1 && flag=='up')
			{
				return false;
			}
			else if(pageid==this.data.totalPage && flag=='down')
			{
				return false;
			}
			if(flag=='up')
			{
				pageid--;
			}
			else if(flag=='down')
			{
				pageid++;
			}
			var tmpindex = this.data.index;
			//this.data.index = 0;
			//var tmp_class = $(this.data.pageObjs + ':eq('+ tmpindex +')').attr('class');
			//$(this.data.pageObjs + ':eq('+ tmpindex +')').attr('class',tmp_class.replace('_on',''))
			this.getList(this.data.idxStr,pageid);
			
		}
		else if(this.data.mouseFlag=='tool')
		{
			//获取索引
			var idxid = this.getIndex();
			if(parseInt(idxid)==0)
			{
				//进入搜索页
				show_find_page();
			}
			else if(parseInt(idxid)==1)
			{
				//进入播放记录
				show_history();
			}
		}
		else if(this.data.mouseFlag=='list')
		{
			//先得到节目ID
			var sid = $(this.data.listObjs +':eq('+ this.data.index + ") img").attr('sid');;
			if(typeof sid=='undefined')
			{
				this.mask.show('不能点播');
				autoHide();
				return false;
			}
			//var sid = tmpobj.attr('sid');
			this.addCookie();		//先保存状态 信息页返回用
			window.location.href = this.data.gourl + '?page=recommend&id=' + sid;
		}
		
	},
	back : function(){
		window.location.href = '../index/index.html';
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
		$(document).bind('keydown',function(e){
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
			else if(keycode==ROC_IRKEY_BACK)
			{
				that.back();
			}
			
			
		});
	}
}
