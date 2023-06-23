import React from "react";
import { Button, Form, Input, InputNumber, Select, message } from "antd";
import { createCanvas } from "../../utils";

const { Option } = Select;

enum Unit {
  B = "B",
  KB = "KB",
  MB = "MB",
}

enum Base {
  BAD = 1000,
  GOOD = 1024,
}

const unitMap = {
  [Unit.B]: 0,
  [Unit.KB]: 1,
  [Unit.MB]: 2,
};

const ImageForm = () => {
  const [form] = Form.useForm();

  const createImage = ({
    width,
    height,
    text,
    size,
    unit,
    base,
    fontSize,
    fontColor,
    bgColor,
    fileName,
    fileType,
  }: {
    width: number;
    height: number;
    text: string;
    size: number;
    unit: Unit;
    base: Base;
    fontSize: number;
    fontColor: string;
    bgColor: string;
    fileName: string;
    fileType: string;
  }) => {
    try {
      const canvas = createCanvas({
        width,
        height,
        text,
        fontSize,
        fontColor,
        bgColor,
      });

      if (!canvas) {
        message.error("生成失败，请联系作者Helios");
        return;
      }

      canvas.toBlob((blob) => {
        if (blob === null) {
          return;
        }
        const { size: curSize } = blob;
        const targetSize = size * Math.pow(base, unitMap[unit]);
        const remaining = targetSize - curSize;

        if (remaining < 0) {
          return;
        }
        // 2、获取到 canvas 二进制数据
        blob.arrayBuffer().then((buf) => {
          // 4、生成指定大小的二进制数据
          const padding = new ArrayBuffer(remaining);
          const longInt8View = new Uint8Array(padding);
          for (var i = 0; i < longInt8View.length; i++) {
            longInt8View[i] = i % 255;
          }
          // 5、拼接图片与空文件
          const file = new Blob([buf, padding]);
          // 6、下载
          const url = URL.createObjectURL(file);
          const a = document.createElement("a");
          const randomString = Math.random().toString(36).substring(2, 8);
          a.download = `${fileName || "测试图片"}${
            fileName ? "" : randomString
          }.${fileType || ".jpg"}`;
          a.href = url;
          a.click();
        });
      });
    } catch (e) {
      message.error("生成失败，请联系作者Helios");
      console.log(e);
    }
  };

  const onFinish = (values: any) => {
    createImage(values);
  };

  return (
    <Form form={form} onFinish={onFinish} layout="inline">
      <Form.Item
        name="width"
        rules={[{ required: true, message: "请输入宽度" }]}
      >
        <InputNumber
          min={0}
          style={{ width: 120, marginBottom: 20 }}
          placeholder="宽度（必填）"
        />
      </Form.Item>
      <Form.Item
        name="height"
        rules={[{ required: true, message: "请输入高度" }]}
      >
        <InputNumber
          min={0}
          style={{ width: 120, marginBottom: 20 }}
          placeholder="高度（必填）"
        />
      </Form.Item>
      <Form.Item
        name="size"
        rules={[{ required: true, message: "请输入图片大小" }]}
      >
        <InputNumber
          style={{ width: 120, marginBottom: 20 }}
          placeholder="大小（必填）"
        />
      </Form.Item>
      <Form.Item name="unit" initialValue="MB">
        <Select style={{ width: 120, marginBottom: 20 }}>
          <Option value="MB">单位(MB)</Option>
          <Option value="KB">单位(KB)</Option>
          <Option value="B">单位(B)</Option>
        </Select>
      </Form.Item>
      <Form.Item name="base" initialValue={1000}>
        <Select style={{ width: 120, marginBottom: 20 }}>
          <Option value={1000}>进制(1000)</Option>
          <Option value={1024}>进制(1024)</Option>
        </Select>
      </Form.Item>
      <Form.Item name="text">
        <Input style={{ width: 120, marginBottom: 20 }} placeholder="文案" />
      </Form.Item>
      <Form.Item name="fontSize">
        <InputNumber
          min={0}
          style={{ width: 120, marginBottom: 20 }}
          placeholder="字体大小"
        />
      </Form.Item>
      <Form.Item name="fontColor">
        <Input
          style={{ width: 120, marginBottom: 20 }}
          placeholder="字体颜色"
        />
      </Form.Item>
      <Form.Item name="bgColor">
        <Input style={{ width: 120, marginBottom: 20 }} placeholder="背景色" />
      </Form.Item>
      <Form.Item name="fileName">
        <Input style={{ width: 120, marginBottom: 20 }} placeholder="文件名" />
      </Form.Item>
      <Form.Item name="fileType">
        <Input
          style={{ width: 120, marginBottom: 20 }}
          placeholder="文件类型"
        />
      </Form.Item>
      <Form.Item>
        <Button style={{ width: 120, marginBottom: 20 }} htmlType="submit">
          生成图片
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ImageForm;
