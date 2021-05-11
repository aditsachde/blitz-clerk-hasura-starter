import { ApolloProvider, ApolloClient, HttpLink, from, InMemoryCache } from "@apollo/client"
import { setContext } from "@apollo/client/link/context"
import { useUser } from "@clerk/clerk-react"

const hasuraGraphqlUrl = process.env.HASURA_GRAPHQL_URL

export const ApolloProviderWrapper = (props) => {
  const user = useUser()
  const authMiddleware = setContext(async (req, { headers }) => {
    const token = await user.getToken("hasura", {})
    return {
      headers: {
        ...headers,
        authorization: `Bearer ${token}`,
      },
    }
  })

  const httpLink = new HttpLink({
    uri: hasuraGraphqlUrl,
  })

  const apolloClient = new ApolloClient({
    link: from([authMiddleware, httpLink]),
    cache: new InMemoryCache(),
  })

  return <ApolloProvider client={apolloClient}>{props.children}</ApolloProvider>
}
