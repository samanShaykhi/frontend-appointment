import { axiosConfig } from '@/components/utils/axios';
import { messageCustom } from '@/components/utils/message/message';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Spinner } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import ServerError from '../../utils/ErrorPages/ServerError';
import ServerReset from '../../utils/ErrorPages/ServerReset';
import AccessibilityError from '../../utils/ErrorPages/AccessibilityError';
export default function ModalDelete({ curentItem, setShow, show, setupdateFromItems }) {
    const [spinner, setspinner] = useState(false)
    const handleClose = () => setShow(false);
    const router = useRouter()
    const [ErrorServer, setErrorServer] = useState();
    const handleSendData = async (e) => {
        e.preventDefault()
        try {
            setspinner(true)
            const fechData = await axiosConfig(`/rlatedexpertise/deleterlatedexpertise/${curentItem._id}`, {
                method: "DELETE",
            })
            if (fechData.status === 200) {
                setspinner(false)
                messageCustom('تخصص حذف شد', 'success', 4000)
                setupdateFromItems(prev => !prev)
                handleClose()
            }
        } catch (error) {
            setspinner(false)
            if (error.status === 404) {
                router.replace('/not-found');
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
                <Modal.Title> حذف تخصص : {curentItem.name} </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h3>  آیا میخواهید تخصص  <span className='text-[#ff2323] underline  ' > {curentItem.name} </span> حذف شود؟  </h3>
            </Modal.Body>
            <Modal.Footer>
                {!spinner ?
                    <>
                        <button className='btnsecondary' onClick={handleClose}>
                            منصرف شدم
                        </button>

                        <button onClick={handleSendData} className='btn-danger-style'>حذف</button>
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