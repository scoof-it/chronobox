"use client"
import { useState } from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import Layout from '@/components/Layout';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [animating, setAnimating] = useState(false); // To track if animation is active
  const [direction, setDirection] = useState('right'); // To track slide direction

  const slides = [
    {
      title: "ChatGPTに直接質問して解説を聞ける",
      description: "ChronoBoxなら、わからないことをすぐにChatGPTに質問して解決できます。",
      link: null
    },
    {
      title: "勉強に役立つ多彩なツールを提供",
      description: (
        <>
          ChronoBoxには、
          <Link href="/tools" className="link-underline">
            多彩なツール
          </Link>
          が揃っており、ノート作成やテスト準備に役立ちます。
        </>
      ),
      link: "/tools"
    },
    {
      title: "簡単にスケジュール管理ができる",
      description: "ChronoBoxで、勉強や課題のスケジュールを簡単に管理できます。",
      link: null
    }
  ];

  const handlePrev = () => {
    if (animating) return;
    setAnimating(true);
    setDirection('left'); // Set direction to left
    setTimeout(() => {
      setCurrentSlide(currentSlide === 0 ? slides.length - 1 : currentSlide - 1);
      setAnimating(false);
    }, 500); // Adjust the duration of the animation if needed
  };

  const handleNext = () => {
    if (animating) return;
    setAnimating(true);
    setDirection('right'); // Set direction to right
    setTimeout(() => {
      setCurrentSlide(currentSlide === slides.length - 1 ? 0 : currentSlide + 1);
      setAnimating(false);
    }, 500); // Adjust the duration of the animation if needed
  };

  return (
    <div>
      <Header />
      <Layout>
        <div className="flex flex-col items-center justify-center space-y-5">
          <p className="bg-white text-primary px-3 py-2 rounded-full text-sm">
            ChronoBoxで、学生生活をもっとスムーズに。
          </p>
          <div className="w-32">
            <Image src="/logotype.svg" alt='ChronoBox' width={100} height={100} className="w-full" />
          </div>
        </div>

        <div className="mt-6 md:mt-12 grid grid-cols-1 md:grid-cols-2">
          <div className="flex justify-center">
            <div className="w-full">
              <Image src="/storyset/team-bro.svg" alt='' width={100} height={100} className="w-full" />
            </div>
          </div>
          <div className="md:hidden relative w-full">
            <div
              className={`bg-white rounded-2xl p-6 px-10 shadow space-y-2 transform transition-all duration-400 ease-in-out ${
                animating
                  ? direction === 'right'
                    ? 'opacity-0 -translate-x-5'
                    : 'opacity-0 translate-x-5'
                  : 'opacity-100 translate-x-0'
              }`}
            >
              <h3 className="font-bold text-lg">{slides[currentSlide].title}</h3>
              <p className="text-sm">
                {slides[currentSlide].description}
              </p>
            </div>
            <div className="absolute inset-y-0 left-0 flex items-center">
              <button onClick={handlePrev} className="text-primary p-4">
                <FaArrowLeft />
              </button>
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center">
              <button onClick={handleNext} className="text-primary p-4">
                <FaArrowRight />
              </button>
            </div>
          </div>

          <div className="hidden md:block">
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              {slides.map((slide, index) => (
                <div key={index} className="bg-white rounded-2xl p-6 space-y-2 shadow">
                  <h3 className="font-bold text-lg">{slide.title}</h3>
                  <p className="text-sm">
                    {slide.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
      <Footer />
    </div>
  );
}