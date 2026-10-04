/** @param {import("../../../../lib/effectScope").EffectScope} scope */
export default function mount(scope) {
  const { window, document } = scope.environment;
  // The freeze interface is rendered into the same texture as the liquid scene,
  // so the cursor can refract lettering and diagrams, not just the background.
  (() => {
    const canvas = document.createElement('canvas'),
      ctx = canvas.getContext('2d');
    const logo = new Image();
    logo.src = 'logo.png';
    const cyan = '#42eaff',
      blue = '#2f92eb',
      violet = '#9564ed',
      paper = '#d4e7ff';
    let typeRatio = 1;
    function line(x, y, x2, y2, color = cyan) {
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
    function text(value, x, y, size = 12, color = paper, font = 'monospace', weight = 400) {
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(1, typeRatio);
      ctx.fillStyle = color;
      ctx.font = `${weight} ${size}px ${font}`;
      ctx.fillText(value, 0, 0);
      ctx.restore();
    }
    function box(x, y, w, h, title, number) {
      ctx.fillStyle = '#020a10ce';
      ctx.fillRect(x, y, w, h);
      ctx.strokeStyle = '#36768c';
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, w, h);
      line(x, y, x + 24, y, cyan);
      line(x + w - 24, y + h, x + w, y + h, violet);
      text(title, x + 20, y + 32, 18, cyan, 'Technor', 500);
      if (number) text(number, x + w - 49, y + 30, 12, blue);
    }
    function paragraph(value, x, y, width, size = 14, color = paper) {
      ctx.font = `${size}px monospace`;
      let row = '',
        offset = 0;
      for (const word of value.split(' ')) {
        const next = row + word + ' ';
        if (ctx.measureText(next).width > width && row) {
          text(row.trim(), x, y + offset, size, color);
          row = word + ' ';
          offset += size * 1.5;
        } else row = next;
      }
      if (row) text(row.trim(), x, y + offset, size, color);
      return offset + size * 1.5;
    }
    function wave(x, y, w, h) {
      for (let n = 0; n < 5; n++) {
        ctx.strokeStyle = n % 2 ? blue : violet;
        ctx.globalAlpha = 0.65;
        ctx.beginPath();
        for (let i = 0; i <= 100; i++) {
          const px = i / 100;
          const py =
            Math.sin(px * (10 + n * 0.8) + n) * Math.sin(px * 3.14) * h * 0.32 +
            Math.cos(px * 23 + n) * h * 0.08;
          ctx.lineTo(x + px * w, y + h / 2 + py);
        }
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }
    function globe(cx, cy, r) {
      ctx.save();
      ctx.strokeStyle = '#2459a4';
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.clip();
      ctx.stroke();
      for (let i = -3; i <= 3; i++) {
        ctx.beginPath();
        ctx.ellipse(
          cx,
          cy,
          r * Math.cos(i * 0.23),
          Math.max(2, r * Math.abs(Math.sin(i * 0.23))),
          -0.35,
          0,
          Math.PI * 2,
        );
        ctx.stroke();
        ctx.beginPath();
        ctx.ellipse(
          cx,
          cy,
          Math.max(2, r * Math.abs(Math.sin(i * 0.23))),
          r,
          -0.35,
          0,
          Math.PI * 2,
        );
        ctx.stroke();
      }
      ctx.restore();
    }
    function orbit(cx, cy, r) {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(1, typeRatio);
      ctx.strokeStyle = '#277ca488';
      ctx.setLineDash([2, 7]);
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.strokeStyle = '#6476b577';
      ctx.beginPath();
      ctx.arc(0, 0, r + 13, -0.65, 2.7);
      ctx.stroke();
      for (const a of [0.1, 1.5, 3.4, 4.8]) {
        const x = Math.cos(a) * r,
          y = Math.sin(a) * r;
        line(x - 9, y, x + 9, y, paper);
        line(x, y - 9, x, y + 9, paper);
      }
      ctx.restore();
    }
    function desktop() {
      const w = 1800,
        h = 875;
      ctx.strokeStyle = '#5d678177';
      ctx.strokeRect(14, 14, w - 28, h - 28);
      if (logo.complete && logo.naturalWidth) ctx.drawImage(logo, 46, 42, 100, 84);
      text('TCET', 180, 67, 12, violet);
      text('MUMBAI', 180, 86, 12, violet);
      text('STUDENT LED', 352, 71, 11, violet);
      text('COMMUNITY', 352, 90, 11, violet);
      text('// DATA MINDS BUILD TOMORROW', 750, 72, 13, cyan);
      line(1072, 68, 1230, 68);
      text('INTELLIGENCE  ×  PEOPLE  ×  IMPACT', 1265, 72, 12, paper);
      const title = ctx.createLinearGradient(0, 176, 0, 290);
      title.addColorStop(0, '#f5ecff');
      title.addColorStop(0.45, '#aca8d4');
      title.addColorStop(0.48, '#d2c7ff');
      title.addColorStop(1, '#5896ca');
      text('WHERE DATA', 60, 234, 66, title, 'Nippo', 500);
      text('MEETS PURPOSE', 60, 293, 61, cyan, 'Nippo', 500);
      line(64, 327, 130, 327, paper);
      text('S4DS // TCET’S DATA & AI COMMUNITY', 156, 339, 15, paper);
      box(64, 372, 420, 220, 'ABOUT S4DS', '–01');
      line(85, 426, 85, 563, cyan);
      paragraph(
        'S4DS is a student-driven community at TCET, built around curiosity, experimentation and technology. We bring together students interested in data, AI and development to learn, build and exchange ideas beyond the classroom.',
        100,
        438,
        358,
        14,
      );
      text('PEOPLE  //  PROJECTS  //  PROGRESS', 100, 576, 11, blue);
      orbit(882, 351, 239);
      text('IDEAS', 1145, 203, 13, cyan);
      text('DATA', 1145, 225, 13);
      text('PEOPLE', 1145, 247, 13);
      text('IMPACT', 1145, 269, 13);
      text('S4DS.EXE', 588, 538, 12, cyan);
      text('// RUNNING', 588, 556, 11, blue);
      line(1050, 499, 1050, 585, paper);
      text('TURNING', 1088, 515, 13, blue);
      text('DATA INTO', 1088, 535, 13, blue);
      text('REAL-WORLD', 1088, 555, 13, blue);
      text('IMPACT', 1088, 575, 13, blue);
      box(1273, 143, 242, 246, 'SYSTEM STATUS', '–02');
      const rows = [
        ['SYS.ONLINE', '●'],
        ['ORG_ID', 'S4DS'],
        ['NODE', 'TCET'],
        ['LOC', 'MUMBAI'],
        ['NETWORK', 'STUDENT'],
        ['MODE', 'COLLABORATIVE'],
        ['ACCESS', 'OPEN'],
      ];
      rows.forEach(([label, value], i) => {
        const y = 192 + i * 26;
        text(label, 1290, y, 12, cyan);
        ctx.textAlign = 'right';
        text(value, 1500, y, 12, i === 0 ? cyan : paper);
        ctx.textAlign = 'left';
        line(1288, y + 8, 1503, y + 8, '#24424a');
      });
      globe(1689, 253, 134);
      text('ANALYZE', 1680, 295, 11, blue);
      text('BUILD', 1680, 315, 11, blue);
      text('COLLABORATE', 1680, 335, 11, blue);
      box(1273, 413, 470, 183, 'CORE FOCUS', '–02');
      [
        'DATA SCIENCE',
        'ARTIFICIAL INTELLIGENCE',
        'DATA ANALYTICS',
        'DEVELOPMENT',
        'RESEARCH & INNOVATION',
      ].forEach((s, i) => {
        ctx.strokeStyle = cyan;
        ctx.strokeRect(1294, 470 + i * 24, 9, 9);
        text(s, 1320, 480 + i * 24, 12);
      });
      wave(1540, 466, 174, 88);
      box(64, 612, 331, 132, '', null);
      wave(75, 622, 121, 111);
      line(209, 621, 209, 730, '#326084');
      ['KNOWLEDGE', 'NETWORK', 'OPPORTUNITIES', 'REAL-WORLD IMPACT'].forEach((s, i) =>
        text(s, 231, 649 + i * 18, 11, blue),
      );
      box(454, 615, 950, 88, '', null);
      const steps = [
        ['EXPLORE', 'Find ideas worth questioning.'],
        ['LEARN', 'Turn concepts into understanding.'],
        ['BUILD', 'Translate knowledge into projects.'],
        ['EVOLVE', 'Share, improve and go further.'],
      ];
      steps.forEach(([title, body], i) => {
        const x = 474 + i * 235;
        text(`0${i + 1}`, x, 651, 23, paper, 'Technor');
        text(title, x + 48, 647, 17, cyan, 'Technor');
        paragraph(body, x + 48, 669, 158, 11);
        if (i < 3) line(x + 220, 638, x + 220, 687, '#4e5c70');
      });
      box(1426, 615, 317, 140, 'DATA STREAM', '–03');
      wave(1445, 663, 161, 66);
      ['RAW DATA', 'PATTERN', 'INSIGHT', 'ACTION'].forEach((s, i) =>
        text(s, 1632, 668 + i * 22, 10, blue),
      );
      for (let i = 0; i < 36; i++) {
        ctx.fillStyle = i % 3 ? blue : cyan;
        ctx.fillRect(61 + i * 2, 810, 1, 29);
      }
      text('S4DS // SOCIETY 4 DATA SCIENCE', 149, 821, 11, violet);
      text('TCET // MUMBAI', 149, 839, 11, violet);
      text('LEARN  ×  EXPERIMENT  ×  COLLABORATE  ×  INNOVATE  ×  IMPACT', 624, 804, 11, cyan);
    }
    function mobile() {
      ctx.strokeStyle = '#45758e';
      ctx.strokeRect(12, 12, 366, 876);
      if (logo.complete && logo.naturalWidth) ctx.drawImage(logo, 26, 26, 58, 48);
      text('S4DS // TCET', 105, 49, 12, cyan);
      text('DATA MINDS BUILD TOMORROW', 105, 68, 10, paper);
      text('WHERE DATA', 26, 121, 34, paper, 'Nippo', 500);
      text('MEETS PURPOSE', 26, 158, 32, cyan, 'Nippo', 500);
      text('DATA  ×  PEOPLE  ×  IMPACT', 27, 186, 11, blue);
      orbit(195, 354, 135);
      box(25, 523, 340, 142, 'ABOUT S4DS', '01');
      paragraph(
        'A student-driven community at TCET. We explore data, AI and technology through curiosity, experimentation and collaboration.',
        43,
        579,
        303,
        12,
      );
      box(25, 681, 340, 124, 'CORE FOCUS', '02');
      ['DATA SCIENCE + AI', 'ANALYTICS + DEVELOPMENT', 'RESEARCH + INNOVATION'].forEach((s, i) =>
        text(s, 43, 737 + i * 22, 11, paper),
      );
      text('EXPLORE  /  LEARN  /  BUILD  /  EVOLVE', 31, 840, 10, cyan);
    }
    window.FreezeConsole = {
      render(width, height) {
        const small = width < 700;
        canvas.width = small ? 390 : 1800;
        canvas.height = small ? 900 : 875;
        typeRatio = small ? 1 : width / height / (1800 / 875);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        small ? mobile() : desktop();
        return canvas;
      },
    };
    logo.onload = scope.guard(() => window.dispatchEvent(new Event('freezeconsoleready')));
    scope.when(document.fonts.ready, () => window.dispatchEvent(new Event('freezeconsoleready')));
  })();
}
