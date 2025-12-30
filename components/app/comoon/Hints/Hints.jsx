'use client'
import { useRouter } from 'next/navigation';
import style from './Hints.module.css'
import { IoCloseSharp } from "react-icons/io5";
import Image from 'next/image';
import { useState } from 'react';
import hintsJson from './hints.json'
import { MdSkipNext, MdSkipPrevious } from 'react-icons/md';
function Hints() {
    const router = useRouter()
    const [curentHints, setcurentHints] = useState(1)
    let numberPAgeHints = []
    for (let index = 1; index <= hintsJson.hints.length; index++) {
        numberPAgeHints.push(index)
    }
    return (
        <div className="custom-container py-3 h-[100vh] flex flex-col " >
            <div>
                <div className={style.closePAge} onClick={() => router.push('/')} >
                    <IoCloseSharp />
                </div>
                <div className={style.Hints}>
                    {hintsJson.hints.map((item, index) => {
                        return (
                            <div key={index}>
                                {index + 1 === curentHints && <div className={style.ItemHints} >
                                    <Image src={`/images/${item.image}`} width='64' height='64' />
                                    <p className='mt-3' >{item.text}</p>
                                </div>
                                }
                            </div>
                        )
                    })}
                    <div className={style.pagenationHints} >
                        {numberPAgeHints.map((item, index) => {
                            return (
                                <div key={index}>
                                    {item !== curentHints && <span className={style.unActive}></span>}
                                    {item === curentHints && <span className={style.Active}></span>}
                                </div>
                            )
                        })

                        }
                    </div>
                </div>
                <div className={style.HandleControllHints} >
                    <MdSkipNext onClick={() => {
                        if (curentHints < hintsJson.hints.length) {
                            setcurentHints(curentHints + 1)
                        }
                    }} />
                    <MdSkipPrevious onClick={() => {
                        if (curentHints !== 1) {
                            setcurentHints(curentHints - 1)
                        }
                    }} />
                </div>
            </div>
            <div className='mt-auto' >
                <button onClick={() => router.push('/')} className={style.btnPrevios} >  تایید و بازگشت </button>
            </div>
            
        </div>
    );
}

export default Hints;