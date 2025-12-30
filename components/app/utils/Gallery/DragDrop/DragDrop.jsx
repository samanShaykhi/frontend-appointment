// UploadForm.jsx
import React, { useEffect, useRef, useState } from "react";
import styles from "./DragDrop.module.css";
import { GiCheckMark } from "react-icons/gi";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { axiosConfig } from "@/components/utils/axios";
import { baseUrl } from "@/components/utils/url";
import { ContextStates } from "@/components/utils/context/Index";
import { messageCustom } from "@/components/utils/message/message";
import ServerError from "../../ErrorPages/ServerError";
import ServerReset from "../../ErrorPages/ServerReset";
import AccessibilityError from "../../ErrorPages/AccessibilityError";

export default function DragDrop({
  diBTNUp,
  needUrl,
  maxFiles = 8,
  maxFileSizeMB = 4,
  onUpload = null,
}) {
  const router = useRouter()
  const [ErrorServer, setErrorServer] = useState();
  const [UnUpload, setUnUpload] = useState(true)
  const [items, setItems] = useState([]); // {id, file, url, progress, status}
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);
  const containerRef = useRef(null);
  const {
    handleDeleteGalleryPortfolioEdite,
    imagesPortfolioGalleryEdite,
    handleChangeImagesPortFoli,
    deleteImagesPortfolio,
    deleteAllImagesPortfolio,
    handleImagesGalleryPortfolioFromDelet,
    empetyArrPrevuePortGallery,
    setempetyArrPrevuePortGallery,
  } = ContextStates()
  useEffect(() => {
    if (!empetyArrPrevuePortGallery) return
    setItems([])
    setempetyArrPrevuePortGallery(false)
  }, [empetyArrPrevuePortGallery])
  useEffect(() => {
    // paste handler
    const onPaste = (e) => {
      const itemsData = e.clipboardData?.items;
      if (!itemsData) return;
      const pasted = [];
      for (let i = 0; i < itemsData.length; i++) {
        const it = itemsData[i];
        if (it.kind === "file") {
          const f = it.getAsFile();
          if (f && f.type.startsWith("image/")) pasted.push(f);
        }
      }
      if (pasted.length) addFiles(pasted);
    };
    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, []);
  useEffect(() => {
    // cleanup objectURLs on unmount
    return () => {
      items.forEach((it) => URL.revokeObjectURL(it.url));
    };
  }, [items]);
  const validateFile = (file) => {
    if (!file.type.startsWith("image/")) return "فایل باید عکس باشد.";
    if (file.size > maxFileSizeMB * 1024 * 1024)
      return `حجم فایل نباید بیشتر از ${maxFileSizeMB} مگابایت باشد.`;
    if (items.length + imagesPortfolioGalleryEdite.length >= maxFiles) return `حداکثر ${maxFiles} فایل مجاز است.`;
    return null;
  };
  const addFiles = (fileList) => {
    setError("");
    const arr = Array.from(fileList);
    const accepted = [];
    const allFiles = [];
    for (const f of arr) {
      const err = validateFile(f);
      if (err) {
        setError(err);
        // skip invalid file but continue with others
        continue;
      }
      const id = `${f.name}-${f.size}-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)}`;
      accepted.push({
        id,
        file: f,
        url: URL.createObjectURL(f),
        progress: 0,
        status: "ready", // ready | uploading | done | error
      });
      allFiles.push(f)
      if (items.length + accepted.length + imagesPortfolioGalleryEdite.length >= maxFiles) break;
    }
    if (accepted.length) {
      setItems((prev) => [...prev, ...accepted]);
      setUnUpload(true)
    }
    if (allFiles.length) {
      if (needUrl) handleChangeImagesPortFoli(allFiles)
    }
  };
  // drag handlers
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onDragOver = (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "copy";
      setDragOver(true);
    };
    const onDragLeave = (e) => {
      // ensure only when leaving the container entirely
      if (e.target === el || e.relatedTarget == null) setDragOver(false);
    };
    const onDrop = (e) => {
      e.preventDefault();
      setDragOver(false);
      const dt = e.dataTransfer;
      if (dt && dt.files && dt.files.length) addFiles(dt.files);
    };
    el.addEventListener("dragover", onDragOver);
    el.addEventListener("dragleave", onDragLeave);
    el.addEventListener("drop", onDrop);
    return () => {
      el.removeEventListener("dragover", onDragOver);
      el.removeEventListener("dragleave", onDragLeave);
      el.removeEventListener("drop", onDrop);
    };
  }, [items]);
  const removeItem = (id) => {
    setItems((prev) => {
      const toRemove = prev.find((p) => p.id === id);
      if (toRemove) URL.revokeObjectURL(toRemove.url);
      return prev.filter((p) => p.id !== id);
    });
    deleteImagesPortfolio(id)
  };
  // Simulated upload: if onUpload provided, call it; otherwise simulate per-file progress
  const uploadAll = async () => {
    setError("");
    if (!items.length) {
      setError("هیچ فایلی برای آپلود وجود ندارد.");
      return;
    }
    try {
      setItems((prev) => prev.map(item => ({ ...item, status: "uploading", progress: 4 })));
      for (const itemFile of items) {
        const formData = new FormData()
        formData.append('image', itemFile.file)
        const fechData = await axiosConfig('/article/uploadimggallery', {
          headers: { "Content-Type": "multipart/form-data" },
          method: "POST",
          data: formData,
          onUploadProgress: (event) => {
            const percent = Math.floor((event.loaded / event.total) * 100);
            setItems((prev) => prev.map(item => (item.id === itemFile.id ? { ...item, progress: percent } : item)))
            if (percent === 100) {
              setItems((prev) => prev.map(item => (item.id === itemFile.id ? { ...item, status: "done", progress: 100 } : item)))
              setUnUpload(false)
            }
          },
        })
        // console.log(fechData)
      }
      // console.log(fechData.data) 
    } catch (error) {
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
    // // If user supplied an onUpload handler, pass raw File[] and let them manage progress
    // if (typeof onUpload === "function") {
    //   try {
    //     await onUpload(items.map((i) => i.file));
    //     // mark done
    //     setItems((prev) => prev.map((p) => ({ ...p, status: "done", progress: 100 })));
    //   } catch (err) {
    //     console.error(err);
    //     setError("خطا در آپلود.");
    //   }
    //   return;
    // }

    // // simulate per-file progress
    // setItems((prev) => prev.map((p) => ({ ...p, status: "uploading", progress: 2 })));
    // for (const it of items) {
    //   // eslint-disable-next-line no-loop-func
    //   await new Promise((res) => {
    //     let prog = 2;
    //     const t = setInterval(() => {
    //       prog += Math.random() * 12;
    //       setItems((prev) =>
    //         prev.map((x) => (x.id === it.id ? { ...x, progress: Math.min(99, Math.round(prog)) } : x))
    //       );
    //       if (prog > 95) {
    //         clearInterval(t);
    //         setTimeout(() => {
    //           setItems((prev) =>
    //             prev.map((x) => (x.id === it.id ? { ...x, status: "done", progress: 100 } : x))
    //           );
    //           res(null);
    //         }, 220);
    //       }
    //     }, 140 + Math.random() * 140);
    //   });
    // }
  };
  const removeItemEdite = (e, image) => {
    e.preventDefault()
    handleDeleteGalleryPortfolioEdite(image)
    handleImagesGalleryPortfolioFromDelet(image)
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
    <div className={styles.container}>
      <div
        ref={containerRef}
        className={`${styles.dropArea} ${dragOver ? styles.dropActive : ""}`}
        aria-label="Drop images here"
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className={styles.fileInput}
          onChange={(e) => addFiles(e.target.files)}
        />
        <div className={styles.placeholder}>
          <div className={styles.icon}>📤</div>
          <div className={styles.title}>Drag &amp; drop or paste images here</div>
          <div className={styles.sub}>یا کلیک کن و از سیستم انتخاب کن — حداکثر {maxFiles} فایل</div>
          <button
            type="button"
            className={styles.chooseBtn}
            onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current?.click();
            }}
          >
            انتخاب فایل
          </button>
        </div>
      </div>
      {error && <div className={styles.error}>{error}</div>}
      <div className={styles.previewWrap}>
        {items.length === 0 ? (
          <div className={styles.empty}>هیچ تصویری اضافه نشده.</div>
        ) : (
          <div className={styles.grid}>
            {items.map((it) => (
              <div key={it.id} className={styles.card}>
                <div className={styles.imgWrap}>
                  <img src={it.url} alt={it.file.name} className={styles.thumb} />
                  {it.status === "uploading" && (
                    <div className={styles.progressBar}>
                      <div className={styles.progress} style={{ width: `${it.progress}%` }} />
                    </div>
                  )}
                  {it.status === "done" && <div className={styles.badge}> <GiCheckMark /> </div>}
                </div>

                <div className={styles.meta}>
                  <div className={styles.name} title={it.file.name}>
                    {it.file.name.length > 28 ? it.file.name.slice(0, 24) + "…" : it.file.name}
                  </div>
                  {it.status !== "done" && <div className={styles.actions}>
                    <button className={styles.smallBtn} onClick={() => removeItem(it.id)}>
                      حذف
                    </button>
                  </div>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {imagesPortfolioGalleryEdite.length > 0 &&
        <div className={styles.previewWrap} >
          <h6 className="mt-6 mb-2" > تصاویر گالری رزومه </h6>
          <div className={styles.grid} >
            {
              imagesPortfolioGalleryEdite.map((item, index) => {
                return (
                  <div className={styles.card} key={index}>
                    <div className={styles.imgWrap} >
                      <Image className={styles.thumb} src={`${baseUrl}/${item.url}`} alt="item gallery" width={100} height={100} />
                    </div>
                    <div className={styles.meta}>
                      <div className={styles.actions}>
                        <button className={styles.smallBtn} onClick={(e) => removeItemEdite(e, item)}>
                          حذف
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })
            }
          </div>
        </div>
      }
      <div className={styles.footer}>
        <div className={styles.hint}>می‌تونی تصاویر رو paste و یا drag & drop کنی.</div>
        <div className={styles.controls}>
          {items.length > 0 && <button
            type="button"
            className={styles.btnGhost}
            onClick={() => {
              // clear all
              items.forEach((f) => URL.revokeObjectURL(f.url));
              setItems([]);
              deleteAllImagesPortfolio()
            }}
          >پاک کردن همه</button>}
          {((UnUpload || items.length === 0) && !diBTNUp) && <button type="button" className={styles.btnPrimary} onClick={uploadAll}>
            آپلود {items.length > 0 ? `(${items.length})` : ""}
          </button>}
        </div>
      </div>
    </div>
  );
}
