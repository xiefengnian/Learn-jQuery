## 使用继承改进框架
现在，我们的框架经过两次改进之后，整体的结构看起来是这样的：
```
//初始化方法
var init = function(selector){

    //删除首字母的函数，是类中的 私有 函数
    var removeStringFirst = function(){};

    //存放选择器结果（HTMLElement）的数组
    this.dom = [];

    //监听器方法
    this.on = function(){};

    //属性方法
    this.attr = function(){};
}

//选择器方法
var $ = function(selector){
    return new init(selector);
}
```
基于目前这个框架，我们可以注意到一下这几点：
1. 选择器方法调用的时候，使用了构造器，每次都会new一个新的对象。
2. 每个对象包含了同样的方法，但是对于每个方法来说，调用的时候，属于的对象都不一样，操作的this.dom都不一样。
3. 我们每一个操作，都是附带（绑定）在某一个对象上的。

以上的这些特征，其实就涉及到了面向对象的一些特点了，我们再继续往下看。

我们做的JQ这个框架至少有一下特点：
1. 我们为每一次操作（在页面中选择不同*归类*的元素）获得的元素都与操作他相关的函数绑定在了一次，这个过程称之为**封装**；
2. 我们发现，每个对象里的方法都是一样的，但是调用后**操作的元素**都不一样，这个过程称之为**多态**；

OK，其实代码比较朴实，但是我们实现了**面向对象**中的三个特征：
`封装`
`继承`
`多态`
之中的两个了。

接下来我们还有一位小弟弟`继承`没有实现，但是我们能用到什么地方呢？

## JQ的extend方法
首先我们介绍一个JQ的方法：`extend`，这个方法用来给JQ添加一些新的方法。
例如：
```
$.prototype.extend({
    a : function(){
        alert('新的a方法');
    }
})
//先忽略令人难受的prototype，因为我们接下来就要理解它

//以上代码执行完之后，之后任意的JQ选择器返回的对象中就包含了a方法
//例如：

$('.d1').a();    //浏览器中弹出了'新的a方法'
```
这个是我们这节课的重点了解内容。

假如我们要在我们的代码中实现这个方法应当怎么办呢？

可以这么办。
```
var init = function(){
    this.extend = function(obj){
        for(var key in obj){
            this[key] = obj[key];
        }
        return this;
    }
}
```
这样实现了额extend方法，包括以后很多的方法我们都可以继续延续这样的方式去实现，但是存在一个问题：

如果我们的方法越来越多，init函数将会变得非常混乱，代码的复用性和结构性都不算太好，因为我们init方法只是想将其定义为初始化方法，不适合在其中添加太多的内容。

那怎么办呢？
我们接下来要用继承来解决这个问题。

## 继承的概念
继承很简单，在生活中就是：你身上的某些特征，性质都从你父母中**遗传**过来的。或者说，你继承了你的父母的某些**属性**。

在编程中是什么概念呢？

`一个对象可以继承另外一个对象的属性和方法（在构造器层面实现的）`

假如：
* 把猫定义作一个类，猫都有一些共同的特征(例如抓鱼[catchFish]，抓老鼠[catchMouse]，花色[suit])
* 把狗定义为一个类，狗也有一个共同的特征（看家[watchOverHome]，啃骨头[chewBones]）
* 但是猫和狗，都是动物，动物有一些共同的特征（呼吸[breath]，进食[eat]，年龄[age]）

所以我们可以这么理解：

* **猫** 和 **狗** 都是 **动物**。
* **猫** 和 **狗** 肯定带有了动物的全部特点（毫无疑问无论是哪只猫哪只狗都有 *年龄* 并且可以 *呼吸* 和 *吃东西* ）。

也就是说（专业地说）：猫和狗都继承自动物

尝试用代码描述一下三个类：（注意猫和狗都具有动物的全部特征）
```
var Cat = function(suit,age){
    //这是猫这个类的特征
    this.catchFish = function(){}
    this.catchMouse = function(){}
    this.suit = suit;

    //但是还要包含动物类的特征
    this.breath = function(){}
    this.eat = function(){}
    this.age = age;
}

var Dog = function(age){
    //这是狗这个类的特征
    this.watchOverHome = function(){}
    this.chewBones = function(){}

    //但是还要包含动物类的特征
    this.breath = function(){}
    this.eat = function(){}
    this.age = age;
}

//代码好啰嗦！

var Animal = function(age){
    this.breath = function(){}
    this.eat = function(){}
    this.age = age;
}

```

以上我们实现了 *猫* *狗* *动物* 三个类，并且保证了**猫和狗类都包含了动物类的属性**，但是这样的方式很不明智。

可能会存在这样的问题：
1. 如果类越来越多，类之间也有继承关系，你就只能无限去复制粘贴然后去检查代码错误了。
2. 这样无法体现面向对象技术的优越性。

所以我们要开始搞一个东西，继承～

## JS中实现继承了两种方式
要在JS中实现继承，有两中方法。
1. 使用我们上节课说的call方法，调用另外一个构造器帮我们实现这个构造器中的一部分，也就相当于实现了继承。
2. 另一个就是使用函数的一个特殊的属性（没错，函数像对象一样拥有属性，并且拥有一个特别的属性）`prototype`。

#### 先介绍第一种
我们就以猫（Cat）和动物（Animal）类为例子把。
```
var Animal = function(age){
    this.age = age;
    this.eat = function(){}
}

var Cat = function(suit,age){
    this.suit = suit;
    this.catchFish = function(){}

    //调用了Animal构造器来帮忙实现age属性和eat方法
    //用this，就是将要产生的对象，代替Animal将要产生的对象
    Animal.call(this,age);
}

```

```
//结果是这样的
new Cat('橘色',3);

Cat{
    suit : "橘色",
    age : 3,
    eat : function(){},
    catchFish : function(){}
}
```

这时候，我们new的Cat对象中包含了`Animal`对象和`Cat`对象中的全部属性和方法。这时候就实现了第一种继承方式。

另外我们用`Dog`类继承`Animal`的例子再加深一下理解。
```
var Animal = function(age){
    this.age = age;
    this.eat = function(){}
}

var Dog = function(age){
    this.watchOverHome = function(){};
    this.chewBones = function(){}

    //调用了Animal构造器来帮忙实现age属性和eat方法
    //用this，就是将要产生的对象，代替Animal将要产生的对象
    Animal.call(this,age);
}

//测试
new Dog(3);

//结果
Dog{
    age : 3,
    eat : function(){},
    watchOverHome : function(){},
    chewBones : function(){}
}
```

#### 另一种是原型继承
同样是实现猫和动物类之间的继承，我们直接使用原型继承，等下再说明。
```
var Animal = function(){
    this.eat = function(){}
}
var Dog = function(){
    this.chewBones = function(){}
}

Dog.prototype = new Animal();
//原型继承没法继承属性，只能继承方法
//此处不确定，如果此处有错，务必帮忙指正
```

```
//测试
new Dog();

//结果
Dog{
    chewBones : function(){}
    __proto__ : Animal
}
```
咦？Animal类的方法呢？
我们仔细看，这个对象和之前的init对象有些不同，不同在哪呢？在\__proto__属性上。

我们对比一下：
```
//init对象
init{
    __proto__ : Object
}

//Dog对象
Dog{
    __proto__ : Animal
}
```
我们发现init的原型(\__proto__)是Object对象，Dog的原型(\__proto__)是Animal对象。

这说明了任何的对象（最终）都是继承自一个基础的JS类型：`Object`。

在这里，我们通过对构造器prototype属性赋值实现了继承。我们总结一下，其实很简单：
***如果对构造器的prototype属性赋值一个对象，那么这个构造器产生的全部对象都会这个对象其作为其原型对象***

并且，在JS中，一个对象可以直接调用它的原型对象的属性和方法。

试一下：
```
var d = new Dog();
d.eat()  //=>undefined
```
测试表明，在Dog构造器中构造的对象包含了其原型Animal对象的方法。

原型继承不得不说，在JS中更为常见，也更为*官方*，我们通过这么一种简单的方式，了解了一下，接下来我们要在JQ中使用它了。

## 在JQ中使用原型继承

在实现之前，我们先注意几点：
1. 原型继承是给构造器的prototype属性赋值为一个新的对象
2. 原型继承无法继承属性
3. 所以我们将一些方法提取到原型对象中，然后实现继承

（其实原型继承的感觉给人不太像继承，如果你有JAVA等“正式”的语言的惊艳的话，你可能会觉得JS的继承很水）

```
//初始化方法
var init = function(selector){

    //删除首字母的函数，是类中的 私有 函数
    var removeStringFirst = function(){};

    //存放选择器结果（HTMLElement）的数组
    this.dom = [];
}

init.prototype = {
    on : function(){},
    attr : function(){},
    extend : function(){}
}

//选择器方法
var $ = function(selector){
    return new init(selector);
}
```

## 整体代码
查看demo.js

## Next class todo
1. 实现JQ的获取某一元素选择方法：

`$(".d1").eq()`和

`$(".d1").get()`
2. 实现父和子选择器：
`$(".d1").parents([selector])`

`$(".d1").childrens([selector])`

以及回调中的

`$(this)`
