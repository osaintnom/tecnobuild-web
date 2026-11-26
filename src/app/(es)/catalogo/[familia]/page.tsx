import { FamilyPage, familyMetadata, familyParams } from '@/views/FamilyPage';

type Props = { params: Promise<{ familia: string }> };

export const dynamicParams = false;
export const generateStaticParams = familyParams;
export async function generateMetadata({ params }: Props) { return familyMetadata('es', (await params).familia); }
export default async function Page({ params }: Props) { return <FamilyPage locale="es" slug={(await params).familia} />; }
