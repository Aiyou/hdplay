// JavaScript Document

//var language = new QjyScript().exec("OvtGetConfig","language");
var language = "cn";
var config = [{"type":"cn","common":[{"net_logo":"网络设置","common_link":"连接","common_cancel":"返回"}],"auto":[{"net_0":"有线网络","auto_search_btn":"自动获取IP地址","wired_ip":"本机IP:","tip_0":"请检查网线是否连接！","tip_1":"有线网络连接中，请稍等 . . .","tip_2":"有线网络连接失败","tip_3":"用户名或密码错误，请重新进行设置","tip_4":"有线网络连接成功","tip_5":"网络连接错误，请检查网络"}],"wifi":[{"net_1":"无线网络","wifi_setting_name":"无线网络设置","wiredLess_search_btn":"搜索","wifi_network":"无线网络WIFI","wifi_pwd":"密 码","tip_0":"搜索中，请稍等...","tip_1":"没有发现可用的无线网络","tip_2":"密码不能为空!","tip_3":"密码长度应该至少大于8位!","tip_4":"请检查无线连接设备","tip_5":"无线网络连接中，请稍等 . . .","tip_6":"无线网络连接失败","tip_7":"请检查无线密码"}],"pppoe":[{"net_2":"PPPoE拨号","pppoe_title_name":"PPPoE拨号网络","pppoe_name":"用户名","pppoe_pwd":"密 码","tip_0":"请填写完整的资料信息!"}],"static":[{"net_3":"静态IP","static_name":"静态IP网络","static_ip_name":"IP地址","static_mask_name":"子网掩码","static_gateway_name":"网关地址","static_dns_name":"DNS","tip_0":"请填写完整的资料信息","tip_1":"IP地址填写不合法!","tip_2":"子网掩码填写不合法!","tip_3":"网关填写不合法!","tip_4":"DNS填写不合法!"}],"keyboard":[{"fun_del":"退格","fun_enter":"完成","fun_space":"空格","switch_small":"小写","switch_big":"大写","switch_num":"数字","switch_sym":"符号","tip_0":"最多只能输入32个字符","tip_1":"输入不合法!"}]},{"type":"eng","common":[{"net_logo":"Network Settings","common_link":"Connect","common_cancel":"Back"}],"auto":[{"net_0":"Wired Network","auto_search_btn":"Auto IP Address","wired_ip":"IP:","tip_0":"Please ensure network cable is connected","tip_1":"Connecting ethernet, please wait...","tip_2":"Ethernet connection failure","tip_3":"User name or password is incorrect, please enter again","tip_4":"Ethernet connection is successful","tip_5":"Network connection error, please check your network"}],"wifi":[{"net_1":"Wifi Network","wifi_setting_name":"Wireless Network Setting","wiredLess_search_btn":"Search","wifi_network":"Wireless Network Wifi","wifi_pwd":"password","tip_0":"Searching, please wait...","tip_1":"No usable wifi network found","tip_2":"Password can not be empty","tip_3":"Password length should be at least eight","tip_4":"Please check the wireless connection device","tip_5":"Connecting wifi, please wait...","tip_6":" Wifi connection failed","tip_7":"Please check the wireless password"}],"pppoe":[{"net_2":"PPPoE Dialing","pppoe_title_name":"PPPoE Dialing Network","pppoe_name":"User Name","pppoe_pwd":"Password","tip_0":"Please fill in all items in the form"}],"static":[{"net_3":"Static IP","static_name":"Static IP Network","static_ip_name":"IP","static_mask_name":"Mask","static_gateway_name":"Gateway","static_dns_name":"DNS","tip_0":"Please fill in all items in the form","tip_1":"Invalid IP address","tip_2":"Invalid subnet mask","tip_3":"Invalid Gateway","tip_4":"Invalid DNS"}],"keyboard":[{"fun_del":"Del","fun_enter":"Done","fun_space":"Space","switch_small":"Lower","switch_big":"Upper","switch_num":"Number","switch_sym":"Symbol","tip_0":"Length exceeds limit of 32","tip_1":"Invalid input!"}]},{"type":"ge","":[]},{"type":"fa","":[]},{"type":"tu","":[]}];

var commonLanguageArr = [];
var autoLanguageArr = [];
var wifiLanguageArr = [];
var pppoeLanguageArr = [];
var staticLanguageArr = [];
var keyboardLanguageArr = [];

function getLanguage(){
	for ( var i = 0; i< 5 ;i++){
		if( language == config[i].type){
			commonLanguageArr = config[i].common;
			autoLanguageArr = config[i].auto;
			wifiLanguageArr = config[i].wifi;
			pppoeLanguageArr = config[i].pppoe;
			staticLanguageArr = config[i].static;
			keyboardLanguageArr = config[i].keyboard;
			
			$("net_logo").innerHTML = commonLanguageArr[0].net_logo;
			$("pppoe_link").innerHTML =commonLanguageArr[0].common_link;
			$("pppoe_cancel").innerHTML =commonLanguageArr[0].common_cancel;
			$("static_link").innerHTML =commonLanguageArr[0].common_link;
			$("static_cancel").innerHTML =commonLanguageArr[0].common_cancel;
			$("wiredless_link").innerHTML =commonLanguageArr[0].common_link;
			$("wiredless_cancel").innerHTML =commonLanguageArr[0].common_cancel;
			$("back_tiper").innerHTML =commonLanguageArr[0].common_cancel;
				
			$("net_0").innerHTML =autoLanguageArr[0].net_0;
			$("auto_search_btn").innerHTML =autoLanguageArr[0].auto_search_btn;
			$("wired_ip").innerHTML =autoLanguageArr[0].wired_ip;
			
			$("net_1").innerHTML =wifiLanguageArr[0].net_1;
			$("wifi_setting_name").innerHTML =wifiLanguageArr[0].wifi_setting_name;
			$("wiredLess_search_btn").innerHTML =wifiLanguageArr[0].wiredLess_search_btn;
			$("wifi_network").innerHTML =wifiLanguageArr[0].wifi_network;
			$("wifi_pwd").innerHTML =wifiLanguageArr[0].wifi_pwd;
			$("buffer_content").innerHTML =wifiLanguageArr[0].tip_0;
			
			$("net_2").innerHTML =pppoeLanguageArr[0].net_2;
			$("pppoe_title_name").innerHTML =pppoeLanguageArr[0].pppoe_title_name;
			$("pppoe_name").innerHTML =pppoeLanguageArr[0].pppoe_name;
			$("pppoe_pwd").innerHTML =pppoeLanguageArr[0].pppoe_pwd;
			
			$("net_3").innerHTML =staticLanguageArr[0].net_3;
			$("static_name").innerHTML =staticLanguageArr[0].static_name;
			$("static_ip_name").innerHTML =staticLanguageArr[0].static_ip_name;
			$("static_mask_name").innerHTML =staticLanguageArr[0].static_mask_name;
			$("static_gateway_name").innerHTML =staticLanguageArr[0].static_gateway_name;
			$("static_dns_name").innerHTML =staticLanguageArr[0].static_dns_name;
			
			$("fun_del_letter").innerHTML =keyboardLanguageArr[0].fun_del;
			$("fun_enter_letter").innerHTML =keyboardLanguageArr[0].fun_enter;
			$("fun_del_num").innerHTML =keyboardLanguageArr[0].fun_del;
			$("fun_enter_num").innerHTML =keyboardLanguageArr[0].fun_enter;
			$("fun_del_sym").innerHTML =keyboardLanguageArr[0].fun_del;
			$("fun_enter_sym").innerHTML =keyboardLanguageArr[0].fun_enter;
			$("fun_space").innerHTML =keyboardLanguageArr[0].fun_space;
			$("fun_ip_del_num").innerHTML =keyboardLanguageArr[0].fun_del;
			$("fun_enter_ip").innerHTML =keyboardLanguageArr[0].fun_enter;
			$("switch_small").innerHTML =keyboardLanguageArr[0].switch_small;
			$("switch_big").innerHTML =keyboardLanguageArr[0].switch_big;
			$("switch_num").innerHTML =keyboardLanguageArr[0].switch_num;
			$("switch_sym").innerHTML =keyboardLanguageArr[0].switch_sym;
			if( language == "cn" ){
				$("wiredLess_search_btn").style.paddingLeft= 20 + "px";
			}
			break;
		}
	}
}