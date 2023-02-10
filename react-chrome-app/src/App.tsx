import React, { useState, useEffect } from "react";
import { Button, QRCode, Collapse, Popconfirm, Input } from 'antd';
import { QRCODE_KEY } from "./const";
import { Cache } from "./utils";
import PanelAdder from "./components/PanelAdder";
import CodePanels from "./components/CodePanels";

import { PanelData } from "./type";
import './App.css';

const { Panel } = Collapse;

function App() {
  // 所有分组的二维码数组
  const [data, setData] = useState<Array<PanelData>>([]);
  // 二维码链接
  const [value, setValue] = useState('');

  // 初次载入，从本地读数据
  useEffect(() => {

  }, []);

  return (
    <div>
      <header>
        <h2>Hello From Helios Qrcode Extension</h2>
      </header>
      <div className="qrcode-wrap">
        {value ? <QRCode value={value} /> : <div>请选择要展示的二维码</div>}
      </div>
      <div className="add-panel-wrap">
        <PanelAdder setData={setData}/>
      </div>
      <div className="panel-wrap">
        <CodePanels data={data} setData={setData} />
      </div>
    </div>
  );
}

export default App;
