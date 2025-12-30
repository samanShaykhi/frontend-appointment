'use client'
import { useRouter } from 'next/navigation';
import style from './Support.module.css'
import { FaAngleRight } from 'react-icons/fa6';
import { BsChevronRight } from 'react-icons/bs';
import Link from 'next/link';
function Support() {
    const router = useRouter()
    return (
        <div className="custom-container pt-4 h-[98vh] flex flex-col" >
            <div className={style.headPage} >
                <BsChevronRight onClick={() => router.back()} />
                <span>پشتیبانی</span>
            </div>
            <div className='mt-auto' >
                <Link href='/support/send-request'>
                    <button className={style.btnSendOderPAge} >   ثبت درخواست پشتیبانی  </button>
                </Link>
            </div>
        </div>
    );
}

export default Support;