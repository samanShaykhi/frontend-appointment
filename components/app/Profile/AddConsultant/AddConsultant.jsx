'use client'
import { useRouter } from 'next/navigation';
import styleExampel from './AddConsultant.module.css'
import { BsChevronRight } from 'react-icons/bs';
import { MdOutlineFileUpload } from 'react-icons/md';
import { useEffect, useRef, useState } from 'react';
import { HiChevronDown } from 'react-icons/hi2';
import { GrFormTrash } from 'react-icons/gr';
import { axiosConfig } from '@/components/utils/axios';
import { BiError } from 'react-icons/bi';
import { messageCustom } from '@/components/utils/message/message';
import { ContextStates } from '@/components/utils/context/Index';
import SpinnerLoading from '@/components/utils/Spinner/SpinnerLoading';
import ServerError from '../../utils/ErrorPages/ServerError';
import ServerReset from '../../utils/ErrorPages/ServerReset';
import AccessibilityError from '../../utils/ErrorPages/AccessibilityError';
function AddConsultant() {
    const { curentUser, funcGetUser } = ContextStates()
    const [experitse, setexperitse] = useState()
    const [arrrelatedCategories, setarrrelatedCategories] = useState([])
    const [copyFRomDisRC, setcopyFRomDisRC] = useState([])
    const [copyFromSearchFRomDisRC, setcopyFromSearchFRomDisRC] = useState([])
    const [spiner, setspiner] = useState(false)
    const [ErrorServer, setErrorServer] = useState();
    const router = useRouter()
    useEffect(() => {
        if (curentUser) return
        funcGetUser()
    }, [])
    useEffect(() => {
        const fechdata = async () => {
            try {
                setspiner(true)
                const getStep = await axiosConfig('/rlatedexpertise/getrlatedexpertise')
                setarrrelatedCategories(getStep.data.data)
                setcopyFromSearchFRomDisRC(getStep.data.data)
                setcopyFRomDisRC(getStep.data.data)
                setspiner(false)
            } catch (error) {
                setspiner(false)
                if (error.status === 401) {
                    messageCustom('توکن شما منقضی شده.', 'error', 6000);
                    router.replace('/login');
                } else if (error.status === 301) {
                    messageCustom('ورودی ها ناقص هستند.', 'error', 6000);
                } else if (error.status === 403) {
                    setErrorServer('ACCESSIBILITY_ERROR')
                } else if (error.status === 500) {
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
    const [messageError, setMessageError] = useState([]);
    //inputs
    const [firstName, setfirstName] = useState()
    const [lastName, setlastName] = useState()
    const [phoneNumber, setphoneNumber] = useState()
    const [education, seteducation] = useState()
    const [AboutMe, setAboutMe] = useState()
    const [amount, setamount] = useState()
    const [experience, setexperience] = useState()
    const [relatedCategories, setrelatedCategories] = useState([])
    const [fileVideo, setfileVideo] = useState()
    const [fileImage, setfileImage] = useState()
    //inputs 


    const [disEducation, setdisEducation] = useState(false)
    const [serchInRelatedCategories, setserchInRelatedCategories] = useState()
    const [disrelatedCategories, setdisrelatedCategories] = useState(false)


    const handleChangeRelatedCategories = (searchValue) => {
        setserchInRelatedCategories(searchValue)
        const filterItem = copyFRomDisRC.filter(item => item.name.includes(searchValue))
        setcopyFromSearchFRomDisRC(filterItem)
    }
    const handleDeletRelatedCategories = (item) => {
        //  find item in source center
        const findItem = arrrelatedCategories.find(findItem => findItem.nameLatin === item.nameLatin)
        //  find item in source center

        // delete item in relatedCategories
        const fillterFromDelet = relatedCategories.filter(filterItem => filterItem.nameLatin !== item.nameLatin)
        setrelatedCategories(fillterFromDelet)
        // delete item in relatedCategories

        // add item in lists 
        const copyArr = [...copyFRomDisRC]
        copyArr.push(findItem)
        setcopyFromSearchFRomDisRC(copyArr)
        setcopyFRomDisRC(copyArr)
        // add item in lists
    }
    const refImage = useRef()
    const handleClickRefImage = () => {
        refImage.current.click()
    }
    const [urlFileImage, seturlFileImage] = useState()
    useEffect(() => {
        if (!fileImage) return
        const fileReader = new FileReader()
        fileReader.readAsDataURL(fileImage)
        fileReader.onload = () => {
            seturlFileImage(fileReader.result)
        }
    }, [fileImage])
    const refVideo = useRef()
    const handleClickRefvideo = () => {
        refVideo.current.click()
    }

    const [urlFileVideo, seturlFileVideo] = useState()
    useEffect(() => {
        if (!fileVideo) return
        const fileReader = new FileReader()
        fileReader.readAsDataURL(fileVideo)
        fileReader.onload = () => {
            seturlFileVideo(fileReader.result)
        }
    }, [fileVideo])
    // تقویم
    // const year = new Date().getFullYear()
    // const month = new Date().getMonth()
    // var date = new Date(year, month, 0).getDate()
    // تقویم
    const YearExperience = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45]
    const [disExperience, setdisExperience] = useState(false)
    // refs
    const refInputFirstName = useRef(null)
    const refInputLastName = useRef(null)
    const refInputPhonNumber = useRef(null)
    const refInputImage = useRef(null)
    const refInputEducation = useRef(null)
    const refInputRelatedCategories = useRef(null)
    const refInputAboutMe = useRef(null)
    const refInputamount = useRef(null)
    const refInputVideo = useRef(null)
    const refInputExperience = useRef(null)
    // refs

    // state Message Validation
    const [messageFirstName, setmessageFirstName] = useState()
    const [messageLastName, setmessageLastName] = useState()
    const [messagePhoneNumber, setmessagePhoneNumber] = useState()
    const [messageImage, setmessageImage] = useState()
    const [messageEducation, setmessageEducation] = useState()
    const [messageRelatedCategories, setmessageRelatedCategories] = useState()
    const [messageAboutMe, setmessageAboutMe] = useState()
    const [messageamount, setmessageamount] = useState()
    const [messageVideo, setmessageVideo] = useState()
    const [messageExperience, setmessageExperience] = useState()
    // state Message Validation

    const sendData = async (e) => {
        e.preventDefault()
        // validation Form
        //validation input
        if (!firstName) {
            setmessageFirstName('نام مشاور الزامی می باشد')
        } else {
            if (firstName.length < 3) {
                setmessageFirstName('نام مشاور نباید کمتر از 3 کاراکتر باشد')
            }
            if (firstName.length > 12) {
                setmessageFirstName('نام مشاور نباید بیشتر از 12 کاراکتر باشد')
            }
        }

        if (!lastName) {
            setmessageLastName('نام خانوادگی مشاور الزامی می باشد')
        } else {
            if (lastName.length < 3) {
                setmessageLastName('نام خانوادگی مشاور نباید کمتر از 3 کاراکتر باشد')
            }
            if (lastName.length > 22) {
                setmessageLastName('نام خانوادگی مشاور نباید بیشتر از 22 کاراکتر باشد')
            }
        }
        if (!phoneNumber) {
            setmessagePhoneNumber('شماره موبایل مشاور الزامی می باشد')
        } else {
            if (phoneNumber.length < 11) {
                setmessagePhoneNumber('شماره موبایل مشاور نباید کمتر از 11 کاراکتر باشد')
            }
            if (phoneNumber.length > 11) {
                setmessagePhoneNumber('شماره موبایل مشاور نباید بیشتر از 11 کاراکتر باشد')
            }
        }
        if (!amount) {
            setmessageamount('مبلغ الزامی می باشد')
        } else {
            if (amount.length < 4) {
                setmessageamount('مبلغ نباید کمتر از4 کاراکتر باشد')
            }
            if (amount.length > 20) {
                setmessageamount('مبلغ نباید بیشتر از 20 کاراکتر باشد')
            }
        }
        if (!AboutMe) {
            setmessageAboutMe('توضیحات مشاور الزامی می باشد')
        } else {
            if (AboutMe.length < 20) {
                setmessageAboutMe('توضیحات مشاور نباید کمتر از 20 کاراکتر باشد')
            }
            if (AboutMe.length > 1000) {
                setmessageAboutMe('توضیحات مشاور نباید بیشتر از 1000 کاراکتر باشد')
            }
        }
        if (!fileImage) setmessageImage('تصویر مشاور آپلود نشده')
        if (!education) setmessageEducation('مدرک تحصیلی مشاور انتخاب نشده')
        if (relatedCategories.length === 0) setmessageRelatedCategories('تخصص های مرتبط مشاور را وارد کنید')
        if (!fileVideo) setmessageVideo('ویدیو مشاور آپلود نشده')
        if (!experience) setmessageExperience('تجربه مشاور وارد نشده')
        //validation input

        // set messages error
        if (!(!firstName || firstName.length < 3 || firstName.length > 12)) setmessageFirstName('')
        if (!(!lastName || lastName.length < 3 || lastName.length > 22)) setmessageLastName('')
        if (!(!phoneNumber || phoneNumber.length < 11 || phoneNumber.length > 11)) setmessagePhoneNumber(undefined)
        if (fileImage) setmessageImage(undefined)
        if (education) setmessageEducation(undefined)
        if (relatedCategories.length > 0) setmessageRelatedCategories(undefined)
        if (!(!AboutMe || AboutMe.length < 20 || AboutMe.length > 1000)) setmessageAboutMe(undefined)
        if (fileVideo) setmessageVideo(undefined)
        if (experience) setmessageExperience(undefined)
        // set messages error

        //scroll postion error

        if (!firstName || firstName.length < 3 || firstName.length > 12) return window.scrollTo(0, refInputFirstName.current.offsetTop)
        if (!lastName || lastName.length < 3 || lastName.length > 22) return window.scrollTo(0, refInputLastName.current.offsetTop)
        if (!phoneNumber || phoneNumber.length < 11 || phoneNumber.length > 11) return window.scrollTo(0, refInputPhonNumber.current.offsetTop)
        if (!fileImage) return window.scrollTo(0, refInputImage.current.offsetTop)
        if (relatedCategories.length === 0) return window.scrollTo(0, refInputRelatedCategories.current.offsetTop)
        if (!amount || amount.length < 20 || amount.length > 1000) return window.scrollTo(0, refInputamount.current.offsetTop)
        if (!AboutMe || AboutMe.length < 20 || AboutMe.length > 1000) return window.scrollTo(0, refInputAboutMe.current.offsetTop)
        if (!fileVideo) return window.scrollTo(0, refInputVideo.current.offsetTop)
        if (!experience) return window.scrollTo(0, refInputExperience.current.offsetTop)

        //scroll postion error

        // validation Form
        try {
            const formData = new FormData()
            if (fileImage) formData.append('image', fileImage)
            if (fileVideo) formData.append('video', fileVideo)
            if (firstName) formData.append('firstName', firstName)
            if (lastName) formData.append('lastName', lastName)
            if (phoneNumber) formData.append('phoneNumber', phoneNumber)
            if (education) formData.append('education', education)
            if (relatedCategories.length > 0) formData.append('relatedCategories', JSON.stringify(relatedCategories))
            if (experience) formData.append('experience', experience)
            if (amount) formData.append('amount', amount)
            if (AboutMe) formData.append('AboutMe', AboutMe)
            formData.append('role', 'consultant')
            const fechData = await axiosConfig('/consultant/addconsultant', {
                method: "POST",
                data: formData
            })
            if (fechData.status === 201) {
                messageCustom('مشاور اضافه شد', 'success', 5000)
                router.replace('/')
            }
        } catch (error) {
            if (error.status === 401) {
                messageCustom('توکن شما منقضی شده.', 'error', 6000);
                router.replace('/login');
            } else if (error.status === 403) {
                setErrorServer('ACCESSIBILITY_ERROR')
            } else if (error.status === 409) {
                setMessageError([error.data.message])
                window.scrollTo(0, 0)
            } else if (error.status === 301) {
                setMessageError(error.data.message)
                window.scrollTo(0, 0)
            } else if (error.status === 400) {
                setMessageError([error.data.message])
                window.scrollTo(0, 0)
            } else if (error.status === 500) {
                setErrorServer('SERVER_ERROR')
            } else if (error.status === 503) {
                setMessageError([error.data.message])
                window.scrollTo(0, 0)
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
    } else if (ErrorServer === 'ACCESSIBILITY_ERROR') {
        return (
            <AccessibilityError />
        )
    }
    return (
        <div className="custom-container mb-[3rem]" >
            {curentUser ?
                <>
                    <div className={styleExampel.headPage} >
                        <BsChevronRight onClick={() => router.back()} />
                        <span>اضاغه کردن مشاور</span>
                    </div>
                    <form onSubmit={sendData} className={styleExampel.formAddConsultant} >
                        {messageError.length > 0 &&
                            messageError.map((m, i) => {
                                return (
                                    <div key={i} >
                                        <span className="flex items-center p-2 my-5 bg-[#dc0000ad] text-[#fff] rounded">
                                            {" "}
                                            <BiError className="ml-1" /> {m}{" "}
                                        </span>
                                    </div>
                                );
                            })}
                        <div ref={refInputFirstName} className={styleExampel.ItemInpCons} >
                            <label className={styleExampel.labelInpSCons} >نام مشاور</label>
                            <input onChange={(e) => setfirstName(e.target.value)} maxLength={12} placeholder='نام مشاور را بنویسید' type="text" />
                            {messageFirstName && <span className='text-[red] block text-[16px] font-bold' > {messageFirstName} </span>}
                        </div>
                        <div ref={refInputLastName} className={styleExampel.ItemInpCons}>
                            <label className={styleExampel.labelInpSCons} >نام خانوادگی مشاور</label>
                            <input maxLength={22} onChange={(e) => setlastName(e.target.value)} placeholder='نام خانوادگی مشاور را بنویسید' type="text" />
                            {messageLastName && <span className='text-[red] block text-[16px] font-bold' > {messageLastName} </span>}
                        </div>
                        <div ref={refInputPhonNumber} className={styleExampel.ItemInpCons}>
                            <label className={styleExampel.labelInpSCons} >شماره موبایل مشاور</label>
                            <input onChange={(e) => setphoneNumber(e.target.value)} placeholder='شماره موبایل مشاور را بنویسید' type="number" />
                            {messagePhoneNumber && <span className='text-[red] block text-[16px] font-bold' > {messagePhoneNumber} </span>}
                        </div>
                        <div ref={refInputamount} className={styleExampel.ItemInpCons}>
                            <label className={styleExampel.labelInpSCons} >مبلغ جلسات</label>
                            <input onChange={(e) => setamount(e.target.value)} placeholder='مبلغ جلسات را بنویسید' type="number" />
                            {messageamount && <span className='text-[red] block text-[16px] font-bold' > {messageamount} </span>}
                        </div>
                        <div ref={refInputImage} className={styleExampel.ItemInpCons}>
                            <label className={styleExampel.labelInpSCons} >آپلود تصویر مشاور</label>
                            <div onClick={handleClickRefImage} className={styleExampel.fileUloudBox} >
                                <input onChange={(e) => {
                                    if (e.target.files[0]) {
                                        setfileImage(e.target.files[0])
                                    }
                                }} ref={refImage} className='hidden' type="file" accept=".jpg,.png,.jpeg" />
                                <span> تصویر مشاور را آپلود کنید</span>
                                <MdOutlineFileUpload />
                            </div>
                            {urlFileImage &&
                                <img className='mt-2 mx-auto' width={120} height={120} src={urlFileImage} alt='upload image' />
                            }
                            {messageImage && <span className='text-[red] block text-[16px] font-bold' > {messageImage} </span>}
                        </div>
                        <div ref={refInputEducation} className={styleExampel.ItemInpCons}>
                            <label className={styleExampel.labelInpSCons} >مدرک تحصیلی مشاور</label>
                            <div className={styleExampel.education} >
                                <input readOnly value={education && education} onClick={() => setdisEducation(true)} placeholder='مدرک تحصیلی مشاور' type='text' />
                                <HiChevronDown />
                                {disEducation &&
                                    <ul>
                                        <li onClick={() => {
                                            seteducation('کارشناسی')
                                            setdisEducation(false)
                                        }} >کارشناسی</li>
                                        <li onClick={() => {
                                            seteducation('کارشناسی ارشد')
                                            setdisEducation(false)
                                        }} >کارشناسی ارشد</li>
                                    </ul>
                                }
                            </div>
                            {disEducation && <div onClick={() => setdisEducation(false)} className='w-[100%] h-[100%] fixed top-0 right-0 z-[1]'></div>}
                            {messageEducation && <span className='text-[red] block text-[16px] font-bold' > {messageEducation} </span>}
                        </div>
                        <div ref={refInputRelatedCategories} className={styleExampel.ItemInpCons}>
                            <label className={styleExampel.labelInpSCons} >تخصص های مرتبط</label>
                            {/* dis relatedCategories  */}
                            {relatedCategories.length > 0 &&
                                <div className='flex flex-wrap' >
                                    {
                                        relatedCategories.map((item, index) => {
                                            return (
                                                <div key={index} className={styleExampel.relatedCategoriesDis} >
                                                    <span>
                                                        {item.name}
                                                    </span>
                                                    <GrFormTrash onClick={() => handleDeletRelatedCategories(item)} />
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            }
                            {/* dis relatedCategories  */}
                            <div className={`${styleExampel.education} z-[2]`} >
                                <input placeholder='جستجو در تخصص ها' onChange={(e) => handleChangeRelatedCategories(e.target.value)} value={serchInRelatedCategories} onClick={() => setdisrelatedCategories(true)} type='text' />
                                <HiChevronDown />
                                {disrelatedCategories &&
                                    <ul>
                                        {copyFromSearchFRomDisRC.length > 0 ?
                                            <>
                                                {copyFromSearchFRomDisRC.map((item, index) => {
                                                    return (
                                                        <li key={index} onClick={() => {
                                                            // remove Item In Arr
                                                            let copyItemDis = [...copyFRomDisRC]
                                                            const deleteItem = copyItemDis.filter(itemFilter => itemFilter.nameLatin !== item.nameLatin)
                                                            setcopyFRomDisRC(deleteItem)
                                                            setcopyFromSearchFRomDisRC(deleteItem)
                                                            // remove Item In Arr

                                                            //add item to arr RelatedCategories
                                                            let copyRelatedCategories = [...relatedCategories]
                                                            copyRelatedCategories.push(item)
                                                            setrelatedCategories(copyRelatedCategories)
                                                            //add item to arr RelatedCategories


                                                            // delete value input
                                                            setserchInRelatedCategories('')
                                                            // delete value input
                                                        }} > {item.name} </li>

                                                    )
                                                })}
                                            </>
                                            :
                                            <span className='block my-[6px] text-center' > هیچ تخصصی وجود ندارد</span>
                                        }
                                    </ul>
                                }
                            </div>
                            {disrelatedCategories && <div onClick={() => {
                                setdisrelatedCategories(false)
                                setserchInRelatedCategories('')
                                setcopyFromSearchFRomDisRC(copyFRomDisRC)
                            }} className='w-[100%] h-[100%] fixed top-0 right-0  z-[1]'></div>}
                            {messageRelatedCategories && <span className='text-[red] block text-[16px] font-bold' > {messageRelatedCategories} </span>}
                        </div>
                        <div ref={refInputAboutMe} className={styleExampel.ItemInpCons} >
                            <label className={styleExampel.labelInpSCons} >درباره مشاور</label>
                            <textarea onChange={(e) => setAboutMe(e.target.value)} maxLength={1000} placeholder='درباره مشاور' ></textarea>
                            {messageAboutMe && <span className='text-[red] block text-[16px] font-bold' > {messageAboutMe} </span>}
                        </div>
                        <div ref={refInputVideo} className={styleExampel.ItemInpCons}>
                            <label className={styleExampel.labelInpSCons} >آپلود ویدیو مشاور</label>
                            <div onClick={handleClickRefvideo} className={styleExampel.fileUloudBox} >
                                <input onChange={(e) => {
                                    if (e.target.files[0]) {
                                        setfileVideo(e.target.files[0])
                                    }
                                }} ref={refVideo} className='hidden' type="file" accept=".mp4" />
                                <span> ویدیو معرفی مشاور را آپلود کنید</span>
                                <MdOutlineFileUpload />
                            </div>
                            {urlFileVideo &&
                                // <video src={urlFileVideo}></video>
                                <video className='rounded-b-2xl w-full object-cover my-3' src={urlFileVideo} controls>
                                    <source src={urlFileVideo} type="video/mp4" />
                                </video>
                                // <img className='mt-2 mx-auto' width={120} height={120} src={urlFileImage} alt='upload image' />
                            }
                            {messageVideo && <span className='text-[red] block text-[16px] font-bold' > {messageVideo} </span>}
                        </div>
                        <div ref={refInputExperience} className={styleExampel.ItemInpCons}>
                            <label className={styleExampel.labelInpSCons} >میزان تجربه مشاور</label>
                            <div className={styleExampel.DateBirth} >
                                <div className={`${styleExampel.ItemBirth} ml-[5px]`} >
                                    <label>تجربه</label>
                                    <input value={experience && experience} placeholder='میزان تجربه مشاور' readOnly onClick={() => setdisExperience(true)} className={styleExampel.InputDateBirth} />
                                    <HiChevronDown className='absolute left-[7px] top-[39px]' />
                                    {disExperience && <div className={styleExampel.ModalDateBirth} >
                                        <ul>
                                            {YearExperience.map((day, index) => {
                                                return (
                                                    <li onClick={() => {
                                                        setexperience(day)
                                                        setdisExperience(false)
                                                    }} key={index}> {day} سال </li>
                                                )
                                            })}
                                        </ul>
                                    </div>}
                                    {disExperience && <div onClick={() => setdisExperience(false)} className=' w-[100%] h-[100%] fixed top-[-16px] right-0 z-[1]'></div>}
                                    {messageExperience && <span className='text-[red] block text-[16px] font-bold' > {messageExperience} </span>}
                                </div>
                            </div>
                        </div>
                        <div className='mt-[3rem]' >
                            <button type='submit' className={styleExampel.btnSendData} >   ثبت درخواست پشتیبانی  </button>
                        </div>
                    </form >
                </>
                :
                <SpinnerLoading />
            }
        </div >
    );
}

export default AddConsultant;