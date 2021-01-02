import { Container, Ticker } from "pixi.js";
import { Scene } from "./scene";

export class SceneManager {
    currentScene !: Scene;

    constructor(private readonly container: Container) {
        Ticker.shared.add((deltaTime) => {
            if (this.currentScene) {
                this.currentScene.update(deltaTime)
            }
        })
    }

    replace(scene: Scene) {
        // Destroi a cena atual
        if (this.currentScene) {
            this.currentScene.destroy()
            this.container.removeChild(this.currentScene.stage)
        }

        // Monta a nova cena
        this.currentScene = scene
        this.currentScene.setup()
        this.container.addChild(this.currentScene.stage)
    }
}