"use client"
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Layout from "@/components/Layout";
import { Line, Bar } from 'react-chartjs-2';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation'; // useSearchParams のみをインポート
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { FaPlus, FaShare } from "react-icons/fa";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Suspenseで包むためのクライアントサイド専用のコンポーネント
function ChartComponent() {
    const searchParams = useSearchParams();
    
    // クエリパラメータからデータセットを読み取る
    useEffect(() => {
        const datasetParam = searchParams.get('dataset');
        if (datasetParam) {
            const datasets = datasetParam.split('|').map((set) => set.split(',').map(Number));
            setScoresList(datasets);
            setInputValuesList(datasets.map((set) => set.join(',')));
        }
    }, [searchParams]);

    const [scoresList, setScoresList] = useState<number[][]>([[65, 75, 70, 80, 90]]);
    const [inputValuesList, setInputValuesList] = useState<string[]>(['65,75,70,80,90']);
    const [isBarChart, setIsBarChart] = useState(false);

    // X軸ラベルを点数の数に応じて動的に生成
    const labels = scoresList[0]?.map((_, index) => `試験${index + 1}`);

    // グラフに表示するデータ
    const data = {
        labels: labels,
        datasets: scoresList.map((scores, index) => ({
            label: `成績 ${index + 1}`,
            data: scores,
            borderColor: `hsl(${index * 60}, 70%, 50%)`,
            backgroundColor: `hsla(${index * 60}, 70%, 50%, 0.5)`,
            fill: true,
        })),
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
                labels: {
                    color: '#007bff',
                },
            },
        },
        scales: {
            x: {
                ticks: {
                    color: '#007bff',
                },
            },
            y: {
                ticks: {
                    color: '#007bff',
                },
            },
        },
    };

    // ユーザーが入力した点数を各データセットに反映
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const value = e.target.value;
        const newInputValuesList = [...inputValuesList];
        newInputValuesList[index] = value;
        setInputValuesList(newInputValuesList);

        const newScores = value.split(',').map(Number);
        if (newScores.every(score => !isNaN(score))) {
            const newScoresList = [...scoresList];
            newScoresList[index] = newScores;
            setScoresList(newScoresList);
        }
    };

    // 新しいデータセットを追加する関数
    const addNewDataset = () => {
        setScoresList([...scoresList, [0, 0, 0, 0, 0]]);
        setInputValuesList([...inputValuesList, '0,0,0,0,0']);
    };

    // グラフタイプを切り替える関数
    const toggleChartType = () => {
        setIsBarChart(prev => !prev);
    };

    // データセットをURLに変換して共有リンクを生成する関数
    const shareDataset = () => {
        const datasetParam = scoresList.map((scores) => scores.join(',')).join('|'); // データセットをクエリ用に変換
        const url = `${window.location.origin}/tools/chart?dataset=${encodeURIComponent(datasetParam)}`;
        navigator.clipboard.writeText(url); // クリップボードにコピー
        alert('共有リンクがクリップボードにコピーされました！');
    };

    return (
        <div className="p-4 space-y-4">
            <h2 className="text-primary text-2xl font-bold">成績統計</h2>
            <div className="space-y-2">
                {scoresList.map((_, index) => (
                    <div key={index} className="space-y-2">
                        <Input
                            type="text"
                            value={inputValuesList[index]}
                            onChange={(e) => handleInputChange(e, index)}
                            placeholder={`データセット${index + 1}の点数をカンマ区切りで入力`}
                            size="small"
                            className="w-full"
                        />
                    </div>
                ))}
                <div className="flex justify-center">
                    <Button variant="secondary" size="small" onClick={addNewDataset} leftIcon={<FaPlus />}>
                        データセットを追加
                    </Button>
                </div>
            </div>
            <div className="flex justify-between space-x-2">
                <Button onClick={toggleChartType} size="small">
                    表示切り替え
                </Button>
                <Button variant="secondary" onClick={shareDataset} leftIcon={<FaShare />} size="small">
                    共有
                </Button>
            </div>
            {isBarChart ? (
                <Bar data={data} options={options} />
            ) : (
                <Line data={data} options={options} />
            )}
        </div>
    );
}

export default function Chart() {
    return (
        <div>
            <Header />
            <Layout>
                <Suspense fallback={<div>Loading...</div>}>
                    <ChartComponent />
                </Suspense>
            </Layout>
            <Footer />
        </div>
    );
}