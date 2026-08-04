// Menu mobile (hamburger)
document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.getElementById('navToggle');
  var nav = document.getElementById('mainNav');

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('open');
      toggle.classList.toggle('open', isOpen);
      toggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Ferme le menu automatiquement quand on clique un lien
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }
});

// Événements passés : grisés sur la page Événements, non sélectionnables sur la page Réservation
document.addEventListener('DOMContentLoaded', function () {
  var today = new Date();
  today.setHours(0, 0, 0, 0);

  function isPast(dateStr) {
    if (!dateStr) return false;
    var d = new Date(dateStr + 'T00:00:00');
    return d < today;
  }

  // Page Événements : cartes grisées + bouton de réservation désactivé
  document.querySelectorAll('.event-card[data-date]').forEach(function (card) {
    var badge = card.querySelector('.past-badge');
    if (isPast(card.getAttribute('data-date'))) {
      card.classList.add('past-event');
      if (badge) badge.style.display = 'inline-block';
      var btn = card.querySelector('a.btn');
      if (btn) {
        btn.textContent = 'Événement terminé';
        btn.classList.add('disabled');
        btn.removeAttribute('href');
        btn.setAttribute('aria-disabled', 'true');
        btn.addEventListener('click', function (e) { e.preventDefault(); });
      }
    } else if (badge) {
      badge.style.display = 'none';
    }
  });

  // Page Réservation : options passées désactivées et marquées "(terminé)"
  var select = document.getElementById('evenement');
  if (select) {
    var firstAvailable = null;
    Array.prototype.forEach.call(select.options, function (opt) {
      if (isPast(opt.getAttribute('data-date'))) {
        opt.disabled = true;
        if (opt.textContent.indexOf('(terminé)') === -1) {
          opt.textContent += ' (terminé)';
        }
      } else if (firstAvailable === null) {
        firstAvailable = opt;
      }
    });
    // Si l'option sélectionnée par défaut est passée, on bascule sur le premier événement disponible
    if (select.options[select.selectedIndex] && select.options[select.selectedIndex].disabled && firstAvailable) {
      firstAvailable.selected = true;
    }
  }

  // "LANCER LA FÊTE" (page d'accueil uniquement)
  var feteBtn = document.getElementById('feteBtn');
  var feteOverlay = document.getElementById('feteOverlay');
  if (feteBtn && feteOverlay) {
    var feteVideo = document.getElementById('feteVideo');
    var feteStopBtn = document.getElementById('feteStopBtn');
    var confettiLayer = document.getElementById('feteConfettiLayer');
    var feteFlash = document.getElementById('feteFlash');
    var feteBurst = document.getElementById('feteBurst');
    var feteLogo = feteOverlay.querySelector('.fete-logo');
    var confettiItems = ['🎉', '🎊', '🥳', '✨', '🍻', '🎶', '🔥', 'LES ZIMORISTIX', '🎈'];
    var confettiInterval = null;
    var boomInterval = null;
    var feteTimeout = null;
    var phaseTimers = [];
    var feteRunning = false;

    function spawnConfetti(chaos) {
      var piece = document.createElement('span');
      piece.className = 'fete-piece';
      var text = confettiItems[Math.floor(Math.random() * confettiItems.length)];
      var isLongText = text.length > 3;
      piece.textContent = text;
      var size = isLongText
        ? (30 + Math.random() * (chaos ? 10 : 8))
        : (45 + Math.random() * (chaos ? 30 : 22));
      // Marge de sécurité plus grande pour le texte long, pour qu'il ne dépasse jamais de l'écran
      var margin = isLongText ? 22 : 8;
      var left = margin + Math.random() * (100 - margin * 2);
      var duration = (chaos ? 1.4 : 2.5) + Math.random() * (chaos ? 1.6 : 2.5);
      var range = (isLongText ? 0.5 : 1) * (chaos ? 280 : 150);
      var drift = (Math.random() * range - range / 2) + 'px';
      var spin = (Math.random() > 0.5 ? 1 : -1) * (360 + Math.random() * (chaos ? 900 : 540)) + 'deg';
      piece.style.left = left + 'vw';
      piece.style.fontSize = size + 'px';
      piece.style.setProperty('--drift', drift);
      piece.style.setProperty('--spin', spin);
      piece.style.animationDuration = duration + 's';
      confettiLayer.appendChild(piece);
      setTimeout(function () { piece.remove(); }, duration * 1000 + 200);
    }

    function triggerBoom() {
      feteBurst.classList.remove('boom');
      // force reflow pour pouvoir relancer l'animation
      void feteBurst.offsetWidth;
      feteBurst.classList.add('boom');
    }

    function setFlash(duration, opacity) {
      feteFlash.style.animationDuration = duration + 's';
      feteFlash.style.opacity = opacity;
    }
    function setLogoSpeed(spin, pulse) {
      feteLogo.style.animationDuration = spin + 's, ' + pulse + 's';
    }
    function setConfettiRate(ms, chaos) {
      clearInterval(confettiInterval);
      confettiInterval = setInterval(function () { spawnConfetti(chaos); }, ms);
    }

    function startFete() {
      if (feteRunning) return;
      feteRunning = true;
      feteOverlay.classList.add('active');
      // Musique à partir de 1min30 (=90s)
      feteVideo.src = 'https://www.youtube.com/embed/xXT0UnNc4gI?start=90&autoplay=1&rel=0';

      // Phase 1 (0-10s) : flashs doux et lents (mais bien colorés, pas gris)
      setFlash(2.6, 1);
      setLogoSpeed(7, 2.6);
      setConfettiRate(380, false);
      for (var i = 0; i < 12; i++) { setTimeout(function () { spawnConfetti(false); }, i * 90); }

      // Phase 2 (10-16s) : ça accélère
      phaseTimers.push(setTimeout(function () {
        setFlash(0.7, 1);
        setLogoSpeed(2.4, 1);
        setConfettiRate(110, false);
        boomInterval = setInterval(triggerBoom, 900);
      }, 10000));

      // Phase 3 (16s+) : GROSSE BOUM — mode rave, ça part dans tous les sens
      phaseTimers.push(setTimeout(function () {
        setFlash(0.35, 1);
        setLogoSpeed(0.8, 0.4);
        setConfettiRate(35, true);
        feteOverlay.classList.add('fete-shake');
        clearInterval(boomInterval);
        boomInterval = setInterval(triggerBoom, 400);
        triggerBoom();
      }, 16000));

      // Arrêt automatique après 2 minutes
      feteTimeout = setTimeout(stopFete, 120000);
    }

    function stopFete() {
      if (!feteRunning) return;
      feteRunning = false;
      feteOverlay.classList.remove('active');
      feteOverlay.classList.remove('fete-shake');
      feteVideo.src = '';
      clearInterval(confettiInterval);
      clearInterval(boomInterval);
      clearTimeout(feteTimeout);
      phaseTimers.forEach(clearTimeout);
      phaseTimers = [];
      confettiLayer.innerHTML = '';
      feteBurst.classList.remove('boom');
      feteFlash.style.animationDuration = '';
      feteFlash.style.opacity = '';
      feteLogo.style.animationDuration = '';
    }

    feteBtn.addEventListener('click', startFete);
    feteStopBtn.addEventListener('click', stopFete);
  }
});
