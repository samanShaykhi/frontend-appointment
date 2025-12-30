import React from 'react'
import { BiLogoTelegram } from 'react-icons/bi'
import { FaLinkedin, FaWhatsapp } from 'react-icons/fa6'



export default function ShareButtons({ url: propUrl, title = '', text = '' }) {
    let url = propUrl
    if (typeof window !== 'undefined' && !url) {
        url = window.location.href
    }
    const encoded = (s) => encodeURIComponent(s || '')

    const openPopup = (shareUrl) => {
        const width = 600
        const height = 600
        const left = window.screenX + (window.innerWidth - width) / 2
        const top = window.screenY + (window.innerHeight - height) / 2
        window.open(
            shareUrl,
            '_blank',
            `toolbar=0, status=0, width=${width}, height=${height}, top=${top}, left=${left}`
        )
    }

    const onShareWebAPI = async () => {
        if (navigator.share) {
            try {
                await navigator.share({ title, text, url })
                return true
            } catch (err) {
                // user cancelled or error — fallback below
                return false
            }
        }
        return false
    }

    const handleTelegram = async (e) => {
        e.preventDefault()
        if (await onShareWebAPI()) return
        const shareUrl = `https://t.me/share/url?url=${encoded(url)}&text=${encoded(text || title)}`
        openPopup(shareUrl)
    }

    const handleWhatsApp = async (e) => {
        e.preventDefault()
        if (await onShareWebAPI()) return
        // WhatsApp mobile and web: use wa.me or api link
        const payload = `${text ? text + ' ' : ''}${url}`
        const shareUrl = `https://api.whatsapp.com/send?text=${encoded(payload)}`
        openPopup(shareUrl)
    }

    const handleLinkedIn = async (e) => {
        e.preventDefault()
        if (await onShareWebAPI()) return
        const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encoded(url)}`
        openPopup(shareUrl)
    }

    return (
        <div className="flex gap-2 items-center">
            <button
                onClick={handleTelegram}
                aria-label="Share on Telegram"
                className="px-3 py-1 rounded-md border"
            >
                <BiLogoTelegram className='text-[#3390ec]' />

            </button>

            <button
                onClick={handleWhatsApp}
                aria-label="Share on WhatsApp"
                className="px-3 py-1 rounded-md border"
            >
                <FaWhatsapp className='text-[#11bf45]' />

            </button>

            <button
                onClick={handleLinkedIn}
                aria-label="Share on LinkedIn"
                className="px-3 py-1 rounded-md border"
            >
                <FaLinkedin className='text-[#0073b2]' />
            </button>
        </div>
    )
}


