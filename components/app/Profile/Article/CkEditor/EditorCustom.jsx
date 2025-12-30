import React, { useEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { renderToStaticMarkup } from "react-dom/server";
import { FaImages } from 'react-icons/fa';
import { ContextStates } from '@/components/utils/context/Index';
import Gallery from '@/components/app/utils/Gallery/Gallery';
const JoditEditor = dynamic(() => import('jodit-react'), { ssr: false });
export default function EditorCustom({ editeValue, typeEditor, servise }) {
    const {
        ChangeEditorArt,
        BodyEditorArt,
        ChangeEditorPortfolio,
        portfolioEditorBody,
        servicebody,
        setservicebody,
    } = ContextStates()
    useEffect(() => {
        if (!editeValue) return
        ChangeEditorArt(editeValue)
    }, [])
    const cameraSvgString = renderToStaticMarkup(<FaImages />);
    const [activeModalImgUploader, setactiveModalImgUploader] = useState(false)
    const editor = useRef()
    const [editorChange, seteditorChange] = useState()

    const handleChangeEditor = () => {
        if (typeEditor === 'portfolio') {
            return ChangeEditorPortfolio(editorChange)
        }
        if (typeEditor === 'service') {
            return setservicebody(editorChange)
        }
        ChangeEditorArt(editorChange)
    }


    const config = useMemo(() => ({
        i18n: {
            fa: {
                "bold": "پررنگ",
                "italic": "مورب",
                "underline": "زیرخط‌دار",
                "strikethrough": "خط‌خورده",
                "eraser": "پاک‌کردن فرمت",
                "ul": "فهرست نشانه‌دار",
                "ol": "فهرست شماره‌دار",
                "font": "فونت",
                "fontsize": "اندازه فونت",
                "paragraph": "پاراگراف",
                "lineHeight": "فاصله خطوط",
                "superscript": "بالانویس",
                "subscript": "زیرنویس",
                "classSpan": "افزودن کلاس CSS",
                "file": "درج فایل",
                "image": "درج تصویر",
                "video": "درج ویدیو",
                "spellcheck": "بررسی املایی",
                "speechRecognize": "تبدیل گفتار به متن",
                "cut": "برش",
                "copy": "کپی",
                "paste": "چسباندن",
                "selectall": "انتخاب همه",
                "copyformat": "کپی فرمت",
                "hr": "خط افقی",
                "table": "جدول",
                "link": "درج لینک",
                "symbols": "نمادها",
                "ai-commands": "دستورات هوش مصنوعی",
                "ai-assistant": "دستیار هوشمند",
                "indent": "افزایش تورفتگی",
                "outdent": "کاهش تورفتگی",
                "left": "چپ‌چین",
                "brush": "رنگ متن و پس‌زمینه",
                "undo": "برگرداندن",
                "redo": "انجام دوباره",
                "find": "جستجو",
                "source": "نمایش کد HTML",
                "fullsize": "تمام‌صفحه",
                "preview": "پیش‌نمایش",
                "print": "چاپ",
                "about": "درباره ویرایشگر"
            }
        },
        buttons: [
            "bold", 'italic', 'underline', 'strikethrough', 'eraser', 'ul', 'ol',
            'fontsize', 'paragraph', 'lineHeight', 'superscript', 'subscript', 'classSpan',
            'file', 'image', 'video', 'spellcheck', 'speechRecognize', 'cut', 'copy',
            'paste', 'selectall', 'copyformat', 'hr', 'table', 'link', 'symbols', 'ai-commands',
            'ai-assistant', 'indent', 'outdent', 'left', 'brush', 'undo', 'redo', 'find',
            'source', 'fullsize', 'preview', 'print', 'about'
        ],
        readonly: false, // فقط نمایش اگر true باشه
        minHeight: 400,
        placeholder: "متنتو اینجا بنویس...",
        extraButtons: [
            {
                name: "gallery",
                icon: cameraSvgString,
                tooltip: "گالری",
                exec: () => {
                    setactiveModalImgUploader(prev => !prev)
                },
            },
        ],

    }), [])
    return (
        <div>
            <Gallery
                activeModal={activeModalImgUploader}
                setActiveModal={setactiveModalImgUploader}
            />
            {typeEditor !== 'service' && <JoditEditor
                value={typeEditor === 'portfolio' ? portfolioEditorBody : BodyEditorArt}
                ref={editor}
                config={config}
                onChange={(e) => seteditorChange(e)}
                onBlur={handleChangeEditor}
            />}
            {typeEditor === 'service' && <JoditEditor
                value={servicebody}
                ref={editor}
                config={config}
                onChange={(e) => seteditorChange(e)}
                onBlur={handleChangeEditor}
            />}

        </div>
    );
}