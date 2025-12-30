"use client"
import { axiosConfig } from '@/components/utils/axios';
import { messageCustom } from '@/components/utils/message/message';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Spinner } from 'react-bootstrap';
import ServerError from '../utils/ErrorPages/ServerError';
import ServerReset from '../utils/ErrorPages/ServerReset';
function Comment({ commentItem, setgetdata }) {
    const router = useRouter()
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [spinner, setspinner] = useState(false);
    const [ErrorServer, setErrorServer] = useState();
    const sendComment = async (e) => {
        e.preventDefault();
        if (rating === 0) {
            messageCustom("لطفا امتیاز  بدهید", 'error', 5000)
            return;
        }
        if (comment.trim().length === 0) {
            messageCustom("نوشتن نظر اجباری است", 'error', 5000)
            return;
        }
        if (comment.trim().length <= 12) {
            messageCustom("نظر شما نباید کمتر از 12 کارکتر باشد", 'error', 5000)
            return;
        }
        if (comment.trim().length >= 500) {
            messageCustom("نظر شما نباید بیشتر از 500 کارکتر باشد", 'error', 5000)
            return;
        }
        try {
            setspinner(true)
            const getStep = await axiosConfig(`/comment/comentuser/${commentItem._id}`, {
                method: "PUT",
                data: { textBody: comment, score: rating }
            })
            if (getStep.status === 200) {
                setspinner(false)
                setgetdata(prev => !prev)
                messageCustom("نظر شما پس از برسی ثبت میشود.نظر شما برای ما اهمیت دارد.", 'success', 5000)
            }
        } catch (error) {
            setspinner(false)

            if (error.status === 401) {
                messageCustom('ورود شما منقضی شده', 'error', 6000);
                return router.replace('/login')
            } else if (error.status === 400) {
                return messageCustom(error.data.message, 'error', 6000);
            } else if (error.status === 404) {
                router.replace('/not-found');
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
        <form
            onSubmit={sendComment}
            className='my-3'
        >
            {commentItem.meeting ? <span className='mt-4 block text-minColor font-bold text-[18px]' > جلسه {commentItem.meeting} </span> : ''}
            <div>
                <label className="my-[0.8rem] block  text-[18px]">نظر شما</label>
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={4}
                    className="w-full p-3 border rounded-xl resize-none focus:outline-none focus:ring"
                    placeholder="نظرتو اینجا بنویس"
                />
            </div>
            <div>
                <span className="mb-[0.8rem] block font-bold text-[18px]">امتیاز </span>
                <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((num) => (
                        <button
                            type="button"
                            key={num}
                            onClick={() => setRating(num)}
                            className={`w-10 h-10 rounded-full border font-semibold transition ${rating >= num
                                ? "bg-minColor text-white"
                                : "bg-white text-black"
                                }`}
                        >
                            {num}
                        </button>
                    ))}
                </div>
            </div>
            {!spinner ?
                <button type="submit" className="w-full py-2 font-semibold text-white bg-minColor rounded-xl mt-[1rem]">
                    ثبت
                </button>
                :
                <span className="block  text-center opacity-[0.3] w-full py-2 font-semibold text-white bg-minColor rounded-xl mt-[1rem] cursor-no-drop">
                    <Spinner size='sm' />
                </span>
            }
        </form>
    );
}

export default Comment;