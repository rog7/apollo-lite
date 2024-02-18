import FireSymbol from "./FireSymbol";
import { fontFamily } from "../../utils/styles";
import { determineFontColor } from "../../utils/determineColors";

interface Props {
  setShowLoginStreakInfo: () => {};
  currentLoginStreak: number;
}

const LoginStreak = ({ setShowLoginStreakInfo, currentLoginStreak }) => {
  return (
    <div
      className="theme-transition"
      style={{
        display: "flex",
        gap: "8px",
        alignItems: "center",
        marginTop: "-15px",
        cursor: "pointer",
      }}
      onClick={() => setShowLoginStreakInfo(true)}
    >
      <FireSymbol width="16.8" height="24" />
      <div
        style={{
          fontFamily: fontFamily,
          color: determineFontColor(),
          fontSize: "20px",
          fontWeight: "700",
        }}
      >
        {currentLoginStreak}
      </div>
    </div>
  );
};

export default LoginStreak;
