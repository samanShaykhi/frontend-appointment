'use client'
import { useRef, useState, useMemo, useEffect } from "react";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { BsChevronRight } from "react-icons/bs";
import { toGregorian } from "jalaali-js";
import { notFound, usePathname, useRouter } from "next/navigation";
import styles from './Reservation.module.css'
import { axiosConfig } from "@/components/utils/axios";
import { messageCustom } from "@/components/utils/message/message";
import ServerError from "../../utils/ErrorPages/ServerError";
import ServerReset from "../../utils/ErrorPages/ServerReset";
import { ContextStates } from "@/components/utils/context/Index";
import SpinnerLoading from "@/components/utils/Spinner/SpinnerLoading";


function Reservation({ days, IDConsultant, reservations }) {
    const [curentDay, setcurentDay] = useState();
    const [curentHours, setcurentHours] = useState();
    const [ErrorServer, setErrorServer] = useState();
    const [selected, setSelected] = useState(null);
    const { curentUser, funcGetUser, setcurentUser } = ContextStates()
    const [firstName, setfirstName] = useState('');
    const [lastName, setlastName] = useState('');
    const [ErrorsInputs, setErrorsInputs] = useState({});
    const pathname = usePathname();
    useEffect(() => {
        if (curentUser) return
        funcGetUser(pathname)
    }, [])
    const today = new Date();
    const nowTime = today.getHours() * 60 + today.getMinutes();

    const reservedMap = useMemo(() => {
        const map = {};
        reservations.forEach(r => {
            if (!map[r.date]) map[r.date] = new Set();
            map[r.date].add(r.hourse);
        });
        return map;
    }, [reservations]);

    const formatJalaliFull = (dateStr) => {
        const [jy, jm, jd] = dateStr.split("/").map(Number);
        const g = toGregorian(jy, jm, jd);
        const d = new Date(g.gy, g.gm - 1, g.gd);

        const weekdays = ["یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنجشنبه", "جمعه", "شنبه"];
        const months = ["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور", "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"];

        return {
            weekday: weekdays[d.getDay()],
            day: jd,
            month: months[jm - 1],
            gDate: d
        };
    };

    const handleClickDate = (item) => {
        setcurentDay(item.date);
        setSelected(item);
        setcurentHours(null);
    };

    const handleClekHourse = (hourse) => {
        setcurentHours(prev => prev === hourse ? null : hourse);
    };

    const sliderRef = useRef(null);

    const scrollNext = () => sliderRef.current?.scrollBy({ left: 220, behavior: "smooth" });
    const scrollPrev = () => sliderRef.current?.scrollBy({ left: -220, behavior: "smooth" });
    const router = useRouter();
    const sendData = async () => {
        if (!curentUser.firstName || !curentUser.lastName) {
            if (!firstName && !lastName) {
                return setErrorsInputs({ firstName: { message: 'نام اجباری است.' }, lastName: { message: 'نام خانوادگی اجباری است.' } })
            } else if (firstName.length < 4 && lastName.length < 4) {
                return setErrorsInputs({ firstName: { message: 'نام نباید کمتر از 4 کارکتر باشد.' }, lastName: { message: 'نام خانوادگی نباید کمتر از 4 کارکتر باشد.' } })

            } else if (firstName.length < 4) {
                return setErrorsInputs({ firstName: { message: 'نام نباید کمتر از 4 کارکتر باشد.' }, })

            } else if (firstName.length > 60) {
                return setErrorsInputs({ firstName: { message: 'نام نباید بیشتر از60 کارکتر باشد.' }, })

            } else if (lastName.length < 4) {
                return setErrorsInputs({ lastName: { message: 'نام خانوادگی نباید کمتر از 4 کارکتر باشد.' } })

            } else if (lastName.length > 60) {
                return setErrorsInputs({ lastName: { message: 'نام خانوادگی نباید بیشتر از60  کارکتر باشد.' } })

            }
        }

        try {
            const sendRes = await axiosConfig('/reservation/addreservation', {
                method: "POST",
                headers: { "Content-type": "application/json" },
                data: {
                    date: curentDay,
                    hourse: curentHours,
                    consoltant: IDConsultant,
                    firstName,
                    lastName,
                },
            });

            if (sendRes.status === 201) {
                messageCustom('نوبت شما رزرو شد.', 'success', 5000);
                setcurentUser(sendRes.data.user)
                router.replace('/profile/reservations-me')
            }
        } catch (error) {
            if (error.status === 401) {
                messageCustom('ورود شما منقضی شده', 'error', 6000);
                return router.replace('/login')
            } else if (error.status === 404) {
                router.replace('/not-found');
            } else if (error.status === 500) {
                setErrorServer('SERVER_ERROR')
            } else if (error.status === 503) {
                messageCustom('error code 503', 'error', 6000);
            } else {
                setErrorServer('SERVER_RESET')

            }
        }
    };

    if (ErrorServer === 'SERVER_ERROR') {
        return (
            <ServerError />
        )
    } else if (ErrorServer === 'SERVER_RESET') {
        return (
            <ServerReset />
        )
    }

    return (
        <div className="custom-container pt-4 h-[98vh] flex flex-col" >
            <div className={styles.headPage}>
                <BsChevronRight onClick={() => router.back()} />
                <span>رزرو نوبت</span>
            </div>
            {curentUser ?
                <>
                {console.log(days)}
                    <div className="w-full space-y-6 mb-[1rem]">

                        <div className="relative w-full">
                            {reservations.length > 3 && <button onClick={scrollPrev} className="absolute left-0 top-1/2 -translate-y-1/2 bg-white shadow p-2 rounded-full z-10">
                                <ChevronLeft />
                            </button>}

                            <div ref={sliderRef} className="flex overflow-x-auto gap-4  py-3 px-10 scroll-smooth no-scrollbar">
                                {days.map((item) => {
                                    const info = formatJalaliFull(item.date);
                                    const isActive = selected?._id === item._id;

                                    const reservedTimes = reservedMap[item.date] || new Set();

                                    const freeCount = item.horse.filter(time => {
                                        const [h, m] = time.split(":").map(Number);
                                        const tMin = h * 60 + m;
                                        const isToday = info.gDate.toDateString() === today.toDateString();
                                        const past = isToday && tMin < nowTime;
                                        return !past && !reservedTimes.has(time);
                                    }).length;

                                    const allFull = freeCount === 0;

                                    return (
                                        <button
                                            key={item._id}
                                            onClick={() => !allFull && handleClickDate(item)}
                                            disabled={allFull}
                                            className={`min-w-[100px] flex flex-col items-center border rounded-xl
                                        ${allFull ? "bg-red-200 opacity-50" : isActive ? "bg-[#042a43] text-white" : "bg-gray-100"}`}
                                        >
                                            <span>{info.weekday}</span>
                                            <span className="text-xl font-bold">{info.day}</span>
                                            <span>{info.month}</span>
                                            <span className="text-sm mt-1 opacity-70">{freeCount} نوبت خالی</span>
                                        </button>
                                    );
                                })}
                            </div>

                            {reservations.length > 3 && <button onClick={scrollNext} className="absolute right-0 top-1/2 -translate-y-1/2 bg-white shadow p-2 rounded-full z-10">
                                <ChevronRight />
                            </button>}
                        </div>

                        {selected && (
                            <div className="grid grid-cols-3 gap-3">
                                {selected.horse.sort().map((time) => {
                                    const [h, m] = time.split(":").map(Number);
                                    const tMin = h * 60 + m;

                                    const info = formatJalaliFull(selected.date);
                                    const isToday = info.gDate.toDateString() === today.toDateString();
                                    const past = isToday && tMin < nowTime;

                                    const reservedTimes = reservedMap[selected.date] || new Set();
                                    const taken = reservedTimes.has(time);

                                    const disabled = past || taken;

                                    return (
                                        <button
                                            key={time}
                                            onClick={() => !disabled && handleClekHourse(time)}
                                            disabled={disabled}
                                            className={`border rounded-lg p-2 text-center
                                        ${disabled ? "bg-gray-300 opacity-60" : time === curentHours ? styles.AcHourse : "hover:bg-gray-200"}`}
                                        >
                                            {time}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                    {(!curentUser.firstName || !curentUser.lastName) && <div className={styles.Inputs} >
                        <span className="block text-[#888888] mb-2 text-[14.5px]" > برای رزرو نوبت نام و نام خانوادگی الزامی میباشد. </span>
                        <div className={styles.ItemInpCons} >
                            <label className={styles.labelInpSCons} >نام </label>
                            <input onChange={(e) => setfirstName(e.target.value)} maxLength={12} placeholder='نام مشاور را بنویسید' type="text" />
                            {ErrorsInputs.firstName && <span className='text-[red] block text-[16px] font-bold' > {ErrorsInputs.firstName.message} </span>}
                        </div>
                        <div className={styles.ItemInpCons}>
                            <label className={styles.labelInpSCons} >نام خانوادگی </label>
                            <input maxLength={22} onChange={(e) => setlastName(e.target.value)} placeholder='نام خانوادگی مشاور را بنویسید' type="text" />
                            {ErrorsInputs.lastName && <span className='text-[red] block text-[16px] font-bold' > {ErrorsInputs.lastName.message} </span>}
                        </div>
                    </div>}
                    <div className='mt-auto'>
                        {curentDay && curentHours ? (
                            <button onClick={sendData} className={styles.btnSendData}>ارسال</button>
                        ) : (
                            <button className={styles.btnSendDataNoDrap}>ارسال</button>
                        )}
                    </div>
                </>
                :
                <SpinnerLoading />
            }
        </div >
    );
}

export default Reservation;
