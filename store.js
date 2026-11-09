// Each wardrobe belongs to a pet; coins belong to the player.
(() => {
  const items = [
    {id:'strawberry',name:'Strawberry Bucket',price:60,slot:'hat',color:'#ffa7c8',trim:'#e66a9e',detail:'berry',description:'Berry pink with tiny strawberry seeds.'},
    {id:'frog',name:'Froggy Bucket',price:70,slot:'hat',color:'#a7e7a0',trim:'#56ae83',detail:'frog',description:'A little froggy friend for your head.'},
    {id:'daisy',name:'Daisy Bucket',price:65,slot:'hat',color:'#c7baff',trim:'#9380d5',detail:'flower',description:'Lavender dreams and a sunny daisy.'},
    {id:'bow',name:'Peach Bow',price:35,slot:'neck',color:'#ffafad',description:'A soft peach bow under the chin.'},
    {id:'bandana',name:'Sky Bandana',price:40,slot:'neck',color:'#82d9f7',description:'A tiny sky-blue scarf with a heart.'},
    {id:'flower',name:'Blossom Clip',price:30,slot:'hat',color:'#ffe2ee',description:'A sweet flower tucked beside one ear.'}
  ];
  const wardrobes = {bunny:{owned:[],hat:null,neck:null},dog:{owned:[],hat:null,neck:null},cat:{owned:[],hat:null,neck:null}};
  let shoppingPet = 'dog';
  function flower(x,y,r=7){return `<g transform="translate(${x} ${y})">${[0,72,144,216,288].map(a=>`<ellipse cx="0" cy="-${r*.65}" rx="${r*.46}" ry="${r*.65}" fill="#fff8fb" transform="rotate(${a})"/>`).join('')}<circle r="${r*.36}" fill="#ffd65e"/></g>`;}
  function art(item){
    if(item.slot==='hat' && item.id!=='flower') return `<path d="M29 48 35 18 Q50 9 65 18L71 48Z" fill="${item.color}" stroke="${item.trim}" stroke-width="2"/><path d="M28 40Q50 46 72 40L84 53Q50 65 16 53Z" fill="${item.color}" stroke="${item.trim}" stroke-width="2"/><path d="M34 33Q50 37 66 33" fill="none" stroke="${item.trim}" stroke-width="4"/>${item.detail==='frog'?'<g fill="#a7e7a0" stroke="#56ae83" stroke-width="2"><circle cx="39" cy="15" r="7"/><circle cx="61" cy="15" r="7"/></g><g fill="#285347"><circle cx="39" cy="14" r="2"/><circle cx="61" cy="14" r="2"/><path d="M46 25Q50 29 54 25" fill="none" stroke="#285347" stroke-width="2"/></g>':item.detail==='flower'?flower(53,26,9):'<path d="M45 23Q50 18 55 23L50 31Z" fill="#ed5985"/><path d="m46 20 4 3 4-3" fill="none" stroke="#4f9f70" stroke-width="3"/><g fill="#fff3b8"><circle cx="49" cy="25" r="1"/><circle cx="52" cy="24" r="1"/></g>'}`;
    if(item.id==='bow')return `<path d="M48 34Q15 10 23 42Q28 59 48 43L40 61 51 55 62 61 54 43Q84 59 78 31Q73 17 54 34Z" fill="${item.color}" stroke="#d9788e" stroke-width="2"/><circle cx="51" cy="38" r="7" fill="#ffe0da"/>`;
    if(item.id==='bandana')return '<path d="M21 26Q50 38 79 26L53 64Z" fill="#82d9f7" stroke="#469fbf" stroke-width="2"/><path d="M45 43C39 34 56 34 53 43 63 32 68 45 53 52Z" fill="white"/>';
    return flower(50,35,21);
  }
  const dialog = document.createElement('dialog'); dialog.className='boutique'; dialog.setAttribute('aria-labelledby','store-title');
  dialog.innerHTML=`<form method="dialog" class="store-close-form"><button type="submit" id="close-store" aria-label="Close store">✕</button></form><div class="store-heading"><h2 id="store-title">🌷 Little Sprout Boutique</h2></div><p class="store-intro">Pick a friend, then buy a little happiness! Purchases are for that pet. One head accessory + one neck accessory at a time.</p><div class="store-controls"><button type="button" data-pet="dog">🐶 Puppy</button><button type="button" data-pet="bunny">🐰 Bunny</button><button type="button" data-pet="cat">🐱 Kitten</button><span class="store-balance">🪙 <span id="store-coins"></span> coins</span></div><div class="store-grid"></div><p class="store-message" role="status" aria-live="polite"></p><p class="store-intro">Testing: each new game starts with 200 coins. Correct answers earn 20 more!</p>`;
  document.body.append(dialog);
  function render(){
    document.getElementById('coin-count').textContent=coins;
    dialog.querySelector('#store-coins').textContent=coins;
    dialog.querySelectorAll('[data-pet]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.pet===shoppingPet)));
    const wardrobe=wardrobes[shoppingPet];
    dialog.querySelector('.store-grid').innerHTML=items.map(item=>{
      const owned=wardrobe.owned.includes(item.id), equipped=wardrobe[item.slot]===item.id;
      return `<article class="shop-card"><svg class="shop-art" viewBox="0 0 100 76" aria-hidden="true">${art(item)}</svg><h3>${item.name}</h3><p>${item.description}</p><button type="button" class="shop-buy ${equipped?'equipped':''}" data-item="${item.id}" ${!owned&&coins<item.price?'disabled':''}>${equipped?'Take off':owned?'Wear it':coins<item.price?`Need ${item.price-coins} more 🪙`:`Buy · ${item.price} 🪙`}</button></article>`;
    }).join('');
  }
  dialog.addEventListener('click',event=>{
    const pet=event.target.closest('[data-pet]'); if(pet){shoppingPet=pet.dataset.pet;dialog.querySelector('.store-message').textContent='';render();return;}
    const button=event.target.closest('[data-item]'); if(!button)return;
    const item=items.find(i=>i.id===button.dataset.item),wardrobe=wardrobes[shoppingPet];
    if(!wardrobe.owned.includes(item.id)){if(coins<item.price)return;coins-=item.price;wardrobe.owned.push(item.id);}
    wardrobe[item.slot]=wardrobe[item.slot]===item.id?null:item.id;
    dialog.querySelector('.store-message').textContent=wardrobe[item.slot]?`${item.name} looks lovely on ${shoppingPet==='dog'?'Puppy':'Bunny'}!`:`${item.name} tucked into the wardrobe.`;
    render();draw(shoppingPet);
  });
  document.getElementById('open-store').addEventListener('click',()=>{shoppingPet=selectedPet;render();dialog.showModal();});
  dialog.addEventListener('cancel',event=>{event.preventDefault();dialog.close();});
  window.addEventListener('coins-changed',render);
  // Anchors use fractions of the source PNG, including its transparent padding.
  // SVG preserveAspectRatio matches the image's object-fit:contain at any size.
  function anchors(kind,index){
    if(kind==='cat'){if(index<4)return [.62,.45,.62,.64,.69];if(index<8)return [.70,.36,.58,.68,.69];if(index<16)return [.72,.34,.60,.70,.70];return [.73,.36,.60,.70,.72];}
    if(kind==='dog'){
      if(index<2)return [.70,.18,.60,.71,.65];
      if(index<4)return [.70,.14,.56,.70,.60];
      if(index<12)return [.72,.13,.54,.66,.51];
      if(index<21)return [.72,.14,.54,.69,.56];
      if(index===21)return [.73,.24,.56,.70,.66];
      if(index===22)return [.72,.33,.56,.70,.71];
      return [.71,.41,.58,.72,.76];
    }
    if(index===0)return [.75,.43,.58,.75,.76];
    if(index===1)return [.74,.32,.54,.72,.72];
    if(index<8)return [.74,.34,.56,.70,.66];
    if(index<40)return [.72,.35,.58,.69,.65];
    if(index<42)return [.68,.32,.60,.68,.64];
    if(index<47)return [.69,.32,.62,.69,.65];
    return [.69,.41,.62,.73,.77];
  }
  function draw(kind){
    const img=document.getElementById(`${kind}-sprite-img`),layer=document.getElementById(`${kind}-outfit`);
    if(!img.naturalWidth||!img.complete){layer.innerHTML='';return;}
    const w=img.naturalWidth,h=img.naturalHeight;
    layer.setAttribute('viewBox',`0 0 ${w} ${h}`);
    const [hx,hy,hw,nx,ny]=anchors(kind,kind==='dog'?dogSpriteIdx:kind==='cat'?catSpriteIdx:currentSpriteIdx);
    layer.innerHTML=['hat','neck'].map(slot=>{
      const item=items.find(i=>i.id===wardrobes[kind][slot]);if(!item)return '';
      const width=w*(slot==='hat'?hw:.44),scale=width/100;
      const x=w*(slot==='hat'?hx:nx),y=h*(slot==='hat'?hy:ny);
      // Hat brim sits at the forehead; bunny ears remain visible above it.
      return `<g transform="translate(${x-width/2} ${y-scale*(slot==='hat'?52:30)}) scale(${scale})">${art(item)}</g>`;
    }).join('');
  }
  for(const kind of ['bunny','dog','cat']){
    const img=document.getElementById(`${kind}-sprite-img`),visual=document.createElement('div');visual.className='pet-outfit';img.before(visual);visual.append(img);
    const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.id=`${kind}-outfit`;svg.classList.add('outfit-layer');svg.setAttribute('aria-hidden','true');visual.append(svg);
    img.addEventListener('load',()=>draw(kind));img.addEventListener('error',()=>svg.innerHTML='');
    new MutationObserver(()=>{svg.innerHTML='';if(img.complete)draw(kind);}).observe(img,{attributes:true,attributeFilter:['src']});draw(kind);
  }
  render();
})();
