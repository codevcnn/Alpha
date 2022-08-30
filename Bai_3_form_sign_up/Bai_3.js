var form_sign_up = document.getElementById('form_sign_up')

var fullName = document.getElementById('fullName')
var userName = document.getElementById('userName')
var email = document.getElementById('email')
var password = document.getElementById('password')
var retype_password = document.getElementById('retype_password')

var list_TextInput = [fullName , userName , email , password , retype_password]

var valid_fullName_regex = /^[a-zA-Z]+\s[a-zA-Z]{2,}$|^[a-zA-Z]{2,}\s[a-zA-Z]+$/
var valid_userName_regex = /^[a-zA-Z0-9_]{3,20}$/
var valid_email_regex = /^[a-zA-Z_]\w+?@[a-zA-Z]{2,}\.[a-z]{2,}$/

var valid_textInputs = 0
var validPassword = false

$(document).ready(function(){
    $('#form_bottom #submit_btn').click(function () {
        if(fullName.value == ''){
            $('#fullName').parent().next('.error_notice').slideDown(200)
        }
        if(userName.value == ''){
            $('#userName').parent().next('.error_notice').slideDown(200)
        }
        if(email.value == ''){
            $('#email').parent().next('.error_notice').slideDown(200)
        }
        if(password.value == ''){
            $('#password').parent().next('.error_notice').slideDown(200)
        }
        if(retype_password.value == ''){
            $('#retype_password').parent().next('.error_notice').slideDown(200)
        }
        if($('#condition_to_signUp').hasClass('fake_condition_tick') == false){
            $('#notify_modal').css('display','block')
            $('#notify_board').css('transform','scaleX(1)')
        }
        for(let i = 0 ; i < 3 ; i++){
            if($('.icon.tick').eq(i).css('display') === 'block'){
                valid_textInputs++
            }
        }
        if(valid_textInputs == 
            3 && validPassword == 
            true &&  retype_password.value == 
            password.value && $('#condition_to_signUp').hasClass('fake_condition_tick')){
                console.log('submit form_1 and finish this Demo')
                // form_sign_up.submit()
        }
        valid_textInputs = 0
    })
})

// [trượt message xuống khi focus or nhấn phím
$(document).ready(function(){
    $('.form_group input#fullName').on('keydown',function () {
        $(this).parent().siblings('.error_notice').slideUp(200)
    })
    $('.form_group input#userName').on('keydown',function () {
        $(this).parent().siblings('.error_notice').slideUp(200)
    })
    $('.form_group input#email').on('keydown',function () {
        $(this).parent().siblings('.error_notice').slideUp(200)
    })
})
// trượt message xuống khi focus or nhấn phím].

// [duyệt 3 input đầu của dấu tick xanh
$(document).ready(function(){
    $('.form_group input#fullName').keyup(function () {
        if(valid_fullName_regex.test(this.value.trim()) == true){
            $(this).siblings('.icon.tick').css('display','block')
            $(this).css('border','none')
        }
        if(valid_fullName_regex.test(this.value.trim()) == false){
            $(this).siblings('.icon.tick').css('display','none')
            $(this).css('border','1.7px red solid')
        }
    })
})

$(document).ready(function(){
    $('.form_group input#userName').keyup(function () {
        if(valid_userName_regex.test(this.value.trim()) == true){
            $(this).siblings('.icon.tick').css('display','block')
            $(this).css('border','none')
        }
        if(valid_userName_regex.test(this.value.trim()) == false){
            $(this).siblings('.icon.tick').css('display','none')
            $(this).css('border','1.7px red solid')
        }
    })
})

$(document).ready(function(){
    $('.form_group input#email').keyup(function () {
        if(valid_email_regex.test(this.value.trim()) == true){
            $(this).siblings('.icon.tick').css('display','block')
            $(this).css('border','none')
        }
        if(valid_email_regex.test(this.value.trim()) == false){
            $(this).siblings('.icon.tick').css('display','none')
            $(this).css('border','1.7px red solid')
        }
    })
})
// duyệt 3 input đầu của dấu tick xanh].

// [duyệt 2 input cuối
$(document).ready(function(){
    $('.form_group #password').keyup(function () {
        if(/.{6,}/.test(this.value) == true){
            $(this).parent().siblings('.error_notice').children().eq(0).slideUp(200)
            validPassword = true
        }
        if(/[0-9]+/.test(this.value) == true){
            $(this).parent().siblings('.error_notice').children().eq(1).slideUp(200)
            validPassword = true
        }
        if(/[A-Z]+/.test(this.value) == true){
            $(this).parent().siblings('.error_notice').children().eq(2).slideUp(200)
            validPassword = true
        }
        if(/[@*_-]+/.test(this.value) == true){
            $(this).parent().siblings('.error_notice').children().eq(3).slideUp(200)
            validPassword = true
        }
        if(/.{6,}/.test(this.value) == false){
            $(this).parent().siblings('.error_notice').children().eq(0).slideDown(200)
            validPassword = false
        }
        if(/[0-9]+/.test(this.value) == false){
            $(this).parent().siblings('.error_notice').children().eq(1).slideDown(200)
            validPassword = false
        }
        if(/[A-Z]+/.test(this.value) == false){
            $(this).parent().siblings('.error_notice').children().eq(2).slideDown(200)
            validPassword = false
        }
        if(/[@*_-]+/.test(this.value) == false){
            $(this).parent().siblings('.error_notice').children().eq(3).slideDown(200)
            validPassword = false
        }
    })
    $('.form_group #password').keyup(function () {
        if(retype_password.value == password.value && retype_password.value != ''){
            $('.form_group #retype_password').parent().siblings('.error_notice').children().slideUp(200)
        }
        else if(retype_password.value != password.value && retype_password.value != ''){
            $('.form_group #retype_password').parent().siblings('.error_notice').children().slideDown(200)
        }
    })
})

$(document).ready(function(){
    $('.form_group #retype_password').keyup(function () {
        if(retype_password.value == password.value && retype_password.value != ''){
            $(this).parent().siblings('.error_notice').children().slideUp(200)
        }
        else if(retype_password.value != password.value){
            $(this).parent().siblings('.error_notice').children().slideDown(200)
        }
    })
})
// duyệt 2 input cuối].

$(document).ready(function(){
    $('.form_group input').focus(function () {
        ele_attr = this.placeholder
        $(this).attr('placeholder','')
        $(this).parent().prev('label').css(
            'animation', 'label_effect 1.2s ease 0s infinite alternate'
        )
        if(this.value == ''){
            $(this).parent().siblings('.error_notice').slideDown(200)
        }
    })
    $('.form_group input').blur(function () {
        $(this).attr('placeholder',ele_attr)
        $(this).parent().prev('label').css(
            'animation', 'none'
        )
        if(this.value == ''){
            $(this).parent().siblings('.error_notice').slideDown(200)
        }
    })
})

$(document).ready(function(){
    $('.eye_password').click(function(){
        $(this).toggleClass('non_close')
        if($(this).hasClass('non_close')){
            $(this).siblings('input').attr('type','text')
        }
        else{
            $(this).siblings('input').attr('type','password')
        }
    })
})

$(document).ready(function(){
    $('#condition_tick').click(function(){
        $(this).siblings('.wrap_fake_condition_tick').children().toggleClass('fake_condition_tick')
    })
})

$(document).ready(function(){
    $('#notify_ok').click(function () {
        $('#notify_board').css({
            'transform': 'scaleX(0)'
        })
        $('#notify_modal').delay(300).hide(0)
    })
})