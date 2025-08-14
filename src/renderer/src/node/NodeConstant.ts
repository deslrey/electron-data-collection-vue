export const NodeConstant = {
  BASE_NODE: 'base-node', // 基本节点
  START_NODE: 'start-node', // 开始节点
  CONDITION_TRUE_NODE: 'condition-true-node', // 条件正确节点
  CONDITION_FALSE_NODE: 'condition-false-node', // 条件错误节点
  LOOP_NODE: 'loop-node', // 循环节点
  END_NODE: 'end-node' // 结束节点
} as const

export type NodeType = (typeof NodeConstant)[keyof typeof NodeConstant]
