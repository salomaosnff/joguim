import { Viewport } from "pixi-viewport";
import { Container } from "pixi.js";

export abstract class Scene {
    stage = new Container()
    camera = this.stage.addChild(new Viewport())

    setup() { }

    update(deltaTime?: number) { }

    destroy() { }
}