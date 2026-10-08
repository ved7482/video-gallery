// radhe radhe

import { useParams } from "react-router";
import videos from "../../db/videos.json";
import PopUp from "./PopUp";

function Video() {
  const { id } = useParams();
  const videoId = Number(id);

  const requestedVideo = videos.find((video) => video.id === videoId);

  if (!requestedVideo) return <h1>Hell nah!</h1>;

  return <PopUp vid={requestedVideo} />;
}

export default Video;
