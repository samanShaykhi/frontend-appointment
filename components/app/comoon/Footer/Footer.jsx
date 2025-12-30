"use client"
import style from './Footer.module.css'
import { GrHomeRounded } from "react-icons/gr";
import { CiSearch } from "react-icons/ci";
import { LuCalendarRange } from "react-icons/lu";
import { RxPerson } from "react-icons/rx";
import Link from 'next/link';
import { IoNotificationsSharp } from 'react-icons/io5';
import { useEffect, useState } from 'react';
import { ContextStates } from '@/components/utils/context/Index';
import { axiosConfig } from '@/components/utils/axios';
function Footer() {
    const { curentUser, funcGetUserFromNot, numberNot, setnumberNot } = ContextStates()
    useEffect(() => {
        if (!curentUser) {
            funcGetUserFromNot()
            return
        } else {
            const getNumNot = async () => {
                try {
                    const axiosFech = await axiosConfig(`/not/getnotnum/${curentUser.role}`,)
                    setnumberNot(axiosFech.data.notNum)
                } catch (error) {
                    console.log(error)
                }
            }
            getNumNot()
        }
    }, [curentUser])
    return (
        <div className={style.footerAppBox} >
            <div className={style.propertisBoxFooter} >
                <Link href='/' >
                    <GrHomeRounded />
                    <span>
                        خانه
                    </span>
                </Link>
            </div>
            <div className={style.propertisBoxFooter} >
                <Link href='/search' >
                    <CiSearch />
                    <span>
                        جستجو
                    </span>
                </Link>
            </div>
            <div className={style.propertisBoxFooter} >
                <Link href='/profile/reservations-me'>
                    <LuCalendarRange />
                    <span>
                        جلسات من
                    </span>
                </Link>
            </div>
            {curentUser && <div className={style.propertisBoxFooter} >
                <Link href='/notifications' className='relative' >
                    {numberNot !== 0 && <div className='absolute rounded-[6px] px-[12px] w-[20px] h-[20px] flex justify-center items-center top-[-8px] left-[-1px] bg-[red] text-white' >
                        <span className='text-[10px] text-white' > {numberNot}+ </span>
                    </div>
                    }
                    <IoNotificationsSharp />
                    <span>
                        اعلان ها
                    </span>
                </Link>
            </div >}
            <div className={style.propertisBoxFooter} >
                <Link href='/profile'>
                    <RxPerson />
                    <span>
                        پروفایل
                    </span>
                </Link>
            </div>

        </div >
    );
}

export default Footer;