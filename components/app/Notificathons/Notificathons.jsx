"use client"
import { useEffect, useState } from "react";
import Footer from "../comoon/Footer/Footer";
import { ContextStates } from "@/components/utils/context/Index";
import { BsChevronRight } from "react-icons/bs";
import { useRouter } from "next/navigation";
import style from './Notificathons.module.css'
import { MdOutlineNotificationsActive } from "react-icons/md";
import { FaCaretLeft } from "react-icons/fa6";
import { LuTrash } from "react-icons/lu";
import { OverlayTrigger, Spinner, Tooltip } from "react-bootstrap";
import { axiosConfig } from "@/components/utils/axios";
import SpinnerLoading from "@/components/utils/Spinner/SpinnerLoading";
import { messageCustom } from "@/components/utils/message/message";
import Link from "next/link";
import ServerError from "../utils/ErrorPages/ServerError";
import ServerReset from "../utils/ErrorPages/ServerReset";
import AccessibilityError from "../utils/ErrorPages/AccessibilityError";
function Notificathons() {
    const router = useRouter()
    const [spiner, setspiner] = useState(false)
    const [spinerDelNot, setspinerDelNot] = useState(false)
    const [getdata, setgetdata] = useState(false)
    const [notifications, setnotifications] = useState()
    const { curentUser, funcGetUser, setnumberNot } = ContextStates()
    const [ErrorServer, setErrorServer] = useState();
    useEffect(() => {
        if (!curentUser) {
            funcGetUser()
            return
        }
        const fechdata = async () => {
            try {
                setspiner(true)
                const getStep = await axiosConfig(`/not/getnot/${curentUser.role}`)
                setnotifications(getStep.data.notification)
                setnumberNot(getStep.data.notNum)
                setspiner(false)
            } catch (error) {
                setspiner(false)
                if (error.status === 404) {
                    router.replace('/not-found');
                } else if (error.status === 401) {
                    messageCustom('توکن شما منقضی شده.', 'error', 6000);
                    router.replace('/login');

                } else if (error.status === 403) {
                    setErrorServer('ACCESSIBILITY_ERROR')
                } else if (error.status === 500) {
                    setErrorServer('SERVER_ERROR')
                } else if (error.status === 503) {
                    messageCustom('error code 503', 'error', 6000);
                } else {
                    setErrorServer('SERVER_RESET')
                }
            }

        }
        fechdata()
    }, [curentUser, getdata])

    if (ErrorServer === 'SERVER_ERROR') {
        return (
            <ServerError />
        )
    } else if (ErrorServer === 'SERVER_RESET') {
        return (
            <ServerReset />
        )
    } else if (ErrorServer === 'ACCESSIBILITY_ERROR') {
        return (
            <AccessibilityError />
        )
    }
    const renderTooltip = (props) => (
        <Tooltip className={style.tooltip} id="button-tooltip" {...props}>
            حذف اعلان
        </Tooltip>
    );

    const handleDeletNot = async (itemDelet) => {
        if (!itemDelet) return
        try {
            setspinerDelNot(true)
            const getStep = await axiosConfig(`/not/deletenot/${itemDelet}`, {
                method: "DELETE"
            })
            if (getStep.status === 200) {
                setspinerDelNot(false)
                setgetdata(prev => !prev)
                messageCustom('پیغام حذف شد.', 'success', 5000)
            }
        } catch (error) {

            setspinerDelNot(false)
            if (error.status === 404) {
                router.replace('/not-found');
            } else if (error.status === 401) {
                messageCustom('توکن شما منقضی شده.', 'error', 6000);
                router.replace('/login');

            } else if (error.status === 403) {
                setErrorServer('ACCESSIBILITY_ERROR')
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
        <>
            <div className="custom-container" >
                <div className={style.headPage} >
                    <BsChevronRight onClick={() => router.back()} />
                    <span>اعلان ها</span>
                </div>
                {curentUser && notifications ?
                    <div className={style.listNotBox} >
                        {notifications.length > 0 ?
                            <>
                                {notifications.map(item => {
                                    return (
                                        <div key={item._id} className={style.itemNot} >
                                            <div className={style.disNot} >
                                                <MdOutlineNotificationsActive />
                                                {item.link ?
                                                    <Link href={`/consultant/${item.link}`}>
                                                        <span> {item.text} </span>
                                                    </Link>
                                                    :
                                                    <span> {item.text} </span>
                                                }
                                            </div>
                                            {!spinerDelNot ?
                                                <div onClick={() => handleDeletNot(item._id)} className={style.IconLeNot} >
                                                    <OverlayTrigger
                                                        placement="top"
                                                        delay={{ show: 250, hide: 400 }}
                                                        overlay={renderTooltip}
                                                    >
                                                        <button>
                                                            <LuTrash />
                                                        </button>
                                                    </OverlayTrigger>
                                                </div>
                                                :
                                                <Spinner animation="border" size="sm" />
                                            }
                                        </div>
                                    )
                                })

                                }
                            </>
                            :
                            <span> پیغامی وجود ندارد </span>
                        }


                    </div>
                    :
                    <SpinnerLoading />
                }
            </div >
            <Footer />
        </>
    );
}

export default Notificathons;