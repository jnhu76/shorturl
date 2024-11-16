// src/components/common/CaptchaGenerator.tsx
'use client';

import { useEffect, useRef } from 'react';

interface CaptchaGeneratorProps {
  setCaptchaText: (text: string) => void;
  width: number;
  height: number;
}

export default function CaptchaGenerator({
  setCaptchaText,
  width,
  height,
}: CaptchaGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateCaptcha = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 清除画布
    ctx.clearRect(0, 0, width, height);

    // 设置背景
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, width, height);

    // 生成随机验证码
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    let captcha = '';
    for (let i = 0; i < 4; i++) {
      captcha += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaText(captcha);

    // 绘制文字
    ctx.font = '20px Arial';
    ctx.textBaseline = 'middle';

    // 为每个字符添加随机效果
    for (let i = 0; i < captcha.length; i++) {
      ctx.save();
      ctx.translate(22 * i + 10, height / 2);
      ctx.rotate((Math.random() - 0.5) * 0.3);
      ctx.fillStyle = `rgb(${Math.random() * 100},${Math.random() * 100},${Math.random() * 100})`;
      ctx.fillText(captcha[i], -6, 0);
      ctx.restore();
    }

    // 添加干扰线
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.strokeStyle = `rgba(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255},0.3)`;
      ctx.moveTo(Math.random() * width, Math.random() * height);
      ctx.lineTo(Math.random() * width, Math.random() * height);
      ctx.stroke();
    }

    // 添加干扰点
    for (let i = 0; i < 30; i++) {
      ctx.fillStyle = `rgba(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255},0.3)`;
      ctx.beginPath();
      ctx.arc(Math.random() * width, Math.random() * height, 1, 0, 2 * Math.PI);
      ctx.fill();
    }
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      onClick={generateCaptcha}
      style={{ cursor: 'pointer' }}
      title="点击刷新验证码"
    />
  );
}
