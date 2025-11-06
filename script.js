// elements
const card = document.getElementById('card3d');
const openBtn = document.getElementById('openBtn');
const closeBtn = document.getElementById('closeBtn');
const celebrateBtn = document.getElementById('celebrateBtn');
const updateBtn = document.getElementById('updateBtn');
const downloadBtn = document.getElementById('downloadBtn');

const greeting = document.getElementById('greeting');
const msg = document.getElementById('msg');
const sender = document.getElementById('sender');

const inputTeacher = document.getElementById('inputTeacher');
const inputSender = document.getElementById('inputSender');
const inputMessage = document.getElementById('inputMessage');
const preset = document.getElementById('preset');

// open/close
openBtn.addEventListener('click', () => {
  card.classList.add('card-open');
  card.style.transition = 'transform 900ms cubic-bezier(.2,.9,.3,1)';
});
closeBtn.addEventListener('click', () => {
  card.classList.remove('card-open');
});

// update content
updateBtn.addEventListener('click', () => {
  const teacherVal = inputTeacher.value.trim();
  const senderVal = inputSender.value.trim();
  const messageVal = inputMessage.value.trim();

  greeting.textContent = teacherVal ? `Dear ${teacherVal}` : 'Happy Teachers\' Day 🌼';
  msg.textContent = messageVal || 'Thank you for turning small sparks into bright ideas and for guiding us with patience and care.';
  sender.textContent = senderVal ? `— From ${senderVal}` : '— From [Your Name]';
});

// preset styles
preset.addEventListener('change', () => {
  const v = preset.value;
  if (v === 'warm') {
    document.documentElement.style.setProperty('--accent-1', '#7c3aed');
    document.documentElement.style.setProperty('--accent-2', '#f43f5e');
  } else if (v === 'cool') {
    document.documentElement.style.setProperty('--accent-1', '#06b6d4');
    document.documentElement.style.setProperty('--accent-2', '#7c3aed');
  } else if (v === 'mint') {
    document.documentElement.style.setProperty('--accent-1', '#10b981');
    document.documentElement.style.setProperty('--accent-2', '#34d399');
  }
});

// celebrate: confetti burst
celebrateBtn.addEventListener('click', () => {
  burstConfetti(80);
});

function burstConfetti(n) {
  for (let i = 0; i < n; i++) {
    const el = document.createElement('div');
    el.className = 'confetti';
    const colors = ['#f43f5e', '#fb923c', '#f59e0b', '#7c3aed', '#06b6d4', '#10b981', '#f472b6'];
    el.style.background = colors[Math.floor(Math.random() * colors.length)];
    el.style.left = Math.random() * window.innerWidth + 'px';
    el.style.top = (window.innerHeight * 0.15 + Math.random() * 50) + 'px';
    el.style.opacity = Math.random() * 0.9 + 0.3;
    const rot = Math.random() * 360;
    el.style.transform = `rotate(${rot}deg)`;
    document.body.appendChild(el);

    const duration = 2200 + Math.random() * 800;
    el.animate([
      { transform: `translateY(0px) rotate(${rot}deg)`, opacity: el.style.opacity },
      { transform: `translateY(${window.innerHeight + 200}px) rotate(${rot + 720}deg)`, opacity: 0 }
    ], { duration, easing: 'cubic-bezier(.2,.9,.3,1)' });

    setTimeout(() => el.remove(), duration + 50);
  }
}

// download: render card to canvas & download
downloadBtn.addEventListener('click', async () => {
  // Clone the card for snapshot, remove 3D transforms so it appears flat
  const node = document.querySelector('.card-3d');
  const clone = node.cloneNode(true);
  clone.style.transform = 'none';
  clone.classList.remove('card-open');

  // Inline computed styles for clone to improve rendering in foreignObject
  inlineAllStyles(clone);

  const width = node.offsetWidth;
  const height = node.offsetHeight;

  const xml = `<?xml version="1.0" encoding="utf-8"?>\n` +
    `<svg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}'>` +
    `<foreignObject width='100%' height='100%'>` +
    new XMLSerializer().serializeToString(clone)
    + `</foreignObject></svg>`;

  const svgBlob = new Blob([xml], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);
  const img = new Image();
  img.onload = () => {
    const canvas = document.createElement('canvas');
    canvas.width = width * 2; canvas.height = height * 2; // hi-dpi
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = getComputedStyle(document.body).background || '#071023';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'teachers-day-card.png';
      a.click();
      URL.revokeObjectURL(a.href);
    });
    URL.revokeObjectURL(url);
  };
  img.onerror = () => { alert('Download failed in this browser. Try using Chrome or Firefox.'); URL.revokeObjectURL(url); };
  img.src = url;
});

// small helper to inline computed styles — improves SVG rendering
function inlineAllStyles(root) {
  const nodes = root.querySelectorAll('*');
  nodes.forEach(el => inlineStyles(el));
  inlineStyles(root);
}
function inlineStyles(el) {
  const cs = window.getComputedStyle(document.querySelector(`[data-clone-id="${el.getAttribute('data-clone-id')}"]`) || el);
  let styleText = '';
  for (let i = 0; i < cs.length; i++) {
    const prop = cs[i];
    const val = cs.getPropertyValue(prop);
    styleText += `${prop}:${val};`;
  }
  // if computed style retrieval failed, skip
  if (styleText) el.setAttribute('style', styleText);
}

// clicking card toggles open (but ignore inner button clicks)
card.addEventListener('click', (e) => {
  if (e.target.closest('button')) return;
  card.classList.toggle('card-open');
});

// initial preset
preset.dispatchEvent(new Event('change'));
