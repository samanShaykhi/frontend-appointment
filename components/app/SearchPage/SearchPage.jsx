'use client'
import { CiSearch } from 'react-icons/ci';
import Footer from '../comoon/Footer/Footer';
import style from './SearchPAge.module.css'
import { FiSliders } from "react-icons/fi";
import { useEffect, useState } from 'react';
import { BsPatchCheckFill } from 'react-icons/bs';
import { BiSolidBadgeDollar } from 'react-icons/bi';
import Image from 'next/image';
import { baseUrl } from '@/components/utils/url';
import Link from 'next/link';
import { axiosConfig } from '@/components/utils/axios';
import SpinnerLoading from '@/components/utils/Spinner/SpinnerLoading';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { IoMdCloseCircle } from "react-icons/io";
import ServerReset from '../utils/ErrorPages/ServerReset';
import ServerError from '../utils/ErrorPages/ServerError';
function SearchPage() {
    const [dis_order_box, setDis_order_box] = useState(false)
    const [expertise, setexpertise] = useState()
    const [consultants, setconsultants] = useState([])
    const [spiner, setsetspiner] = useState(true)
    const [spinerDataConsultant, setsetspinerDataConsultant] = useState(true)
    const [searchText, setSearchText] = useState('')
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const [ErrorServer, setErrorServer] = useState();
    const { push, replace } = useRouter();
    useEffect(() => {
        const fechdata = async () => {
            try {
                const getStep = await axiosConfig('/rlatedexpertise/getrlatedexpertisesearchpage')
                setexpertise(getStep.data.data)
                setsetspiner(false)
            } catch (error) {
                setsetspiner(false)
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
    }, [])
    useEffect(() => {
        const expertise = searchParams.getAll('expertise')
        const experience_desc = searchParams.get('experience_desc')
        const searchname = searchParams.get('searchname')
        if (searchname) {
            setSearchText(searchname)
        }
        const send_Data = async () => {
            try {
                let ValidContentEx = undefined
                if (expertise.length !== 0) ValidContentEx = JSON.stringify(expertise)
                const fechData = await axiosConfig('/rlatedexpertise/filterserchpage', {
                    method: 'POST',
                    data: {
                        expertise: searchParams.getAll('expertise'),
                        searchname,
                        experience_desc
                    }
                })
                setconsultants(fechData.data.consultant)
                setsetspinerDataConsultant(false)
            } catch (error) {

                setsetspinerDataConsultant(false)
                if (error.status === 500) {
                    setErrorServer('SERVER_ERROR')
                } else if (error.status === 503) {
                    messageCustom('error code 503', 'error', 6000);
                } else {
                    setErrorServer('SERVER_RESET')
                }
            }
        }
        send_Data()
    }, [searchParams])
    const handleChangSearchParams = (searchItem, remave) => {
        const params = new URLSearchParams(searchParams);
        if (searchItem) {
            params.append('expertise', searchItem.nameLatin);
        }
        if (remave) {
            const all = params.getAll('expertise').filter(v => v !== remave.nameLatin)
            params.delete('expertise')
            all.forEach(v => params.append('expertise', v))
        }
        replace(`${pathname}?${params.toString()}`, { scroll: false });
    }
    useEffect(() => {
        const timer = setTimeout(() => {
            const params = new URLSearchParams(searchParams)
            if (searchText.trim()) {
                params.set('searchname', searchText.trim())
            } else {
                params.delete('searchname')
            }

            replace(`${pathname}?${params.toString()}`, { scroll: false })
        }, 400)

        return () => clearTimeout(timer)
    }, [searchText])

    const handleSort = (add, remove) => {
        const params = new URLSearchParams(searchParams)
        if (add) {
            params.set(add.title, add.content)
        } else if (remove) {
            params.delete(remove.title)
        }
        replace(`${pathname}?${params.toString()}`, { scroll: false });
        setDis_order_box(false)
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
        <div className='mb-[6rem] mt-3' >
            <div className="custom-container" >
                <div className={style.InpSearchBox} >
                    <div >
                        <CiSearch />
                        <input value={searchText} onChange={(e) => setSearchText(e.target.value)} type="text" placeholder='جستجوی نام مشاور یا تخصص' />
                    </div>
                </div>
                <div className={`${style.BoxCategor} flex flex-row gap-x-2 mt-3 overflow-x-auto scrollbar-hide`} >
                    {!spiner ?
                        <>
                            {expertise.map(item => {
                                return (
                                    <>
                                        {!searchParams.getAll('expertise').find(e => e === item.nameLatin) && <button onClick={() => handleChangSearchParams(item)} key={item._id} class="rounded-2xl border border-gray-30 px-3 py-3 text-xs flex-none font-semibold "> {item.name} </button>}
                                        {searchParams.getAll('expertise').find(e => e === item.nameLatin) && <button key={item._id} class="rounded-2xl border border-gray-30 pr-2 pl-[2px] py-3 text-xs flex-none font-semibold bg-[#e2f4ff] flex items-center "> {item.name} <IoMdCloseCircle onClick={() => handleChangSearchParams(null, item)} className='mr-[0.6rem]' size={25} color='red' /> </button>}
                                    </>
                                )
                            })

                            }
                        </>
                        :
                        <> <SpinnerLoading /> </>

                    }
                </div>
                {!spinerDataConsultant ?
                    <>
                        <div className='flex justify-between mt-4 ' >
                            <span> {consultants.length}  مشاور </span>
                            <div className='relative' >
                                <div onClick={() => setDis_order_box(true)} className='flex items-center cursor-pointer' >
                                    <span> بترتیب... </span>
                                    <FiSliders />
                                </div>
                                {dis_order_box && <div onClick={() => setDis_order_box(false)} className='w-[100%] h-[100%] fixed top-0 right-0  z-[1]'></div>}
                                {dis_order_box && <div className='flex flex-col bg-white shadow rounded p-2  z-[2] absolute  w-[150px] right-[-32px] top-[25px]' >
                                    {!searchParams.get('experience_desc') && <button className='text-right' onClick={() => handleSort({ title: "experience_desc", content: "true" })} >بیشترین تجربه</button>}
                                    {searchParams.get('experience_desc') && <button className='flex items-center text-right mt-2 ' onClick={() => handleSort(undefined, { title: "experience_desc" })} > <span className='border-[#c8f9ff] border-b-2' >بیشترین تجربه</span> <IoMdCloseCircle className='mr-[4px]' color='red' /> </button>}
                                    <button onClick={() => setDis_order_box(false)} className='my-2 text-right' >بیشترین امتیاز</button>
                                    <button onClick={() => setDis_order_box(false)} className='text-right' >کمترین مبلغ</button>
                                </div>}
                            </div>
                        </div>
                        <div className={style.boxConsultant}>
                            {consultants.map((item) => {
                                return (
                                    <Link key={item._id} href={`consultant/${item._id}`} >
                                        <div className={style.ItemConsultant} >
                                            <div className={style.ConsultantBG} >
                                                <Image width={1000} height={1000} src={`${baseUrl}/public/consultant/images/${item.image}`} alt={`${item.firstName} ${item.lastName}`} />
                                            </div>
                                            <div className='flex flex-col mr-[10px]' >
                                                <span className='text-black font-bold' > {item.firstName} {item.lastName} </span>
                                                <span className='text-[13.5px] text-[#474747]' > {item.education} </span>
                                                <div className='my-2'>
                                                    <div className={style.propertisConsultant} >
                                                        <BsPatchCheckFill />
                                                        <span> {item.experience} سال سابقه</span>
                                                    </div>
                                                    <div className={style.propertisConsultant}>
                                                        <BiSolidBadgeDollar />
                                                        <span>590 هزار تومان</span>
                                                    </div>
                                                </div>
                                            </div>
                                            {item.score &&
                                                <div className={style.ConsultantScor}>
                                                    <span > {Math.round(item.score) < 1 ? 1 : Math.round(item.score)} </span>
                                                </div>
                                            }
                                        </div>
                                    </Link>
                                )
                            })
                            }
                        </div>
                    </>
                    :
                    <SpinnerLoading />
                }
                <div className={style.ticketBox} >
                    <h5>نمی‌دونی کدوم مشاور رو انتخاب کنی؟</h5>
                    <p>اگه هنوز از انتخاب مشاور مطمئن نیستی، می‌تونی از پشتیبانی پُل کمک بگیری.</p>
                    <div>
                        <button> تماس با پشتیبانی </button>
                        <button> ارسال تیکت </button>
                    </div>
                </div>
            </div>
            <Footer />
        </div >
    );
}

export default SearchPage;