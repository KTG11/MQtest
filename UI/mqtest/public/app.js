/* ===== Math Quest JS (Grade 8) ===== */
const $ = (sel, ctx=document) => ctx.querySelector(sel);
const $$ = (sel, ctx=document) => Array.from(ctx.querySelectorAll(sel));

const STORAGE_KEYS = {
  streak: "mq8_streak",
  lastCheck: "mq8_last_check_date",
  points: "mq8_points",
  dreams: "mq8_dreams",
};

const todayStr = () => new Date().toISOString().slice(0,10);
const yesterdayStr = () => new Date(Date.now()-86400000).toISOString().slice(0,10);
const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
const numberWithCommas = (x) => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

// Smooth anchor scroll + mobile menu close
 $$('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href');
    if(id.length > 1){
      e.preventDefault();
      document.querySelector(id)?.scrollIntoView({behavior:'smooth', block:'start'});
      $('#navlinks')?.classList.remove('open');
      $('#hamburger')?.setAttribute('aria-expanded','false');
    }
  });
});
 $('#hamburger')?.addEventListener('click', () => {
  $('#navlinks')?.classList.toggle('open');
  $('#hamburger')?.setAttribute('aria-expanded', $('#navlinks')?.classList.contains('open'));
});
 $('#year').textContent = new Date().getFullYear();

// ===== Leaderboard Ticker =====
const players = [
  {name:'Tharusha', pts:1700,  img:'assets/players/no bd correct profile.png'},
  {name:'Sithara', pts:1650, img:'assets/players/no bd correct profile.png'},
  {name:'Sachintha', pts:1550,  img:'assets/players/no bd correct profile.png'},
  {name:'Amara', pts:1500,  img:'assets/players/no bd correct profile.png'},
  {name:'Kavindu', pts:1450, img:'assets/players/no bd correct profile.png'},
  {name:'Praveen', pts:1300, img:'assets/players/no bd correct profile.png'},
  {name:'Malisha', pts:1220, img:'assets/players/no bd correct profile.png'},
  {name:'Nimasha', pts:1180, img:'assets/players/no bd correct profile.png'},
  {name:'Dinuka', pts:1080, img:'assets/players/no bd correct profile.png'},
];
function buildTicker(){
  const track = $('#marqueeTrack');
  const start = `<span class="chip"><strong>Top players.</strong></span>`;
  const mkChip = (p) => `<span class=\"chip\"><img class=\"chip-avatar\" src=\"${p.img}\" alt=\"\"><span class=\"trophy\">${p.badge ?? ''}</span> ${p.name} · ${numberWithCommas(p.pts)} pts</span>`;
  const row = start + players.map(mkChip).join(' ');
  track.innerHTML = row + row; // duplicate for infinite loop
}
buildTicker();

// ===== Streak + Points =====
let streak = parseInt(localStorage.getItem(STORAGE_KEYS.streak) || '0', 10);
let lastCheck = localStorage.getItem(STORAGE_KEYS.lastCheck) || '';
let points = parseInt(localStorage.getItem(STORAGE_KEYS.points) || '0', 10);
function syncStats(){
  $('#streakCount').textContent = streak;
  $('#pointsCount').textContent = points;
  updateRank();
  if(lastCheck === todayStr()){
    $('#btnCheckIn').textContent = "Checked in ✔";
    $('#btnCheckIn').disabled = true;
  } else { $('#btnCheckIn').textContent = "Check in today"; $('#btnCheckIn').disabled = false; }
}
syncStats();
 $('#btnCheckIn')?.addEventListener('click', () => {
  if(lastCheck === todayStr()) return;
  if(lastCheck !== yesterdayStr() && lastCheck !== todayStr()) streak = 0;
  streak += 1; lastCheck = todayStr(); points += 10;
  localStorage.setItem(STORAGE_KEYS.streak, String(streak));
  localStorage.setItem(STORAGE_KEYS.lastCheck, lastCheck);
  localStorage.setItem(STORAGE_KEYS.points, String(points));
  bump($('#streakCount')); bump($('#pointsCount')); syncStats();
});
function bump(el){ el.animate([{transform:'scale(1)'},{transform:'scale(1.2)'},{transform:'scale(1)'}],{duration:300, easing:'ease-out'}); }

// ===== Daily Quiz =====
const quizBank = [
  {q:"What is 12 × 8?", a:"96"},
  {q:"Solve for x: 2x + 5 = 19", a:"7"},
  {q:"What is the derivative of x^2?", a:"2x"},
  {q:"Compute 15% of 200", a:"30"},
  {q:"What is 7²?", a:"49"},
  {q:"Simplify: (3^2 × 3^3)", a:"3^5"},
  {q:"Find the perimeter of a 4×7 rectangle", a:"22"},
];
let todaysQuiz = quizBank[Math.floor(Math.random()*quizBank.length)];
 $('#openQuiz')?.addEventListener('click', () => {
  $('#quizQuestion').textContent = todaysQuiz.q;
  $('#quizAnswer').value = "";
  $('#quizFeedback').textContent = "";
  $('#quizDialog').showModal();
});
 $('#quizForm')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const val = $('#quizAnswer').value.trim().replace(/\s+/g,'');
  if(!val) return;
  const correct = val.toLowerCase() === String(todaysQuiz.a).replace(/\s+/g,'').toLowerCase();
  if(correct){
    $('#quizFeedback').textContent = "Correct! +15 pts 🎉";
    points += 15; localStorage.setItem(STORAGE_KEYS.points, String(points)); syncStats();
  } else { $('#quizFeedback').textContent = `Not quite. Correct answer: ${todaysQuiz.a}.`; }
  bump($('#pointsCount'));
  setTimeout(()=> $('#quizDialog').close(), 900);
});

// ===== Lessons (Past / Current / Future) =====
const lessonsData = {
  past: [
    {title:"Number Patterns", dur:"20 min", url:"https://mqtest-1.onrender.com/number-patterns"},
    {title:"Perimeter", dur:"25 min", url:"https://mqtest-1.onrender.com/perimeter"},
    {title:"Angles", dur:"22 min", url:"https://mqtest-1.onrender.com/angles"},
    {title:"Directed Numbers", dur:"24 min", url:"https://mqtest-1.onrender.com/directed-numbers"},
  ],
  current: [
    {title:"Algebraic Expressions", dur:"30 min", url:"https://mqtest-1.onrender.com/algebra"},
    {title:"Solids", dur:"28 min", url:"https://mqtest-1.onrender.com/solids"},
    {title:"Factors", dur:"20 min", url:"https://mqtest-1.onrender.com/factors"},
    {title:"Square Root", dur:"18 min", url:"https://mqtest-1.onrender.com/square-root"},
  ],
  future: [
    {title:"Mass", dur:"22 min", url:"https://mqtest-1.onrender.com/mass"},
    {title:"Indices", dur:"26 min", url:"https://mqtest-1.onrender.com/indices"},
    {title:"Symmetry", dur:"20 min", url:"https://mqtest-1.onrender.com/symmetry"},
    {title:"Triangles", dur:"24 min", url:"https://mqtest-1.onrender.com/triangles"},
  ],
  Games: [
    {title:"Algebra", dur:"22 min", url:"https://mqtest-1.onrender.com/algebra"},
    {title:"Geometry", dur:"26 min", url:"https://mqtest-1.onrender.com/geometry"},
  ]
};
function renderLessonList(group='past'){
  const list = $('#lessonList');
  list.innerHTML = lessonsData[group].map(x => (
    `<div class="lesson"><div>${x.title}<br><small>${x.dur}</small></div><button class="btn" onclick="window.location.href='${x.url}'">Start</button></div>`
  )).join('');
}

renderLessonList('past');
 $$('#card-lessons .tab').forEach(tab => {
  tab.addEventListener('click', () => {
    $$('#card-lessons .tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    $$('#card-lessons .tab').forEach(t => t.setAttribute('aria-selected', t === tab ? 'true' : 'false'));
    renderLessonList(tab.dataset.tab);
  });
});

// ===== Quizzes section =====
const quizzesCards = $('#quizzesCards');
const quizDefs = [
  {title:"Algebra Speedrun", diff:"Easy", img:"assets/quizzes/algebra-1.jpg"},
  {title:"Algebra Speedrun", diff:"Easy", img:"assets/quizzes/algebra-1.jpg"},
  {title:"Geometry Mix", diff:"Medium", img:"assets/quizzes/geometry.jpg"},
  {title:"Indices Basics", diff:"Hard", img:"assets/quizzes/indices.jpg"},
  {title:"Probability Pack", diff:"Medium", img:"assets/quizzes/probability.jpg"},
  {title:"Ratios & Fractions", diff:"Medium", img:"assets/quizzes/ratios.jpg"},
];
quizzesCards.innerHTML = quizDefs.map(q => (
  `<div class=\"card-lite\"><img class=\"quiz-thumb\" src=\"${q.img}\" alt=\"\"><h3>${q.title}</h3><p class=\"muted\">Difficulty: ${q.diff}</p><button class=\"btn\">Start Quiz</button></div>`
)).join('');

// ===== Shop =====
const shopItems = [
  {title:'Avatar: Pixel Cat', price:200, type:'avatar', img:'assets/avatars/avatar1.svg'},
  {title:"Avatar: Pixel Cat", price:200, type:'avatar'},
  {title:"Avatar: Robot", price:220, type:'avatar', img:'assets/avatars/avatar2.svg'},
  {title:"Streak Freeze", price:400, type:'powerup', img:'assets/avatars/avatar3.svg'},
  {title:"XP Booster (2×)", price:600, type:'powerup', img:'assets/avatars/avatar4.svg'},
  {title:"Upgrade to Pro", price:1200, type:'pro', img:'assets/avatars/avatar5.svg'},
  {title:"Theme Pack", price:300, type:'cosmetic', img:'assets/avatars/avatar6.svg'},
  {title:'Avatar: Lambda', price:240, type:'avatar', img:'assets/avatars/avatar9.svg'},
  {title:'Avatar: Theta', price:260, type:'avatar', img:'assets/avatars/avatar11.svg'},
  {title:'Avatar: Beta', price:260, type:'avatar', img:'assets/avatars/avatar12.svg'},
];
 $('#shopCards').innerHTML = shopItems.map(i => (
  `<div class=\"shop-card\"><img src=\"${i.img || 'assets/avatars/avatar1.svg'}\" alt=\"\"><div style=\"flex:1\"><h3>${i.title}</h3><p class=\"muted\">${i.type==='pro'?'Unlock all features': i.price + ' pts'}</p></div><button class=\"btn\">${i.type==='pro'?'Go Pro':'Redeem'}</button></div>`
)).join('');

// ===== Level + Rank (progress ring) =====
function updateRank(){
  const level = Math.floor(points / 120) + 1;
  const percent = points % 100;
  $('#rankRing').style.setProperty('--p', clamp(percent,0,100));
  $('#rankPercent').textContent = `${clamp(percent,0,100)}%`;
  $('#levelValue').textContent = level;
  $('#rankLabel').textContent = level < 5 ? 'Apprentice' : level < 10 ? 'Strategist' : 'Grandmaster';
  $('#globalRank').textContent = `#${clamp(1000 - points, 1, 9999)}`;
}
 $('#btnBoost')?.addEventListener('click', () => {
  points += 25; localStorage.setItem(STORAGE_KEYS.points, String(points)); syncStats();
});

// ===== Dreams (game-like destinations) =====
const cities = [
  {name:'Singapore', sub:'Singapore', flag:'🇸🇬', img:'assets/cities/singapore_flag.png'},
  {name:'Tokyo', sub:'Japan', flag:'🇯🇵', img:'assets/cities/japan_flag.png'},
  {name:'New York City', sub:'USA', flag:'🇺🇸', img:'assets/cities/usa_flag.png'},
  {name:'London', sub:'United Kingdom', flag:'🇬🇧', img:'assets/cities/uk_flag.png'},
  {name:'Toronto', sub:'Canada', flag:'🇨🇦', img:'assets/cities/canada_flag.png'},
  {name:'Cape Town', sub:'South Africa', flag:'🇿🇦', img:'assets/cities/south-africa_flag.png'},
  {name:'Paris', sub:'France', flag:'🇫🇷', img:'assets/cities/france_flag.png'},
  {name:'Bangkok', sub:'Thailand', flag:'🇹🇭', img:'assets/cities/thailand_flag.png'},
  {name:'Doha', sub:'Qatar', flag:'🇶🇦', img:'assets/cities/qatar_flag.png'},
  {name:'Kuala Lumpur', sub:'Malaysia', flag:'🇲🇾', img:'assets/cities/malaysia_flag.png'},
];
function loadDreams(){ try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.dreams) || '[]'); } catch { return []; } }
function saveDreams(list){ localStorage.setItem(STORAGE_KEYS.dreams, JSON.stringify(list)); }
function renderCities(){
  const wrap = $('#locations'); wrap.innerHTML = '';
  cities.forEach(c => {
    const btn = document.createElement('button');
    btn.className = 'loc';
    btn.innerHTML = `<img class=\"loc-img\" src=\"${c.img}\" alt=\"${c.name}\"> <span>${c.flag} ${c.name} - ${c.sub}</span>`;
    btn.addEventListener('click', () => {
      $$('.loc').forEach(x => x.classList.remove('active'));
      btn.classList.add('active');
      const list = loadDreams();
      list.push({text:`Collect a stamp in ${c.name}`, done:false});
      saveDreams(list); renderDreams();
      points += 10; localStorage.setItem(STORAGE_KEYS.points, String(points)); syncStats();
    });
    wrap.appendChild(btn);
  });
}
function renderDreams(){
  const ul = $('#dreamList'); const list = loadDreams();
  ul.innerHTML = list.map((d,i)=>`
    <li>
      <label style="display:flex; align-items:center; gap:8px">
        <input type="checkbox" data-index="${i}" ${d.done?'checked':''} />
        <span class="${d.done?'muted':''}">${d.text}</span>
      </label>
    </li>
  `).join('');
  $$('input[type="checkbox"][data-index]').forEach(cb => {
    cb.addEventListener('change', () => {
      const idx = Number(cb.dataset.index); const items = loadDreams();
      items[idx].done = cb.checked; saveDreams(items);
      if(cb.checked){ points += 20; localStorage.setItem(STORAGE_KEYS.points, String(points)); syncStats(); }
      renderDreams();
    });
  });
}

// ===== Dream Shop (Destinations, Houses, Super Cars) =====
const dreamShopData = {
  destinations: [
    {id:'dest-sg', name:'Singapore', country:'Singapore', img:'assets/cities/singapore_flag.png', price:200},
    {id:'dest-tokyo', name:'Tokyo', country:'Japan', img:'assets/cities/japan_flag.png', price:200},
    {id:'dest-ny', name:'New York City', country:'USA', img:'assets/cities/usa_flag.png', price:200},
    {id:'dest-london', name:'London', country:'United Kingdom', img:'assets/cities/uk_flag.png', price:200},
    {id:'dest-toronto', name:'Toronto', country:'Canada', img:'assets/cities/canada_flag.png', price:200},
    {id:'dest-capetown', name:'Cape Town', country:'South Africa', img:'assets/cities/south-africa_flag.png', price:200},
    {id:'dest-paris', name:'Paris', country:'France', img:'assets/cities/france_flag.png', price:200},
    {id:'dest-bangkok', name:'Bangkok', country:'Thailand', img:'assets/cities/thailand_flag.png', price:200},
    {id:'dest-doha', name:'Doha', country:'Qatar', img:'assets/cities/qatar_flag.png', price:200},
    {id:'dest-kl', name:'Kuala Lumpur', country:'Malaysia', img:'assets/cities/malaysia_flag.png', price:200},
  ],
  houses: [
    {id:'house-1', name:'Modern Villa', img:'assets/houses/house.png', price:500},
    {id:'house-2', name:'Skyline Condo', img:'assets/houses/house.png', price:550},
    {id:'house-3', name:'Futuristic Retreat', img:'assets/houses/house.png', price:600},
    {id:'house-4', name:'Urban Loft', img:'assets/houses/house.png', price:520},
    {id:'house-5', name:'Glass Mansion', img:'assets/houses/house.png', price:650},
  ],
  cars: [
    {id:'car-huracan', name:'Lamborghini Huracán', img:'assets/cars/supercar.png', price:1000},
    {id:'car-sf90', name:'Ferrari SF90 Stradale', img:'assets/cars/supercar.png', price:1000},
    {id:'car-911', name:'Porsche 911 Turbo S', img:'assets/cars/supercar.png', price:1000},
    {id:'car-720s', name:'McLaren 720S', img:'assets/cars/supercar.png', price:1000},
    {id:'car-dbs', name:'Aston Martin DBS Superleggera', img:'assets/cars/supercar.png', price:1000},
    {id:'car-chiron', name:'Bugatti Chiron', img:'assets/cars/supercar.png', price:1000},
    {id:'car-jesko', name:'Koenigsegg Jesko', img:'assets/cars/supercar.png', price:1000},
    {id:'car-bentley', name:'Bentley Continental GT Speed', img:'assets/cars/supercar.png', price:1000},
    {id:'car-i8', name:'BMW i8', img:'assets/cars/supercar.png', price:1000},
    {id:'car-amg', name:'Mercedes‑AMG GT Black Series', img:'assets/cars/supercar.png', price:1000},
    {id:'car-r8', name:'Audi R8 V10', img:'assets/cars/supercar.png', price:1000},
  ],
};

function renderDreamShop(){
  const container = document.getElementById('dreamShop');
  if(!container) return;
  container.innerHTML = '';
  const categories = [
    {key:'destinations', title:'Travel Destinations'},
    {key:'houses', title:'Modern Houses'},
    {key:'cars', title:'Super Cars'},
  ];
  categories.forEach(cat => {
    const items = dreamShopData[cat.key] || [];
    const section = document.createElement('div');
    section.className = 'dream-category';
    const iconName = cat.key;
    let html = `<div class="dream-category-header"><img class="dream-cat-icon" src="assets/dreams/${iconName}.png" alt=""><h3>${cat.title}</h3><button class="dream-category-toggle" aria-expanded="true">−</button></div>`;
    html += `<div class="carousel" id="${cat.key}Carousel">`;
    html += items.map(item => {
      return `<div class="item" data-id="${item.id}">
        <img src="${item.img}" alt="" class="item-img">
        <div class="item-info">
          <h4>${item.name}</h4>
          ${item.country ? `<small>${item.country}</small>` : ''}
          <p class="price">${item.price} pts</p>
          <button class="btn buy-btn" data-id="${item.id}" data-category="${cat.key}" data-price="${item.price}">Buy</button>
        </div>
      </div>`;
    }).join('');
    html += `</div>`;
    html += `<div class="carousel-controls">
      <button class="carousel-btn prev" data-target="${cat.key}Carousel">‹</button>
      <button class="carousel-btn next" data-target="${cat.key}Carousel">›</button>
    </div>`;
    section.innerHTML = html;
    container.appendChild(section);
    const toggleBtn = section.querySelector('.dream-category-toggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        const collapsed = section.classList.toggle('collapsed');
        toggleBtn.textContent = collapsed ? '+' : '−';
        toggleBtn.setAttribute('aria-expanded', (!collapsed).toString());
      });
    }
  });
  document.querySelectorAll('.carousel-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = document.getElementById(btn.dataset.target);
      if(!target) return;
      const item = target.querySelector('.item');
      const scrollAmount = item ? (item.offsetWidth + 16) : 220;
      if(btn.classList.contains('prev')){
        target.scrollBy({left:-scrollAmount, behavior:'smooth'});
      } else {
        target.scrollBy({left:scrollAmount, behavior:'smooth'});
      }
    });
  });
  document.querySelectorAll('.buy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const price = parseInt(btn.dataset.price, 10);
      if(points < price){
        alert('Not enough points! Earn more by completing lessons and quizzes.');
        return;
      }
      points -= price;
      localStorage.setItem(STORAGE_KEYS.points, String(points));
      syncStats();
      btn.textContent = 'Owned';
      btn.disabled = true;
      btn.classList.add('owned');
    });
  });
}
renderCities(); renderDreams();
renderDreamShop();

// ===== WORKING AI CHATBOT WITH API INTEGRATION =====
// CHANGE this to your backend URL
const BASE_URL = "https://mqtest-3ypm.onrender.com";

const chatBox = $('#chat');
const chatForm = $('#chatForm');
const chatInput = $('#chatInput');
const sendBtn = $('#sendChat');
const uploadBtn = $('#uploadBtn');
const imageInput = $('#imageInput');
const imagePreview = $('#imagePreview');

let selectedImage = null;

// Add initial welcome message
if(chatBox && chatBox.children.length === 0){
  const welcomeDiv = document.createElement('div');
  welcomeDiv.className = 'chat-message ai';
  welcomeDiv.textContent = '👋 Hi! I\'m your AI Study Buddy. Ask me any math question or upload an image of a problem you need help with!';
  chatBox.appendChild(welcomeDiv);
}

// Handle upload button click
if(uploadBtn){
  uploadBtn.addEventListener('click', (e) => {
    e.preventDefault();
    imageInput?.click();
  });
}

// Handle image selection
if(imageInput){
  imageInput.addEventListener('change', (e) => {
    selectedImage = e.target.files[0];
    if (selectedImage && imagePreview) {
      imagePreview.textContent = `📎 ${selectedImage.name}`;
      imagePreview.classList.add('show');
      if(uploadBtn){
        uploadBtn.textContent = '✓';
        uploadBtn.style.background = 'linear-gradient(135deg, #4caf50, #21a1f3)';
        setTimeout(() => {
          uploadBtn.textContent = '📎';
          uploadBtn.style.background = '';
        }, 2000);
      }
    }
  });
}

// Add message to chat
function appendMsg(text, who='ai'){
  if(!chatBox) return;
  const div = document.createElement('div');
  div.className = `chat-message ${who}`;
  div.textContent = text;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Add loading message
function addLoading() {
  if(!chatBox) return;
  const loadingDiv = document.createElement('div');
  loadingDiv.className = 'chat-message loading';
  loadingDiv.id = 'loading-msg';
  loadingDiv.textContent = '⏳ AI is thinking...';
  chatBox.appendChild(loadingDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Remove loading message
function removeLoading() {
  const loading = document.getElementById('loading-msg');
  if (loading) loading.remove();
}

// Handle form submission
if(chatForm){
  chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const question = chatInput?.value.trim();
    if (!question && !selectedImage) return;

    // Disable send button
    if(sendBtn){
      sendBtn.disabled = true;
      sendBtn.textContent = '...';
    }

    // Add user message
    if (question) {
      appendMsg(question, 'user');
    }
    if (selectedImage) {
      appendMsg(`📎 Uploaded: ${selectedImage.name}`, 'user');
    }

    // Clear input
    if(chatInput) chatInput.value = '';
    if(imagePreview) imagePreview.classList.remove('show');

    // Show loading
    addLoading();

    // Prepare form data
    const formData = new FormData();
    if (question) formData.append('question', question);
    if (selectedImage) formData.append('image', selectedImage);

    try {
      const response = await fetch(`${BASE_URL}/solve`, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      
      removeLoading();

      if (data.response) {
        appendMsg(data.response, 'ai');
      } else {
        appendMsg('⚠️ Error: ' + (data.error || 'Unknown issue'), 'ai');
      }
    } catch (error) {
      removeLoading();
      appendMsg('⚠️ Network error. Please check your connection and try again.', 'ai');
      console.error('Chat error:', error);
    } finally {
      // Re-enable send button
      if(sendBtn){
        sendBtn.disabled = false;
        sendBtn.textContent = 'Send';
      }
      
      // Clear selected image
      selectedImage = null;
      if(imageInput) imageInput.value = '';
    }
  });
}

// ===== Lessons cards (image 1 style) =====
const allLessons = [
  "Number Patterns","Perimeter","Angles","Directed Numbers","Algebraic Expressions","Solids",
  "Factors","Square Root","Mass","Indices","Symmetry","Triangles","Fractions","Decimals",
  "Ratios","Equations","Percentages","Sets","Area","Time","Volume and Capacity","Circle",
  "Location of a Place","Number Line and Cartesian Plane","Triangle Constructions",
  "Data Representation and Interpretation","Scale Drawings","Probability","Tessellation"
];
const approxMinutes = {
  "Number Patterns":20,"Perimeter":22,"Angles":22,"Directed Numbers":24,"Algebraic Expressions":30,"Solids":28,
  "Factors":20,"Square Root":18,"Mass":22,"Indices":26,"Symmetry":20,"Triangles":24,"Fractions":25,"Decimals":25,
  "Ratios":22,"Equations":28,"Percentages":26,"Sets":20,"Area":24,"Time":24,"Volume and Capacity":32,"Circle":26,
  "Location of a Place":24,"Number Line and Cartesian Plane":24,"Triangle Constructions":26,
  "Data Representation and Interpretation":28,"Scale Drawings":24,"Probability":22,"Tessellation":23
};
const LESSONS_INIT_COUNT = 8;
let lessonsShowAll = false;

const lessonIcons = {
  "Number Patterns":"assets/lessons/number patterns.png",
  "Perimeter":"assets/lessons/perimeater.png",
  "Angles":"assets/lessons/angles.png",
  "Directed Numbers":"assets/lessons/number patterns.png",
  "Algebraic Expressions":"assets/quizzes/algebra-1.jpg",
  "Solids":"assets/lessons/solid.png",
  "Factors":"assets/lessons/factors.png",
  "Square Root":"assets/lessons/squareroot.png",
  "Mass":"assets/lessons/mass.svg",
  "Indices":"assets/lessons/indices.svg",
  "Symmetry":"assets/lessons/symmetry.svg",
  "Triangles":"assets/lessons/triangles.svg",
  "Fractions":"assets/lessons/fractions.svg",
  "Decimals":"assets/lessons/decimals.svg",
  "Ratios":"assets/lessons/ratios.svg",
  "Equations":"assets/lessons/equations.svg",
  "Percentages":"assets/lessons/percentages.svg",
  "Sets":"assets/lessons/sets.svg",
  "Area":"assets/lessons/area.svg",
  "Time":"assets/lessons/time.svg",
  "Volume and Capacity":"assets/lessons/volume_and_capacity.svg",
  "Circle":"assets/lessons/circle.svg",
  "Location of a Place":"assets/lessons/location_of_a_place.svg",
  "Number Line and Cartesian Plane":"assets/lessons/number_line_and_cartesian_plane.svg",
  "Triangle Constructions":"assets/lessons/triangle_constructions.svg",
  "Data Representation and Interpretation":"assets/lessons/data_representation_and_interpretation.svg",
  "Scale Drawings":"assets/lessons/scale_drawings.svg",
  "Probability":"assets/lessons/probability.svg",
  "Tessellation":"assets/lessons/tessellation.svg"
};

// Lesson URLs mapping
const lessonUrls = {
  "Number Patterns":"https://mqtest-1.onrender.com/number-patterns",
  "Perimeter":"https://mqtest-1.onrender.com/perimeter",
  "Angles":"https://mqtest-1.onrender.com/angles",
  "Directed Numbers":"https://mqtest-1.onrender.com/directed-numbers",
  "Algebraic Expressions":"https://mqtest-1.onrender.com/algebra",
  "Solids":"https://mqtest-1.onrender.com/solids",
  "Factors":"https://mqtest-1.onrender.com/factors",
  "Square Root":"https://mqtest-1.onrender.com/square-root",
  "Mass":"https://mqtest-1.onrender.com/mass",
  "Indices":"https://mqtest-1.onrender.com/indices",
  "Symmetry":"https://mqtest-1.onrender.com/symmetry",
  "Triangles":"https://mqtest-1.onrender.com/triangles",
  "Fractions":"https://mqtest-1.onrender.com/fractions",
  "Decimals":"https://mqtest-1.onrender.com/decimals",
  "Ratios":"https://mqtest-1.onrender.com/ratios",
  "Equations":"https://mqtest-1.onrender.com/equations",
  "Percentages":"https://mqtest-1.onrender.com/percentages",
  "Sets":"https://mqtest-1.onrender.com/sets",
  "Area":"https://mqtest-1.onrender.com/area",
  "Time":"https://mqtest-1.onrender.com/time",
  "Volume and Capacity":"https://mqtest-1.onrender.com/volume",
  "Circle":"https://mqtest-1.onrender.com/circle",
  "Location of a Place":"https://mqtest-1.onrender.com/location",
  "Number Line and Cartesian Plane":"https://mqtest-1.onrender.com/number-line",
  "Triangle Constructions":"https://mqtest-1.onrender.com/triangle-constructions",
  "Data Representation and Interpretation":"https://mqtest-1.onrender.com/data",
  "Scale Drawings":"https://mqtest-1.onrender.com/scale",
  "Probability":"https://mqtest-1.onrender.com/probability",
  "Tessellation":"https://mqtest-1.onrender.com/tessellation"
};

function renderLessonsGrid(){
  const grid = document.getElementById('lessonsCards');
  if(!grid) return;
  const items = lessonsShowAll ? allLessons : allLessons.slice(0, LESSONS_INIT_COUNT);
  grid.innerHTML = items.map(title => {
    const mins = approxMinutes[title] ?? 24;
    const url = lessonUrls[title] || "#";
    return `<div class="lesson-card"><div class="lesson-top"><img class="thumb" src="${lessonIcons[title] || 'assets/lessons/default.svg'}" alt=""><div><h3>${title}</h3><p>Approx. ${mins} min</p></div></div><button class="btn" onclick="window.location.href='${url}'">Preview</button></div>`;
  }).join('');
  const btn = document.getElementById('toggleAllLessons');
  if(btn){
    btn.textContent = lessonsShowAll ? 'Show less' : 'See all';
    btn.setAttribute('aria-expanded', String(lessonsShowAll));
  }
}
renderLessonsGrid();

document.getElementById('toggleAllLessons')?.addEventListener('click', () => {
  lessonsShowAll = !lessonsShowAll;
  renderLessonsGrid();
  if(lessonsShowAll){ document.getElementById('lessons').scrollIntoView({behavior:'smooth', block:'start'}); }
});