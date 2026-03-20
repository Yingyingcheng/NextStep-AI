import {
  SiAirbnb,
  SiGoogle,
  SiTwitch,
  SiLyft,
  SiSpotify,
  SiNetflix,
  SiApple,
  SiMeta,
  SiDoordash,
} from "react-icons/si";

const LogoBar = () => {
  const logos = [
    { icon: <SiAirbnb />, name: "Airbnb" },
    { icon: <SiGoogle />, name: "Google" },
    { icon: <SiTwitch />, name: "Twitch" },
    { icon: <SiLyft />, name: "Lyft" },
    { icon: <SiSpotify />, name: "Spotify" },
    { icon: <SiNetflix />, name: "Netflix" },
    { icon: <SiApple />, name: "Apple" },
    { icon: <SiMeta />, name: "Meta" },
    { icon: <SiDoordash />, name: "DoorDash" },
  ];

  return (
    <>
      {/* The section is now the 'group' */}
      <section className="bg-[#F9F8F6] py-10 md:py-20 border-y border-[#EBE9E4] group">
        <div className="container mx-auto px-4 md:px-8">
          <p className="text-center uppercase tracking-[0.2em] md:tracking-[0.3em] text-sm md:text-base mb-8 md:mb-12 text-slate-500 font-medium">
            Our members get amazing jobs at the top tech companies
          </p>

          <div className="overflow-hidden whitespace-nowrap py-6 md:py-10 bg-[#F9F8F6]">
            <div className="flex w-max animate-marquee cursor-pointer">
              <div className="flex shrink-0 items-center">
                {logos.map((logo, i) => (
                  <div
                    key={`first-${i}`}
                    className="flex items-center mx-6 md:mx-12 text-3xl md:text-4xl text-red-600 hover:text-red-300 transition-all ease-in-out"
                  >
                    {logo.icon}
                  </div>
                ))}
                {logos.map((logo, i) => (
                  <div
                    key={`second-${i}`}
                    className="flex items-center mx-6 md:mx-12 text-3xl md:text-4xl text-blue-600 hover:text-blue-300 transition-all ease-in-out"
                  >
                    {logo.icon}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default LogoBar;
