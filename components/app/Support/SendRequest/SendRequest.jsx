'use client'
import { BsChevronRight } from 'react-icons/bs';
import style from './SendRequest.module.css'
import { useRouter } from 'next/navigation';
import { HiChevronDown } from "react-icons/hi2";
import { MdOutlineFileUpload } from 'react-icons/md';
import { useState } from 'react';
function SendRequest() {
    const router = useRouter()
    const [disCategory, setdisCategory] = useState(false)
    const [category, setcategory] = useState()
    return (
        <div className="custom-container pt-4" >
            <div className={style.headPage} >
                <BsChevronRight onClick={() => router.back()} />
                <span>ثبت درخواست پشتیبانی</span>
            </div>
            <div className={style.InpForm} >
                <form>
                    <div>
                        <label>عنوان درخواست</label>
                        <input placeholder='عنوان درخواست را بنویسید' type="text" />
                    </div>
                    <div>
                        <label>متن درخواست</label>
                        <textarea placeholder='متن درخواست خود را اینجا بنویسید...'></textarea>
                    </div>
                    <div className={style.category} >
                        <label>دسته بندی</label>
                        <input value={category ? category : 'دسته بندی'} readOnly onClick={() => setdisCategory(true)} />
                        <HiChevronDown />
                        {disCategory &&
                            <ul>
                                <li onClick={() => {
                                    setcategory('پشتیبانی')
                                    setdisCategory(false)
                                }} >پشتیبانی</li>
                                <li onClick={() => {
                                    setcategory('گزارش مشکل')
                                    setdisCategory(false)
                                }} >گزارش مشکل</li>
                            </ul>
                        }
                    </div>
                    {disCategory && <div onClick={() => setdisCategory(false)} className='w-[100%] h-[100%] fixed top-0 right-0  z-[1]'></div>}
                    <div className={style.fileUpload} >
                        <span>اضافه کردن فایل ضمیمه</span>
                        <MdOutlineFileUpload />
                    </div>
                </form>
            </div>
            <div className='mt-[3rem]' >
                <button className={style.btnSendData} >   ثبت درخواست پشتیبانی  </button>
            </div>
        </div>
    );
}

export default SendRequest;