export const SWR_KEY = {
  get_product_list: 'get_product_list',
  get_product_list_by: 'get_product_list_by',
  get_product_list_by_category_major: 'get_product_list_by_category_major',
  get_product_list_by_category_minor: 'get_product_list_by_category_minor',
  get_product_list_by_attribute_minor: 'get_product_list_by_attribute_minor',
  get_product_detail: 'get_product_detail',
  get_product_description: 'get_product_description',

  get_category_list: 'get_category_list',
  get_category_minor_list: 'get_category_minor_list',

  get_attribute_minor_list: 'get_attribute_minor_list',
  get_attribute_minor_list_filter: 'get_attribute_minor_list_filter',

  get_post_list: 'get_post_list',
  get_post_detail: 'get_post_detail',

  get_room_list: 'get_room_list',
  get_room_detail: 'get_room_detail',

  get_messages_in_room: 'get_messages_in_room',
  get_user_information: 'get_user_information',
  get_guest_information: 'get_guest_information',

  get_cart_length: 'get_cart_length',
  check_cart_length: 'check_cart_length',

  get_banner_list: 'get_banner_list',
  get_star_rating_count: 'get_star_rating_count',

  get_user_address: 'get_user_address',
  get_user_detail: 'get_user_detail',

  get_delivery: 'get_delivery',
  get_payment_method: 'get_payment_method',
  get_order_status: 'get_order_status',
  get_order_history_list: 'get_order_history_list',
  get_order_history_detail: 'get_order_history_detail',

  get_product_comment: 'get_product_comment',
  get_product_rating: 'get_product_rating',

  get_drug_stores: 'get_drug_stores',
  get_drug_store_detail: 'get_drug_store_detail',

  cart_list: 'cart_list',
  cart_count: 'cart_count',
  cart_company_promotion: (id: number) => `cart_company_promotion_${id}`,
  orders: 'orders',
  promotions: ({ sale_order_id, customer_id }: { sale_order_id: number; customer_id: number }) =>
    `promotions-${sale_order_id}-${customer_id}`,
  globalPromotions: 'global_promotions',
  promotionsApplyOnOrder: (companyId: number) => `promotions_apply_on_order_${companyId}`,
  promotionsApplyOnProduct: (productId: number) => `promotions_apply_on_product_${productId}`,
  promotionsApplyOnCategory: (categoryId: number) => `promotions_apply_on_category_${categoryId}`,
  cartSummary: `cart_summary`,
  cartSummaryLoading: `cart_summary_loading`,
  userInfo: 'userInfo',
  orderHistoryList: 'order_history_list',
  orderHistoryDetail: (id: number) => 'order_history_detail_' + id,
  shareOrderFile: (id: number) => 'share_order_file_' + id,
  getOrderStatus: 'get_order_satus',
  get_customers: 'get_customers',
} as const
