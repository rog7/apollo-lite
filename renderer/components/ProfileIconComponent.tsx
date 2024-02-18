interface Props {
  profileImageUrl: string;
}
const ProfileIconComponent = ({ profileImageUrl }) => {
  return (
    <div
      style={{
        width: "75px",
        height: "75px",
        borderRadius: "50%",
        overflow: "hidden",
      }}
    >
      <img
        style={{
          objectFit: "cover",
          borderRadius: "50%",
          width: "100%",
          height: "100%",
          display: "block",
          maxWidth: "100%",
          cursor: "pointer",
        }}
        src={profileImageUrl}
      />
    </div>
  );
};

export default ProfileIconComponent;
