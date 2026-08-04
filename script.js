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
});
