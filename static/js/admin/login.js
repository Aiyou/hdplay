$(function(){
	$("#vcode").keydown(function(e){
		if(e.which==13){
			do_login();
		}
	});

});
function update_valid_code()
{
	$("#vcode").val('');
	$("#vcode_pic0").attr('src','get_valid_code.php?' + Math.random());
}

function do_login()
{
	var uname = $("#user_1").val().trim();
	var psw = $("#pass_1").val().trim();
	var vcode = $("#vcode").val().trim();
	if(uname == '')
	{
		alert('请输入帐号名');
		$("#user_1").focus();
		return false;
	}
	else if(psw == '')
	{
		alert('请输入密码');
		$("#pass_1").focus();
		return false;
	}
	else if(vcode == '')
	{
		alert('请输入验证码');
		$("#vcode").focus();
		return false;
	}
	else
	{
		var err_arr = new Array('参数无效','验证码错误','账号或密码错误','登陆成功');
		var param_arr = {user_1:uname,pass_1:psw,vcode:vcode};
		curl( "chk_login.php" , function (json){

			var re = parseInt(json.code);
			if(re>0)
			{
				alert(json.msg);
				update_valid_code();
			}
			else
			{
				window.location = '/admin/index.php';
			}

		},param_arr);
	}
}