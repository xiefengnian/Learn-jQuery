# 监听器on和链式语法
这一节我们将要先实现监听器，就是为我们的init对象添加一个新的方法，实现后之后我们可以像JQ这样写：

`$('.d1').on('click',function(){})`

然后实现了链式语法之后可以这样：

`$('.d1').attr('data-index','0').on('click',function(){})`

有点意思。

## JS原生监听器
在JS中有两个添加监听器的方式。

一个是HTMLElement对象下的`onclick`之类的onxxx**属性**，另一个是HTMLElement对象下的`addEventListener`**方法**。我们看一下这两个挂载监听器的方式有什么区别。
```
html :  <div id="d1"></div>

js :
        var d1 = document.getElementById('d1');

        //将回调函数赋值给onclick属性
        d1.onclick = function(){}

        //将回调函数当作参数传递给addEventListener方法
        d1.addEventListener('click',function(){})
```
最终实现的效果看起来没有什么区别，但是值得注意的是，因为onclick属性如果被赋值两次，那么毫无疑问后赋值的值会把前赋值的值覆盖掉。类似这样：
```
//第一次赋值
d1.onclick = function(){
    alert('click 1');
}
//第二次赋值
d1.onclick = function(){
    alert('click 2');
}
```
这时候再点击d1，那么浏览器窗口会弹出`click 2`，表示第一个回调被覆盖了，但是使用`addEventListener`就不存在这个问题。所以我们接下来使用这个方法来实现JQ的on方法。
## 实现监听器方法 $().on
稍微复习一下在JQ中的on方法
```
$('.d1').on('click',function(){})
```

1. 第一个参数为事件类型
2. 第二个参数为回调函数

接下来事情比较简单，因为我们的on方法还是在选择器返回的init对象中的，所以继续在init函数（构造器）中添加on方法。
```
//init 中
//时间类型参数为 type，回调函数为 callback
this.on = function(type,callback){
    this.dom.forEach(function(item){
        item.addEventListener(type,callback);
    })
}
```
发现了吗？在我们预处理this.dom为数组类型之后，我们无论什么操作都变得简单了。

简单尝试一下：
```
$('.d1').on('click',function(){
    alert('click emit');
})
```
完全没问题，但是我们接下来要考虑如何实现链式语法。

## 链式语法

其实实现链式语法很简单，我们只要不断`return`一个对象就行了。

但是return哪个对象呢？答案很简单，如果你在chrome的控制台运行过JQ的话，你会发现，返回的仍然是JQ对象，对于我们来说，就是init对象本身。

目前，我们的init对象是这样的：

在我们使用$函数之后，就是说：
```
$('.d1')


return的是：

init{
    dom : [],
    on : function(){},
    attr : function(){},
    __proto__: Object
}
```
所以我们可以在`$('.d1')`之后去调用init对象下的方法和属性。

但我们调用了init对象下的某个方法之后呢？
```
$('.d1').on();

//return undefined
```
这时候因为我们没有指定这个函数的返回值，所以默认为undefined，链式语法也无从说起了。

那链式语法呢，就是在不断地、反复地`return init`

在init对象内部，什么代表init对象本身呢？就是`this`。

以刚刚实现的on方法为例子：
```
this.on = function(type,callback){
    this.dom.forEach(function(item){
        item.addEventListener(type,callback);
    })

    //添加了return
    return this;
}
```
对比一下
```
//之前
$('.d1').on();
//return undefined

//之后
$('.d1').on();
//return init{}
```
init对象还是原来的init，仍然是这样的：
```
init{
    dom : [],
    on : function(){},
    attr : function(){},
    __proto__: Object
}
```
所以接下来，我们就可以开心地去使用链式语法了。

一下是另一个示范：
```
$(.d1)    //选择器，返回init对象，包含on方法
.on()     //还是返回init对象，包含on方法
.on()     //还是返回init对象，还是包含on方法
.attr()   //这里目前我们没有实现，所以返回的是undefined，就不能继续链式语法了
```
这就是链式语法的实现过程，还是有点意思的。

## 给attr方法添加链式语法
我们前面实现了attr，它有两种使用方式，如下所示：
```
html:
        <div id="d1"></div>
js:     
        //获取值
        $('#d1').attr('id')
        //"d1"

        //设置值
        $('#d1').attr('data-index','0')
        //<div id="d1" data-index="0"></div>
```

我们可以注意到这些问题：
1. 如果是获取值的情况（只有一个参数的情况），return的值只能是一个字符串了，就不能使用链式调用了。
2. 但是设置值的情况是操作dom，之后仍然可以`return this`，完成链式语法。

所以我们可以将attr方法修改如下：
```
this.attr = function(){
    var argLength = arguments.length;
    if(argLength == 1){
        var key = arguments[0];

        //第一种情况：获取值返回获取到的属性
        return this.dom[0].getAttribute(key);

    } else if(argLength == 2){
        var key = arguments[0];
        var value = arguments[1];
        this.dom.forEach(function(item){
            item.setAttribute(key,value);
        })

        //第二种情况：设置值，之后链式调用
        return this;

    }
}
```
你可能也注意到了，我将第一种情况的forEach删除了，直接使用`this.dom[0]`来获取，因为我们实际上无法获取全部元素的一个标签属性然后全部返回，仔细想想就可以知道，这样是没办法使用的。

实际上，在JQ中，我们使用的习惯是这样的：
```
$('.d1').each(function(){
    console.log($(this).attr('data-index'));
})
```
这段代码的含义是这样的：
1. 嗲用init对象的each方法，传入一个回调函数去处理**每一个**选中的元素。
2. 使用this表示当前的**这个**元素。

当然具体的each方法我们以后将要实现，这里只是简单解决一下attr返回值的问题。

## 整体代码
请查阅本课文件夹的`demo.js`

## 下节的todo
再次重构JQ的结构，也会第一次开始理解、实现继承的概念。
