/* ARTEMIS — Phòng trình diễn tương tác bằng tiếng Việt.
   Đây là kịch bản mô phỏng. Không kết nối ADB, Google Maps API hay điện thoại thật. */
(function(){
  'use strict';
  const $=id=>document.getElementById(id);
  const plans=[
    {title:'Nhận lệnh từ người dùng',sub:'Khởi tạo quy trình Android',screen:'Màn hình chính',status:'Chuẩn bị tiếp nhận yêu cầu',log:'Đã tiếp nhận yêu cầu bằng tiếng Việt.'},
    {title:'Mở Google Maps',sub:'Chuyển ứng dụng trên Android',screen:'Google Maps · Khám phá',status:'Đang mở Google Maps',log:'Mở ứng dụng Google Maps (mô phỏng).'},
    {title:'Thiết lập các điểm đến',sub:'Chọn phương tiện là ô tô',screen:'Google Maps · Điểm đến',status:'Đang nhập điểm khởi hành và điểm đến',log:'Điền 4 địa điểm, chọn phương thức lái xe.'},
    {title:'Đọc thời gian từng chặng',sub:'Trích xuất 3 chặng đường mẫu',screen:'Google Maps · Tuyến lái xe',status:'Đang đọc thời gian lái xe của từng chặng',log:'Ghi nhận ba thời lượng mẫu: 8, 19 và 27 phút.'},
    {title:'Tính tổng hành trình',sub:'Cộng thời gian của 3 chặng',screen:'Báo cáo · Tổng thời gian',status:'Đã tính tổng thời gian di chuyển',log:'Tính toán: 8 + 19 + 27 = 54 phút (dữ liệu mô phỏng).'},
    {title:'Chuyển sang YouTube',sub:'Tìm bài hát của Coldplay',screen:'YouTube · Tìm kiếm',status:'Đang tìm video Coldplay',log:'Tìm “Coldplay - A Sky Full of Stars” trên YouTube.'},
    {title:'Sẵn sàng phát video',sub:'Người dùng xác nhận phát nhạc',screen:'YouTube · Trình phát video',status:'Hoàn tất mô phỏng',log:'Đã mở màn hình video chính thức. Nhấn nút phát để xem/nghe.'}
  ];
  const trips=[
    {name:'Dinh Độc Lập → Chợ Bến Thành',minute:8},
    {name:'Chợ Bến Thành → Landmark 81',minute:19},
    {name:'Landmark 81 → Sân bay Tân Sơn Nhất',minute:27}
  ];
  const total=trips.reduce((sum,item)=>sum+item.minute,0);
  const urlGoogle='https://www.google.com/maps/dir/?api=1&origin=Independence+Palace%2C+Ho+Chi+Minh+City&destination=Tan+Son+Nhat+International+Airport&waypoints=Ben+Thanh+Market%7CLandmark+81&travelmode=driving';
  const urlMusic='https://www.youtube.com/watch?v=VPRjCeoBqrI';
  let step=0,running=false,speed=1,timer=null,videoOpened=false,hasStarted=false;
  let events=[];
  const view=$('phoneView'),screen=document.querySelector('.phone-screen');
  function safe(str){return String(str).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
  function clock(){return new Date().toLocaleTimeString('vi-VN',{hour:'2-digit',minute:'2-digit',hour12:false});}
  function log(message,type){
    events.push({time:clock(),message:message,type:type||'normal'});
    if(events.length>28)events.shift();
    $('eventLog').innerHTML=events.map(e=>'<div class="log-item '+e.type+'"><span class="log-time">'+safe(e.time)+'</span><span class="log-text">'+safe(e.message)+'</span></div>').join('');
    $('eventLog').scrollTop=$('eventLog').scrollHeight;
  }
  function markTap(x,y){
    const el=$('tapIndicator');el.style.left=x+'%';el.style.top=y+'%';el.classList.remove('pop');void el.offsetWidth;el.classList.add('pop');
  }
  function wallpaper(){
    return '<div class="home-wallpaper"><div class="home-clock">'+clock()+'</div><div class="home-date">'+new Intl.DateTimeFormat('vi-VN',{weekday:'long',day:'numeric',month:'long'}).format(new Date())+'</div><div class="home-weather">◌ Bản trình diễn · TP. Hồ Chí Minh</div>'+
    '<div class="home-search"><span>G　Tìm kiếm trên thiết bị</span><span>◉</span></div>'+
    '<div class="home-apps"><button class="app-launcher map-action" data-goto="1" type="button"><span class="app-tile map-logo">⌖</span><span>Bản đồ</span></button>'+
    '<button class="app-launcher map-action" data-goto="5" type="button"><span class="app-tile yt-logo"><span class="play-logo">▶</span></span><span>YouTube</span></button>'+
    '<span class="app-launcher"><span class="app-tile chat-logo">✦</span><span>Trợ lý AI</span></span><span class="app-launcher"><span class="app-tile gallery-logo">▣</span><span>Thư viện</span></span></div><div class="home-dots">● · ·</div></div>';
  }
  function mapSvg(showPath){
    return '<svg class="map-pattern" viewBox="0 0 315 590" preserveAspectRatio="xMidYMid slice" aria-label="Bản đồ sơ đồ tại TP.HCM; không đúng tỷ lệ thực" role="img">'+
    '<rect width="315" height="590" fill="#f5f3ed"/>'+
    '<path d="M-30 0L100 0L118 126L70 226L-30 206Z" fill="#e6efe1"/>'+
    '<path d="M223 -20L350 -20L353 180L284 174L242 86Z" fill="#e3eee0"/>'+
    '<path d="M-25 383L63 364L121 472L100 640L-30 640Z" fill="#e4efdc"/>'+
    '<path d="M232 355L345 377L354 590L221 590L191 482Z" fill="#e6efdc"/>'+
    '<path d="M-35 299C65 271 104 331 151 314S274 258 345 290" fill="none" stroke="#c7e4ee" stroke-width="51"/>'+
    '<path d="M-35 297C65 269 104 329 151 312S274 256 345 288" fill="none" stroke="#a7d5e8" stroke-width="35"/>'+
    '<g class="map-road">'+
    '<path d="M-45 97L353 139M-25 219L363 215M-22 427L370 456M27 -20L82 630M195 -20L135 630M330 -20L261 650M-30 558L349 47M-30 36L345 567M-20 520L355 346"/>'+
    '</g><g class="small-road">'+
    '<path d="M-25 49L340 88M-30 164L355 188M-20 352L358 380M-20 495L354 510M-10 536L350 582M142 -40L106 620M263 -20L223 630M-12 480L343 20M-10 576L328 206"/>'+
    '</g>'+
    '<path d="M38 117L118 171L104 220L156 255L187 317L237 342L248 387L216 432L169 468L125 520" stroke="#fdfdfd" stroke-width="14" fill="none" stroke-linejoin="round" stroke-linecap="round"/>'+
    '<text x="16" y="27" class="road-label">TÂN BÌNH</text><text x="230" y="39" class="road-label">BÌNH THẠNH</text>'+
    '<text x="28" y="195" class="road-label">QUẬN 3</text><text x="202" y="248" class="road-label">SÀI GÒN</text>'+
    '<text x="16" y="364" class="road-label">QUẬN 1</text><text x="238" y="531" class="road-label">THỦ ĐỨC</text>'+
    '<text x="25" y="260" class="place-label">Dinh Độc Lập</text><text x="36" y="465" class="place-label">Chợ Bến Thành</text>'+
    '<text x="201" y="365" class="place-label">Landmark 81</text><text x="9" y="70" class="place-label">Sân bay</text>'+
    (showPath?'<path class="route-shadow" d="M97 253L131 317L79 367L125 438L185 400L255 347L216 235L169 159L75 91"/>'+
      '<path class="route-path" d="M97 253L131 317L79 367L125 438L185 400L255 347L216 235L169 159L75 91"/>'+
      '<circle class="map-marker-circle" cx="97" cy="253" r="8"/><circle class="map-marker-circle" cx="125" cy="438" r="8"/>'+
      '<circle class="map-marker-circle" cx="255" cy="347" r="8"/><circle class="map-marker-end" cx="75" cy="91" r="9"/>':'<circle cx="97" cy="253" r="9" fill="#3d87ec" stroke="white" stroke-width="4"/>')+
    '</svg>';
  }
  function basicMap(){
    return '<div class="mock-map">'+mapSvg(false)+'<div class="map-ui-overlay">'+
    '<div class="maps-search"><span class="hamburger">☰</span><span class="search-placeholder">Tìm kiếm tại TP. Hồ Chí Minh</span><span class="voice-search">♩</span></div>'+
    '<div class="map-categories"><span>☕ Cà phê</span><span>♧ Công viên</span><span>◧ Khách sạn</span></div></div>'+
    '<div class="map-bottom-card"><h3>Khám phá xung quanh</h3><p>Google Maps đã được mở trên thiết bị mô phỏng. Tác tử chuẩn bị nhập tuyến đường.</p><button class="map-button map-action" type="button" data-goto="2">Lập tuyến đường →</button></div></div>';
  }
  function inputs(){
    return '<div class="directions-header"><div class="directions-nav"><span>←　Chỉ đường</span><span>⋮</span></div>'+
    '<div class="directions-input"><span class="direction-bullet"></span><span>Dinh Độc Lập, TP.HCM</span></div>'+
    '<div class="directions-input"><span class="direction-bullet square"></span><span>Chợ Bến Thành → Landmark 81 → Sân bay</span></div>'+
    '<div class="transport-row"><span class="selected">🚗 Ô tô</span><span>🚶 Đi bộ</span><span>🚲 Xe đạp</span><span>🚌 Xe buýt</span></div></div>';
  }
  function destinations(){
    return '<div class="mock-map">'+mapSvg(false)+inputs()+
    '<div class="map-bottom-card"><span class="maps-chip">✓ Đã chọn phương thức lái xe</span><h3>Thiết lập tuyến nhiều điểm</h3>'+
    '<p>① Dinh Độc Lập<br>② Chợ Bến Thành<br>③ Landmark 81<br>④ Sân bay Tân Sơn Nhất</p>'+
    '<button class="map-button map-action" type="button" data-goto="3">Xem thời gian 3 chặng →</button></div></div>';
  }
  function mapTrips(){
    return '<div class="mock-map">'+mapSvg(true)+
    '<div class="directions-header"><div class="directions-nav"><span>←　Lộ trình lái xe</span><span>⋮</span></div><div class="directions-input"><span class="direction-bullet"></span> Dinh Độc Lập → Sân bay Tân Sơn Nhất</div>'+
    '<div class="transport-row"><span class="selected">🚗 Ô tô</span><span>🚶 Đi bộ</span><span>🚲 Xe đạp</span><span>🚌 Xe buýt</span></div></div>'+
    '<div class="trip-card"><span class="maps-chip">LỘ TRÌNH MÔ PHỎNG</span>'+
    trips.map((x,i)=>'<div class="trip-row"><span class="trip-name">'+(i+1)+'. '+safe(x.name)+'</span><strong>'+x.minute+' phút</strong></div>').join('')+
    '<div class="trip-note">Thời gian ví dụ, không lấy từ Google Maps.</div>'+
    '<button class="map-button map-action" type="button" data-goto="4">Cộng tổng thời gian →</button></div></div>';
  }
  function summary(){
    return '<div class="summary-screen"><div class="summary-top"><span>‹　Báo cáo hành trình</span><span>✓ Hoàn tất</span></div>'+
    '<div class="summary-heading"><div class="summary-check">✓</div><h3>Đã tính xong thời gian!</h3><p>AI đã đọc thời gian mẫu của 3 chặng đường và cộng lại.</p></div>'+
    '<div class="summary-number"><strong>'+total+' phút</strong><small>Tổng thời gian lái xe mô phỏng</small></div>'+
    '<div class="summary-table">'+trips.map((x,i)=>'<div><span>Chặng '+(i+1)+' · '+safe(x.name)+'</span><strong>'+x.minute+' phút</strong></div>').join('')+'</div>'+
    '<div class="summary-next"><span>♬</span> Bước tiếp theo: mở YouTube và tìm bài hát của Coldplay.</div>'+
    '<button class="map-button map-action" type="button" data-goto="5" style="width:100%;margin-top:12px">Mở YouTube →</button>'+
    '<p style="font-size:9px;text-align:center;color:#66758a;line-height:1.8">Kiểm tra tuyến thật: <a href="'+urlGoogle+'" target="_blank" rel="noopener noreferrer" style="color:#1967d2;text-decoration:underline">Xem trong Google Maps ↗</a></p></div>';
  }
  function thumb(){
    return '<div class="video-thumb"><div class="stars"></div><div class="video-center">A SKY FULL<br>OF STARS ✧</div><span class="thumb-duration">4:14</span></div>';
  }
  function youtubeSearch(){
    return '<div class="youtube-page"><div class="youtube-top"><div class="youtube-brand"><span class="youtube-mark">▶</span>YouTube</div><span class="youtube-tools">♧　⌕　◉</span></div>'+
    '<div class="youtube-searchbar">⌕　Coldplay A Sky Full of Stars</div><div class="youtube-tabs"><span class="active">Tất cả</span><span>Âm nhạc</span><span>Video</span><span>Danh sách phát</span></div>'+
    '<button type="button" class="map-action" data-goto="6" style="border:0;padding:0;width:100%;background:none;text-align:left;color:inherit">'+thumb()+
    '<div class="video-meta"><span class="channel-badge">C</span><div><h3>Coldplay - A Sky Full Of Stars (Video chính thức)</h3><p>Coldplay · Kênh nghệ sĩ chính thức</p></div></div></button>'+
    '<div class="youtube-section-title">Kết quả đề xuất</div>'+
    '<div style="margin:5px 13px 12px;display:flex;gap:10px;align-items:center"><span style="height:58px;width:90px;border-radius:9px;background:linear-gradient(140deg,#6152af,#15152f);display:grid;place-items:center;color:white;font-weight:bold">COLDPLAY</span><span style="font-size:11px;line-height:1.6">Danh sách nhạc Coldplay<br><small style="color:#777">Chính thức · Âm nhạc</small></span></div></div>';
  }
  function youtubeWatch(){
    return '<div class="youtube-page watch-stage"><div class="youtube-top"><div class="youtube-brand"><span class="youtube-mark">▶</span>YouTube</div><span class="youtube-tools">⌕　⋮</span></div>'+
    '<div class="video-iframe-wrap" id="iframeWrap">'+
    (videoOpened?'<iframe src="https://www.youtube-nocookie.com/embed/VPRjCeoBqrI?autoplay=1&rel=0" title="Coldplay - A Sky Full Of Stars (Video chính thức)" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen loading="eager"></iframe>':
    '<div class="video-play-overlay"><div><button type="button" class="play-big" id="realPlayBtn" aria-label="Phát video YouTube">▶</button><strong>A Sky Full of Stars</strong><small>Coldplay · Video chính thức<br>Nhấn phát để tải trình phát YouTube</small></div></div>')+
    '</div><div class="watch-details"><h3>Coldplay - A Sky Full Of Stars (Official Video)</h3><p>Video phát qua dịch vụ YouTube, không lưu trữ trên trang này.</p>'+
    '<div class="watch-actions"><span class="watch-pill">♡ Thích</span><span class="watch-pill">↗ Chia sẻ</span><span class="watch-pill">♬ Âm nhạc</span></div>'+
    '<div class="watch-channel"><span class="channel-badge">C</span><div><strong>Coldplay</strong><small>Kênh nghệ sĩ chính thức</small></div><span class="subscribe">Đăng ký</span></div>'+
    '<p style="margin-top:25px;font-size:11px;line-height:1.8;color:#535353">Nếu video không phát trong khung nhúng, hãy <a href="'+urlMusic+'" target="_blank" rel="noopener noreferrer" style="color:#1667ce;text-decoration:underline">xem trực tiếp trên YouTube ↗</a>.</p>'+
    '<button id="watchAgain" class="video-fallback" type="button">↺ Phát lại kịch bản</button></div></div>';
  }
  function renderTimeline(){
    $('timeline').innerHTML=plans.map((p,i)=>'<li class="'+(i===step?'active':i<step?'done':'')+'">'+
      '<button type="button" class="timeline-btn" data-step="'+i+'" '+(i===step?'aria-current="step"':'')+'>'+
      '<span class="step-mark">'+(i<step?'✓':String(i+1).padStart(2,'0'))+'</span>'+
      '<span class="step-copy"><span class="step-title">'+safe(p.title)+'</span><span class="step-sub">'+safe(p.sub)+'</span></span></button></li>').join('');
  }
  function render(){
    const dark=(step===0);screen.classList.toggle('dark-app',dark);
    const views=[wallpaper,basicMap,destinations,mapTrips,summary,youtubeSearch,youtubeWatch];
    view.innerHTML=views[step]();
    view.scrollTop=0;
    $('deviceMode').textContent=running?'ĐANG THỰC HIỆN':step===6?'HOÀN TẤT':hasStarted?'TẠM DỪNG':'ĐANG CHỜ LỆNH';
    $('screenLabel').textContent=plans[step].screen;
    $('stepCount').textContent='BƯỚC '+String(step+1).padStart(2,'0')+' / 07';
    $('progressBar').style.width=Math.round((step/6)*100)+'%';
    $('progressTrack').setAttribute('aria-valuenow',String(Math.round((step/6)*100)));
    $('statSteps').textContent=(hasStarted?step+1:0)+'/7';
    $('statTime').textContent=step>=4?total+' phút':'—';
    $('agentStatus').textContent=running?'Đang thực thi':step===6?'Hoàn tất':hasStarted?'Đã tạm dừng':'Sẵn sàng';
    $('agentDetail').textContent=plans[step].status;
    $('agentStatusDot').classList.toggle('working',running);
    $('playIcon').textContent=running?'Ⅱ':'▶';
    $('playLabel').textContent=running?'Tạm dừng':step===6?'Chạy lại':'Chạy mô phỏng';
    $('resultTitle').textContent=step===6?'Đã hoàn thành kịch bản':step>=4?'Tổng thời gian: '+total+' phút':'Đang chờ tác vụ';
    $('resultDetail').textContent=step===6?'Sẵn sàng phát video Coldplay':step>=4?'Đã cộng 3 chặng đường mẫu':'Tổng hợp thời gian và chuyển ứng dụng';
    renderTimeline();
  }
  function applyStep(value,fromAuto){
    const next=Math.max(0,Math.min(plans.length-1,value));
    if(!fromAuto){stop();hasStarted=true;}
    if(step!==next){step=next;log(plans[step].log,step===4||step===6?'success':'action');}
    render();
    if(step===6 && fromAuto){stop();render();}
    if(fromAuto && running && step<plans.length-1)schedule();
  }
  function schedule(){
    clearTimeout(timer);
    timer=setTimeout(()=>{if(running)applyStep(step+1,true);},Math.round(2400/speed));
  }
  function stop(){running=false;clearTimeout(timer);timer=null;}
  function start(){
    if(running){stop();log('Người dùng đã tạm dừng mô phỏng.');render();return;}
    if(step===6){reset(false);}
    hasStarted=true;
    running=true;
    log(step===0?'Bắt đầu kịch bản điều khiển đa ứng dụng.':'Tiếp tục thực hiện kịch bản.', 'action');
    render();schedule();
  }
  function reset(withRender=true){
    stop();step=0;videoOpened=false;hasStarted=false;events=[];
    if(withRender){log('Hệ thống đã khởi tạo. Nhấn “Chạy mô phỏng” để bắt đầu.');render();}
  }
  function playYoutube(){
    if(step!==6)return;
    videoOpened=true;
    stop();hasStarted=true;
    log('Đã gửi yêu cầu phát đến trình phát YouTube chính thức.','success');
    render();
  }
  function bindEvents(){
    $('playBtn').addEventListener('click',start);
    $('restartBtn').addEventListener('click',()=>reset(true));
    $('prevBtn').addEventListener('click',()=>applyStep(step-1,false));
    $('nextBtn').addEventListener('click',()=>applyStep(step+1,false));
    $('speedBtn').addEventListener('click',()=>{
      speed=speed===1?2:speed===2?3:1;
      $('speedBtn').textContent=speed+'×';
      if(running)schedule();
    });
    $('timeline').addEventListener('click',e=>{
      const btn=e.target.closest('[data-step]');if(!btn)return;
      applyStep(Number(btn.dataset.step),false);
      markTap(49,44);
    });
    view.addEventListener('click',e=>{
      const videoBtn=e.target.closest('#realPlayBtn');
      if(videoBtn){playYoutube();return;}
      const again=e.target.closest('#watchAgain');
      if(again){reset(true);start();return;}
      const to=e.target.closest('[data-goto]');
      if(to){applyStep(Number(to.dataset.goto),false);markTap(48,45);}
    });
    $('copyBtn').addEventListener('click',async()=>{
      const content='ARTEMIS — KẾT QUẢ MÔ PHỎNG\n'+trips.map((r,i)=>(i+1)+'. '+r.name+': '+r.minute+' phút').join('\n')+
        '\nTổng: '+total+' phút (dữ liệu mô phỏng, không phải Google Maps thời gian thực).\nVideo Coldplay: '+urlMusic;
      try{
        if(!navigator.clipboard)throw new Error('Clipboard chưa được cấp quyền');
        await navigator.clipboard.writeText(content);
        $('copyBtn').firstChild.textContent='Đã sao chép kết quả ';
        setTimeout(()=>$('copyBtn').firstChild.textContent='Sao chép kết quả ',2000);
      }catch(_){
        const input=document.createElement('textarea');
        input.value=content;document.body.appendChild(input);input.select();
        const succeeded=document.execCommand('copy');input.remove();
        if(succeeded){$('copyBtn').firstChild.textContent='Đã sao chép kết quả ';setTimeout(()=>$('copyBtn').firstChild.textContent='Sao chép kết quả ',2000);}
        else log('Không thể sao chép tự động. Vui lòng cho phép quyền bộ nhớ tạm.');
      }
    });
    document.addEventListener('visibilitychange',()=>{if(document.hidden&&running){stop();render();}});
    window.addEventListener('keydown',e=>{
      if(e.key==='ArrowRight'&&!e.altKey&&!e.ctrlKey){applyStep(step+1,false);}
      if(e.key==='ArrowLeft'&&!e.altKey&&!e.ctrlKey){applyStep(step-1,false);}
      if(e.code==='Space'&&!['BUTTON','INPUT','TEXTAREA'].includes(document.activeElement.tagName)){
        e.preventDefault();start();
      }
    });
  }
  $('clock').textContent=clock();
  bindEvents();reset(true);
})();