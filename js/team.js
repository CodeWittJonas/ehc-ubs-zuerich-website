(function () {
    const DATA_URL = '/assets/data/team-2025-26.json';

    const grids = {
        goalies:   document.getElementById('grid-goalies'),
        defenders: document.getElementById('grid-defenders'),
        forwards:  document.getElementById('grid-forwards'),
    };

    // Normalize: lowercase, strip accents/diacritics, remove non-letters
    const keyify = (s) =>
        (s || '')
            .toString()
            .toLowerCase()
            .normalize('NFD')                // split accents
            .replace(/[\u0300-\u036f]/g, '') // remove accents
            .replace(/[^a-z]/g, '');         // keep letters only

    const POS_MAP = {
        torhuter: 'goalies', goalie: 'goalies', g: 'goalies',
        verteidiger: 'defenders', defender: 'defenders', defense: 'defenders', d: 'defenders',
        sturmer: 'forwards', stuermer: 'forwards', forward: 'forwards', f: 'forwards'
    };

    const createCard = (p) => {
        const col = document.createElement('div');
        col.className = 'col';
        const alt = `${p.firstName} ${p.lastName} #${p.number} – ${p.position}`;
        col.innerHTML = `
      <div class="player-card hover-lift h-100">
        <img class="player-img" loading="lazy" src="${p.img}" alt="${alt}">
        <div class="player-name">${p.firstName} ${p.lastName} #${p.number}</div>
      </div>`;
        return col;
    };

    fetch(DATA_URL, { cache: 'no-store' })
        .then((r) => {
            if (!r.ok) throw new Error(`HTTP ${r.status} for ${DATA_URL}`);
            return r.json();
        })
        .then((data) => {
            const players = (data.players || []).slice()
                .sort((a, b) => (a.number ?? 999) - (b.number ?? 999));

            Object.values(grids).forEach((g) => (g.innerHTML = ''));

            players.forEach((p) => {
                const key = POS_MAP[keyify(p.position)];
                if (!key || !grids[key]) return;
                grids[key].appendChild(createCard(p));
            });

            // If any group stayed empty, show a friendly note
            Object.values(grids).forEach((grid) => {
                if (!grid.children.length) {
                    grid.innerHTML = '<div class="col"><div class="text-muted">Keine Spieler erfasst.</div></div>';
                }
            });
        })
        .catch((err) => {
            console.error('Teamdaten-Fehler:', err);
            Object.values(grids).forEach(
                (g) =>
                    (g.innerHTML =
                        '<div class="col"><div class="text-muted">Teamdaten konnten nicht geladen werden.</div></div>')
            );
        });
})();
