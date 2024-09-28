"use client"
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <Header />
      <div className="mt-10 md:container mx-5 md:mx-auto">
        <div className="flex flex-col items-center justify-center space-y-5">
          <p className="bg-white text-blue-500 px-3 py-2 rounded-full text-sm md:text-base">ChronoBoxで、学生生活をもっとスムーズに。</p>
          <div className="w-64">
            <Image src="/logotype.svg" alt='ChronoBox' width={100} height={100} className="w-full" />
          </div>
        </div>
        <div className='mt-12 grid grid-cols-1 md:grid-cols-3 gap-5'>
          <div className="bg-white border rounded-md p-4 space-y-2">
              <h3 className="font-bold text-lg">ChatGPTに直接質問して解説を聞ける</h3>
              <p className="text-sm">ChronoBoxなら、わからないことをすぐにChatGPTに質問して解決できます。</p>
            </div>
            <div className="bg-white border rounded-md p-4 space-y-2">
              <h3 className="font-bold text-lg">勉強に役立つ<Link href="/tools" className="link-underline">多彩なツール</Link>を提供</h3>
              <p className="text-sm">ChronoBoxには、ノート作成やテスト準備など、学習に役立つツールが揃っています。</p>
            </div>
            <div className="bg-white border rounded-md p-4 space-y-2">
              <h3 className="font-bold text-lg">簡単にスケジュール管理ができる</h3>
              <p className="text-sm">ChronoBoxで、勉強や課題のスケジュールを簡単に管理できます。</p>
            </div>
        </div>
        <div className="mt-10 md:mt-0 flex justify-center">
          <div className="w-80">
            <img src="/752.png" />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}