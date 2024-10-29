import { observer } from 'mobx-react-lite'
import { useInjectable } from '../../hooks/use-di'
import { useLogger } from '../../hooks/use-logger'
import { Demo } from '../../store/demo'
import OverviewView from './overview-view'
import { useState } from 'react'

export default observer(() => {
  const demo = useInjectable(Demo)
  const logger = useLogger()

  const [content, setContent] = useState()

  return <OverviewView />
})
