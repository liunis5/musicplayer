const log = console.log.bind(console)

const e = function(selector) {
    let element = document.querySelector(selector)
    if (element === null) {
        let s = `元素没找到，选择器 ${selector} 没有找到或者 js 没有放在 body 里`
        alert(s)
        return null
    } else {
        return element
    }
}

const es = function(selector) {
    let elements = document.querySelectorAll(selector)
    if (elements.length === 0) {
        let s = `元素没找到，选择器 ${selector} 没有找到或者 js 没有放在 body 里`
        // alert(s)
        return []
    } else {
        return elements
    }
}

const removeClassAll = function(className) {
    let selector = '.' + className
    let elements = es(selector)
    for (let i = 0; i < elements.length; i++) {
        let e = elements[i]
        // log('classname', className, e)
        e.classList.remove(className)
    }
}


// find 函数可以查找 element 的所有子元素
const find = function(element, selector) {
    let e = element.querySelector(selector)
    if (e === null) {
        let s = `元素没找到，选择器 ${selector} 没有找到或者 js 没有放在 body 里`
        alert(s)
        return null
    } else {
        return e
    }
}

const findAll = function(element, selector) {
    let es = element.querySelectorAll(selector)
    if (es === null) {
        let s = `元素没找到，选择器 ${selector} 没有找到或者 js 没有放在 body 里`
        alert(s)
        return null
    } else {
        return es
    }
}

const bindEvent = function(element, eventName, callback) {
    element.addEventListener(eventName, callback)
}

const bindAll = function(selector, eventName, callback) {
    let elements = es(selector)
    for (let i = 0; i < elements.length; i++) {
        let e = elements[i]
        bindEvent(e, eventName, callback)
    }
}

const appendHtml = function(element, html) {
    element.insertAdjacentHTML('beforeend', html)
}
