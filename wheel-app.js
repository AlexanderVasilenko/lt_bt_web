/* wheel-app.js — логика крутящегося колеса */
(function () {
  const params   = new URLSearchParams(location.search);
  const players  = JSON.parse(params.get('players') || '[]');

  /* если игроков нет — выводим сообщение и выходим */
  if (!players.length) {
    document.body.innerHTML =
      '<p style="margin:auto">No players&nbsp;data</p>';
    Telegram.WebApp.ready();
    Telegram.WebApp.expand();
    return;
  }

  const colors = ['#e74c3c', '#27ae60', '#2980b9',
                  '#f1c40f', '#9b59b6', '#1abc9c'];

  const segments = players.map((name, i) => ({
    text      : name,
    fillStyle : colors[i % colors.length]
  }));

  const wheel = new Winwheel({
    canvasId     : 'wheel',
    numSegments  : segments.length,
    segments     : segments,
    textFontSize : 18,
    animation    : {
      type            : 'spinToStop',
      duration        : 5,
      spins           : 8,
      callbackFinished: seg => {
        Telegram.WebApp.sendData(
          JSON.stringify({ winner: seg.text })
        );
        Telegram.WebApp.close();
      }
    }
  });

  /* небольшой таймер, чтобы Canvas успел отрисоваться */
  setTimeout(() => wheel.startAnimation(), 600);
})();
