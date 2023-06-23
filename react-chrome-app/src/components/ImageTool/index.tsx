import React, { useState, useEffect } from "react";
import { Button, Form, Input, InputNumber, Select, message } from "antd";
import Whammy from "whammy";
import "./index.css";

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

const { Option } = Select;

function ImageTool() {
  const [imageForm] = Form.useForm();
  const [videoForm] = Form.useForm();

  const createVideo = () => {
    // 创建一个空白的 Canvas 元素
    const canvas = document.createElement("canvas");
    canvas.width = 640; // 设置宽度
    canvas.height = 480; // 设置高度

    // 获取 Canvas 2D 上下文
    const ctx = canvas.getContext("2d");

    // 绘制文本到 Canvas 上
    if (ctx) {
      ctx.font = "bold 48px Arial"; // 设置字体样式
      ctx.fillStyle = "white"; // 设置文本颜色
      ctx.textAlign = "center"; // 设置文本对齐方式
      ctx.textBaseline = "middle";
      ctx.fillText("Hello, World!", canvas.width / 2, canvas.height / 2); // 绘制文本
    }

    // 创建 MediaStream 对象
    const stream = canvas.captureStream();

    // 创建 MediaRecorder 对象
    const recorder = new MediaRecorder(stream, {
      mimeType: "video/webm; codecs=vp9", // 设置编码格式
      videoBitsPerSecond: 1000000, // 设置比特率
    });

    // 创建数据存储数组
    const chunks: BlobPart[] | undefined = [];

    // 监听数据可用事件
    recorder.addEventListener("dataavailable", (event) => {
      chunks.push(event.data);
    });

    // 监听录制结束事件
    recorder.addEventListener("stop", () => {
      const blob = new Blob(chunks, { type: "video/webm" }); // 创建 Blob 对象
      const url = URL.createObjectURL(blob); // 将 Blob 对象转换为 URL

      const video = document.createElement("video"); // 创建 video 元素并设置 URL
      video.src = url;

      // 创建下载链接
      const link = document.createElement("a");
      link.download = "video.webm"; // 设置文件名
      link.href = url;

      // 触发下载
      link.click();
    });

    // 开始录制
    recorder.start();
  };

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
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = width || 500; // 指定宽度
      canvas.height = height || 300; // 指定高度

      if (!ctx) {
        message.error("生成失败，请联系作者Helios");
        return;
      }

      // // 绘制背景
      ctx.fillStyle = bgColor || "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 绘制文本
      const defaultFontSize = Math.max(
        Math.min(canvas.width / 10, canvas.height / 10),
        12
      );
      const finFontSize = fontSize || defaultFontSize;
      const font = `${finFontSize}px sans-serif`;
      ctx.font = font;

      const defaultText = `宽度：${width}，高度：${height}，大小：${size}${unit}`;

      const finText = text || defaultText;
      const textWidth = ctx.measureText(finText).width;

      const x = (canvas.width - textWidth) / 2;
      const y = canvas.height / 2 + finFontSize / 2;

      ctx.fillStyle = fontColor || "#000000";
      ctx.fillText(finText, x, y);
      const targetSize = size * Math.pow(base, unitMap[unit]);

      canvas.toBlob((blob) => {
        if (blob === null) {
          return;
        }
        const { size } = blob;
        const remaining = targetSize - size;

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
      console.log(e);
    }
  };

  const onFinish = (values: any) => {
    console.log("values", values);
    createImage(values);
  };

  return (
    <div className="formWrap">
      <Form form={imageForm} onFinish={onFinish} layout="inline">
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
        <Form.Item name="text">
          <Input style={{ width: 120, marginBottom: 20 }} placeholder="文案" />
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
          <Input
            style={{ width: 120, marginBottom: 20 }}
            placeholder="背景色"
          />
        </Form.Item>
        <Form.Item name="fileName">
          <Input
            style={{ width: 120, marginBottom: 20 }}
            placeholder="文件名"
          />
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
      {/* <Button onClick={() => { createImage() }}>生成图片</Button> */}
      <Button
        onClick={() => {
          createVideo();
        }}
      >
        生成视频
      </Button>
    </div>
  );
}

export default ImageTool;
