// Order model + validation rules for checkout flow.
// Money = integer piasters.

export const PAYMENT_METHODS = {
    CASH: 'cash',
    ONLINE: 'online',
  }
  
  export const ORDER_STATUS = {
    PENDING: 'pending',
    PAID: 'paid',
    CONFIRMED: 'confirmed',
    DELIVERED: 'delivered',
    CANCELLED: 'cancelled',
  }
  
  export const createEmptyOrder = () => ({
    customerName: '',
    customerPhone: '',
    customerAddress: '',
    customerNotes: '',
    deliveryType: 'delivery',
    paymentMethod: PAYMENT_METHODS.CASH,
    paymentProof: null,
    paymentReference: '',
    items: [],
    subtotal: 0,
    deliveryFee: 0,
    discount: 0,
    total: 0,
    status: ORDER_STATUS.PENDING,
    createdAt: null,
  })
  
  export const validateDeliveryForm = (data) => {
    const errors = {}
    if (!data.customerName?.trim() || data.customerName.trim().length < 3) {
      errors.customerName = 'الاسم مطلوب (3 أحرف على الأقل)'
    }
    if (!data.customerPhone?.trim()) {
      errors.customerPhone = 'رقم التليفون مطلوب'
    } else if (!/^01[0-2,5]\d{8}$/.test(data.customerPhone.replace(/\s/g, ''))) {
      errors.customerPhone = 'رقم تليفون مصري غير صحيح'
    }
    if (data.deliveryType === 'delivery') {
      if (!data.customerAddress?.trim() || data.customerAddress.trim().length < 10) {
        errors.customerAddress = 'العنوان مطلوب (10 أحرف على الأقل)'
      }
    }
    return errors
  }