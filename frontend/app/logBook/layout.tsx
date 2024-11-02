import Header from "@/components/Header";

const LogBookLayout: React.FC<{children: React.ReactNode}> = ({ children }) => {
  return (
    <>
      <Header />
      <main className="w-100vw mt-20">
        {children}
      </main>
    </>
  );
}

export default LogBookLayout;