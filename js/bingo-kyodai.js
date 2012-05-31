function buildmatrix(x,y) {
	var res=[],arr=[];
    for(var i=0;i<x*y/2;i++){arr[i]=i+1;}
	for(var i=0;i<parseInt(arr.length/2);i++) {
		arr[arr.length-1-i]=arr[i];//reduce the difficulty
	}
	arr=arr.concat(arr);
    arr.sort(function(){return 0.5-Math.random();})
	for(var i=0;i<x+2;i++) {
		res[i]=[];
		for(var j=0;j<y+2;j++) {
			if(i==0 || i==x+1) {
				res[i][j]=0;
			} else if(j==0 || j==y+1) {
				res[i][j]=0;
			} else {
				res[i][j]=arr.pop();
			}
		}
	}
	return res;
}



function bingolines(src,dest,map) {
	var orbit=[];
	var src=src;
	var dest=dest;
	var debug=[];
	
	function index(value) {
		for(var i in this) {
			if(typeof(this[i]=='object')) {
				if(this[i].x==value.x && this[i].y==value.y) {
					return new Number(i);
				}
			} else {
				if(this[i]==value) {
					return new Number(i);
				}
			}
		}
		return -1;
	}
	
	function remove(value) {
		var index=this.index(value);
		this.splice(index,1);
	}
	
	function insert(position,value) {
		this.splice(position,0,value);
	}
	
	function clone() {
		return this.slice(0);
	}
	
	function last() {
		return this[this.length-1];
	}
	
	Array.prototype.index=index;
	Array.prototype.insert=insert;
	Array.prototype.remove=remove;
	Array.prototype.clone=clone;
	Array.prototype.last=last;
	
	function walkman(index) {
		var that=this;
		this.index=0;//forever point to zero
		this.current=function() {
			return orbit[that.index].last();//return the last step of current orbit
		}
		this.run=function() {//__main__
			for(;;) {//while
				if(orbit.length==0) return false;
				if(map[src.x][src.y]!=map[dest.x][dest.y]) return false;
				if(map[src.x][src.y]==map[dest.x][dest.y] && map[src.x][src.y]==0) return false;
				if(src.x==dest.x && src.y==dest.y) return false;
				var cur=that.current();
				var next=that.neighbor();
				
				if(that.turning(orbit[that.index])>2) {
					orbit.shift();
					continue;
				}
				if(that.adjacent(cur,dest)) {//watching while running
					orbit[that.index].push(dest);
					if(that.turning(orbit[that.index])<3) return true;
					orbit.shift();
					continue;
				}
				if(next.length>0) {
					orbit[that.index].push(next.pop());
					that.division(next);
				} else {
					orbit.shift();
				}
				continue;
			}
		}
		this.neighbor=function() {
			var cur=that.current();
			var list=[];
			if(cur.x+1<=map[0].length-1 && map[cur.x+1][cur.y]==0 && orbit[that.index].index({x:cur.x+1,y:cur.y})==-1) {
				list.push({x:cur.x+1,y:cur.y});
			}
			if(cur.x-1>=0 && map[cur.x-1][cur.y]==0 && orbit[that.index].index({x:cur.x-1,y:cur.y})==-1) {
				list.push({x:cur.x-1,y:cur.y});
			}
			if(cur.y+1<=map.length-1 && map[cur.x][cur.y+1]==0 && orbit[that.index].index({x:cur.x,y:cur.y+1})==-1) {
				list.push({x:cur.x,y:cur.y+1});
			}
			if(cur.y-1>=0 && map[cur.x][cur.y-1]==0 && orbit[that.index].index({x:cur.x,y:cur.y-1})==-1) {
				list.push({x:cur.x,y:cur.y-1});
			}
			return that.priority(list);
		}
		this.division=function(list) {
			for(var i=0;i<list.length;i++) {
				var cur=list[i];
				var prelocus=orbit[that.index].clone();
				prelocus.pop();
				prelocus.push(cur);
				orbit.insert(1,prelocus);//higher index,higher priority
			}
		}
		this.adjacent=function(cur,dest) {
			if(Math.abs(cur.x-dest.x)+Math.abs(cur.y-dest.y)==1) return true;
			return false;
		}
		this.turning=function(arr) {
			var turns=[];
			for(var i=0;i<arr.length;i++) {
				if(i!=arr.length-1) {
					if(arr[i].x==arr[i+1].x) {
						turns.last()!='y' && turns.push('y');
					} else if(arr[i].y==arr[i+1].y) {
						turns.last()!='x' && turns.push('x');
					}
				}
			}
			return turns.length-1;//return lines
		}
		this.priority=function(arr) {//bubble sort
			var n=arr.length,tmp,exchange;
			if(n<2) return arr;
			for(var time=0;time<n-1;time++) {
				exchange=false;
				for(var i=n-1;i>time;i--) {
					if(that.estimate(arr[i])>that.estimate(arr[i-1])) {//higher score,higher index
						exchange=true;
						tmp=arr[i-1];
						arr[i-1]=arr[i];
						arr[i]=tmp;
					}
				}
				if(!exchange) break;
			}
			return arr;
		}
		this.estimate=function(point) {//heuristic pathfinding
			var f,g,h1,h2;
			var locus=orbit[that.index].clone();
			locus.push(point);g=that.turning(locus);h1=1;
			h2=Math.sqrt(Math.pow(point.x-dest.x,2)+Math.pow(point.y-dest.y,2));
			if(point.x!=dest.x && point.y!=dest.y) {h1=2;}
			f=(g+h1)*100+h2*0.01;//higher priority,lower f value
			return f;
		}
	}
	
	orbit[0]=[src];
	return new walkman().run();//fire the fuze behind the first true man
}

var bingocomplete=function(arr) {
	var complete=true;
	for(var i=0;i<arr.length;i++) {
		for(var j=0;j<arr[i].length;j++) {
			if(arr[i][j]!=0) {
				complete=false;
				break;
			}
		}
	}
	return complete;
}