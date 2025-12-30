"use client"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BsChevronRight } from "react-icons/bs";
import styles from './reserve.module.css'
import { axiosConfig } from "@/components/utils/axios";
import SpinnerLoading from "@/components/utils/Spinner/SpinnerLoading";
import { ContextStates } from "@/components/utils/context/Index";
import ServerError from "../../utils/ErrorPages/ServerError";
import ServerReset from "../../utils/ErrorPages/ServerReset";
import { messageCustom } from "@/components/utils/message/message";

export default function ReservationsMe() {
    const { curentUser, funcGetUser } = ContextStates()
    useEffect(() => {
        if (!curentUser) {
            funcGetUser()
            return
        }
        const fechData = async () => {
            try {
                const reserv = await axiosConfig('reservation/reserveationsuser')
                setspinner(false)
                setreservations(reserv.data.resrvesMe)
            } catch (error) {
                setspinner(false)
                if (error.status === 401) {
                    messageCustom('توکن شما منقضی شده.', 'error', 6000);
                    router.replace('/login');

                } else if (error.status === 503) {
                    messageCustom(error.data.message, 'error', 6000);
                } else if (error.status === 500) {
                    setErrorServer('SERVER_ERROR')
                } else {
                    setErrorServer('SERVER_RESET')
                }
            }
        }
        fechData()
    }, [curentUser])
    const [spinner, setspinner] = useState(true)
    const [reservations, setreservations] = useState([])
    const router = useRouter()
    const [ErrorServer, setErrorServer] = useState();

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
        <div className="custom-container" >


            <div className='headPage' >
                <BsChevronRight onClick={() => router.back()} />
                <span> نوبت های من </span>
            </div>
            {curentUser ?
                <>
                    {!spinner ?
                        <div  >
                            {reservations.length > 0 ?
                                <div className={styles.tabel}>
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>تاریخ</th>
                                                <th>ساعت</th>
                                                <th>مشاور</th>
                                            </tr>
                                        </thead>
                                        {reservations.map((item, i) => (
                                            <tbody key={i}>
                                                <tr>
                                                    <td>{item.date}</td>
                                                    <td>{item.hourse}</td>
                                                    <td>{item.consoltant.firstName} {item.consoltant.lastName} </td>
                                                </tr>
                                            </tbody>
                                        ))}
                                    </table>
                                </div>
                                :
                                <span> هنوز نوبتی رزرو ندارید </span>

                            }

                        </div>

                        :
                        <SpinnerLoading />
                    }
                </>
                :
                <SpinnerLoading />
            }
        </div>
    );
}