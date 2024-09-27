"use client";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Layout from "@/components/Layout";
import Link from "next/link";
import { FaCalculator, FaChartArea } from "react-icons/fa";
import { FiTool } from "react-icons/fi";

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
];

export default function Tools() {
  return (
    <div>
      <Header />
      <Layout>
        <div className="flex flex-col items-center mb-10">
          <h1 className="flex items-center text-[32px] text-primary font-bold gap-2"><FiTool />ツール</h1>
        </div>
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