"use client";
import React, { useRef } from "react";
import { useScroll, useTransform, motion, MotionValue } from "framer-motion";

export const ContainerScroll = ({
  titleComponent,
  children,
}: {
  titleComponent: string | React.ReactNode;
  children: React.ReactNode;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  const scaleDimensions = () => {
    return isMobile ? [0.8, 0.95] : [1.02, 0.98];
  };

  // Enhanced smooth rotation with easing
  const rotate = useTransform(
    scrollYProgress, 
    [0, 0.2, 0.8, 1], 
    [15, 8, 2, 0],
    {
      ease: [0.25, 0.1, 0.25, 1] // Custom cubic-bezier for smoothness
    }
  );
  
  // Enhanced smooth scaling with easing
  const scale = useTransform(
    scrollYProgress, 
    [0, 0.3, 0.7, 1], 
    scaleDimensions(),
    {
      ease: [0.25, 0.1, 0.25, 1] // Custom cubic-bezier for smoothness
    }
  );
  
  // Enhanced smooth translation with easing
  const translate = useTransform(
    scrollYProgress, 
    [0, 0.4, 0.6, 1], 
    [0, -30, -70, -120],
    {
      ease: [0.25, 0.1, 0.25, 1] // Custom cubic-bezier for smoothness
    }
  );

  return (
    <div
      className="h-[60rem] md:h-[80rem] flex items-center justify-center relative p-2 md:p-20"
      ref={containerRef}
    >
      <div
        className="py-10 md:py-40 w-full relative"
        style={{
          perspective: "1200px", // Increased perspective for smoother 3D effect
        }}
      >
        <Header translate={translate} titleComponent={titleComponent} />
        <Card rotate={rotate} translate={translate} scale={scale}>
          {children}
        </Card>
      </div>
    </div>
  );
};

export const Header = ({ translate, titleComponent }: any) => {
  return (
    <motion.div
      style={{
        translateY: translate,
      }}
      className="div max-w-5xl mx-auto text-center"
    >
      {titleComponent}
    </motion.div>
  );
};

export const Card = ({
  rotate,
  scale,
  children,
}: {
  rotate: MotionValue<number>;
  scale: MotionValue<number>;
  translate: MotionValue<number>;
  children: React.ReactNode;
}) => {
  return (
    <motion.div
      style={{
        rotateX: rotate,
        scale,
        boxShadow:
          "0 0 #0000004d, 0 9px 20px #0000004a, 0 37px 37px #00000042, 0 84px 50px #00000026, 0 149px 60px #0000000a, 0 233px 65px #00000003",
      }}
      className="max-w-5xl -mt-12 mx-auto h-[30rem] md:h-[40rem] w-full border-4 border-[#6C6C6C] p-2 md:p-6 bg-[#222222] rounded-[30px] shadow-2xl"
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 20,
        mass: 1
      }}
    >
      <div className=" h-full w-full  overflow-hidden rounded-2xl bg-gray-100 dark:bg-zinc-900 md:rounded-2xl md:p-4 transition-all duration-500">
        {children}
      </div>
    </motion.div>
  );
};
