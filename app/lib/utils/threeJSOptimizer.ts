import * as THREE from "three";

export class ThreeJSOptimizer {
  private static instance: ThreeJSOptimizer;
  private performanceMode: "high" | "medium" | "low" = "high";

  static getInstance(): ThreeJSOptimizer {
    if (!ThreeJSOptimizer.instance) {
      ThreeJSOptimizer.instance = new ThreeJSOptimizer();
    }
    return ThreeJSOptimizer.instance;
  }

  setPerformanceMode(mode: "high" | "medium" | "low"): void {
    this.performanceMode = mode;
  }

  // Optimize geometry for performance
  optimizeGeometry(geometry: THREE.BufferGeometry): THREE.BufferGeometry {
    if (this.performanceMode === "low") {
      // Reduce geometry complexity for low-end devices
      geometry.computeBoundingBox();
      geometry.computeBoundingSphere();
    }
    
    return geometry;
  }

  // Create optimized material
  createOptimizedMaterial(color: number, options: any = {}): THREE.Material {
    const baseOptions = {
      color,
      ...options,
    };

    switch (this.performanceMode) {
      case "high":
        return new THREE.MeshPhongMaterial(baseOptions);
      case "medium":
        return new THREE.MeshLambertMaterial(baseOptions);
      case "low":
        return new THREE.MeshBasicMaterial(baseOptions);
    }
  }

  // Implement LOD (Level of Detail) system
  createLODObject(highDetail: THREE.Object3D, mediumDetail?: THREE.Object3D, lowDetail?: THREE.Object3D): THREE.LOD {
    const lod = new THREE.LOD();
    
    lod.addLevel(highDetail, 0);
    if (mediumDetail) lod.addLevel(mediumDetail, 50);
    if (lowDetail) lod.addLevel(lowDetail, 100);
    
    return lod;
  }

  // Frustum culling optimization
  setupFrustumCulling(camera: THREE.Camera): THREE.Frustum {
    const frustum = new THREE.Frustum();
    const matrix = new THREE.Matrix4().multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
    frustum.setFromProjectionMatrix(matrix);
    return frustum;
  }

  // Texture optimization
  optimizeTexture(texture: THREE.Texture): THREE.Texture {
    if (this.performanceMode !== "high") {
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.generateMipmaps = false;
    }
    
    return texture;
  }

  // Memory management
  disposeObject(obj: THREE.Object3D): void {
    if (obj instanceof THREE.Mesh) {
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material instanceof THREE.Material) {
        obj.material.dispose();
      }
    }
    
    obj.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        if (child.geometry) child.geometry.dispose();
        if (child.material instanceof THREE.Material) {
          child.material.dispose();
        }
      }
    });
  }
}
