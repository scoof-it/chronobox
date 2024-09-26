"use client";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Layout from "@/components/Layout";
import Link from "next/link";
import { FaCalculator, FaChartArea, FaClock } from "react-icons/fa";

interface Tool {
  href: string;
  icon: JSX.Element;
  title: string;
  description: string;
}

const tools: Tool[] = [
    {
        href: "/tools/chart",
        icon: <FaChartArea />,
        title: "チャート",
        description: "ユーザーがカンマ区切りで入力した点数データを基に、線グラフと棒グラフを動的に切り替えて表示できる成績統計ツールです。",
    },
    {
        href: "/tools/calculator",
        icon: <FaCalculator />,
        title: "電卓",
        description: "シンプルなUIで、計算に困った時にすぐに使えるツールです。",
    },
    {
        href: "/tools/timer",
        icon: <FaClock />,
        title: "タイマー",
        description: "学習時間を効率的に管理できるタイマー付きのポモドーロ学習ツールです。",
    },
];

export default function Tools() {
  return (
    <div>
      <Header />
      <Layout>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {tools.map((tool, index) => (
            <Link href={tool.href} key={index}>
              <div className="p-4 bg-white text-primary border border-primary rounded-md">
                <div className="flex items-center mb-0.5">
                  {tool.icon}
                  <p className="font-bold ml-2">{tool.title}</p>
                </div>
                <p className="text-sm">{tool.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </Layout>
      <Footer />
    </div>
  );
}