class PollVis {
  constructor(
    id,
    params = {
      donutRadiusMultiplier: 0,
      textDistanceMultiplier: 0,
      textFontSize: '1rem',
      textFontFamily: 'serif',
      colors: [
        'rgba(81, 145, 253, 1)',
        'rgba(22, 71, 233, 1)',
        'rgba(232, 42, 55, 1)',
        'rgba(13, 169, 33, 1)',
        'rgba(166, 72, 71, 1)',
      ],
    },
  ) {
    this._id = id;
    this._canvas = document.querySelector(`[data-id='${this._id}']`);
    // this._colors = [
    //   'rgba(81, 145, 253, 1)',
    //   'rgba(22, 71, 233, 1)',
    //   'rgba(232, 42, 55, 1)',
    //   'rgba(13, 169, 33, 1)',
    //   'rgba(166, 72, 71, 1)',
    // ];
    this._params = params;
    this._colors = this._params.colors;
  }

  draw(values) {
    const percents = this._calculatePercents(values);
    const ctx = this._canvas.getContext('2d');

    ctx.globalCompositeOperation = 'source-over';

    const canvasWidth = this._canvas.width;
    const canvasHeight = this._canvas.height;

    const marginWidth = canvasWidth * 0.05;
    const marginHeight = canvasHeight * 0.05;

    const pieRadius = (canvasWidth - marginWidth) / 2;
    ctx.save();

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.fillStyle = this._colors[0];
    ctx.shadowColor = 'rgba(0, 0, 0, 0.503)';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(canvasWidth / 2, canvasHeight / 2, pieRadius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
    ctx.save();


    let startAngle = 0;

    for (let i = 0; i < percents.length; i++) {
      ctx.fillStyle = this._colors[i % this._colors.length];

      const finishAngle = this._calculateRadiantFromPercent(percents[i]);
      const endAngle = startAngle + finishAngle;

      // draw pie slice
      ctx.beginPath();
      ctx.moveTo(canvasWidth / 2, canvasHeight / 2);
      ctx.arc(canvasWidth / 2, canvasHeight / 2, pieRadius, startAngle, endAngle);
      ctx.closePath();
      ctx.fill();
      ctx.save();

      // write percent text
      ctx.translate(canvasWidth / 2, canvasHeight / 2);
      ctx.shadowColor = 'black';
      ctx.shadowBlur = 5;
      ctx.fillStyle = 'white';
      ctx.font = `${this._params.textFontSize} ${this._params.textFontFamily}`;

      const textX =
        Math.cos(endAngle - finishAngle / 2) * pieRadius * this._params.textDistanceMultiplier;
      const textY =
        Math.sin(endAngle - finishAngle / 2) * pieRadius * this._params.textDistanceMultiplier;

      ctx.textAlign = 'center';
      ctx.fillText(`${percents[i]}%`, textX, textY);

      ctx.restore();
      ctx.restore();
      ctx.restore();

      startAngle += finishAngle;
    }

    // draw donut hole
    ctx.globalCompositeOperation = 'destination-out';

    ctx.beginPath();
    ctx.arc(
      canvasWidth / 2,
      canvasHeight / 2,
      pieRadius * this._params.donutRadiusMultiplier,
      0,
      Math.PI * 2,
    );
    ctx.closePath();
    ctx.fill();
  }

  _calculateRadiantFromPercent(percent) {
    const raidant = Math.PI / 180 * (360 * (percent / 100));
    return raidant;
  }

  _calculatePercents(values) {
    const total = values.reduce((a, b) => a + b);

    const percentArray = values.map(val => Math.round(Math.ceil((val / total) * 100)));
    return percentArray;
  }
}

export default PollVis;
