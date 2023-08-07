type Note = {
  midi: number;
  duration: number;
  raw_str: string;

  length: {
    line_count: number;
    sustain: number;
    dot: number;
  };
  pitch: {
    num: number;
    raise: number;
    drop: number;
    sharp: boolean;
    flat: boolean;
  };
};

const noteReg = /(\+*)(-*)(\d)(#?)(b?)(_*)(\.*)/i;

const Midi = [0, 2, 4, 5, 7, 9, 11];

function parseSong(song: string) {
  song = song.replace(/[\s|]+/g, "");
  const result: Note[] = [];
  let line_count = 0;
  for (let i = 0; i < song.length; i++) {
    switch (song[i]) {
      case "(":
        line_count++;
        break;
      case ")":
        line_count--;
        break;
      default: {
        const m = song.substring(i).match(noteReg);
        if (m) {
          const [note, raise, drop, num, sharp, flat, sustain, dot] = m;
          const midi =
            num === "0"
              ? 0
              : Midi[parseInt(num) - 1] +
                (raise.length - drop.length + 5) * 12 +
                sharp.length -
                flat.length;
          result.push({
            midi,
            duration:
              (Math.pow(0.5, line_count) + sustain.length) *
              Math.pow(1.5, dot.length),
            raw_str: note,
            length: {
              line_count,
              sustain: sustain.length,
              dot: dot.length,
            },
            pitch: {
              num: parseInt(num),
              raise: raise.length,
              drop: drop.length,
              sharp: sharp.length !== 0,
              flat: flat.length !== 0,
            },
          });
          i += (m.index ?? 0) + note.length - 1;
        }
      }
    }
  }
  return result;
}

export { parseSong, type Note };
