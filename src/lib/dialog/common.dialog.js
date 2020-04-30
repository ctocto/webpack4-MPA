/* 
 * @Author: hefan
 * @Date:   2016-08-29 17:33:38
 * @Last Modified by:   Marte
 * @Last Modified time: 2017-05-02 15:07:38
 */

class DiaLog {
    constructor(options) {
        this.noBtn = options.cancel;
        this.defaults = {
            title: "弹窗标题",
            content: "弹窗内容",
            agree: "确定",
            cancel: "取消",
            agreeHandle: function() {},
            cancelHandle: function() {},
            beforeShow: function() {}
        };

        this.opts = Object.assign({}, this.defaults, options);

        this.init();
    }

    init() {
        this.render();
        this.bindEvent();
    }

    render() {

        this.body = document.body;
        this.dialogMask = document.querySelectorAll('.dialog-mask');
        this.dialogMain = document.querySelectorAll('.dialog-main');

        if (this.dialogMask.length <= 0) {
            this.dialogMask = document.createElement('div');
            this.dialogMask.className = 'dialog-mask';
            this.dialogMask.id = 'J_mask';

            this.body.appendChild(this.dialogMask);
        };
        if (this.dialogMain.length <= 0) {
            this.dialogMain = `<div class="dialog-main">
                <div class="dialog_hd"><strong class="weui_dialog_title">${this.opts.title}</strong></div>
                <div class="dialog_bd">${this.opts.content}</div>
                <div class="dialog_ft">
                ${this.noBtn ? '<p class="btn_dialog default tx_active">' + this.opts.cancel + '</p>' : ''}
                <p class="btn_dialog primary tx_active">${this.opts.agree}</p></div>
                </div>`;
            let wrap = document.createElement('div');
            wrap.innerHTML = this.dialogMain;
            this.body.appendChild(wrap);
        };

        this.opts.beforeShow && typeof this.opts.beforeShow === 'function' && this.opts.beforeShow(this);
        this.dShow();
    }

    bindEvent() {
        const _this = this;
        document.addEventListener('click', '.primary', () => {
            this.dHide();
            setTimeout(() => {
                this.opts.agreeHandle && typeof this.opts.agreeHandle === 'function' && this.opts.agreeHandle(this);
            }, 500);
        }, false);

        document.addEventListener('click', '.default', () => {
            this.dHide();
            setTimeout(() => {
                this.opts.cancelHandle && typeof this.opts.cancelHandle === 'function' && this.opts.cancelHandle(this);
            }, 500);
        }, false);

    }

    dShow() {

        this.dialogMask.style.display = 'block';
        this.dialogMain.className += ' dialog-main-visibility';
        this.dialogMask.className += ' dialog-mask-visibility';
    }

    dHide() {

        this.dialogMask.removeClass('dialog-mask-visibility').transitionEnd(function() {
            _this.dialogMask.remove();
        });
        // debugger
        this.dialogMain.removeClass('dialog-main-visibility').transitionEnd(function() {
            _this.dialogMain.remove();
        });
    }

    transitionEnd(callback, element) {
        var events = ['webkitTransitionEnd', 'transitionend', 'oTransitionEnd', 'MSTransitionEnd', 'msTransitionEnd'],
            i, dom = element;

        function fireCallBack(e) {
            /*jshint validthis:true */
            if (e.target !== this) return;
            callback.call(this, e);
            for (i = 0; i < events.length; i++) {
                dom.removeEventListener(events[i], fireCallBack, false);
            }
        }
        if (callback) {
            for (i = 0; i < events.length; i++) {
                dom.addEventListener(events[i], fireCallBack, false);
            }
        }
        return this;
    }
}

export default function Dialog(title, content, agree, cancel, agreeHandle, cancelHandle, beforeShow) {
    let dialog = new DiaLog({
        title: title, //标题
        content: content, //主体提示内容
        agree: agree, //确定文案
        cancel: cancel,
        agreeHandle: agreeHandle,
        cancelHandle: cancelHandle,
        beforeShow: beforeShow
    });
    return dialog;
}