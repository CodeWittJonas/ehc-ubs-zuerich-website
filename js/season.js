(function () {
    const DATA_URL = '/assets/data/games-2025-26.json';
    const TEAM_NAME = 'EHC UBS Zürich';

    const tbody = document.getElementById('games-body');
    const statRecord = document.getElementById('stat-record');
    const statGames = document.getElementById('stat-games');
    const statGF = document.getElementById('stat-gf');
    const statGA = document.getElementById('stat-ga');
    const seasonName = document.getElementById('season-name');
    const lastUpdated = document.getElementById('last-updated');

    fetch(DATA_URL, { cache: 'no-store' })
        .then(r => r.json())
        .then(data => {
            // Header badges
            if (data.season) seasonName.textContent = `Saison ${data.season}`;
            if (data.lastUpdated) lastUpdated.textContent = 'Stand: ' + new Date(data.lastUpdated).toLocaleDateString('de-CH', { day: '2-digit', month: '2-digit', year: 'numeric' });

            const games = (data.games || [])
                .map(g => ({ ...g, _date: new Date(g.date), _end: g.end ? new Date(g.end) : null }))
                .sort((a, b) => a._date - b._date);

            // Render rows
            tbody.innerHTML = '';
            let W = 0, L = 0, T = 0, GF = 0, GA = 0, played = 0;

            games.forEach(g => {
                let resultHTML = '<span class="text-muted">—</span>';
                let badge = '';

                const us = g.score && typeof g.score.us === 'number' ? g.score.us : null;
                const them = g.score && typeof g.score.them === 'number' ? g.score.them : null;

                if (us !== null && them !== null) {
                    played++;
                    GF += us; GA += them;
                    if (us > them) { W++; badge = '<span class="badge result-badge bg-success">S</span>'; }
                    else if (us < them) { L++; badge = '<span class="badge result-badge bg-danger">N</span>'; }
                    else { T++; badge = '<span class="badge result-badge bg-secondary">U</span>'; }
                    resultHTML = `<strong>${us} : ${them}</strong> ${badge}`;
                }

                const date = g._date.toLocaleDateString('de-CH', { weekday:'short', day:'2-digit', month:'2-digit', year:'numeric' });
                const time = g._date.toLocaleTimeString('de-CH', { hour: '2-digit', minute: '2-digit' });

                const homeTeam = g.home ? TEAM_NAME : g.opponent;
                const awayTeam = g.home ? g.opponent : TEAM_NAME;

                const tr = document.createElement('tr');
                tr.innerHTML = `
          <td>${date}</td>
          <td>${time}</td>
          <td>${homeTeam}</td>
          <td>${awayTeam}</td>
          <td>${g.arena || ''}</td>
          <td class="text-end">${resultHTML}</td>
        `;
                tbody.appendChild(tr);
            });

            // Stats
            statGames.textContent = played;
            statGF.textContent = GF;
            statGA.textContent = GA;
            statRecord.textContent = `${W}–${L}–${T}`;
        })
        .catch(() => {
            tbody.innerHTML = '<tr><td colspan="7" class="text-center py-5 text-muted">Spielplan konnte nicht geladen werden.</td></tr>';
        });
})();