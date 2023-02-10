import React, { useState, useEffect } from "react";
import { Button, QRCode, Collapse, Popconfirm, Input, Space } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import CodeList from "../CodeList";
import "./index.css";
import { PanelData } from "../../type";

const { Panel } = Collapse;

function CodePanels({
  data,
  setData,
  setValue,
}: {
  data: Array<PanelData>;
  setData: Function;
  setValue: Function;
}) {
  const onConfirm = (index: number) => {
    setData((preVal: Array<PanelData>) =>
      preVal.filter((item, idx) => idx !== index)
    );
  };

  const genExtra = (index: number) => (
    <Popconfirm
      title="删除确认"
      description="确认删除此组数据？"
      onConfirm={() => {
        onConfirm(index);
      }}
      okText="Yes"
      cancelText="No"
    >
      <DeleteOutlined
        onClick={(event) => {
          // If you don't want click extra trigger collapse, you can prevent this:
          event.stopPropagation();
        }}
      />
    </Popconfirm>
  );

  return (
    <Collapse>
      {data.map((item, index) => {
        const { title, list } = item;
        return (
          <Panel header={title} key={index} extra={genExtra(index)}>
            <CodeList
              setData={setData}
              index={index}
              list={list}
              setValue={setValue}
            />
          </Panel>
        );
      })}
    </Collapse>
  );
}

export default CodePanels;
