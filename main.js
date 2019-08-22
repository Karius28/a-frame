window.onload = function () {
    // Vueとinspectorの相性が悪いみたい
    // Vueと何らかの要素がリンクしているとinspectorでの視点移動ができなくなる
    // さらに恐らくVueとリンクすると謎の要素が追加されているみたい
    const app = new Vue({
        // el: '#scene',
        data: {
            cameraPosition: '',
            grip: false,
            selectedEl: null,
        },
        created() {
            const vue = this;
            // これ用途によって作って色々できそう
            // ここからvueに値投げたりできるし
            AFRAME.registerComponent('input-listener', {
                dependencies: ['raycaster'],
                init() {
                    const listener = this;
                    this.el.addEventListener('triggerdown', function (e) {
                        // vue.cannonBall(listener.el);
                        //コントローラの位置を取得(thisはコントローラ)
                    var point = this.object3D.getWorldPosition();
                    //ボールを生成
                    var ball = document.createElement('a-sphere');
                    ball.setAttribute('class', 'ball');
                    ball.setAttribute('scale', '0.2 0.2 0.2');
                    ball.setAttribute('position', point);
                    //dynamic-bodyを設定することで物理演算をさせる
                    ball.setAttribute('dynamic-body', 'shape: sphere; sphereRadius:0.2; ');
                    //コントローラのレイキャスターの向きを取得
                    var dir = this.getAttribute("raycaster").direction;
                    //球を発射するときの向きと大きさを設定(好みに応じて変更) 
                    var force = new THREE.Vector3(dir.x, dir.y, dir.z);
                    force.multiplyScalar(2000);
                    //レイキャスターの向きはコントローラを原点としたローカル座標系なのでワールド座標に変換                   
                    ball.force = this.object3D.localToWorld(force);
                    //上記の設定を済ませた球をシーンに登場させる
                    var scene = document.querySelector('a-scene');
                    scene.appendChild(ball);
                    //物理関係の設定が済んだタイミングで球を飛ばす 
                    ball.addEventListener('body-loaded', function (e) {
                        //ボールの位置を取得(ここでのthisはballを示す)
                        var p = this.object3D.position;
                        //加える力は先ほど計算したものを使用
                        var f = this.force;
                        //球に力を加えて飛ばす
                        this.body.applyForce(
                            new CANNON.Vec3(f.x, f.y, f.z),
                            new CANNON.Vec3(p.x, p.y, p.z)
                        );
                    });
                    });
                    document.addEventListener('mousedown',() => {
                        // 玉を投げる
                        // vue.cannonBall(listener.el);
                        // テレポートする
                        // listener.el.emit('teleportstart');
                        // 物をつかむ
                        // vue.grip = true;
                    });
                    document.addEventListener('mouseup',() => {
                        // テレポートする
                        // listener.el.emit('teleportend');
                        // 物をつかむ
                        // vue.grip = false;
                    });
                    // this.el.addEventListener('raycaster-intersection',evt => {
                    // });
                    // this.el.addEventListener('raycaster-intersection-cleared',evt => {
                    // });
                },
                tick(time,timeDelta) {
                    // const camera = document.querySelector("#camera");
                    // let p = camera.object3D.getWorldPosition(new THREE.Vector3);
                    // const rate = 100;
                    // p.x = Math.round(p.x * rate) / rate;
                    // p.y = Math.round(p.y * rate) / rate;
                    // p.z = Math.round(p.z * rate) / rate;
                    // vue.cameraPosition = `x:${p.x} y:${p.y} z:${p.z}`;
                    // 単位はms
                    // console.log(time / 1000,timeDelta);
                }
            });
            AFRAME.registerComponent('get-listener', {
                init() {
                    this.el.addEventListener('raycaster-intersected', evt => {
                        this.raycaster = evt.detail.el;
                    });
                    this.el.addEventListener('raycaster-intersected-cleared', evt => {
                        this.raycaster = null;
                    });
                },
                tick() {
                    if (!vue.grip) return;
                    if (!this.raycaster) return;

                    // 掴むというよりは押すような動作になってしまったやつ
                    // let ray = new THREE.Vector3();
                    // this.raycaster.object3D.getWorldDirection(ray).negate();
                    // let p = new THREE.Vector3(ray.x, ray.y, ray.z);
                    // p.normalize();
                    // p.multiplyScalar(0.5);
                    // this.el.object3D.localToWorld(p);
                    // this.el.object3D.position.set(p.x, p.y, p.z);

                    // 掴む処理 掴む元の座標に掴む元の方向を足す
                    let ray = new THREE.Vector3();
                    this.raycaster.object3D.getWorldDirection(ray);
                    ray.normalize();
                    ray.multiplyScalar(1.3);
                    ray.negate();
                    let p = this.raycaster.object3D.getWorldPosition(new THREE.Vector3);
                    let pos = new THREE.Vector3();
                    pos.addVectors(p,ray);
                    this.el.object3D.position.set(pos.x, pos.y, pos.z);
                }
            });
        },
        mounted() {
        },
        methods: {
            cannonBall(raycaster) {
                const scene = document.querySelector('a-scene');
                const position = raycaster.object3D.getWorldPosition(new THREE.Vector3);
                // // カメラ方向の取得
                // let rocation = new THREE.Vector3;
                // getWorldDirectionの引数に入れると代入してくれる
                // raycaster.object3D.getWorldDirection(rocation).negate();
                // 射出するボールの設定
                let ball = document.createElement('a-sphere');
                ball.setAttribute('class', 'ball');
                ball.setAttribute('scale', '0.2 0.2 0.2');
                ball.setAttribute('position', position);
                ball.setAttribute('color', '#000');
                // dynamic-bodyを設定することで物理演算をさせる
                ball.setAttribute('dynamic-body', 'shape: sphere; sphereRadius:0.2; ');
                // 球を発射するときの向きと大きさを設定(好みに応じて変更)
                let dir = this.getAttribute("raycaster").direction;
                let force = new THREE.Vector3(dir.x,dir.y,dir.z);
                force.multiplyScalar(3000);
                // 代入
                ball.force = this.object3D.localToWorld(force);
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
        }
    });
};
