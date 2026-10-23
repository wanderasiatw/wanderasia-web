'use client'

import { Fragment, useEffect, useState, type FormEvent } from 'react'
import type { FormField, FormLabel, PublicForm } from '@/lib/cms'
import { CONTACT } from '@/lib/contact'
import { LANG_CODE, type Lang } from '@/lib/i18n'
import { WhatsAppIcon } from './Icons'
import { useSite } from './SiteProvider'

type Status = 'idle' | 'sending' | 'sent'
type Values = Record<string, string>

/**
 * The inquiry form. Its fields come from the CMS, so adding or changing a field there needs no change here.
 * Submissions go to /api/inquire on this site, which passes them to the CMS inbox.
 */
export default function InquiryForm({ form, item, title, embedded }: { form: PublicForm | null; item?: string; title: string; embedded?: boolean }) {
  const { lang, t } = useSite()
  // The label in the page's language: CMS labels carry en/zh/zhHans/ja/ko; Simplified Chinese was
  // filled in from the Traditional text in getForm(), and anything missing falls back to English
  const text = (l: FormLabel | null | undefined) => {
    if (!l) return ''
    if (lang === 'ZH') return l.zh ?? l.en
    if (lang === 'ZH_HANS') return l.zhHans ?? l.en
    if (lang === 'JA') return l.ja ?? l.en
    if (lang === 'KO') return l.ko ?? l.en
    return l.en
  }

  const initial = (): Values => {
    const v: Values = {}
    for (const f of form?.fields ?? []) {
      v[f.name] = ''
      // Opened from a tour or service page: pick that tour or service
      if (f.type === 'choice' && item && f.options?.some((o) => o.value === item)) v[f.name] = item
    }
    return v
  }

  const [values, setValues] = useState<Values>(initial)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [shownAt, setShownAt] = useState(0)
  const [honeypot, setHoneypot] = useState('')

  useEffect(() => setShownAt(Date.now()), [])

  const errorText = (name: string, code: string) => {
    if (code === 'required') return t('formRequired')
    if (code === 'too-long') return t('formTooLong')
    if (code === 'one-of') return text(form?.oneOf.find((g) => g.fields.includes(name))?.message) || t('formRequired')
    return t('formInvalid')
  }

  async function submit(e: FormEvent) {
    e.preventDefault()
    if (!form || status === 'sending') return
    setStatus('sending')
    setMessage('')
    setErrors({})
    try {
      const res = await fetch('/api/inquire', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          ...values,
          _hp: honeypot,
          _t: shownAt,
          _lang: LANG_CODE[lang],
          _page: window.location.pathname + window.location.search,
        }),
      })
      if (res.ok) {
        setStatus('sent')
        window.scrollTo({ top: 0, behavior: 'smooth' })
        return
      }
      const body = (await res.json().catch(() => ({}))) as { fields?: Record<string, string> }
      if (res.status === 422 && body.fields) {
        setErrors(body.fields)
        setMessage(t('formCheck'))
      } else {
        setMessage(res.status === 429 ? t('formTooMany') : t('formFailed'))
      }
    } catch {
      setMessage(t('formFailed'))
    }
    setStatus('idle')
  }

  function reset() {
    setValues(initial())
    setErrors({})
    setMessage('')
    setShownAt(Date.now())
    setStatus('idle')
  }

  const set = (name: string, value: string) => {
    setValues((v) => ({ ...v, [name]: value }))
    if (errors[name]) setErrors(({ [name]: _gone, ...rest }) => rest)
  }

  const whatsapp = (
    <a href={CONTACT.whatsappUrl} target="_blank" rel="noreferrer" className="btn btn-whatsapp" style={{ padding: 12 }}>
      <WhatsAppIcon />
      <span>WhatsApp {CONTACT.whatsapp}</span>
    </a>
  )

  // On the contact page the form sits under the page's own banner, so only the form section is shown
  const formSection = (
      <section className="section">
        <div className="wa-container" style={{ maxWidth: 720 }}>
          {!form ? (
            <div className="panel flex flex-col gap-3">
              <p>{t('formUnavailable')}</p>
              {whatsapp}
            </div>
          ) : status === 'sent' ? (
            <div className="panel flex flex-col gap-3" role="status">
              <p style={{ fontSize: 16, fontWeight: 700 }}>{text(form.thanks)}</p>
              <button type="button" className="btn btn-outline" onClick={reset} style={{ alignSelf: 'flex-start' }}>{t('formAnother')}</button>
            </div>
          ) : (
            <form onSubmit={submit} noValidate className="panel flex flex-col gap-4">
              {form.fields.map((f) => {
                // Fields where one of a group is needed (email or WhatsApp): the group's note shows above the first, and neither says "optional"
                const group = form.oneOf.find((g) => g.fields.includes(f.name))
                return (
                  <Fragment key={f.name}>
                    {group && group.fields[0] === f.name && <p className="book-hint" style={{ margin: 0 }}>{text(group.message)}</p>}
                    <Field field={f} value={values[f.name] ?? ''} error={errors[f.name] ? errorText(f.name, errors[f.name]) : ''} onChange={(v) => set(f.name, v)} text={text} optional={group ? '' : t('formOptional')} choose={t('formChoose')} />
                  </Fragment>
                )
              })}

              {/* Hidden from people; bots that fill in every field get caught */}
              <div aria-hidden="true" style={{ position: 'absolute', left: '-10000px', width: 1, height: 1, overflow: 'hidden' }}>
                <label htmlFor="inq-website">Website</label>
                <input id="inq-website" type="text" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
              </div>

              {message && <p role="alert" style={{ color: '#b91c1c', fontSize: 13, fontWeight: 600 }}>{message}</p>}

              <button type="submit" className="btn btn-primary" disabled={status === 'sending'} style={{ padding: 12 }}>
                {status === 'sending' ? t('formSending') : t('formSend')}
              </button>
              {form.privacy && <p style={{ fontSize: 11, color: 'var(--stone-600)' }}>{text(form.privacy)}</p>}
            </form>
          )}
        </div>
      </section>
  )

  if (embedded) return formSection

  return (
    <main>
      <div className="hero" style={{ padding: '60px 0' }}>
        <div className="hero-bg" />
        <div className="wa-container hero-content">
          <h1>{form ? text(form.title) : title}</h1>
          {form?.intro && status !== 'sent' && <p style={{ marginBottom: 0 }}>{text(form.intro)}</p>}
        </div>
      </div>

      {formSection}
    </main>
  )
}

/** The CMS names option groups in English; the headings in each site language */
const GROUP_LABELS: Record<Lang, Record<string, string>> = {
  EN: {},
  ZH: { Tours: '行程', Services: '服務' },
  ZH_HANS: { Tours: '行程', Services: '服务' },
  JA: { Tours: 'ツアー', Services: 'サービス' },
  KO: { Tours: '투어', Services: '서비스' },
}

function Field({
  field: f,
  value,
  error,
  onChange,
  text,
  optional,
  choose,
}: {
  field: FormField
  value: string
  error: string
  onChange: (v: string) => void
  text: (l: FormLabel | null | undefined) => string
  optional: string
  choose: string
}) {
  const { lang } = useSite()
  const groupName = (name: string) => GROUP_LABELS[lang][name] ?? name
  const id = `inq-${f.name}`
  const common = {
    id,
    name: f.name,
    className: 'form-control',
    value,
    required: f.required,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': error || f.hint ? `${id}-help` : undefined,
    onChange: (e: { target: { value: string } }) => onChange(e.target.value),
  }

  // Options from the CMS, under headings such as "Tours" and "Services"
  const groups: { name: string | undefined; options: NonNullable<FormField['options']> }[] = []
  for (const o of f.options ?? []) {
    const last = groups[groups.length - 1]
    if (last && last.name === o.group) last.options.push(o)
    else groups.push({ name: o.group, options: [o] })
  }

  return (
    <div className="form-group">
      <label htmlFor={id}>
        {text(f.label)}
        {!f.required && optional && <span style={{ fontWeight: 600, textTransform: 'none', color: 'var(--stone-400)' }}> ({optional})</span>}
      </label>
      {f.type === 'textarea' ? (
        <textarea {...common} rows={5} maxLength={f.max ?? 3000} style={{ height: 'auto', lineHeight: 1.5 }} />
      ) : f.type === 'choice' ? (
        <select {...common}>
          <option value="">{choose}</option>
          {groups.map((g, i) =>
            g.name ? (
              <optgroup key={i} label={groupName(g.name)}>
                {g.options.map((o) => <option key={o.value} value={o.value}>{text(o.label)}</option>)}
              </optgroup>
            ) : (
              g.options.map((o) => <option key={o.value} value={o.value}>{text(o.label)}</option>)
            ),
          )}
        </select>
      ) : (
        <input
          {...common}
          type={f.type}
          maxLength={f.type === 'number' ? undefined : (f.max ?? 200)}
          min={f.type === 'number' ? f.min : undefined}
          max={f.type === 'number' ? f.max : undefined}
          inputMode={f.type === 'number' ? 'numeric' : undefined}
          autoComplete={f.type === 'email' ? 'email' : f.type === 'tel' ? 'tel' : f.name === 'name' ? 'name' : undefined}
        />
      )}
      {(error || f.hint) && (
        <p id={`${id}-help`} style={{ fontSize: 12, marginTop: 4, color: error ? '#b91c1c' : 'var(--stone-600)', fontWeight: error ? 600 : 400 }}>
          {error || text(f.hint)}
        </p>
      )}
    </div>
  )
}
