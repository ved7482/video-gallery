// radhe radhe

import videos from "../../db/videos.json";
import { useRef, useState, useEffect, useCallback } from "react";
import ShinyText from "../components/ShinyText";
import GradientText from "../components/GradientText";
import gsap from "gsap";
import { Link } from "react-router";


const infiniteVideos = [...videos, ...videos];
function Home() {
  const CARD_W = 96;
  const GAP = 8;
  const STEP = CARD_W + GAP;

  const wrapperRef = useRef(null);
  const trackRef = useRef(null);
  const currentSlide = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [currInfo, setCurrInfo] = useState(videos[0]);

  useEffect(() => {
    gsap.from([".title", ".stats", ".desc", ".play-btn"], {
      y: 40,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: "expo.out",
    });

    gsap.from(".thumbnail", {
      scale: 1.08,
      opacity: 0,
      duration: 1,
      ease: "expo.out",
    });
  }, []);

  const animateSlideReveal = useCallback(() => {
    const tl = gsap.timeline();

    tl.fromTo(
      ".thumbnail",
      {
        opacity: 0,
        scale: 1.08,
      },
      {
        opacity: 1,
        scale: 1,
        duration: 0.8,
        ease: "expo.out",
      },
    );

    tl.fromTo(
      [".title", ".stats", ".desc"],
      {
        y: 40,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.08,
        ease: "expo.out",
      },
      "reveal",
    );
    tl.fromTo(
      ".play-btn",
      {
        y: 40,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.4,
      },
      "reveal",
    );
  }, []);

  const goToSlide = useCallback(
    (rawIndex, animate = true) => {
      const track = trackRef.current;
      if (!track) return;

      track.style.transition = animate ? "transform 300ms ease-out" : "none";
      track.style.transform = `translateX(-${rawIndex * STEP}px)`;
      currentSlide.current = rawIndex;

      const normalIndex = rawIndex % videos.length;
      setActiveIndex(normalIndex);

      // after changing active slide
      setCurrInfo(videos[normalIndex]);

      // reveal animation
      requestAnimationFrame(() => {
        animateSlideReveal(normalIndex);
      });
    },
    [STEP, animateSlideReveal],
  );

  useEffect(() => {
    const interval = setInterval(() => {
      goToSlide(currentSlide.current + 1);
    }, 5000);
    return () => clearInterval(interval);
  }, [goToSlide]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const handleTransitionEnd = () => {
      if (currentSlide.current >= videos.length) {
        goToSlide(currentSlide.current - videos.length, false);
      }
    };

    track.addEventListener("transitionend", handleTransitionEnd);
    return () =>
      track.removeEventListener("transitionend", handleTransitionEnd);
  }, [goToSlide]);

  const slide = (dir) => {
    const next = currentSlide.current + dir;
    if (next < 0) {
      goToSlide(videos.length - 1);
      return;
    }
    goToSlide(next);
  };

  return (
    <div className="main selection:bg-[#f5f5f53e] w-full h-screen relative">
      <div className="banner w-full h-full relative object-cover overflow-hidden">
        <img
          className="thumbnail w-full h-full"
          src={currInfo.thumbnail}
          alt="img1"
        />
      </div>
      <div className="content w-full h-full absolute top-0 left-0 flex items-center justify-between">
        <div className="vignette absolute w-full h-full bg-linear-to-r from-[#080808] to-transparent"></div>
        <div className="info w-2/5 h-full relative text-[#e2e1df] flex flex-col items-start justify-center px-16 py-5 gap-2">
          <h3 className='title font-["jose-bold"] text-6xl leading-none tracking-tighter'>
            <ShinyText
              text={currInfo.title}
              speed={2}
              delay={0}
              color="#b5b5b5"
              shineColor="#ffffff"
              spread={120}
              direction="left"
              yoyo={false}
              pauseOnHover={false}
              disabled={false}
            />
          </h3>
          <div className="stats opacity-90">
            <GradientText
              colors={["#5227FF", "#FF9FFC", "#B497CF"]}
              animationSpeed={5}
              showBorder
              className="bg-transparent"
            >
              {currInfo.views} views • {currInfo.date}
            </GradientText>
          </div>
          <p className="desc opacity-60">{currInfo.desc}</p>
          <Link
            to={`/video/${currInfo.id}`}
            className="play-btn flex items-center justify-center gap-2 mt-[5%] cursor-pointer w-full rounded-lg text-white text-xl font-bold py-2 px-6 bg-linear-to-r from-cyan-500 to-blue-500 hover:from-indigo-400 hover:to-cyan-400 hover:scale-[1.05] transition-transform duration-500"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="32"
              height="32"
              fill="currentColor"
            >
              <path d="M19.376 12.4161L8.77735 19.4818C8.54759 19.635 8.23715 19.5729 8.08397 19.3432C8.02922 19.261 8 19.1645 8 19.0658V4.93433C8 4.65818 8.22386 4.43433 8.5 4.43433C8.59871 4.43433 8.69522 4.46355 8.77735 4.5183L19.376 11.584C19.6057 11.7372 19.6678 12.0477 19.5146 12.2774C19.478 12.3323 19.4309 12.3795 19.376 12.4161Z"></path>
            </svg>
            <p>Play</p>
          </Link>
        </div>
        <div className="slider-container w-3/5 h-full relative flex justify-end items-end mb-[10%] px-5">
          <div className="relative w-8/10 flex items-center">
            <button
              onClick={() => slide(-1)}
              className="absolute left-0 z-10 bg-black/70 text-white w-8 h-20 rounded-md text-xl cursor-pointer"
            >
              ‹
            </button>

            <div ref={wrapperRef} className="overflow-hidden mx-10 w-full">
              <div
                ref={trackRef}
                className="flex p-2"
                style={{ gap: GAP, transition: "transform 300ms ease-out" }}
              >
                {infiniteVideos.map((video, i) => {
                  const normalIndex = i % videos.length;
                  const isActive = normalIndex === activeIndex;

                  return (
                    <div
                      key={i}
                      onClick={() => goToSlide(i % videos.length)}
                      style={{ flex: `0 0 ${CARD_W}px`, height: 64 }}
                      className={`${isActive ? "slide-active border-white scale-105" : "slide-inactive border-[#e2e1dfc8]"} border-3 rounded-lg overflow-hidden cursor-pointer relative flex items-center justify-center hover:border-white hover:scale-105 transition duration-200`}
                    >
                      <img
                        src={video.thumbnail}
                        className="z-10 relative object-cover w-full h-full"
                        alt={`slide-${i}`}
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            <button
              onClick={() => slide(1)}
              className="absolute right-0 z-10 bg-black/70 text-white w-8 h-20 rounded-md text-xl cursor-pointer"
            >
              ›
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home
