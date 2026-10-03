import { useState } from 'react'
import Button from '../../shared/ui/Button.jsx'
import Card from '../../shared/ui/Card.jsx'
import Modal from '../../shared/ui/Modal.jsx'
import { TextField, TextArea, SelectField } from '../../shared/ui/Fields.jsx'

export default function DesignSystemPage() {
  const [open, setOpen] = useState(false)
  return (
    <div className="container-page space-y-10 py-10">
      <h1 className="text-4xl font-bold">نظام التصميم</h1>
      <section className="space-y-3"><h2 className="text-2xl">الأزرار</h2>
        <div className="flex flex-wrap gap-3">
          <Button>أساسي</Button><Button variant="ghost">شفاف</Button><Button variant="dark">داكن</Button>
          <Button size="sm">صغير</Button><Button size="lg">كبير</Button><Button disabled>معطل</Button>
        </div></section>
      <section className="space-y-3"><h2 className="text-2xl">البطاقات</h2>
        <div className="grid gap-4 sm:grid-cols-2"><Card className="p-5">بطاقة عادية</Card><Card interactive className="p-5">بطاقة تفاعلية (مرر عليها)</Card></div></section>
      <section className="max-w-md space-y-4"><h2 className="text-2xl">الحقول</h2>
        <TextField label="الاسم" placeholder="اكتب اسمك" hint="هيظهر على الطلب" />
        <TextField label="رقم الهاتف" defaultValue="123" error="الرقم غير صحيح" dir="ltr" />
        <SelectField label="النوع"><option>توصيل</option><option>استلام</option></SelectField>
        <TextArea label="ملاحظات" /></section>
      <section className="space-y-3"><h2 className="text-2xl">النافذة المنبثقة</h2>
        <Button onClick={() => setOpen(true)}>افتح النافذة</Button>
        <Modal open={open} onClose={() => setOpen(false)} title="عنوان النافذة">
          <p className="mb-4 text-paper/80">Esc أو الضغط خارج النافذة يقفلها.</p><Button onClick={() => setOpen(false)}>تمام</Button>
        </Modal></section>
    </div>
  )
}
