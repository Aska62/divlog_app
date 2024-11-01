import Header from "@/components/Header";

const LogBookLayout: React.FC<{children: React.ReactNode}> = ({ children }) => {
  return (
    <>
      <Header />
      <main className="mt-20 md:mt-52 lg:mt-64">
        {children}
      </main>
    </>
  );
}

export default LogBookLayout;