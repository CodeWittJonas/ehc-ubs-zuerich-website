(async function () {
    const CANDIDATES = [
        'assets/data/games-2025-26.json',
        '/assets/data/games-2025-26.json'
    ];
    const info = document.getElementById('next-game-info');
    if (!info) return;

    try {
        let data = null, lastErr = null;
        for (const url of CANDIDATES) {
            try {
                const res = await fetch(url, { cache: 'no-store' });
                if (!res.ok) throw new Error('HTTP ' + res.status);
                data = await res.json();
                break;
            } catch (e) {
                lastErr = e;
            }
        }
        if (!data) {
            console.error('nextGame: konnte JSON nicht laden', lastErr);
            throw lastErr || new Error('Daten konnten nicht geladen werden');
        }
        const now = new Date();

        const upcoming = data.games
            .map(g => ({ ...g, _date: new Date(g.date) }))
            .filter(g => g.status !== 'postponed' && g._date >= now)
            .sort((a, b) => a._date - b._date);

        if (!upcoming.length) {
            info.textContent = 'Kein anstehendes Spiel – neue Termine folgen.';
            return;
        }

        const g = upcoming[0];
        const formatted = g._date.toLocaleString('de-CH', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });

        const heimBadge = g.home ? '<span class="badge bg-success ms-2">Heim</span>' : '<span class="badge bg-secondary ms-2">Auswärts</span>';
        const arenaLine = g.arena ? `<div class="text-muted small"><i class="bi bi-geo-alt me-1" aria-hidden="true"></i>${g.arena}</div>` : '';

        info.innerHTML = `
          <div class="mb-1"><strong>${formatted}</strong></div>
          <div class="mb-1">EHC UBS Zürich ${g.home ? 'vs.' : '@'} ${g.opponent}${heimBadge}</div>
          ${arenaLine}
        `;

        document.getElementById('next-game-cta')?.classList.remove('d-none');

        // JSON-LD for SEO
        const ld = {
            "@context": "https://schema.org",
            "@type": "SportsEvent",
            "name": `EHC UBS Zürich ${g.home ? 'vs.' : '@'} ${g.opponent}`,
            "sport": "IceHockey",
            "startDate": g.date,
            "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
            "eventStatus": "https://schema.org/EventScheduled",
            "location": { "@type": "Place", "name": g.arena, "address": g.address },
            "performer": [
                { "@type": "SportsTeam", "name": "EHC UBS Zürich" },
                { "@type": "SportsTeam", "name": g.opponent }
            ],
            "url": g.url || location.href
        };
        const s = document.createElement('script');
        s.type = 'application/ld+json';
        s.textContent = JSON.stringify(ld);
        document.head.appendChild(s);
    } catch (e) {
        info.textContent = 'Termin folgt';
    }
})();
