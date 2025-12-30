import { axiosConfig } from "@/components/utils/axios";
import { messageCustom } from "@/components/utils/message/message";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Spinner } from "react-bootstrap";
import Form from 'react-bootstrap/Form';
import { MdOutlineErrorOutline } from "react-icons/md";
import ServerError from "../../utils/ErrorPages/ServerError";
import ServerReset from "../../utils/ErrorPages/ServerReset";
import AccessibilityError from "../../utils/ErrorPages/AccessibilityError";
export default function RlatedexpertiseAdd({ setupdateFromItems }) {
    const [spinner, setspinner] = useState(false)
    const [name, setname] = useState('')
    const [nameLatin, setnameLatin] = useState('')
    const [serrorValidation, setserrorValidation] = useState({})
    const router = useRouter()
    const [ErrorServer, setErrorServer] = useState();
    const handleSendData = async (e) => {
        e.preventDefault()
        try {
            setserrorValidation({})
            if (!name.length >= 3) return setserrorValidation({ message: 'تخصص نباید از 3 کارکتر کمتر باشد.' })
            if (!nameLatin.length >= 3) return setserrorValidation({ message: 'نام لاتین نباید از 3 کارکتر کمتر باشد.' })
            setspinner(true)
            const fechData = await axiosConfig('/rlatedexpertise/addrlatedexpertise', {
                method: "POST",
                data: { name, nameLatin }
            })
            if (fechData.status === 201) {
                setspinner(false)
                setname('')
                setnameLatin('')
                messageCustom('تخصص اضافه شد', 'success', 4000)
                setupdateFromItems(prev => !prev)
            }
        } catch (error) {

            setspinner(false)
            if (error.status === 404) {
                router.replace('/not-found');
            } else if (error.status === 400) {
                messageCustom(error.data.message, 'error', 6000);
            } else if (error.status === 401) {
                messageCustom('توکن شما منقضی شده.', 'error', 6000);
                router.replace('/login');
            } else if (error.status === 403) {
                setErrorServer('ACCESSIBILITY_ERROR')
            } else if (error.status === 500) {
                setErrorServer('SERVER_ERROR')
            } else if (error.status === 503) {
                messageCustom(error.data.message, 'error', 6000);
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
        <div className='container' >

            {!spinner ?
                <Form onSubmit={handleSendData} className='my-5 mx-auto bg-[#fff] shadow-lg p-3 rounded-[1rem]'  >
                    <h3 className="block text-[#9d227a] mb-4" >اضافه کردن تخصص</h3>
                    {serrorValidation.message &&
                        <span className='d-flex text-[#a41414] items-center text-[18px] mx-[0.5rem] ' >
                            <MdOutlineErrorOutline className="ml-[0.3rem]" />
                            {serrorValidation.message}
                        </span>
                    }
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>تخصص</Form.Label>
                        <Form.Control value={name} autocomplete="off" onChange={e => setname(e.target.value)} type="text" placeholder="تخصص" />
                        <Form.Text className="text-muted">
                        </Form.Text>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>تخصص به لاتین</Form.Label>
                        <Form.Control value={nameLatin} autocomplete="off" onChange={e => setnameLatin(e.target.value)} type="text" placeholder="تخصص به لاتین" />
                        <Form.Text className="text-muted">
                        </Form.Text>
                    </Form.Group>
                    {name.length >= 3 && nameLatin.length >= 3 ?
                        <button className="btn-prym-style" type="submit">ارسال</button>
                        :
                        <button className='btnNodrap'>ارسال</button>
                    }
                </Form>
                :
                <div className='flex justify-center items-center h-[60vh] ' >
                    <Spinner animation="grow" />
                </div>
            }
        </div>
    );
}