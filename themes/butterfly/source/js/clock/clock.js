
fetch('https://wttr.in/'+returnCitySN["cip"]+'?format="%l+\\+%c+\\+%t+\\+%h"').then(res=>res.text()).then(
   data => {
       if(document.getElementById('hexo_electric_clock')){
        var res_text = data.replace(/nf/g,'nf,nf').replace(/"/g,'').replace(/\+/g,'').replace(/,/g,'\\').replace(/ /g,'').replace(/°C/g,'');
        res_list = res_text.split('\\');
        var clock_box = document.getElementById('hexo_electric_clock');
        clock_box_html = `
          <div class="clock-row">
            <span class="card-clock-weather">${res_list[2]||'*'}    ${res_list[3]||'*'}°C</span>
            <span class="card-clock-humidity">💧${res_list[4]||'*'}</span>
          </div>
          <div class="clock-row">
            <span id="card-clock-time" class="card-clock-time"></span>
          </div>
          <div class="clock-row">
            <span class="card-clock-ip">Ip: ${returnCitySN["cip"]}</span>
          </div>
          `;
        
        var card_clock_loading_dom = document.getElementById('card-clock-loading');
        card_clock_loading_dom.innerHTML='';
        clock_box.innerHTML= clock_box_html;
        function updateTime() {
            var cd = new Date();
            var card_clock_time = zeroPadding(cd.getHours(), 2) + ':' + zeroPadding(cd.getMinutes(), 2) + ':' + zeroPadding(cd.getSeconds(), 2);
            // 显示时间
            var card_clock_time_dom = document.getElementById('card-clock-time');
            if(card_clock_time_dom){
              card_clock_time_dom.innerHTML= card_clock_time;
            } else {
              card_clock_time_dom.innerHTML= '时间迷路了';
            }
        }

        function zeroPadding(num, digit) {
            var zero = '';
            for(var i = 0; i < digit; i++) {
                zero += '0';
            }
            return (zero + num).slice(-digit);
        }
           var timerID = setInterval(updateTime, 1000);
           updateTime();
       }
    }
)
