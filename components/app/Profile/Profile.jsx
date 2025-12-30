'use client'
import { Fragment, useEffect, useState } from "react";
import Footer from "../comoon/Footer/Footer";
import style from './Profile.module.css'
import Link from "next/link";
import { FaChevronLeft, FaRegAddressCard, FaUserPen } from "react-icons/fa6";
import { LiaWalletSolid } from "react-icons/lia";
import { MdCastForEducation, MdOutlineSupportAgent } from "react-icons/md";
import { PiWarningCircleLight } from "react-icons/pi";
import { GoLaw } from "react-icons/go";
import { CiLogout } from "react-icons/ci";
import { BsCalendar2Check, BsCalendar2Plus } from "react-icons/bs";
import { ContextStates } from "@/components/utils/context/Index";
import SpinnerLoading from "@/components/utils/Spinner/SpinnerLoading";
import { messageCustom } from "@/components/utils/message/message";
import ServerError from "../utils/ErrorPages/ServerError";
import ServerReset from "../utils/ErrorPages/ServerReset";
import { axiosConfig } from "@/components/utils/axios";
import { useRouter } from "next/navigation";
import { FaBookReader } from "react-icons/fa";
function Profile() {
    const { curentUser, funcGetUser, setcurentUser, setaccessToken } = ContextStates()
    const [ErrorServer, setErrorServer] = useState();
    const router = useRouter()
    useEffect(() => {
        if (curentUser) return
        funcGetUser()
    }, [])
    const handleLogOut = async () => {
        try {
            const getStep = await axiosConfig('/user/logout')
            if (getStep.status === 200) {
                setcurentUser(undefined)
                setaccessToken(undefined)
                router.replace('/')
            }
        } catch (error) {
            if (error.status === 500) {
                setErrorServer('SERVER_ERROR')
            } else if (error.status === 503) {
                messageCustom('error code 503', 'error', 6000);
            } else {
                setErrorServer('SERVER_RESET')
            }
        }
    }

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
        <Fragment>
            <div className={style.ProgileBG} >
                <div className="custom-container" >
                    {curentUser ?
                        <>
                            <div className={style.ProfileMeBox} >
                                <Link href='/profile/view' >
                                    <div className={style.PropertisProfileMe} >
                                        <div>
                                            <FaUserPen />
                                        </div>
                                        <div>
                                            <span>ویرایش اطلاعات کاربری</span>
                                            <span>09168922125</span>
                                        </div>
                                    </div>
                                    <div>
                                        <FaChevronLeft />
                                    </div>
                                </Link>
                            </div>
                            <div className={style.oderPropertis}>
                                <div className={style.PItem} >
                                    <Link href='/profile/wallet'>
                                        <div>
                                            <LiaWalletSolid />
                                            <span>اعتبار کیف پول</span>
                                        </div>
                                        <div className="flex items-center" >
                                            <span className="ml-2" >0 تومان</span>
                                            <FaChevronLeft />
                                        </div>
                                    </Link>
                                </div>
                                <div className={style.PItem} >
                                    <Link href='/support'>
                                        <div>
                                            <MdOutlineSupportAgent />
                                            <span>درخواست پشتیبانی</span>
                                        </div>
                                        <div >
                                            <FaChevronLeft />
                                        </div>
                                    </Link>
                                </div>
                                <div className={style.PItem} >
                                    <Link href='/questions'>
                                        <div>
                                            <MdCastForEducation />
                                            <span>نکات آموزشی</span>
                                        </div>
                                        <div >
                                            <FaChevronLeft />
                                        </div>
                                    </Link>
                                </div>
                                <div className={style.PItem} >
                                    <Link href='/about-us'>
                                        <div>
                                            <PiWarningCircleLight />
                                            <span>درباره ما</span>
                                        </div>
                                        <div >
                                            <FaChevronLeft />
                                        </div>
                                    </Link>
                                </div>
                                <div className={style.PItem} >
                                    <Link href='/rules'>
                                        <div>
                                            <GoLaw />
                                            <span>قوانین و مقررات</span>
                                        </div>
                                        <div >
                                            <FaChevronLeft />
                                        </div>
                                    </Link>
                                </div>
                                {curentUser.role === 'admin' && <div className={style.PItem} >
                                    <Link href='/profile/add-consultant'>
                                        <div>
                                            <FaRegAddressCard />
                                            <span>اضافه کردن مشاور</span>
                                        </div>
                                        <div >
                                            <FaChevronLeft />
                                        </div>
                                    </Link>
                                </div>}
                                {curentUser.role === 'admin' && <div className={style.PItem} >
                                    <Link href='/profile/article'>
                                        <div>
                                            <FaRegAddressCard />
                                            <span>مقالات</span>
                                        </div>
                                        <div >
                                            <FaChevronLeft />
                                        </div>
                                    </Link>
                                </div>}
                                {curentUser.role === 'admin' && <div className={style.PItem} >
                                    <Link href='/profile/comment-status'>
                                        <div>
                                            <FaRegAddressCard />
                                            <span>کامنت های تایید نشده</span>
                                        </div>
                                        <div >
                                            <FaChevronLeft />
                                        </div>
                                    </Link>
                                </div>}
                                {curentUser.role === 'admin' && <div className={style.PItem} >
                                    <Link href='/profile/rlatedexpertise'>
                                        <div>
                                            <FaRegAddressCard />
                                            <span> تخصص های مرتبت </span>
                                        </div>
                                        <div >
                                            <FaChevronLeft />
                                        </div>
                                    </Link>
                                </div>}
                                {curentUser.role === 'consultant' && <div className={style.PItem} >
                                    <Link href='/profile/add-appointment'>
                                        <div>
                                            <BsCalendar2Plus />
                                            <span>اضافه کردن نوبت</span>
                                        </div>
                                        <div >
                                            <FaChevronLeft />
                                        </div>
                                    </Link>
                                </div>}
                                {curentUser.role === 'consultant' && <div className={style.PItem} >
                                    <Link href='/profile/reservations'>
                                        <div>
                                            <FaBookReader />
                                            <span>نوبت های رزرو شده</span>
                                        </div>
                                        <div >
                                            <FaChevronLeft />
                                        </div>
                                    </Link>
                                </div>}
                                <div className={style.PItem} >
                                    <Link href='/profile/reservations-me'>
                                        <div>
                                            <BsCalendar2Check />
                                            <span>نوبت های من</span>
                                        </div>
                                        <div >
                                            <FaChevronLeft />
                                        </div>
                                    </Link>
                                </div>
                                <div className={style.PItem} >
                                    <Link onClick={handleLogOut} href='/'>
                                        <div>
                                            <CiLogout />
                                            <span  >خروج</span>
                                        </div>
                                        <div >
                                            <FaChevronLeft />
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        </>
                        :
                        <SpinnerLoading />
                    }
                </div>
            </div>
            <Footer />
        </Fragment >
    );
}

export default Profile;