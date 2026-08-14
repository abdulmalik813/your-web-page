import { Block } from 'payload'
import { defaultLexical } from '@/fields/lexical-field'
import { MediaBlock } from '@/blocks/media/config'
import { NavigationBlock } from '@/blocks/navigation/config'
import { TabBlock } from '@/blocks/tab/config'
import { CardBlock } from '@/blocks/card/config'
import { AccordionBlock } from '@/blocks/accordion/config'
import { DividerBlock } from '@/blocks/divider/config'
import { defaultLexicalValue } from '@/constants/default-lexical'
import { FormBlock } from '@/blocks/form/config'
import { TableBlock } from '@/blocks/table/config'
import { IconBlock } from '../icon/config'

export const ContentBlock = (dbPrefix: string = ''): Block => ({
  slug: 'contentBlock',
  interfaceName: 'ContentBlock',
  dbName: `${dbPrefix}content`,
  fields: [
    {
      name: 'contentStyles',
      type: 'relationship',
      relationTo: 'styles',
      hasMany: true,
    },
    {
      name: 'content',
      type: 'richText',
      editor: defaultLexical({
        features: {
          blocks: {
            blocks: [
              MediaBlock("cnt"),
              NavigationBlock("cnt"),
              TabBlock("cnt"),
              CardBlock("cnt"),
              AccordionBlock("cnt"),
              DividerBlock("cnt"),
              FormBlock("cnt"),
              TableBlock("cnt"),
            ],
            inlineBlocks: [NavigationBlock("cntI"), IconBlock("cntI")],
          },
        },
      }),
      defaultValue: defaultLexicalValue,
    },
  ],
  graphQL: {
    singularName: 'ContentBlock',
  },
})
