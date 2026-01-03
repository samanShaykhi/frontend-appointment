import * as Yup from 'yup'

export const schemaValidInpArt = Yup.object().shape({
  metaDiscription: Yup.string().required("متادیسکریپشن الزامی است").min(80, "متادیسکریپشن باید حداقل 80 کاراکتر باشد").max(500, 'متادیسکریپشن نباید از 500 کارکتر بیشتر باشد'),
  thumbnail: Yup.mixed().required("انتخاب فایل الزامی است"),
  articleTitle: Yup.string().required("عنوان الزامی است").min(40, "عنوان باید حداقل 40 کاراکتر باشد").max(180, 'عنوان نباید از 180 کارکتر بیشتر باشد'),
  body: Yup.string('متن مقاله باید رشته باشد').required("متن مقاله الزامی است").min(500, "متن مقاله باید حداقل 500 کاراکتر باشد"),
});