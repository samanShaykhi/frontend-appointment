import * as Yup from 'yup'

export const schemaValidInpArt = Yup.object().shape({
  metaDiscription: Yup.string().required("متادیسکریپشن الزامی است").min(50, "متادیسکریپشن باید حداقل 50 کاراکتر باشد").max(200, 'متادیسکریپشن نباید از 200 کارکتر بیشتر باشد'),
  thumbnail: Yup.mixed().required("انتخاب فایل الزامی است"),
  articleTitle: Yup.string().required("عنوان الزامی است").min(30, "عنوان باید حداقل 30 کاراکتر باشد").max(150, 'عنوان نباید از 150 کارکتر بیشتر باشد'),
  body: Yup.string('متن مقاله باید رشته باشد').required("متن مقاله الزامی است").min(500, "متن مقاله باید حداقل 500 کاراکتر باشد"),
});