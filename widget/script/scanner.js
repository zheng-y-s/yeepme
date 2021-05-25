var scanner = (function(){

	return function(obj,success,cancel){

		obj.open({
			sound: "widget://res/sound/di.wav",
			verticalLineColor: "#03a9f4",
			hintText: ""
		}, function(ret, err) {
			if (ret) {
				switch(ret.eventType){
					case "success":
						success(ret.content);
						break;
					case "show":	// 显示扫码
					case "selectImage":	// 用户从系统相册选取二维码图片
						break;
					case "cancel":
						if(cancel != undefined){
							cancel();
						}
						break;
					default:
						var text = {
							"cameraError":"访问摄像头失败",
							"albumError":"访问相册失败",
							"fail":"扫码失败"
						};
						toast(text[ret.eventType]);
				}
			}
		});
	};

})();

scanner.prototype = {
	constructor: scanner,
};