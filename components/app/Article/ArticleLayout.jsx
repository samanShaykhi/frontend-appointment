import { Suspense } from "react";
import Article from "./Article";
import SpinnerLoading from "@/components/utils/Spinner/SpinnerLoading";

export default function ArticleLayout() {
    return (
        <Suspense fallback={<SpinnerLoading />}>
            <Article />
        </Suspense>

    );
}