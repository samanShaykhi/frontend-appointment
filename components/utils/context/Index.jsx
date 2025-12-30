'use client'
import { createContext, useContext, useEffect, useState } from "react";
import { axiosConfig } from "../axios";
import { useRouter } from "next/navigation";
// 1
const ContextMe = createContext()

export function ContextProvider({ children }) {
    const [accessToken, setaccessToken] = useState()
    const [curentUser, setcurentUser] = useState()
    const [curentPath, setcurentPath] = useState()
    const [numberNot, setnumberNot] = useState(0)
    const [accessTokenLoading, setaccessTokenLoading] = useState(true)
    const router = useRouter()
    // edite PortFolio
    //CKEditor Aticle 
    const [BodyEditorArt, setbodyEditorArt] = useState()
    const [portfolioEditorBody, setportfolioEditorBody] = useState()
    const [servicebody, setservicebody] = useState()
    const ChangeEditorArt = (event) => setbodyEditorArt(event)
    const ChangeEditorPortfolio = (event) => setportfolioEditorBody(event)
    //CKEditor Aticle 
    // Gallery

    const [imagesPortfolioGalleryEdite, setimagesPortfolioGalleryEdite] = useState([])
    const [imagesPortfolio, setimagesPortfolio] = useState([])
    const [imagesFromDeletePortfolioGalleryEdite, setimagesFromDeletePortfolioGalleryEdite] = useState([])
    const [empetyArrPrevuePortGallery, setempetyArrPrevuePortGallery] = useState(false)

    const handleDeleteGalleryPortfolioEdite = (image) => {
        setimagesPortfolioGalleryEdite((prev) => {
            return prev.filter((p) => p.url !== image.url);
        });
    }
    const handleChangeImagesPortFoli = (event) => setimagesPortfolio((prev) => [...prev, ...event])
    const deleteImagesPortfolio = (id) => {
        setimagesPortfolio((prev) => {
            const toRemove = prev.find((p) => p.id === id);
            if (toRemove) URL.revokeObjectURL(toRemove.url);
            return prev.filter((p) => p.id !== id);
        });
    }
    const deleteAllImagesPortfolio = () => {
        setimagesPortfolio([])
    }
    const handleImagesGalleryPortfolioFromDelet = (item) => {
        setimagesFromDeletePortfolioGalleryEdite(prev => {
            const copPre = [...prev]
            copPre.push(item)
            return copPre
        })
    }
    // Gallery
    useEffect(() => {
        if (accessToken) return
        const fechRefresh = async () => {
            try {
                const axiosFech = await axiosConfig('/user/refreshuser', {
                    method: "GET",
                    headers: { 'Content-Type': 'multipart/form-data' },
                })
                setaccessToken(axiosFech.data.accessToken)
                setaccessTokenLoading(false)
            } catch (error) {
                setaccessTokenLoading(false)
            }
        }
        fechRefresh()
    }, [accessToken])
    const getUser = async (path) => {
        try {
            const axiosFech = await axiosConfig('/user/refreshgetuser', {
                method: "GET",
                headers: { 'Content-Type': 'multipart/form-data' },
            })
            setcurentUser(axiosFech.data.curentUser)
            if (!axiosFech.data.curentUser) {
                setcurentPath(path)
                router.replace('/login')
            }
            
        } catch (error) {
            router.replace('/login')
        }
    }
    const getUserNot = async () => {
        try {
            const axiosFech = await axiosConfig('/user/refreshgetuser', {
                method: "GET",
                headers: { 'Content-Type': 'multipart/form-data' },
            })
            setcurentUser(axiosFech.data.curentUser)
        } catch (error) {
        }
    }
    return (
        <ContextMe.Provider value={{
            // AccessToken
            accessToken,
            setaccessToken,
            accessTokenLoading,
            setaccessTokenLoading,
            // AccessToken
            setcurentUser,
            curentUser,
            funcGetUser: getUser,
            funcGetUserFromNot: getUserNot,
            numberNot,
            setnumberNot,
            //CKEditor Aticle 
            ChangeEditorArt,
            BodyEditorArt,
            ChangeEditorPortfolio,
            portfolioEditorBody,
            servicebody,
            setservicebody,
            //CKEditor Aticle 

            // Gallery
            handleDeleteGalleryPortfolioEdite,
            imagesPortfolioGalleryEdite,
            handleChangeImagesPortFoli,
            deleteImagesPortfolio,
            deleteAllImagesPortfolio,
            handleImagesGalleryPortfolioFromDelet,
            empetyArrPrevuePortGallery,
            setempetyArrPrevuePortGallery,
            // Gallery
            curentPath
        }} >
            {children}
        </ContextMe.Provider>
    );
}
export const ContextStates = () => useContext(ContextMe);