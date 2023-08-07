enum Alphabet {
  C,
  D,
  E,
  F,
  G,
  A,
  B,
}

enum Semitone {
  Sharp = "#",
  Flat = "b",
  None = "",
}

type Alphabets = keyof typeof Alphabet;
type Semitones = `${Semitone}`;
type Octaves =
  // | -4
  // | -3
  // | -2
  // | -1 |
  0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;
type Note = `${Alphabets | Lowercase<Alphabets>}${
  | Semitones
  | Uppercase<Semitones>}${Octaves}`;

class Pitch {
  constructor(
    public alphabet: Alphabet,
    public semitone: Semitone,
    public octave: Octaves
  ) {}

  static reg = /^[A-G][#b]?\d{1,2}$/i;

  static test(str: string): str is Note {
    return Pitch.reg.test(str);
  }

  static fromNote = (str: Note) =>
    new Pitch(
      Alphabet[str[0].toUpperCase() as Alphabets],
      ("#bB".includes(str[1]) ? str[1].toLowerCase() : "") as Semitone,
      parseInt(str.match(/\d+$/)![0]) as Octaves
    );

  alphabet_add(add: boolean = true) {
    this.alphabet += add ? 1 : -1;

    if (!(this.alphabet in Alphabet))
      if (add) {
        this.alphabet = Alphabet.C;
        this.octave++;
      } else {
        this.alphabet = Alphabet.B;
        this.octave--;
      }

    return this;
  }

  // C C#/Db D D#/Eb E F F#/Gb G G#/Ab A A#/Bb B
  // 升一个半音
  raise_semi() {
    if (this.semitone) {
      if (this.semitone === Semitone.Sharp) this.alphabet_add();
      this.semitone = Semitone.None;
    } else if (this.alphabet === Alphabet.E || this.alphabet === Alphabet.B)
      this.alphabet_add();
    else this.semitone = Semitone.Sharp;
    return this;
  }

  drop_semi() {
    if (this.semitone) {
      if (this.semitone === "b") this.alphabet_add(false);
      this.semitone = Semitone.None;
    } else if (this.alphabet === Alphabet.F || this.alphabet === Alphabet.C)
      this.alphabet_add(false);
    else this.semitone = Semitone.Flat;
    return this;
  }

  // 升一个全音
  raise() {
    return this.raise_semi().raise_semi();
  }

  drop() {
    return this.drop_semi().drop_semi();
  }

  toString() {
    return `${Alphabet[this.alphabet]}${this.semitone}${this.octave}` as Note;
  }

  private static NoteMap: `${Alphabets}${Semitones}`[][] = [
    ["C"],
    ["C#", "Db"],
    ["D"],
    ["D#", "Eb"],
    ["E"],
    ["F"],
    ["F#", "Gb"],
    ["G"],
    ["G#", "Ab"],
    ["A"],
    ["A#", "Bb"],
    ["B"],
  ];

  static SemitoneMap = Pitch.NoteMap.reduce(
    (obj, a, i) => ({
      ...a.reduce((o, n) => ({ [n]: i, ...o }), {}),
      ...obj,
    }),
    {}
  ) as Record<`${Alphabets}${Semitones}`, number>;

  toMidi() {
    return (
      (this.octave + 1) * 12 +
      Pitch.SemitoneMap[
        `${Alphabet[this.alphabet] as Alphabets}${this.semitone}`
      ]
    );
  }

  static fromMidi = (midi: number) =>
    Pitch.fromNote(
      `${Pitch.NoteMap[midi % 12][0]}${Math.floor(midi / 12) - 1}` as Note
    );
}

export { Pitch };
