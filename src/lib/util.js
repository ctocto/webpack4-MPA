export default {
    getUrlParam(name, url = window.location.search) {

        var reg = new RegExp("(^|\\?|&)" + name + "=([^&]*)(\\s|&|$)", "i");

        if (reg.test(url)) return unescape(RegExp.$2.replace(/\+/g, " "));

        return "";
    },
    getUrlParams(url = window.location.search) {
        var res = {};
        if (url.indexOf("?") != -1) {
            let str = url.substr(1);
            let strs= str.split("&");
            for (let i = 0; i < strs.length; i++) {
                res[strs[i].split("=")[0]] = decodeURI(strs[i].split("=")[1]);
            }
        }
        return res;
    },
    //原生JavaScript实现设置url参数，值
    setUrlParam(url = window.location.search, paramName, replaceWith) {
        var oUrl = url.toString();
        var re = eval('/(' + paramName + '=)([^&]*)/gi');
        var reg = new RegExp("(^|\\?|&)" + paramName + "=([^&]*)(\\s|&|$)", "i");
        if (reg.test(url)) {
            var nUrl = oUrl.replace(re, paramName + '=' + replaceWith);
            return nUrl;
        } else {
            if (url.match('[\?]')) {
                return url + '&' + paramName + '=' + replaceWith;
            } else {
                return url + '?' + paramName + '=' + replaceWith;
            }
        }
    },

    support() {
        var u = navigator.userAgent;
        return {
            mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
            ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
            android: u.indexOf('Android') > -1 || u.indexOf('Adr') > -1, //android终端
            iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
            iPad: u.indexOf('iPad') > -1, //是否iPad
            weixin: u.indexOf('MicroMessenger') > -1, //是否微信 （2015-01-22新增）
            qq: !!u.match(/QQ/i) //是否QQ

        };
    }
}