import { PHONE_SCHEMA } from '@/constants'
import * as Yup from 'yup'

export const AddressSchema = Yup.object().shape({
  name: Yup.string().min(2, 'Tên không hợp lệ').required('Vui lòng nhập Họ Tên'),
  street: Yup.string().required('Vui lòng nhập địa chỉ cụ thể'),
  phone: Yup.string()
    .matches(PHONE_SCHEMA, 'Vui lòng nhập số điện thoại hợp lệ')
    .required('Vui lòng nhập số điện thoại'),
  state: Yup.object()
    .shape({
      value: Yup.number().required(),
      label: Yup.string().required(),
    })
    .required('Vui lòng chọn điạ tỉnh thành phố'),
  district: Yup.object()
    .shape({
      value: Yup.number().required(),
      label: Yup.string().required(),
    })
    .required('Vui lòng chọn điạ chỉ quận huyện'),
  ward: Yup.object()
    .shape({
      value: Yup.number().required(),
      label: Yup.string().required(),
    })
    .required('Vui lòng chọn điạ chỉ phường xã'),
})

export const ratingProductSchema = Yup.object().shape({
  star_rating: Yup.number().oneOf([1, 2, 3, 4, 5]).required(),
  content: Yup.string().required('Vui lòng nhập nội dung đánh giá!'),
})

export const phoneNumberSchema = Yup.object().shape({
  phoneNumber: Yup.string()
    .matches(PHONE_SCHEMA, 'Vui lòng nhập số điện thoại hợp lệ')
    .required('Vui lòng nhập số điện thoại'),
})

export const createPasswordSchema = Yup.object().shape({
  newPassword: Yup.string()
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
    .required('Vui lòng nhập mật khẩu'),
  reNewPassword: Yup.string()
    .oneOf([Yup.ref('newPassword')], 'Mật khẩu xác nhận phải trùng với mật khẩu mới')
    .required('Vui lòng nhập mật khẩu xác nhận'),
})

export const productReviewSchema = Yup.object().shape({
  message: Yup.string().required('Vui lòng nhập bình luận'),
})

export const changePasswordSchema = Yup.object().shape({
  password: Yup.string()
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
    .required('Vui lòng nhập mật khẩu'),
  newPassword: Yup.string()
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
    .required('Vui lòng nhập mật khẩu'),
  reNewPassword: Yup.string()
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
    .oneOf([Yup.ref('newPassword')], 'Mật khẩu xác nhận phải trùng với mật khẩu mới')
    .required('Vui lòng nhập mật khẩu xác nhận'),
})

export const passwordSchema = Yup.object().shape({
  password: Yup.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
})

export const loginSchema = Yup.object().shape({
  phone: Yup.string()
    .matches(PHONE_SCHEMA, 'Vui lòng nhập số điện thoại hợp lệ')
    .required('Vui lòng nhập số điện thoại'),
  password: Yup.string()
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
    .required('Vui lòng nhập mật khẩu'),
})

export const signupPostAdminSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Tên phải có tối thiểu 2 ký tự')
    .max(30, 'Tên không vượt quá 30 ký tự')
    .required('Vui lòng nhập tên'),
  password: Yup.string()
    .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
    .required('Vui lòng nhập mật khẩu'),
  confirmPassword: Yup.string()
    .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
    .oneOf([Yup.ref('password')], 'Mật khẩu không khớp')
    .required('Vui lòng nhập mật khẩu xác nhận'),
})

export const userInfoSchema = Yup.object().shape({
  email: Yup.string().matches(
    /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
    'Vui lòng nhập đúng định dạng email'
  ),
  name: Yup.string()
    .min(2, 'Tên phải có tối thiểu 2 ký tự')
    .max(30, 'Tên không vượt quá 30 ký tự')
    .required('Vui lòng nhập tên'),
  gender: Yup.string().oneOf(['male', 'female', 'other']).required('Vui lòng chọn giới tính'),
})

export const storeInfoSchema = Yup.object().shape({
  email: Yup.string().matches(
    /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
    'Vui lòng nhập đúng định dạng email'
  ),
  businessName: Yup.string()
    .min(2, 'Tên phải có tối thiểu 2 ký tự')
    .max(30, 'Tên không vượt quá 30 ký tự')
    .required('Vui lòng nhập tên'),
  businessOwner: Yup.string()
    .min(2, 'Tên phải có tối thiểu 2 ký tự')
    .max(30, 'Tên không vượt quá 30 ký tự')
    .required('Vui lòng nhập tên'),
  businessPhone: Yup.string()
    .matches(PHONE_SCHEMA, 'Vui lòng nhập số điện thoại hợp lệ')
    .required('Vui lòng nhập số điện thoại'),
  addressDetail: Yup.string(),
  state: Yup.object()
    .shape({
      value: Yup.number().required(),
      label: Yup.string().required(),
    })
    .required('Vui lòng chọn điạ tỉnh thành phố'),
  district: Yup.object()
    .shape({
      value: Yup.number().required(),
      label: Yup.string().required(),
    })
    .required('Vui lòng chọn điạ chỉ quận huyện'),
  ward: Yup.object()
    .shape({
      value: Yup.number().required(),
      label: Yup.string().required(),
    })
    .required('Vui lòng chọn điạ chỉ phường xã'),
})

export const messageSchema = Yup.object().shape({
  message: Yup.string().required('Vui lòng nhập bình luận'),
})

export const storeRegisterSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Tên phải có tối thiểu 2 ký tự')
    .max(30, 'Tên không vượt quá 30 ký tự')
    .required('Vui lòng nhập tên'),
  phone: Yup.string()
    .matches(PHONE_SCHEMA, 'Vui lòng nhập số điện thoại hợp lệ')
    .required('Vui lòng nhập số điện thoại'),
  business_phone: Yup.string().matches(PHONE_SCHEMA, 'Vui lòng nhập số điện thoại hợp lệ'),
  email: Yup.string().matches(
    /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
    'Vui lòng nhập đúng định dạng email'
  ),
  business_owner: Yup.string()
    .min(2, 'Tên phải có tối thiểu 2 ký tự')
    .max(30, 'Tên không vượt quá 30 ký tự'),
  business_name: Yup.string()
    .min(2, 'Tên phải có tối thiểu 2 ký tự')
    .max(30, 'Tên không vượt quá 30 ký tự'),
  state: Yup.object()
    .shape({
      value: Yup.number().required(),
      label: Yup.string().required(),
    })
    .required('Vui lòng chọn điạ tỉnh thành phố'),
  district: Yup.object()
    .shape({
      value: Yup.number().required(),
      label: Yup.string().required(),
    })
    .required('Vui lòng chọn điạ chỉ quận huyện'),
  ward: Yup.object()
    .shape({
      value: Yup.number().required(),
      label: Yup.string().required(),
    })
    .required('Vui lòng chọn điạ chỉ phường xã'),
  businessCertificateImage: Yup.object({
    id: Yup.number().required(),
    url: Yup.string().required(),
  }).required('Vui lòng bổ sung giấy chứng nhận'),
  gppCertificateImage: Yup.object({
    id: Yup.number().required(),
    url: Yup.string().required(),
  }).required('Vui lòng bổ sung giấy chứng nhận'),
})

export const getAdviceSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Tên phải có tối thiểu 2 ký tự')
    .max(30, 'Tên không vượt quá 30 ký tự')
    .required('Vui lòng nhập tên'),

  phone: Yup.string()
    .matches(PHONE_SCHEMA, 'Vui lòng nhập số điện thoại hợp lệ')
    .required('Vui lòng nhập số điện thoại'),

  state: Yup.object().shape({
    value: Yup.number(),
    label: Yup.string(),
  }),
  // .required('Vui lòng chọn điạ tỉnh thành phố'),

  district: Yup.object().shape({
    value: Yup.number(),
    label: Yup.string(),
  }),
  // .required('Vui lòng chọn điạ chỉ quận huyện'),

  ward: Yup.object().shape({
    value: Yup.number(),
    label: Yup.string(),
  }),
  // .required('Vui lòng chọn điạ chỉ phường xã'),

  gender: Yup.string().oneOf(['male', 'female', 'other']).optional(),
  drugstore_id: Yup.object()
    .shape({
      label: Yup.string(),
      value: Yup.number(),
    })
    .optional(),
  note: Yup.string().optional(),
})

export const storeReceiveSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Tên phải có tối thiểu 2 ký tự')
    .max(30, 'Tên không vượt quá 30 ký tự')
    .required('Vui lòng nhập tên'),

  phone: Yup.string()
    .matches(PHONE_SCHEMA, 'Vui lòng nhập số điện thoại hợp lệ')
    .required('Vui lòng nhập số điện thoại'),

  drugstore_id: Yup.number().required('Vui lòng chọn cửa hàng!'),
})

export const categoryFormSchema = Yup.object().shape({
  name: Yup.string().required('Vui lòng nhập trường này'),
  parent_id: Yup.string().nullable(),
  attachment_id: Yup.string().nullable(),
  role: Yup.object()
    .shape({
      value: Yup.string(),
      label: Yup.string(),
    })
    .nullable(),
  image: Yup.string().nullable(),
  desc: Yup.string().nullable(),
})

export const postFormSchema = Yup.object().shape({
  title: Yup.string().required('Vui lòng nhập trường này'),
  short_content: Yup.string().required('Vui lòng nhập trường này'),
  attachment_id: Yup.string().required('Vui lòng nhập trường này'),
  category_ids: Yup.array().of(Yup.string()),
  role: Yup.object().shape({
    value: Yup.string(),
    label: Yup.string(),
  }),
  tag_ids: Yup.array()
    .of(
      Yup.object().shape({
        value: Yup.string(),
        label: Yup.string(),
      })
    )
    .nullable(),
})

export const postTagFormSchema = Yup.object().shape({
  content: Yup.string().required('Vui lòng nhập trường này'),
})
