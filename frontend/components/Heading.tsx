type HeadingProps = {
  pageTitle: string
}

const Heading: React.FC<HeadingProps> = ({ pageTitle }) => {
  return (
    <h2 className="text-lg text-center my-3">{pageTitle}</h2>
  );
}

export default Heading;