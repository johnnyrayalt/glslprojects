import * as THREE from 'three';
import vsh from './shaders/vertex-shader.glsl';
import fsh from './shaders/fragment-shader.glsl';

class GLSLShaderTemplate {

    async initialize() {
        this.threejs_ = new THREE.WebGLRenderer();
        document.body.appendChild(this.threejs_.domElement);

        window.addEventListener('resize', () => {
            this.onWindowResize_();
        }, false);

        this.scene_ = new THREE.Scene();

        this.camera_ = new THREE.OrthographicCamera(0, 1, 1, 0, 0.1, 1000);
        this.camera_.position.set(0, 0, 1);

        this.setupProject_();

        this.onWindowResize_();
        this.raf_();
    }

    setupProject_() {

        const loader = new THREE.TextureLoader();
        const catImageUrl = new URL('./textures/cat.jpg', import.meta.url);
        const dittoImageUrl = new URL('./textures/ditto.png', import.meta.url);
        const diffuseTexture = loader.load(catImageUrl);
        const overlayTexture = loader.load(dittoImageUrl);

        diffuseTexture.wrapS = THREE.RepeatWrapping;
        diffuseTexture.wrapT = THREE.RepeatWrapping;

        const geometry = new THREE.PlaneGeometry(1, 1);
        
        const material = new THREE.ShaderMaterial({
            uniforms: { 
                diffuse: { 
                    value: diffuseTexture,
                },
                overlay: {
                    value: overlayTexture,
                },
                tint: {
                    value: new THREE.Vector4(1, 1, 0, 1)
                }
            },
            vertexShader: vsh,
            fragmentShader: fsh
        });

        const plane = new THREE.Mesh(geometry, material);
        plane.position.set(0.5, 0.5, 0);
        this.scene_.add(plane);
    }

    onWindowResize_() {
        this.threejs_.setSize(window.innerWidth, window.innerHeight);
    }

    raf_() {
        requestAnimationFrame((t) => {
            this.threejs_.render(this.scene_, this.camera_);
            this.raf_();
        });
    }

    imageUrlLoader(imagePath) {
        return new URL(imagePath, import.meta.url);
    }
}


let APP_ = null;

window.addEventListener('DOMContentLoaded', async () => {
    APP_ = new GLSLShaderTemplate();
    await APP_.initialize();
});