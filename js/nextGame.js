(async function () {
    const DATA_URL = '/assets/data/games-2025-26.json';
    const info = document.getElementById('next-game-info');
    if (!info) return;

    try {
        const res = await fetch(DATA_URL, { cache: 'no-store' });
        const data = await res.json();
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

        info.innerHTML = `<strong>${formatted}</strong><br>
      EHC UBS Zürich ${g.home ? 'vs.' : '@'} ${g.opponent} – ${g.arena}`;

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
