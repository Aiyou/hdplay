var pageFlag = 'info';	//info/play  表示信息页和播放页

function autoHide()
{
	setTimeout("infoObj.mask.hide();",500);
}
/*
* 2013-10-10 
* test script
* for stb
*/

var infoObj = {
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
		index    : 0,		//该节目列表的索引ID 从0开始
		childIndex:0,
		page	  :'',
		classID  : 0,		//当前分类ID
		id		 : 0,		//该节目的ID
		mouseFlag: 'tool',	//tool list  2个区 工具栏区 列表区 
		title	 : 'stb js',
		url		 : '',		//获取视频列表的接口地址 参数 分类ID:cid 页码ID:pid
		toolObjs : '',		//工具栏的所有项 对象
		listObjs : '',		//剧集列表 对象
		tujiObjs : '',		//推荐列表 对象
		cacheObj : '',		//缓存当前分类当前页JSON数据的容器
		pageCount: 60,		//分页选项卡 显示的节目分集数 可以设为30
		pageID	 : 1,		//当前选项卡的页数 默认为1==前60集
		total	 : 0,		//总集数
		totalPage: 1,
		baseLeft : 75,
		page	 : ''
	},
	init : function(opts){
		if(opts != undefined)
		{
			this.data = $.extend(this.data,opts);
		}
		this.mask.init();
		this.event();	//键盘监控
		//判断是否有剧集列表 有就默认选定初始化的集数
		//$.cookie('play_list',null);		//先清空原有的播放列表COOKIE
		var that = this;
		var tmpurl = null;
		if(isTest)
			tmpurl = MY_API_ADDR + 'get_vod_info.php?id=' + vod_test.data[this.data.id].id +'&' + new Date().getTime();
		else tmpurl = MY_API_ADDR + 'get_vod_info.php?id=' + this.data.id +'&' + new Date().getTime();
		var tmpopt = {success:function(json){that.showData(json);that.init_tv(that.data.childIndex);}};
		Ajax.request(tmpurl,tmpopt);

	},
	showData : function(json)
	{
		var that = this;
		if(isTest)
		{
			o('v_category').innerHTML = vod_test.data[this.data.id].v_category;
			o('programName').innerHTML = vod_test.data[this.data.id].v_name;
			o('actors').innerHTML = vod_test.data[this.data.id].v_actor;
			o('info').innerHTML = vod_test.data[this.data.id].v_info;
			o('programPic').src = vod_test.data[this.data.id].v_pic;	
		}
		else
		{
			o('v_category').innerHTML = json.category;
			o('programName').innerHTML = json.title;
			o('actors').innerHTML = json.actor;
			o('info').innerHTML = json.desc;
			o('programPic').src = json.pic;
		}
		
		that.data.total = json.totalTV;
		that.data.classID = json.classID;
		if(that.data.index>that.data.total-1)
		{
			that.data.index = that.data.total-1;
		}
		that.data.totalPage = Math.ceil(that.data.total/that.data.pageCount);
		//获取剧集列表信息
		var tmphtml = '';
		for(var i=0;i<json.url.length;i++)
		{
			tmphtml += '<li sid="' + json.url[i].v_mmsid + '">' + json.url[i].v_tvset +'</li>';
		}
		o('itemList').innerHTML = tmphtml;
		//获取推荐剧集列表信息
		tmphtml = '';
		for(var i=0;i<json.hot.length;i++)
		{
			tmphtml += '<td class="mi_border" sid="' + json.hot[i].id + '"><img src="' + json.hot[i].v_pic +'"></td>';
		}
		$(".content2 tr:first").append(tmphtml);
		
	},
	init_tv : function(idx)
	{
		$(this.data.toolObjs + ':first').css('background','url(images/mi_icon.png) -154px -85px');
		var size = $(this.data.listObjs).size();
		//将选中项放到真实LI中 注意不是第一页的情况 根据索引得到 页数ID
		var tmppageid = Math.ceil((idx+1)/this.data.pageCount);
		$(this.data.listObjs).hide();
		var idx_from = (tmppageid-1)* this.data.pageCount;
		var idx_to = tmppageid* this.data.pageCount;
		if(idx_to>this.data.total)
		{
			idx_to = this.data.total;
		}
		$(this.data.listObjs).each(function(i){
			if(i>=idx_from && i<idx_to)
			{
				$(this).show();
			}
		});
		this.data.pageID = tmppageid;
		this.moveBox(idx);
		if(idx==0)
		{
			if(this.data.mouseFlag == 'tool'){
			this.setIndex(0);		//初始化永远置为0

			}else if(this.data.mouseFlag == 'list'){
			this.setIndex(1);
			this.data.childIndex = 0;
			this.moveBox(idx);
			}
		}
		else
		{
		this.setIndex(1);		//初始化永远置为0
		this.data.mouseFlag = 'list';
		this.data.childIndex = idx;
		$('#hot_rec').html('剧集列表');
		showDiv('div_box');
		this.moveBox(idx);
		//打开剧集列表层
		$("#moreItem").css('top','435px').show();
		$(this.data.toolObjs + ':eq(0)').css('background','');
		$(this.data.toolObjs + ':eq(1)').css('background','');
		}
	},
	moveBox : function(selectIndex)
	{
		//把选中框的层移动到指定索引的坐标 512+53
		var realIndex = selectIndex % this.data.pageCount;
		var lineIndex = realIndex%10;
		var extrawidth = (lineIndex==0)?0:(lineIndex-1)*2+1;
		var left = lineIndex * 110 + extrawidth + this.data.baseLeft;
		var top = 525;
		if(realIndex>9)
		{
			top = 571;	//焦点在下一行
		}
		o("div_box").style.left = left + 'px';
		o("div_box").style.top = top + 'px';
		if(this.getIndex()==1){
			showDiv('div_box');
		}
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
	play_video : function()
	{
		this.mask.show('播放视频');
	},
	up : function(){
		if(this.data.mouseFlag=='list')
		{
			//分两种情况：1.焦点在第一页的第一行 则焦点直接返回到选集按钮 2.否则上移一行(需判断是否要跳到上一页)
			var tmpIndex = this.data.childIndex;
			if(tmpIndex<10)
			{
				var tmpBigIndex = 1;
				var tmpobj = $(this.data.toolObjs + ":eq(1)");
				tmpobj.css('background','url(images/mi_icon.png) -154px -85px');
				this.setIndex(tmpBigIndex);	//更新索引
				this.data.mouseFlag = 'tool';
				$("#moreItem").css('display','none');
				hideDiv('div_box');
				$('#hot_rec').html('热点推荐');
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
					}
					//开始定位到新位置
					this.data.childIndex = tmpIndex;	//更新索引
					this.moveBox(tmpIndex);
				}
				else
				{
					//开始定位到新位置
					this.data.childIndex = tmpIndex;	//更新索引
					this.moveBox(tmpIndex);
				}
			}
		}
		else if(this.data.mouseFlag=='recommend')
		{
			$(this.data.tujiObjs + ".mi_focus").attr('class','mi_border');
			tmpindex = 0;
			var tmpobj = $(this.data.toolObjs + ":first");
			tmpobj.css('background','url(images/mi_icon.png) -154px -85px');
			this.setIndex(tmpindex);	//更新索引
			this.data.mouseFlag = 'tool';
		}
		
	},
	down : function(){
		if(this.data.mouseFlag=='tool')
		{
			$(this.data.toolObjs).css('background','');
			var tmpIndex = 0;
			var tmpobj = $(this.data.tujiObjs + ":first");
			tmpobj.attr('class','mi_focus');
			this.data.childIndex = tmpIndex;	//更新索引
			this.data.mouseFlag = 'recommend'
		}
		else if(this.data.mouseFlag=='list')
		{
			//向下时要可以切换集数
			var tmpIndex = this.data.childIndex;
			tmpIndex +=10;
			var idx_to = this.data.pageID * this.data.pageCount;
			if(idx_to>this.data.total)
			{
				idx_to = this.data.total;
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
				//如果翻到下一页的索引大于最大索引 则定位到当前页第一个
				if(tmpIndex>this.data.total-1)
				{
					tmpIndex = (this.data.pageID-1) * this.data.pageCount;
				}
				//开始定位到新位置
				this.data.childIndex = tmpIndex;	//更新索引
				this.moveBox(tmpIndex);
			}
			else
			{
				
				//开始定位到新位置
				this.data.childIndex = tmpIndex;	//更新索引
				this.moveBox(tmpIndex);
			}
		}
	},
	left : function()
	{
		
		if(this.data.mouseFlag=='list')
		{
			var tmpIndex = this.data.childIndex;
			if(tmpIndex==0)
			{
				return false;
			}
			else
			{
				if(tmpIndex == (this.data.pageID-1)*this.data.pageCount && this.data.pageID>1)
				{
					this.prevPage();
					return false;
				}
				tmpIndex--;
				this.moveBox(tmpIndex);
				this.data.childIndex = tmpIndex;	//更新索引
			}
		}
		else if(this.data.mouseFlag=='tool')
		{
			var tmpIndex = this.getIndex();
			if(tmpIndex==0)
			{
				return false;
			}
			else
			{
				$(this.data.toolObjs).css('background','');
				tmpIndex--;
				var tmpobj = $(this.data.toolObjs + ":eq("+ tmpIndex +")");
				tmpobj.css('background','url(images/mi_icon.png) -154px -85px');
				this.setIndex(tmpIndex);	//更新索引
				
			}
		}
		else if(this.data.mouseFlag=='recommend')
		{
			var tmpIndex = this.data.childIndex;
			if(tmpIndex==0)
			{
				return false;
			}
			else
			{
				$(this.data.tujiObjs + ".mi_focus").attr('class','mi_border');
				tmpIndex--;
				var tmpobj = $(this.data.tujiObjs + ":eq("+ tmpIndex +")");
				tmpobj.attr('class','mi_focus');
				this.data.childIndex = tmpIndex;	//更新索引
			}
		}
		
	},
	right : function(){
		if(this.data.mouseFlag=='tool')
		{
			var tmpIndex = this.getIndex();
			if(tmpIndex==$(this.data.toolObjs).size()-1)
			{
				return false;
			}
			else
			{
				$(this.data.toolObjs).css('background','');
				tmpIndex++;
				var tmpobj = $(this.data.toolObjs + ":eq(" + tmpIndex + ")");
				
				tmpobj.css('background','url(images/mi_icon.png) -154px -85px');
				this.setIndex(tmpIndex);
				
			}
		}
		else if(this.data.mouseFlag=='list')	//节目列表中按右键
		{
			var tmpIndex = this.data.childIndex;
			if(tmpIndex==$(this.data.listObjs).size()-1)
			{
				return false;
			}
			else
			{
				if((tmpIndex == (this.data.pageID*this.data.pageCount-1)) && this.data.totalPage>this.data.pageID)
				{
					this.nextPage();
					return false;
				}
				tmpIndex++;
				this.moveBox(tmpIndex);
				this.data.childIndex = tmpIndex;	//更新索引
				this.data.mouseFlag = 'list';
			}
		}
		else if(this.data.mouseFlag=='recommend')	//节目列表中按右键
		{
			var tmpIndex = this.data.childIndex;
			if(tmpIndex==$(this.data.tujiObjs).size()-1)
			{
				return false;
			}
			else
			{
				$(this.data.tujiObjs + ".mi_focus").attr('class','mi_border');
				
				tmpIndex++;
				var tmpobj = $(this.data.tujiObjs + ":eq("+ tmpIndex +")");
				tmpobj.attr('class','mi_focus');
				this.data.childIndex = tmpIndex;
			}
		}
		
		
	},
	select : function(){
		if(this.data.mouseFlag=='tool')
		{
			//暂时先弹出信息 确定OK 再继续
			var tmpindex = this.getIndex();
			if(tmpindex==0)
			{
				//播放第一集
				var sid = $(this.data.listObjs + ":first").attr('sid');
				if(sid==0)
				{
					this.mask.show('无可播放信息...');
					autoHide();
				}
				else
				{
					//剧集信息写入COOKIE
					if(isTest)
						this.hidePage(vod_test.data[this.data.id].v_name,this.data.id,0,0);
					else this.addCookie();
				}
			}
			else if(tmpindex==1)
			{
				//打开剧集列表层
				$('#hot_rec').html('剧集列表');
				$("#moreItem").css('top','435px').show();
				
				$(this.data.toolObjs + ':eq(1)').css('background','');
				this.data.mouseFlag = 'list';
				showDiv('div_box');
			}
			else if(tmpindex==2)
			{
				//收藏 classID,tvid,name,pic,idx_str
				show_favorite();
			}
			else if(tmpindex==3)
			{
				//收藏 tvid,name,pic
				var v_name = $("#programName").text();
				var pic = $("#programPic").attr('src');
				ifavorite(this.data.id,v_name,pic);
				
			}
		}
		else if(this.data.mouseFlag=='list')
		{
			//先得到节目ID
			var sid = $(this.data.listObjs + ".o").attr('sid');
			if(sid==0)
			{
				return false;
			}
			//剧集信息写入COOKIE
			this.addCookie();
			
		}
		else if(this.data.mouseFlag=='recommend')
		{
			//先得到节目ID
			var sid = $(this.data.tujiObjs + ".mi_focus").attr('sid');
			if(sid==0)
			{
				return false;
			}
			//直接跳转到该推荐节目的信息页
			window.location.href = 'video_info.html?id=' + sid + '&index=0';
		}
	},
	addCookie : function()
	{
		
		//该函数保存跳转之前的状态 写入COOKIE
		//this.mask.show('跳转中,请稍候...');
		var tmpIndex = this.data.childIndex;
		var mmsid = $(this.data.listObjs + ':eq('+ tmpIndex + ')').attr('sid');
		var name = $("#programName").text();
		var pic = $("#programPic").attr('src');

		var str = this.data.id + '|' + tmpIndex;
		setCookie('letv_info',str,12);		//用户返回
		var tmphtml = '';
		if(listItemHtml == ''){
			//如果不是第一次
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
			//setCookie('play_list',tmphtml,12);
			//直接初始化到播放对象的显示列表函数
			listItemHtml = tmphtml;
		}
		//添加历史记录
		ihistory(this.data.id,name,pic);
		//跳转
		//window.location.href = this.data.url + '?page='+ this.data.page + 
		//'&id=' + this.data.id + '&tvid=' + mmsid + '&index=' + this.data.childIndex + '&name=' + encodeURI(name);
		this.hidePage(name,this.data.id,mmsid,this.data.childIndex);
	},
	back : function()
	{
		var param_str = $.cookie('letv_list');
		if(param_str == '' || param_str==null)
		{
			param_str = this.data.classID +'|0,0,0|1|-1';
		}
		var tmp_param_arr = param_str.split('|',4);
		/**判断规则
		 * 1.page=history			返回历史页
		 * 2.page=favorite			返回收藏页
		 * 3.page=recommend			返回推荐收看页
		 * 4.page=search|key|pageid 返回搜索关键字指定页
		 * 5.page=baidu				返回百度云首页
		 * 6.page=空字符串			返回分类指定页(参考idx_str )
		 */
		var tmp_goto_page = 'index.html';
		var tmp_page_str = this.data.page;
		if(tmp_page_str=='history')	
		{
			tmp_goto_page = 'history.html';
		}
		else if(tmp_page_str=='favorite')	
		{
			tmp_goto_page = 'favorite.html';
		}
		else if(tmp_page_str=='recommend')	
		{
			tmp_goto_page = 'recommend.html';
		}
		else if(tmp_page_str.indexOf('search|')!=-1)	
		{
			tmp_goto_page = 'search.html?page='+tmp_page_str.substr(7);
		}
		else if(tmp_page_str=='baidu')	//从9开始为推荐
		{
			tmp_goto_page = 'baidu.html?p_id='+tmp_param_arr[0] + '&idx_str='+tmp_param_arr[1]  + '&pageid='+tmp_param_arr[2] + '&index='+tmp_param_arr[3];
		}
		else if(tmp_page_str==''){
			if(isTest)
				tmp_goto_page = 'index.html?p_id=' + 1;
			else	
				tmp_goto_page = 'index.html?p_id=' + tmp_param_arr[0] + '&idx_str='+tmp_param_arr[1]  + '&pageid='+tmp_param_arr[2] + '&index='+tmp_param_arr[3];
		}
		window.location.href = tmp_goto_page;
	},
	setIndex : function(idx)
	{
		this.data.index = idx;
	},
	getIndex : function()
	{
		return this.data.index;
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
			$(this.data.listObjs).each(function(i){
				if(i>=idx_from && i<idx_to)
				{
					$(this).show();
				}
			});
			//默认选中最后一个
			this.setIndex(idx_to-1);
			this.moveBox(idx_to-1);
			this.data.pageID = tmppageid;
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
			if(idx_to>this.data.total)
			{
				idx_to = this.data.total;
			}
			$(this.data.listObjs).each(function(i){
				if(i>=idx_from && i<idx_to)
				{
					$(this).show();
				}
			});
			//默认选中第一个
			this.setIndex(idx_from);
			this.moveBox(idx_from);
			this.data.pageID = tmppageid;
		}
	},
	hidePage : function(name,id,mmsid,idx){
		hideDiv('div_content');
		hideDiv('nav');
		hideDiv('recommend');
		hideDiv('div_box');
		//显示播放页
		playObj.init({
			id : id,
			mmsid : mmsid,
			title : name,
			index : idx,
			ajaxUrl: MY_API_ADDR + 'get_vod_url_info.php',
		});
	},
	event : function(){
		var that = this;
		$(document).unbind('keydown').bind('keydown',function(e){
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
				//window.alert('01');
				that.back();		//返回键
			}
			else if(keycode==48)
			{
				that.back();		//返回键
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


