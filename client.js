/**
 * Client half of dsh-plugin-market-entry.
 *
 * Two registrations make the feature:
 * - `sidebar.panellist` adds a fresh icon cell to the global panel row. The
 *   sidebar owns the button; the id is the panel it selects.
 * - `main` answers that id with the panel the market is rendered into.
 *
 * The market body is provided live by the installed plugin market bundle
 * through its Client service `market`; that service renders the market inside
 * a host-supplied container, which is exactly this panel. If the service is
 * absent (market bundle disabled) the panel shows a localized landing card
 * that opens the Plugin Manager page instead.
 */
window.__ModuleLoader__.load({
  id: 'dsh-plugin-market-entry',
  factory(require) {
    const React = require('react')
    const h = React.createElement

    const NS = 'plugin-market-entry'
    const PANEL_ID = 'plugin-market'
    const PANEL_ORDER = 1

    const en = {
      nav: 'Plugin Market',
      title: 'Plugin Market',
      description:
        'Discover and install plugins and bundles for DeepSeek Harness. Browse the market to add new capabilities to your workspace.',
      openPlugins: 'Open Plugin Manager',
      fallbackHint:
        'The market service is not connected right now. Open the Plugin Manager to browse the plugins installed in this profile.',
    }

    const zh = {
      nav: '插件市场',
      title: '插件市场',
      description:
        '发现并安装 DeepSeek Harness 的插件与 Bundle，为你的工作区添加新的能力。',
      openPlugins: '打开插件管理',
      fallbackHint:
        '当前没有连接到插件市场服务，可以先打开插件管理页，浏览这个配置里已安装的插件。',
    }

    /** Storefront glyph used by both the sidebar cell and the landing card. */
    function MarketGlyph(props) {
      const size =
        props && typeof props.size === 'number' && props.size > 0
          ? props.size
          : 16
      return h(
        'svg',
        {
          width: size,
          height: size,
          viewBox: '0 0 24 24',
          fill: 'none',
          stroke: 'currentColor',
          strokeWidth: 1.7,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          'aria-hidden': 'true',
          style: { display: 'block' },
        },
        h('path', { d: 'M4.5 9.5 5.8 4.2h12.4l1.3 5.3' }),
        h('path', { d: 'M4.5 9.5h15v10h-15z' }),
        h('path', { d: 'M9.6 19.5v-5.2h4.8v5.2' }),
      )
    }

    function LandingCard(props) {
      const t = props.t
      const openManager = function () {
        const layout = props.layout
        if (layout && typeof layout.selectPanel === 'function') {
          layout.selectPanel('plugins')
        }
      }
      return h(
        'div',
        {
          style: {
            height: '100%',
            width: '100%',
            boxSizing: 'border-box',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '32px',
            background: 'var(--dsw-alias-bg-base)',
            color: 'var(--dsw-alias-label-primary)',
          },
        },
        h(
          'div',
          {
            style: {
              width: '100%',
              maxWidth: '560px',
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16px',
              padding: '36px 32px',
              background: 'var(--dsw-alias-bg-layer-1)',
              border: '1px solid var(--dsw-alias-border-l1)',
              borderRadius: '16px',
            },
          },
          h(
            'div',
            {
              style: {
                width: '56px',
                height: '56px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '16px',
                background: 'var(--dsw-alias-bg-layer-2)',
                color: 'var(--dsw-alias-brand-primary)',
              },
            },
            h(MarketGlyph, { size: 28 }),
          ),
          h(
            'div',
            { style: { fontSize: '20px', fontWeight: 600, lineHeight: 1.3 } },
            t('title'),
          ),
          h(
            'div',
            {
              style: {
                fontSize: '13px',
                lineHeight: 1.7,
                textAlign: 'center',
                color: 'var(--dsw-alias-label-secondary)',
              },
            },
            t('description'),
          ),
          h(
            'div',
            {
              style: {
                fontSize: '12px',
                lineHeight: 1.6,
                textAlign: 'center',
                color: 'var(--dsw-alias-label-secondary)',
              },
            },
            t('fallbackHint'),
          ),
          h(
            'button',
            {
              type: 'button',
              onClick: openManager,
              style: {
                marginTop: '4px',
                padding: '9px 20px',
                border: 'none',
                borderRadius: '10px',
                background: 'var(--dsw-alias-brand-primary)',
                color: '#ffffff',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
              },
            },
            t('openPlugins'),
          ),
        ),
      )
    }

    function MarketPanel(props) {
      const market = props.market
      if (market && typeof market.render === 'function') {
        // The market service builds its panel per call. `surface` is part of
        // the builder (the market bundle's own sidebar page asks for
        // `'sidebar'`); passing it through the documented `render(props)`
        // entry keeps our panel laid out like that page. Older market builds
        // that ignore the extra key still return their default panel.
        let element = null
        try {
          element = market.render({ surface: 'sidebar' })
        } catch (error) {
          element = null
        }
        if (element) {
          return h(
            'div',
            {
              style: {
                height: '100%',
                width: '100%',
                minHeight: 0,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'auto',
                background: 'var(--dsw-alias-bg-base)',
              },
            },
            element,
          )
        }
      }
      return h(LandingCard, { t: props.t, layout: props.layout })
    }

    return {
      inject: ['slots', 'locale'],
      apply(ctx) {
        const locale = ctx.locale
        if (locale && typeof locale.register === 'function') {
          ctx.effect(function () {
            return locale.register(NS, { en: en, zh: zh })
          }, 'plugin-market-entry.locale')
        }
        const t =
          locale && typeof locale.bind === 'function'
            ? locale.bind(NS)
            : function (key) {
                return key
              }
        const layout =
          typeof ctx.get === 'function' ? ctx.get('layout') : undefined

        ctx.slots.inject('sidebar.panellist', function () {
          return ctx.slots.register(
            {
              name: 'sidebar.panellist',
              id: PANEL_ID,
              order: PANEL_ORDER,
              label: function () {
                return t('nav')
              },
            },
            function (owner) {
              const active = !!(owner && owner.active)
              const size = (owner && owner.size) || 16
              return h(
                'span',
                {
                  style: {
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: active
                      ? 'var(--dsw-alias-brand-primary)'
                      : 'inherit',
                  },
                },
                h(MarketGlyph, { size: size }),
              )
            },
          )
        })

        ctx.slots.inject('main', function () {
          return ctx.slots.register(
            { name: 'main', key: PANEL_ID },
            function () {
              const market =
                typeof ctx.get === 'function' ? ctx.get('market') : undefined
              return h(MarketPanel, { market: market, t: t, layout: layout })
            },
          )
        })
      },
    }
  },
})
