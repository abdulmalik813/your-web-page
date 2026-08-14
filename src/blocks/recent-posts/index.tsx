import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { RecentPostsBlock } from '@/payload-types'
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { joinStyles } from '@/lib/make-styles'
import { Badge } from '@/components/ui/badge'
import { PageContext } from '@/types/page-context'

export async function RecentPostsBlockUI({
  pageContext,
  ...recentPostsBlock
}: Partial<RecentPostsBlock> & { pageContext: PageContext }) {
  const payload = await getPayload({ config: configPromise })

  const recentPosts = await payload.find({
    collection: 'posts',
    limit: recentPostsBlock.numberOfPosts,
    where: {
      id: {
        not_equals: pageContext?.page?.id,
      },
    },
    sort: '-publishedAt',
    depth: 1,
  })

  return (
    <Card className={joinStyles(recentPostsBlock.cardStyles)}>
      {recentPostsBlock.enableTitle && recentPostsBlock.title && (
        <CardHeader>
          <CardTitle className={joinStyles(recentPostsBlock.titleStyles)}>
            {recentPostsBlock.title}
          </CardTitle>
        </CardHeader>
      )}
      <CardContent className={joinStyles(recentPostsBlock.contentStyles)}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{pageContext?.setting?.postListingPageTitle}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentPosts.docs.map((post) => (
              <TableRow key={post.id}>
                <TableCell className="break-words">
                  <Link
                    className={joinStyles(recentPostsBlock.linkStyles)}
                    href={`/${pageContext?.setting?.postSlug || ''}/${post.slug}`}
                  >
                    {post.title}
                  </Link>
                  <div className="flex gap-2 mt-2">
                    {post.categories?.map(
                      (category) =>
                        typeof category === 'object' && (
                          <Badge key={category.id}>{category.name}</Badge>
                        ),
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
