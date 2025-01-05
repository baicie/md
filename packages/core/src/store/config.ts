import type { StorageType } from '@/service/types'
import { persistent } from '@/utils/decorators'
import { action, computed, makeObservable, observable } from 'mobx'
import { singleton } from 'tsyringe'

@singleton()
export class Config {
  @observable
  public config = {
    apiUrl: '',
    token: '',
  }

  @observable
  @persistent()
  public storageType: StorageType = 'local'

  @action
  public setConfig(config: typeof this.config) {
    this.config = config
  }

  @action
  public setStorageType(type: StorageType) {
    this.storageType = type
  }

  @computed
  get currentConfig() {
    return {
      storageType: this.storageType,
      apiUrl: this.config.apiUrl,
      token: this.config.token,
    }
  }

  public queryConfig() {
    return this.currentConfig
  }

  constructor() {
    makeObservable(this)
  }
}
