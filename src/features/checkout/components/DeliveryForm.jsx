const inputClass =
  'min-h-[52px] w-full rounded-md border border-coal-line bg-coal-soft px-4 text-paper placeholder:text-paper/40 focus:border-blood-bright focus:outline-none focus:ring-1 focus:ring-blood-bright/40 transition-colors'

const labelClass = 'mb-2 block text-sm font-bold text-white'

export default function DeliveryForm({ data, errors = {}, onChange }) {
  const set = (key) => (e) => onChange(key, e.target.value)

  return (
    <div className="space-y-5">
      {/* Delivery type toggle */}
      <div>
        <span className={labelClass}>طريقة الاستلام</span>
        <div className="grid grid-cols-2 gap-2">
          {[
            { id: 'delivery', label: 'توصيل للمنزل' },
            { id: 'pickup', label: 'استلام من الفرع' },
          ].map((opt) => {
            const active = data.deliveryType === opt.id
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onChange('deliveryType', opt.id)}
                aria-pressed={active}
                className={`min-h-[52px] rounded-md border-2 font-bold transition-all ${
                  active
                    ? 'border-blood-bright bg-blood/15 text-white shadow-red-glow'
                    : 'border-coal-line bg-coal-soft text-paper/70 hover:border-paper/30 hover:text-white'
                }`}
              >
                {opt.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Name */}
      <div>
        <label htmlFor="co-name" className={labelClass}>
          الاسم بالكامل <span className="text-blood-bright">*</span>
        </label>
        <input
          id="co-name"
          type="text"
          autoComplete="name"
          value={data.customerName}
          onChange={set('customerName')}
          placeholder="مثال: أحمد محمد"
          className={inputClass}
          aria-invalid={!!errors.customerName}
        />
        {errors.customerName && (
          <p className="mt-1.5 text-sm text-blood-bright">{errors.customerName}</p>
        )}
      </div>

      {/* Phone */}
      <div>
        <label htmlFor="co-phone" className={labelClass}>
          رقم التليفون <span className="text-blood-bright">*</span>
        </label>
        <input
          id="co-phone"
          type="tel"
          inputMode="numeric"
          autoComplete="tel"
          dir="ltr"
          value={data.customerPhone}
          onChange={set('customerPhone')}
          placeholder="01XXXXXXXXX"
          className={`${inputClass} text-start`}
          aria-invalid={!!errors.customerPhone}
        />
        {errors.customerPhone && (
          <p className="mt-1.5 text-sm text-blood-bright">{errors.customerPhone}</p>
        )}
      </div>

      {/* Address (only if delivery) */}
      {data.deliveryType === 'delivery' && (
        <div>
          <label htmlFor="co-address" className={labelClass}>
            العنوان بالتفصيل <span className="text-blood-bright">*</span>
          </label>
          <textarea
            id="co-address"
            rows="3"
            autoComplete="street-address"
            value={data.customerAddress}
            onChange={set('customerAddress')}
            placeholder="المدينة، الحي، الشارع، رقم المبنى، رقم الشقة، علامة مميزة..."
            className={`${inputClass} min-h-[100px] resize-y py-3`}
            aria-invalid={!!errors.customerAddress}
          />
          {errors.customerAddress && (
            <p className="mt-1.5 text-sm text-blood-bright">{errors.customerAddress}</p>
          )}
        </div>
      )}

      {/* Notes */}
      <div>
        <label htmlFor="co-notes" className={labelClass}>
          ملاحظات (اختياري)
        </label>
        <textarea
          id="co-notes"
          rows="2"
          value={data.customerNotes}
          onChange={set('customerNotes')}
          placeholder="مثال: بدون بصل، صوص زيادة..."
          className={`${inputClass} min-h-[80px] resize-y py-3`}
        />
      </div>
    </div>
  )
}