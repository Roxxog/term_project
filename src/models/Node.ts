export const nodeColors = [
  { name: '회색 (기본)', value: '#a0a0a0' },
  { name: '빨강', value: '#f5a6a6' },
  { name: '주황', value: '#ffc48a' },
  { name: '노랑', value: '#ffe48a' },
  { name: '초록', value: '#a9d9ae' },
  { name: '파랑', value: '#a4c9f5' },
  { name: '보라', value: '#cbb5f2' },
] as const

export type NodeColor = (typeof nodeColors)[number]['value']

export const nodeTitleColors = [
  { name: '검정 (기본)', value: '#171717' },
  { name: '흰색', value: '#ffffff' },
  ...nodeColors.slice(1),
] as const

export type NodeTitleColor = (typeof nodeTitleColors)[number]['value']

export class Node {
  readonly id: number
  title = ''
  description = ''
  draftTitle = ''
  isEditingTitle = true
  x = 0
  y = 0
  color: NodeColor = nodeColors[0].value
  titleColor: NodeTitleColor = nodeTitleColors[0].value

  constructor(id: number) {
    this.id = id
  }

  moveTo(x: number, y: number) {
    this.x = x
    this.y = y
  }

  setColor(color: NodeColor) {
    this.color = color
  }

  setTitleColor(color: NodeTitleColor) {
    this.titleColor = color
  }

  setDescription(description: string) {
    this.description = description
  }

  startTitleEditing() {
    if (this.isEditingTitle) return

    this.draftTitle = this.title
    this.isEditingTitle = true
  }

  confirmTitle() {
    if (!this.isEditingTitle) return

    this.title = this.draftTitle.trim()
    this.draftTitle = ''
    this.isEditingTitle = false
  }
}
