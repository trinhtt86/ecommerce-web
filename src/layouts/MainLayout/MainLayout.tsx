import Header from 'src/components/Header'

interface Props {
  children?: React.ReactNode
}
export default function MainLayout({ children }: Props) {
  return (
    <div className='bg-[#eee]'>
      <Header />
      {children}
    </div>
  )
}
