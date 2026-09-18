import { describe, expect, it } from 'vitest'
import { createSSRApp, h } from 'vue'
import { renderToString } from '@vue/server-renderer'
import ListFooter from './ListFooter.vue'

// The page length picker is a TabButtons group fed from
// `options.pageLengthOptions`. With the removed `buttons` prop the group
// received no items and rendered nothing (frappe/frappe-ui#1170), so the
// server-rendered markup has to carry one pill per configured length.

function render(props: Record<string, unknown>) {
  return renderToString(createSSRApp({ render: () => h(ListFooter, props) }))
}

function pillCount(html: string) {
  return html.match(/data-slot="tab-button"/g)?.length ?? 0
}

describe('ListFooter (SSR)', () => {
  it('renders one pill per default page length option', async () => {
    const html = await render({
      options: { rowCount: 20, totalCount: 100 },
    })
    expect(pillCount(html)).toBe(3)
    expect(html).toContain('>20<')
    expect(html).toContain('>50<')
    expect(html).toContain('>100<')
  })

  it('follows custom page length options', async () => {
    const html = await render({
      options: { rowCount: 10, totalCount: 30, pageLengthOptions: [10, 30] },
    })
    expect(pillCount(html)).toBe(2)
    expect(html).toContain('>10<')
    expect(html).toContain('>30<')
    expect(html).not.toContain('>50<')
  })
})
