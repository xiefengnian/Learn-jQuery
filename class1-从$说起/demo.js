var init = function (selector) {
    var removeStringFirst = function (str) {
        var charArr = str.split('');
        charArr.shift();
        return charArr.join('');
    }

    this.dom = null;                //存放选择到的元素

    var firstChar = selector[0];    //获取首字符
    if (firstChar == '.') {           //实现class选择器
        selector = removeStringFirst(selector);
        this.dom = document.getElementsByClassName(selector);
        console.log(this.dom);
    }
    else if (firstChar == '#') {       //实现id选择器
        selector = removeStringFirst(selector);
        this.dom = document.getElementById(selector);
        console.log(this.dom);
    }
    else {                           //实现标签选择器
        this.dom = document.getElementsByTagName(selector);
        console.log(this.dom);
    }
}
var $ = function (selector) {
    return new init(selector);
}