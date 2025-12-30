import { toast } from "react-toastify";

export const messageCustom = (text, staus, secens) => {
    if (staus === 'success') {
        // return toast.success(`${text}`)
        return toast.success(text, {
            position: "bottom-right",
            autoClose: secens,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            // transition: Bounce,
        });
    } else if (staus === 'error') {
        return toast.error(text, {
            position: "bottom-right",
            autoClose: secens,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            // transition: Bounce,
        });

    } else {
        return toast.warning(text, {
            position: "bottom-right",
            autoClose: secens,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            // transition: Bounce,
        });
    }
}