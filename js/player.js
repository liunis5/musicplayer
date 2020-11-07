// 进度条拖动
const bindEvent1 = (audio, length) => {
    let inner = e('.inner')
    let outer = e('.outer')
    let dot = e('.dot')
    let result = e('.info__album')

    // 获取最外层 outer 元素的宽度, 进度条不能超过这个值
    let max = outer.offsetWidth
    // 用开关来表示是否可以移动, 可以按下开关的时候才能移动
    let moving = false

    // 初始偏移量
    let offset = 0

    dot.addEventListener('mousedown', (event) => {
        log('event', event.clientX, dot.offsetLeft, event.clientX - dot.offsetLeft)
        // event.clientX 是浏览器窗口边缘到鼠标的距离
        // dot.offsetLeft 是 dot 元素左上角到父元素左上角的距离
        // offset 就是父元素距离浏览器窗口边缘的距离, 注意这个值基本上是不变的
        offset = event.clientX - dot.offsetLeft
        moving = true
    })

    document.addEventListener('mouseup', (event) => {
        moving = false
    })

    document.addEventListener('mousemove', (event) => {
        if (moving) {
            // 离浏览器左侧窗口当前距离减去父元素距离浏览器左侧窗口距离就是
            // dot 移动的距离
            let x = event.clientX - offset
            // dot 距离有一个范围, 即 0 < x < max
            if (x > max) {
                x = max
            }
            if (x < 0) {
                x = 0
            }
            let width = (x / max) * 100
            inner.style.width = String(width) + '%'
            // result.innerHTML = x

            audio.currentTime = x / max * length
        }
    })
}

// 显示时间 进度条，canplay timeupdate事件
const timeText = (length) => {
    // 因为 length 是以 秒 为单位的 浮点数
    let minute = Math.floor(length / 60)
    let second = Math.floor(length % 60)
    let t = ``
    // 此处进行，分 与 秒 的处理。
    if (second > 9) {
        t = `0${minute}:${second}`
        // log('长度显示为', t, '秒数大于9')
    } else {
        t = `0${minute}:0${second}`
        // log('长度显示为', t, '秒数小于10')
    }
    return t
}
const bindTime = (audio, length) => {
    let inner = e('.inner')
    let time = 0
    let width = 0

    let t2 = timeText(length)
    let t3 = e('.info__album')

    audio.addEventListener('timeupdate', (event) => {
        log('timeupdate')
        time = audio.currentTime
        width = (time / length) * 100
        inner.style.width = String(width) + '%'

        let t1 = timeText(time)
        t3.innerHTML = t1 + ' / ' + t2
    })
}

const showsong = (index, Music) => {
    let song = Music[index].split('.')[0]
    log(song)
    let songname = song.split('-')[0]
    let songer = song.split('-')[1]

    let sn = e('.info__song')
    let se = e('.info__artist')

    sn.innerHTML = songname
    se.innerHTML = songer
}
const audioplay = (audio, Music) => {
    let index = audio.dataset.active
    audio.addEventListener('canplay', () => {
        let length = audio.duration
        showsong(index, Music)
        bindTime(audio, length)
        bindEvent1(audio, length)
    })
}

// end 事件，播放完成 判断 随机或者循环
const choice = function(array) {
    // 1. 得到  0 - 1 之间的小数 a
    // 2. 把 a 转成 0 - array.length 之间的小数
    // 3. 得到 0 - array.length - 1 之间的整数作为下标
    // 4. 得到 array 中的随机元素
    let a = Math.random()
    a = a * array.length
    let index = Math.floor(a)
    log('index', index)
    return index
}

const func1 = (audio) => {
    audio.currentTime = 0
    audio.pause()
}

const func2 = (audio, Music) => {
    let nextIndex = choice(Music)
    songPlay(audio, nextIndex, Music)
    audio.play()
}

const func3 = (audio) => {
    audio.currentTime = 0
    audio.play()
}

const func4 = (audio, Music) => {
    let index = parseInt(audio.dataset.active, 10)
    let len = Music.length
    let nextIndex = (index + 1 + len) % len
    songPlay(audio, nextIndex, Music)
    audio.play()
}

const bindEnd = (audio, Music) => {
    let once = e('.fa-long-arrow-right')
    let random = e('.fa-random')
    let singlecycle = e('.fa-undo')
    let loop = e('.fa-refresh')

    let a = audio.dataset.action


    once.addEventListener('click', () => {
        if (a !== '1') {
            audio.dataset.action = 1
        }
    })

    random.addEventListener('click', () => {
        if (a !== '2') {
            audio.dataset.action = 2
        }
    })

    singlecycle.addEventListener('click', () => {
        if (a !== '3') {
            audio.dataset.action = 3
        }
    })

    loop.addEventListener('click', () => {
        if (a !== '4') {
            audio.dataset.action = 4
        }
    })

    let num = {
        '1': func1,
        '2': func2,
        '3': func3,
        '4': func4,
    }
    audio.addEventListener('ended', () => {
        log('ended')
        let b = audio.dataset.action
        log('jinru', b)
        if (Object.keys(num).includes(b)) {
            // f 这个时候是一个函数
            let f = num[b]
            f(audio, Music)
        }
    })
}


// 按钮事件
const songPlay = (audio, nextIndex, Music) => {

    let nextMusic = Music[nextIndex]
    audio.src = 'song/' + nextMusic
    audio.dataset.active = nextIndex

    log(nextMusic, nextIndex,)
    audioplay(audio, Music)
}

const tooglebutton = (musbutton) => {
    for (let i = 0; i < musbutton.length; i++) {
        let e = musbutton[i]
        e.classList.toggle('active')
    }
}
const songtoo = () => {
    let butplay = e('.play')
    let butpause = e('.pause')
    if (butplay.classList.contains('active')) {
        butplay.classList.toggle('active')
        butpause.classList.toggle('active')
    }
}

const musicPlay = (audio, musbutton) => {
    log('play')
    audio.play()
    tooglebutton(musbutton)
}
const musicPause = (audio, musbutton) => {
    log('pause')
    audio.pause()
    tooglebutton(musbutton)
}
const musicNext = (audio, nextIndex, Music) => {
    log('next')

    songPlay(audio, nextIndex, Music)
    songtoo()

}
const musicLast = (audio, nextIndex, Music) => {
    log('last')
    songPlay(audio, nextIndex, Music)
    songtoo()

}

const funcOn = (event, mapper1, mapper2, Music) => {
    let audio = e('#id-audio-player')
    let musbutton = es('.musbutton')

    let self = event.target
    let action = self.dataset.action
    let offsetNumber = self.dataset.offset || '0'

    let offset = parseInt(offsetNumber, 10)
    let index = parseInt(audio.dataset.active, 10)
    let len = Music.length

    let nextIndex = (index + offset + len) % len


    // 说明 action 对应的 key 在 mapper 中
    if (Object.keys(mapper1).includes(action)) {
        // f 这个时候是一个函数
        let f = mapper1[action]
        f(audio, musbutton)
    } else if (Object.keys(mapper2).includes(action)) {
        let f = mapper2[action]
        f (audio, nextIndex, Music)
    }
}

const bindEventDelegate = (Music, mapper1, mapper2) => {
    let button = e('.body__buttons')
    button.addEventListener('click', (event) => {
        funcOn(event, mapper1, mapper2, Music)
    })
}

const bindEvents = function(Music) {
    let mapper1 = {
        'play': musicPlay,
        'pause': musicPause,
    }

    let mapper2 = {
        'last': musicLast,
        'next': musicNext,
    }
    bindEventDelegate(Music, mapper1, mapper2)
}

const __main = function() {
    let Music = [
        '未见青山老-以冬.mp3',
        'To Zanarkand-植松伸夫.mp3',
        '司南歌-双笙&肥皂菌.mp3',
    ]

    bindEvents(Music)
    let audio = e('#id-audio-player')
    audioplay(audio, Music)

    // bindEvent1(audio)

    bindEnd(audio, Music)
}

__main()
