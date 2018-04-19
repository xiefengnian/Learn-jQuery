var init = function(selector){
	//砍头函数
    var removeStringFirst = function(str){
		var charArr = str.split('');
    	charArr.shift();
		return charArr.join('');
	}

    //this.dom初始化为数组，带有数组全部方法
    this.dom = [];
    var me = this;
    var firstChar = selector[0];    //获取首字符
    if(firstChar == '.'){           //实现class选择器
    	selector = removeStringFirst(selector);
    	var dom = document.getElementsByClassName(selector);
        Array.prototype.forEach.call(dom,function(item){
        	me.dom.push(item);
        })
        console.log(this.dom)
    }
    else if(firstChar == '#'){       //实现id选择器
    	selector = removeStringFirst(selector);
    	this.dom.push(document.getElementById(selector));
    	console.log(this.dom);
    }
    else {                           //实现标签选择器
        var dom = document.getElementsByTagName(selector);
        Array.prototype.forEach.call(dom,function(item){
        	me.dom.push(item);
        })
        console.log(this.dom);
    }

    this.attr = function(){

        var argLength = arguments.length;
        if(argLength == 1){
            var key = arguments[0];

            return this.dom[0].getAttribute(key);
        } else if(argLength == 2){
            var key = arguments[0];
            var value = arguments[1];

            this.dom.forEach(function(item){
                item.setAttribute(key,value);
            })

            return this;
        }
    }

    this.on = function(type,callback){
        this.dom.forEach(function(item){
            item.addEventListener(type,callback);
        })

        //添加了return
        return this;
    }
}
var $ = function(selector){
    return new init(selector);
}
