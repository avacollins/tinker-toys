import * as THREE from 'three'

type Config = {
  [key: string]: number
}

const BOUNDS = {
  width: 1000,
  height: 1000
}
const LATITUDE = 47 // hardcoded here; to be derived from user GPS latitude rounded down
const EQUATOR = LATITUDE + 90
const CAMERA = { x: 0, y: 0, z: BOUNDS.width / 2 }
const EARTH = { x: BOUNDS.width / 4, y: BOUNDS.height / 4 }
const NORTH_STAR = { x: 0, y: 0 }

function convertLatitude(lat) {
  return lat * Math.PI / 180
}

function rotate(angle) {
  var origin: Config = EARTH
  var coords: Config = NORTH_STAR
  angle *= -1;

  var x: number = (coords.x - origin.x) * Math.cos(angle) - (coords.y - origin.y) * Math.sin(angle);
  var y: number = (coords.x - origin.x) * Math.sin(angle) + (coords.y - origin.y) * Math.cos(angle);
  return { "x": x + origin.x * 1, "y": y + origin.y * 1}
}


// Scene
const canvas = document.querySelector('canvas.webgl')
const scene = new THREE.Scene()

const earthGeometry = new THREE.SphereGeometry(60, 32, 16);
const earthMaterial = new THREE.MeshBasicMaterial({ color: 0x333cff });
const earthSphere = new THREE.Mesh(earthGeometry, earthMaterial);
scene.add(earthSphere);


const northStarGeometry = new THREE.OctahedronGeometry(8, 0);
const northStarMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff});
const northStarSphere = new THREE.Mesh(northStarGeometry, northStarMaterial);
const northStarPosition = rotate(convertLatitude(LATITUDE))
northStarSphere.position.x = northStarPosition.x
northStarSphere.position.y = northStarPosition.y
scene.add(northStarSphere)

const celestialEqGeometry = new THREE.CylinderGeometry(100, 100, 50, 32);
const celestialEqMaterial = new THREE.MeshBasicMaterial({ color: 0x0ff000 });
const celestialEqMesh = new THREE.Mesh(celestialEqGeometry, celestialEqMaterial);
const celestialEqPosition = rotate(convertLatitude(EQUATOR))
celestialEqMesh.rotation.z = Math.floor(celestialEqPosition.x) // angle of equator from latitude
scene.add(celestialEqMesh)

// Camera
const camera = new THREE.PerspectiveCamera(75, BOUNDS.width / BOUNDS.height)
camera.position.z = CAMERA.z
camera.position.y = CAMERA.y
scene.add(camera)

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas
})
renderer.setSize(BOUNDS.width, BOUNDS.height)
renderer.render(scene, camera)