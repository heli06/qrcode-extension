import React, { useState } from "react";
import { Tabs } from 'antd';
import CodeTool from "./components/CodeTool";
import ImageTool from "./components/ImageTool";

import "./App.css";

function App() {
  const items = [
    {
      key: '1',
      label: `二维码管理`,
      children: <CodeTool />,
    },
    {
      key: '2',
      label: `图像和视频生成`,
      children: <ImageTool />,
    },
  ];

  return <div style={{ padding: 10 }}>
    <header>
      <h2 className="title-wrap">Helios的开发/测试提效工具</h2>
    </header>
    <Tabs defaultActiveKey="1" items={items} />
  </div>;
}

export default App;
