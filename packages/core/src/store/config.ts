import type { Theme } from '@/theme'
import { action, computed, makeObservable, observable } from 'mobx'
import { singleton } from 'tsyringe'

@singleton()
export class Config {
  @observable
  public config = {}

  @observable
  public theme: Theme = 'default'

  @action
  public setConfig(config: any) {
    this.config = config
  }

  @action
  public setTheme(theme: Theme) {
    this.theme = theme
  }

  @action
  public async queryConfig() {}

  @computed
  get env() {
    return this.config
  }

  constructor() {
    makeObservable(this)
  }
}
