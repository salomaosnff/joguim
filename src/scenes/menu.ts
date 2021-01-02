import { Container, Graphics, Text } from "pixi.js";
import { app } from "../app";
import { Scene } from "../lib/scene";

interface MenuOption {
    text: string;
    handler: Function
}

interface MenuConfig {
    title?: string,
    subtitle?: string
    options: MenuOption[]
}

export class MenuScene extends Scene {
    optionsContainer: Container;
    cursor: Graphics;
    hoverIndex: number = 0;

    constructor(public config: MenuConfig) {
        super()
    }

    setup() {
        // return this.start()
        this.render()

        window.addEventListener('keydown', this.keyUpListener)
    }

    destroy() {
        window.removeEventListener('keydown', this.keyUpListener)
    }

    keyUpListener = (e: KeyboardEvent) => {
        if (e.key === 'ArrowUp') {
            this.hover(this.hoverIndex - 1)
        } else if (e.key === 'ArrowDown') {
            this.hover(this.hoverIndex + 1)
        } else if (e.key === 'Enter') {
            this.select(this.hoverIndex)
        }
    }

    renderTitle() {
        const title = new Text(this.config.title, {
            fill: 0xFFFFFF,
            fontFamily: 'Press Start 2P',
            fontSize: 32
        })
        const subtitle = new Text(this.config.subtitle, {
            fill: 0xFFFFFF,
            fontFamily: 'Press Start 2P',
            fontSize: 14
        })

        title.anchor.set(0.5, 0)
        subtitle.anchor.set(0.5, 0)

        title.position.x = subtitle.position.x = title.width / 2;
        subtitle.position.y = title.height + 16

        // add to stage
        this.stage.addChild(title, subtitle)
    }

    renderOptions() {
        const container = this.optionsContainer = new Container()

        this.config.options.forEach((option, index) => {
            const text = new Text(option.text, {
                fontFamily: 'Press Start 2P',
                fill: 0xFFFFFF,
                fontSize: 14
            })

            text.interactive = true;

            text.x = 24
            text.y = index * 24

            text.addListener('pointerover', () => this.hover(index))
            text.addListener('pointerup', () => this.select(index))

            container.addChild(text)
        })

        this.stage.addChild(container)

        container.position.x = 0
        container.position.y = 128
    }

    render() {
        this.renderTitle()
        this.renderOptions()
        this.renderCursor()

        this.stage.x = app.view.width / 2
        this.stage.y = app.view.height / 2
        this.stage.pivot.x = this.stage.width / 2
        this.stage.pivot.y = this.stage.height / 2
    }

    renderCursor() {
        const cursor = this.cursor = new Graphics()

        cursor.beginFill(0xFFFFFFF)
        cursor.drawPolygon([
            0, 0,
            16, 8,
            0, 16
        ])
        cursor.endFill()

        this.optionsContainer.addChild(cursor)
    }

    hover(index: number) {
        if (index < 0) index = this.config.options.length - 1
        else if (index > this.config.options.length - 1) index = 0

        this.hoverIndex = index % this.config.options.length;
        this.cursor.y = index * 24;
    }

    select(index: number) {
        const option = this.config.options[index];
        option.handler()
    }

    update(dt: number) {

    }
}