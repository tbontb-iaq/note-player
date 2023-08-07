import { useCallback, useState } from "react";
import style from "./index.module.stylus";
import * as Tone from "tone";
import { Note, parseSong } from "@/lib/parseSong";
import Notation from "@/components/notation";

const defaultNotation = `(-6-7) | 1.(-7)13

-7__-3 | -6.(-5)-61 | -5__(-3-3) | -4.(-3)-41 | -3__(11)

-7.(-4#)-4-7 | -7__(-6-7) | 1.(-7)13 | -7__-3 | -6.(-5)-61

-5__(-2-3) | -4(1)-7.1 | 2.(3)1_ | (1-7-6-6)-7-5# | -6__(12)

3.(2)35 | 2__0 | 1(1-7)13 | 3__0 | (-6-7)1(-71)2

1.(-5)-5_ | 432(13) | 3__3 | 6.(6)5.(5) | (32)1_1

2.(1)25 | 3__3 | 6.(6)5.(5) | (32)1_1 | 2.(1)2-7

-6__`;

export default function Index() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if ((window as any).Tone === undefined) (window as any).Tone = Tone;
  const [notes, setNotes] = useState<Note[]>([]);
  const [value, setValue] = useState(defaultNotation);
  const [noteCount, setNoteCount] = useState(2);
  const [speed, setSpeed] = useState(60);

  const onChange = useCallback<React.ChangeEventHandler<HTMLTextAreaElement>>(
    ev => {
      setValue(ev.target.value);
      const notes = parseSong(ev.target.value);
      setNotes(notes);
    },
    []
  );

  const play = useCallback(() => {
    console.log("play");
    let time = Tone.now();
    const synth = new Tone.PolySynth(Tone.FMSynth).toDestination(),
      ratio = 60 / speed;
    parseSong(value).forEach(n => {
      const { midi, duration } = n;
      const dur = duration * ratio;
      synth.triggerAttackRelease(
        midi ? Tone.Midi(midi, "midi").toFrequency() : "0",
        dur,
        time,
        1
      );
      time += dur;
    });
  }, [speed, value]);

  return (
    <div className={style.container}>
      <div>
        <p>Note Player</p>
        <textarea value={value} onChange={onChange} />
        <div>
          <button onPointerUp={play}>Play</button>
          <label>拍数</label>
          <input
            type="number"
            value={noteCount}
            onChange={ev => setNoteCount(parseFloat(ev.target.value) || 2)}
          />
          <label>速度</label>
          <input
            type="number"
            value={speed}
            onChange={ev => setSpeed(parseInt(ev.target.value) || 60)}
          />
        </div>
      </div>
      <Notation notes={notes} note_count={noteCount} />
    </div>
  );
}
