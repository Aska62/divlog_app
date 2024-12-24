import Header from "@/components/menu/Header";

const BuddyLayout: React.FC<{children: React.ReactNode}> = ({ children }) => {
  return (
    <>
      <Header />
      <main className="w-100vw mt-20">
        {children}
      </main>
    </>
  );
}

export default BuddyLayout;