"use client";
import { useState, useEffect } from "react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Layout from "@/components/Layout";
import Button from "@/components/ui/Button";

export default function Timer() {
    const [timeLeft, setTimeLeft] = useState(25 * 60); // 作業タイムデフォルト 25分
    const [isRunning, setIsRunning] = useState(false);
    const [customMinutes, setCustomMinutes] = useState(25); // カスタム時間の設定
    const [round, setRound] = useState(1); // 現在のポモドーロラウンド数
    const [isBreak, setIsBreak] = useState(false); // 休憩タイムかどうか
    const [totalRounds, setTotalRounds] = useState(0); // 総ラウンド数

    // アラート音の準備
    const alertSound = new Audio("/alert-sound.mp3");

    // 時間を mm:ss 形式にフォーマットする関数
    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
    };

    // タイマーの動作を制御
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isRunning && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            alertSound.play(); // タイマー終了時に音を鳴らす
            if (isBreak) {
                // 休憩終了、次のラウンドへ
                setRound(round + 1);
                setIsBreak(false);
                setTimeLeft(customMinutes * 60); // 作業タイムに戻す
            } else {
                // 作業終了、休憩へ
                setTotalRounds(totalRounds + 1);
                if (totalRounds % 4 === 0) {
                    // 4ラウンドごとに長い休憩
                    setTimeLeft(15 * 60); // 長い休憩 15 分
                } else {
                    setTimeLeft(5 * 60); // 通常休憩 5 分
                }
                setIsBreak(true);
            }
            setIsRunning(false); // タイマー停止
        }
        return () => clearInterval(timer);
    }, [isRunning, timeLeft, isBreak, round, totalRounds]);

    // スタート/一時停止ボタンのハンドラ
    const handleStartPause = () => {
        setIsRunning(!isRunning);
    };

    // リセットボタンのハンドラ
    const handleReset = () => {
        setIsRunning(false);
        setTimeLeft(customMinutes * 60); // カスタム時間にリセット
        setIsBreak(false); // 休憩状態を解除
        setRound(1); // ラウンドリセット
        setTotalRounds(0); // 総ラウンド数リセット
    };

    // 時間を自由に設定するハンドラ
    const handleCustomTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
        if (!isNaN(value)) {
            setCustomMinutes(value);
            setTimeLeft(value * 60); // タイマーを設定された時間に変更
        }
    };

    return (
        <div>
            <Header />
            <Layout>
                <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
                    <h1 className="text-4xl font-bold text-primary mb-6">ポモドーロタイマー</h1>
                    <div className="text-7xl font-mono text-primary mb-6">
                        {formatTime(timeLeft)}
                    </div>
                    <div className="mb-6">
                        <span className="text-2xl text-primary">
                            {isBreak ? "休憩タイム" : "作業タイム"} - ラウンド {round}
                        </span>
                    </div>
                    <div className="flex items-center justify-center space-x-4 mb-6">
                        <input
                            type="number"
                            className="px-4 py-2 border border-gray-300 rounded w-24 text-center"
                            value={customMinutes}
                            onChange={handleCustomTimeChange}
                            min="1"
                            max="120"
                            disabled={isRunning || isBreak}
                        />
                        <span className="text-xl text-primary">分</span>
                    </div>
                    <div className="flex space-x-4">
                        <Button
                            variant={`${isRunning ? "secondary" : "primary"}`}
                            onClick={handleStartPause}
                        >
                            {isRunning ? "一時停止" : "スタート"}
                        </Button>
                        <button
                            className="px-6 py-3 bg-gray-500 text-white font-semibold rounded-lg"
                            onClick={handleReset}
                        >
                            リセット
                        </button>
                    </div>
                </div>
            </Layout>
            <Footer />
        </div>
    );
}