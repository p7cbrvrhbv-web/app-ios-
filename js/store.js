/* Progression du joueur, sauvegardée dans localStorage (jamais bloquant si indisponible). */
(function (A) {
  'use strict';

  const KEY = 'anachro.v1';
  const defaults = () => ({ levels: {}, points: 0, streak: 0, bestStreak: 0, lastDaily: null });

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) return Object.assign(defaults(), JSON.parse(raw));
    } catch (e) { /* stockage indisponible : on joue sans sauvegarde */ }
    return defaults();
  }

  let data = load();
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) { /* ignore */ } };

  const pad = n => String(n).padStart(2, '0');
  const dayKey = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const today = () => dayKey(new Date());
  const yesterday = () => { const d = new Date(); d.setDate(d.getDate() - 1); return dayKey(d); };

  /* Niveau du jour : le même pour tous les joueurs à une date donnée. */
  function dailyIndex(count) {
    const d = new Date();
    const dayNumber = Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 86400000);
    return dayNumber % count;
  }

  A.store = {
    get: () => data,
    today,
    dailyIndex,
    dailyDone: () => data.lastDaily === today(),
    streak: () => (data.lastDaily === today() || data.lastDaily === yesterday()) ? data.streak : 0,

    /* Enregistre un résultat. Renvoie { record } si le temps ou les étoiles sont battus. */
    record(id, { stars, points, elapsed }) {
      const prev = data.levels[id] || { stars: 0, points: 0, best: null, plays: 0 };
      const record = prev.plays > 0 && (elapsed < prev.best || stars > prev.stars);
      const next = {
        stars: Math.max(prev.stars, stars),
        points: Math.max(prev.points, points),
        best: prev.best === null ? elapsed : Math.min(prev.best, elapsed),
        plays: prev.plays + 1
      };
      data.points += Math.max(0, points - prev.points);
      data.levels[id] = next;
      save();
      return { record };
    },

    completeDaily() {
      if (data.lastDaily === today()) return;
      data.streak = data.lastDaily === yesterday() ? data.streak + 1 : 1;
      data.bestStreak = Math.max(data.bestStreak, data.streak);
      data.lastDaily = today();
      save();
    },

    reset() { data = defaults(); save(); }
  };
})(window.Anachro = window.Anachro || {});
