const PageContainer = ({children}: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pb-28 font-sans">
      {children}
    </div>
  )
}

export default PageContainer;