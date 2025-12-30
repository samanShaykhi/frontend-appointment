'use client'
import { BsChevronRight } from 'react-icons/bs';
import style from './ConsultantSingle.module.css'
import { useRouter } from 'next/navigation';
import { FaLinkedin, FaPlus, FaShareNodes, FaStar, FaWhatsapp } from 'react-icons/fa6';
import { HiUserGroup } from 'react-icons/hi2';
import { useEffect, useState } from 'react';
import { TiMinus } from "react-icons/ti";
import { SlLike } from "react-icons/sl";
import { IoCopyOutline } from 'react-icons/io5';
import { RiAlarmWarningLine, RiShareFill } from "react-icons/ri";
import { toGregorian, toJalaali } from 'jalaali-js';
import Link from 'next/link';
import { BiLogoTelegram } from 'react-icons/bi';
import ShareButtons from '@/components/utils/ShareButtons/ShareButtons';
import { baseUrl } from '@/components/utils/url';
import Image from 'next/image';
import CopyLinkButton from '@/components/utils/ShareButtons/CopyLinkButton';
import { ContextStates } from '@/components/utils/context/Index';
import { axiosConfig } from '@/components/utils/axios';
import Comment from '../../Comment/Comment';
import ServerError from '../../utils/ErrorPages/ServerError';
import ServerReset from '../../utils/ErrorPages/ServerReset';
import SpinnerLoading from '@/components/utils/Spinner/SpinnerLoading'; import { messageCustom } from '@/components/utils/message/message';
;
function ConsultantSingle({ consultant }) {
    const router = useRouter()
    const [getFormComments, setgetFormComments] = useState()
    const [comments, setcomments] = useState()
    const [limitDisComment, setlimitDisComment] = useState(8)
    const [getdata, setgetdata] = useState(false)
    const [noneAp, setnoneAp] = useState(false)
    const [modal, setmodal] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const [ErrorServer, setErrorServer] = useState();
    const { curentUser, funcGetUserFromNot } = ContextStates()

    useEffect(() => {
        if (!curentUser) {
            funcGetUserFromNot()
            return
        }
        const fechdata = async () => {
            try {
                const getStep = await axiosConfig(`/comment/getcommentsfromuser/${consultant.consultant._id}`)
                setgetFormComments(getStep.data.comments)
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
        fechdata()
    }, [curentUser, getdata])

    useEffect(() => {
        const fechComments = async () => {
            try {
                const getStep = await axiosConfig(`/comment/getcommentsconsultant/${consultant.consultant._id}`)
                setcomments(getStep.data.comments)
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
        fechComments()
    }, [])

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
        return () => {
            document.body.style.overflow = ''
        }
    }, [isOpen, modal])
    useEffect(() => {
        if (modal) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
        return () => {
            document.body.style.overflow = ''
        }
    }, [modal])

    if (ErrorServer === 'SERVER_ERROR') {
        return (
            <ServerError />
        )
    } else if (ErrorServer === 'SERVER_RESET') {
        return (
            <ServerReset />
        )
    }

    function jalaliTimeToDate(jDateStr, timeStr) {
        const [jy, jm, jd] = jDateStr.split("/").map(Number);
        const { gy, gm, gd } = toGregorian(jy, jm, jd);
        const [h, m] = timeStr.split(":").map(Number);

        // ساخت تاریخ براساس ساعت محلی (نه UTC)
        return new Date(gy, gm - 1, gd, h, m, 0);
    }


    function formatJalaliDate(jDateStr) {
        const [jy, jm, jd] = jDateStr.split("/").map(Number);

        const { gy, gm, gd } = toGregorian(jy, jm, jd);

        // تاریخ میلادی درست می‌سازیم به ساعت محلی ایران
        const date = new Date(gy, gm - 1, gd);

        // روز هفته میلادی
        const weekdayIndex = date.getDay(); // 0 = Sunday, 1 = Monday, ...

        // جدول روزهای شمسی
        const persianWeekdays = ["یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنجشنبه", "جمعه", "شنبه"];

        const weekday = persianWeekdays[weekdayIndex]; // تبدیل روز میلادی به شمسی

        const months = ["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور", "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"];

        return `${weekday}، ${jd} ${months[jm - 1]} ${jy}`;
    }


    function getFirstAvailableDateFormatted(dya, reservedSlots) {
        const now = new Date();
        const candidates = [];

        for (const day of dya) {
            const reserved = reservedSlots
                .filter(r => r.date === day.date)
                .map(r => r.hourse);

            for (const t of day.horse) {
                if (!reserved.includes(t)) {
                    const d = jalaliTimeToDate(day.date, t);
                    if (d >= now) candidates.push(d);
                }
            }
        }

        if (candidates.length === 0) return setnoneAp(true)

        const next = candidates.sort((a, b) => a - b)[0];
        return formatJalaliDate(
            toJalaali(next.getFullYear(), next.getMonth() + 1, next.getDate()).jy + "/" +
            toJalaali(next.getFullYear(), next.getMonth() + 1, next.getDate()).jm + "/" +
            toJalaali(next.getFullYear(), next.getMonth() + 1, next.getDate()).jd
        );
    }

    function timeAgoJalali(date) {
        const now = new Date();
        const target = new Date(date);

        const jNow = toJalaali(now);
        const jTarget = toJalaali(target);

        const yearDiff = jNow.jy - jTarget.jy;
        if (Math.abs(yearDiff) > 0) {
            return yearDiff > 0
                ? `${yearDiff} سال پیش`
                : `${Math.abs(yearDiff)} سال بعد`;
        }

        const monthDiff = jNow.jm - jTarget.jm;
        if (Math.abs(monthDiff) > 0) {
            return monthDiff > 0
                ? `${monthDiff} ماه پیش`
                : `${Math.abs(monthDiff)} ماه بعد`;
        }

        const dayDiff = Math.floor(
            (now - target) / (24 * 60 * 60 * 1000)
        );

        if (Math.abs(dayDiff) > 0) {
            return dayDiff > 0
                ? `${dayDiff} روز پیش`
                : `${Math.abs(dayDiff)} روز بعد`;
        }

        return 'امروز';
    }
    return (
        <div className="custom-container mb-[2rem]" >
            <div
                className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center transition-opacity duration-300 z-[9999] ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                    }`}
            >
                {/* Modal box */}
                <div
                    className={`bg-white rounded-lg p-6 max-w-sm w-full shadow-lg transform transition-transform duration-300 z-[10000] ${isOpen ? 'scale-100' : 'scale-90'
                        }`}
                >
                    <div className={style.boxIconeSh} >
                        <ShareButtons />
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="px-4 py-2 bg-red-500 text-white rounded"
                    >
                        بستن
                    </button>
                </div>
            </div>
            <div className={`${style.videoConsultan} relative`} >
                <video className='rounded-b-2xl w-full object-cover h-[270px]' src='/video/0_3.mp4' poster={`${baseUrl}/public/consultant/images/${consultant.consultant.image}`} controls>
                    <source src='/video/0_3.mp4' type="video/mp4" />
                </video>
                <div className={style.btnHeadVideo} >
                    <BsChevronRight onClick={() => router.push('/')} />
                    <FaShareNodes onClick={() => setIsOpen(true)} />
                </div>
            </div>
            <div className={style.SpecificationsConsultant} >
                <div className={style.infConsultant} >
                    <h1> {consultant.consultant.firstName} {consultant.consultant.lastName}</h1>
                    <h3> {consultant.consultant.education} </h3>
                </div>
                <div className={style.InfComments} >
                    {consultant.consultant.score ? <div>
                        <FaStar className='text-yellow-300' />
                        <span className='mx-[4px] text-[13.2px]'>{Math.round(consultant.consultant.score) < 1 ? 1 : Math.round(consultant.consultant.score)}</span>
                        {comments && <span className='text-[#cacaca] text-[13.2px]' >  {comments.length > 0 ? <>({comments.length} نظر)</> : ''} </span>}
                    </div> :
                        <div>
                            <FaStar className='text-yellow-300' />
                            <span className='mx-[4px] text-[13.2px]'>4.4</span>
                            {comments && <span className='text-[#cacaca] text-[13.2px]' >  {comments.length > 0 ? <>({comments.length} نظر)</> : ''} </span>}
                        </div>
                    }
                    <div className='mt-[4px]'>
                        <  HiUserGroup className='text-blue-400 ml-[4px]' />
                        {consultant.consultant.numberClients ?
                            <span className='text-[13.2px] font-bold' >{consultant.consultant.numberClients} مراجع تا به امروز</span>
                            :
                            <span className='text-[13.2px] font-bold' >100 مراجع تا به امروز</span>
                        }
                    </div>
                </div>
            </div>
            {/* <div className={`${style.categoryConsultant} flex flex-wrap`} >
                {consultant.consultant.relatedCategories.slice(0, numdisItem).map((item, index) => {
                    return (
                        <div key={index} className='flex items-center' >
                            <span className='text-[13px]'>{item}</span>
                            {consultant.consultant.relatedCategories.length !== index + 1 && <div className='h-3 w-[2px] bg-purple-brand-color-40 mx-1 bg-[#b8cdff]' ></div>}
                        </div>
                    )
                })
                }
                {numdisItem < consultant.consultant.relatedCategories.length && <span onClick={() => setnumdisItem(consultant.consultant.relatedCategories.length)} className='flex items-center text-[#3cce3c] mr-[4px] cursor-pointer' > <FaPlus className='text-[10px] ml-1' /> مشاهده بیشتر </span>}
                {numdisItem === consultant.consultant.relatedCategories.length && <span onClick={() => setnumdisItem(10)} className='flex items-center text-[red] mr-[4px] cursor-pointer' > <TiMinus className='text-[10px] ml-1' /> مشاهده کمتر </span>}
            </div> */}
            <div className={style.propertisConsultant} >
                <div>
                    <span>تجربه کاری</span>
                    <span>{consultant.consultant.experience} سال</span>
                </div>
                <div className='h-4 w-[1px] bg-purple-brand-color-40 mx-4 flex-none bg-[#b8cdff]' ></div>
                <div>
                    <span>مدرک</span>
                    <span> {consultant.consultant.education} </span>
                </div>
                <div className='h-4 w-[1px] bg-purple-brand-color-40 mx-4 flex-none bg-[#b8cdff]' ></div>
                <div>
                    <span>پ.ن روانشناسی</span>
                    <span>۱۹۶۷۰۰۷</span>
                </div>
                <div className='h-4 w-[1px] bg-purple-brand-color-40 mx-4 flex-none bg-[#b8cdff]' ></div>
                <div>
                    <span>ش.ن روانشناسی</span>
                    <span>۱۵۴۵۳</span>
                </div>
            </div>
            <div className={style.reservationBox} >
                <div className={style.timeItem} >
                    <span>نزدیک‌ترین وقت مشاور</span>
                    {noneAp && <button>  در حال حاضر نوبت خالی وجود ندارد </button>}
                    {!noneAp && <span>{getFirstAvailableDateFormatted(consultant.dates, consultant.reservtions)}</span>}

                </div>
                <div className={style.PriceItem}>
                    <span>هر جلسه</span>
                    <span className='mr-2' >60 دقیقه</span>
                    <div className='h-4 w-[1px] bg-purple-brand-color-40 mx-4 flex-none bg-[#b8cdff]' ></div>
                    <span>460 هزار تومان</span>
                </div>
                {!noneAp && <div className={style.btnItem} >
                    <Link className={style.reservationBox} href={`/reservations/${consultant.consultant._id}`} >
                        <button >   گرفتن نوبت  </button>
                    </Link>
                </div>}
            </div>
            {comments ?
                <section className={style.CommentsSection}   >
                    <h4 className='text-[18px]'>نظر دیگران راجع به ایشون چیه؟</h4>
                    {comments.length > 0 ?
                        <>
                            {comments.slice(0, limitDisComment).map((item) => {
                                return (
                                    <div key={item._id} className={style.commentItem} >
                                        <div className='flex justify-between items-center mb-[0.874rem]' >
                                            <div>
                                                <div className='flex items-center' >
                                                    <span className='font-bold' > {item.creator?.lastName} </span>
                                                    {/* <span className='font-bold' > {item.creator?.firstName} {item.creator?.lastName} </span> */}
                                                    <span className='text-[#0080cf] text-[18px] mr-[5px]'>جلسه {item.meeting} </span>
                                                </div>
                                                {item.date && <div> <span className='text-[12px] text-[#a0a0a0]' > {timeAgoJalali(item.date)} </span> </div>}
                                            </div>
                                            <span className='bg-[green] rounded-[8px] text-white py-[2px] px-[5px]' >{item.score}</span>
                                        </div>
                                        <div>
                                            <p className='text-justify' >
                                                {item.textBody}
                                            </p>
                                        </div>
                                    </div>

                                )
                            })

                            }
                        </>
                        :
                        <div className={style.commentItem} >
                            <div className='flex justify-between items-center mb-[0.874rem]' >
                                <div>
                                    <div className='flex items-center' >
                                        <span className='font-bold' >کاربر برنامه رزرو نوبت</span>
                                        <span className='text-[#0080cf] text-[18px] mr-[5px]'>جلسه یکم </span>
                                    </div>
                                    <div> <span className='text-[12px] text-[#a0a0a0]' >2 روز پیش</span> </div>
                                </div>
                                <span className='bg-[green] rounded-[8px] text-white py-[2px] px-[5px]' >5.0</span>
                            </div>
                            <div>
                                <p className='text-justify' >
                                    عالی بود و رضایت کامل دارم و میخوام جلسات زیادی با خانم کریمی داشته باشم بسیار مهربان هستند و فوق العاده صمیمانه برخورد میکنن بسیار عاااالی🥰🥰
                                </p>
                            </div>
                        </div>

                    }

                    {comments.length > limitDisComment &&
                        <div className='text-center text-[14px]' >
                            <button onClick={() => setlimitDisComment(comments.length)} > + مشاهده همه نظرات</button>
                        </div>}
                </section>
                :
                <SpinnerLoading />
            }
            {
                getFormComments?.length > 0 &&
                <div className='my-[1.5rem]' >
                    {getFormComments.map(item => {
                        return (
                            <div key={item._id}>
                                <Comment setgetdata={setgetdata} commentItem={item} />
                            </div>
                        )
                    })

                    }
                </div>
            }

            <div className={style.BoxShare} >
                <div>
                    <Image width={44} height={44} src={`${baseUrl}/public/consultant/images/${consultant.consultant.image}`} alt={`${consultant.consultant.firstName} ${consultant.consultant.lastName}`} />
                    <span className='text-[#0065a8] ml-1' > {consultant.consultant.firstName} {consultant.consultant.lastName} </span>
                    <span>را به دیگران معرفی کنید.</span>
                </div>
                <div className={style.shareBtns} >
                    <CopyLinkButton />
                    <button>
                        <RiShareFill onClick={() => setIsOpen(true)} />
                    </button>
                </div>
            </div>
            {/* Modal */}
            {
                modal && <>
                    <div className={style.modal} >
                        <span className='text-[#d70000]' >شرایط جلسه فوری:</span>
                        <ul>
                            <li>جلسات فوری، تنها در صورتی که مشاور درخواست شما را قبول کند، نهایی می‌شوند.</li>
                            <li>هزینه جلسه فوری میترا احمدی 300 هزار تومان به ازای 45 دقیقه است.</li>
                            <li>بعد از ثبت درخواست، جلسه شما نهایتا تا 2 روز آینده برگزار خواهد شد.</li>
                        </ul>
                        <div>
                            <button onClick={() => setmodal(false)} > درخواست جلسه فوری </button>
                            <button onClick={() => setmodal(false)}> انصراف </button>
                        </div>
                    </div>
                    <div onClick={() => setmodal(false)} className={style.bgModal}></div>
                </>
            }
            {/* Modal */}
            <div className={style.getRes} >
                <RiAlarmWarningLine onClick={() => setmodal(true)} />
                <span onClick={() => setmodal(true)} > برای امروز جلسه می‌خوام </span>
            </div>
        </div >
    );
}

export default ConsultantSingle;