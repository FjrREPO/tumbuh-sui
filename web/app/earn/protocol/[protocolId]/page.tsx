import ProtocolComponent from "./_components/protocol-component";

interface PageProps {
  params: Promise<{ protocolId: string }>;
}

export default async function page({ params }: PageProps) {
  const { protocolId } = await params;

  return <ProtocolComponent protocolId={protocolId} />;
}
