import SingleArticle from "@/components/app/Article/SingleArticle/SingleArticle";
import { baseUrl } from "@/components/utils/url";

export default async function page({ params }) {
    const { title } = params
    const res = await fetch(`${baseUrl}/article/articlesinglepage/${title}`, {cache: "no-store",});
    const article = await res.json();
    return <SingleArticle article={article.article}/>
}