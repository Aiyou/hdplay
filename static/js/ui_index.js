/*
* 2013-10-10 
* test script
* for stb
*/
//1秒后自动隐藏消息层

var isAll = false;
var isThisPage = false;
function autoHide()
{
	setTimeout("indexObj.mask.hide();",500);
}
var indexObj = {
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
		mouseFlag: 'area',	//area class year tool list page find 7个区 菜单区(地区 分类 年代) 导航区 列表区 跳转区 搜索区（上页 下页）
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
		var areaArr = [
		{id:0,name:'全部'},
		{id:1,name:'内地'},
		{id:2,name:'港台'},
		{id:3,name:'美国'},
		{id:4,name:'韩日'},
		{id:-1,name:'其他'}
		];
		
				
		
		var yearArr = [
		{id:0,name:'全部'},
		{id:2015,name:'2015'},
		{id:2014,name:'2014'},
		{id:2013,name:'2013'},
		{id:2012,name:'2012'},
		{id:2011,name:'2011'},
		{id:2010,name:'2010'},
		{id:2009,name:'2009'},
		{id:-1,name:'其他'}
		];
		
		//列表出地区
		var menuhtml = '';
		var areaTotal = areaArr.length;
		for(var i=0;i<areaTotal;i++)
		{
			menuhtml += '<li t="area" sid="' + areaArr[i].id + '">' + areaArr[i].name + '</li>' ;
		}
		$("#areaList").append(menuhtml);

		//列表出年代
		menuhtml = '';
		var totalYear = yearArr.length;
		for(var i=0;i<totalYear;i++)
		{
			menuhtml += '<li t="year" sid="' + yearArr[i].id + '">' + yearArr[i].name + '</li>' ;
		}
		$("#yearList").append(menuhtml);

		//动态获取子分类变量
		var classArr = this.data.classArr;
		
		var totalClass = classArr.length;
		//列表出类型
		//menuhtml = '<li t="class" sid="0">全部</li>';
		menuhtml = '';

		for(var i=0;i<totalClass;i++)
		{
			if(i<15)		//只输出最多9个分类 然后用其他代替 防止页面看不见
			{
				menuhtml += '<li t="class" sid="' + classArr[i].id + '">' + classArr[i].name + '</li>' ;
			}
		}
		//if(totalClass>10)
		//{
			//menuhtml += '<li t="class" sid="-1">其他</li>';
		//}
		$("#categoryList").append(menuhtml);
			
		//var classArr = this.data.classArr;
		

		

		this.menuFocus(this.data.idxStr);
		this.getList(this.data.idxStr,this.data.pageID);
		
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
		
		if(isAll)
		{
			$("#page").html(cur + '/' +(total+1) + ' 页');
			this.data.totalPage = total+1;
		}
		else {
			$("#page").html(cur + '/' +total + ' 页');
			this.data.totalPage = total;
		}
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
		/*
		var tmpobj;
		if(this.data.lastMouseFlag=='area')
		{
			tmpobj = $(this.data.areaObjs + ':eq(' + this.data.lastIndex + ')');
		}
		else if(this.data.lastMouseFlag=='class')
		{
			tmpobj = $(this.data.classObjs + ':eq(' + this.data.lastIndex + ')');
		}
		else if(this.data.lastMouseFlag=='year')
		{
			tmpobj = $(this.data.yearObjs + ':eq(' + this.data.lastIndex + ')');
		}
		else if(this.data.lastMouseFlag=='list')
		{
			tmpobj = $(this.data.listObjs + ':eq(' + this.data.lastIndex + ')');
		}
		else if(this.data.lastMouseFlag=='tool')
		{
			tmpobj = $(this.data.toolObjs + ':eq(' + this.data.lastIndex + ')');
		}
		else if(this.data.lastMouseFlag=='page')
		{
			tmpobj = $(this.data.pageObjs + ':eq(' + this.data.lastIndex + ')');
		}
		else
		{
			tmpobj = $(this.data.areaObjs + ':first');
		}
		tmpobj.removeClass('focus');
		*/
	},
	getLastVars : function()
	{
		//光标从右边回到左边时 应该到哪里的哪个项目上
		var tmpobj;
		if(this.data.lastMouseFlag=='area')
		{
			tmpobj = $(this.data.areaObjs + ':eq(' + this.data.lastIndex + ')');
		}
		else if(this.data.lastMouseFlag=='class')
		{
			tmpobj = $(this.data.classObjs + ':eq(' + this.data.lastIndex + ')');
		}
		else if(this.data.lastMouseFlag=='year')
		{
			tmpobj = $(this.data.yearObjs + ':eq(' + this.data.lastIndex + ')');
		}
		else if(this.data.lastMouseFlag=='list')
		{
			tmpobj = $(this.data.listObjs + ':eq(' + this.data.lastIndex + ')');
		}
		else if(this.data.lastMouseFlag=='tool')
		{
			tmpobj = $(this.data.toolObjs + ':eq(' + this.data.lastIndex + ')');
		}
		else if(this.data.lastMouseFlag=='page')
		{
			tmpobj = $(this.data.pageObjs + ':eq(' + this.data.lastIndex + ')');
		}
		else
		{
			tmpobj = $(this.data.areaObjs + ':first');
		}
		//tmpobj.addClass('focus');
		return tmpobj;
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
	getList : function(idx_str,pageid)
	{
		//idarr 三个分类的ID数组
		var that = this;
		var idarr = idx_str.split(',');
		//保存配置
		that.data.idxStr = idx_str;
		that.data.pageID = pageid;
		that.data.indexArea = idarr[0];
		that.data.indexClass = idarr[1];
		that.data.indexYear = idarr[2];
		var valueidarr = new Array(3);
		valueidarr[0] = $(this.data.areaObjs + ':eq(' + idarr[0] + ')').attr('sid');
		valueidarr[1] = $(this.data.classObjs + ':eq(' + idarr[1] + ')').attr('sid');
		valueidarr[2] = $(this.data.yearObjs + ':eq(' + idarr[2] + ')').attr('sid');
		var value_str = valueidarr[0] + ',' + valueidarr[1] + ',' + valueidarr[2];
		if(value_str == "0,0,0" && this.data.classID == 1)
			isAll = true;
		else isAll = false;
		var key = 'list_'  + that.data.classID + '_' + valueidarr[0] + '_' + valueidarr[1] + '_' + valueidarr[2] + '_' + that.data.pageID;

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
		
		var tmpopt = null;
		isThisPage = false;
		if(isAll)
		{
			if(pageid >= 2)
			{
				pageid--;
				tmpopt = {success:function(json){that.showData(json);that.setPage(json.totalpage,(pageid+1));}};
			}
			else{
				 tmpopt = {success:function(json){that.showData(vod_test);that.setPage(json.totalpage,pageid);}};
				 isThisPage = true;
			}
		}	
		else tmpopt = {success:function(json){that.showData(json);that.setPage(json.totalpage,pageid);}};
			
		var tmpurl = that.data.url + '?idx_str=' + value_str + '&p_id=' + this.data.classID + '&page_id=' + pageid +'&' + new Date().getTime();
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
					var url = $(this.data.listObjs + ':eq(' + this.data.index + ') img').attr('src');
					$('#div_box').html('<img width="162px" height="216px" style="margin-top:12px;margin-left:12px" src="' + url + '">');

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
		if(this.data.mouseFlag=='year')
		{
			var idx = this.getIndex();
			var total = $(this.data.classObjs).size();
			var nextIdx = (Math.ceil(total/3)-1)*3 + (idx%3);
			if(nextIdx>total-1)
			{
				nextIdx -=3;
			}
			idx -=3;
			$(this.data.yearObjs + ".focus").removeClass('focus');
			if(idx <0)
			{
				//那么直接移动到上一组
				$(this.data.classObjs + ':eq(' + nextIdx + ')').addClass('focus');
				this.data.mouseFlag = 'class';
				this.setIndex(nextIdx);
			}
			else
			{
				$(this.data.yearObjs + ':eq(' + idx + ')').addClass('focus');
				this.setIndex(idx);
			}
			
		}
		else if(this.data.mouseFlag=='class')
		{
			var idx = this.getIndex();
			var total = $(this.data.areaObjs).size();
			var nextIdx = (Math.ceil(total/3)-1)*3 + (idx%3);
			if(nextIdx>total-1)
			{
				nextIdx -=3;
			}
			
			idx -=3;
			$(this.data.classObjs + ".focus").removeClass('focus');
			if(idx <0)
			{
				//那么直接移动到上一组
				$(this.data.areaObjs + ':eq(' + nextIdx + ')').addClass('focus');
				this.data.mouseFlag = 'area';
				this.setIndex(nextIdx);
			}
			else
			{
				$(this.data.classObjs + ':eq(' + idx + ')').addClass('focus');
				this.setIndex(idx);
			}
			
		}
		else if(this.data.mouseFlag=='area')
		{
			
			var idx = this.getIndex();
			var total = $(this.data.classObjs).size();
			var nextIdx = parseInt(total/3)*3 + (idx % 3);
			idx -=3;
			if(idx <0)
			{
				return false;
			}
			else
			{
				$(this.data.areaObjs + ".focus").removeClass('focus');
				$(this.data.areaObjs + ':eq(' + idx + ')').addClass('focus');
				this.setIndex(idx);
			}
			
		}
		else if(this.data.mouseFlag=='tool')
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
		else if(this.data.mouseFlag=='page')
		{
			$(this.data.pageObjs + ":first").attr('class','page1');
			$(this.data.pageObjs + ":last").attr('class','page0');
			var tmpindex = 9;
			this.setIndex(tmpindex);	//更新索引
			this.data.mouseFlag = 'list';
			this.moveBox();
			
		}
	},
	down : function(){
		if(this.data.mouseFlag=='area')
		{
			
			//规则： 每次按下键 都 索引+3 如果 此时索引＞最大的索引 则移动光标到下一组的对应位置
			$(this.data.areaObjs + ".focus").removeClass('focus');
			var total = 0;
			var idx = this.getIndex();
			var nextIdx = idx % 3;
			idx +=3;
			total = $(this.data.areaObjs).size();
			if(idx >total-1)
			{
				//那么直接移动到下一组
				$(this.data.classObjs + ':eq(' + nextIdx + ')').addClass('focus');
				this.data.mouseFlag = 'class';
				this.setIndex(nextIdx);
			}
			else
			{
				$(this.data.areaObjs + ':eq(' + idx + ')').addClass('focus');
				this.setIndex(idx);
			}
		}
		else if(this.data.mouseFlag=='class')
		{
			$(this.data.classObjs + ".focus").removeClass('focus');
			var total = 0;
			var idx = this.getIndex();
			var nextIdx = idx%3;
			idx +=3;
			total = $(this.data.classObjs).size();
			if(idx >total-1)
			{
				//那么直接移动到下一组
				$(this.data.yearObjs + ':eq(' + nextIdx + ')').addClass('focus');
				this.data.mouseFlag = 'year';
				this.setIndex(nextIdx);
			}
			else
			{
				$(this.data.classObjs + ':eq(' + idx + ')').addClass('focus');
				this.setIndex(idx);
			}
			
		}
		else if(this.data.mouseFlag=='year')
		{
			$(this.data.yearObjs + ".focus").removeClass('focus');
			var total = 0;
			var idx = this.getIndex();
			var nextIdx = idx%3;
			idx +=3;
			total = $(this.data.yearObjs).size();
			if(idx >total-1)
			{
				//那么直接移动到下一组
				$(this.data.listObjs + ':eq(' + this.data.lastIndex + ')').attr('class','mi_focus');
				this.data.mouseFlag = 'list';
				this.setIndex(this.data.lastIndex);
				this.moveBox();
			}
			else
			{
				$(this.data.yearObjs + ':eq(' + idx + ')').addClass('focus');
				this.setIndex(idx);
			}
			
			
		}
		if(this.data.mouseFlag=='page')
		{
			return false;	//焦点在分页栏上 按下键什么都不做
		}
		else if(this.data.mouseFlag=='list')
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
				$('#div_box').hide();
				var tmpindex = 0;
				var tmpobj = $(this.data.pageObjs + ":first");
				
				tmpobj.attr('class','page1_on');
				this.setIndex(tmpindex);	//更新索引
				this.data.mouseFlag = 'page';
				
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
		if(this.data.mouseFlag=='area')
		{
			if(this.getIndex() % 3==0)
			{
				return false;
			}
			else
			{
				$(this.data.areaObjs + ".focus").removeClass('focus');
				var tmpindex = this.getIndex();
				tmpindex--;
				var tmpobj = $(this.data.areaObjs + ":eq("+ tmpindex +")");
				tmpobj.addClass('focus');
				this.setIndex(tmpindex);	//更新索引
				
			}
		}
		else if(this.data.mouseFlag=='class')
		{
			if(this.getIndex() % 3==0)
			{
				return false;
			}
			else
			{
				$(this.data.classObjs + ".focus").removeClass('focus');
				var tmpindex = this.getIndex();
				tmpindex--;
				var tmpobj = $(this.data.classObjs + ":eq("+ tmpindex +")");
				tmpobj.addClass('focus');
				this.setIndex(tmpindex);	//更新索引
				
			}
		}
		else if(this.data.mouseFlag=='year')
		{
			if(this.getIndex() % 3==0)
			{
				return false;
			}
			else
			{
				$(this.data.yearObjs + ".focus").removeClass('focus');
				var tmpindex = this.getIndex();
				tmpindex--;
				var tmpobj = $(this.data.yearObjs + ":eq("+ tmpindex +")");
				tmpobj.addClass('focus');
				this.setIndex(tmpindex);	//更新索引
				
			}
		}
		else if(this.data.mouseFlag=='list')
		{	//在播放列表光标处在第一列 再向左移动的时候 要回到 从左边去到右边时候的状态
			if(this.getIndex() % 5==0)
			{
				$('#div_box').hide();
				//$(this.data.listObjs + ".mi_focus").attr('class','mi_border');
				var oldobj = this.getLastVars();		//将光标恢复到原来的情况 选中状态
				//以下两行一定要执行
				this.setIndex(this.data.lastIndex);
				this.data.mouseFlag = this.data.lastMouseFlag;
				
				this.setLastVars('list',this.getIndex());		//保存新的旧值 方便返回到右边
				oldobj.addClass('focus');
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
				//回到菜单栏上
				$(this.data.toolObjs + ".mi_search_on").attr('class','mi_search');
				var tmpindex = 0;
				this.setIndex(tmpindex);	//定位到第一个菜单
				this.data.mouseFlag = 'area';
				$(this.data.areaObjs + ":eq(0)").addClass('focus');
				
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
		else if(this.data.mouseFlag=='area')
		{
			var tmpindex = this.getIndex();
			var tmptotal = $(this.data.areaObjs).size();
			if(tmpindex == tmptotal-1 || (tmpindex%3==2))
			{
				//直接定位光标到右边列表区 并记录旧的索引和区域值 方便光标移回来的时候初始化
				this.setIndex(0);
				this.data.mouseFlag = 'list';
				$(this.data.areaObjs + '.focus').removeClass('focus');
				this.setLastVars('area',tmpindex);
				this.moveBox();
			}
			else
			{
				tmpindex++;
				$(this.data.areaObjs + ".focus").removeClass('focus');
				var tmpobj = $(this.data.areaObjs + ":eq("+ tmpindex +")");
				tmpobj.addClass('focus');
				this.setIndex(tmpindex);	//更新索引
			}
		}
		else if(this.data.mouseFlag=='class')
		{
			var tmpindex = this.getIndex();
			var tmptotal = $(this.data.classObjs).size();
			if(tmpindex == tmptotal-1 || (tmpindex%3==2))
			{
				//直接定位光标到右边列表区 并记录旧的索引和区域值 方便光标移回来的时候初始化
				this.setIndex(0);
				this.data.mouseFlag = 'list';
				$(this.data.classObjs + '.focus').removeClass('focus');
				this.setLastVars('class',tmpindex);
				this.moveBox();
			}
			else
			{
				tmpindex++;
				$(this.data.classObjs + ".focus").removeClass('focus');
				var tmpobj = $(this.data.classObjs + ":eq("+ tmpindex +")");
				tmpobj.addClass('focus');
				this.setIndex(tmpindex);	//更新索引
			}
		}
		else if(this.data.mouseFlag=='year')
		{
			var tmpindex = this.getIndex();
			var tmptotal = $(this.data.yearObjs).size();
			if(tmpindex == tmptotal-1 || (tmpindex%3==2))
			{
				//直接定位光标到右边列表区 并记录旧的索引和区域值 方便光标移回来的时候初始化
				this.setIndex(0);
				this.data.mouseFlag = 'list';
				$(this.data.yearObjs + '.focus').removeClass('focus');
				this.setLastVars('year',tmpindex);
				this.moveBox();
			}
			else
			{
				tmpindex++;
				$(this.data.yearObjs + ".focus").removeClass('focus');
				var tmpobj = $(this.data.yearObjs + ":eq("+ tmpindex +")");
				tmpobj.addClass('focus');
				this.setIndex(tmpindex);	//更新索引
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
		//先获取该属性菜单的 type和sid
		if(this.data.mouseFlag=='area')
		{
			$(this.data.areaObjs + '.curfocus').removeClass();
			var tmpobj = $(this.data.areaObjs + ':eq('+ this.data.index +')');
			tmpobj.attr('class','curfocus');
			var tmpidarr = new Array(3);
			tmpidarr[0] = this.data.index;
			tmpidarr[1] = $(this.data.classObjs).index($(this.data.classObjs + '.curfocus'));
			tmpidarr[2] = $(this.data.yearObjs).index($(this.data.yearObjs + '.curfocus'));
			var tmpidxstr = tmpidarr[0] + ',' + tmpidarr[1] +','+ tmpidarr[2];
			this.getList(tmpidxstr,1);
			//this.data.mouseFlag = 'list';
			//this.setIndex(0);
			//this.moveBox();
		}
		else if(this.data.mouseFlag=='class')
		{
			$(this.data.classObjs + '.curfocus').removeClass();
			var tmpobj = $(this.data.classObjs + ':eq('+ this.data.index +')');
			tmpobj.attr('class','curfocus');
			var tmpidarr = new Array(3);
			tmpidarr[0] = $(this.data.areaObjs).index($(this.data.areaObjs + '.curfocus'));
			tmpidarr[1] = this.data.index;
			tmpidarr[2] = $(this.data.yearObjs).index($(this.data.yearObjs + '.curfocus'));
			var tmpidxstr = tmpidarr[0] + ',' + tmpidarr[1] +','+ tmpidarr[2];
			this.getList(tmpidxstr,1);
			//this.data.mouseFlag = 'list';
			//this.setIndex(0);
			//this.moveBox();
		}
		else if(this.data.mouseFlag=='year')
		{
			$(this.data.yearObjs + '.curfocus').removeClass();
			var tmpobj = $(this.data.yearObjs + ':eq('+ this.data.index +')');
			tmpobj.attr('class','curfocus');
			var tmpidarr = new Array(3);
			tmpidarr[0] = $(this.data.areaObjs).index($(this.data.areaObjs + '.curfocus'));
			tmpidarr[1] = $(this.data.classObjs).index($(this.data.classObjs + '.curfocus'));
			tmpidarr[2] = this.data.index;
			var tmpidxstr = tmpidarr[0] + ',' + tmpidarr[1] +','+ tmpidarr[2];
			this.getList(tmpidxstr,1);
			//this.data.mouseFlag = 'list';
			//this.setIndex(0);
			//this.moveBox();
		}
		else if(this.data.mouseFlag=='page')
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
			if(this.data.classID == 1 && isAll && isThisPage)
			{
				window.location.href = "video_info.html" + '?id=' + this.data.index+"&isTest=1";
				
			}
			else {
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
				window.location.href = this.data.gourl + '?id=' + sid;
			}
		}
		
	},
	back : function(){
		window.location.href = '../index/index.html';
	},
	prevPage : function()
	{
		//上一页
		var pageid = this.data.pageID;
		if(pageid==1)
		{
			return false;
		}
		pageid--;
		this.getList(this.data.idxStr,pageid);
	},
	nextPage : function()
	{
		//上一页
		var pageid = this.data.pageID;
		if(pageid>=this.data.totalPage)
		{
			return false;
		}
		pageid++;
		this.getList(this.data.idxStr,pageid);
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
			else if(keycode==ROC_IRKEY_PAGE_UP)
			{
				that.prevPage();
			}
			else if(keycode==ROC_IRKEY_PAGE_DOWN)
			{
				that.nextPage();
			}
			
		});
	}
}
