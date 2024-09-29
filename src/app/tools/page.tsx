"use client";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Layout from "@/components/Layout";
import Link from "next/link";
import { FaChartArea, FaStickyNote, FaSuperscript, FaUsers } from "react-icons/fa";
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
    description: "入力したデータから簡単に成績統計をグラフ化できるツールです。",
  },
  {
    href: "/tools/flashcard",
    icon: <FaStickyNote />,
    title: "フラッシュカード",
    description: "覚えたい内容をカードにして、反復練習でしっかり暗記できます。",
  },
  {
    href: "/tools/equation",
    icon: <FaSuperscript />,
    title: "一次方程式と二次方程式",
    description: "方程式を繰り返し解いて、数学の力を身につけましょう。",
  },
  {
    href: "/tools/group-study",
    icon: <FaUsers />,
    title: "グループ学習管理",
    description: "チームでの学習管理が簡単に！タスク分担もスムーズです。",
  },
];


const sortedTools = tools.sort((a, b) => a.href.localeCompare(b.href));

export default function Tools() {
  return (
    <div>
      <Header />
      <Layout>
        <div className="flex flex-col items-center mb-10">
          <h1 className="flex items-center text-[32px] text-primary font-bold gap-2"><FiTool />ツール</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {sortedTools.map((tool, index) => (
            <Link href={tool.href} key={index}>
              <div className="p-4 bg-white border rounded-md h-full flex flex-col">
                <div className="flex items-center mb-0.5 text-primary">
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