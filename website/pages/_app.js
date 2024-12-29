import '../styles/globals.css'
import Layout from '../components/Layout'

function DigitalGateway({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  )
}

export default DigitalGateway 