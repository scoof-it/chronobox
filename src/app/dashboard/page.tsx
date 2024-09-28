"use client";
import { useState, useEffect } from "react";
import { auth, db } from "@/lib/firebaseConfig"; // Firestoreの設定をインポート
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore"; // updateDocを追加
import { User } from "firebase/auth";
import Button from "@/components/ui/Button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Input from "@/components/ui/Input";
import { v4 as uuidv4 } from 'uuid';
import Calendar from "@/components/ui/Calender";
import AlertMessage from "@/components/ui/AlertMessage";

export default function Dashboard() {
    const [currentYear, setCurrentYear] = useState(2024);
    const [currentMonth, setCurrentMonth] = useState(8);
    const [selectedDay, setSelectedDay] = useState<number | null>(null);
    const [scheduleTitle, setScheduleTitle] = useState<string>("");
    const [schedules, setSchedules] = useState<{ id: string; title: string }[]>([]);
    const [user, setUser] = useState<User | null>(null);
    const [alert, setAlert] = useState<{ message: string; type: "success" | "error" } | null>(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    const prevMonth = () => {
        let newMonth = currentMonth - 1;
        let newYear = currentYear;
        if (newMonth < 0) {
            newMonth = 11;
            newYear--;
        }
        setCurrentMonth(newMonth);
        setCurrentYear(newYear);
    };

    const nextMonth = () => {
        let newMonth = currentMonth + 1;
        let newYear = currentYear;
        if (newMonth > 11) {
            newMonth = 0;
            newYear++;
        }
        setCurrentMonth(newMonth);
        setCurrentYear(newYear);
    };

    const handleDayClick = async (day: number) => {
        setSelectedDay(day);
        if (user) {
            const dateKey = `${currentYear}-${currentMonth + 1}-${day}`;
            const scheduleRef = doc(db, "users", user.uid, "schedules", dateKey);
            const scheduleDoc = await getDoc(scheduleRef);
            if (scheduleDoc.exists()) {
                setSchedules(scheduleDoc.data().schedules || []);
            } else {
                setSchedules([]);
            }
        }
    };

    const handleSaveSchedule = async () => {
        if (user && selectedDay && scheduleTitle) {
            const dateKey = `${currentYear}-${currentMonth + 1}-${selectedDay}`;
            const newSchedule = { id: uuidv4(), title: scheduleTitle };
            const newSchedules = [...schedules, newSchedule];
            
            const scheduleRef = doc(db, "users", user.uid, "schedules", dateKey);
            await setDoc(scheduleRef, { schedules: newSchedules }, { merge: true });
            setAlert({ message: "スケジュールが保存されました", type: "success" });
            setScheduleTitle("");
            setSchedules(newSchedules);
        }
    };

    const handleDeleteSchedule = async (id: string) => {
        if (user && selectedDay) {
            const dateKey = `${currentYear}-${currentMonth + 1}-${selectedDay}`;
            const newSchedules = schedules.filter((schedule) => schedule.id !== id);
            const scheduleRef = doc(db, "users", user.uid, "schedules", dateKey);
            await updateDoc(scheduleRef, { schedules: newSchedules });
            setSchedules(newSchedules);
            setAlert({ message: "スケジュールが削除されました", type: "success" });
        }
    };

    return (
        <div>
            <Header />
            <div className="mt-10 md:container mx-5 md:mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <Calendar
                            currentYear={currentYear}
                            currentMonth={currentMonth}
                            prevMonth={prevMonth}
                            nextMonth={nextMonth}
                            onDayClick={handleDayClick}
                        />
                    </div>
                    <div>
                        {selectedDay && (
                            <div className="p-5 bg-white border rounded-md space-y-2.5">
                                <h2 className="text-[20px] font-bold">{`${currentYear}年${currentMonth + 1}月${selectedDay}日`}</h2>
                                <div className="flex space-x-2.5">
                                    <Input
                                        type="text"
                                        value={scheduleTitle}
                                        onChange={(e) => setScheduleTitle(e.target.value)}
                                        placeholder="スケジュールタイトル"
                                        className="w-full"
                                    />
                                    <Button onClick={handleSaveSchedule} className="whitespace-nowrap" variant="primary">
                                        保存
                                    </Button>
                                </div>
                                {schedules.map((schedule) => (
                                    <li key={schedule.id} className="flex space-x-2.5 items-center">
                                        <p>{schedule.title}</p>
                                        <Button onClick={() => handleDeleteSchedule(schedule.id)} variant="danger" size="small">
                                            削除
                                        </Button>
                                    </li>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
            {alert && (
                <AlertMessage
                    message={alert.message}
                    type={alert.type}
                    onClose={() => setAlert(null)}
                />
            )}
        </div>
    );
}