'use client'
import { axiosConfig } from '@/components/utils/axios';
import style from './Login.module.css'
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { PiWarningOctagon } from "react-icons/pi";
import { messageCustom } from '@/components/utils/message/message';
import { ContextStates } from '@/components/utils/context/Index';
import SpinnerLoading from '@/components/utils/Spinner/SpinnerLoading';
import ServerError from '../utils/ErrorPages/ServerError';
import ServerReset from '../utils/ErrorPages/ServerReset';
function Login() {
    const { accessToken, accessTokenLoading, curentPath, setcurentUser, setaccessToken } = ContextStates()
    const router = useRouter()
    useEffect(() => {
        if (accessToken) return router.replace('/profile')
    }, [])
    const [phoneNumber, setphoneNumber] = useState()
    const [messagesError, setmessagesError] = useState([])
    const [ErrorServer, setErrorServer] = useState();
    const sendUser = async () => {
        try {
            const sendData = await axiosConfig('/user/sinin', {
                method: "POST",
                headers: { "Content-type": "application/json" },
                data: { phoneNumber },
            })
            if (sendData.status === 200) {
                messageCustom('ورود انجام شد.', 'success', 5000)
                setaccessToken(sendData.data.accessToken)
                setcurentUser(sendData.data.user)
                console.log(sendData.data)
                if (curentPath) {
                    router.replace(curentPath)
                } else {
                    router.replace('/')
                }
            }
        } catch (error) {
            if (error.status === 301) {
                setmessagesError(error.data.message.errors)
            } else if (error.status === 500) {
                setErrorServer('SERVER_ERROR')
            } else if (error.status === 503) {
                messageCustom('error code 503', 'error', 6000);
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
    }
    return (
        <div className="custom-container">
            {!accessTokenLoading && !accessToken ?
                <>
                    <h4 className="font-semibold text-2xl text-gray-70"> شماره موبایل <br /> خود را وارد کنید </h4>
                    <div>
                        {messagesError.map((error, index) => {
                            return (
                                <div key={index} className='flex items-center my-2 text-[#fc4040]' >
                                    <PiWarningOctagon className='ml-1' />
                                    <span key={index} > {error} </span>
                                </div>
                            )
                        })}
                    </div>
                    <div className={style.inpNumb} >
                        <input onChange={(e) => setphoneNumber(e.target.value)} placeholder='مثال : 09168922125 ' type="text" />
                    </div>
                    <div className='mt-4' >
                        <button onClick={sendUser} className={style.btnSendData} >   ارسال  </button>
                    </div>
                </>
                :
                null
            }
        </div>
    );
}

export default Login;