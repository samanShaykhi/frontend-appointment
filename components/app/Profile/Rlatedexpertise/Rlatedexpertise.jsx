"use client";
import React, { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { FaEdit } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";
import ModalEdite from "./ModalEdite";
import ModalDelete from "./ModalDelete";
import RlatedexpertiseAdd from "./RlatedexpertiseAdd";
import { axiosConfig } from "@/components/utils/axios";
import { useRouter } from "next/navigation";
import ServerError from "../../utils/ErrorPages/ServerError";
import ServerReset from "../../utils/ErrorPages/ServerReset";
import AccessibilityError from "../../utils/ErrorPages/AccessibilityError";
import { messageCustom } from "@/components/utils/message/message";

export default function Rlatedexpertise() {
    const [showEdite, setshowEdite] = useState(false);
    const [showDelete, setshowDelete] = useState(false);
    const [curentItem, setcurentItem] = useState({})
    const [items, setItems] = useState([]);
    const [updateFromItems, setupdateFromItems] = useState(false)
    const [spiner, setspiner] = useState(false)
    const router = useRouter()
    const [ErrorServer, setErrorServer] = useState();
    useEffect(() => {
        const fechdata = async () => {
            try {
                setspiner(true)
                const getStep = await axiosConfig('/rlatedexpertise/getrlatedexpertise')
                setItems(getStep.data.data)
                setspiner(false)
            } catch (error) {
                setspiner(false)
                if (error.status === 401) {
                    messageCustom('توکن شما منقضی شده.', 'error', 6000);
                    router.replace('/login');
                } else if (error.status === 403) {
                    setErrorServer('ACCESSIBILITY_ERROR')
                } else if (error.status === 500) {
                    setErrorServer('SERVER_ERROR')
                } else if (error.status === 503) {
                    messageCustom(error.data.message, 'error', 6000);
                } else {
                    setErrorServer('SERVER_RESET')
                }
            }

        }
        fechdata()
    }, [updateFromItems])

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
        <>
            {!spiner ? <main className="max-w-xl mx-auto mt-12 mb-5">
                <ModalEdite setupdateFromItems={setupdateFromItems} curentItem={curentItem} setShow={setshowEdite} show={showEdite} />
                <ModalDelete setupdateFromItems={setupdateFromItems} curentItem={curentItem} setShow={setshowDelete} show={showDelete} />
                <RlatedexpertiseAdd setupdateFromItems={setupdateFromItems} />
                <h3 className="block text-[#9d227a] my-4" > تخصص ها </h3>
                {items.map(item => {
                    return (
                        <div
                            key={item._id}
                            className="flex justify-between items-center p-4 my-2 bg-gray-100 rounded-lg shadow cursor-grab active:cursor-grabbing select-none"
                        >
                            <span className="font-medium flex items-center">
                                {item.name}
                            </span>
                            <div className="text-gray-500 text-sm flex items-center">
                                <FaEdit onClick={() => {
                                    setcurentItem(item)
                                    setshowEdite(true)
                                }} className="text-[22px] cursor-pointer mx-2 text-[#6f6fff]" />
                                <AiFillDelete onClick={() => {
                                    setcurentItem(item)
                                    setshowDelete(true)
                                }} className="text-[22px] text-[#ff5367] cursor-pointer" />
                            </div>

                        </div>
                    )
                })
                }
            </main>
                :
                <div className='flex justify-center items-center h-[60vh] ' >
                    <Spinner animation="grow" />
                </div>
            }
        </>
    );
}
