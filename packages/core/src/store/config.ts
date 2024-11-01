import { action, computed, makeObservable, observable } from 'mobx'
import { singleton } from 'tsyringe'

@singleton()
export class Config {
  @observable
  public config = {}

  @action
  public setConfig(config: any) {
    this.config = config
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
