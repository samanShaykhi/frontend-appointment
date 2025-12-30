'use client'
import { useRouter } from "next/navigation";
import { BsChevronRight } from "react-icons/bs";
import style from './AddAppointment.module.css'
import PersianCalendar from "../../utils/PersianCalendar";
import { useEffect, useState } from "react";
import Modal from "./Modal";
import { axiosConfig } from "@/components/utils/axios";
import { messageCustom } from "@/components/utils/message/message";
import { ContextStates } from "@/components/utils/context/Index";
import SpinnerLoading from "@/components/utils/Spinner/SpinnerLoading";
import ServerError from "../../utils/ErrorPages/ServerError";
import ServerReset from "../../utils/ErrorPages/ServerReset";
function AddAppointment() {
    const listHours = ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00', '23:30']
    const { curentUser, funcGetUser } = ContextStates()
    useEffect(() => {
        if (curentUser) return
        funcGetUser()
    }, [])
    const router = useRouter()
    const getDate = new Date()
    const numberGetDate = 12
    const [appointment, setappointment] = useState([])
    const [appointmentFech, setappointmentFech] = useState([])
    const [getappointmentFech, setgetappointmentFech] = useState(false)
    const [curentDate, setcurentDate] = useState()
    const [empetyDates, setempetyDates] = useState(false)
    const [curentWork, setcurentWork] = useState('date')
    const [ErrorServer, setErrorServer] = useState();
    useEffect(() => {
        try {
            const fechData = async () => {
                const fechMe = await axiosConfig('/appointment/appointmentget')
                setappointmentFech(fechMe.data.dates)
            }
            fechData()
        } catch (error) {
            if (error.status === 401) {
                messageCustom('توکن شما منقضی شده.', 'error', 6000);
                router.replace('/login');

            } else if (error.status === 500) {
                setErrorServer('SERVER_ERROR')
            } else if (error.status === 503) {
                messageCustom('error code 503', 'error', 6000);
            } else {
                setErrorServer('SERVER_RESET')
            }
        }
    }, [getappointmentFech])

    const allDates = []
    for (let index = 0; index < numberGetDate; index++) {
        const dates = new Date(getDate.getFullYear(), getDate.getMonth(), getDate.getDate() + index);
        allDates.push(dates)
    } const [open, setOpen] = useState(false)

    if (ErrorServer === 'SERVER_ERROR') {
        return (
            <ServerError />
        )
    } else if (ErrorServer === 'SERVER_RESET') {
        return (
            <ServerReset />
        )
    }
    const handleChangeHours = (hours) => {
        if (!curentDate) return
        if (appointment.length === 0) return
        const copyArr = [...appointment]
        const findIndex = copyArr.findIndex(index => index.date === curentDate.date)

        if (findIndex === -1) return

        if (copyArr[findIndex].date) {
            if (copyArr[findIndex]?.hours.length > 0) {
                const copyHours = [...copyArr[findIndex].hours]
                const findHours = copyHours.find(h => h === hours)
                if (findHours) {
                    copyArr[findIndex].hours = copyHours.filter(h => h !== hours)
                    return setappointment(copyArr)
                }
                copyHours.push(hours)
                copyArr[findIndex].hours = copyHours
            } else {
                copyArr[findIndex].hours = [hours]
            }
        }
        setappointment(copyArr)
    }
    const clickModal = (date) => {
        setOpen(true)
        setcurentDate(date)
    }
    const handleActiveHours = (event) => {
        if (!curentDate) return
        const findDate = appointment.find(item => item.date === curentDate?.date)
        if (!findDate) return
        const findHours = findDate.hours.find(item => item === event)
        if (findHours) return true
        return false
    }
    const handleVlidBtnSendDate = () => {
        const dates = [...appointment]
        let validationStatus = true
        dates.map(date => {
            if (date.hours.length === 0) return validationStatus = false
        })
        return validationStatus
    }
    const sendData = async () => {
        try {
            const fechData = await axiosConfig('/appointment/addappointment', {
                method: 'POST',
                data: { appointment: JSON.stringify(appointment.sort()) }
            })
            if (fechData.status === 201) {
                messageCustom('نوبت ها اضافه شدنند', 'success', 5000)
                setempetyDates(prev => !prev)
                setappointment([])
                setcurentWork('date')
                setcurentDate(null)
                setgetappointmentFech(prev => !prev)
            }
        } catch (error) {
            if (error.status === 401) {
                messageCustom('توکن شما منقضی شده.', 'error', 6000);
                router.replace('/login');
            } else if (error.status === 400) {
                messageCustom(error.data.message, 'error', 6000);
            } else if (error.status === 500) {
                setErrorServer('SERVER_ERROR')
            } else if (error.status === 503) {
                messageCustom('error code 503', 'error', 6000);
            } else {
                setErrorServer('SERVER_RESET')
            }
        }
    }
    return (
        <div className="custom-container mb-[3rem]" >
            <div className={style.headPage} >
                <BsChevronRight onClick={() => router.back()} />
                <span>اضاغه کردن نوبت</span>
            </div>
            {curentUser ?
                <>
                    {
                        curentWork === 'date' &&
                        <div className="my-8" >
                            <PersianCalendar presetDates={appointmentFech} empetyDates={empetyDates} value={appointment} setappointment={setappointment} />
                        </div>
                    }
                    <Modal isOpen={open} onClose={() => setOpen(false)} title='ساعت های کاری خود را انتخاب کنید.' size="md">
                        <div className={style.Hours} >
                            {listHours.map((hours, index) => {
                                return (
                                    <span key={index} className={handleActiveHours(hours) ? style.ActiveHours : null} onClick={() => handleChangeHours(hours)}> {hours} </span>
                                )
                            })
                            }
                        </div>
                    </Modal>
                    {
                        curentWork === 'hours' &&
                        <>
                            <span className="block mb-2 font-bold text-[18px] text-minColor_litgh " > انتخاب ساعت کاری </span>
                            <div className={style.dateBox}>
                                {appointment.length > 0 &&
                                    <>
                                        {
                                            appointment.map((date, ind) => {
                                                return (
                                                    <div key={ind} className={style.itemDate} >
                                                        {date.hours?.length > 0 ?
                                                            <span span onClick={() => clickModal(date)} className="cursor-pointer block bg-[#3ccd65] text-[#fff] rounded p-2 ">{date.date ? date.date : date}</span>
                                                            :
                                                            <span span onClick={() => clickModal(date)} className="cursor-pointer block bg-[#c2c2c2] text-[#fff] rounded p-2 ">{date.date ? date.date : date}</span>

                                                        }
                                                    </div>
                                                )
                                            })
                                        }
                                    </>
                                }

                            </div>
                        </>
                    }
                    {curentWork === 'date' ? <>
                        {appointment.length > 0 ?
                            <button className={style.btnSendWork} onClick={() => setcurentWork('hours')} > انتخاب ساعت تاریخ ها </button>
                            :
                            <button className={style.btnSendWorkNodrop} onClick={() => setcurentWork('hours')} > انتخاب ساعت کاری ها </button>
                        }</> : null}
                    {curentWork === 'hours' &&
                        <button className={style.btnSendWork} onClick={() => setcurentWork('date')} > برگشت به تاریخ </button>
                    }
                    {curentWork === 'hours' &&
                        <>
                            {handleVlidBtnSendDate() ?
                                <button className={style.sendDate} onClick={sendData} > ارسال تاریخ </button>
                                :
                                <button className={style.sendDateNodrap}  > ارسال تاریخ </button>
                            }
                        </>
                    }
                </>
                :
                <SpinnerLoading />
            }
        </div >
    );
}

export default AddAppointment;