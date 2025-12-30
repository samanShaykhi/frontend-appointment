'use client'
import { useRouter } from "next/navigation";
import style from './AboutUs.module.css'
import { BsChevronRight } from "react-icons/bs";
import Link from "next/link";
import { BiLogoTelegram } from "react-icons/bi";
import { IoLogoWhatsapp } from "react-icons/io5";
import { MdEmail, MdOutlinePhone, MdOutlinePhoneCallback } from "react-icons/md";
function AboutUs() {
    const router = useRouter()
    return (
        <div className="custom-container" >
            <div className={style.headPage} >
                <BsChevronRight onClick={() => router.back()} />
                <span>درباره ما بدانید</span>
            </div>
            <div className={style.DisBox} >
                <p>لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است چاپگرها.</p>
                <p>لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک است، چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است، و برای شرایط فعلی تکنولوژی مورد نیاز، و کاربردهای.</p>
                <p>لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک است، چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است، و برای شرایط فعلی تکنولوژی مورد نیاز، و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد، کتابهای زیادی در شصت و سه درصد گذشته حال و آینده، شناخت فراوان جامعه و متخصصان را می طلبد، تا با نرم افزارها شناخت بیشتری را برای طراحان رایانه ای علی الخصوص طراحان خلاقی، و فرهنگ پیشرو در زبان فارسی ایجاد کرد، در این صورت می توان امید داشت که تمام و دشواری موجود در ارائه راهکارها، و شرایط سخت تایپ به پایان رسد و زمان مورد نیاز شامل حروفچینی دستاوردهای اصلی، و جوابگوی سوالات پیوسته اهل دنیای موجود طراحی اساسا مورد استفاده قرار گیرد.</p>
                <p>لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک است، چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است، و برای شرایط فعلی تکنولوژی مورد نیاز، و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد، کتابهای زیادی در شصت و سه درصد گذشته حال و آینده، شناخت فراوان جامعه و متخصصان را می طلبد، تا با نرم افزارها شناخت بیشتری را برای طراحان رایانه ای علی الخصوص طراحان خلاقی، و فرهنگ پیشرو در زبان فارسی ایجاد کرد، در این صورت می توان امید داشت که تمام و دشواری موجود در ارائه راهکارها، و شرایط سخت تایپ به پایان رسد و زمان مورد نیاز شامل حروفچینی دستاوردهای اصلی، و جوابگوی سوالات پیوسته اهل دنیای موجود طراحی اساسا مورد استفاده قرار گیرد.</p>
            </div>
            <div className="my-[2rem]">
                <h6 className="text-[#474747] text-[18px]" >شبکه‌های اجتماعی ما</h6>
                <div className={style.socialMedia} >
                    <div>
                        <Link href='/'>
                            <BiLogoTelegram />
                            <span>تلگرام</span>
                        </Link>
                    </div>
                    <div>
                        <Link href='/'>
                            <IoLogoWhatsapp />
                            <span>واتس‌اپ</span>
                        </Link>
                    </div>
                </div>
            </div>
            <div className="my-[2rem]">
                <h6 className="text-[#474747] text-[18px]" >تماس با ما</h6>
                <div className={style.call} >
                    <div>
                        <Link href='/'>
                            <MdOutlinePhoneCallback />
                        </Link>
                    </div>
                    <div>
                        <Link href='/'>
                            <span>09168922125</span>
                            <MdOutlinePhone />
                        </Link>
                    </div>
                    <div>
                        <Link href='/'>
                            <span>info@noobatiran.ir</span>
                            <MdEmail />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AboutUs;