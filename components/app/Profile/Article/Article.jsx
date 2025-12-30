'use client'
import { useRef, useState } from "react";
import EditorCustom from "./CkEditor/EditorCustom";
import { TfiGallery } from "react-icons/tfi";
import styles from './Article.module.css'
import { MdOutlineMonochromePhotos } from "react-icons/md";
import { BiSend, BiSolidMessageError } from "react-icons/bi";
import { useRouter } from "next/navigation";
import { schemaValidInpArt } from "@/components/utils/validationInput";
import { messageCustom } from "@/components/utils/message/message";
import Gallery from "../../utils/Gallery/Gallery";
import { axiosConfig } from "@/components/utils/axios";
import { ContextStates } from "@/components/utils/context/Index";
import ServerError from "../../utils/ErrorPages/ServerError";
import ServerReset from "../../utils/ErrorPages/ServerReset";
import AccessibilityError from "../../utils/ErrorPages/AccessibilityError";
function Article() {
    const router = useRouter()
    const { BodyEditorArt, ChangeEditorArt } = ContextStates()
    const [metaDiscription, setmetaDiscription] = useState('')
    const [thumbnail, setthumbnail] = useState()
    const [articleTitle, setarticleTitle] = useState('')
    const [errors, setErrors] = useState({}); // error validation
    const [errorsBack, setErrorsBack] = useState([]); // error validation
    const [activeModalImgUploader, setactiveModalImgUploader] = useState(false)
    const [preview, setPreview] = useState(null);
    const fileInputRef = useRef();
    const metaDiscriptionRef = useRef();
    const thumbnailRef = useRef();
    const articleTitleRef = useRef();
    const bodyRef = useRef();
    const bgErrorBackREf = useRef();
    const [ErrorServer, setErrorServer] = useState();
    const handleChangeThumbnail = (event) => {
        if (!event) return
        if (event.length > 0) {
            setthumbnail(event[0])

            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(event[0]);
        }
    }
    // schemaValidInpArt
    const artSend = async (event) => {
        event.preventDefault()
        const formData = new FormData()
        formData.append('metaDiscription', metaDiscription)
        formData.append('articleTitle', articleTitle)
        formData.append('body', BodyEditorArt)
        formData.append('thumbnail', thumbnail)
        const jsonWeb = { thumbnail, articleTitle, metaDiscription, body: BodyEditorArt }
        try {
            await schemaValidInpArt.validate(jsonWeb, { abortEarly: false });
            const fechData = await axiosConfig('/article/artadd', {
                method: "POST",
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                data: formData,
            })
            if (fechData.status === 201) {
                setPreview('')
                setthumbnail('')
                setarticleTitle('')
                setmetaDiscription('')
                ChangeEditorArt('')
                setErrors({})
                setErrorsBack([])
                messageCustom('مقاله اضافه شد.', "success", 5000)
                articleTitleRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
            }
        } catch (error) {
            console.log(error)
            ChangeEditorArt('')
            if (error.inner) {
                const newErrors = {};
                error.inner.forEach((e) => {
                    newErrors[e.path] = e.message;
                });
                setErrors(newErrors);
                if (newErrors.articleTitle) return articleTitleRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
                if (newErrors.metaDiscription) return metaDiscriptionRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
                if (newErrors.thumbnail) return thumbnailRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
                if (newErrors.body) return bodyRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
            }

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
        <div className="px-5" >
            <Gallery
                activeModal={activeModalImgUploader}
                setActiveModal={setactiveModalImgUploader}
            />
            <form className={styles.form}>
                <div ref={bgErrorBackREf}>

                    {errorsBack.length > 0 ?
                        <div className={styles.BgErr} >
                            {errorsBack.map((item, index) => {
                                return (
                                    <span key={index} ><BiSolidMessageError /> {item.message} </span>
                                )
                            })
                            }
                        </div>
                        :
                        ''
                    }
                </div>
                <div className={styles.field}>
                    <label htmlFor="articleTitle">عنوان مقاله</label>
                    <input
                        value={articleTitle}
                        ref={articleTitleRef}
                        type="text"
                        name="articleTitle"
                        placeholder="عنوان مقاله"
                        onChange={(e) => setarticleTitle(e.target.value)}
                        autoComplete="off"
                    />
                    {errors.articleTitle && <span className={styles.errorText}><BiSolidMessageError /> {errors.articleTitle}</span>}
                </div>
                <div className={styles.field}>
                    <label htmlFor="metadiscription">متن تگ متادسکریپشن</label>
                    <input
                        value={metaDiscription}
                        ref={metaDiscriptionRef}
                        type="text"
                        name="metadiscription"
                        placeholder="متن تگ متادسکریپشن"
                        onChange={(e) => setmetaDiscription(e.target.value)}
                        autoComplete="off"
                    />
                    {errors.metaDiscription && <span className={styles.errorText}><BiSolidMessageError /> {errors.metaDiscription}</span>}
                </div>
                <div className={styles.field}>
                    <label>پوستر مقاله</label>
                    <input
                        type="file"
                        name="thumbnail"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={(e) => handleChangeThumbnail(e.target.files)}
                        className={styles.hiddenInput}
                    />
                    <button
                        ref={thumbnailRef}
                        type="button"
                        className={styles.uploadBtn}
                        onClick={() => fileInputRef.current.click()}
                    >
                        انتخاب تصویر <MdOutlineMonochromePhotos />
                    </button>
                    {preview && (
                        <div className={styles.previewWrapper}>
                            <img src={preview} alt="preview" className={styles.preview} />
                        </div>
                    )}
                    {errors.thumbnail && <span className={styles.errorText}><BiSolidMessageError /> {errors.thumbnail}</span>}
                </div>
            </form>
            <div className={styles.BTNGallery} >
                <button onClick={() => setactiveModalImgUploader(!activeModalImgUploader)} ><TfiGallery /> گالری عکس ها</button>
            </div>
            <div ref={bodyRef} >
                <EditorCustom />
            </div>
            {errors.body && <span className={styles.errorText}><BiSolidMessageError /> {errors.body}</span>}
            <button onClick={e => artSend(e)} className={styles.submitBtn}>
                <BiSend />  ارسال مقاله
            </button>
        </div>
    );
}
export default Article;