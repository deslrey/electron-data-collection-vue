import { RectNode, RectNodeModel } from '@logicflow/core'

// 基础节点（所有节点的祖先）
class BaseNodeModel extends RectNodeModel {
  constructor(data, graphModel) {
    super(data, graphModel)
    this.width = 100
    this.height = 40
    this.properties = {
      category: 'base',
      nodeType: 'base',
      params: {},
      hasParent: true,
      hasChildren: true
    }
  }
}
class BaseNode extends RectNode {}

// 起始节点（无父节点）
class StartNodeModel extends BaseNodeModel {
  constructor(data, graphModel) {
    super(data, graphModel)
    this.properties.category = 'start'
    this.properties.hasParent = false
    this.properties.nodeType = 'start'
    this.text.value = '开始'
  }
}
class StartNode extends BaseNode {}

// 条件节点（有父节点，也有子节点）
class ConditionNodeModel extends BaseNodeModel {
  constructor(data, graphModel) {
    super(data, graphModel)
    this.properties.category = 'condition'
    this.properties.nodeType = 'condition'
  }
}
class ConditionNode extends BaseNode {}

// 条件子节点：正确
class ConditionTrueNodeModel extends ConditionNodeModel {
  constructor(data, graphModel) {
    super(data, graphModel)
    this.properties.nodeType = 'condition-true'
    this.text.value = '条件正确'
  }
}
class ConditionTrueNode extends ConditionNode {}

// 条件子节点：错误
class ConditionFalseNodeModel extends ConditionNodeModel {
  constructor(data, graphModel) {
    super(data, graphModel)
    this.properties.nodeType = 'condition-false'
    this.text.value = '条件错误'
  }
}
class ConditionFalseNode extends ConditionNode {}

// 结束节点（有父节点，没有子节点）
class EndNodeModel extends BaseNodeModel {
  constructor(data, graphModel) {
    super(data, graphModel)
    this.properties.category = 'end'
    this.properties.nodeType = 'end'
    this.properties.hasChildren = false
    this.text.value = '结束'
  }
}
class EndNode extends BaseNode {}

// Nodes.ts
export {
  BaseNodeModel,
  BaseNode,
  StartNodeModel,
  StartNode,
  ConditionNodeModel,
  ConditionNode,
  ConditionTrueNodeModel,
  ConditionTrueNode,
  ConditionFalseNodeModel,
  ConditionFalseNode,
  EndNodeModel,
  EndNode
}
