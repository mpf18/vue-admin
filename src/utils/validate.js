/**
 * 过滤特殊字符
 */
export function stripscript(str) {
    var pattern = new RegExp("[`~!#$^&*()=|{}':;',\\[\\]<>/?~！#￥%……&*（）——|{ }【】‘；：”“'。，、？↵\r\n]");
    var rs = "";
    for (var i = 0; i < str.length; i++) {
        rs = rs + str.substr(i, 1).replace(pattern, '');
    }
    return rs;
}
/**
 * 验证邮箱(用户名)
 */
export function validateEmail(value) {
    let reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9~]+\.([a-zA-Z]{2,4})$/;
    return !reg.test(value) ? true : false;
}
/**
 * 验证密码
 */
export function validatePass(value) {
    let reg = /^(?!bai[0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/;
    return !reg.test(value) ? true : false;
}
/**
 * 验证验证码
 */
export function validateVCode(value) {
    let reg = /^[a-z0-9]{6}$/;
    return !reg.test(value) ? true : false;
}