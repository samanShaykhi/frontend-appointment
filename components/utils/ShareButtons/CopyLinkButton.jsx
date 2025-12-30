import { IoCopyOutline } from "react-icons/io5";
import { messageCustom } from "../message/message";

export default function CopyLinkButton({ url: propUrl }) {
    let url = propUrl
    if (typeof window !== 'undefined' && !url) {
        url = window.location.href
    }


    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(url)
            messageCustom('آدرس کپی شد.', 'success', 5000);
        } catch (err) {
            console.error('Copy failed')
        }
    }


    return (
        <button
            onClick={handleCopy}
            aria-label="Copy page URL"
            className="px-3 py-1 rounded-md border"
        >
            <IoCopyOutline />
        </button>
    )
}