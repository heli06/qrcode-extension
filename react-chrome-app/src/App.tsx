import React, { useState, useEffect } from "react";
import { Button, message, QRCode, Space, Modal, Input } from "antd";
import { QRCODE_KEY } from "./const";
import { Cache } from "./utils";
import PanelAdder from "./components/PanelAdder";
import CodePanels from "./components/CodePanels";

import { PanelData } from "./type";
import "./App.css";

const { TextArea } = Input;

// 是否是初次载入
let isInit = true;

function App() {
  // 所有分组的二维码数组
  const [data, setData] = useState<Array<PanelData>>([]);
  // 二维码链接
  const [value, setValue] = useState("");
  // 导入数据对话框
  const [isModalOpen, setIsModalOpen] = useState(false);
  // 导入数据
  const [importedData, setImportedData] = useState("");

  const handleOk = () => {
    if (!importedData) {
      message.error('导入数据不得为空');
      return;
    }
    let newData = [];
    try {
      newData = JSON.parse(importedData);
    } catch (e) {
      message.error('导入数据有误');
      console.log(e);
    }
    Cache.setCache(QRCODE_KEY, newData);
    setData(newData);
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setImportedData(e.target.value);
  };

  console.log(data);
  // 初次载入，从本地读数据
  useEffect(() => {
    const preData = Cache.getCache(QRCODE_KEY);
    if (preData && preData?.length > 0) {
      setData(preData);
    }
  }, []);

  // 每次data变化，就把数据写入本地
  useEffect(() => {
    if (isInit) {
      isInit = false;
    } else {
      Cache.setCache(QRCODE_KEY, data);
    }
  }, [data]);

  return (
    <div>
      <header>
        <h2 className="title-wrap">Helios的二维码管理工具</h2>
      </header>
      <div className="action-wrap">
        <div className="qrcode-wrap">
          {value ? <QRCode value={value} /> : <div>请选择要展示的二维码</div>}
        </div>
        <div className="button-wrap">
          <div className="button-group-wrap">
            <Space>
              <Button
                type="primary"
                onClick={() => {
                  setIsModalOpen(true);
                }}
              >
                导入数据
              </Button>
              <Button
                onClick={async () => {
                  const data = Cache.getCache(QRCODE_KEY);
                  let formatedData = '';
                  try {
                    formatedData = JSON.stringify(data)
                  } catch (e) {
                    message.error('导出数据失败');
                    console.log(e);
                  }

                  await navigator.clipboard.writeText(formatedData);
                  message.success("已经复制到剪贴板");
                }}
              >
                导出数据
              </Button>
            </Space>
          </div>
          <div className="add-panel-wrap">
            <PanelAdder setData={setData} />
          </div>
        </div>
        </div>
      <div className="panel-wrap">
        <CodePanels data={data} setData={setData} setValue={setValue} />
      </div>
      <Modal
        title="导入数据"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="导入数据"
        cancelText="取消导入"
      >
        <TextArea
          rows={4}
          placeholder="将JSON格式数据粘贴到这里"
          value={importedData}
          onChange={onChange}
        />
      </Modal>
    </div>
  );
}

export default App;
