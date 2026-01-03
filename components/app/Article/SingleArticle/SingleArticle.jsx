import Footer from "../../comoon/Footer/Footer";
import style from './SingleArticle.module.css'
export default function SingleArticle({ article }) {
    return (
        <div className={style.btxs} >
            <div className="custom-container" >
                <h1 className="text-2xl font-bold mb-4 my-4">{article.articleTitle}</h1>
                <div  dangerouslySetInnerHTML={{ __html: article.body }} />
            </div>
            <Footer />
        </div>
    );
}