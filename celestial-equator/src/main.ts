import * as THREE from 'three'

function whatSize() {
    var bestFit = window.innerHeight >= 1000 ? 1000 : 500
    return bestFit
}

const sizes = {
    width: whatSize(),
    height: whatSize()
}

const LATITUDE = 47 // hardcoded here; to be derived from user GPS latitude rounded down
const OBSERVER = { x: 125, y: 125 }
const NORTH_STAR = { x: 0, y: 0 }

function convertLatitude(lat) {
    return lat * Math.PI / 180
}

function rotate(angle, origin, coords) {
    angle *= -1;
    var x: number = (coords.x - origin.x) * Math.cos(angle) - (coords.y - origin.y) * Math.sin(angle);
    var y: number = (coords.x - origin.x) * Math.sin(angle) + (coords.y - origin.y) * Math.cos(angle);
    return { "x": x + origin.x * 1, "y": y + origin.y * 1 }
}

const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()


const loadingManager = new THREE.LoadingManager()
const textureLoader = new THREE.TextureLoader(loadingManager)

const earthTexture = textureLoader.load(
    '/textures/2k_earth_daymap.jpg'
)

const zodiacAlpha = textureLoader.load(
    '/textures/zodiac_alpha.png'
)

const earthGeometry = new THREE.SphereGeometry(.5, 32, 16);
const earthMaterial = new THREE.MeshBasicMaterial({ map: earthTexture })
const earthSphere = new THREE.Mesh(earthGeometry, earthMaterial);
scene.add(earthSphere);

const northStarGeometry = new THREE.OctahedronGeometry(.05, 0);
const northStarMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
const northStarSphere = new THREE.Mesh(northStarGeometry, northStarMaterial);
const northStarPosition = rotate(convertLatitude(LATITUDE), OBSERVER, NORTH_STAR)
northStarSphere.position.x = northStarPosition.x /100
northStarSphere.position.y = northStarPosition.y /100
scene.add(northStarSphere)

const celestialEqGeometry = new THREE.CylinderGeometry(1, 1, .55, 32);
const celestialEqMaterial = new THREE.MeshBasicMaterial();
celestialEqMaterial.transparent = true
celestialEqMaterial.alphaMap = zodiacAlpha
const celestialEqMesh = new THREE.Mesh(celestialEqGeometry, celestialEqMaterial);
const celestialEqPosition = rotate(convertLatitude(90), NORTH_STAR,  northStarPosition)
console.log(celestialEqPosition.y, northStarPosition)
// celestialEqMesh.rotation.y = 0
// celestialEqMesh.rotation.x = 0
celestialEqMesh.rotation.z = celestialEqPosition.y/100
scene.add(celestialEqMesh)

window.addEventListener('resize', () => {
    var norm = whatSize()
    sizes.width = norm
    sizes.height = norm

    camera.aspect = norm / norm
 
    camera.updateProjectionMatrix()
    renderer.setSize(sizes.width, sizes.height)

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 0
camera.position.z = (sizes.height/2.5)/100
scene.add(camera)


const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


const tick = () => {
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}

tick()