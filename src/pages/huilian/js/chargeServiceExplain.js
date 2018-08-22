import '../less/chargeServiceExplain.less';

$('.rule-radio-label').on('change', (event) => {
    const radioElem = document.querySelector('.rule-radio');
    const check = radioElem.checked;
    if(check) {
        $('.yes-btn').addClass('allow-yes-btn');
    }else{
        $('.yes-btn').removeClass('allow-yes-btn');
    }
});

$('#reChargeExplain').on('click', '.allow-yes-btn', () => {
    
});