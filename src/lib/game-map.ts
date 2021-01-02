import { Container, Graphics, Sprite, TilingSprite } from "pixi.js";
import { app } from "../app";

export enum TileType {
    NULL = 0,
    BUILD = 1,
    TERRAIN = 2,
    WATER = 3,
    TREE = 4,
}

export interface IGameMapTile {
    texture: string;
    x: number;
    y: number;
    w: number;
    h: number;
}

export interface IGameMapData {
    name: string;
    width: number;
    height: number;
    assets: Record<string, string>;
    textures: Record<string, string>;
    groups: Record<string, any>;
    map: IGameMapTile[];
}

export class GameMap extends Container {
    constructor(public data: IGameMapData) {
        super();
    }

    parseValue(value: number | string, refValue: number) {
        if (typeof value === 'string' && value.endsWith('%')) {
            value = Number(value.substring(0, value.length - 1)) / 100
            return refValue * value
        }

        return Number(value)
    }

    getSprite(tile: IGameMapTile) {
        const [spritesheet, textureName] = this.data.textures[tile.texture].split(/\/+/)
        const texture = app.loader.resources[spritesheet].textures[textureName]
        const x = this.parseValue(tile.x, this.data.width);
        const y = this.parseValue(tile.y, this.data.height);
        const w = this.parseValue(tile.w, this.data.height);
        const h = this.parseValue(tile.h, this.data.height);

        let sprite = (Number.isFinite(w) && Number.isFinite(h))
            ? new TilingSprite(texture, w, h)
            : new Sprite(texture)

        sprite.position.set(x, y)

        return sprite
    }

    load() {
        return new Promise((resolve) => {
            for (const [name, url] of Object.entries(this.data.assets)) {
                app.loader.add(name, url)
            }

            app.loader.load(() => {
                this.data.map.forEach((tile) => {
                    const sprite = this.getSprite(tile)

                    this.addChild(sprite)
                });

                resolve(undefined)
            })
        })
    }
}
