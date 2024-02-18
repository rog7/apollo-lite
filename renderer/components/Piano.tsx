interface Props {
  midiNumbers: number[];
  noteOnColor: string;
}

const Piano = ({ midiNumbers, noteOnColor }: Props) => {
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
    <div className="h-[18vh] w-screen flex relative no-transition">
      <div
        style={midiNumbers.includes(21) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></div>
      <div
        className="absolute left-[1.36%]"
        style={midiNumbers.includes(22) ? blackKeyStyleOn : blackKeyStyleOff}
      ></div>
      <div
        style={midiNumbers.includes(23) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></div>
      <div
        style={midiNumbers.includes(24) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></div>
      <div
        className="absolute left-[5.20%]"
        style={midiNumbers.includes(25) ? blackKeyStyleOn : blackKeyStyleOff}
      ></div>
      <div
        style={midiNumbers.includes(26) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></div>
      <div
        className="absolute left-[7.12%]"
        style={midiNumbers.includes(27) ? blackKeyStyleOn : blackKeyStyleOff}
      ></div>
      <div
        style={midiNumbers.includes(28) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></div>
      <div
        style={midiNumbers.includes(29) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></div>
      <div
        className="absolute left-[10.96%]"
        style={midiNumbers.includes(30) ? blackKeyStyleOn : blackKeyStyleOff}
      ></div>
      <div
        style={midiNumbers.includes(31) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></div>
      <div
        className="absolute left-[12.88%]"
        style={midiNumbers.includes(32) ? blackKeyStyleOn : blackKeyStyleOff}
      ></div>
      <div
        style={midiNumbers.includes(33) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></div>
      <div
        className="absolute left-[14.8%]"
        style={midiNumbers.includes(34) ? blackKeyStyleOn : blackKeyStyleOff}
      ></div>
      <div
        style={midiNumbers.includes(35) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></div>
      <div
        style={midiNumbers.includes(36) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></div>
      <div
        className="absolute left-[18.64%]"
        style={midiNumbers.includes(37) ? blackKeyStyleOn : blackKeyStyleOff}
      ></div>
      <div
        style={midiNumbers.includes(38) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></div>
      <div
        className="absolute left-[20.56%]"
        style={midiNumbers.includes(39) ? blackKeyStyleOn : blackKeyStyleOff}
      ></div>
      <div
        style={midiNumbers.includes(40) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></div>
      <div
        style={midiNumbers.includes(41) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></div>
      <div
        className="absolute left-[24.4%]"
        style={midiNumbers.includes(42) ? blackKeyStyleOn : blackKeyStyleOff}
      ></div>
      <div
        style={midiNumbers.includes(43) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></div>
      <div
        className="absolute left-[26.32%]"
        style={midiNumbers.includes(44) ? blackKeyStyleOn : blackKeyStyleOff}
      ></div>
      <div
        style={midiNumbers.includes(45) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></div>
      <div
        className="absolute left-[28.24%]"
        style={midiNumbers.includes(46) ? blackKeyStyleOn : blackKeyStyleOff}
      ></div>
      <div
        style={midiNumbers.includes(47) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></div>
      <div
        style={midiNumbers.includes(48) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></div>
      <div
        className="absolute left-[32.08%]"
        style={midiNumbers.includes(49) ? blackKeyStyleOn : blackKeyStyleOff}
      ></div>
      <div
        style={midiNumbers.includes(50) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></div>
      <div
        className="absolute left-[34%]"
        style={midiNumbers.includes(51) ? blackKeyStyleOn : blackKeyStyleOff}
      ></div>
      <div
        style={midiNumbers.includes(52) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></div>
      <div
        style={midiNumbers.includes(53) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></div>
      <div
        className="absolute left-[37.84%]"
        style={midiNumbers.includes(54) ? blackKeyStyleOn : blackKeyStyleOff}
      ></div>
      <div
        style={midiNumbers.includes(55) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></div>
      <div
        className="absolute left-[39.76%]"
        style={midiNumbers.includes(56) ? blackKeyStyleOn : blackKeyStyleOff}
      ></div>
      <div
        style={midiNumbers.includes(57) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></div>
      <div
        className="absolute left-[41.68%]"
        style={midiNumbers.includes(58) ? blackKeyStyleOn : blackKeyStyleOff}
      ></div>
      <div
        style={midiNumbers.includes(59) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></div>
      <div
        style={midiNumbers.includes(60) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></div>
      <div
        className="absolute left-[45.52%]"
        style={midiNumbers.includes(61) ? blackKeyStyleOn : blackKeyStyleOff}
      ></div>
      <div
        style={midiNumbers.includes(62) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></div>
      <div
        className="absolute left-[47.44%]"
        style={midiNumbers.includes(63) ? blackKeyStyleOn : blackKeyStyleOff}
      ></div>
      <div
        style={midiNumbers.includes(64) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></div>
      <div
        style={midiNumbers.includes(65) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></div>
      <div
        className="absolute left-[51.28%]"
        style={midiNumbers.includes(66) ? blackKeyStyleOn : blackKeyStyleOff}
      ></div>
      <div
        style={midiNumbers.includes(67) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></div>
      <div
        className="absolute left-[53.3%]"
        style={midiNumbers.includes(68) ? blackKeyStyleOn : blackKeyStyleOff}
      ></div>
      <div
        style={midiNumbers.includes(69) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></div>
      <div
        className="absolute left-[55.17%]"
        style={midiNumbers.includes(70) ? blackKeyStyleOn : blackKeyStyleOff}
      ></div>
      <div
        style={midiNumbers.includes(71) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></div>
      <div
        style={midiNumbers.includes(72) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></div>
      <div
        className="absolute left-[59.07%]"
        style={midiNumbers.includes(73) ? blackKeyStyleOn : blackKeyStyleOff}
      ></div>
      <div
        style={midiNumbers.includes(74) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></div>
      <div
        className="absolute left-[60.95%]"
        style={midiNumbers.includes(75) ? blackKeyStyleOn : blackKeyStyleOff}
      ></div>
      <div
        style={midiNumbers.includes(76) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></div>
      <div
        style={midiNumbers.includes(77) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></div>
      <div
        className="absolute left-[64.84%]"
        style={midiNumbers.includes(78) ? blackKeyStyleOn : blackKeyStyleOff}
      ></div>
      <div
        style={midiNumbers.includes(79) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></div>
      <div
        className="absolute left-[66.72%]"
        style={midiNumbers.includes(80) ? blackKeyStyleOn : blackKeyStyleOff}
      ></div>
      <div
        style={midiNumbers.includes(81) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></div>
      <div
        className="absolute left-[68.62%]"
        style={midiNumbers.includes(82) ? blackKeyStyleOn : blackKeyStyleOff}
      ></div>
      <div
        style={midiNumbers.includes(83) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></div>
      <div
        style={midiNumbers.includes(84) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></div>
      <div
        className="absolute left-[72.5%]"
        style={midiNumbers.includes(85) ? blackKeyStyleOn : blackKeyStyleOff}
      ></div>
      <div
        style={midiNumbers.includes(86) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></div>
      <div
        className="absolute left-[74.44%]"
        style={midiNumbers.includes(87) ? blackKeyStyleOn : blackKeyStyleOff}
      ></div>
      <div
        style={midiNumbers.includes(88) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></div>
      <div
        style={midiNumbers.includes(89) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></div>
      <div
        className="absolute left-[78.25%]"
        style={midiNumbers.includes(90) ? blackKeyStyleOn : blackKeyStyleOff}
      ></div>
      <div
        style={midiNumbers.includes(91) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></div>
      <div
        className="absolute left-[80.2%]"
        style={midiNumbers.includes(92) ? blackKeyStyleOn : blackKeyStyleOff}
      ></div>
      <div
        style={midiNumbers.includes(93) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></div>
      <div
        className="absolute left-[82.12%]"
        style={midiNumbers.includes(94) ? blackKeyStyleOn : blackKeyStyleOff}
      ></div>
      <div
        style={midiNumbers.includes(95) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></div>
      <div
        style={midiNumbers.includes(96) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></div>
      <div
        className="absolute left-[85.96%]"
        style={midiNumbers.includes(97) ? blackKeyStyleOn : blackKeyStyleOff}
      ></div>
      <div
        style={midiNumbers.includes(98) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></div>
      <div
        className="absolute left-[87.88%]"
        style={midiNumbers.includes(99) ? blackKeyStyleOn : blackKeyStyleOff}
      ></div>
      <div
        style={midiNumbers.includes(100) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></div>
      <div
        style={midiNumbers.includes(101) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></div>
      <div
        className="absolute left-[91.72%]"
        style={midiNumbers.includes(102) ? blackKeyStyleOn : blackKeyStyleOff}
      ></div>
      <div
        style={midiNumbers.includes(103) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></div>
      <div
        className="absolute left-[93.64%]"
        style={midiNumbers.includes(104) ? blackKeyStyleOn : blackKeyStyleOff}
      ></div>
      <div
        style={midiNumbers.includes(105) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></div>
      <div
        className="absolute left-[95.55%]"
        style={midiNumbers.includes(106) ? blackKeyStyleOn : blackKeyStyleOff}
      ></div>
      <div
        style={midiNumbers.includes(107) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></div>
      <div
        style={midiNumbers.includes(108) ? whiteKeyStyleOn : whiteKeyStyleOff}
      ></div>
    </div>
  );
};

export default Piano;
