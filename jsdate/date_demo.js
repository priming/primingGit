// JavaScript Document

$.fn.creatDate = function(data){
	//data.now 为日历显示的日期 ，data.temp为日历调用的模板，data.model为日历模式，周模式或月模式
	var $this = $(this);
	var refWeek = refWeek || new Date(); //切换当前日期参考
	var selectedNow = []  //保存已选项
	
	//生成本月日历模板数据
	var creatDateMonth = function(now){
		now = now || new Date();
		var dateInfo ={dateWeek:[]};
		var days = now.getDays();  //本月天数	
		var first = now.firstDay();//本月第一天周几
		var lastDays = now.getDays(0) - first;//上月天数 差值
		var tableDays = days + first;//表格必需数量
		var weekNum = Math.ceil(tableDays/7); //本月共几周	
		var nextMonthDay = 0;
		
		for(var w =0; w<weekNum; w++){
			var weekUnit = {date:[]};
			for(var d =0; d<7; d++){
				
				var x;  //日期数字
				var dateUnit = {dateDay:""};
				
				if (tableDays>0){
					tableDays--;
					if(tableDays < days){
						x = days - tableDays;				
						}else{
						//上月补充日期
						lastDays++;
						x = lastDays;
						dateUnit.useless = "unselected";
						}
					
					}else{
						//下月补充日期
						nextMonthDay ++;
						x=nextMonthDay;
						dateUnit.useless = "unselected";
					}
				
				dateUnit.dateDay= x;
				
				weekUnit.date.push(dateUnit)
				
				}
			dateInfo.dateWeek.push(weekUnit)
			}
	
		//显示当前时间
		dateInfo.nowDate = [now.getFullYear(),now.getMonth()+1].join("-");		
		return dateInfo;
	}

	//模拟ajax数据显示选中项
	var severData = {
		selectable:[1357689600000,1358067600000],
		selectnow:[1357693200000,1357092000000],
		selected:[1357693200000,1357092000000]
		};
	
	//生成周日历模板数据
	var creatDateWeek = function(now){
		now = now || new Date();
		var year = now.getFullYear();
		var month = now.getMonth();
		var date = now.getDate();
		var day = now.getDay();
		var weekStr = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]
		var weekDate = {dateWeek:[]};		
		
		for(var i =0; i<7; i++){
			var nowDate = new Date(year,month,date+i);
			var dayDate ={};
			dayDate.hours = [];
			for(var h=0; h<24; h++){
				var hour = {hour:""}
				dayDate.hours.push(hour);
				hour.utc = Date.UTC(nowDate.getFullYear(),nowDate.getMonth(),nowDate.getDate(),h,0,0);
				if($.inArray(hour.utc,severData.selectable) !== -1){
					hour.useless = "checkable";
					hour.hour = '<input name="" type="checkbox" value="" />';
					}
				if($.inArray(hour.utc,severData.selected) !== -1){
					hour.useless = "checked"
					hour.hour = '<span class="check-old"></span>';
					}
			}
			dayDate.month = nowDate.getMonth()+1;
			dayDate.date = nowDate.getDate();
			dayDate.day = weekStr[nowDate.getDay()].substring(0,3);
			weekDate.dateWeek.push(dayDate);
		}
		
		//显示当前时间
		weekDate.nowDate = [year,month+1].join("-");
		
		//设置切换参考时间
		refWeek = new Date(year,month,date);
		
		return weekDate;
	}
	
	//模板日期翻页控制
	$(".control-line > a").live("click",function(e){
		var classN = e.target.className;
		switch(data.model){
			case "month":
			var now = $("#now-date").text().split("-");		
			var nowYear = parseInt(now[0]);
			var nowMonth = parseInt(now[1])-1;
			switch (classN){
				case "pre-btn":
				data.now = new Date(nowYear,nowMonth-1,1);
				break;
				case "next-btn":
				data.now = new Date(nowYear,nowMonth+1,1);
				break;
			}
			rander();
			break;
			case "week":
			var nowYear = refWeek.getFullYear();
			var nowMonth = refWeek.getMonth();
			var nowDate = refWeek.getDate();
			switch (classN){
				case "pre-btn":				
				data.now = new Date(nowYear,nowMonth,nowDate-7);
				break;
				case "next-btn":
				data.now = new Date(nowYear,nowMonth,nowDate+7);
				break;
			}
			rander();
			
			//显示已选项效果
			for(var i=0; i<selectedNow.length; i++){
				$(".checkable").each(function(){
					if($(this).attr("rel")===String(selectedNow[i])){
						console.log($(this).attr("rel"))
						$(this).find("input").attr("checked","checked");
						$(this).addClass("selected-now");
						}
				})
				}
			break;
		}
		
		
	})
	
	//周日历选择日期效果
	$("td input").live("click",function(){
		var thisUtc = parseInt($(this).parent().attr("rel"));
		if($(this).attr("checked")=="checked"){
			$(this).parent().addClass("selected-now");
			selectedNow.push(thisUtc);			
			}else{
				$(this).parent().removeClass("selected-now");
				if($.inArray(thisUtc,selectedNow) !== -1){
					selectedNow.splice($.inArray(thisUtc,selectedNow),1);
					}
			}
	})
	
	//渲染模板
	var rander = function(){
		switch(data.model){
			case "month":
			var dateInfo = creatDateMonth(data.now);
			break;
			case "week":
			var dateInfo = creatDateWeek(data.now);
			break;
		}
		
		var dateTemp = data.temp.html();
		var dateHtml = Mustache.to_html(dateTemp,dateInfo);
		$this.html(dateHtml);
		console.log(dateInfo);
	}
	
	//初始化日期模板
	rander();
}

//扩展原型获取某月天数；1为本月
Date.prototype.getDays = function(m){
		m = m || 1;
		var yy = this.getFullYear();
		var mm = this.getMonth()+m;
		return new Date(yy,mm,0).getDate();
	}
	
//获取本月第一天是周几，需要补几天
Date.prototype.firstDay = function(){
		var yy = this.getFullYear();
		var mm = this.getMonth();
		return new Date(yy,mm,1).getDay();
	}

