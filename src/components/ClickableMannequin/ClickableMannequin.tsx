import React, { useRef, useEffect, useState, useMemo } from 'react';
import { Joints } from './Joints';


interface Circle {
  id: string;
  x: number;
  y: number;
  isSelected?: boolean;
  number?: number;
}

interface Point {
  x: number;
  y: number;
}


interface ClickableMannequinProps {
  order: string[];
  setOrder: React.Dispatch<React.SetStateAction<string[]>>;
  id_prefix:string;
}

export const ClickableMannequin: React.FC<ClickableMannequinProps> = ({ order, setOrder, id_prefix }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const radius = 12;

  const circles: Circle[] = useMemo(() => {
    return Joints.map((x) => ({
      id: id_prefix + "_" + x.id,
      x: x.x / 4,
      y: x.y / 4,
      isSelected: order.includes(id_prefix + "_" + x.id),
      number: order.findIndex((y) => y === id_prefix + "_" + x.id) + 1,
    }));
  }, [order]);

  const toggle = (id: string): void => {
    setOrder((prevOrder) =>
      prevOrder.includes(id) ? prevOrder.filter((y) => y !== id) : [...prevOrder, id]
    );
  };

  const [backgroundImage, setBackgroundImage] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    const loadBackground = async () => {
      try {
        const img = await loadImage('/CRISP/Mannequin_large_old_quarter.jpg');
        setBackgroundImage(img);
      } catch (error) {
        console.error('Error loading background image:', error);
      }
    };
    loadBackground();
  }, []);

  async function loadImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = url;
    });
  }

  const drawCircles = (ctx: CanvasRenderingContext2D, img: HTMLImageElement | null) => {
    if (!img) return;

    const fluentProvider = document.querySelector('.fui-FluentProvider') as HTMLElement | null;
    const font = fluentProvider
      ? window.getComputedStyle(fluentProvider).font
      : '12px Arial';
    const color = fluentProvider
      ? window.getComputedStyle(fluentProvider).getPropertyValue('--colorBrandBackgroundStatic') || 'black'
      : 'black';

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    ctx.drawImage(img, 0, 0);

    circles.forEach((circle) => {
      ctx.beginPath();
      ctx.arc(circle.x, circle.y, radius, 0, 2 * Math.PI, false);
      ctx.fillStyle = circle.isSelected ? color : 'black';
      ctx.fill();

      if (circle.number !== undefined && circle.isSelected) {
        ctx.fillStyle = 'white';
        ctx.font = font;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(circle.number.toString(), circle.x, circle.y);
      }
    });
  };

  const isIntersect = (point: Point, circle: Circle): boolean => {
    const dx = point.x - circle.x;
    const dy = point.y - circle.y;
    return dx * dx + dy * dy < radius * radius;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    drawCircles(ctx, backgroundImage);
  }, [circles, backgroundImage]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mousePos: Point = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };

      for (const circle of circles) {
        if (isIntersect(mousePos, circle)) {
          toggle(circle.id);
          break;
        }
      }
    };

    canvas.addEventListener('click', handleClick);

    return () => {
      canvas.removeEventListener('click', handleClick);
    };
  }, [circles]);

  return (
    <canvas
      ref={canvasRef}
      width={363}
      height={450}
      style={{ borderRadius: "12px" }}
    />
  );
};
