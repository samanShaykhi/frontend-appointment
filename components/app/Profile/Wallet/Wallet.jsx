'use client'
import { BsChevronRight } from 'react-icons/bs';
import style from './Wallet.module.css'
import { useRouter } from 'next/navigation';
import { LiaWalletSolid } from 'react-icons/lia';
function Wallet() {
    const router = useRouter()
    return (
        <div className="custom-container mb-[3rem]" >
            <div className={style.headPage} >
                <BsChevronRight onClick={() => router.back()} />
                <span>شارژ کیف پول</span>
            </div>
            <div className='flex flex-col mt-[2rem] bg-white rounded-2xl border border-gray-20 p-4' >
                <div className='flex items-center flex-row rounded-lg bg-[#eff8ff] p-4'>
                    <LiaWalletSolid className='text-[28px] ml-3' />
                    <div className='flex flex-col' >
                        <span className="text-[18px] text-[#687a86] ">اعتبار فعلی شما</span>
                        <span class="text-sm font-semibold text-[#0080cf]">0 تومان </span>
                    </div>
                </div>
                <div className={style.inputPrice} >
                    <label>مبلغ اعتبار (تومان)</label>
                    <input placeholder='مبلغ اعتبار را وارد کنید' type="text" />
                </div>
                <div className={style.priceBox} >
                    <h6>حداقل صد هزار تومان</h6>
                    <div>
                        <span> 250 هزار ت </span>
                        <span className='mx-2'> 500 هزار ت </span>
                        <span> ۱ میلیون ت </span>
                    </div>
                </div>
            </div>
            <div className='mt-[1rem]' >
                <button className={style.btnSendData} > افزایش اعتبار </button>
            </div>
        </div>
    );
}

export default Wallet;