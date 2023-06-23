import React from "react";
import { Button, Form, Input, InputNumber, Select, message } from "antd";
import { createCanvas } from "../../utils";
import WebMWriter from "webm-writer";

const VideoForm = () => {
  const [form] = Form.useForm();

  const createVideo = ({
    width,
    height,
    text,
    fontSize,
    fontColor,
    bgColor,
    fileName,
    frameRate = 30,
    time = 60,
  }: {
    width: number;
    height: number;
    text: string;
    fontSize: number;
    fontColor: string;
    bgColor: string;
    fileName: string;
    frameRate: number;
    time: number;
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

      // 构造webm生成器
      const videoWriter = new WebMWriter({
        // 每秒30帧
        frameRate,
      });

      // 总共60帧canvas绘制
      const maxFrame = time * frameRate;

      // 这里要多一个frame,不然凑不到时间
      for (let index = 0; index < maxFrame + 1; index++) {
        videoWriter.addFrame(canvas);
      }
      videoWriter.complete().then(function (webMBlob: Blob | MediaSource) {
        const url = URL.createObjectURL(webMBlob);
        // blobUrl就是webM视频地址了，可播放，可下载
        // 6、下载
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName || "测试视频";
        a.click();
      });
    } catch (e) {
      message.error("生成失败，请联系作者Helios");
      console.log(e);
    }
  };

  const onFinish = (values: any) => {
    createVideo(values);
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
      <Form.Item name="time" rules={[{ required: true, message: "请输入时长" }]}>
        <Input
          style={{ width: 120, marginBottom: 20 }}
          placeholder="时长（秒）"
        />
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
      <Form.Item name="frameRate">
        <InputNumber
          style={{ width: 120, marginBottom: 20 }}
          placeholder="每秒帧数"
        />
      </Form.Item>
      <Form.Item>
        <Button style={{ width: 120, marginBottom: 20 }} htmlType="submit">
          生成视频
        </Button>
      </Form.Item>
    </Form>
  );
};

export default VideoForm;
