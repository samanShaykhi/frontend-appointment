// components/Modal.jsx

'use client'

import React, { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

export default function Modal({ isOpen, onClose, title, children, size = 'md', closeOnOverlayClick = true }) {
  const overlayRef = useRef(null)
  const dialogRef = useRef(null)
  const lastActiveRef = useRef(null)
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (isOpen) {
      lastActiveRef.current = document.activeElement
      const originalOverflow = document.documentElement.style.overflow
      document.documentElement.style.overflow = 'hidden'
      setShow(true)

      setTimeout(() => {
        const focusable = dialogRef.current?.querySelectorAll(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
        )
        if (focusable && focusable.length) focusable[0].focus()
        else dialogRef.current?.focus()
      }, 0)

      return () => { document.documentElement.style.overflow = originalOverflow }
    } else {
      lastActiveRef.current?.focus?.()
      // start exit animation
      setShow(false)
    }
  }, [isOpen])

  useEffect(() => {
    function onKey(e) {
      if (!isOpen) return
      if (e.key === 'Escape') onClose()
      else if (e.key === 'Tab') {
        const nodes = dialogRef.current?.querySelectorAll('a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])')
        if (!nodes || nodes.length === 0) { e.preventDefault(); return }
        const first = nodes[0], last = nodes[nodes.length - 1]
        if (e.shiftKey) { if (document.activeElement === first) { e.preventDefault(); last.focus() } }
        else { if (document.activeElement === last) { e.preventDefault(); first.focus() } }
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [isOpen, onClose])

  if (typeof window === 'undefined') return null
  if (!isOpen && !show) return null

  const sizeClass = { sm: 'max-w-md', md: 'max-w-xl', lg: 'max-w-3xl' }[size]

  function handleOverlayClick(e) { if (closeOnOverlayClick && e.target === overlayRef.current) onClose() }

  return createPortal(
    <div
      ref={overlayRef}
      onMouseDown={handleOverlayClick}
      aria-hidden={!isOpen}
      className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 sm:px-6"
    >
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" aria-hidden="true" />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={title || 'Modal dialog'}
        ref={dialogRef}
        tabIndex={-1}
        onMouseDown={(e) => e.stopPropagation()}
        style={{
          transition: 'opacity 0.25s ease, transform 0.25s ease',
          opacity: isOpen ? 1 : 0,
          transform: isOpen ? 'translateY(0)' : 'translateY(-40px)'
        }}
        className={`relative z-10 w-full ${sizeClass} mx-auto transform overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5`}
      >
        <div className="flex items-start justify-between p-6">
          <div>{title && <h2 className="text-lg font-semibold leading-6 text-slate-900">{title}</h2>}</div>
          <div className="ml-4 flex h-8 items-center">
            <button onClick={onClose} aria-label="Close modal" className="-m-2 inline-flex p-2 text-slate-400 hover:text-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 011.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>

        <div className="px-6 pb-6">{children}</div>
      </div>
    </div>,
    document.body
  )
}
