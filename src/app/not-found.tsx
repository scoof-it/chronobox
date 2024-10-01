"use client"
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Layout from "@/components/Layout";
import Image from "next/image";

export default function NotFound() {
    return (
        <div>
            <Header />
            <Layout>
                <div className="flex flex-col items-center select-none">
                    <h1 className="text-2xl md:text-4xl mb-5 font-bold">ページが見つかりませんでした</h1>
                    <div className="w-full md:w-[750px]">
                        <Image src="/storyset/404.svg" alt="" width={100} height={100} className="w-full" />
                    </div>
                </div>
            </Layout>
            <Footer />
        </div>
    )
}