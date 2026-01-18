import { ref } from 'vue'
import { Mdata } from '../interface'
import Snapshot from './Snapshot'
import emitter from '@/mitt'

export const snapshot = new Snapshot<Mdata>()
emitter.on<number>('snapshot-length', (value) => {
  if (typeof value === 'number' && Number.isFinite(value)) { snapshot.setLength(value) }
})

// 时间旅行状态
export const hasPrev = ref(false)
export const hasNext = ref(false)

export const updateTimeTravelState = (): void => {
  hasPrev.value = snapshot.hasPrev
  hasNext.value = snapshot.hasNext
}
