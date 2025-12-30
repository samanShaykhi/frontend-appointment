import { axiosConfig } from '@/components/utils/axios';
import { messageCustom } from '@/components/utils/message/message';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Form, Spinner } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import { MdOutlineErrorOutline } from 'react-icons/md';
import ServerError from '../../utils/ErrorPages/ServerError';
import ServerReset from '../../utils/ErrorPages/ServerReset';
import AccessibilityError from '../../utils/ErrorPages/AccessibilityError';
export default function ModalEdite({ curentItem, setShow, show, setupdateFromItems }) {
    const [spinner, setspinner] = useState(false)
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [name, setname] = useState('')
    const [eductionalValidationBtn, seteductionalValidationBtn] = useState('')
    const [serrorValidation, setserrorValidation] = useState({})
    const router = useRouter()
    const [ErrorServer, setErrorServer] = useState();
    useEffect(() => {
        if (!curentItem.name) return
        setname(curentItem.name)
    }, [curentItem])
    const handleSendData = async (e) => {
        e.preventDefault()
        try {
            setserrorValidation({})
            if (!name.length >= 3) return setserrorValidation({ message: 'تخصص نباید از 3 کارکتر کمتر باشد.' })
            setspinner(true)
            const fechData = await axiosConfig(`/rlatedexpertise/updaterlatedexpertise/${curentItem._id}`, {
                method: "PUT",
                data: { name }
            })
            if (fechData.status === 200) {
                setspinner(false)
                setname('')
                messageCustom('تخصص بروز شد', 'success', 4000)
                setupdateFromItems(prev => !prev)
                handleClose()
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
            } else {
                setErrorServer('SERVER_RESET')
            }
        }
    }
    const handleChange = (value) => {
        seteductionalValidationBtn(value)
        setname(value)
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
        <Modal
            show={show}
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
        >
            <Modal.Header closeButton >
                <div className='flex justify-around'>

                    <Modal.Title>ویراش تخصص : {curentItem.name} </Modal.Title>
                </div>
            </Modal.Header>
            <Modal.Body>
                {serrorValidation.message &&
                    <span className='d-flex text-[#a41414] items-center text-[18px] mx-[0.5rem] ' >
                        <MdOutlineErrorOutline className="ml-[0.3rem]" />
                        {serrorValidation.message}
                    </span>
                }
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>تخصص</Form.Label>
                    <Form.Control value={name} autocomplete="off" onChange={e => handleChange(e.target.value)} type="text" placeholder="تخصص" />
                    <Form.Text className="text-muted">
                    </Form.Text>
                </Form.Group>
            </Modal.Body>
            <Modal.Footer>

                {!spinner ?
                    <>
                        <button className='btn-danger-style' onClick={handleClose}>
                            منصرف شدم
                        </button>

                        {(eductionalValidationBtn && name.length >= 3) ?
                            <button className='btn-prym-style' onClick={handleSendData}>بروز رسانی</button>
                            :
                            <button className='btnNodrap'>بروز رسانی</button>
                        }
                    </>
                    :
                    <div className='flex justify-center items-center ' >
                        <Spinner animation="grow" />
                    </div>
                }
            </Modal.Footer>
        </Modal>

    );
}