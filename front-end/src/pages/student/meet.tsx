"use client";

import { useParams } from "react-router-dom";
import VideoConference from "../../components/volunteer/VideoConference";

const MeetPage = () => {
  const { roomId } = useParams<{ roomId: string }>();

  

  return (
    <div className="h-screen w-full overflow-hidden">
      <VideoConference roomID={roomId || ""} />
    </div>
  );
};

export default MeetPage;
