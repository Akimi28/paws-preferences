const TOTAL_CATS = 10;
const container = document.getElementById("card-container");
const result = document.getElementById("result");
const likeCount = document.getElementById("like-count");
const likedCatsDiv = document.getElementById("liked-cats");

let likedCats = [];
let currentIndex = 0;

// Generate cats
const cats = Array.from({ length: TOTAL_CATS }, () =>
  `https://cataas.com/cat?random=${Math.random()}`
);

// Create cards
cats.reverse().forEach((src, index) => {
  const card = document.createElement("div");
  card.className = "card";

  const img = document.createElement("img");
  img.src = src;

  const likeLabel = document.createElement("div");
  likeLabel.className = "label like";
  likeLabel.textContent = "LIKE";

  const nopeLabel = document.createElement("div");
  nopeLabel.className = "label nope";
  nopeLabel.textContent = "NOPE";

  const heart = document.createElement("div");
  heart.className = "burst heart";
  heart.textContent = "❤️";

  const cross = document.createElement("div");
  cross.className = "burst cross";
  cross.textContent = "❌";

  if (index === TOTAL_CATS - 1) { // First card only
    const hint = document.createElement("div");
    hint.className = "hint";
    hint.textContent = "← Drag to skip • Drag to like →";
    card.appendChild(hint);
  }

  card.append(img, likeLabel, nopeLabel, heart, cross);
  container.appendChild(card);

  addSwipe(card, src, likeLabel, nopeLabel, heart, cross);
});

updateProgress();

/* Swipe / Drag Handling */
function addSwipe(card, src, likeLabel, nopeLabel, heart, cross) {
  let startX = 0, currentX = 0, isDragging = false;

  card.addEventListener("touchstart", e => startX = e.touches[0].clientX);
  card.addEventListener("touchmove", e => {
    currentX = e.touches[0].clientX - startX;
    moveCard(card, currentX, likeLabel, nopeLabel);
  });
  card.addEventListener("touchend", () => {
    endSwipe(card, currentX, src, heart, cross);
    resetLabels(likeLabel, nopeLabel);
  });

  card.addEventListener("mousedown", e => {
    isDragging = true;
    startX = e.clientX;
    card.style.transition = "none";
  });
  document.addEventListener("mousemove", e => {
    if (!isDragging) return;
    currentX = e.clientX - startX;
    moveCard(card, currentX, likeLabel, nopeLabel);
  });
  document.addEventListener("mouseup", () => {
    if (!isDragging) return;
    isDragging = false;
    endSwipe(card, currentX, src, heart, cross);
    resetLabels(likeLabel, nopeLabel);
  });
}

function moveCard(card, x, likeLabel, nopeLabel) {
  card.style.transform = `translateX(${x}px) rotate(${x / 10}deg)`;
  const opacity = Math.min(Math.abs(x) / 120, 1);
  likeLabel.style.opacity = x>0?opacity:0;
  nopeLabel.style.opacity = x<0?opacity:0;
}
function resetLabels(likeLabel, nopeLabel){ likeLabel.style.opacity=0; nopeLabel.style.opacity=0; }

function endSwipe(card, x, src, heart, cross){
  if(x>120){ heart.classList.add("animate"); handleAction(card, src, true); }
  else if(x<-120){ cross.classList.add("animate"); handleAction(card, src, false); }
  else { card.style.transition="0.3s"; card.style.transform=""; }
}

function handleAction(card, src, liked){
  if(liked) likedCats.push(src);
  card.style.transition="0.3s";
  card.style.transform=`translateX(${liked?1000:-1000}px)`;
  setTimeout(()=>{ card.remove(); currentIndex++; updateProgress(); if(currentIndex===TOTAL_CATS) showResult(); }, 300);
}

function updateProgress(){
  const progressText=document.getElementById("progress-text");
  progressText.textContent=`${currentIndex+1} / ${TOTAL_CATS}`;
}

function showResult(){
  result.classList.remove("hidden");
  likeCount.textContent=likedCats.length;
  likedCatsDiv.innerHTML="";
  likedCats.forEach(src=>{ const img=document.createElement("img"); img.src=src; likedCatsDiv.appendChild(img); });
}

/* BUTTONS */
document.getElementById("like-btn").addEventListener("click", ()=>{
  const card=document.querySelector(".card:last-child"); if(!card) return;
  handleAction(card, card.querySelector("img").src, true);
});
document.getElementById("dislike-btn").addEventListener("click", ()=>{
  const card=document.querySelector(".card:last-child"); if(!card) return;
  handleAction(card, card.querySelector("img").src, false);
});

/* KEYBOARD */
document.addEventListener("keydown", e=>{
  const card=document.querySelector(".card:last-child"); if(!card) return;
  if(e.key==="ArrowRight") handleAction(card, card.querySelector("img").src,true);
  if(e.key==="ArrowLeft") handleAction(card, card.querySelector("img").src,false);
});

/* DARK MODE */
document.getElementById("theme-toggle").addEventListener("click", ()=>{
  document.body.classList.toggle("dark");
});
