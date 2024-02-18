import React, { useContext, useEffect, useRef, useState } from "react";
import { WebMidi } from "webmidi";
import ArrowBackSymbol from "./symbols/ArrowBackSymbol";
import ArrowForwardSymbol from "./symbols/ArrowForwardSymbol";
import SearchSymbol from "./symbols/SearchSymbol";
import {
  darkModeFontColor,
  fontFamily,
  lightModeFontColor,
} from "../utils/styles";
import {
  AltChordsContext,
  KeyContext,
  MidiInputContext,
  ShowPracticeRoomContext,
  ThemeContext,
} from "../pages/main";
import CancelSymbol from "./symbols/CancelSymbol";
import { detect } from "@tonaljs/chord-detect";
import { Note } from "tonal";
import "animate.css";
import { midiNumbersArray } from "../utils/midiNumbersArray";
import convertChordToCorrectKey from "../utils/chordConversion";
import { getItem } from "../utils/localStorage";

interface Props {
  noteOnColor: string;
  onSearch: (hideButton: boolean) => void;
}

const SearchMode = ({ noteOnColor, onSearch }: Props) => {
  const [selectedNotes, setSelectedNotes] = useState<number[]>([]);
  const [searchResults, setSearchResults] = useState<number[][]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [currentChord, setCurrentChord] = useState("");
  const [searchResult, setSearchResult] = useState<number[]>([]);
  const [altChords, setAltChords] = useState([""]);

  const allowNavigation = useRef(false);
  const isLeftArrowPressed = useRef(false);
  const isRightArrowPressed = useRef(false);
  const isEscapePressed = useRef(false);
  const isEnterPressed = useRef(false);
  const divRef = useRef(null);
  const midiNumbers = useRef<number[]>([]);
  const searchResultsRef = useRef<number[][]>([]);
  const index = useRef(0);
  const selectedNotesRef = useRef<number[]>([]);

  const { showAltChords } = useContext(AltChordsContext);
  const { key } = useContext(KeyContext);
  const { theme } = useContext(ThemeContext);
  const { midiInput } = useContext(MidiInputContext);
  const { setShowPracticeRoom } = useContext(ShowPracticeRoomContext);

  useEffect(() => {
    if (WebMidi !== undefined) {
      for (const input of WebMidi.inputs) {
        if (input === midiInput) {
          input.addListener("noteon", handleMIDIMessage);
          input.addListener("noteoff", handleMIDIMessage);
        }
      }
    }

    const interval = setInterval(() => {
      const div = document.querySelector(".search");
      if (div !== null) {
        div.classList.add("animate__headShake");

        setTimeout(() => {
          div.classList.remove("animate__headShake");
        }, 1000);
      }
    }, 2000);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (searchResults.length > 0) {
      const chords = detect(
        searchResults[index.current].map((value) => Note.fromMidi(value)),
        { assumePerfectFifth: true }
      );

      const mainChord = convertChordToCorrectKey(chords[0], key);

      setCurrentChord(mainChord);

      const altChordsInKey = chords
        .slice(1, 4)
        .map((chord) => convertChordToCorrectKey(chord, key));

      setAltChords(altChordsInKey);
    }
  }, [key]);

  function handleKeyDown(event) {
    if (searchResultsRef.current.length > 0) {
      if (
        event.key === "ArrowLeft" &&
        allowNavigation.current &&
        index.current !== 0 &&
        !isLeftArrowPressed.current
      ) {
        isLeftArrowPressed.current = true;
        handleGoingBackInSearchResults();
      } else if (
        event.key === "ArrowRight" &&
        allowNavigation.current &&
        index.current !== searchResultsRef.current.length - 1 &&
        !isRightArrowPressed.current
      ) {
        isRightArrowPressed.current = true;
        handleGoingForwardInSearchResults();
      } else if (event.key === "Escape" && !isEscapePressed.current) {
        isEscapePressed.current = true;
        cancelSearch();
      }
    } else if (
      event.key === "Escape" &&
      midiNumbers.current.length > 0 &&
      !isEscapePressed.current
    ) {
      isEscapePressed.current = true;
      cancelSearch();
    } else if (
      event.key === "Enter" &&
      midiNumbers.current.length > 0 &&
      !isEnterPressed.current
    ) {
      isEnterPressed.current = true;
      handleSearch();
    }
  }

  function handleKeyUp(event) {
    if (event.key === "ArrowLeft") {
      isLeftArrowPressed.current = false;
    } else if (event.key === "ArrowRight") {
      isRightArrowPressed.current = false;
    } else if (event.key === "Escape") {
      isEscapePressed.current = false;
    } else if (event.key === "Enter") {
      isEnterPressed.current = false;
    }
  }

  window.addEventListener("keydown", handleKeyDown);
  window.addEventListener("keyup", handleKeyUp);

  // Function to handle incoming MIDI data
  function handleMIDIMessage(event: any) {
    if (event.data.length === 3) {
      const [status, pitch, velocity] = event.data;
      if (status === 144 && velocity !== 0) {
        midiNumbers.current = Array.from(
          new Set(midiNumbers.current.concat(pitch))
        ).sort((a, b) => {
          return a - b;
        });

        selectedNotesRef.current = midiNumbers.current;
        setSelectedNotes(midiNumbers.current);
      } else if (status === 128 || (status === 144 && velocity === 0)) {
        midiNumbers.current = midiNumbers.current.filter(
          (value) => value !== pitch
        );

        selectedNotesRef.current = midiNumbers.current;
        setSelectedNotes(midiNumbers.current);
      }
    }
  }

  const handleClick = (midiNumber: number) => {
    if (selectedNotes.includes(midiNumber)) {
      const newMidiNumbers = selectedNotes.filter(
        (note) => note !== midiNumber
      );
      midiNumbers.current = newMidiNumbers;
      selectedNotesRef.current = midiNumbers.current;
      setSelectedNotes(midiNumbers.current);
    } else {
      const newMidiNumbers = selectedNotes.concat(midiNumber);
      midiNumbers.current = newMidiNumbers;
      selectedNotesRef.current = midiNumbers.current;
      setSelectedNotes(midiNumbers.current);
    }
  };

  const handleSearch = () => {
    const randomFn = function random() {
      return Math.random() - 0.5;
    };

    const tempValues = midiNumbersArray
      .filter((midiNumbers) =>
        selectedNotesRef.current.every((value) => midiNumbers.includes(value))
      )
      .sort(randomFn);

    const values = tempValues.filter((midiNumbers) => {
      const chords = detect(
        midiNumbers.map((value) => Note.fromMidi(value)),
        { assumePerfectFifth: true }
      );

      return chords.length > 0;
    });

    if (values.length === 0) {
      setIsSearching(true);
    } else {
      const chords = detect(
        values[index.current].map((value) => Note.fromMidi(value)),
        { assumePerfectFifth: true }
      );

      const mainChord = convertChordToCorrectKey(
        chords[0],
        getItem("key-preference")
      );

      setAltChords(
        chords
          .slice(1, 4)
          .map((chord) =>
            convertChordToCorrectKey(chord, getItem("key-preference"))
          )
      );

      // setShowProfileIcon(false);

      searchResultsRef.current = values;
      allowNavigation.current = true;
      setCurrentChord(mainChord);
      setSearchResult(values[index.current]);
      setSearchResults(values);
      setIsSearching(true);
      onSearch(true);
    }
  };

  const cancelSearch = () => {
    // setShowProfileIcon(true);
    setSearchResults([]);
    selectedNotesRef.current = [];
    setSelectedNotes([]);
    setSearchResult([]);
    searchResultsRef.current = [];
    index.current = 0;
    allowNavigation.current = false;
    midiNumbers.current = [];
    setCurrentChord("");
    setIsSearching(false);
    setShowPracticeRoom(false);
    onSearch(false);
  };

  const handleGoingBackInSearchResults = () => {
    index.current -= 1;

    const chords = detect(
      searchResultsRef.current[index.current].map((value) =>
        Note.fromMidi(value)
      ),
      { assumePerfectFifth: true }
    );

    const mainChord = convertChordToCorrectKey(
      chords[0],
      getItem("key-preference")
    );

    setAltChords(
      chords
        .slice(1, 4)
        .map((chord) =>
          convertChordToCorrectKey(chord, getItem("key-preference"))
        )
    );

    setSearchResult(searchResultsRef.current[index.current]);

    setCurrentChord(mainChord);
  };

  const handleGoingForwardInSearchResults = () => {
    index.current += 1;

    const chords = detect(
      searchResultsRef.current[index.current].map((value) =>
        Note.fromMidi(value)
      ),
      { assumePerfectFifth: true }
    );

    const mainChord = convertChordToCorrectKey(
      chords[0],
      getItem("key-preference")
    );

    setAltChords(
      chords
        .slice(1, 4)
        .map((chord) =>
          convertChordToCorrectKey(chord, getItem("key-preference"))
        )
    );

    setSearchResult(searchResultsRef.current[index.current]);

    setCurrentChord(mainChord);
  };

  const whiteKeyStyleOff = {
    height: "100%",
    width: "1.92307692%",
    border: "0.7px solid black",
    borderTop: "1.7px solid black",
    backgroundColor: "white",
  };

  const blackKeyStyleOff = {
    height: "57%",
    width: "1%",
    backgroundColor: "#484848",
    borderWidth: "1px 2px 8px 2px",
    borderStyle: "solid",
    borderColor: "black",
  };

  const whiteKeyStyleOn = {
    height: "100%",
    width: "1.92307692%",
    border: "0.7px solid black",
    borderTop: "1.7px solid black",
    backgroundColor: noteOnColor,
  };

  const blackKeyStyleOn = {
    height: "57.2%",
    width: "1.1%",
    backgroundColor: noteOnColor,
    border: "1px solid black",
  };

  return (
    <div>
      {!isSearching ? (
        <div className="no-transition flex justify-center items-center absolute w-screen top-[43%]">
          {selectedNotes.length === 0 ? (
            <></>
          ) : (
            <div
              ref={divRef}
              className="animate__animated search"
              style={{ cursor: "pointer" }}
              onClick={handleSearch}
            >
              <SearchSymbol />
            </div>
          )}
        </div>
      ) : (
        <>
          {searchResults.length > 0 ? (
            <div>
              <div
                className=" absolute right-[5%] top-[5%] cursor-pointer"
                onClick={cancelSearch}
              >
                <CancelSymbol />
              </div>
              <div className="flex justify-center items-center absolute w-screen h-[70%]">
                <div
                  className="absolute left-[5%]"
                  style={{
                    cursor: index.current === 0 ? "arrow" : "pointer",
                    opacity: index.current === 0 ? 0 : 1,
                  }}
                  onClick={
                    index.current !== 0
                      ? handleGoingBackInSearchResults
                      : undefined
                  }
                >
                  <ArrowBackSymbol />
                </div>
                <div
                  className="flex flex-col justify-center items-center"
                  style={{
                    color:
                      theme === "light-mode"
                        ? lightModeFontColor
                        : darkModeFontColor,
                  }}
                >
                  <div
                    className="text-5xl text-center"
                    style={{
                      color:
                        theme === "light-mode"
                          ? lightModeFontColor
                          : darkModeFontColor,
                    }}
                  >
                    {currentChord}
                  </div>
                  {showAltChords &&
                    altChords.map((value, index) => (
                      <div
                        className="text-2xl font-extralight"
                        style={{
                          color:
                            theme === "light-mode"
                              ? lightModeFontColor
                              : darkModeFontColor,
                        }}
                        key={index}
                      >
                        {value}
                      </div>
                    ))}
                </div>
                <div
                  className="absolute right-[5%]"
                  style={{
                    cursor:
                      index.current === searchResults.length - 1
                        ? "arrow"
                        : "pointer",
                    opacity: index.current === searchResults.length - 1 ? 0 : 1,
                  }}
                  onClick={
                    index.current !== searchResults.length - 1
                      ? handleGoingForwardInSearchResults
                      : undefined
                  }
                >
                  <ArrowForwardSymbol />
                </div>
              </div>
              {searchResults.length !== 1 && (
                <div className="absolute bottom-[150px] text-center w-full">
                  <div
                    className="text-lg"
                    style={{
                      color:
                        theme === "light-mode"
                          ? lightModeFontColor
                          : darkModeFontColor,
                      opacity: 0.5,
                    }}
                  >
                    {index.current + 1} / {searchResults.length}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center absolute top-[40%] w-full gap-[20px]">
              <div style={{ cursor: "pointer" }} onClick={cancelSearch}>
                <CancelSymbol />
              </div>
              <div
                className="text-2xl"
                style={{
                  color:
                    theme === "light-mode"
                      ? lightModeFontColor
                      : darkModeFontColor,
                }}
              >
                no chords were found
              </div>
            </div>
          )}
        </>
      )}
      <div className="fixed bottom-0">
        {!isSearching ? (
          <div className="no-transition h-[18vh] w-screen flex relative cursor-pointer">
            <div
              style={
                selectedNotes.includes(21) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
              onClick={() => handleClick(21)}
            ></div>
            <div
              style={{
                ...(selectedNotes.includes(22)
                  ? blackKeyStyleOn
                  : blackKeyStyleOff),
                position: "absolute",
                left: "1.36%",
              }}
              onClick={() => handleClick(22)}
            ></div>
            <div
              style={
                selectedNotes.includes(23) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
              onClick={() => handleClick(23)}
            ></div>
            <div
              style={
                selectedNotes.includes(24) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
              onClick={() => handleClick(24)}
            ></div>
            <div
              style={{
                ...(selectedNotes.includes(25)
                  ? blackKeyStyleOn
                  : blackKeyStyleOff),
                position: "absolute",
                left: "5.20%",
              }}
              onClick={() => handleClick(25)}
            ></div>
            <div
              style={
                selectedNotes.includes(26) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
              onClick={() => handleClick(26)}
            ></div>
            <div
              style={{
                ...(selectedNotes.includes(27)
                  ? blackKeyStyleOn
                  : blackKeyStyleOff),
                position: "absolute",
                left: "7.12%",
              }}
              onClick={() => handleClick(27)}
            ></div>
            <div
              style={
                selectedNotes.includes(28) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
              onClick={() => handleClick(28)}
            ></div>
            <div
              style={
                selectedNotes.includes(29) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
              onClick={() => handleClick(29)}
            ></div>
            <div
              style={{
                ...(selectedNotes.includes(30)
                  ? blackKeyStyleOn
                  : blackKeyStyleOff),
                position: "absolute",
                left: "10.96%",
              }}
              onClick={() => handleClick(30)}
            ></div>
            <div
              style={
                selectedNotes.includes(31) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
              onClick={() => handleClick(31)}
            ></div>
            <div
              style={{
                ...(selectedNotes.includes(32)
                  ? blackKeyStyleOn
                  : blackKeyStyleOff),
                position: "absolute",
                left: "12.88%",
              }}
              onClick={() => handleClick(32)}
            ></div>
            <div
              style={
                selectedNotes.includes(33) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
              onClick={() => handleClick(33)}
            ></div>
            <div
              style={{
                ...(selectedNotes.includes(34)
                  ? blackKeyStyleOn
                  : blackKeyStyleOff),
                position: "absolute",
                left: "14.8%",
              }}
              onClick={() => handleClick(34)}
            ></div>
            <div
              style={
                selectedNotes.includes(35) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
              onClick={() => handleClick(35)}
            ></div>
            <div
              style={
                selectedNotes.includes(36) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
              onClick={() => handleClick(36)}
            ></div>
            <div
              style={{
                ...(selectedNotes.includes(37)
                  ? blackKeyStyleOn
                  : blackKeyStyleOff),
                position: "absolute",
                left: "18.64%",
              }}
              onClick={() => handleClick(37)}
            ></div>
            <div
              style={
                selectedNotes.includes(38) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
              onClick={() => handleClick(38)}
            ></div>
            <div
              style={{
                ...(selectedNotes.includes(39)
                  ? blackKeyStyleOn
                  : blackKeyStyleOff),
                position: "absolute",
                left: "20.56%",
              }}
              onClick={() => handleClick(39)}
            ></div>
            <div
              style={
                selectedNotes.includes(40) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
              onClick={() => handleClick(40)}
            ></div>
            <div
              style={
                selectedNotes.includes(41) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
              onClick={() => handleClick(41)}
            ></div>
            <div
              style={{
                ...(selectedNotes.includes(42)
                  ? blackKeyStyleOn
                  : blackKeyStyleOff),
                position: "absolute",
                left: "24.4%",
              }}
              onClick={() => handleClick(42)}
            ></div>
            <div
              style={
                selectedNotes.includes(43) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
              onClick={() => handleClick(43)}
            ></div>
            <div
              style={{
                ...(selectedNotes.includes(44)
                  ? blackKeyStyleOn
                  : blackKeyStyleOff),
                position: "absolute",
                left: "26.32%",
              }}
              onClick={() => handleClick(44)}
            ></div>
            <div
              style={
                selectedNotes.includes(45) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
              onClick={() => handleClick(45)}
            ></div>
            <div
              style={{
                ...(selectedNotes.includes(46)
                  ? blackKeyStyleOn
                  : blackKeyStyleOff),
                position: "absolute",
                left: "28.24%",
              }}
              onClick={() => handleClick(46)}
            ></div>
            <div
              style={
                selectedNotes.includes(47) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
              onClick={() => handleClick(47)}
            ></div>
            <div
              style={
                selectedNotes.includes(48) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
              onClick={() => handleClick(48)}
            ></div>
            <div
              style={{
                ...(selectedNotes.includes(49)
                  ? blackKeyStyleOn
                  : blackKeyStyleOff),
                position: "absolute",
                left: "32.08%",
              }}
              onClick={() => handleClick(49)}
            ></div>
            <div
              style={
                selectedNotes.includes(50) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
              onClick={() => handleClick(50)}
            ></div>
            <div
              style={{
                ...(selectedNotes.includes(51)
                  ? blackKeyStyleOn
                  : blackKeyStyleOff),
                position: "absolute",
                left: "34%",
              }}
              onClick={() => handleClick(51)}
            ></div>
            <div
              style={
                selectedNotes.includes(52) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
              onClick={() => handleClick(52)}
            ></div>
            <div
              style={
                selectedNotes.includes(53) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
              onClick={() => handleClick(53)}
            ></div>
            <div
              style={{
                ...(selectedNotes.includes(54)
                  ? blackKeyStyleOn
                  : blackKeyStyleOff),
                position: "absolute",
                left: "37.84%",
              }}
              onClick={() => handleClick(54)}
            ></div>
            <div
              style={
                selectedNotes.includes(55) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
              onClick={() => handleClick(55)}
            ></div>
            <div
              style={{
                ...(selectedNotes.includes(56)
                  ? blackKeyStyleOn
                  : blackKeyStyleOff),
                position: "absolute",
                left: "39.76%",
              }}
              onClick={() => handleClick(56)}
            ></div>
            <div
              style={
                selectedNotes.includes(57) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
              onClick={() => handleClick(57)}
            ></div>
            <div
              style={{
                ...(selectedNotes.includes(58)
                  ? blackKeyStyleOn
                  : blackKeyStyleOff),
                position: "absolute",
                left: "41.68%",
              }}
              onClick={() => handleClick(58)}
            ></div>
            <div
              style={
                selectedNotes.includes(59) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
              onClick={() => handleClick(59)}
            ></div>
            <div
              style={
                selectedNotes.includes(60) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
              onClick={() => handleClick(60)}
            ></div>
            <div
              style={{
                ...(selectedNotes.includes(61)
                  ? blackKeyStyleOn
                  : blackKeyStyleOff),
                position: "absolute",
                left: "45.52%",
              }}
              onClick={() => handleClick(61)}
            ></div>
            <div
              style={
                selectedNotes.includes(62) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
              onClick={() => handleClick(62)}
            ></div>
            <div
              style={{
                ...(selectedNotes.includes(63)
                  ? blackKeyStyleOn
                  : blackKeyStyleOff),
                position: "absolute",
                left: "47.44%",
              }}
              onClick={() => handleClick(63)}
            ></div>
            <div
              style={
                selectedNotes.includes(64) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
              onClick={() => handleClick(64)}
            ></div>
            <div
              style={
                selectedNotes.includes(65) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
              onClick={() => handleClick(65)}
            ></div>
            <div
              style={{
                ...(selectedNotes.includes(66)
                  ? blackKeyStyleOn
                  : blackKeyStyleOff),
                position: "absolute",
                left: "51.28%",
              }}
              onClick={() => handleClick(66)}
            ></div>
            <div
              style={
                selectedNotes.includes(67) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
              onClick={() => handleClick(67)}
            ></div>
            <div
              style={{
                ...(selectedNotes.includes(68)
                  ? blackKeyStyleOn
                  : blackKeyStyleOff),
                position: "absolute",
                left: "53.3%",
              }}
              onClick={() => handleClick(68)}
            ></div>
            <div
              style={
                selectedNotes.includes(69) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
              onClick={() => handleClick(69)}
            ></div>
            <div
              style={{
                ...(selectedNotes.includes(70)
                  ? blackKeyStyleOn
                  : blackKeyStyleOff),
                position: "absolute",
                left: "55.17%",
              }}
              onClick={() => handleClick(70)}
            ></div>
            <div
              style={
                selectedNotes.includes(71) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
              onClick={() => handleClick(71)}
            ></div>
            <div
              style={
                selectedNotes.includes(72) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
              onClick={() => handleClick(72)}
            ></div>
            <div
              style={{
                ...(selectedNotes.includes(73)
                  ? blackKeyStyleOn
                  : blackKeyStyleOff),
                position: "absolute",
                left: "59.07%",
              }}
              onClick={() => handleClick(73)}
            ></div>
            <div
              style={
                selectedNotes.includes(74) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
              onClick={() => handleClick(74)}
            ></div>
            <div
              style={{
                ...(selectedNotes.includes(75)
                  ? blackKeyStyleOn
                  : blackKeyStyleOff),
                position: "absolute",
                left: "60.95%",
              }}
              onClick={() => handleClick(75)}
            ></div>
            <div
              style={
                selectedNotes.includes(76) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
              onClick={() => handleClick(76)}
            ></div>
            <div
              style={
                selectedNotes.includes(77) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
              onClick={() => handleClick(77)}
            ></div>
            <div
              style={{
                ...(selectedNotes.includes(78)
                  ? blackKeyStyleOn
                  : blackKeyStyleOff),
                position: "absolute",
                left: "64.84%",
              }}
              onClick={() => handleClick(78)}
            ></div>
            <div
              style={
                selectedNotes.includes(79) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
              onClick={() => handleClick(79)}
            ></div>
            <div
              style={{
                ...(selectedNotes.includes(80)
                  ? blackKeyStyleOn
                  : blackKeyStyleOff),
                position: "absolute",
                left: "66.72%",
              }}
              onClick={() => handleClick(80)}
            ></div>
            <div
              style={
                selectedNotes.includes(81) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
              onClick={() => handleClick(81)}
            ></div>
            <div
              style={{
                ...(selectedNotes.includes(82)
                  ? blackKeyStyleOn
                  : blackKeyStyleOff),
                position: "absolute",
                left: "68.62%",
              }}
              onClick={() => handleClick(82)}
            ></div>
            <div
              style={
                selectedNotes.includes(83) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
              onClick={() => handleClick(83)}
            ></div>
            <div
              style={
                selectedNotes.includes(84) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
              onClick={() => handleClick(84)}
            ></div>
            <div
              style={{
                ...(selectedNotes.includes(85)
                  ? blackKeyStyleOn
                  : blackKeyStyleOff),
                position: "absolute",
                left: "72.5%",
              }}
              onClick={() => handleClick(85)}
            ></div>
            <div
              style={
                selectedNotes.includes(86) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
              onClick={() => handleClick(86)}
            ></div>
            <div
              style={{
                ...(selectedNotes.includes(87)
                  ? blackKeyStyleOn
                  : blackKeyStyleOff),
                position: "absolute",
                left: "74.44%",
              }}
              onClick={() => handleClick(87)}
            ></div>
            <div
              style={
                selectedNotes.includes(88) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
              onClick={() => handleClick(88)}
            ></div>
            <div
              style={
                selectedNotes.includes(89) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
              onClick={() => handleClick(89)}
            ></div>
            <div
              style={{
                ...(selectedNotes.includes(90)
                  ? blackKeyStyleOn
                  : blackKeyStyleOff),
                position: "absolute",
                left: "78.25%",
              }}
              onClick={() => handleClick(90)}
            ></div>
            <div
              style={
                selectedNotes.includes(91) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
              onClick={() => handleClick(91)}
            ></div>
            <div
              style={{
                ...(selectedNotes.includes(92)
                  ? blackKeyStyleOn
                  : blackKeyStyleOff),
                position: "absolute",
                left: "80.2%",
              }}
              onClick={() => handleClick(92)}
            ></div>
            <div
              style={
                selectedNotes.includes(93) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
              onClick={() => handleClick(93)}
            ></div>
            <div
              style={{
                ...(selectedNotes.includes(94)
                  ? blackKeyStyleOn
                  : blackKeyStyleOff),
                position: "absolute",
                left: "82.12%",
              }}
              onClick={() => handleClick(94)}
            ></div>
            <div
              style={
                selectedNotes.includes(95) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
              onClick={() => handleClick(95)}
            ></div>
            <div
              style={
                selectedNotes.includes(96) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
              onClick={() => handleClick(96)}
            ></div>
            <div
              style={{
                ...(selectedNotes.includes(97)
                  ? blackKeyStyleOn
                  : blackKeyStyleOff),
                position: "absolute",
                left: "85.96%",
              }}
              onClick={() => handleClick(97)}
            ></div>
            <div
              style={
                selectedNotes.includes(98) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
              onClick={() => handleClick(98)}
            ></div>
            <div
              style={{
                ...(selectedNotes.includes(99)
                  ? blackKeyStyleOn
                  : blackKeyStyleOff),
                position: "absolute",
                left: "87.88%",
              }}
              onClick={() => handleClick(99)}
            ></div>
            <div
              style={
                selectedNotes.includes(100) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
              onClick={() => handleClick(100)}
            ></div>
            <div
              style={
                selectedNotes.includes(101) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
              onClick={() => handleClick(101)}
            ></div>
            <div
              style={{
                ...(selectedNotes.includes(102)
                  ? blackKeyStyleOn
                  : blackKeyStyleOff),
                position: "absolute",
                left: "91.72%",
              }}
              onClick={() => handleClick(102)}
            ></div>
            <div
              style={
                selectedNotes.includes(103) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
              onClick={() => handleClick(103)}
            ></div>
            <div
              style={{
                ...(selectedNotes.includes(104)
                  ? blackKeyStyleOn
                  : blackKeyStyleOff),
                position: "absolute",
                left: "93.64%",
              }}
              onClick={() => handleClick(104)}
            ></div>
            <div
              style={
                selectedNotes.includes(105) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
              onClick={() => handleClick(105)}
            ></div>
            <div
              style={{
                ...(selectedNotes.includes(106)
                  ? blackKeyStyleOn
                  : blackKeyStyleOff),
                position: "absolute",
                left: "95.55%",
              }}
              onClick={() => handleClick(106)}
            ></div>
            <div
              style={
                selectedNotes.includes(107) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
              onClick={() => handleClick(107)}
            ></div>
            <div
              style={
                selectedNotes.includes(108) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
              onClick={() => handleClick(108)}
            ></div>
          </div>
        ) : (
          <div
            className="no-transition"
            style={{
              height: "18vh",
              width: "100vw",
              display: "flex",
              cursor: "arrow",
              position: "relative",
            }}
          >
            <div
              style={
                searchResult.includes(21) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
            ></div>
            <div
              style={{
                ...(searchResult.includes(22)
                  ? blackKeyStyleOn
                  : blackKeyStyleOff),
                position: "absolute",
                left: "1.36%",
              }}
            ></div>
            <div
              style={
                searchResult.includes(23) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
            ></div>
            <div
              style={
                searchResult.includes(24) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
            ></div>
            <div
              style={{
                ...(searchResult.includes(25)
                  ? blackKeyStyleOn
                  : blackKeyStyleOff),
                position: "absolute",
                left: "5.20%",
              }}
            ></div>
            <div
              style={
                searchResult.includes(26) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
            ></div>
            <div
              style={{
                ...(searchResult.includes(27)
                  ? blackKeyStyleOn
                  : blackKeyStyleOff),
                position: "absolute",
                left: "7.12%",
              }}
            ></div>
            <div
              style={
                searchResult.includes(28) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
            ></div>
            <div
              style={
                searchResult.includes(29) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
            ></div>
            <div
              style={{
                ...(searchResult.includes(30)
                  ? blackKeyStyleOn
                  : blackKeyStyleOff),
                position: "absolute",
                left: "10.96%",
              }}
            ></div>
            <div
              style={
                searchResult.includes(31) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
            ></div>
            <div
              style={{
                ...(searchResult.includes(32)
                  ? blackKeyStyleOn
                  : blackKeyStyleOff),
                position: "absolute",
                left: "12.88%",
              }}
            ></div>
            <div
              style={
                searchResult.includes(33) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
            ></div>
            <div
              style={{
                ...(searchResult.includes(34)
                  ? blackKeyStyleOn
                  : blackKeyStyleOff),
                position: "absolute",
                left: "14.8%",
              }}
            ></div>
            <div
              style={
                searchResult.includes(35) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
            ></div>
            <div
              style={
                searchResult.includes(36) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
            ></div>
            <div
              style={{
                ...(searchResult.includes(37)
                  ? blackKeyStyleOn
                  : blackKeyStyleOff),
                position: "absolute",
                left: "18.64%",
              }}
            ></div>
            <div
              style={
                searchResult.includes(38) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
            ></div>
            <div
              style={{
                ...(searchResult.includes(39)
                  ? blackKeyStyleOn
                  : blackKeyStyleOff),
                position: "absolute",
                left: "20.56%",
              }}
            ></div>
            <div
              style={
                searchResult.includes(40) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
            ></div>
            <div
              style={
                searchResult.includes(41) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
            ></div>
            <div
              style={{
                ...(searchResult.includes(42)
                  ? blackKeyStyleOn
                  : blackKeyStyleOff),
                position: "absolute",
                left: "24.4%",
              }}
            ></div>
            <div
              style={
                searchResult.includes(43) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
            ></div>
            <div
              style={{
                ...(searchResult.includes(44)
                  ? blackKeyStyleOn
                  : blackKeyStyleOff),
                position: "absolute",
                left: "26.32%",
              }}
            ></div>
            <div
              style={
                searchResult.includes(45) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
            ></div>
            <div
              style={{
                ...(searchResult.includes(46)
                  ? blackKeyStyleOn
                  : blackKeyStyleOff),
                position: "absolute",
                left: "28.24%",
              }}
            ></div>
            <div
              style={
                searchResult.includes(47) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
            ></div>
            <div
              style={
                searchResult.includes(48) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
            ></div>
            <div
              style={{
                ...(searchResult.includes(49)
                  ? blackKeyStyleOn
                  : blackKeyStyleOff),
                position: "absolute",
                left: "32.08%",
              }}
            ></div>
            <div
              style={
                searchResult.includes(50) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
            ></div>
            <div
              style={{
                ...(searchResult.includes(51)
                  ? blackKeyStyleOn
                  : blackKeyStyleOff),
                position: "absolute",
                left: "34%",
              }}
            ></div>
            <div
              style={
                searchResult.includes(52) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
            ></div>
            <div
              style={
                searchResult.includes(53) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
            ></div>
            <div
              style={{
                ...(searchResult.includes(54)
                  ? blackKeyStyleOn
                  : blackKeyStyleOff),
                position: "absolute",
                left: "37.84%",
              }}
            ></div>
            <div
              style={
                searchResult.includes(55) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
            ></div>
            <div
              style={{
                ...(searchResult.includes(56)
                  ? blackKeyStyleOn
                  : blackKeyStyleOff),
                position: "absolute",
                left: "39.76%",
              }}
            ></div>
            <div
              style={
                searchResult.includes(57) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
            ></div>
            <div
              style={{
                ...(searchResult.includes(58)
                  ? blackKeyStyleOn
                  : blackKeyStyleOff),
                position: "absolute",
                left: "41.68%",
              }}
            ></div>
            <div
              style={
                searchResult.includes(59) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
            ></div>
            <div
              style={
                searchResult.includes(60) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
            ></div>
            <div
              style={{
                ...(searchResult.includes(61)
                  ? blackKeyStyleOn
                  : blackKeyStyleOff),
                position: "absolute",
                left: "45.52%",
              }}
            ></div>
            <div
              style={
                searchResult.includes(62) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
            ></div>
            <div
              style={{
                ...(searchResult.includes(63)
                  ? blackKeyStyleOn
                  : blackKeyStyleOff),
                position: "absolute",
                left: "47.44%",
              }}
            ></div>
            <div
              style={
                searchResult.includes(64) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
            ></div>
            <div
              style={
                searchResult.includes(65) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
            ></div>
            <div
              style={{
                ...(searchResult.includes(66)
                  ? blackKeyStyleOn
                  : blackKeyStyleOff),
                position: "absolute",
                left: "51.28%",
              }}
            ></div>
            <div
              style={
                searchResult.includes(67) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
            ></div>
            <div
              style={{
                ...(searchResult.includes(68)
                  ? blackKeyStyleOn
                  : blackKeyStyleOff),
                position: "absolute",
                left: "53.3%",
              }}
            ></div>
            <div
              style={
                searchResult.includes(69) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
            ></div>
            <div
              style={{
                ...(searchResult.includes(70)
                  ? blackKeyStyleOn
                  : blackKeyStyleOff),
                position: "absolute",
                left: "55.17%",
              }}
            ></div>
            <div
              style={
                searchResult.includes(71) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
            ></div>
            <div
              style={
                searchResult.includes(72) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
            ></div>
            <div
              style={{
                ...(searchResult.includes(73)
                  ? blackKeyStyleOn
                  : blackKeyStyleOff),
                position: "absolute",
                left: "59.07%",
              }}
            ></div>
            <div
              style={
                searchResult.includes(74) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
            ></div>
            <div
              style={{
                ...(searchResult.includes(75)
                  ? blackKeyStyleOn
                  : blackKeyStyleOff),
                position: "absolute",
                left: "60.95%",
              }}
            ></div>
            <div
              style={
                searchResult.includes(76) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
            ></div>
            <div
              style={
                searchResult.includes(77) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
            ></div>
            <div
              style={{
                ...(searchResult.includes(78)
                  ? blackKeyStyleOn
                  : blackKeyStyleOff),
                position: "absolute",
                left: "64.84%",
              }}
            ></div>
            <div
              style={
                searchResult.includes(79) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
            ></div>
            <div
              style={{
                ...(searchResult.includes(80)
                  ? blackKeyStyleOn
                  : blackKeyStyleOff),
                position: "absolute",
                left: "66.72%",
              }}
            ></div>
            <div
              style={
                searchResult.includes(81) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
            ></div>
            <div
              style={{
                ...(searchResult.includes(82)
                  ? blackKeyStyleOn
                  : blackKeyStyleOff),
                position: "absolute",
                left: "68.62%",
              }}
            ></div>
            <div
              style={
                searchResult.includes(83) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
            ></div>
            <div
              style={
                searchResult.includes(84) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
            ></div>
            <div
              style={{
                ...(searchResult.includes(85)
                  ? blackKeyStyleOn
                  : blackKeyStyleOff),
                position: "absolute",
                left: "72.5%",
              }}
            ></div>
            <div
              style={
                searchResult.includes(86) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
            ></div>
            <div
              style={{
                ...(searchResult.includes(87)
                  ? blackKeyStyleOn
                  : blackKeyStyleOff),
                position: "absolute",
                left: "74.44%",
              }}
            ></div>
            <div
              style={
                searchResult.includes(88) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
            ></div>
            <div
              style={
                searchResult.includes(89) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
            ></div>
            <div
              style={{
                ...(searchResult.includes(90)
                  ? blackKeyStyleOn
                  : blackKeyStyleOff),
                position: "absolute",
                left: "78.25%",
              }}
            ></div>
            <div
              style={
                searchResult.includes(91) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
            ></div>
            <div
              style={{
                ...(searchResult.includes(92)
                  ? blackKeyStyleOn
                  : blackKeyStyleOff),
                position: "absolute",
                left: "80.2%",
              }}
            ></div>
            <div
              style={
                searchResult.includes(93) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
            ></div>
            <div
              style={{
                ...(searchResult.includes(94)
                  ? blackKeyStyleOn
                  : blackKeyStyleOff),
                position: "absolute",
                left: "82.12%",
              }}
            ></div>
            <div
              style={
                searchResult.includes(95) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
            ></div>
            <div
              style={
                searchResult.includes(96) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
            ></div>
            <div
              style={{
                ...(searchResult.includes(97)
                  ? blackKeyStyleOn
                  : blackKeyStyleOff),
                position: "absolute",
                left: "85.96%",
              }}
            ></div>
            <div
              style={
                searchResult.includes(98) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
            ></div>
            <div
              style={{
                ...(searchResult.includes(99)
                  ? blackKeyStyleOn
                  : blackKeyStyleOff),
                position: "absolute",
                left: "87.88%",
              }}
            ></div>
            <div
              style={
                searchResult.includes(100) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
            ></div>
            <div
              style={
                searchResult.includes(101) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
            ></div>
            <div
              style={{
                ...(searchResult.includes(102)
                  ? blackKeyStyleOn
                  : blackKeyStyleOff),
                position: "absolute",
                left: "91.72%",
              }}
            ></div>
            <div
              style={
                searchResult.includes(103) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
            ></div>
            <div
              style={{
                ...(searchResult.includes(104)
                  ? blackKeyStyleOn
                  : blackKeyStyleOff),
                position: "absolute",
                left: "93.64%",
              }}
            ></div>
            <div
              style={
                searchResult.includes(105) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
            ></div>
            <div
              style={{
                ...(searchResult.includes(106)
                  ? blackKeyStyleOn
                  : blackKeyStyleOff),
                position: "absolute",
                left: "95.55%",
              }}
            ></div>
            <div
              style={
                searchResult.includes(107) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
            ></div>
            <div
              style={
                searchResult.includes(108) ? whiteKeyStyleOn : whiteKeyStyleOff
              }
            ></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchMode;
