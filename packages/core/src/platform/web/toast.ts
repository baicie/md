import toast from 'react-hot-toast'

import type { ToastCapability, ToastOptions } from '../types'

export class WebToast implements ToastCapability {
  show(options: ToastOptions): void {
    const {
      type = 'info',
      message,
      duration = 2000,
      position = 'top-right',
    } = options

    switch (type) {
      case 'success':
        toast.success(message, {
          duration,
          position,
          className: 'dark:bg-neutral-800 dark:text-white',
        })
        break
      case 'error':
        toast.error(message, {
          duration,
          position,
          className: 'dark:bg-neutral-800 dark:text-white',
        })
        break
      case 'warning':
        toast(message, {
          duration,
          position,
          className:
            'dark:bg-neutral-800 dark:text-white dark:border-amber-500',
          icon: '⚠️',
        })
        break
      case 'info':
      default:
        toast(message, {
          duration,
          position,
          className: 'dark:bg-neutral-800 dark:text-white',
        })
    }
  }

  success(
    message: string,
    options?: Omit<ToastOptions, 'type' | 'message'>,
  ): void {
    this.clear()
    this.show({ ...options, type: 'success', message })
  }

  error(
    message: string,
    options?: Omit<ToastOptions, 'type' | 'message'>,
  ): void {
    this.clear()
    this.show({ ...options, type: 'error', message })
  }

  warning(
    message: string,
    options?: Omit<ToastOptions, 'type' | 'message'>,
  ): void {
    this.clear()
    this.show({ ...options, type: 'warning', message })
  }

  info(
    message: string,
    options?: Omit<ToastOptions, 'type' | 'message'>,
  ): void {
    this.clear()
    this.show({ ...options, type: 'info', message })
  }

  clear(): void {
    toast.dismiss()
  }
}
