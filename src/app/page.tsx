"use client"
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import Image from 'next/image';

export default function Home() {
  return (
    <div>
      <Header />
      <div className="mt-10 md:container mx-5 md:mx-auto grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="rounded overflow-hidden">
          <img src="/irasutoya/business_man_macho.png" alt='いらすとや' className="w-full" />
        </div>
        <div className="flex flex-col items-center justify-center">
          <p className="bg-white text-blue-500 px-3 py-2 rounded-full mb-5">ChronoBoxで、学生生活をもっとスムーズに。</p>
          <div className="w-64">
            <Image src="/logotype.svg" alt='ChronoBox' width={100} height={100} className="w-full" />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}