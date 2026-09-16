document.addEventListener("DOMContentLoaded", () => {
  // 1. Pétalos de la flor central
  const petalsContainer = document.getElementById("petals");
  const totalPetals = 16;

  for (let i = 0; i < totalPetals; i++) {
    const petal = document.createElement("div");
    petal.classList.add("petal");
    const angle = (360 / totalPetals) * i;
    petal.style.transform = `rotate(${angle}deg) translateY(-25px)`;
    petalsContainer.appendChild(petal);
  }

  // 2. Lógica del Contador Regresivo (21 de Septiembre)
  const currentYear = new Date().getFullYear();
  const targetDate = new Date(`September 21, ${currentYear} 00:00:00`).getTime();

  function updateCountdown() {
    const now = new Date().getTime();
    const difference = targetDate - now;

    if (difference <= 0) {
      document.getElementById("days").innerText = "00";
      document.getElementById("hours").innerText = "00";
      document.getElementById("minutes").innerText = "00";
      document.getElementById("seconds").innerText = "00";
      const textElem = document.getElementById("release-text");
      if (textElem) textElem.innerText = "¡El EP ya está disponible! Dale play y contame qué te parece.";
      return;
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    document.getElementById("days").innerText = days < 10 ? `0${days}` : days;
    document.getElementById("hours").innerText = hours < 10 ? `0${hours}` : hours;
    document.getElementById("minutes").innerText = minutes < 10 ? `0${minutes}` : minutes;
    document.getElementById("seconds").innerText = seconds < 10 ? `0${seconds}` : seconds;
  }

  setInterval(updateCountdown, 1000);
  updateCountdown();

  // 3. Sistema de partículas dinámico con respuesta al cursor
  const canvas = document.getElementById("canvas-petals");
  const ctx = canvas.getContext("2d");

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  const particles = [];
  const baseParticleCount = 60;

  class Particle {
    constructor(x, y, isMouseSpawn = false) {
      this.isMouseSpawn = isMouseSpawn;
      this.reset(x, y);
    }

    reset(x, y) {
      this.x = x !== undefined ? x : Math.random() * canvas.width;
      this.y = y !== undefined ? y : Math.random() * -canvas.height;
      this.size = Math.random() * 9 + 5;
      
      if (this.isMouseSpawn) {
        this.speedY = Math.random() * 2 + 1;
        this.speedX = (Math.random() - 0.5) * 3;
        this.life = 1;
        this.decay = Math.random() * 0.015 + 0.005;
      } else {
        this.speedY = Math.random() * 1.8 + 0.8;
        this.speedX = Math.random() * 1.2 - 0.6;
        this.life = 1;
        this.decay = 0;
      }

      this.rotation = Math.random() * 360;
      this.rotationSpeed = Math.random() * 3 - 1.5;
      this.color = Math.random() > 0.35 ? "#ffb703" : "#fb8500";
    }

    update() {
      this.y += this.speedY;
      this.x += this.speedX;
      this.rotation += this.rotationSpeed;

      if (this.isMouseSpawn) {
        this.life -= this.decay;
      }

      if (this.y > canvas.height + 20 || this.life <= 0) {
        if (this.isMouseSpawn) {
          const index = particles.indexOf(this);
          if (index > -1) particles.splice(index, 1);
        } else {
          this.reset();
        }
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);
      ctx.globalAlpha = Math.max(0, this.life);
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.ellipse(0, 0, this.size / 2.2, this.size, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  for (let i = 0; i < baseParticleCount; i++) {
    particles.push(new Particle());
  }

  function spawnMousePetals(e) {
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    for (let i = 0; i < 2; i++) {
      const offsetX = (Math.random() - 0.5) * 30;
      const offsetY = (Math.random() - 0.5) * 30;
      particles.push(new Particle(clientX + offsetX, clientY + offsetY, true));
    }
  }

  window.addEventListener("mousemove", spawnMousePetals);
  window.addEventListener("touchmove", spawnMousePetals);

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = particles.length - 1; i >= 0; i--) {
      particles[i].update();
      if (particles[i]) {
        particles[i].draw();
      }
    }
    requestAnimationFrame(animate);
  }

  animate();
});
