import "./index.stylus";
import { type Note } from "@/lib/parseSong";
import NoteEl from "./note";

export default function Notation({
  notes,
  note_count = 2,
}: {
  notes: Note[];
  note_count?: number;
}) {
  let time = 0;
  const elArr = [];

  for (let i = 0; i < notes.length; i++)
    if (time < note_count) {
      // console.log(notes[i].raw_str, notes[i].duration, time);

      time += notes[i].duration;
      elArr.push(<NoteEl note={notes[i]} key={i} />);
      if (Math.abs(time - Math.round(time)) <= Number.EPSILON)
        elArr.push(<div className="blank" key={"blank" + i} />);
    } else {
      i--;
      time = 0;
      elArr.push(<div className="divider" key={"divider" + i} />);
    }

  return <div className="notation-container">{elArr}</div>;
}
