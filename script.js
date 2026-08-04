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
    var confettiItems = ['🎉', '🎊', '🥳', '✨', '🍻', '🎶', '🔥', 'LES ZIMORISTIX', '🎈'];
    var confettiInterval = null;
    var feteTimeout = null;
    var feteRunning = false;

    function spawnConfetti() {
      var piece = document.createElement('span');
      piece.className = 'fete-piece';
      piece.textContent = confettiItems[Math.floor(Math.random() * confettiItems.length)];
      var size = 16 + Math.random() * 26;
      var left = Math.random() * 100;
      var duration = 2.5 + Math.random() * 2.5;
      var drift = (Math.random() * 220 - 110) + 'px';
      var spin = (Math.random() > 0.5 ? 1 : -1) * (360 + Math.random() * 540) + 'deg';
      piece.style.left = left + 'vw';
      piece.style.fontSize = size + 'px';
      piece.style.setProperty('--drift', drift);
      piece.style.setProperty('--spin', spin);
      piece.style.animationDuration = duration + 's';
      confettiLayer.appendChild(piece);
      setTimeout(function () { piece.remove(); }, duration * 1000 + 200);
    }

    function startFete() {
      if (feteRunning) return;
      feteRunning = true;
      feteOverlay.classList.add('active');
      // Musique à partir de 1min30 (=90s)
      feteVideo.src = 'https://www.youtube.com/embed/xXT0UnNc4gI?start=90&autoplay=1&rel=0';
      // Rafale de confettis en continu
      confettiInterval = setInterval(spawnConfetti, 90);
      for (var i = 0; i < 25; i++) { setTimeout(spawnConfetti, i * 40); }
      // Arrêt automatique après 2 minutes
      feteTimeout = setTimeout(stopFete, 120000);
    }

    function stopFete() {
      if (!feteRunning) return;
      feteRunning = false;
      feteOverlay.classList.remove('active');
      feteVideo.src = '';
      clearInterval(confettiInterval);
      clearTimeout(feteTimeout);
      confettiLayer.innerHTML = '';
    }

    feteBtn.addEventListener('click', startFete);
    feteStopBtn.addEventListener('click', stopFete);
  }
});
