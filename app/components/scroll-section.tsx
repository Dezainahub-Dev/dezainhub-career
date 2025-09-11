"use client";

import { useRef } from "react";
import {
  Layers,
  FileText,
  Pen,
  Code,
  ClipboardCheck,
  Rocket,
} from "lucide-react";

import { motion, useScroll, useSpring, useTransform } from "framer-motion";

export default function ProcessTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,

    offset: ["start end", "end center"],
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,

    damping: 30,

    restDelta: 0.001,
  });

  const targetScales = steps.map((_, index) =>
    useTransform(
      scrollYProgress,

      [index / steps.length, (index + 1) / steps.length],

      [0.8, 1]
    )
  );

  const targetOpacities = steps.map((_, index) =>
    useTransform(
      scrollYProgress,

      [index / steps.length, (index + 1) / steps.length],

      [0.3, 1]
    )
  );

  const dotScales = steps.map((_, index) =>
    useTransform(
      scrollYProgress,

      [index / steps.length, (index + 1) / steps.length],

      [1, 1.5]
    )
  );

  const dotColors = steps.map((_, index) =>
    useTransform(
      scrollYProgress,

      [index / steps.length, (index + 1) / steps.length],

      ["#25c3ec", "#25c3ec"]
    )
  );

  const stepColors = steps.map((_, index) =>
    useTransform(
      scrollYProgress,

      [index / steps.length, (index + 1) / steps.length],

      ["#002a3f", "#0c4a6e"]
    )
  );

  return (
    <div className="min-h-screen font-Manrope text-white p-4 md:p-16">
      <h1 className="text-4xl md:text-5xl font-bold text-center mb-16">
        Our Process
      </h1>

      <div ref={containerRef} className="max-w-6xl mx-auto relative">
        {/* Inactive dotted line */}

        <div className="absolute left-2 md:left-1/2 transform -translate-x-1/2 h-full w-px border-l border-dashed border-blue-500/20" />

        {/* Active line */}

        <motion.div
          className="absolute left-2 md:left-1/2 transform -translate-x-1/2 h-full w-px bg-primary_light_blue"
          style={{
            scaleY,

            transformOrigin: "top",
          }}
        >
          <div className="sticky top-1/2">
            <div className="h-full w-full bg-gradient-to-b from-primary_light_blue via-primary_light_blue to-primary_light_blue" />
          </div>
        </motion.div>

        {/* Timeline items */}

        <div className="space-y-40">
          {steps.map((step, index) => {
            const targetScale = targetScales[index];

            const targetOpacity = targetOpacities[index];

            const dotScale = dotScales[index];

            const dotColor = dotColors[index];

            const stepColor = stepColors[index];

            return (
              <motion.div
                key={step.title}
                className="relative !mt-12"
                style={{
                  scale: targetScale,

                  opacity: targetOpacity,
                }}
              >
                {/* Timeline dot */}

                <motion.div
                  className="absolute left-1 md:left-[49.6%]  top-1/2 transform -translate-x-0 md:-translate-x-1/2  -translate-y-0 md:-translate-y-1/2 w-3 h-3 bg-blue-500 rounded-full z-10 "
                  style={{
                    scale: dotScale,

                    backgroundColor: dotColor,
                  }}
                />

                {/* Content card */}

                <div
                  className={`

                  flex items-center min-w-[300px] md:min-w-[300px] xl:min-w-[560px]

                  ${
                    step.align === "left"
                      ? "flex-row-revers ml-10 md:ml-0 md:mr-[calc(50%+20px)] justify-start"
                      : "ml-10 md:ml-[calc(50%+20px)] justify-start md:justify-end"
                  }

                  md:w-[calc(50%-40px)]

                `}
                >
                  <motion.div
                    className="bg-[#001a2c] bg-[radial-gradient(153.71%_117.75%_at_100%_0%,_#01222E_0%,_#021921_100%)]   rounded-[24px] p-6 flex-1 backdrop-blur-sm  w-full  border-[1px] border-hero_section_border"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <div
                      className={`flex  flex-col  gap-4 ${
                        step.align === "left"
                          ? "items-start md:items-end"
                          : "items-start"
                      }`}
                    >
                      <motion.div
                        className="p-4 bg-[radial-gradient(153.71%_117.75%_at_100%_0%,_#01222E_0%,_#021921_100%)] rounded-full border-[1px] border-hero_section_border"
                        style={{
                          backgroundColor: stepColor,
                        }}
                      >
                        <step.icon className="w-8 h-8 text-white" />
                      </motion.div>

                      <div
                        className={`space-y-2  flex flex-col ${
                          step.align === "left"
                            ? "items-start md:items-end"
                            : "items-start"
                        }`}
                      >
                        <h3 className="text-2xl md:text-4xl font-semibold">
                          {step.title}
                        </h3>

                        <p
                          className={`text-sm md:text-[16px] leading-relaxed text-text_gray ${
                            step.align === "left"
                              ? "md:text-right"
                              : "text-left"
                          }`}
                        >
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const steps = [
  {
    id: 1,
    title: "Apply Online",
    description:
      "Submit your application through our online portal, showcasing your skills and experience through your resume and portfolio if applicable.",
    icon: Layers,
    align: "right",
  },
  {
    id: 2,
    title: "Get Shortlisted",
    description:
      "Our recruitment team carefully evaluates your application to see if it aligns with the role's requirements. If it's a fit, you'll move forward in the process.",
    icon: FileText,
    align: "left",
  },
  {
    id: 3,
    title: "Skills assessment",
    description:
      "Demonstrate your expertise through a task or test designed to evaluate your technical and creative abilities.",
    icon: Pen,
    align: "right",
  },
  {
    id: 4,
    title: "Final interview",
    description:
      "Discuss your technical expertise, creativity, and how you can bring value to our team during this final step.",
    icon: Code,
    align: "left",
  },
  {
    id: 5,
    title: "Offer",
    description:
      "Once selected, you'll receive an official offer to join our team and begin your exciting journey with us.",
    icon: ClipboardCheck,
    align: "right",
  },
  // {
  //   id: 6,
  //   title: "Deployment",
  //   description:
  //     "After thorough testing, we launch your project, optimized for performance and a seamless live experience, providing ongoing support post-launch.",
  //   icon: Rocket,
  //   align: "left",
  // },
];
