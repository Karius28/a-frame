
const cannonBall = () => {
    const camera = document.querySelector("#camera");
    const scene = document.querySelector('a-scene');
    const position = camera.object3D.getWorldPosition(new THREE.Vector3);
    // カメラ方向の取得
    let rocation = new THREE.Vector3;
    // getWorldDirectionの引数に入れると代入してくれる
    camera.object3D.getWorldDirection(rocation).negate();
    // 射出するボールの設定
    let ball = document.createElement('a-sphere');
    ball.setAttribute('class', 'ball');
    ball.setAttribute('scale', '0.2 0.2 0.2');
    ball.setAttribute('position', position);
    ball.setAttribute('color', '#000');
    // dynamic-bodyを設定することで物理演算をさせる
    ball.setAttribute('dynamic-body', 'shape: sphere; sphereRadius:0.2; ');
    // 球を発射するときの向きと大きさを設定(好みに応じて変更)
    let force = new THREE.Vector3(rocation.x,rocation.y,rocation.z);
    force.multiplyScalar(3000);
    // 代入
    ball.force = force;
    // 上記の設定を済ませた球をシーンに登場させる
    scene.appendChild(ball);
    // 物理関係の設定が済んだタイミングで球を飛ばす
    ball.addEventListener('body-loaded', function (e) {
        // ボールの位置を取得(ここでのthisはballを示す)
        let p = this.object3D.position;
        // 加える力は先ほど計算したものを使用
        let f = this.force;
        // 球に力を加えて飛ばす
        this.body.applyForce(
            new CANNON.Vec3(f.x, f.y, f.z),
            new CANNON.Vec3(p.x, p.y, p.z)
        );
    });
}

AFRAME.registerComponent('input-listener', {
    dependencies: ['raycaster'],
    init() {
        const listener = this;
        document.addEventListener('mousedown',() => {
            // cannonBall();
            // listener.el.emit('teleportstart');
        });
        document.addEventListener('mouseup',() => {
            // listener.el.emit('teleportend');
        });
        this.el.addEventListener('raycaster-intersection',(e) => {
            console.log(e);
        });
        this.el.addEventListener('raycaster-intersection-cleared',(e) => {
            console.log(e);
        });
    },
    update() {
    },
    tick(time,timeDelta) {
        const camera = document.querySelector("#camera");
        let p = camera.object3D.getWorldPosition(new THREE.Vector3);
        const rate = 100;
        p.x = Math.round(p.x * rate) / rate;
        p.y = Math.round(p.y * rate) / rate;
        p.z = Math.round(p.z * rate) / rate;
        // 単位はms
        // console.log(time / 1000,timeDelta);
    }
});

window.onload = function () {

};
