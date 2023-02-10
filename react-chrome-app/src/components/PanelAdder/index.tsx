import React, { useState } from "react";
import { Input, Button, Space } from 'antd';
import { PanelData } from "../../type";
import './index.css';

function PanelAdder({ setData }: { setData: Function }) {
  const [value, setValue] = useState('');

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValue(e.target.value);
  }

  return (
    <Space>
      <Input onChange={onChange} value={value} />
      <Button type="primary" onClick={() => {
        if (!value) {
          return;
        }
        setData((preVal: Array<PanelData>) => [...preVal, {
          title: value,
          list: []
        }]);
        setValue('');
      }}>添加分组</Button>
    </Space>
  );
}

export default PanelAdder;
