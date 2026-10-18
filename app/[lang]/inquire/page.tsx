import type { Metadata } from 'next'
import { getForm } from '@/lib/cms'
import { langFromParam, translate } from '@/lib/i18n'
import { pageMetadata } from '@/lib/seo'
import InquiryForm from '@/components/InquiryForm'

// The form's fields and its tour and service list come from the CMS on each request
export const dynamic = 'force-dynamic'

type Props = {
  params: Promise<{ lang: string }>
  searchParams: Promise<{ item?: string | string[] }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = langFromParam((await params).lang) ?? 'EN'
  return pageMetadata(lang, '/inquire', { title: translate(lang, 'metaInquiryTitle'), description: translate(lang, 'metaInquiryDesc') })
}

export default async function InquirePage({ params, searchParams }: Props) {
  const [{ lang: param }, { item }] = await Promise.all([params, searchParams])
  const lang = langFromParam(param) ?? 'EN'
  const form = await getForm('inquiry')
  return <InquiryForm form={form} item={typeof item === 'string' ? item : undefined} title={translate(lang, 'sendInquiry')} />
}
