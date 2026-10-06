import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Button from '@/shared/ui/Button.jsx'
import { useCart } from '@/features/cart/CartProvider.jsx'
import { useAuth } from '@/features/auth/AuthProvider.jsx'
import CheckoutStepper from './components/CheckoutStepper.jsx'
import DeliveryForm from './components/DeliveryForm.jsx'
import OrderSummary from './components/OrderSummary.jsx'
import PaymentMethodPicker from './components/PaymentMethodPicker.jsx'
import CashOnDelivery from './components/CashOnDelivery.jsx'
import OnlinePayment from './components/OnlinePayment.jsx'
import ConfirmationStep from './components/ConfirmationStep.jsx'
import SuccessScreen from './components/SuccessScreen.jsx'
import {
  createEmptyOrder,
  validateDeliveryForm,
  PAYMENT_METHODS,
} from './domain/orderModel.js'
import { PAYMENT_CONFIG } from './domain/paymentConfig.js'
import { placeOrder, describeOrderError } from './services/orderService.js'
import { buildWhatsAppMessage, buildWhatsAppLink } from './domain/whatsappMessage.js'

export default function CheckoutPage() {
  const { items, summary, orderType } = useCart()
  const { user } = useAuth()
  const [order, setOrder] = useState(createEmptyOrder())
  const [errors, setErrors] = useState({})
  const [step, setStep] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)
  const [result, setResult] = useState(null)   // { orderId, orderNumber, total }
  const [waMessage, setWaMessage] = useState(null)

  const updateField = (key, value) => {
    setOrder((o) => ({ ...o, [key]: value }))
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }))
  }

  const goToStep = (n) => {
    setStep(n)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleContinueDelivery = () => {
    const v = validateDeliveryForm(order)
    setErrors(v)
    if (Object.keys(v).length === 0) goToStep(2)
  }

  const handleContinuePayment = () => goToStep(3)

  const handleConfirm = async () => {
    setSubmitError(null)
    setSubmitting(true)
    try {
      const res = await placeOrder({
        items,
        customer: {
          name: order.customerName,
          phone: order.customerPhone,
          address: order.customerAddress,
          notes: order.customerNotes,
        },
        orderType: order.deliveryType,
        paymentMethod: order.paymentMethod,
      })

      // Build WhatsApp message from the SERVER response (prices trusted)
      const lines = summary.lines.map((l) => ({
        productName: l.product?.name ?? '—',
        qty: l.line.qty,
        lineTotal: l.lineTotal,
      }))
      const message = buildWhatsAppMessage({
        lines,
        customer: {
          name: order.customerName,
          phone: order.customerPhone,
          address: order.customerAddress,
          notes: order.customerNotes,
        },
        orderType: order.deliveryType,
        paymentMethod: order.paymentMethod,
        totals: {
          subtotal: summary.subtotal,
          deliveryFee: summary.deliveryFee,
          total: res.total,
        },
        orderNumber: res.orderNumber,
      })

      setResult(res)
      setWaMessage(message)
    } catch (err) {
      setSubmitError(describeOrderError(err))
    } finally {
      setSubmitting(false)
    }
  }

  // ---- Success state ----
  if (result) {
    return (
      <div className="container-page py-14 sm:py-20">
        <SuccessScreen result={result} waMessage={waMessage} waPhone={PAYMENT_CONFIG.whatsapp.number} />
      </div>
    )
  }

  return (
    <div className="container-page py-10 sm:py-14">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <Link to="/menu" className="text-sm text-paper/60 hover:text-blood-bright">
          ← العودة للمنيو
        </Link>
        <h1 className="text-2xl font-bold text-white sm:text-3xl">إتمام الطلب</h1>
        <span className="w-24" aria-hidden />
      </div>

      {/* Stepper */}
      <div className="mb-10">
        <CheckoutStepper current={step} />
      </div>

      {/* Content */}
      <div className="grid gap-8 lg:grid-cols-[1fr,380px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="rounded-card border border-coal-line bg-coal/30 p-6 sm:p-8"
          >
            {step === 1 && (
              <>
                <h2 className="mb-6 text-xl font-bold text-white">بيانات التوصيل</h2>
                <DeliveryForm data={order} errors={errors} onChange={updateField} />
                <div className="mt-8 flex justify-end">
                  <Button size="lg" onClick={handleContinueDelivery}>
                    التالي: طريقة الدفع →
                  </Button>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <h2 className="mb-6 text-xl font-bold text-white">طريقة الدفع</h2>
                <PaymentMethodPicker
                  value={order.paymentMethod}
                  onChange={(v) => updateField('paymentMethod', v)}
                />
                <div className="mt-6">
                  <AnimatePresence mode="wait">
                    {order.paymentMethod === PAYMENT_METHODS.CASH ? (
                      <CashOnDelivery key="cash" />
                    ) : (
                      <OnlinePayment key="online" />
                    )}
                  </AnimatePresence>
                </div>
                <div className="mt-8 flex justify-between">
                  <Button variant="ghost" onClick={() => goToStep(1)}>
                    ← السابق
                  </Button>
                  <Button size="lg" onClick={handleContinuePayment}>
                    التالي: التأكيد →
                  </Button>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <h2 className="mb-6 text-xl font-bold text-white">تأكيد الطلب</h2>
                <ConfirmationStep
                  order={order}
                  onBack={() => goToStep(2)}
                  onConfirm={handleConfirm}
                  submitting={submitting}
                  error={submitError}
                />
              </>
            )}
          </motion.div>
        </AnimatePresence>

        <OrderSummary />
      </div>
    </div>
  )
}