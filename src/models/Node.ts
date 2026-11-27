export class Node {
  readonly id: number
  title = ''
  isEditingTitle = true
  x = 0
  y = 0

  constructor(id: number) {
    this.id = id
  }

  moveTo(x: number, y: number) {
    this.x = x
    this.y = y
  }

  confirmTitle(title: string) {
    if (!this.isEditingTitle) return

    this.title = title.trim()
    this.isEditingTitle = false
  }
}
