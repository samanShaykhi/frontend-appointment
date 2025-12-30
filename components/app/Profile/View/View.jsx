'use client'
import { useRouter } from 'next/navigation';
import style from './view.module.css'
import { BsChevronRight } from 'react-icons/bs';
import { BiMessageSquareEdit } from 'react-icons/bi';
import Link from 'next/link';
import { ContextStates } from '@/components/utils/context/Index';
import { useEffect } from 'react';
import SpinnerLoading from '@/components/utils/Spinner/SpinnerLoading';
function View() {
    const router = useRouter()
    const { curentUser, funcGetUser } = ContextStates()
    useEffect(() => {
        if (curentUser) return
        funcGetUser()
    }, [])
    return (
        <div className="custom-container" >
            <div className={style.headPage} >
                <BsChevronRight onClick={() => router.back()} />
                <span>اطلاعات من</span>
            </div>
            {curentUser ?
                <div className={style.PersonalInformation} >
                    <div className={style.headInfo} >
                        <span className='text-[17px]'>اطلاعات شخصی</span>
                        <div>
                            <Link href='/profile/edit'>
                                <BiMessageSquareEdit />
                                <span>ویرایش</span>
                            </Link>
                        </div>
                    </div>
                    <div className={style.Information} >
                        <div className={style.infItem} >
                            <span>نام و نام خانوادگی</span>
                            <span> {curentUser.firstName} {curentUser.lastName} </span>
                        </div>
                        <div className={style.infItem} >
                            <span>شماره موبایل</span>
                            <span> {curentUser.phoneNumber} </span>
                        </div>
                        <div className={style.infItem} >
                            <span>تاریخ تولد</span>
                            <span>1378/3/18</span>
                        </div>
                        <div className={style.infItem} >
                            <span>جنسیت</span>
                            <span>سایر</span>
                        </div>
                        <div className={style.infItem} >
                            <span>محل سکونت</span>
                            <span>اصفهان</span>
                        </div>
                    </div>
                </div>
                :
                <SpinnerLoading />

            }

        </div>
    );
}

export default View;