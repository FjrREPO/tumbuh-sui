import VaultComponent from "./_components/vault-component";

interface PageProps {
  params: Promise<{ vaultId: string }>;
}

export default async function page({ params }: PageProps) {
  const { vaultId } = await params;

  return <VaultComponent vaultId={vaultId} />;
}
