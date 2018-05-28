// JavaScript Document
/*左侧栏目数据*/
var areaLength;
var categoryLength;
var yearLength;

//传递url时用到的参数	
var area = '';
var category = '';
var year = '';


var data = [{"name":"电影","id":1,"menuList":
					{"areaList":["全部","大陆","美国","韩国","香港","台湾"],
					"categoryList":["全部","爱情","动作","喜剧","剧情","动画","科幻","恐怖","歌舞","惊悚","冒险","悬疑"],
					"yearList":["全部","2014","2013","2012","2011","2010","2009","2008","更早"]
					}
				},
				{"name":"电视剧","id":2,"menuList":
					{"areaList":["全部","大陆","香港","韩国","美国","台湾"],
					"categoryList":["全部","都市","家庭","言情","警匪","古装","武侠","军事","神话","科幻","悬疑","历史","儿童","农村","偶像"],
					"yearList":["全部","2014","2013","2012","2011","2010","2009","2008","更早"]
					}
				},
				{"name":"综艺","id":3,"menuList":
					{"areaList":["全部","大陆","香港","韩国","台湾","美国"],
					"categoryList":["全部","访谈","选秀","游戏","时尚","音乐","搞笑","娱乐","优酷"],
					"yearList":["全部","2014","2013","2012","2011","2010","2009","2008","更早"]
					}
				},
				{"name":"动漫","id":4,"menuList":
					{"areaList":["全部","日本","大陆","美国","韩国","台湾"],
					"categoryList":["全部","搞笑","剧情","冒险","历史","励志","校园","益智","童话","真人","神话","推理","亲子","科幻","教育"],
					"yearList":["全部","2014","2013","2012","2011","2010","2009","2008","更早"]
					}
				},
				{"name":"体育","id":5,"menuList":
					{"areaList":["全部","大陆","美国","韩国","英国","日本"],
					"categoryList":["全部","篮球","足球","乒乓","排球","网球","中超","欧冠","德甲","英超","西甲","CBA","NBA","赛车","其他"],
					"yearList":["全部","2014","2013","2012","2011","2010","2009","2008","更早"]
					}
				},
				{"name":"教育","id":6,"menuList":
					{"areaList":["全部","中国","美国","韩国","英国","日本"],
					"categoryList":["全部","社会","地理","外语","文化","法律","名人","医学","经济","历史","哲学","艺术"],
					"yearList":["全部","2014","2013","2012","2011","2010","2009","2008","更早"]
					}
				},
				{"name":"游戏","id":7,"menuList":
					{"areaList":["全部","大陆","美国","韩国","英国","日本"],
					"categoryList":["全部","武侠","魔幻","三国","神话","历史","卡通","动漫","体育","商业","军事","其他"],
					"yearList":["全部","2013","2012","2011","2010","2009","2008","2007","更早"]
					}
				}					
				]
				
function getMenu( menuId ){
	var curMenu;
	for(var i=0,len=data.length;i<len;i++){
		if( menuId == data[i].id){
			curMenu = data[i].menuList;
			return curMenu;
		}else{
			continue;
		}
	}
}	

function showMenu(id){
	var menuData = getMenu( id );
	//alert(menuData);
	var areaData = menuData.areaList;
	var categoryData = menuData.categoryList;
	var yearData = menuData.yearList;
	
	areaLength = areaData.length;
	categoryLength = categoryData.length;
	yearLength = yearData.length;
	
	var areaHtml='';
	var categoryHtml='';
	var yearHtml='';
	
	//显示area
	for(var i=0,len=areaData.length;i<len;i++){
		areaHtml += '<li title="area">'+areaData[i]+'</li>'; 
	}	
	$("areaList").innerHTML = areaHtml;
	
	//显示category
	for(var j=0,len=categoryData.length;j<len;j++){
		categoryHtml += '<li title="category">'+categoryData[j]+'</li>'; 
	}	
	$("categoryList").innerHTML = categoryHtml;
	
	//显示year
	for(var k=0,len=yearData.length;k<len;k++){
		yearHtml += '<li title="year">'+yearData[k]+'</li>'; 
	}	
	$("yearList").innerHTML = yearHtml;
}

 

			