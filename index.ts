import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import dat from 'dat.gui'
import Stats from 'stats-js'

const settings = {}
const gui = new dat.GUI({ width: 300 })

const { renderer, scene, camera, controls } = init()

const particles = [
  { q: 1, pos: new THREE.Vector3(-6, 0, 0) },
  { q: 1, pos: new THREE.Vector3(-5, 0, 0) },
  { q: 1, pos: new THREE.Vector3(-4, 0, 0) },
  { q: 1, pos: new THREE.Vector3(-3, 0, 0) },
  { q: 1, pos: new THREE.Vector3(-2, 0, 0) },
  { q: 1, pos: new THREE.Vector3(-1, 0, 0) },
  { q: 1, pos: new THREE.Vector3(0, 0, 0) },
  { q: 1, pos: new THREE.Vector3(1, 0, 0) },
  { q: 1, pos: new THREE.Vector3(2, 0, 0) },
  { q: 1, pos: new THREE.Vector3(3, 0, 0) },
  { q: 1, pos: new THREE.Vector3(4, 0, 0) },
  { q: 1, pos: new THREE.Vector3(5, 0, 0) },
  { q: 1, pos: new THREE.Vector3(6, 0, 0) }
]

for (const p of particles) {
  addSphere(0.5, p.q > 0 ? 'red' : 'blue', p.pos.x, p.pos.y, p.pos.z)
}

function addField(step, range, arrowScale) {
  for (let x = -range; x < range; x += step) {
    for (let y = -range; y < range; y += step) {
      for (let z = -range; z < range; z += step) {
        const pos = new THREE.Vector3(x, y, z)
        const field = new THREE.Vector3(0, 0, 0)

        for (const p of particles) {
          const vec = computeField(p.q, p.pos, pos).multiplyScalar(arrowScale)

          field.add(vec)
        }

        addArrow(pos, field, field.length())
      }
    }
  }
}

addField(2, 10, 5)

animate()

function animate() {
  controls.update()
  renderer.render(scene, camera)
  requestAnimationFrame(animate)
}

function init() {
  const container = document.getElementById('container')

  const camera = new THREE.PerspectiveCamera(27, window.innerWidth / window.innerHeight, 5, 1000000)
  camera.position.z = 100

  const controls = new OrbitControls(camera, container)

  const scene = new THREE.Scene()
  scene.background = new THREE.Color('whitesmoke')

  const renderer = new THREE.WebGLRenderer()
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight)

  container.appendChild(renderer.domElement)

  window.addEventListener(
    'resize',
    () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    },
    false
  )

  return { renderer, scene, camera, controls }
}

function addSphere(radius, color, x, y, z) {
  const sphereMaterial = new THREE.MeshBasicMaterial({
    color
  })

  const sphere = new THREE.Mesh(new THREE.SphereGeometry(radius, 32, 32), sphereMaterial)

  sphere.position.x = x
  sphere.position.y = y
  sphere.position.z = z

  scene.add(sphere)

  return sphere
}

function addArrow(origin, direction, length) {
  const hex = 0x000000

  direction.normalize()

  const arrowHelper = new THREE.ArrowHelper(direction, origin, length, hex)
  scene.add(arrowHelper)
}

function computeField(q, x1: THREE.Vector3, x2: THREE.Vector3) {
  const field = new THREE.Vector3()

  const mag = q / x1.distanceTo(x2) ** 2
  field
    .copy(x2)
    .sub(x1)
    .normalize()
    .multiplyScalar(mag)
  return field
}
