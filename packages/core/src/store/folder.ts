import { makeObservable } from 'mobx'
import { singleton } from 'tsyringe'

@singleton()
export class Folder {
  constructor() {
    makeObservable(this)
  }
}
