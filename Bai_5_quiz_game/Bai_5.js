var ques_pannel_list = document.getElementsByClassName('ques_pannel')

var right_ans_queses = ['a', 'c', 'd', 'b']

var change_choice_list = []
var count_click_ans = 0
var show_ans_timeout = 2000

var ques_flickered_list = []

var selected_ans = true
var noEver_click_modalBase = false

var wrap_ans_color
var color_tick_ans = '#cacb86'
var color_flicker_right_ans = '#5aff6b'
var blurer_color_flicker_right_ans = '#aff8b6'
var color_flicker_wrong_ans = '#ff6537'
var blurer_color_flicker_wrong_ans = '#ffaf97'

// Hàm xử lý
// căn giữa theo chiều dọc với ptu cha tại thời điểm display != none
function alignCenter_absolute_cross(ele_to_align, baseEle) {
    let heightOf_baseEle
    if (getComputedStyle(baseEle).height.match(/[0-9]+/) == null) {
        heightOf_baseEle = 0
    } else {
        heightOf_baseEle = Number(getComputedStyle(baseEle).height.match(/[0-9]+/)[0])
    }
    let total_heightOf_baseEle = heightOf_baseEle +
        Number(getComputedStyle(baseEle).paddingTop.match(/[0-9]+/)[0]) +
        Number(getComputedStyle(baseEle).borderTopWidth.match(/[0-9]+/)[0]) +
        Number(getComputedStyle(baseEle).paddingBottom.match(/[0-9]+/)[0]) +
        Number(getComputedStyle(baseEle).borderBottomWidth.match(/[0-9]+/)[0])
    let total_heightOf_ele_to_align =
        Number(getComputedStyle(ele_to_align).height.match(/[0-9]+/)[0]) || 0 +
        Number(getComputedStyle(ele_to_align).paddingTop.match(/[0-9]+/)[0]) +
        Number(getComputedStyle(ele_to_align).borderTopWidth.match(/[0-9]+/)[0]) +
        Number(getComputedStyle(ele_to_align).paddingBottom.match(/[0-9]+/)[0]) +
        Number(getComputedStyle(ele_to_align).borderBottomWidth.match(/[0-9]+/)[0])
    ele_to_align.style.top =
        (total_heightOf_baseEle - total_heightOf_ele_to_align) / 2 + 'px'
}

// căn giữa theo chiều ngang với ptu cha tại thời điểm display != none
function alignCenter_absolute_horizontal(ele_to_align, baseEle) {
    let widthOf_baseEle
    if (getComputedStyle(baseEle).width.match(/[0-9]+/) == null) {
        widthOf_baseEle = 0
    } else {
        widthOf_baseEle = Number(getComputedStyle(baseEle).width.match(/[0-9]+/)[0])
    }
    let total_widthOf_baseEle = widthOf_baseEle +
        Number(getComputedStyle(baseEle).paddingLeft.match(/[0-9]+/)[0]) +
        Number(getComputedStyle(baseEle).borderLeft.match(/[0-9]+/)[0]) +
        Number(getComputedStyle(baseEle).paddingRight.match(/[0-9]+/)[0]) +
        Number(getComputedStyle(baseEle).borderRight.match(/[0-9]+/)[0])
    let total_widthOf_ele_to_align =
        Number(getComputedStyle(ele_to_align).width.match(/[0-9]+/)[0]) +
        Number(getComputedStyle(ele_to_align).paddingLeft.match(/[0-9]+/)[0]) +
        Number(getComputedStyle(ele_to_align).borderLeft.match(/[0-9]+/)[0]) +
        Number(getComputedStyle(ele_to_align).paddingRight.match(/[0-9]+/)[0]) +
        Number(getComputedStyle(ele_to_align).borderRight.match(/[0-9]+/)[0])
    ele_to_align.style.left =
        (total_widthOf_baseEle - total_widthOf_ele_to_align) / 2 + 'px'
}

function find_parentEle_hasClass(child_ele, ele_class) {
    while (child_ele.classList.contains(ele_class) == false) {
        child_ele = child_ele.parentElement
    }
    return child_ele
}

// nhấp nháy đáp án
function flicker_ans(ans, color_flicker, blur_color_flicker) {
    ans.style.backgroundColor = color_flicker
    let blur_or_full = true
    let count_flicker = 0
    setTimeout(() => {
        ans.style.backgroundColor = blur_color_flicker
    }, 700)
    setTimeout(() => {
        ans.style.backgroundColor = color_flicker
        const flicker = setInterval(() => {
            count_flicker++
            if (blur_or_full) {
                ans.style.backgroundColor = blur_color_flicker
                blur_or_full = false
            } else {
                ans.style.backgroundColor = color_flicker
                blur_or_full = true
            }
            if (count_flicker > 20) {
                ans.style.backgroundColor = color_flicker
                clearInterval(flicker)
            }
        }, 100)
    }, 1200)
}

// quá trình show đáp án
function showAns(choice) {
    ques_flickered_list.push(find_parentEle_hasClass(choice, 'ques_pannel').id)
    for (let wrap_anses of find_parentEle_hasClass(choice, 'ques_pannel')
        .getElementsByClassName('wrap_ans')) {
        wrap_anses.style.pointerEvents = 'none'
    }
    document
        .getElementById(`message_${find_parentEle_hasClass(choice, 'ques_pannel').id}`)
        .style.display = 'block'
    let right_ans_index = find_parentEle_hasClass(choice, 'ques_pannel').id
    right_ans_index = right_ans_index.match(/[0-9]+/)
    let right_ans = right_ans_queses[Number(right_ans_index[0]) - 1]
    let right_ans_flick = document
        .getElementsByClassName(`ans_${right_ans}`)[Number(right_ans_index[0]) - 1]
    flicker_ans(right_ans_flick, color_flicker_right_ans, blurer_color_flicker_right_ans)
    let new_wrap_iconAns = document.createElement('div')
    new_wrap_iconAns.classList.add('wrap_iconAns')
    if (choice.querySelector('.tick_input').value != right_ans) { //ktra nếu ans đã chọn mà khác với đáp án đúng thì hiện màu đỏ
        flicker_ans(choice, color_flicker_wrong_ans, blurer_color_flicker_wrong_ans)
        new_wrap_iconAns.innerHTML =
            `<svg class="iconAns" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">
                <path d="M1.41 0l-1.41 1.41.72.72 1.78 1.81-1.78 1.78-.72.69 1.41 1.44.72-.72 1.81-1.81 1.78 1.81.69.72 1.44-1.44-.72-.69-1.81-1.78 1.81-1.81.72-.72-1.44-1.41-.69.72-1.78 1.78-1.81-1.78-.72-.72z"/>
            </svg>`
        choice.appendChild(new_wrap_iconAns)
    } else {
        new_wrap_iconAns.innerHTML =
            `<svg class="iconAns" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 342.357 342.357">
                <polygon points="290.04,33.286 118.861,204.427 52.32,137.907 0,190.226 118.862,309.071 342.357,85.606 "/>
            </svg>`
        choice.appendChild(new_wrap_iconAns)
    }

    // set CSS cho icon = css
    choice.querySelector('.wrap_iconAns').style.cssText =
        `position: absolute;
        width: fit-content;
        height: 25px;
        right: 10px;`
    choice.querySelector('.iconAns').style.cssText = `height: 100%;`

    // set Top cho icon = js
    alignCenter_absolute_cross(choice.querySelector('.wrap_iconAns'), choice)
}

// Hàm xử lý ----- Build

// quá trình pick đáp án
for (let keys of ques_pannel_list) {
    for (let wrap_ans_choice of keys.getElementsByClassName('wrap_ans')) {
        wrap_ans_choice.addEventListener('click', () => {
            count_click_ans++
            noEver_click_modalBase = true
            if (selected_ans) { //chỉ chọn màu 1 lần
                wrap_ans_color = wrap_ans_choice.style.backgroundColor
            }
            for (let wrap_ans_noChoice of keys.getElementsByClassName('wrap_ans')) {
                wrap_ans_noChoice.style.border = 'none'
                wrap_ans_noChoice.style.backgroundColor = wrap_ans_color
                wrap_ans_noChoice.querySelector('.tick_input').checked = false
            }
            wrap_ans_choice.style.backgroundColor = color_tick_ans
            wrap_ans_choice.style.border = '1.5px black solid'
            wrap_ans_choice.querySelector('.tick_input').checked = true
            const show_ans = setTimeout(() => {
                console.log('\nBộ hẹn giờ trả lời câu hỏi:', show_ans_timeout, 'ms')
                if (noEver_click_modalBase) { //ktra nếu đã kick vào modal base thì stop showAns
                    showAns(wrap_ans_choice)
                }
            }, show_ans_timeout)
            change_choice_list.push({
                show_ans_worker: show_ans,
                ques_id: find_parentEle_hasClass(wrap_ans_choice, 'ques_pannel').id
            })
            if (count_click_ans > 1) { //từ lần kick ans thứ 2 thì bỏ đi setTimeout trc đó
                for (let i = 0; i < change_choice_list.length - 1; i++) {
                    if (change_choice_list[change_choice_list.length - 1].ques_id
                        == change_choice_list[i].ques_id) { //ktra nếu xuất hiện lại event kick vừa rồi thì bỏ event kick ban đầu
                        clearTimeout(change_choice_list[i].show_ans_worker)
                        change_choice_list[i] = ''
                        break
                    }
                }
            }
            selected_ans = false
        })
    }
}

// click modal base của các ques để bỏ chọn ques
document.querySelector('.modal_base_ques').addEventListener('click', (e) => {
    let modal_base = document.querySelector('.modal_base_ques')
    if (e.target == modal_base) {
        noEver_click_modalBase = false
        for (let i = 0; i < ques_pannel_list.length; i++) {
            let this_ans_flickered = false
            for (let j = 0; j < ques_pannel_list.length; j++) {
                if (ques_pannel_list[i].id == ques_flickered_list[j]) { //ktra xem ques nào có trong list đã showAns
                    this_ans_flickered = true
                    break
                }
            }
            if (this_ans_flickered) { continue } //nếu đúng thì ko bỏ chọn ans, sai thì bỏ chọn ans
            for (let wrap_ans_key of ques_pannel_list[i]
                .getElementsByClassName('wrap_ans')) {
                wrap_ans_key.style.border = 'none'
                wrap_ans_key.style.backgroundColor = wrap_ans_color
                wrap_ans_key.querySelector('.tick_input').checked = false
            }
        }
        change_choice_list = []
        count_click_ans = 0
        selected_ans = true //sau khi click vào modal base thì reset lại đk để biến nhận màu
    }
})

// scroll to top
document.querySelector('.modal_base_ques').addEventListener('scroll', () => {
    if (document.querySelector('.modal_base_ques').scrollTop > 0) {
        document.querySelector('#scroll_to_top_btn').style.display = 'flex'
    } else {
        document.querySelector('#scroll_to_top_btn').style.display = 'none'
    }
})
document.querySelector('#scroll_to_top_btn').addEventListener('click', () => {
    document.querySelector('.modal_base_ques').scrollTo({ top: 0, behavior: 'smooth' })
})

// mỗi icon nav menu cách nhau 1 khoảng d (d là góc quay)
var wrap_menu_options_list = document.getElementsByClassName('wrap_menu_options')
let distance_options_below = 24 // khoảng cách toggler cách đầu
let distance_options_above = -66
for (let i = 0; i < wrap_menu_options_list.length; i++) {
    if (i < 4) {
        wrap_menu_options_list[i].style.transform = `rotate(${distance_options_below}deg)`
        distance_options_below -= 21.5 // khoảng cách d
    } else {
        wrap_menu_options_list[i].style.transform = `rotate(${distance_options_above}deg)`
        distance_options_above -= 21.5 // khoảng cách d
    }
}

// mỗi icon nav menu cách transform origin (tâm hình tròn) 1 độ dài d
var border_nav = 
    getComputedStyle(document.querySelector('.nav_menu')).borderRightWidth.match(/[0-9]+/)[0]
for (let icon_nav_menu of wrap_menu_options_list) {
    icon_nav_menu.style.width = (Number(border_nav) * 110) / 100 + 'px' // độ dài d sau dấu *
}

// đưa menu nav vào góc trên bên trái
document.querySelector('.nav_menu').style.top = `-${border_nav}px`
document.querySelector('.nav_menu').style.left = `-${border_nav}px`

// set circle animate cho mỗi icon menu nav
let svg_cir_animate_for_menu_btn
for (let i = 0; i < document.getElementsByClassName('sub_wrap_menu_options').length; i++) {
    let svg_cir_animate = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svg_cir_animate.classList.add('svg_cir_animate')
    let cir_animate = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
    cir_animate.classList.add('cir_animate')
    cir_animate.setAttribute('cx', '50%')
    cir_animate.setAttribute('cy', '50%')
    cir_animate.setAttribute('r', '50%')
    svg_cir_animate.appendChild(cir_animate)
    document.getElementsByClassName('sub_wrap_menu_options')[i].appendChild(svg_cir_animate)
}

// để vòng tròn animate vào tâm wrap
for (let svg_cir_animate_key of document.getElementsByClassName('svg_cir_animate')) {
    alignCenter_absolute_cross(svg_cir_animate_key,
        find_parentEle_hasClass(svg_cir_animate_key, 'sub_wrap_menu_options'))
    alignCenter_absolute_horizontal(svg_cir_animate_key,
        find_parentEle_hasClass(svg_cir_animate_key, 'sub_wrap_menu_options'))
}

// kick vào arrow option làm quay icon menu nav
let rotate_270 = true
let notEver_rotate = true
let degree_rotate
for (let options_0_key of document.getElementsByClassName('sub_wrap_menu_options toggler')) {
    options_0_key.addEventListener('click', () => {
        if (rotate_270) {
            for (let i = 0; i < 4; i++) {
                degree_rotate =
                    Number(wrap_menu_options_list[i].style.getPropertyValue('transform')
                        .match(/-?[0-9]+/)) + 270
                wrap_menu_options_list[i].style.transform = `rotate(${degree_rotate}deg)`
            }
            for (let i = 4; i < wrap_menu_options_list.length; i++) {
                degree_rotate =
                    Number(wrap_menu_options_list[i].style.getPropertyValue('transform')
                        .match(/-?[0-9]+/)) + 90
                wrap_menu_options_list[i].style.transform = `rotate(${degree_rotate}deg)`
            }
            rotate_270 = false
        } else {
            for (let i = 0; i < 4; i++) {
                degree_rotate =
                    Number(wrap_menu_options_list[i].style.getPropertyValue('transform')
                        .match(/-?[0-9]+/)) + 90
                wrap_menu_options_list[i].style.transform = `rotate(${degree_rotate}deg)`
            }
            for (let i = 4; i < wrap_menu_options_list.length; i++) {
                degree_rotate =
                    Number(wrap_menu_options_list[i].style.getPropertyValue('transform')
                        .match(/-?[0-9]+/)) + 270
                wrap_menu_options_list[i].style.transform = `rotate(${degree_rotate}deg)`
            }
            rotate_270 = true
        }
        console.log('degree cua viec rotate: ', degree_rotate)
    })
}

// kick menu btn làm hiện ra menu nav
let clicked_menu_btn = true
document.querySelector('.wrap_menu_btn').querySelector('.wrap_pannel')
    .addEventListener('click', () => {
        if (clicked_menu_btn) {
            document.querySelector('.modal_base_of_wrap_menu_btn').style.display = 'block'
            document.querySelector('.nav_menu').style.transform = `rotate(45deg) scale(1)`
            document.querySelector('.menu_pannel.middle').style.opacity = '0'
            let properties_animation_menuNav = {
                duration: 300,
                fill: 'forwards'
            }
            document.querySelector('.wrap_menu_btn').animate([
                {
                    transform: 'scale(0.7)'
                }
            ], properties_animation_menuNav)
            document.querySelector('.menu_pannel.top').animate([
                {
                    transform: 'rotate(32deg)',
                    marginLeft: '2.5px'
                }
            ], properties_animation_menuNav)
            document.querySelector('.menu_pannel.bottom').animate([
                {
                    transform: 'rotate(-34deg)',
                    marginLeft: '2.5px'
                }
            ], properties_animation_menuNav)
            clicked_menu_btn = false
        } else {
            document.querySelector('.modal_base_of_wrap_menu_btn').style.display = 'none'
            document.querySelector('.nav_menu').style.transform = `rotate(45deg) scale(0)`
            document.querySelector('.menu_pannel.middle').style.opacity = '1'
            let properties_animation_menuNav = {
                duration: 300,
                fill: 'forwards'
            }
            document.querySelector('.wrap_menu_btn').animate([
                {
                    transform: 'scale(1)'
                }
            ], properties_animation_menuNav)
            document.querySelector('.menu_pannel.top').animate([
                {
                    transform: 'rotate(0deg)',
                    marginLeft: '0px'
                }
            ], properties_animation_menuNav)
            document.querySelector('.menu_pannel.bottom').animate([
                {
                    transform: 'rotate(0deg)',
                    marginLeft: '0px'
                }
            ], properties_animation_menuNav)
            clicked_menu_btn = true
        }

        // căn giữa blur conner
        alignCenter_absolute_cross(
            document.querySelector('.shadow_of_discription_conner'),
            document.querySelector('.discription_conner')
        )
        alignCenter_absolute_horizontal(
            document.querySelector('.shadow_of_discription_conner'),
            document.querySelector('.discription_conner')
        )
    })

// kick chỗ trống để thoát menu
document.querySelector('.modal_base_of_wrap_menu_btn').addEventListener('click', (e) => {
    if (e.target == document.querySelector('.modal_base_of_wrap_menu_btn')) {
        document.querySelector('.wrap_pannel').click()
    }
})

// Vị trí của desribe container
document.querySelector('.modal_base_of_wrap_menu_btn')
    .querySelector('.container_describe').style.left =
    Number(getComputedStyle(document.querySelector('.nav_menu'))
        .borderRightWidth.match(/[0-9]+/)) +
    Number(getComputedStyle(document.querySelector('.modal_base_of_wrap_menu_btn')
        .querySelector('.before_ribbon')).height.match(/[0-9]+/)) + 50 + 'px'

// Describe & Execution của các tùy chọn menu nav
let follow_describe_list = {
    execution_pannel: {
        __css: 
            `position: relative;
            background: #6751c1;
            padding: 10px 15px;
            width: 60vw;
            min-height: 30vh;
            border-radius: 10px;
            margin: auto;
            border: 5px white solid;`,
    },
    modal_base_of_execution_pannel: {
        __css:
            `display: flex;
            position: fixed;
            background: #000000a1;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 11;`
    },
    toggler: {
        descibe: `<p>- Chuyển tùy chọn</p>`
    },
    support: {
        descibe: `<p>- Liên hệ với bộ phận hỗ trợ</p>`,
        execution: {
            __main:
                `<div class="execution">
                    Chưa được thiết lập
                </div>`,
            __css:
                ``
        }
    },
    setting: {
        descibe:
            `<p>- Cài đặt cá nhân</p>
            <p>- Cài đặt bộ hẹn giờ cho các câu hỏi</p>`,
        execution: {
            __main:
                `<div class="execution">
                    Nhập thời gian cho bộ hẹn giờ !!!
                </div>
                <div class="wrap_input_timein">
                <input class="timein" type="number" placeholder="Nhập từ 0 đến 10" required>
                    <p>giây</p>
                </div>
                <div class="confirm">Oke</div>`,
            __css_wrapInputTimein_class:
                `width: 70%;
                height: 15%;
                margin: 20px auto;`,
            __css_wrapInputTimein_class_inputTag:
                `width: 70%;
                height: 28px;
                padding: 0 2px 0 10px;
                border-radius: 5px;
                outline: none;
                font-size: 18px;
                font-weight: bold;
                font-family: 'Engender Mod', sans-serif;`,
            __css_wrapInputTimein_class_pTag:
                `display: inline;
                margin-left: 5px;
                font-size: 18px;
                font-weight: bold;
                font-family: 'Engender Mod', sans-serif;`,
            __css_confirm_class:
                /* right & bottom dc css ở mục "click tùy chọn menu làm hiện lên pannel > 
                css cho setting execution > css cho nút Oke" */
                `position: absolute;
                background: #8070c0;
                padding: 10px 20px;
                border: 2px black solid;
                border-radius: 5px;
                transition: all 0.3s;
                cursor: pointer;
                font-size: 16px;
                font-weight: bold;
                font-family: 'Engender Mod', sans-serif`
        }
    },
    chatting: {
        descibe: `<p>- Chat với những người chơi đang online</p>`,
        execution: {
            __main:
                `<div class="execution">
                    Chưa được thiết lập
                </div>`,
            __css:
                ``
        }
    },
    favourite: {
        descibe: `<p>- Yêu thích của tôi</p>`,
        execution: {
            __main:
                `<div class="execution">
                    Chưa được thiết lập
                </div>`,
            __css:
                ``
        }
    },
    rules: {
        descibe: `<p>- Luật chơi</p>`,
        execution: {
            __main:
                `<div class="execution">
                    HƯỚNG DẪN CÁCH CHƠI =)
                    <br> <br>
                    Chọn 1 đáp án và đợi bộ hẹn giờ kết thúc sau đó đáp án đúng sẽ hiện lên,
                    có thể vào mục "Setting" để chỉnh thời gian cho bộ hẹn giờ.
                </div>`,
            __css:
                ``
        }
    },
    home: {
        descibe: `<p>- Trang chủ</p>`,
        execution: {
            __main:
                `<div class="execution">
                    Chưa được thiết lập
                </div>`,
            __css:
                ``
        }
    }
}

let follow_describe_keys_list = []
let follow_describe = document.createElement('div')
follow_describe.classList.add('follow_describe')
let wrap_follow_describe = document.createElement('div')
let before_ribbon = document.createElement('div')
let after_ribbon = document.createElement('div')

// hover vào tùy chọn làm hiện ra describe
for (let options_describe_key of document.getElementsByClassName('sub_wrap_menu_options')) {
    options_describe_key.addEventListener('mouseenter', function () {
        let className_of_ele
        for (let i = 0; i < Object.keys(follow_describe_list).length; i++) {
            follow_describe_keys_list[i] = Object.keys(follow_describe_list)[i]
        }
        for (let follow_describe_keys_list_key of follow_describe_keys_list) {
            if (this.querySelector('.option_icon')
                .classList.value.match(follow_describe_keys_list_key) != null) {
                className_of_ele = this.querySelector('.option_icon')
                    .classList.value.match(follow_describe_keys_list_key)
                wrap_follow_describe.innerHTML = follow_describe_list[className_of_ele].descibe
            }
        }

        // add desribe và add wrap_desribe
        follow_describe.appendChild(wrap_follow_describe)
        document.querySelector('.modal_base_of_wrap_menu_btn')
            .querySelector('.container_describe').appendChild(follow_describe)

        // add ribbon
        before_ribbon.classList.add('before_ribbon')
        document.querySelector('.modal_base_of_wrap_menu_btn')
            .querySelector('.follow_describe').appendChild(before_ribbon)
        after_ribbon.classList.add('after_ribbon')
        document.querySelector('.modal_base_of_wrap_menu_btn')
            .querySelector('.follow_describe').appendChild(after_ribbon)

        // set css cho div follow_describe (nằm dưới cùng)
        follow_describe.style.cssText =
            `position: absolute;
            background: ${getComputedStyle(document.querySelector('.modal_base_of_wrap_menu_btn')
                .querySelector('.wrap_describe')).background};
            left: -${getComputedStyle(document.querySelector('.modal_base_of_wrap_menu_btn')
                    .querySelector('.container_describe')).borderWidth};
            border: ${getComputedStyle(document.querySelector('.modal_base_of_wrap_menu_btn')
                        .querySelector('.container_describe')).border};
            border-radius: 5px;
            transform: rotateX(-90deg);
            transform-origin: 50% 0;`

        // set css cho wrap_follow_describe và follow describe text
        wrap_follow_describe.style.cssText =
            `position: relative;
            left: -0.5px;
            bottom: -0.5px;
            z-index: 3;
            background: ${getComputedStyle(document.querySelector('.modal_base_of_wrap_menu_btn')
                .querySelector('.wrap_describe')).background};
            width: ${getComputedStyle(document.querySelector('.modal_base_of_wrap_menu_btn')
                    .querySelector('.wrap_describe')).width};
            padding: ${getComputedStyle(document.querySelector('.modal_base_of_wrap_menu_btn')
                        .querySelector('.wrap_describe')).padding};
            transform-origin: 50% 0;`
        for (let follow_describe_text of follow_describe.getElementsByTagName('p')) {
            follow_describe_text.style.cssText =
                `margin: 0;
                font-family: Arial, Helvetica, sans-serif;
                font-weight: bold;`
        }
        document.querySelector('.container_describe').style.transform = 'rotateX(90deg)'
    })
    options_describe_key.addEventListener('mouseleave', function () {
        document.querySelector('.container_describe').style.transform = 'rotateX(0deg)'
    })
}

// click tùy chọn menu làm hiện lên pannel
let modal_base_of_execution_pannel = document.createElement('div')
modal_base_of_execution_pannel.classList.add('modal_base_of_execution_pannel')
let execution_pannel = document.createElement('div')
execution_pannel.classList.add('execution_pannel')
for (let sub_wrap_menu_options_key of document.querySelectorAll('.sub_wrap_menu_options:not(.toggler)')) {
    sub_wrap_menu_options_key.addEventListener('click', function () {
        document.querySelector('.wrap_pannel').click()

        // css cho modal base của execution pannel
        modal_base_of_execution_pannel.style.cssText = 
            follow_describe_list['modal_base_of_execution_pannel'].__css

        document.querySelector('.modal_base_ques').appendChild(modal_base_of_execution_pannel)
        for (let follow_describe_list_key in follow_describe_list) {
            if (this.querySelector('.option_icon').classList.contains(follow_describe_list_key)) {
                execution_pannel.innerHTML =
                    follow_describe_list[follow_describe_list_key].execution.__main
                execution_pannel.classList.add(follow_describe_list_key)
            }
        }
        modal_base_of_execution_pannel.appendChild(execution_pannel)

        // css cho execution pannel
        execution_pannel.style.cssText = follow_describe_list['execution_pannel'].__css

        // css cho tất cả các execution
        document.querySelector('.modal_base_ques').querySelector('.execution').style.cssText =
            `font-family: 'Engender Mod', sans-serif;
            font-size: 25px;
            font-weight: bold;
            color: white;
            text-align: center;`

        // css cho setting execution
        if (this.querySelector('.option_icon').classList.contains('setting')) {
            document.querySelector('.execution_pannel').querySelector('.wrap_input_timein')
                .style.cssText =
                follow_describe_list['setting'].execution.__css_wrapInputTimein_class
            document.querySelector('.execution_pannel').querySelector('.wrap_input_timein')
                .querySelector('input').style.cssText =
                follow_describe_list['setting'].execution.__css_wrapInputTimein_class_inputTag
            document.querySelector('.execution_pannel').querySelector('.wrap_input_timein')
                .querySelector('p').style.cssText =
                follow_describe_list['setting'].execution.__css_wrapInputTimein_class_pTag

            // css cho nút confirm Oke
            document.querySelector('.execution_pannel').querySelector('.confirm')
                .style.cssText = follow_describe_list['setting'].execution.__css_confirm_class
            document.querySelector('.execution_pannel').querySelector('.confirm')
                .style.bottom = Number(getComputedStyle(document.querySelector('.execution_pannel'))
                    .borderRightWidth.match(/[0-9]+/)) + 10 + 'px'
            document.querySelector('.execution_pannel').querySelector('.confirm')
                .style.right = Number(getComputedStyle(document.querySelector('.execution_pannel'))
                    .borderBottomWidth.match(/[0-9]+/)) + 10 + 'px'

            // kick vào nút confirm
            document.querySelector('.execution_pannel').querySelector('.confirm')
                .addEventListener('click', function () {
                    if (document.querySelector('.execution_pannel')
                            .querySelector('.timein').value != '' &&
                        Number(document.querySelector('.execution_pannel')
                            .querySelector('.timein').value) <= 10 &&
                        Number(document.querySelector('.execution_pannel')
                            .querySelector('.timein').value) >= 0) {
                        show_ans_timeout = Number(document.querySelector('.execution_pannel')
                            .querySelector('.timein').value) * 1000

                        console.log('\nBộ hẹn giờ trả lời câu hỏi:', show_ans_timeout, 'ms')

                        document.querySelector('.modal_base_of_execution_pannel')
                            .style.display = 'none'
                    } else {
                        alert('Nhập sai rùi, nhập lại đê !! Nhớ là nhập từ 0 đến 10 thui !!')
                    }
                })

            // hover css cho nút confirm
            document.querySelector('.execution_pannel').querySelector('.confirm')
                .addEventListener('mouseenter', function () {
                    this.style.backgroundColor = '#b6aed8'
                })
            document.querySelector('.execution_pannel').querySelector('.confirm')
                .addEventListener('mouseleave', function () {
                    this.style.backgroundColor = '#8070c0'
                })
        }

        // kick modal base của execution
        modal_base_of_execution_pannel.addEventListener('click', (e) => {
            if (e.target == modal_base_of_execution_pannel) {
                modal_base_of_execution_pannel.style.display = 'none'
            }
        })
    })
}