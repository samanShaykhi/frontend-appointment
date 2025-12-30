import Footer from "./comoon/Footer/Footer";
import PageCenter from "./pagecenter/PageCenter";

function IndexApp({ consultant, expertise, articles }) {
    return (
        <div>
            <PageCenter consultant={consultant} expertise={expertise} articles={articles} />
            <Footer />
        </div>
    );
}

export default IndexApp;