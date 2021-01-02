import { app, sceneManager } from './app'
import { MenuScene } from './scenes/menu';
import { SplashScene } from './scenes/splash'
import pkg from '../package.json'
import { GameScene } from './scenes/game';

document.body.appendChild(app.view)

// @ts-ignore
WebFont.load({
    google: {
        families: ['Press Start 2P']
    },
    active() {
        sceneManager.replace(
            new SplashScene({
                title: pkg.displayName,
                subtitle: 'Carregando....',
                assets: {
                    maps: 'static/maps/index.json',
                    tank: 'static/spritesheets/tank.json'
                },
                onLoaded: () => sceneManager.replace(
                    new MenuScene({
                        title: pkg.displayName,
                        subtitle: `v${pkg.version}`,
                        options: [
                            {
                                text: 'Novo Jogo',
                                handler: selectMap
                            }
                        ]
                    })
                )
            }),
        )
    }
});

function loadMap(item: any) {
    return () => sceneManager.replace(
        new SplashScene({
            title: pkg.displayName,
            subtitle: 'Carregando mapa...',
            assets: {
                [`${item.id}_map`]: item.source
            },
            onLoaded: startMap(item)
        })
    )
}

function startMap(item) {
    return () => sceneManager.replace(
        new GameScene({
            map: `${item.id}_map`
        })
    )
}

function selectMap() {
    sceneManager.replace(
        new MenuScene({
            title: pkg.displayName,
            subtitle: 'Escolha um mapa: ',
            options: app.loader.resources.maps.data.map((item) => ({
                text: item.title,
                handler: loadMap(item)
            }))
        })
    )
}