"use client";

import React, { useState } from "react";
import { Download, Loader2 } from "lucide-react";

interface PosterDownloadProps {
  title: string;
  category: string;
  description: string;
  startingPrice: number | null;
  priceUnit: string | null;
  location: string;
  contactNumbers: string[];
  portfolioUrl: string;
}

export default function PosterDownload({
  title,
  category,
  description,
  startingPrice,
  priceUnit,
  location,
  contactNumbers,
  portfolioUrl,
}: PosterDownloadProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  // Helper function to wrap text on canvas
  const wrapText = (
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    lineHeight: number,
    align: "left" | "center" = "left",
  ): number => {
    const words = text.split(" ");
    let line = "";
    let currentY = y;

    ctx.textAlign = align;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + " ";
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line.trim(), x, currentY);
        line = words[n] + " ";
        currentY += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line.trim(), x, currentY);
    return currentY + lineHeight;
  };

  const generateAndDownloadPoster = async () => {
    setIsGenerating(true);

    try {
      const canvas = document.createElement("canvas");
      // High-res poster dimension (800 x 1120 px)
      canvas.width = 800;
      canvas.height = 1120;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        throw new Error("Could not construct 2D context");
      }

      // 1. Draw Background Gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 800, 1120);
      bgGrad.addColorStop(0, "#020617"); // Slate-950
      bgGrad.addColorStop(0.5, "#0f172a"); // Slate-900
      bgGrad.addColorStop(1, "#172554"); // Blue-950
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, 800, 1120);

      // 2. Draw Decorative Glow Circles
      ctx.fillStyle = "rgba(59, 130, 246, 0.08)"; // Blue highlight
      ctx.beginPath();
      ctx.arc(0, 0, 300, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "rgba(168, 85, 247, 0.06)"; // Purple highlight
      ctx.beginPath();
      ctx.arc(800, 1120, 300, 0, Math.PI * 2);
      ctx.fill();

      // 3. Draw Top Header: Logo Icon & Title
      // Logo BG
      ctx.fillStyle = "#3b82f6";
      ctx.beginPath();
      ctx.roundRect(60, 60, 48, 48, 12);
      ctx.fill();

      // Logo icon representation (draw two overlapping small circles/diamonds)
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 28px system-ui, sans-serif";
      ctx.fillText("K", 73, 94); // Place 'K' inside icon

      // App Brand Name text
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 30px system-ui, sans-serif";
      ctx.textAlign = "left";
      ctx.fillText("Kaamao Connect", 125, 94);

      // Category Tag Box on the Right
      ctx.fillStyle = "rgba(255, 255, 255, 0.07)";
      ctx.beginPath();
      ctx.roundRect(500, 66, 240, 36, 8);
      ctx.fill();

      ctx.fillStyle = "#94a3b8"; // slate-400
      ctx.font = "bold 14px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(category.toUpperCase(), 620, 89);

      // Header border line
      ctx.strokeStyle = "rgba(255, 255, 255, 0.06)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(60, 136);
      ctx.lineTo(740, 136);
      ctx.stroke();

      // 4. Draw Center Content: Title, Price Badge, Description, Location
      // Service Title
      ctx.fillStyle = "#ffffff";
      ctx.font = "900 44px system-ui, sans-serif";
      ctx.textAlign = "center";
      const titleEndY = wrapText(ctx, title, 400, 240, 680, 56, "center");

      // Starting price badge (if exists)
      let priceEndY = titleEndY + 20;
      if (startingPrice) {
        const priceLabel = `STARTING AT ₹${startingPrice}${priceUnit ? ` / ${priceUnit.toUpperCase()}` : ""}`;
        ctx.font = "bold 18px system-ui, sans-serif";
        const priceTextWidth = ctx.measureText(priceLabel).width;

        // Draw badge box
        ctx.fillStyle = "rgba(59, 130, 246, 0.12)";
        ctx.strokeStyle = "rgba(59, 130, 246, 0.25)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(
          400 - priceTextWidth / 2 - 16,
          titleEndY + 12,
          priceTextWidth + 32,
          40,
          12,
        );
        ctx.fill();
        ctx.stroke();

        // Write price text
        ctx.fillStyle = "#60a5fa"; // blue-400
        ctx.textAlign = "center";
        ctx.fillText(priceLabel, 400, titleEndY + 38);
        priceEndY = titleEndY + 76;
      }

      // Detailed Description
      ctx.fillStyle = "#cbd5e1"; // slate-300
      ctx.font = "500 21px system-ui, sans-serif";
      const descEndY = wrapText(
        ctx,
        description,
        400,
        priceEndY + 20,
        640,
        34,
        "center",
      );

      // Location
      ctx.fillStyle = "#ef4444"; // red-500
      ctx.font = "bold 20px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("📍 " + location, 400, descEndY + 20);

      // 5. Draw Bottom Divider
      ctx.strokeStyle = "rgba(255, 255, 255, 0.06)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(60, 840);
      ctx.lineTo(740, 840);
      ctx.stroke();

      // 6. Async Load QR Code image and render it
      const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
        portfolioUrl,
      )}`;

      await new Promise<void>((resolve) => {
        const qrImage = new Image();
        qrImage.crossOrigin = "anonymous"; // Essential to avoid "tainted canvas" error
        qrImage.src = qrCodeUrl;

        qrImage.onload = () => {
          // White board for QR code
          ctx.fillStyle = "#ffffff";
          ctx.beginPath();
          ctx.roundRect(580, 880, 160, 160, 18);
          ctx.fill();

          // Draw QR Code image
          ctx.drawImage(qrImage, 595, 895, 130, 130);
          resolve();
        };

        qrImage.onerror = (err) => {
          console.error("QR Code image fetch failed:", err);
          // Fallback: draw placeholder white box with QR text inside
          ctx.fillStyle = "#ffffff";
          ctx.beginPath();
          ctx.roundRect(580, 880, 160, 160, 18);
          ctx.fill();
          ctx.fillStyle = "#0f172a";
          ctx.font = "bold 18px sans-serif";
          ctx.textAlign = "center";
          ctx.fillText("QR Code", 660, 960);
          resolve(); // Resolve anyway to proceed download
        };
      });

      // 7. Write Contact details at the bottom-left
      ctx.textAlign = "left";
      ctx.fillStyle = "#60a5fa"; // blue-400
      ctx.font = "bold 15px system-ui, sans-serif";
      ctx.fillText("📞 CONTACT PROVIDER", 60, 895);

      ctx.fillStyle = "#ffffff";
      ctx.font = "900 28px system-ui, sans-serif";
      const activeContacts =
        contactNumbers && contactNumbers.length > 0 ? contactNumbers : ["-"];
      activeContacts.slice(0, 2).forEach((num, idx) => {
        ctx.fillText(num, 60, 938 + idx * 40);
      });

      // 8. Draw CTA Banner Footer
      ctx.fillStyle = "rgba(255, 255, 255, 0.04)";
      ctx.beginPath();
      ctx.roundRect(60, 1022, 500, 38, 8);
      ctx.fill();

      ctx.fillStyle = "#94a3b8";
      ctx.font = "bold 14px system-ui, sans-serif";
      ctx.fillText("Scan QR to view public portfolio page", 76, 1046);

      ctx.fillStyle = "#60a5fa";
      ctx.font = "bold 14px system-ui, sans-serif";
      ctx.textAlign = "right";
      ctx.fillText("BOOK NOW", 544, 1046);

      // 9. Save Canvas to DataURL & Trigger Download
      const dataUrl = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      const cleanTitle = title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      downloadLink.download = `${cleanTitle}-poster.png`;
      downloadLink.href = dataUrl;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    } catch (error) {
      console.error("Poster download error:", error);
      alert("Failed to download poster. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <button
      onClick={generateAndDownloadPoster}
      disabled={isGenerating}
      className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-extrabold text-sm rounded-xl transition cursor-pointer active:scale-98 shadow-lg shadow-blue-500/10"
    >
      {isGenerating ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Generating Poster...</span>
        </>
      ) : (
        <>
          <Download className="h-4 w-4" />
          <span>Download Poster PNG</span>
        </>
      )}
    </button>
  );
}
