"use client"
import style from './PageCenter.module.css'
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { BiSolidCalendarMinus } from "react-icons/bi";
import { BsPatchCheckFill } from "react-icons/bs";
import { FaEarthAmericas } from "react-icons/fa6";
import { BiSolidMessageAltDetail } from "react-icons/bi";
import Link from 'next/link';
import Image from 'next/image';
import { baseUrl } from '@/components/utils/url';
import { useRouter } from 'next/navigation';
function PageCenter({ consultant, expertise, articles }) {
    const { push } = useRouter();
    const handleChangSearchParams = (searchItem) => {
        const params = new URLSearchParams();

        params.set('expertise', searchItem.nameLatin);

        push(`/search?${params.toString()}`)
    }
    return (
        <div className='mb-[5rem]' >
            <div className={style.headPageCenter} >
                <div className="custom-container" >
                    <div className={style.contentHeader} >
                        <h4 className={style.headContentTitle} > اپلیکیشن رزور آنلاین نوبت </h4>
                        <div className={style.ConsultantBox}>
                            <h5>دنبال مشاور می‌گردی؟</h5>
                            <p>از اینجا می‌تونی لیست کامل مشاورین رو ببینی و مشاور مناسبت رو انتخاب کنی.</p>
                            <button>
                                <Link href='/search'> <span> لیست مشاورین </span> <MdOutlineKeyboardArrowLeft /> </Link>
                            </button>
                        </div>
                    </div>
                    <div className={style.boxInfHead} >
                        <Link href='/hints'>
                            <Image src='/images/advice.webp' height='48' width='48' alt='نکات آموزشی' />
                            <span> نکات آموزشی پیش از جلسه </span>
                        </Link>
                    </div>
                    <div className='flex my-[1rem]' >
                        <div className={style.boxInfHead} >
                            <Link href='/notifications'>
                                <Image src='/images/supporting.webp' height='48' width='48' alt='اعلانات' />
                                <span> اعلانات </span>
                            </Link>
                        </div>
                        <div className={`${style.boxInfHead} mr-3`} >
                            <Link href='/support'>
                                <Image src='/images/message.webp' height='48' width='48' alt='پشتیبانی' />
                                <span> پشتیبانی </span>
                            </Link>
                        </div>

                    </div>
                </div>
            </div>
            <div className="custom-container" >
                <h4 className={style.ConsultantsTitle} >مشاوران پیشنهادی</h4>


                <div className={style.BoxConsultants} >
                    {consultant.consultant.map((item, i) => {
                        return (
                            <div key={item._id} className={style.ItemConsultant} >
                                <Link href={`consultant/${item._id}`}>
                                    <Image width={1000} height={1000} src={`${baseUrl}/public/consultant/images/${item.image}`} alt=" cosultant" />
                                    <div  >
                                        <h5>{item.firstName} {item.lastName} </h5>
                                        <span> {item.education} </span>
                                    </div>
                                </Link>
                            </div>
                        )
                    })
                    }
                </div>
            </div>
            <div className="custom-container" >
                <div className={style.categoryTitle} >
                    <h4 className={style.ConsultantsTitle} >دسته بندی ها</h4>
                    <Link href='/' >همه</Link>
                </div>
                <div className={style.sectionCategory} >
                    {expertise.map((item) => {
                        return (
                            <div key={item._id} >
                                <span onClick={() => handleChangSearchParams(item)} > {item.name} </span>
                            </div>
                        )
                    })

                    }
                </div>
            </div>
            <div className="custom-container" >
                <h4 className={style.ConsultantsTitle} >چرا ما؟</h4>
                <div className='flex justify-between mb-[14px]' >
                    <div className={style.infMEBox} >
                        <BiSolidCalendarMinus />
                        <span>
                            تمرکز بر رویکردهای به‌روز علمی
                        </span>
                    </div>

                    <div className={style.infMEBox} >
                        <FaEarthAmericas />
                        <span>
                            شرکت در جلسات از سراسر نقاط دنیا
                        </span>
                    </div>
                </div>
                <div className='flex justify-between' >
                    <div className={style.infMEBox} >
                        <BiSolidMessageAltDetail />
                        <span>
                            مشاهده نظرات و سابقه هر مشاور
                        </span>
                    </div>
                    <div className={style.infMEBox} >
                        <BsPatchCheckFill />
                        <span>
                            فقط مشاوران تایید شده توسط ما
                        </span>
                    </div>
                </div>
            </div>
            <div className="custom-container" >
                <h4 className={style.ConsultantsTitle} >مطالب آموزشی</h4>
                <div className='grid grid-cols-2 mt-4 gap-x-3 gap-y-4' >
                    {articles.map((item) => {
                        return (
                            <Link key={item._id} href={`/articles/${item.articleTitle.trim().replace(/\s+/g, "-")}`}>

                                <div className={style.BoxArticleS} >
                                    <Image width={1000} height={1000} src={`${baseUrl}/${item.thumbnail}`} alt=" cosultant" />
                                    <h4>{item.articleTitle}</h4>
                                </div>
                            </Link>
                        )
                    })
                    }
                </div>
            </div>
            <div className="custom-container" >
                <Link href='/articles' >
                    <button className={style.btnMorDis} > مطالب آموزشی بیشتر </button>
                </Link>
            </div>
        </div >
    );
}

export default PageCenter;