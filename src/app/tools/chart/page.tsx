"use client"
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { FaExchangeAlt, FaPlus, FaShare } from "react-icons/fa";
import Modal from "@/components/ui/Modal";
import { Bar, Line, Pie } from 'react-chartjs-2';
import Layout from '@/components/Layout';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement, // Pie Chart のために追加
  Title,
  Tooltip,
  Legend
);

function ChartComponent() {
    const searchParams = useSearchParams();

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
    const [chartType, setChartType] = useState<'line' | 'bar' | 'pie'>('line');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [shareUrl, setShareUrl] = useState(''); // New state to hold the share URL

    const labels = scoresList[0]?.map((_, index) => `試験${index + 1}`);

    const data = {
        labels: labels,
        datasets: scoresList.map((scores, index) => {
            const baseColor = `hsl(${index * 60}, 70%, 50%)`;
            if (chartType === 'pie') {
                const backgroundColors = scores.map((_, i) => `hsl(${index * 60 + i * 10}, 70%, 50%)`);
                return {
                    label: `成績 ${index + 1}`,
                    data: scores,
                    backgroundColor: backgroundColors,
                };
            } else {
                return {
                    label: `成績 ${index + 1}`,
                    data: scores,
                    borderColor: baseColor,
                    backgroundColor: `hsla(${index * 60}, 70%, 50%, 0.5)`,
                    fill: true,
                };
            }
        }),
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

    const addNewDataset = () => {
        setScoresList([...scoresList, [0, 0, 0, 0, 0]]);
        setInputValuesList([...inputValuesList, '0,0,0,0,0']);
    };

    const toggleChartType = () => {
        setChartType((prev) => {
            if (prev === 'line') return 'bar';
            if (prev === 'bar') return 'pie';
            return 'line';
        });
    };

    const shareDataset = () => {
        const datasetParam = scoresList.map((scores) => scores.join(',')).join('|');
        const url = `${window.location.origin}/tools/chart?dataset=${encodeURIComponent(datasetParam)}`;
        setShareUrl(url); // Set the generated URL to shareUrl state
        setIsModalVisible(true);
    };

    const closeModal = () => {
        setIsModalVisible(false);
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
                <Button onClick={toggleChartType} leftIcon={<FaExchangeAlt />} size="small">
                    表示切り替え
                </Button>
                <Button variant="secondary" onClick={shareDataset} leftIcon={<FaShare />} size="small">
                    共有
                </Button>
            </div>
            {chartType === 'bar' && <Bar data={data} options={options} />}
            {chartType === 'line' && <Line data={data} options={options} />}
            {chartType === 'pie' && <Pie data={data} options={options} />}
            <Modal
                title="リンク共有"
                description="このリンクを共有することで、他のユーザーとこのチャートを簡単に共有できます。"
                isVisible={isModalVisible}
                onClose={closeModal}
                footer={
                    <div className="flex w-full">
                        <Input placeholder="URL" size="small" className="w-full mr-2" value={shareUrl} readonly />
                        <Button size="small" onClick={() => navigator.clipboard.writeText(shareUrl)} className="whitespace-nowrap">
                            コピー
                        </Button>
                    </div>
                }
            />
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