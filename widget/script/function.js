var token,secret,host="http://me2.yeep.me/app/",hasLang = ['en-us','zh-cn'],
	language = $api.getStorage("sys_lang")?$api.getStorage("sys_lang"):(navigator.browserLanguage || navigator.language).toLowerCase();
language = (hasLang.indexOf(language) == -1)?hasLang[0]:language;
//language = hasLang[0]; http://me2.yeep.me/app/
document.write('<script type="text/javascript" src="lang/'+language+'.js"></script>');

var toast = function(msg){
	api.toast({
		msg: msg,
		duration: 2000,
		location: 'bottom',
		global: true,
	});
};

var openWin = function(name,url,param,subtype){
	api.openWin({
		name: name,
		url: "widget://"+url,
		reload: true,
		animation: {
			type: "push",
			subType: subtype?subtype:"from_right",
			duration:300
		},
		slidBackEnabled: false,
		pageParam: param,
	});
};

var reload = function(){
	setTimeout(function(){
		window.location.reload();
	},300);
};

var http_post = function(url,data,auth,callback,failback){
	if(api.connectionType == 'none'){
		toast(lang.sys_network_odd);
		return;
	}
	if(auth){
		data.token = $api.getStorage("user_token");
		data.secret = $api.getStorage("user_secret");
		data.is_temp = $api.getStorage("user_is_temp");
		//data.user_type = $api.getStorage("user_login_type");
		/*data.token = "8a9527c915dc8441c252fb12988f0fd7";
		data.secret = "b66976f7f33f6665d660dee00c1316b1";*/
	}
	api.showProgress({
	    title: lang.sys_tips,
	    text: lang.sys_loading
	});
	api.ajax({
		url: host+url+"?lang="+language,
		method: 'post',
		dataType: 'json',
		data: {
			values:data
		}
	},function(ret,err){
		api.hideProgress();
		if(ret){
			if(ret.code == -1){
				toast(lang.sys_login_out);
				var isFirst = $api.getStorage("first");
				$api.clearStorage();
				if(isFirst !== undefined) $api.setStorage("first","ok");
				api.execScript({
					name: "root",
					script: 'cancelPush()',
				});
				setTimeout(function(){
					openWin("login","html/login.html");
				},500);
			}else if(ret.code == 0){
				api.alert({
					title: lang.sys_tips,
					msg: ret.msg
				}, function(ret, err){
					if(failback != undefined){
						failback();
					}
				});
			}else if(ret.code == 1){
				callback(ret);
			}
		}else{
			console.log(err.body);
			toast(lang.sys_network_odd);
		}
	});
};

if($api.dom(".retreat") != null){
	$api.addEvt($api.dom(".retreat"),'click',function(){
		api.closeWin();
	});
}