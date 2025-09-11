import {
  Layers,
  FileText,
  Pen,
  Code,
  ClipboardCheck,
  Rocket,
  Smile,
  Bird,
  TrendingUp,
  Scale,
  Wifi,
  BusIcon,
  LucideBriefcaseBusiness,
} from "lucide-react";

// resontojoinus
const reasons = [
  {
    id: 1,
    icon: Smile,
    title: "Positive environment",
    desc: "We believe in creating a positive and inspiring environment for everyone where diverse ideas and creativity thrive. Join a team that values respect, openness, and innovation.",
  },
  {
    id: 2,
    icon: Bird,
    title: "Creative Freedom",
    desc: "With us, you have the freedom to experiment and think outside the box. We empower you to express your creativity and make bold decisions.",
  },
  {
    id: 3,

    icon: TrendingUp,
    title: "Growth",
    desc: "We support your professional journey by offering opportunities for learning, skill development, and career advancement. Your growth is our priority.",
  },
  {
    id: 4,
    icon: Scale,
    title: "Positive environment",
    desc: "We believe in creating a positive and inspiring environment for everyone where diverse ideas and creativity thrive. Join a team that values respect, openness, and innovation.",
  },
  {
    id: 5,
    icon: Wifi,
    title: "Remote Working",
    desc: "Work from anywhere while staying connected with our dynamic team. We embrace remote work to help you achieve flexibility and productivity.",
  },
  {
    id: 6,
    icon: LucideBriefcaseBusiness,
    title: "Impactful Work",
    desc: "Be part of projects that make a difference. Your contributions directly shape innovative solutions that impact both clients and communities.",
  },
];
export default function ReasonToJoin() {
  return (
    <>
      {/* <Smile/> */}
      <section className="md:py-[64px] py-[40px]">
        <div className="flex flex-row justify-center flex-wrap w-full gap-4 md:gap-8">
          {reasons.map((reason) => (
            <div
              key={reason.id}
              className="bg-[radial-gradient(153.71%_117.75%_at_100%_0%,_#01222E_0%,_#021921_100%)]  border-hero_section_border flex flex-col border-[1px] rounded-[24px] p-3 md:p-6 items-start gap-2 md:gap-4 w-[392px]"
            >
              <div className="p-2 md:p-4 bg-[radial-gradient(153.71%_117.75%_at_100%_0%,_#01222E_0%,_#021921_100%)] rounded-full border-[1px] border-hero_section_border">
                <reason.icon className="w-4 md:w-8 h-4 md:h-8 text-white" />
              </div>

              <div className={`space-y-2  flex flex-col `}>
                <h3 className="font-Manrope  text-[24px] md:text-[32px] font-semibold leading-[40px]">
                  {reason.title}
                </h3>
                <p
                  className={`text-[14px] md:leading-[24px] leading-[20px] md:text-[16px] text-text_gray `}
                >
                  {reason.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
        {}
      </section>
      <div></div>
    </>
  );
}
