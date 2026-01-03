"use client"
import { useEffect, useState } from "react";
import Footer from "../comoon/Footer/Footer";
import style from './Article.module.css'
import { axiosConfig } from "@/components/utils/axios";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { baseUrl } from "@/components/utils/url";
import SpinnerLoading from "@/components/utils/Spinner/SpinnerLoading";
import ServerError from "../utils/ErrorPages/ServerError";
import ServerReset from "../utils/ErrorPages/ServerReset";
import { messageCustom } from "@/components/utils/message/message";
export default function Article() {
    const [articles, setarticles] = useState()
    const [AllPages, setAllPages] = useState([])
    const [SpinnerFech, setSpinnerFech] = useState(true)
    const [limit, setlimit] = useState(10)
    const searchParams = useSearchParams()
    const curentPage = Number(searchParams.get('page')) || 1
    const [ErrorServer, setErrorServer] = useState();
    useEffect(() => {
        const fechData = async () => {
            try {
                setSpinnerFech(true)
                const getData = await axiosConfig(`/article/getallarticles?page=${curentPage}&limit=${limit}`)
                if (getData.status === 200) {
                    const { articles, pagination } = getData.data
                    setarticles(articles)
                    let CreatePages = []
                    for (let index = 0; index < pagination.totalPages; index++) {
                        CreatePages.push(index + 1)
                    }
                    setAllPages(CreatePages)
                }
                setSpinnerFech(false)
            } catch (error) {
                setSpinnerFech(false)
                if (error.status === 500) {
                    setErrorServer('SERVER_ERROR')
                } else if (error.status === 503) {
                    messageCustom('error code 503', 'error', 6000);
                } else {
                    setErrorServer('SERVER_RESET')
                }
            }
        }
        fechData()
    }, [curentPage])
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
                {!SpinnerFech ?
                    <>
                        {articles ?
                            <>
                                {articles.length > 0 ?
                                    <>
                                        {articles.map((item) => {
                                            return (
                                                <Link key={item._id} href={`/articles/${item.articleTitle.trim().replace(/\s+/g, "-")}`}>
                                                    <div className={style.ItemConsultant} >
                                                        <div className={style.ConsultantBG} >
                                                            <Image width={1000} height={1000} src={`${baseUrl}/${item.thumbnail}`} alt={`${item.firstName} ${item.lastName}`} />
                                                        </div>
                                                        <div className='flex flex-col mr-[10px] w-full' >
                                                            <h3 className="text-black text-[16px]" > {item.articleTitle} </h3>
                                                        </div>
                                                    </div>
                                                </Link>
                                            )
                                        })

                                        }
                                    </>
                                    :
                                    <span>  مقاله ای وجود ندارد </span>
                                }
                            </>
                            :
                            <span> در حال حاضر مقاله ای وجود ندارد </span>
                        }
                        {AllPages.length > 0 &&
                            <div className='flex justify-center' >
                                <ul className="flex flex-wrap" >
                                    {AllPages.map((item, index) => {
                                        return (
                                            <Link className={item === curentPage ? 'bg-minColor text-white p-2 rounded-sm mx-2' : "text-black p-2 rounded-sm mx-2"} href={`?page=${item}`} key={index}>
                                                <li  > {item} </li>
                                            </Link>
                                        )
                                    })
                                    }
                                </ul>
                            </div>

                        }
                    </>
                    :
                    <SpinnerLoading />
                }
            </div>
            <Footer />
        </div>
    );
}