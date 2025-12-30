import Reservation from "@/components/app/Consultant/Reservation/Reservation";
import { baseUrl } from "@/components/utils/url";
const getData = async (consultant) => {
    const getReservations = await fetch(`${baseUrl}/reservation/getressinglecunsul/${consultant}`, { cache: "no-store", })
    if (getReservations.status === 500) throw new Error('SERVER_ERROR');
    if (getReservations.ok === false) throw new Error('FETCH_FAILED');
    return getReservations.json();
}
const getData_a = async (consultant) => {
    const res = await fetch(`${baseUrl}/appointment/getdays/${consultant}`, { cache: "no-store", });
    if (res.status === 500) throw new Error('SERVER_ERROR');
    if (res.ok === false) throw new Error('FETCH_FAILED');
    return res.json();
}

export default async function page({ params }) {
    const { consultant } = params
    const get = await getData_a(consultant)
    const { reservations } = await getData(consultant)

    return <Reservation reservations={reservations} IDConsultant={consultant} days={get.dates} />
}