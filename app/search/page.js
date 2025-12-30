import SearchPage from "@/components/app/SearchPage/SearchPage";
import { baseUrl } from "@/components/utils/url";
const FuncFechData = async () => {
    const res = await fetch(`${baseUrl}/consultant/getconsultant`, { cache: "no-store", });
    if (res.ok === false) throw new Error('FETCH_FAILED');
    return res.json();
}
async function page() {
    const getConsultants = await FuncFechData()
    return <SearchPage consultants={getConsultants.consultant} />
}

export default page;