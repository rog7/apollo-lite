import { noteIndex, validNotes } from "./noteHelpers";

let rootNote: string;
let slashNote: string | undefined;

export default function convertChordToCorrectKey(
  chord: string | undefined,
  key: string
): string {
  if (chord !== undefined) {
    if (chord.charAt(1) === "#" || chord.charAt(1) === "b") {
      rootNote = chord.slice(0, 2);
    } else {
      rootNote = chord.charAt(0);
    }

    if (chord.includes("/")) {
      const lastIndex = chord.lastIndexOf("/");
      const value = chord.substring(lastIndex + 1);

      if (/^[a-zA-Z#]+$/.test(value)) {
        slashNote = value;
      }
    }

    if (slashNote !== undefined) {
      const tempChordName = chord.replaceAll(
        rootNote,
        (validNotes[key] as string)[noteIndex[rootNote]]
      );
      return tempChordName.replace(
        slashNote,
        (validNotes[key] as string)[noteIndex[slashNote]]
      );
    } else {
      return chord.replaceAll(
        rootNote,
        (validNotes[key] as string)[noteIndex[rootNote]]
      );
    }
  } else {
    return "";
  }
}
