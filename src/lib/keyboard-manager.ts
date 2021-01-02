export class KeyboardManager<K extends string, V extends string> {
    keymap = new Map<K, V>()
    downKeys = new Set<V>()

    constructor(keymap: Record<K, V>) {
        this.keymap = new Map(Object.entries(keymap) as any)
        window.addEventListener('keydown', this.keydownListener)
        window.addEventListener('keyup', this.keyupListener)
    }

    keydownListener = (event: KeyboardEvent) => this.downKeys.add(event.key as any)
    keyupListener = (event: KeyboardEvent) => this.downKeys.delete(event.key as any)

    dispose() {
        this.keymap.clear()
        this.downKeys.clear()

        window.removeEventListener('keydown', this.keydownListener)
        window.removeEventListener('keyup', this.keyupListener)
    }

    isDown(...keys: V[]) {
        return keys.every(key => this.downKeys.has(key))
    }
}