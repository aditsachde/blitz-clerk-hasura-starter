import { ClerkProvider, SignedIn, SignedOut } from "@clerk/clerk-react"
import { useRouter } from "blitz"
import { useEffect } from "react"
import { ApolloProviderWrapper } from "./apollo"

// Retrieve Clerk settings from the environment
const clerkFrontendApi = process.env.CLERK_FRONTEND_API
const clerkSignInPath = "/sign-in"

/**
 * List pages you want to be publicly accessible, or leave empty if
 * every page requires authentication. Use this naming strategy:
 *  "/"              for pages/index.js
 *  "/foo"           for pages/foo/index.js
 *  "/foo/bar"       for pages/foo/bar.js
 *  "/foo/[...bar]"  for pages/foo/[...bar].js
 */
const publicPages = ["/sign-in/[[...index]]", "/sign-up/[[...index]]", "/"]

export const ClerkWrapper = (props) => {
  const router = useRouter()

  return (
    <ClerkProvider frontendApi={clerkFrontendApi} navigate={(to) => router.push(to)}>
      {publicPages.includes(router.pathname) ? (
        props.children
      ) : (
        <>
          <SignedIn>
            <ApolloProviderWrapper>{props.children}</ApolloProviderWrapper>
          </SignedIn>
          <SignedOut>
            <RedirectToSignIn />
          </SignedOut>
        </>
      )}
    </ClerkProvider>
  )
}

function RedirectToSignIn() {
  const router = useRouter()
  useEffect(() => {
    router.push(clerkSignInPath)
  })
  return null
}
