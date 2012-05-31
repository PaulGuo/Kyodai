var judge=(function() {
	var memorypoint,memoryobj;
	return function(point,obj) {
		$(obj).css('border-color','green').siblings().css('border-color','transparent');
		if(memorypoint && bingolines(memorypoint,point,map)) {
			map[memorypoint.x][memorypoint.y]=0;
			map[point.x][point.y]=0;
			buzz();//beep
			window.location.hash=='#spark' && $('#sparkle').html(sparkle($(obj).position(),$(memoryobj).position()));//draw
			$([obj,memoryobj]).find('img').fadeOut(function() {
				$(this).siblings().fadeOut().replaceWith('<img src="'+data[0].img+'" />');
			});
		}
		if(bingocomplete(map)) alert('wow,congratulations!');
		memorypoint=point;
		memoryobj=obj;
	}
})();

function buzz() {
	getFlashMovieObject('kyodai-sound').Play();
}

function sparkle(a,c) {
	if(a.left>c.left) {
		var tmp=a;a=c;c=tmp;
	}
	var b={left:c.left,top:a.top};//transit point
	var route=[];
	function sparklex(x1,x2,y) {
		var path=[];
		if(x1==x2) return path;
		for(var i=0;i<parseInt((x2-x1)/32)+1;i++) {
			var top=50+y+'px',left=50+x1+32*i+'px',stamp=new Date().getTime();
			path.push('<img src="external/linex.gif?r='+stamp+'" style="position:absolute;top:'+top+';left:'+left+';" />');
		}
		return path;
	}
	function sparkley(y1,y2,x) {
		var path=[];
		if(y1==y2) return path;
		if(y1>y2) {
			var tmp=y1;y1=y2;y2=tmp;
		}
		for(var i=0;i<parseInt((y2-y1)/36)+1;i++) {
			var left=50+x+'px',top=50+y1+36*i+'px',stamp=new Date().getTime();
			path.push('<img src="external/liney.gif?r='+stamp+'" style="position:absolute;top:'+top+';left:'+left+';" />');
		}
		return path;
	}
	route=route.concat(sparklex(a.left,b.left,b.top));
	route=route.concat(sparkley(b.top,c.top,c.left));
	return route.join('');
}