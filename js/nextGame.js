// Load games.json and update next game info on the page
document.addEventListener("DOMContentLoaded", () => {
    fetch('assets/data/games.json')
        .then(response => response.json())
        .then(games => {
            const today = new Date();
            // Filter upcoming games
            const upcoming = games
                .map(game => ({
                    ...game,
                    dateObj: new Date(game.date)
                }))
                .filter(game => game.dateObj >= today)
                .sort((a, b) => a.dateObj - b.dateObj);

            const nextGame = upcoming.length > 0 ? upcoming[0] : null;
            const nextGameElem = document.getElementById('next-game-info');

            if (nextGame && nextGameElem) {
                // Format date nicely, e.g. "21. Juni 2025"
                const options = { year: 'numeric', month: 'long', day: 'numeric' };
                const formattedDate = nextGame.dateObj.toLocaleDateString('de-CH', options);

                nextGameElem.innerHTML = `
          Gegner: ${nextGame.opponent} | Datum: ${formattedDate} | Ort: ${nextGame.location}
        `;
            } else if (nextGameElem) {
                nextGameElem.textContent = "Aktuell sind keine bevorstehenden Spiele geplant.";
            }
        })
        .catch(err => {
            console.error('Fehler beim Laden der Spiele:', err);
        });
});
