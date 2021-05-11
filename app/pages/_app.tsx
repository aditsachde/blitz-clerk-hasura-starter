import {
  AppProps,
  ErrorComponent,
  useRouter,
  ErrorFallbackProps,
  useQueryErrorResetBoundary,
} from "blitz"
import { ErrorBoundary } from "react-error-boundary"
import { ClerkWrapper } from "../core/clerk"

export default function App({ Component, pageProps }: AppProps) {
  const getLayout = Component.getLayout || ((page) => page)
  const router = useRouter()

  return (
    <ErrorBoundary
      FallbackComponent={RootErrorFallback}
      resetKeys={[router.asPath]}
      onReset={useQueryErrorResetBoundary().reset}
    >
      <ClerkWrapper>{getLayout(<Component {...pageProps} />)}</ClerkWrapper>
    </ErrorBoundary>
  )
}

function RootErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  return <ErrorComponent statusCode={error.statusCode || 400} title={error.message || error.name} />
}
