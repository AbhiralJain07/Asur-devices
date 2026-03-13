"use client";
import React from "react";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import Image from "next/image";

export function SmartCityScrollDemo() {
  return (
    <div className="flex flex-col overflow-hidden pb-[500px] pt-[1000px] bg-black">
      <ContainerScroll
        titleComponent={
          <>
            <h1 className="text-4xl font-bold text-white mb-4">
              Experience the Future of
            </h1>
            <span className="text-5xl md:text-[7rem] font-bold mt-1 leading-none bg-gradient-to-r from-neon-blue via-neon-cyan to-neon-green bg-clip-text text-transparent">
              Smart Cities
            </span>
            <p className="text-xl text-gray-300 mt-6 max-w-3xl mx-auto">
              Advanced AI-powered urban management with real-time monitoring and predictive analytics
            </p>
          </>
        }
      >
        <div className="relative h-full w-full">
          <Image
            src={`https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1400&h=720&fit=crop`}
            alt="Smart City Dashboard"
            height={720}
            width={1400}
            className="mx-auto rounded-2xl object-cover h-full w-full"
            draggable={false}
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent rounded-2xl"></div>
        </div>
      </ContainerScroll>
    </div>
  );
}
