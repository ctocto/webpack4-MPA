import './common.loading.less'

class MLOADING {

    constructor() {
        this.text = '加载中';
        this.render();

    }

    render() {
        let $el = `<div class="m-load">
                        <div class="m-load-line">
                            <div><span class="m-load-before"></span><span class="m-load-after"></span></div>
                            <div><span class="m-load-before"></span><span class="m-load-after"></span></div>
                            <div><span class="m-load-before"></span><span class="m-load-after"></span></div>
                            <div><span class="m-load-before"></span><span class="m-load-after"></span></div>
                            <div><span class="m-load-before"></span><span class="m-load-after"></span></div>
                            <div><span class="m-load-before"></span><span class="m-load-after"></span></div>
                        </div>
                    </div>
                    <p class="m-load-txt">${this.text}...</p>`;

        let wrap = document.createElement('div');
        this.el = wrap;
        wrap.className = 'm-load-mask';
        wrap.innerHTML = $el;
       
        document.body.appendChild(wrap);
    }

    show(text) {
        
        if(text) this.el.querySelector('.m-load-txt').innerText = text;
        this.el.style.display = 'block';
    }

    hide() {
        this.el.style.display = 'none';
    }
};

let MLoading = (function () {
    return new MLOADING();
})();

MLoading.show();
window.MLoading = MLoading;

export default MLoading;

