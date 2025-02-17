import { message } from '@tauri-apps/api/dialog'

import type { ToastCapability, ToastOptions } from '../types'

export class DesktopToast implements ToastCapability {
  async show(options: ToastOptions): Promise<void> {
    const { type = 'info', title, message: content } = options

    switch (type) {
      case 'error':
        await message(content, { title: title || '错误', type: 'error' })
        break
      case 'warning':
        await message(content, { title: title || '警告', type: 'warning' })
        break
      case 'success':
        await message(content, { title: title || '成功', type: 'info' })
        break
      case 'info':
      default:
        await message(content, { title: title || '提示', type: 'info' })
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
