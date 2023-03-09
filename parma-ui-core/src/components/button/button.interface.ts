import { CallbackFunctionArgs, CallbackFunctionArgsReturnAny } from '../../helpers'

/**
 * Интерфейс кнопки
 */
export interface ButtonInterface {
  theme: string
  baseline?: boolean
  size?: 'ns' | 'xs' | 's' | 'm' | 'l' | 'n' | 'head'
  id?: string
  name?: string
  title?: string
  tabIndex?: number
  text?: string
  type?: string
  iconLeft?: any
  iconRight?: any
  onClick?: CallbackFunctionArgs
  progress?: boolean
  action?: boolean
  pale?: boolean
  checked?: boolean
  innerRef?: CallbackFunctionArgsReturnAny
  pressKeys?: any[]
  prvntKeys?: any[]
  view?: string
}
