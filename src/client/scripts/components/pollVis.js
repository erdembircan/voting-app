class PollVis {
  constructor(id, donutRadiusMultiplier = 0) {
    this._id = id;
    this._canvas = document.querySelector(`[data-id='${this._id}']`);
    this._colors = [
      'rgba(81, 145, 253, 1)',
      'rgba(22, 71, 233, 1)',
      'rgba(232, 42, 55, 1)',
      'rgba(13, 169, 33, 1)',
    ];
    this._donutRadiusMultiplier = donutRadiusMultiplier;
  }

  draw(percents) {
    const ctx = this._canvas.getContext('2d');
    const canvasWidth = this._canvas.width;
    const canvasHeight = this._canvas.height;

    const marginWidth = canvasWidth * 0.05;
    const marginHeight = canvasHeight * 0.05;

    const pieRadius = (canvasWidth - marginWidth) / 2;

    ctx.save();
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(canvasWidth / 2, canvasHeight / 2, pieRadius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
    ctx.save();

    let startAngle = 0;

    for (let i = 0; i < percents.length; i++) {
      ctx.fillStyle = this._colors[i % this._colors.length];

      const finishAngle = this._calculateRadiantFromPercent(percents[i]);

      ctx.beginPath();
      ctx.moveTo(canvasWidth / 2, canvasHeight / 2);
      ctx.arc(canvasWidth / 2, canvasHeight / 2, pieRadius, startAngle, startAngle + finishAngle);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      startAngle += finishAngle;
    }

    ctx.globalCompositeOperation = 'destination-out';

    ctx.beginPath();
    ctx.arc(
      canvasWidth / 2,
      canvasHeight / 2,
      pieRadius * this._donutRadiusMultiplier,
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
}

export default PollVis;
