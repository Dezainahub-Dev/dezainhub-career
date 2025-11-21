import Marquee from "react-fast-marquee"
import Image from "next/image"

export default function TeamMarquee() {
  const OurTeam = [
    {
      id: 1,
      name: "Divyankit Singh",
      role: "Founder & Creative Director",
      image: "https://res.cloudinary.com/duidq5rn4/image/upload/v1761340043/Dezainahub%20Assets/Team/Divyankit_l73gfs.png",
    },
    {
      id: 2,
      name: "Aniket Biswas",
      role: "Lead Designer",
      image: "https://res.cloudinary.com/djicxkd9u/image/upload/v1746177016/Frame_1707482778-2_ubz9vy.png",
    },
    {
      id: 3,
      name: "Minesh Patel",
      role: "Software Engineer",
      image: "https://res.cloudinary.com/duidq5rn4/image/upload/v1763744644/Dezainahub%20Assets/Team/Minesh_fcom98.png",
    },
    {
      id: 4,
      name: "Varidh Srivastav",
      role: "Software Engineer",
      image: "https://res.cloudinary.com/djicxkd9u/image/upload/v1746177015/image_hbsxoa.png",
    },
    {
      id: 5,
      name: "Shreya Singh",
      role: "React Native Developer",
      image: "https://res.cloudinary.com/duidq5rn4/image/upload/v1761340045/Dezainahub%20Assets/Team/Shreya_gmkein.png",
    },
    {
      id: 6,
      name: "Jaipal Singh",
      role: "Business Consultant",
      image: "https://res.cloudinary.com/duidq5rn4/image/upload/v1761340044/Dezainahub%20Assets/Team/Jaipal_Singh_rkhrii.png",
    },
    {
      id: 7,
      name: "Alfi Khatoon",
      role: "Social Media Executive",
      image: "https://res.cloudinary.com/duidq5rn4/image/upload/v1763744519/Dezainahub%20Assets/Team/Alfi_vun2f2.png",
    },

      {
        id: 8,
      name: "Harsha Thethi",
      role: "Human Resource",
      image: "https://res.cloudinary.com/duidq5rn4/image/upload/v1763744517/Dezainahub%20Assets/Team/Harsha_w55ksl.png",
    },
  ]

  return (
    <Marquee className="">
      <div className="flex flex-row gap-8 pr-8">
        {OurTeam.map((member) => (
          <div
            key={member.id}
            className="relative md:h-[588px] md:w-[392px] border border-hero_section_border rounded-[24px] overflow-hidden group cursor-pointer"
          >
            <div className="relative w-full h-full">
              <Image
                src={member.image || "/placeholder.svg"}
                alt={member.name}
                width={300}
                height={200}
                className="w-full h-full filter grayscale transition-all duration-300 group-hover:grayscale-0"
              />
            </div>
            <div className="flex flex-col p-4 absolute rounded-b-[24px] bottom-0 left-0 w-full h-28 bg-[radial-gradient(153.71%_117.75%_at_100%_0%,_#01222E_0%,_#021921_100%)]">
              <div className="text-white font-semibold text-[24px] md:text-[32px] leading-[40px] font-Manrope">
                {member.name}
              </div>
              <div className="text-white text-[16px] md:text-[20px] leading-[32px] font-Nunito">{member.role}</div>
            </div>
          </div>
        ))}
      </div>
    </Marquee>
  )
}
