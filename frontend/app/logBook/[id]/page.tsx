type LogPageProps = {
  params: {
    id: string
  }
}

const LogPage:React.FC<LogPageProps> = async ({ params }) => {
  const { id } = await params;

  return (
  <>
    Log
  </> );
}

export default LogPage;