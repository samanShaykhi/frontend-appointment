//!$ 
import Index from "@/components/Index";
import { baseUrl } from "@/components/utils/url";
const getArticle = async () => {
  const fetchData = await fetch(`${baseUrl}/article/articlefrompagecenter`, { cache: "no-store", });
  if (fetchData.status === 500) throw new Error('SERVER_ERROR');
  if (fetchData.ok === false) throw new Error('FETCH_FAILED');
  return fetchData.json()
}
const getedexpertise = async () => {
  const fetchData = await fetch(`${baseUrl}/rlatedexpertise/getrlatedexpertisesearchpage`, { cache: "no-store", });
  if (fetchData.status === 500) throw new Error('SERVER_ERROR');
  if (fetchData.ok === false) throw new Error('FETCH_FAILED');
  return fetchData.json()
}
const getConsultant = async () => {
  const fechConsultants = await fetch(`${baseUrl}/consultant/getconsultantpagecenter`, { cache: "no-store", });
  if (fechConsultants.status === 500) throw new Error('SERVER_ERROR');
  if (fechConsultants.ok === false) throw new Error('FETCH_FAILED');
  return fechConsultants.json();
}
export default async function Home() {
  const consultantFech = await getConsultant();
  const expertise = await getedexpertise()
  const article = await getArticle()
  return <Index consultant={consultantFech} expertise={expertise.data} articles={article.articles} />
}
