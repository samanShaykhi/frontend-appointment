"use client"
import { axiosConfig } from "@/components/utils/axios"
import { ContextStates } from "@/components/utils/context/Index"
import { messageCustom } from "@/components/utils/message/message"
import { useEffect, useState } from "react"
import style from './CommentStatus.module.css'
import { BsChevronRight } from "react-icons/bs"
import { useRouter } from "next/navigation"
import SpinnerLoading from "@/components/utils/Spinner/SpinnerLoading"
import { LiaEditSolid } from "react-icons/lia"
import { Modal, Spinner } from "react-bootstrap"
import ServerError from "../../utils/ErrorPages/ServerError"
import ServerReset from "../../utils/ErrorPages/ServerReset"
import AccessibilityError from "../../utils/ErrorPages/AccessibilityError"
export default function CommentStatus() {
    const router = useRouter()
    const { curentUser, funcGetUser } = ContextStates()
    const [refreshState, setrefreshState] = useState(false)
    const [CurentComment, setCurentComment] = useState()
    const [spinner, setspinner] = useState(false)
    const [spinnerBtnStatus, setspinnerBtnStatus] = useState(false)
    const [Comments, setComments] = useState()
    const [show, setShow] = useState(false);
    const [ErrorServer, setErrorServer] = useState();
    const handleClose = () => setShow(false);
    const handleShow = (item) => {
        setCurentComment(item)
        setShow(true)
    };
    useEffect(() => {
        if (!curentUser) {
            funcGetUser()
            return
        }
        const fechdata = async () => {
            try {
                setspinner(true)
                const getData = await axiosConfig("/comment/getcomentsunvalid")
                setComments(getData.data.comments)
                setspinner(false)
            } catch (error) {
                setspinner(false)
                if (error.status === 401) {
                    messageCustom('توکن شما منقضی شده.', 'error', 6000);
                    router.replace('/login');
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
    }, [curentUser, refreshState])

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
    const handleConfirm = async () => {
        try {
            setspinnerBtnStatus(true)
            const getData = await axiosConfig(`comment/comentgetunvalid/${CurentComment._id}`)
            if (getData.status === 200) {
                setspinnerBtnStatus(false)
                handleClose()
                messageCustom('کامنت  تایید شد', 'success', 5000)
                setrefreshState(prev => !prev)
            }

        } catch (error) {
            setspinnerBtnStatus(false)
            if (error.status === 401) {
                messageCustom('توکن شما منقضی شده.', 'error', 6000);
                router.replace('/login');
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
    const handleReject = async () => {
        try {
            setspinnerBtnStatus(true)
            const getData = await axiosConfig(`comment/comentreject/${CurentComment._id}`, {
                method: "DELETE"
            })
            if (getData.status === 200) {
                setspinnerBtnStatus(false)
                handleClose()
                setrefreshState(prev => !prev)
                messageCustom('کامنت  حذف شد', 'success', 5000)
            }
        } catch (error) {
            setspinnerBtnStatus(false)
            if (error.status === 401) {
                messageCustom('توکن شما منقضی شده.', 'error', 6000);
                router.replace('/login');
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
    return (
        <div className="custom-container mb-[3rem]" >
            {CurentComment && <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title> تایین وضعیت کامنت </Modal.Title>
                </Modal.Header>
                <Modal.Body> {CurentComment.textBody} </Modal.Body>
                <Modal.Footer>
                    {!spinnerBtnStatus ?
                        <>
                            <button className="bg-green-700 p-2 rounded text-white" onClick={handleConfirm}>
                                تایید کامنت
                            </button>
                            <button className="bg-red-700 p-2 rounded text-white" onClick={handleReject}>
                                حذف کامنت
                            </button>
                        </> :
                        <Spinner />
                    }
                </Modal.Footer>
            </Modal>}
            <div className={style.headPage} >
                <BsChevronRight onClick={() => router.back()} />
                <span>اضاغه کردن مشاور</span>
            </div>

            {(curentUser && Comments) ?
                <>
                    {Comments?.length > 0 ?
                        <>
                            {Comments.map(item => {
                                return (
                                    <div className="flex items-center justify-between shadow-md my-3 rounded p-4" key={item._id} >
                                        <div> {item.textBody.length > 50 ? item.textBody.slice(0, 50) : item.textBody} {item.textBody.length > 100 && '....'} </div>
                                        <div onClick={() => handleShow(item)}>
                                            <LiaEditSolid className="text-minColor cursor-pointer" size={28} />
                                        </div>
                                    </div>
                                )
                            })

                            }
                        </>
                        :
                        <span>  هیچ کامنتی وجود ندارد</span>
                    }
                </>
                :
                <SpinnerLoading />
            }



        </div>
    );
}