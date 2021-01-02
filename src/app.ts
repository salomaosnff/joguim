import * as PIXI from "pixi.js";
import { KeyboardManager } from "./lib/keyboard-manager";
import { SceneManager } from "./lib/scene-manager";

window.PIXI = PIXI

export const app = new PIXI.Application({
    width: document.body.clientWidth,
    height: document.body.clientHeight,
    antialias: true,
    resizeTo: window,
    autoDensity: true
})

export const sceneManager = new SceneManager(app.stage)

export enum Key {
    UP = 'w',
    DOWN = 's',
    LEFT = 'a',
    RIGHT = 'd',
    ARROW_UP = 'ArrowUp',
    ARROW_DOWN = 'ArrowDown',
    ARROW_LEFT = 'ArrowLeft',
    ARROW_RIGHT = 'ArrowRight',
    SPACE = 'Space',
    ENTER = 'Enter'
}

export const Keyboard = new KeyboardManager(Key)