import {
  isPermissionGranted,
  requestPermission,
  sendNotification,
} from '@tauri-apps/plugin-notification'

import type { ToastCapability, ToastOptions } from '../types'

export class DesktopToast implements ToastCapability {
  private permission = false
  private initPermission = async () => {
    this.permission = await isPermissionGranted()
    if (!this.permission) {
      const permission = await requestPermission()
      this.permission = permission === 'granted'
    }
  }

  async show(options: ToastOptions): Promise<void> {
    const { type = 'info', title, message: content } = options
    await this.initPermission()
    if (!this.permission) {
      return
    }
    sendNotification({ title: 'Tauri', body: 'Tauri is awesome!' })
    switch (type) {
      case 'error':
        sendNotification({
          title: title || '错误',
          body: content,
        })
        break
      case 'warning':
        sendNotification({
          title: title || '警告',
          body: content,
        })
        break
      case 'success':
        sendNotification({
          title: title || '成功',
          body: content,
        })
        break
      case 'info':
      default:
        sendNotification({
          title: title || '提示',
          body: content,
        })
    }
  }

  success(
    message: string,
    options?: Omit<ToastOptions, 'type' | 'message'>,
  ): void {
    this.show({ ...options, type: 'success', message })
  }

  error(
    message: string,
    options?: Omit<ToastOptions, 'type' | 'message'>,
  ): void {
    this.show({ ...options, type: 'error', message })
  }

  warning(
    message: string,
    options?: Omit<ToastOptions, 'type' | 'message'>,
  ): void {
    this.show({ ...options, type: 'warning', message })
  }

  info(
    message: string,
    options?: Omit<ToastOptions, 'type' | 'message'>,
  ): void {
    this.show({ ...options, type: 'info', message })
  }

  clear(): void {
    // Desktop 平台的消息是模态的，不需要清除
  }
}
