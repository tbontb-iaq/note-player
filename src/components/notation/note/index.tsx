import { type Note } from "@/lib/parseSong";

function spanArray(num: number) {
  return new Array(num).fill(0).map((_, i) => <span key={i} />);
}

export default function Note({ note }: { note: Note }) {
  const semi = note.pitch.sharp ? " #" : note.pitch.flat ? " b" : "";
  const raise = spanArray(note.pitch.raise);
  const drop = spanArray(note.pitch.drop);
  const sustain = spanArray(note.length.sustain);
  const dot = spanArray(note.length.dot);

  let main = (
    <>
      <span className={"num" + semi}>{note.pitch.num}</span>
      <span className="sustain">{sustain}</span>
      <span className="dot">{dot}</span>
    </>
  );

  for (let i = 0; i < note.length.line_count; i++)
    main = <span className="line">{main}</span>;

  return (
    <div data-note={note.raw_str}>
      <div className="raise">{raise}</div>
      <div className="main">{main}</div>
      <div className="drop">{drop}</div>
    </div>
  );
}
