/* Original 32-bar adventure score. Web Audio's clock schedules every note;
   the render loop only selects the scene and controls the mix. */
const AdventureScore = (() => {
  const songs = {
    menu: {
      bpm: 92,
      root: 48,
      color: "warm",
      chords: [
        [0, 0],
        [5, 0],
        [9, 1],
        [7, 0],
        [0, 0],
        [4, 1],
        [5, 0],
        [7, 0],
      ],
      a: [
        [12, 16, 19, null, 21, 19, 16, null],
        [17, 21, 24, 21, 19, 17, 16, null],
        [21, 24, 28, null, 26, 24, 21, 19],
        [19, 23, 26, 23, 21, 19, 16, 14],
      ],
      b: [
        [24, 23, 21, 19, 16, 19, 21, null],
        [21, 24, 26, 24, 21, 19, 17, null],
        [28, 26, 24, 21, 19, 21, 24, 26],
        [26, 23, 19, 16, 14, 16, 19, null],
      ],
    },
    action: {
      bpm: 116,
      root: 50,
      color: "warm",
      chords: [
        [0, 1],
        [10, 0],
        [5, 1],
        [7, 0],
        [0, 1],
        [3, 0],
        [5, 1],
        [7, 0],
      ],
      a: [
        [12, 15, 19, 17, 15, 12, 10, null],
        [10, 14, 17, 19, 17, 14, 10, null],
        [17, 20, 24, 22, 20, 17, 15, 14],
        [19, 22, 26, 22, 19, 17, 15, null],
      ],
      b: [
        [24, 22, 19, 17, 19, 22, 24, null],
        [22, 24, 26, 24, 22, 19, 17, 14],
        [29, 27, 24, 22, 24, 27, 29, null],
        [26, 24, 22, 19, 17, 15, 14, 12],
      ],
    },
    jungle: {
      bpm: 104,
      root: 50,
      color: "wood",
      chords: [
        [0, 1],
        [7, 1],
        [5, 1],
        [0, 1],
        [3, 0],
        [7, 1],
        [5, 1],
        [0, 1],
      ],
      a: [
        [12, null, 15, 19, 17, null, 15, 12],
        [19, 22, 19, null, 17, 15, 14, null],
        [17, null, 20, 24, 22, 20, 17, 15],
        [12, 15, 19, null, 17, 15, 12, null],
      ],
      b: [
        [24, 22, 19, 17, null, 19, 22, 24],
        [26, null, 24, 22, 19, null, 17, 14],
        [29, 27, 24, null, 22, 20, 17, 15],
        [24, 19, 17, 15, 12, null, 15, null],
      ],
    },
    sky: {
      bpm: 88,
      root: 48,
      color: "bell",
      chords: [
        [0, 0],
        [5, 0],
        [9, 1],
        [7, 0],
        [4, 1],
        [5, 0],
        [2, 1],
        [7, 0],
      ],
      a: [
        [19, null, 16, 12, null, 16, 19, 21],
        [24, null, 21, 17, 19, null, 17, 16],
        [21, 24, 28, null, 26, 24, 21, null],
        [19, null, 23, 26, 24, 23, 19, null],
      ],
      b: [
        [24, 23, 21, 19, null, 21, 24, 28],
        [29, 28, 26, 24, 21, null, 19, 17],
        [28, 26, 24, 21, null, 24, 28, 31],
        [26, null, 23, 19, 21, 23, 24, null],
      ],
    },
    neon: {
      bpm: 122,
      root: 45,
      color: "synth",
      chords: [
        [0, 1],
        [5, 1],
        [8, 0],
        [7, 0],
        [0, 1],
        [3, 0],
        [5, 1],
        [7, 0],
      ],
      a: [
        [12, null, 15, 19, null, 17, 15, null],
        [17, 20, null, 24, 22, null, 20, 17],
        [20, null, 24, 27, 24, 22, null, 20],
        [19, 23, 26, null, 23, 19, 17, null],
      ],
      b: [
        [24, 22, 19, 17, 19, null, 22, 24],
        [29, 27, 24, null, 22, 24, 27, null],
        [32, 31, 27, 24, null, 27, 31, 32],
        [26, null, 23, 19, 17, 19, 23, 24],
      ],
    },
    crystal: {
      bpm: 80,
      root: 47,
      color: "glass",
      chords: [
        [0, 1],
        [8, 0],
        [3, 0],
        [10, 0],
        [0, 1],
        [5, 1],
        [8, 0],
        [7, 0],
      ],
      a: [
        [19, null, 15, null, 12, null, 14, null],
        [20, null, 24, 27, null, 24, null, 20],
        [19, 22, null, 27, null, 24, 22, null],
        [22, null, 26, null, 29, 26, 22, null],
      ],
      b: [
        [31, null, 27, 24, null, 27, 31, null],
        [32, 31, null, 27, 24, null, 20, null],
        [34, null, 31, 27, null, 24, 22, null],
        [29, 26, 22, null, 19, 15, 14, null],
      ],
    },
    volcano: {
      bpm: 112,
      root: 43,
      color: "dark",
      chords: [
        [0, 1],
        [5, 1],
        [8, 0],
        [7, 0],
        [0, 1],
        [3, 0],
        [5, 1],
        [7, 0],
      ],
      a: [
        [12, 12, 15, null, 19, 17, 15, 12],
        [17, null, 20, 24, 22, null, 20, 17],
        [20, 24, 27, 24, 22, 20, 19, null],
        [19, 23, 26, 23, null, 19, 17, 14],
      ],
      b: [
        [24, 24, 22, 19, 17, 19, 22, null],
        [29, 27, 24, 22, 20, 22, 24, null],
        [32, 31, 27, 24, 27, 31, 32, null],
        [26, 23, 19, 17, 14, 17, 19, 24],
      ],
    },
    finale: {
      bpm: 118,
      root: 50,
      color: "anthem",
      chords: [
        [0, 1],
        [3, 0],
        [10, 0],
        [5, 1],
        [0, 1],
        [8, 0],
        [5, 1],
        [7, 0],
      ],
      a: [
        [12, null, 15, 19, 24, 22, 19, 17],
        [15, 19, 22, null, 27, 24, 22, 19],
        [22, null, 26, 29, 26, 22, 19, 17],
        [17, 20, 24, 27, 24, 20, 17, null],
      ],
      b: [
        [24, 27, 31, 29, 27, 24, 22, 19],
        [27, 31, 34, null, 31, 27, 24, 22],
        [34, 33, 29, 26, 29, 33, 34, null],
        [29, 27, 24, 20, 17, 19, 23, 24],
      ],
    },
  };
  songs.horror = songs.crystal;
  songs.godzilla = songs.volcano;
  songs.boss = {
    ...songs.finale,
    bpm: 132,
    a: songs.finale.b,
    b: songs.action.b,
  };
  let engine = null,
    timer = null,
    current = null;
  const hz = (n) => 440 * Math.pow(2, (n - 69) / 12);
  function graph(a, destination) {
    const out = a.createGain(),
      compressor = a.createDynamicsCompressor();
    compressor.threshold.value = -18;
    compressor.ratio.value = 3;
    compressor.attack.value = 0.008;
    compressor.release.value = 0.2;
    out.connect(compressor);
    compressor.connect(destination);
    const delay = a.createDelay(1),
      feedback = a.createGain(),
      delayWet = a.createGain();
    delay.delayTime.value = 0.24;
    feedback.gain.value = 0.18;
    delayWet.gain.value = 0.13;
    delay.connect(feedback);
    feedback.connect(delay);
    delay.connect(delayWet);
    delayWet.connect(out);
    const verb = a.createConvolver(),
      verbWet = a.createGain();
    verbWet.gain.value = 0.12;
    const impulse = a.createBuffer(
      2,
      Math.floor(a.sampleRate * 1.5),
      a.sampleRate,
    );
    let seed = 719;
    for (let channel = 0; channel < 2; channel++) {
      const data = impulse.getChannelData(channel);
      for (let i = 0; i < data.length; i++) {
        seed = (seed * 1664525 + 1013904223) >>> 0;
        data[i] =
          ((seed / 4294967296) * 2 - 1) *
          Math.pow(1 - i / data.length, 3) *
          0.35;
      }
    }
    verb.buffer = impulse;
    verb.connect(verbWet);
    verbWet.connect(out);
    const noise = a.createBuffer(1, a.sampleRate, a.sampleRate),
      data = noise.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      data[i] = seed / 2147483648 - 1;
    }
    return {
      a,
      out,
      delay,
      verb,
      noise,
      next: a.currentTime + 0.08,
      step: 0,
      bus: null,
      track: null,
    };
  }
  function route(g, node, send = false) {
    node.connect(g.bus);
    if (send) {
      node.connect(g.delay);
      node.connect(g.verb);
    }
  }
  function tone(g, instrument, midi, time, duration, volume, pan = 0) {
    if (midi === null) return;
    const a = g.a,
      amp = a.createGain(),
      filter = a.createBiquadFilter(),
      stereo = a.createStereoPanner();
    const attack =
      instrument === "pad" ? 0.18 : instrument === "bell" ? 0.008 : 0.009;
    const release =
      instrument === "pad" ? 0.5 : instrument === "bell" ? 0.38 : 0.12;
    amp.gain.setValueAtTime(0.0001, time);
    amp.gain.exponentialRampToValueAtTime(volume, time + attack);
    amp.gain.exponentialRampToValueAtTime(
      volume * 0.65,
      time + Math.max(attack, duration * 0.6),
    );
    amp.gain.exponentialRampToValueAtTime(0.0001, time + duration + release);
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(
      instrument === "bass" ? 650 : instrument === "lead" ? 2200 : 3400,
      time,
    );
    filter.connect(amp);
    amp.connect(stereo);
    stereo.pan.value = pan;
    route(g, stereo, instrument !== "bass");
    const oscillator = a.createOscillator();
    oscillator.type =
      instrument === "bell" || instrument === "bass" ? "sine" : "triangle";
    oscillator.frequency.value = hz(midi);
    oscillator.connect(filter);
    oscillator.start(time);
    oscillator.stop(time + duration + release + 0.03);
    let harmonic;
    if (instrument === "bell" || instrument === "pad") {
      harmonic = a.createOscillator();
      const partial = a.createGain();
      partial.gain.value = instrument === "bell" ? 0.24 : 0.4;
      harmonic.type = "sine";
      harmonic.frequency.value =
        hz(midi) * (instrument === "bell" ? 2.01 : 1.003);
      harmonic.connect(partial);
      partial.connect(filter);
      harmonic.start(time);
      harmonic.stop(time + duration + release + 0.03);
      harmonic.onended = () => {
        harmonic.disconnect();
        partial.disconnect();
      };
    }
    oscillator.onended = () => {
      oscillator.disconnect();
      filter.disconnect();
      amp.disconnect();
      stereo.disconnect();
    };
  }
  function drum(g, type, time, volume) {
    const a = g.a,
      gain = a.createGain();
    gain.connect(g.bus);
    gain.gain.setValueAtTime(volume, time);
    gain.gain.exponentialRampToValueAtTime(
      0.0001,
      time + (type === "kick" ? 0.22 : type === "snare" ? 0.16 : 0.035),
    );
    if (type === "kick") {
      const osc = a.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(125, time);
      osc.frequency.exponentialRampToValueAtTime(40, time + 0.13);
      osc.connect(gain);
      osc.start(time);
      osc.stop(time + 0.24);
      osc.onended = () => {
        osc.disconnect();
        gain.disconnect();
      };
    } else {
      const source = a.createBufferSource(),
        filter = a.createBiquadFilter();
      source.buffer = g.noise;
      filter.type = type === "hat" ? "highpass" : "bandpass";
      filter.frequency.value = type === "hat" ? 6200 : 1500;
      filter.Q.value = 0.6;
      source.connect(filter);
      filter.connect(gain);
      source.start(
        time,
        type === "hat" ? 0.3 : 0,
        type === "hat" ? 0.05 : 0.19,
      );
      source.onended = () => {
        source.disconnect();
        filter.disconnect();
        gain.disconnect();
      };
    }
  }
  function schedule(g, song, index, time) {
    const bar = Math.floor(index / 16) % 32,
      s = index % 16,
      beat = 60 / song.bpm,
      step = beat / 4;
    const [degree, minor] = song.chords[bar % 8],
      root = song.root + degree,
      third = minor ? 3 : 4;
    const chorus = bar >= 16 && bar < 24,
      quiet = bar >= 24 && bar < 28,
      intro = bar < 4;
    const melody = (chorus ? song.b : song.a)[bar % 4];
    const leadType =
      song.color === "glass" || song.color === "bell" ? "bell" : "lead";
    if (s === 0) {
      tone(g, "bass", root - 12, time, beat * 1.6, 0.25);
      for (const [i, n] of [root + 12, root + 12 + third, root + 19].entries())
        tone(
          g,
          "pad",
          n,
          time,
          beat * 3.1,
          intro ? 0.033 : 0.047,
          (i - 1) * 0.32,
        );
    }
    if ([6, 8, 14].includes(s) && !quiet)
      tone(g, "bass", root - 12 + (s === 14 ? 7 : 0), time, step * 2.2, 0.15);
    if (s % 2 === 0 && !(intro && s % 4 === 2)) {
      const note = melody[s / 2];
      if (note !== null)
        tone(
          g,
          leadType,
          song.root + note,
          time,
          step * (song.color === "glass" ? 3.3 : 1.45),
          chorus ? 0.105 : 0.09,
          -0.06,
        );
    }
    if (s % 4 === 3 && !quiet) {
      const offsets = [0, third, 7, 12];
      tone(
        g,
        song.color === "wood" ? "lead" : "bell",
        root + 12 + offsets[Math.floor(s / 4)],
        time,
        step * 1.5,
        0.05,
        0.24,
      );
    }
    if (!intro && !quiet && song.color !== "glass" && song.color !== "bell") {
      if (s === 0 || s === 8 || (chorus && s === 14))
        drum(g, "kick", time, 0.23);
      if (s === 4 || s === 12) drum(g, "snare", time, 0.085);
      if (s % 2 === 0) drum(g, "hat", time, s % 4 === 0 ? 0.045 : 0.028);
      if (bar % 8 === 7 && s === 15) drum(g, "snare", time, 0.06);
    } else if (!intro && s === 0) drum(g, "kick", time, 0.095);
    if (chorus && s === 0)
      tone(
        g,
        "bell",
        song.root + melody.find((n) => n !== null) + 12,
        time,
        beat,
        0.035,
        0.3,
      );
  }
  function select(name, paused = false) {
    if (!engine) start();
    getBgmMasterGain();
    const song = songs[name] || songs.action;
    if (current !== name) {
      const now = engine.a.currentTime;
      if (engine.bus) {
        const old = engine.bus;
        old.gain.cancelScheduledValues(now);
        old.gain.setTargetAtTime(0, now, 0.11);
        setTimeout(() => old.disconnect(), 1800);
      }
      engine.bus = engine.a.createGain();
      engine.bus.gain.setValueAtTime(0.0001, now);
      engine.bus.gain.linearRampToValueAtTime(0.8, now + 0.35);
      engine.bus.connect(engine.out);
      engine.track = song;
      engine.next = now + 0.08;
      engine.step = 0;
      current = name;
    }
    if (engine.paused !== paused) {
      engine.paused = paused;
      engine.out.gain.setTargetAtTime(
        paused ? 0.28 : 0.92,
        engine.a.currentTime,
        0.08,
      );
    }
  }
  function start() {
    if (engine) return;
    engine = graph(ac(), getBgmMasterGain());
    timer = setInterval(() => {
      if (!engine.track || engine.a.state !== "running" || bgmMuted) return;
      const now = engine.a.currentTime;
      if (engine.next < now - 0.15) engine.next = now + 0.03;
      while (engine.next < now + 0.13) {
        schedule(engine, engine.track, engine.step++, engine.next);
        engine.next += 60 / engine.track.bpm / 4;
      }
    }, 25);
  }
  async function render(name = "action", seconds = 24) {
    const a = new OfflineAudioContext(2, Math.ceil(44100 * seconds), 44100),
      g = graph(a, a.destination),
      song = songs[name] || songs.action;
    g.bus = a.createGain();
    g.bus.gain.value = 0.72;
    g.bus.connect(g.out);
    g.out.gain.value = 0.55;
    let time = 0.05,
      index = 0;
    while (time < seconds - 0.9) {
      schedule(g, song, index++, time);
      time += 60 / song.bpm / 4;
    }
    return a.startRendering();
  }
  return {
    start,
    setTrack: select,
    render,
    songs,
    get status() {
      return {
        track: current,
        scheduledSteps: engine?.step || 0,
        tempo: engine?.track?.bpm || 0,
        bars: 32,
      };
    },
  };
})();
