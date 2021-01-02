import { Text } from "pixi.js";
import { app, sceneManager } from "../app";
import { Scene } from "../lib/scene";
import { MenuScene } from "./menu";

interface SplashSceneConfig {
    title?: string,
    subtitle?: string,
    assets: Record<string, string>,
    onLoaded: Function
}

export class SplashScene extends Scene {
    constructor(public config: SplashSceneConfig) {
        super()
    }

    setup() {
        this.render()

        for (let name in this.config.assets) {
            app.loader.add(name, this.config.assets[name]);
        }

        app.loader.load(() => this.config.onLoaded())
    }

    render() {
        const centerX = app.view.width / 2;
        const centerY = app.view.height / 2;

        const title = new Text(this.config.title, {
            fill: 0xFFFFFF,
            fontFamily: 'Press Start 2P',
            fontSize: 32
        })

        title.anchor.set(0.5, 0)

        // Centro X
        title.position.x = centerX

        // Centro Y
        title.position.y = centerY

        // add to stage
        this.stage.addChild(title)

        // Texto secundário

        const label = new Text(this.config.subtitle, {
            fill: 0xFFFFFF,
            fontFamily: 'Press Start 2P',
            fontSize: 16
        })

        label.anchor.set(0.5, 0)
        this.stage.addChild(label)

        label.position.x = centerX
        label.position.y = centerY + title.height + 32
    }

    update(dt: number) {

    }
}