import style from './Gallery.module.css'

import { IoMdClose } from "react-icons/io";
import { FiUpload } from "react-icons/fi";
import { useEffect, useState } from "react";
import { BsImages } from "react-icons/bs";
import { SlSizeActual, SlSizeFullscreen } from "react-icons/sl";
import DragDrop from './DragDrop/DragDrop';
import Image from 'next/image';
import { FaRegCopy } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { baseUrl } from '@/components/utils/url';
import { axiosConfig } from '@/components/utils/axios';
import AccessibilityError from '../ErrorPages/AccessibilityError';
import ServerReset from '../ErrorPages/ServerReset';
import ServerError from '../ErrorPages/ServerError';
import { messageCustom } from '@/components/utils/message/message';
export default function Gallery({ activeModal, setActiveModal }) {
    const [getImages, setgetImages] = useState([]);
    const [curentPage, setCurentPage] = useState('images')
    const [sizeWindow, setSizeWindow] = useState('smal')
    const [spinner, setspinner] = useState(false)
    const router = useRouter()
    const [ErrorServer, setErrorServer] = useState();
    useEffect(() => {
        if (activeModal) {
            document.body.style.overflow = "hidden"; // قفل اسکرول
        } else {
            document.body.style.overflow = "auto"; // آزاد کردن
        }

        // پاک‌سازی برای مواقعی که کامپوننت unmount بشه
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [activeModal]);

    useEffect(() => {
        const fechImage = async () => {
            setspinner(true)
            try {
                const fechData = await axiosConfig('/article/getimages')
                setgetImages(fechData.data.images)
                setspinner(false)
            } catch (error) {
                if (error.status === 401) {
                    messageCustom('توکن شما منقضی شده.', 'error', 6000);
                    router.replace('/login');
                } else if (error.status === 403) {
                    setErrorServer('ACCESSIBILITY_ERROR')
                } else if (error.status === 301) {
                    setErrorsBack(error.data.message)
                    window.scrollTo(0, 0)
                } else if (error.status === 500) {
                    setErrorServer('SERVER_ERROR')
                } else if (error.status === 503) {
                    messageCustom('error code 503', 'error', 6000);
                } else {
                    setErrorServer('SERVER_RESET')
                }
            }
        }
        fechImage()
    }, [curentPage])
    const handleCopy = (url) => {
        navigator.clipboard.writeText(url);
        toast.success('آدرس عکس کپی شد')
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
        <div>

            {activeModal && <div onClick={() => setActiveModal(!activeModal)} className={style.bgModal} ></div>}
            <div className={activeModal ? `${style.modalUpload} ${style.activeModal} ` : style.modalUpload} >
                <div className={style.headModal} >
                    <div className={style.closeBtn} >
                        <IoMdClose onClick={() => setActiveModal(!activeModal)} />
                    </div>
                    <div className={style.size} >
                        {sizeWindow === 'smal' && <SlSizeFullscreen onClick={() => setSizeWindow('large')} />}
                        {sizeWindow === 'large' && <SlSizeActual onClick={() => setSizeWindow('smal')} />}
                    </div>
                </div>
                <div className={style.contentModal} >
                    <div className={style.sideBar}>
                        <span className={curentPage === 'images' ? style.activeItem : ''} onClick={() => setCurentPage('images')} > <BsImages /> تصاویر </span>
                        <span className={curentPage === 'upload' ? style.activeItem : ""} onClick={() => setCurentPage('upload')} > <FiUpload /> آپلود تصویر </span>
                    </div>
                    <div className={style.content} >
                        {curentPage === 'images' ?
                            <>
                                {getImages.length > 0 ?
                                    <div className={style.boxGallery} >
                                        {getImages.map((item, index) => {
                                            return (
                                                <div className={style.itemImg} key={index} >
                                                    <div className={style.imgGallery} >
                                                        <Image alt='item gallery' src={`${baseUrl}/public/uploads/images/article/${item}`} width={160} height={160} />
                                                        <div onClick={() => handleCopy(`${baseUrl}/public/uploads/images/article/gallery/${item}`)} className={style.bgImg}> <span>کپی کردن تصویر</span> <FaRegCopy /> </div>
                                                    </div>
                                                </div>
                                            )
                                        })
                                        }
                                    </div>
                                    :
                                    <span> گالری تصاویر خالی است </span>
                                }
                            </>
                            :
                            <DragDrop />
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}