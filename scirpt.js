const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const hpText = document.getElementById("hp");

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

// Player
const player = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  speed: 4,
  hp: 100,
  bullets: []
};

// Enemy
let enemies = [];

// Mouse
let mouse = { x: 0, y: 0 };
window.addEventListener("mousemove", e => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

// Shoot
window.addEventListener("mousedown", () => {
  const angle = Math.atan2(mouse.y - player.y, mouse.x - player.x);
  player.bullets.push({
    x: player.x,
    y: player.y,
    vx: Math.cos(angle) * 8,
    vy: Math.sin(angle) * 8
  });
});

// Keyboard
const keys = {};
window.addEventListener("keydown", e => keys[e.key] = true);
window.addEventListener("keyup", e => keys[e.key] = false);

// Spawn enemy
function spawnEnemy() {
  enemies.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    bullets: []
  });
}
setInterval(spawnEnemy, 1500);

// Update
function update() {
  if (keys["w"]) player.y -= player.speed;
  if (keys["s"]) player.y += player.speed;
  if (keys["a"]) player.x -= player.speed;
  if (keys["d"]) player.x += player.speed;

  player.bullets.forEach(b => {
    b.x += b.vx;
    b.y += b.vy;
  });

  enemies.forEach(e => {
    const angle = Math.atan2(player.y - e.y, player.x - e.x);
    if (Math.random() < 0.02) {
      e.bullets.push({
        x: e.x,
        y: e.y,
        vx: Math.cos(angle) * 6, // 3/4 tốc player
        vy: Math.sin(angle) * 6
      });
    }

    e.bullets.forEach(b => {
      b.x += b.vx;

      // trúng player
      if (Math.hypot(b.x - player.x, b.y - player.y) < 10) {
        player.hp -= 1;
        hpText.textContent = player.hp;
      }
    });
  });
}

// Draw
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Player
  ctx.fillStyle = "cyan";
  ctx.beginPath();
  ctx.arc(player.x, player.y, 10, 0, Math.PI * 2);
  ctx.fill();

  // Player bullets
  ctx.fillStyle = "yellow";
  player.bullets.forEach(b => {
    ctx.beginPath();
    ctx.arc(b.x, b.y, 4, 0, Math.PI * 2);
    ctx.fill();
  });

  // Enemies
  ctx.fillStyle = "red";
  enemies.forEach(e => {
    ctx.beginPath();
    ctx.arc(e.x, e.y, 12, 0, Math.PI * 2);
    ctx.fill();

    e.bullets.forEach(b => {
      ctx.beginPath();
      ctx.arc(b.x, b.y, 4, 0, Math.PI * 2);
      ctx.fill();
    });
  });
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}
loop();
