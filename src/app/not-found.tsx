"use client"
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Layout from "@/components/Layout";

export default function NotFound() {
    return (
        <div>
            <Header />
            <Layout>
                <div className="flex flex-col items-center select-none">
                    <h1 className="text-[32px] font-bold">ページが見つかりませんでした</h1>
                    <div className="w-[400px]">
                        <img src="/not-found.png" />
                    </div>
                </div>
            </Layout>
            <Footer />
        </div>
    )
}