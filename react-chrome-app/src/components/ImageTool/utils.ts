import { message } from "antd";

export const createCanvas = ({
    width,
    height,
    text,
    fontSize,
    fontColor,
    bgColor,
  }: {
    width: number;
    height: number;
    text: string;
    fontSize: number;
    fontColor: string;
    bgColor: string;
  }) => {
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

      const defaultText = `宽度：${width}，高度：${height}`;

      const finText = text || defaultText;
      const textWidth = ctx.measureText(finText).width;

      const x = (canvas.width - textWidth) / 2;
      const y = canvas.height / 2 + finFontSize / 2;

      ctx.fillStyle = fontColor || "#000000";
      ctx.fillText(finText, x, y);
      return canvas;
  }