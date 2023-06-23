import React from "react";
import ImageForm from './components/ImageForm';
import VideoForm from "./components/VideoForm";

import "./index.css";

function ImageTool() {

  return (
    <div className="formWrap">
      <h3>图像生成工具</h3>
      <ImageForm />
      <h3>视频生成工具</h3>
      <VideoForm />
    </div>
  );
}

export default ImageTool;
