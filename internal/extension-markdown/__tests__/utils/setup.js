import serializeHtml from 'jest-serializer-html'
import { expect } from 'vitest'

expect.addSnapshotSerializer(serializeHtml)
