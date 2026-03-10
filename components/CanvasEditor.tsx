"use client";

import React, { useRef, useState, useEffect } from "react";
import { Stage, Layer, Line, Image as KonvaImage, Text } from "react-konva";
import useImage from "use-image";
import { useLanguage } from "@/contexts/LanguageContext";

interface CanvasEditorProps {
    backgroundImageBase64?: string;
    shouldExport: boolean;
    onExport: (base64: string, hasDrawn: boolean, stickersUsed: number) => void;
}

interface DrawLine {
    tool: "pen" | "eraser";
    points: number[];
    color: string;
}

interface Sticker {
    id: string;
    text: string;
    x: number;
    y: number;
}

const STICKERS = ["🌟", "❤️", "😊", "🎈", "🌸", "🔥"];
const COLORS = ["#1C1C1A", "#FFFFFF", "#E53D00", "#FFB800", "#00B2A9"];

export default function CanvasEditor({ backgroundImageBase64, shouldExport, onExport }: CanvasEditorProps) {
    const { language } = useLanguage();
    const stageRef = useRef<any>(null);
    const [lines, setLines] = useState<DrawLine[]>([]);
    const [stickers, setStickers] = useState<Sticker[]>([]);
    const [isDrawing, setIsDrawing] = useState(false);
    const [tool, setTool] = useState<"pen" | "eraser">("pen");
    const [color, setColor] = useState(COLORS[0]);

    // Convert base64 background to HTML image
    const [bgImage] = useImage(backgroundImageBase64 || "");

    // Export logic triggered by parent
    useEffect(() => {
        if (shouldExport && stageRef.current) {
            const dataUrl = stageRef.current.toDataURL({ pixelRatio: 2 });
            const hasDrawn = lines.length > 0;
            const stickersUsed = stickers.length;
            onExport(dataUrl, hasDrawn, stickersUsed);
        }
    }, [shouldExport, onExport, lines.length, stickers.length]);

    const handleMouseDown = (e: any) => {
        if (e.target.name() === "sticker") return; // Don't draw if clicking on a sticker

        setIsDrawing(true);
        const pos = e.target.getStage().getPointerPosition();
        if (pos) {
            setLines([...lines, { tool, color, points: [pos.x, pos.y] }]);
        }
    };

    const handleMouseMove = (e: any) => {
        if (!isDrawing) return;

        const stage = e.target.getStage();
        const point = stage.getPointerPosition();

        if (point) {
            let lastLine = lines[lines.length - 1];
            // add point
            lastLine.points = lastLine.points.concat([point.x, point.y]);

            // replace last
            setLines([...lines.slice(0, lines.length - 1), lastLine]);
        }
    };

    const handleMouseUp = () => {
        setIsDrawing(false);
    };

    const addSticker = (text: string) => {
        setStickers([
            ...stickers,
            {
                id: Date.now().toString(),
                text,
                x: 150, // center roughly
                y: 150,
            }
        ]);
    };

    const handleClear = () => {
        setLines([]);
        setStickers([]);
    };

    const [stageSize, setStageSize] = useState({ width: 300, height: 300 });
    const containerRef = useRef<HTMLDivElement>(null);

    // Responsive Canvas
    useEffect(() => {
        const checkSize = () => {
            if (containerRef.current) {
                const width = containerRef.current.offsetWidth;
                setStageSize({ width, height: width }); // Keep it aspect square
            }
        };

        checkSize();
        window.addEventListener("resize", checkSize);
        return () => window.removeEventListener("resize", checkSize);
    }, []);

    return (
        <div className="flex flex-col gap-4 w-full">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-surface rounded-creator border-2 border-border mt-2">
                <div className="flex gap-4 items-center overflow-x-auto w-full pb-2 hide-scrollbar">
                    <button
                        onClick={() => setTool("pen")}
                        className={`min-h-[72px] min-w-[72px] text-3xl rounded-creator active:scale-[0.96] transition-transform flex items-center justify-center ${tool === "pen" ? "bg-signal text-ink" : "bg-canvas border-2 border-border"}`}
                        title="Pen"
                    >
                        ✏️
                    </button>
                    <button
                        onClick={() => setTool("eraser")}
                        className={`min-h-[72px] min-w-[72px] text-3xl rounded-creator active:scale-[0.96] transition-transform flex items-center justify-center ${tool === "eraser" ? "bg-signal text-ink" : "bg-canvas border-2 border-border"}`}
                        title="Eraser"
                    >
                        🧽
                    </button>

                    <div className="h-12 w-px bg-border mx-2 flex-shrink-0" />

                    {COLORS.map((c) => (
                        <button
                            key={c}
                            onClick={() => { setTool("pen"); setColor(c); }}
                            className={`min-h-[72px] min-w-[72px] rounded-full active:scale-[0.96] transition-transform border-4 ${color === c && tool === "pen" ? "border-signal shadow-md" : "border-border"}`}
                            style={{ backgroundColor: c }}
                        />
                    ))}
                </div>

                <div className="w-full flex justify-end mt-2">
                    <button onClick={handleClear} className="min-h-[72px] px-6 rounded-creator bg-canvas border-2 border-border font-bold text-ink active:scale-[0.96] transition-transform">
                        {language === "en" ? "Clear Canvas" : "Hapus Semua"}
                    </button>
                </div>
            </div>

            {/* Sticker Tray */}
            <div className="flex gap-4 overflow-x-auto pb-4 -mx-2 px-2 hide-scrollbar">
                {STICKERS.map((sticker) => (
                    <button
                        key={sticker}
                        onClick={() => addSticker(sticker)}
                        className="text-4xl hover:scale-105 active:scale-95 transition-transform bg-surface min-h-[72px] min-w-[72px] flex items-center justify-center rounded-creator border-2 border-border flex-shrink-0"
                    >
                        {sticker}
                    </button>
                ))}
            </div>

            {/* Canvas Area */}
            <div ref={containerRef} className="w-full aspect-square bg-white rounded-creator overflow-hidden border-2 border-border shadow-sm touch-none">
                <Stage
                    width={stageSize.width}
                    height={stageSize.height}
                    onMouseDown={handleMouseDown}
                    onTouchStart={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onTouchMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onTouchEnd={handleMouseUp}
                    ref={stageRef}
                >
                    <Layer>
                        {/* Background Layer: White rect for clean export */}
                        <KonvaImage image={undefined} x={0} y={0} width={stageSize.width} height={stageSize.height} fill="white" />

                        {/* Optional User Photo */}
                        {bgImage && (
                            <KonvaImage
                                image={bgImage}
                                width={stageSize.width}
                                height={stageSize.height}
                            />
                        )}

                        {/* Drawing Lines */}
                        {lines.map((line, i) => (
                            <Line
                                key={i}
                                points={line.points}
                                stroke={line.tool === "eraser" ? "#ffffff" : line.color}
                                strokeWidth={line.tool === "eraser" ? 20 : 5}
                                tension={0.5}
                                lineCap="round"
                                lineJoin="round"
                                globalCompositeOperation={
                                    line.tool === "eraser" ? "destination-out" : "source-over"
                                }
                            />
                        ))}

                        {/* Stickers */}
                        {stickers.map((sticker) => (
                            <Text
                                key={sticker.id}
                                text={sticker.text}
                                x={sticker.x}
                                y={sticker.y}
                                fontSize={40}
                                draggable
                                name="sticker"
                            />
                        ))}
                    </Layer>
                </Stage>
            </div>

            <p className="text-xs text-center text-muted">
                {language === "en" ? "Drag stickers to move them." : "Geser stiker untuk memindahkannya."}
            </p>
        </div>
    );
}
