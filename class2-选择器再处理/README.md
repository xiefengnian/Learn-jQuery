# 选择器再处理
## 上节课结尾的坑
我们上节课实现了选择器的大体框架，但是还是有一点缺陷的。但是我们不着急讨论，而且将选择器再进行优化，方便我们在后期方便拓展。
现在我们的代码是这样的：
```
var init = function(selector){
    //选择器
}
var $ = function(selector){
    return new init(selector);
}
```
当我们执行一个经典的JQ语句之后，是这样的：
`$('.d1')`
得到一个init对象，这个对象包含了一些属性（比如this.dom）和一些方法
`init{
	dom : HTMLCollection[]
}
`
这样看起来不错，因为我们选择器返回的结果是对象的话，接下来我们就能使用第一节说的点语法了。

但是现在也要回忆一下我们存在的问题：

**id选择器返回的是HTMLElement对象**

（实际上，比如是div标签，则会返回HTMLDivElement，span标签返回HTMLSpanElement对象，但是相同点是都继承自HTMLElement对象的，都包含了一些相同的属性，以下没有说明的话，都使用HTMLElement对象表示）

**而class选择器返回的是HTMLCollection对象**

（HTMLCollection对象是一个类似数组的结构，有下标和length属性，但是不携带数组的任何方法，HTMLCollection里面的每一项都是选择器选中的HTMLElement对象）
就是这个意思，以下都是伪代码，意思懂了就好：

```
HTMLElement{
    style : {},
    onclick : f,
    ...
}

HTMLCollection[
	0 : HTMLElement
]

```
所以我们在使用$进行选择的时候，this.dom就存在一个问题。
```
$('.d1')  => this.dom为HTMLCollection
$('#d1')  => this.dom为HTMLElement
```
这个问题我们先记着，然后我们忽视它，继续往下写，看看会遇到什么问题。
## 实现第一个JQ方法：attr
我们先看JQ给我们实现的attr方法如何使用：
```
html: <div class="d1"></div>

js: $(".d1").attr("data-index","0")
```

+当传入两个参数的时候，给选择器选中的元素设置属性，第一个为属性名，第二个为属性值。

`html: <div class="d1" data-index="0"></div>`
这时候就给html添加上了`data-index`属性，值为`"0"`

+当传入一个参数的时候，是获取一个标签的属性值，接着上面的html

`js: $(".d1").attr("data-index")`结果为：`"0"`

要实现这个方法，我们至少需要注意以下几个问题：
1. attr传入的参数是不确定的，需要我们手动做个判断，根据不同的参数数量处理不同的情况。
2. 这个方法是在选择器返回的init对象中的。

所以我们先实现逻辑，再用胶水把代码粘起来。
```
//在init构造器中实现这个方法

this.attr = function(){
    //将要实现些什么
}
```
**等等！好像缺点什么？**
我们怎么去判断参数的数量呢？
在这里，其实很简单，使用函数内部的关键字arguments。

arguments是一个类数组结构（这一点和HTMLCollection很像），使用下标的方式访问，并且，**具有length属性**。
所以在函数内部，`auguments.length`就代表了参数的长度

具体你可以用`console.log`调试一下，这里就不展开了。
好了，咱们继续编写attr

```
//在class选择器下，this.dom 为[]
this.attr = function(){
    var argLength = arguments.length;
    if(argLength == 1){
    	var key = arguments[0];
        for(var i = 0 ; i < this.dom.length ; i++){
            console.log(this.dom[i].getAttribute(key));
        }
    } else if(argLength == 2){
    	var key = arguments[0];
        var value = arguments[1];
        for(var i = 0 ; i < this.dom.length ; i++){
            this.dom[i].setAttribute(key,value);
        }
    }
}
```
然后尝试调用一下：

`
$('.d1').attr("data-index","0");
`

以上代码在calss选择器上是可以运行的，因为this.dom是HTMLCollection，可以使用下标去访问其中的元素，但是**如果this.dom**在id选择器下呢？再用一下：

`
$('#d1').attr("data-index","0");
`

<font color=red>(x)Uncaught TypeError: Cannot read property 'setAttribute' of undefined</font>

为什么会报这个错呢，因为这时候this.dom为一个HTMLElement对象，当你尝试使用下标去访问的时候：

`this.dom[0] ==> undefined`

那么再使用链式语法的时候，undefined这个值当然是没有setAttribute这个方法的，所以报了一个错：

<font color=red>(x)未捕捉类型错误：不能读取undefined的'setAttribute属性'</font>


那怎么办呢？我们只能判断一下this.dom的类型，然后区分不同的情况了。
怎么区分呢？最简单的你可能会想到：
`typeof this.dom == 'object'`

`typeof this.dom == 'array'`

通过typeof关键字来判断数据类型，但是真的可行吗？
`typeof [] ==> 'object'`
你可以在控制台输出一下，数组的类型是`'object'`。

那怎么办？
很简单，HTMLCollection有一个特别的属性：`length`。
所以我们就可以这样写：
```
this.attr = function(){
    var argLength = arguments.length;
    if(this.dom.length){
    	//这里就是HTMLCollection情况啦，原来的代码复制粘贴就好了
        if(argLength == 1){
    		var key = arguments[0];
        	for(var i = 0 ; i < this.dom.length ; i++){
        	    console.log(this.dom[i].getAttribute(key));
        	}
    	} else if(argLength == 2){
    	    var key = arguments[0];
            var value = arguments[1];
            for(var i = 0 ; i < this.dom.length ; i++){
        	    this.dom[i].setAttribute(key,value);
            }
    	}
    } else {
    	//这里是HTMLElement情况，这里就比较简单了
        if(argLength == 1){
            var key = arguments[0];
            return this.dom.getAttribute(key);
        }else if(argLength == 2){
            var key = arguments[0];
            var value = arguments[1];
            this.dom.setAttribute(key,value);
        }
    }
}
```
试一下吧！

说实话这个代码我写起来已经有点不开心了，因为这个问题虽然解决的，但是我们在接下来的实现的各个方法中，都要再写一次这个流程，比如css、remove等方法。重复写，没有必要，我们不如先简单预先处理一下。

## 数组方法介绍
我们先介绍一个数组的方法,`forEach`
>forEach([callback])
>传入一个回调函数，处理数组里的每一项。
>回调函数的第一项为数组里的一项，第二项为下标
>例如：
>var a = [1,2,3];
>```
>a.forEach(function(item,index){
>	a[index] = item + 1;
>})
>```
>结果：a = [2,3,4];

使用这个方法，一下就省去了重复写for循环的问题。
但是这个是数组带有的方法，HTMLCollection可没有这个方法。
## 先优化选择器结构
所以接下来我们要做一个处理：把选择器的结果变为数组，即是说：
`this.dom = [];`
这样有两个好处：
1. 更方便使用数组的forEach方法
2. 无论是id选择器还是class选择器，返回类型都统一为数组，处理的时候就不必判断类型了。

好了，我们开始把！
```
var init = function(selector){
    //选择器
    //省略removeStringFirst函数...

    this.dom = [];
    var firstChar = selector[0];    //获取首字符
    if(firstChar == '.'){           //实现class选择器
    	selector = removeStringFirst(selector);
    	var dom = document.getElementsByClassName(selector);
        Array.prototype.forEach.call(dom,function(item){
        	this.dom.push(item);
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
        	this.dom.push(item);
        })
        console.log(this.dom);
    }
}
var $ = function(selector){
	return new init(selector);
}
```

这样操作下来，this.dom的类型一定是数组，这样就能开心地写：
`this.dom.forEach`了。
在下一步之前，有的小同志也许不知道这个代码是什么意思：
```
//谜一样的代码
var dom = document.getElementsByClassName(selector);
Array.prototype.forEach.call(dom,function(item){
	this.dom.push(item);
})
```
这是JS中一个特别有意思的地方：每一个函数都具备一个call方法，这个方法的作用是什么呢？我们用个小例子探究一下。
```
var xm = {
    age : 20,
    say : function(){
    	console.log(this.age);
    }
}
//xm.say() => 20

//在全局中， this == window
var age = 40;              //window.age = 40;
xm.say.call(this);         //=> 40
```
这里的例子中，虽然我们调用的是xm对象的say方法，但是实际上方法中`this.age`变成了window对象的age属性。
也就是说我们做了一个移花接木的事情，让`xm.say()`帮我们处理window对象的age，也可以理解为，call([object])是用新的对象去代替原本的this。
那么call方法中第二个参数是什么呢？
还是这个例子：
```
var xm = {
	age : 20,
	say : function(str){
    	console.log(this.age , str);
    }
}
var age = 40;
xm.say.call(this,"一个字符串");  //=>40 "一个字符串"
```
就是在实现原本的方法需要的参数。
回到我们的代码中：
```
var dom = document.getElementsByClassName(selector);
Array.prototype.forEach.call(dom,function(item){
    this.dom.push(item);
})
```
这个代码就是调用（呼唤）数组的forEach方法，用dom“假装”一个数组，然后后面的函数回调就是原本`forEach(callback)`中需要的回调参数。
当然，也许你不知道Array.prototype是什么意思，没关系，接下来的JQ实现中，我们就知道他是什么意思了。
所以实现JQ也是一个了解JS原生结构的一种方式。
如果真的一时间看不懂的话也没关系，我们有更简单的实现方式，以class选择器为例：
```
var dom = document.getElementsByClassName(selector);
for(var i = 0 ; i < dom.length ; i++){
    this.dom.push(dom[i]);
}
```
虽然不帅，但是一样好用。
## 优化attr方法
在之上，我们处理完之后。`this.dom`就统一为了数组类型，接下来的attr方法（以及未来的方法）实现起来就简单了。
```
this.attr = function(){
    var argLength = arguments.length;
    if(argLength == 1){
        var key = arguments[0];
        this.dom.forEach(function(item){
            console.log(item.getAttribute(key));
        })
    } else if(argLength == 2){
    	var key = arguments[0];
        var value = arguments[1];
        this.dom.forEach(function(item){
            item.setAttribute(key,value);
        })
    }
}
```
简洁而优雅！
再去试一下？
```
$('.d1').attr('data-name','handsome');
```
## 整体代码

```
var init = function(selector){
	//砍头函数
    var removeStringFirst = function(str){
		var charArr = str.split('');
    	charArr.shift();
		return charArr.join('');
	}

    //this.dom初始化为数组，带有数组全部方法
    this.dom = [];
    var firstChar = selector[0];    //获取首字符
    if(firstChar == '.'){           //实现class选择器
    	selector = removeStringFirst(selector);
    	var dom = document.getElementsByClassName(selector);
        Array.prototype.forEach.call(dom,function(item){
        	this.dom.push(item);
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
        	this.dom.push(item);
        })
        console.log(this.dom);
    }

    this.attr = function(){
        var argLength = arguments.length;
        if(argLength == 1){
            var key = arguments[0];
            this.dom.forEach(function(item){
                console.log(item.getAttribute(key));
            })
        } else if(argLength == 2){
            var key = arguments[0];
            var value = arguments[1];
            this.dom.forEach(function(item){
                item.setAttribute(key,value);
            })
        }
    }
}
var $ = function(selector){
    return new init(selector);
}
```
这时：
`
$('.d1')
`
结果为：
```
init{
    dom:[...],
    attr : f ,
    __proto__ : Object
}
```
我们为init方法实现了一个属性：dom，

一个方法：attr

下一节，我们将实现css方法，和点语法。





