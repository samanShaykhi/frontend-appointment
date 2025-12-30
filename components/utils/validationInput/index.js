import * as Yup from 'yup'

export const schemaValidInpArt = Yup.object().shape({
  metaDiscription: Yup.string().required("متادیسکریپشن الزامی است").min(6, "متادیسکریپشن باید حداقل ۶ کاراکتر باشد").max(100, 'متادیسکریپشن نباید از 100 کارکتر بیشتر باشد'),
  thumbnail: Yup.mixed().required("انتخاب فایل الزامی است"),
  articleTitle: Yup.string().required("عنوان الزامی است").min(6, "عنوان باید حداقل ۶ کاراکتر باشد").max(50, 'عنوان نباید از 50 کارکتر بیشتر باشد'),
  body: Yup.string('متن مقاله باید رشته باشد').required("متن مقاله الزامی است").min(500, "متن مقاله باید حداقل 500 کاراکتر باشد"),
});