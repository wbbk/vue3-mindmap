<template>
  <div class="page">
    <div class="panel">
      <div class="row">
        <button @click="mounted = !mounted">{{ mounted ? 'Unmount' : 'Mount' }}</button>
        <button @click="replaceModelValue">外部替换 modelValue</button>
      </div>
      <div class="row">
        <label>locale</label>
        <select v-model="locale">
          <option value="zh">zh</option>
          <option value="en">en</option>
          <option value="ptBR">ptBR</option>
        </select>
      </div>
      <div class="row">
        <label>scaleExtent</label>
        <input type="number" v-model.number="scaleExtent0" step="0.1" min="0.01" />
        <input type="number" v-model.number="scaleExtent1" step="0.1" min="0.01" />
      </div>
      <div class="row">
        <label><input type="checkbox" v-model="zoom" /> zoom</label>
        <label><input type="checkbox" v-model="ctm" /> contextmenu</label>
        <label><input type="checkbox" v-model="timetravel" /> timetravel</label>
        <label><input type="checkbox" v-model="cloneOnEmit" /> cloneOnEmit</label>
        <label><input type="checkbox" v-model="animate" /> animate</label>
        <label><input type="checkbox" v-model="edit" /> edit</label>
        <label><input type="checkbox" v-model="drag" /> drag</label>
      </div>
      <div class="row">
        <button @click="generateBigData(2000)">生成 2000 节点</button>
        <button @click="generateBigData(5000)">生成 5000 节点</button>
        <span>nodes: {{ nodeCount }}</span>
      </div>
      <div class="hint">
        <div>验证点：</div>
        <div>1) 右键菜单 zoomout 应该缩小；zoomin 应该放大。</div>
        <div>2) 修改 scaleExtent 后，zoomin/zoomout 的禁用状态与缩放边界应同步更新。</div>
        <div>3) 点击“外部替换 modelValue”，视图应刷新且时间旅行从新数据重新开始。</div>
        <div>4) 反复 Mount/Unmount 不应出现菜单/事件异常。</div>
        <div>5) 大数据下拖拽时，不应出现明显卡顿；关闭 animate/cloneOnEmit 应更流畅。</div>
      </div>
    </div>
    <div class="canvas">
      <mindmap
        v-if="mounted"
        v-model="data"
        :zoom="zoom"
        :ctm="ctm"
        :timetravel="timetravel"
        :clone-on-emit="cloneOnEmit"
        :animate="animate"
        :edit="edit"
        :drag="drag"
        :scale-extent="scaleExtent"
        :fit-btn="true"
        :center-btn="true"
        :download-btn="false"
        :add-node-btn="true"
        :locale="locale"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import Mindmap from '@/components/Mindmap'
import type { Data, Locale, TwoNumber } from '@/components/Mindmap/interface'

const makeData = (name: string): Data => ({
  name,
  children: [
    { name: `${name}-A`, children: [{ name: `${name}-A-1` }, { name: `${name}-A-2` }] },
    { name: `${name}-B`, children: [{ name: `${name}-B-1` }] }
  ]
})

const countNodes = (root: Data): number => {
  let count = 0
  const queue: Data[] = [root]
  while (queue.length) {
    const cur = queue.shift()!
    count += 1
    if (cur.children) { queue.push(...cur.children) }
  }
  return count
}

const makeBigData = (total: number): Data => {
  const root: Data = { name: 'Root', children: [] }
  const queue: Data[] = [root]
  let i = 1
  while (queue.length && i < total) {
    const parent = queue.shift()!
    if (!parent.children) { parent.children = [] }
    const addCount = Math.min(6, total - i)
    for (let c = 0; c < addCount; c += 1) {
      const child: Data = { name: `N-${i}` }
      i += 1
      parent.children.push(child)
      queue.push(child)
      if (i >= total) { break }
    }
  }
  return root
}

export default defineComponent({
  name: 'TestDemoApp',
  components: { Mindmap },
  setup () {
    const mounted = ref(true)
    const locale = ref<Locale>('zh')
    const data = ref<Data[]>([makeData('Root-1')])

    const scaleExtent0 = ref(0.2)
    const scaleExtent1 = ref(2.5)
    const scaleExtent = computed<TwoNumber>(() => {
      const a = Number(scaleExtent0.value)
      const b = Number(scaleExtent1.value)
      return a <= b ? [a, b] : [b, a]
    })

    const zoom = ref(true)
    const ctm = ref(true)
    const timetravel = ref(true)
    const cloneOnEmit = ref(true)
    const animate = ref(true)
    const edit = ref(true)
    const drag = ref(true)

    const replaceModelValue = () => {
      data.value = [makeData(`Root-${Date.now()}`)]
    }

    const generateBigData = (n: number) => {
      data.value = [makeBigData(n)]
    }

    const nodeCount = computed(() => countNodes(data.value[0]))

    return {
      mounted,
      locale,
      data,
      scaleExtent0,
      scaleExtent1,
      scaleExtent,
      zoom,
      ctm,
      timetravel,
      cloneOnEmit,
      animate,
      edit,
      drag,
      nodeCount,
      replaceModelValue,
      generateBigData
    }
  }
})
</script>

<style scoped>
.page {
  height: 100vh;
  display: grid;
  grid-template-columns: 360px 1fr;
}

.panel {
  padding: 12px;
  border-right: 1px solid #ddd;
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow: auto;
}

.row {
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
}

.hint {
  font-size: 12px;
  line-height: 1.5;
  color: #333;
}

.canvas {
  position: relative;
}
</style>
