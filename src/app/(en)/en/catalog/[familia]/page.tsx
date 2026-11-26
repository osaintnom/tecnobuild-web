import { FamilyPage, familyMetadata, familyParams } from '@/views/FamilyPage';

type Props = { params: Promise<{ familia: string }> };

export const dynamicParams = false;
export const generateStaticParams = familyParams;
export async function generateMetadata({ params }: Props) { return familyMetadata('en', (await params).familia); }
export default async function Page({ params }: Props) { return <FamilyPage locale="en" slug={(await params).familia} />; }
