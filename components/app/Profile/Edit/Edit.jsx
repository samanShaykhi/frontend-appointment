'use client'
import { BsChevronRight } from 'react-icons/bs';
import style from './Edite.module.css'
import { useRouter } from 'next/navigation';
import { HiChevronDown } from 'react-icons/hi2';
import { useEffect, useState } from 'react';
import moment from 'jalali-moment';
import { ContextStates } from '@/components/utils/context/Index';
import { axiosConfig } from '@/components/utils/axios';
import { messageCustom } from '@/components/utils/message/message';
import SpinnerLoading from '@/components/utils/Spinner/SpinnerLoading';
import ServerReset from '../../utils/ErrorPages/ServerReset';
import ServerError from '../../utils/ErrorPages/ServerError';

function Edit() {
    const { curentUser, funcGetUser, setcurentUser } = ContextStates()
    useEffect(() => {
        if (curentUser) return
        funcGetUser()
    }, [])
    useEffect(() => {
        if (!curentUser) return
        setemail(curentUser.email)
        setfirstName(curentUser.firstName)
        setlastName(curentUser.lastName)
    }, [curentUser])
    const router = useRouter()

    const [email, setemail] = useState()
    const [emailNewText, setemailNewText] = useState('')
    const [firstName, setfirstName] = useState()
    const [firstNameNewText, setfirstNameNewText] = useState('')
    const [lastName, setlastName] = useState()
    const [lastNameNewText, setlastNameNewText] = useState('')


    const getYear = new Date()
    const formatYear = moment(getYear, 'YYYY').locale('fa').format('YYYY')
    let arrYearBirth = []

    const [ErrorServer, setErrorServer] = useState();
    for (let index = 103; index >= 0; index--) {
        arrYearBirth.push(formatYear - index)
    }
    const handleSendData = async (e) => {
        e.preventDefault()
        try {

            const axiosFech = await axiosConfig('/user/updateusers', {
                method: "PUT",
                headers: { "Content-type": "application/json" },
                data: { firstName, lastName, email, role: curentUser.role }
            })
            if (axiosFech.status === 200) {
                console.log('first')
                setemailNewText('')
                setfirstNameNewText('')
                setlastNameNewText('')
                messageCustom('درخواست شما انجام شد.', 'success', 5000)
                setcurentUser(axiosFech.data.user)
            }
        } catch (error) {
            if (error.status === 404) {
                router.replace('/not-found');
            } else if (error.status === 401) {
                messageCustom('توکن شما منقضی شده.', 'error', 6000);
                router.replace('/login');

            } else if (error.status === 503) {
                messageCustom('error code 503', 'error', 6000);
            } else if (error.status === 500) {
                setErrorServer('SERVER_ERROR')
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
        <div className="custom-container mb-[3rem]" >
            <div className={style.headPage} >
                <BsChevronRight onClick={() => router.back()} />
                <span>اطلاعات من</span>
                <button className='text-green-400' > ثبت </button>
            </div>
            <div className={style.headInfPr} >
                <span>اطلاعات شخصی</span>
                <HiChevronDown />
            </div>
            <div className={style.InpForm} >
                {curentUser ?
                    <form>
                        <div className='my-[2rem]'>
                            <label>نام</label>
                            <input onChange={(e) => {
                                setfirstName(e.target.value)
                                setfirstNameNewText(e.target.value)
                            }} value={firstName} placeholder='نام را بنویسید' type="text" />
                        </div>
                        <div className='my-[2rem]'>
                            <label>نام خانوادگی</label>
                            <input onChange={(e) => {
                                setlastName(e.target.value)
                                setlastNameNewText(e.target.value)
                            }} value={lastName} placeholder='نام خانوادگی را بنویسید' type="text" />
                        </div>
                        <div className='my-[2rem]' >
                            <label>ایمیل</label>
                            <input onChange={(e) => {
                                setemail(e.target.value)
                                setemailNewText(e.target.value)
                            }} value={email} placeholder='ایمیل' type="email" />
                        </div>
                        {/* <div className={style.BtnStatus} >
                        <h5>وضعیت تاهل</h5>
                        <div>
                            <span className={`${style.activeBTN} ml-[5px]`} >مجرد</span>
                            <span className='mr-[5px]'>متاهل</span>
                        </div>
                    </div> */}
                        {/* <div className={`${style.BtnStatus} my-[2rem]`} >
                        <h5>جنسیت</h5>
                        <div>
                            <span className={`ml-[5px]`} >زن</span>
                            <span className={`${style.activeBTN} mr-[5px]`}>مرد</span>
                            <span className='mr-[5px]'>سایر</span>
                        </div>
                    </div> */}
                        {/* <div className={style.DateBirth} >
                        <div className={`${style.ItemBirth} ml-[5px]`} >
                            <label>روز</label>
                            <div onClick={() => setdisDays(true)} className={style.InputDateBirth} ><span> {dayBirth ? dayBirth : 'روز'} </span> <HiChevronDown /> </div>
                            {disDays && <div className={style.ModalDateBirth} >
                                <ul>
                                    {arrDatBirth.map((day, index) => {
                                        return (
                                            <li onClick={() => {
                                                setdayBirth(day)
                                                setdisDays(false)
                                            }} key={index}> {day} </li>
                                        )
                                    })}
                                </ul>
                            </div>}
                            {disDays && <div onClick={() => setdisDays(false)} className=' w-[100%] h-[100%] fixed top-[-16px] right-0 z-[1]'></div>}
                        </div>
                        <div className={`${style.ItemBirth} mr-[5px]`} >
                            <label>ماه</label>
                            <div onClick={() => setdisMonth(true)} className={style.InputDateBirth} ><span> {monthBirth ? monthBirth : 'ماه'} </span> <HiChevronDown /> </div>
                            {disMonth && <div className={style.ModalDateBirth} >
                                <ul>
                                    {arrMonthBirth.map((month, index) => {
                                        return (
                                            <li onClick={() => {
                                                setmonthBirth(month)
                                                setdisMonth(false)
                                            }} key={index}> {month} </li>
                                        )
                                    })}
                                </ul>
                            </div>}
                            {disMonth && <div onClick={() => setdisMonth(false)} className=' w-[100%] h-[100%] fixed top-[-16px] right-0 z-[1]'></div>}
                        </div>
                        <div className={`${style.ItemBirth} mr-[5px]`} >
                            <label>سال</label>
                            <div onClick={() => setdisYear(true)} className={style.InputDateBirth} ><span> {YearBirth ? YearBirth : 'سال'} </span> <HiChevronDown /> </div>
                            {disYear && <div className={style.ModalDateBirth} >
                                <ul>
                                    {arrYearBirth.map((year, index) => {
                                        return (
                                            <li onClick={() => {
                                                setYearBirth(year)
                                                setdisYear(false)
                                            }} key={index}> {year} </li>
                                        )
                                    })}
                                </ul>
                            </div>}
                            {disYear && <div onClick={() => setdisYear(false)} className=' w-[100%] h-[100%] fixed top-[-16px] right-0 z-[1]'></div>}
                        </div>
                    </div> */}
                        {/* <div className='mt-4' >
                        <div className={`${style.ItemBirth}`} >
                            <label>استان محل سکونت</label>
                            <div onClick={() => setdisstates(true)} className={style.InputDateBirth} ><span> {states ? states : 'استان'} </span> <HiChevronDown /> </div>
                            {disstates && <div className={style.ModalDateBirth} >
                                <ul>
                                    <li onClick={() => {
                                        setstates('سایر _ خارج از کشور')
                                        setdisstates(false)
                                    }}> سایر _ خارج از کشور </li>
                                    <li onClick={() => {
                                        setstates('اصفهان')
                                        setdisstates(false)
                                    }}> اصفهان </li>
                                    <li onClick={() => {
                                        setstates('تهران')
                                        setdisstates(false)
                                    }}> تهران </li>
                                </ul>
                            </div>}
                            {disstates && <div onClick={() => setdisstates(false)} className=' w-[100%] h-[100%] fixed top-[-16px] right-0 z-[1]'></div>}
                        </div>
                    </div> */}
                        <div className='mt-[3rem]' >
                            {(firstNameNewText.length >= 4 || lastNameNewText.length >= 4 || emailNewText.length >= 4) ?
                                <button onClick={handleSendData} className={style.btnSendData} >   ارسال درخواست   </button>
                                :
                                <button className={style.sendDateNodrap} >   ارسال درخواست   </button>
                            }
                        </div>
                    </form>
                    :
                    <SpinnerLoading />
                }
            </div>
        </div>
    );
}

export default Edit;