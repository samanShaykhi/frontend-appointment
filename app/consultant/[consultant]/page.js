import ConsultantSingle from "@/components/app/Consultant/ConsultantSingle/ConsultantSingle";
import { baseUrl } from "@/components/utils/url";
import { notFound } from "next/navigation";
const getConsultant = async (consultant) => {
    const res = await fetch(`${baseUrl}/consultant/getdatafromsingleconsultant/${consultant}`, { cache: "no-store", });
    if (res.status === 404) notFound();
    if (res.status === 500) throw new Error('SERVER_ERROR');
    if (res.ok === false) throw new Error('FETCH_FAILED');
    return res.json()
}
async function page({ params }) {
    const { consultant } = params
    const consultantFech = await getConsultant(consultant);
    return <ConsultantSingle consultant={consultantFech} />
}

export default page;