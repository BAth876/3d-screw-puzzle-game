import { Object3D, Mesh, Group, Material, Geometry } from 'three'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      // HTML elements
      div: any
      button: any
      h2: any
      p: any
      text: any
      canvas: any
      
      // Three.js elements
      mesh: any
      group: any
      primitive: any
      points: any
      lineSegments: any
      line: any
      point: any
      ambientLight: any
      directionalLight: any
      hemisphereLight: any
      spotLight: any
      pointLight: any
      rectAreaLight: any
      cylinderGeometry: any
      boxGeometry: any
      planeGeometry: any
      sphereGeometry: any
      meshStandardMaterial: any
      meshBasicMaterial: any
      canvasTexture: any
    }
  }
}

declare module '@react-three/fiber' {
  interface ThreeElements {
    mesh: JSX.IntrinsicElements['mesh']
    group: JSX.IntrinsicElements['group']
    primitive: JSX.IntrinsicElements['primitive']
    points: JSX.IntrinsicElements['points']
    lineSegments: JSX.IntrinsicElements['lineSegments']
    line: JSX.IntrinsicElements['line']
    point: JSX.IntrinsicElements['point']
    ambientLight: JSX.IntrinsicElements['ambientLight']
    directionalLight: JSX.IntrinsicElements['directionalLight']
    hemisphereLight: JSX.IntrinsicElements['hemisphereLight']
    spotLight: JSX.IntrinsicElements['spotLight']
    pointLight: JSX.IntrinsicElements['pointLight']
    rectAreaLight: JSX.IntrinsicElements['rectAreaLight']
    cylinderGeometry: JSX.IntrinsicElements['cylinderGeometry']
    boxGeometry: JSX.IntrinsicElements['boxGeometry']
    planeGeometry: JSX.IntrinsicElements['planeGeometry']
    sphereGeometry: JSX.IntrinsicElements['sphereGeometry']
    meshStandardMaterial: JSX.IntrinsicElements['meshStandardMaterial']
    meshBasicMaterial: JSX.IntrinsicElements['meshBasicMaterial']
    canvasTexture: JSX.IntrinsicElements['canvasTexture']
  }
} 